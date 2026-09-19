import { postMarkdown } from "@/lib/blog/markdown";
import { availablePosts } from "@/lib/blog/posts";
import { BLOG_DESCRIPTION, BLOG_NAME } from "@/lib/blog/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${BLOG_NAME}`,
    "",
    `> ${BLOG_DESCRIPTION}`,
    "",
    ...availablePosts().map((post) => `---\n\n${postMarkdown(post)}`),
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
