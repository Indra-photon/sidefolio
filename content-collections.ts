import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

import { isCategoryPath } from "./src/lib/blog/categories";
import { rehypeSyntaxHighlight } from "./src/lib/blog/rehype-syntax-highlight";
import { BLOG_BASE } from "./src/lib/blog/site";

type ResourceInput = {
  url: string;
  title: string | null;
  description: string | null;
};

export type Resource = {
  url: string;
  domain: string;
  title: string;
  description?: string;
};

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .trim();
}

function extractMeta(html: string, property: string) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1]);
  }
  return undefined;
}

// MDX strips leading whitespace from lines inside flow JSX, which dedents the
// `code` template literals passed to <CodeBlock>. Escaping those spaces as
// `\x20` hides them from the markdown parser while JS still reads spaces.
function preserveCodeIndentation<T extends { content: string }>(document: T): T {
  const content = document.content.replace(
    /(\bcode:\s*`)((?:\\[\s\S]|[^`\\])*)`/g,
    (_, open: string, body: string) =>
      `${open}${body.replace(/\n( +)/g, (_m, spaces: string) => `\n${"\\x20".repeat(spaces.length)}`)}\``,
  );
  return { ...document, content };
}

// Fetches a resource's title/description at build time. Manual frontmatter
// values always win; network failures fall back to the bare domain, so an
// offline build or dead link never breaks anything.
async function resolveResource(input: ResourceInput): Promise<Resource> {
  const domain = new URL(input.url).hostname.replace(/^www\./, "");
  let title = input.title ?? undefined;
  let description = input.description ?? undefined;

  if (!title || !description) {
    try {
      const res = await fetch(input.url, {
        signal: AbortSignal.timeout(8000),
        headers: { "user-agent": "indrabuildswebsites.com resource resolver" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = (await res.text()).slice(0, 200_000);
      if (!title) {
        const tag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
        title = extractMeta(html, "og:title") ?? (tag ? decodeEntities(tag) : undefined);
      }
      if (!description) {
        description =
          extractMeta(html, "og:description") ?? extractMeta(html, "description");
      }
    } catch {
      // Unreachable at build time — fall through to domain fallback.
    }
  }

  return {
    url: input.url,
    domain,
    title: (title ?? domain).replace(/\s+/g, " ").trim(),
    description: description?.replace(/\s+/g, " ").trim(),
  };
}

// Rough words-per-minute estimate over the raw MDX (JSX tags stripped).
function readingTimeMinutes(content: string) {
  const words = content
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const posts = defineCollection({
  name: "posts",
  directory: "content/blog",
  include: "**/*.mdx",
  schema: z.object({
    content: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    /** R2 media key (from `npm run media:upload`) or absolute URL; used for OG. */
    thumbnail: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    resources: z
      .array(
        z.object({
          url: z.string().url(),
          title: z.string().optional(),
          description: z.string().optional(),
        }),
      )
      .default([]),
  }),
  transform: async (document, context) => {
    // content/blog/motion/springs/foo.mdx → categoryPath ["motion","springs"]
    const categoryPath = document._meta.directory
      .split(/[\\/]/)
      .filter((segment) => segment && segment !== ".");
    if (categoryPath.length === 0 || !isCategoryPath(categoryPath)) {
      throw new Error(
        `Post "${document._meta.filePath}" sits in a folder that is not a category in src/lib/blog/categories.ts (got "${categoryPath.join("/")}").`,
      );
    }

    const mdx = await compileMDX(context, preserveCodeIndentation(document), {
      rehypePlugins: [rehypeSyntaxHighlight],
    });
    const slug = document._meta.fileName.replace(/\.mdx$/, "");
    const resources = await Promise.all(
      document.resources.map((resource) =>
        context.cache(
          {
            url: resource.url,
            title: resource.title ?? null,
            description: resource.description ?? null,
          },
          resolveResource,
        ),
      ),
    );

    return {
      ...document,
      slug,
      categoryPath,
      href: `${BLOG_BASE}/${[...categoryPath, slug].join("/")}`,
      sourcePath: document._meta.filePath,
      readingTime: readingTimeMinutes(document.content),
      resources,
      mdx,
    };
  },
});

export default defineConfig({
  content: [posts],
});
