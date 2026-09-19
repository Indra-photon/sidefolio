import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategorySection } from "@/components/BlogUI/index/category-section";
import { Mdx } from "@/components/BlogUI/mdx/mdx";
import { Resources } from "@/components/BlogUI/mdx/resources";
import { PostHeader } from "@/components/BlogUI/post/post-header";
import { PostPager } from "@/components/BlogUI/post/post-pager";
import { Text } from "@/components/UINewBlocks/Typography";
import { buildRows } from "@/lib/blog/rows";
import { allStaticPaths, getPrevNext, resolvePath } from "@/lib/blog/posts";
import { absoluteMediaUrl } from "@/lib/blog/media";
import { AUTHOR, BLOG_NAME, SITE_URL } from "@/lib/blog/site";

type Props = { params: Promise<{ path: string[] }> };

// Every category node and every live post is prerendered; anything else is
// a 404 at build time rather than an on-demand render.
export const dynamicParams = false;

export function generateStaticParams() {
  return allStaticPaths().map((path) => ({ path }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const resolved = resolvePath(path);
  if (resolved.kind === "post") {
    const { post } = resolved;
    const ogImage = post.thumbnail
      ? absoluteMediaUrl(post.thumbnail, SITE_URL)
      : `/og/blog/${[...post.categoryPath, post.slug].join("/")}`;
    return {
      title: post.title,
      description: post.description,
      alternates: {
        canonical: post.href,
        types: { "text/markdown": `${post.href}.md` },
      },
      openGraph: {
        type: "article",
        title: post.title,
        description: post.description,
        url: post.href,
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: [AUTHOR.name],
        tags: post.tags,
        images: [ogImage],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: [ogImage],
      },
    };
  }
  if (resolved.kind === "category") {
    const { category } = resolved;
    return {
      title: category.name,
      description: category.description,
      alternates: { canonical: `${SITE_URL}${resolved.node?.href ?? ""}` },
    };
  }
  return {};
}

export default async function BlogPathPage({ params }: Props) {
  const { path } = await params;
  const resolved = resolvePath(path);

  if (resolved.kind === "category") {
    const { category, node } = resolved;
    return (
      <article>
        <h1 className="text-card-header font-medium text-foreground">{category.name}</h1>
        {category.description && (
          <Text variant="body" className="mt-3">
            {category.description}
          </Text>
        )}
        <div className="mt-10">
          {node ? (
            <CategorySection node={node} rows={buildRows()} />
          ) : (
            <Text variant="body">Nothing here yet.</Text>
          )}
        </div>
      </article>
    );
  }

  if (resolved.kind !== "post") notFound();
  const { post } = resolved;
  const { prev, next } = getPrevNext(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}${post.href}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    image: post.thumbnail
      ? absoluteMediaUrl(post.thumbnail, SITE_URL)
      : `${SITE_URL}/og/blog/${[...post.categoryPath, post.slug].join("/")}`,
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    isPartOf: { "@type": "Blog", name: BLOG_NAME, url: SITE_URL },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PostHeader post={post} />
      <div className="mt-6">
        <Mdx code={post.mdx} />
      </div>
      <Resources resources={post.resources} />
      <PostPager prev={prev} next={next} />
    </article>
  );
}
