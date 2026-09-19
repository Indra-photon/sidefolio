import { postMarkdown, postUrl } from "@/lib/blog/markdown";
import { availablePosts, findPost, isPostAvailable } from "@/lib/blog/posts";

// Reached via `<post href>.md` or `Accept: text/markdown` (see src/proxy.ts).

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return availablePosts().map((post) => ({ path: [...post.categoryPath, post.slug] }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const post = findPost(path);
  if (!post || !isPostAvailable(post)) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(postMarkdown(post), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      link: `<${postUrl(post)}>; rel="canonical"`,
      vary: "Accept",
    },
  });
}
