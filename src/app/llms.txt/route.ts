import { CATEGORY_TREE, type CategoryNode } from "@/lib/blog/categories";
import { availablePosts } from "@/lib/blog/posts";
import { BLOG_DESCRIPTION, BLOG_NAME, SITE_URL } from "@/lib/blog/site";

export const dynamic = "force-static";

export function GET() {
  const posts = availablePosts();
  const lines: string[] = [
    `# ${BLOG_NAME}`,
    "",
    `> ${BLOG_DESCRIPTION} Written by Indranil Maiti.`,
    "",
    `Every post is available as Markdown by appending \`.md\` to its URL (links below already do). The full text of every post in one file is at ${SITE_URL}/llms-full.txt.`,
    "",
  ];

  const postsIn = (node: CategoryNode) =>
    posts.filter((p) => p.categoryPath.join("/") === node.path.join("/"));
  const hasContent = (node: CategoryNode): boolean =>
    postsIn(node).length > 0 || (node.children as CategoryNode[]).some(hasContent);

  const walk = (node: CategoryNode, depth: number) => {
    if (!hasContent(node)) return;
    lines.push(`${"#".repeat(Math.min(depth + 2, 6))} ${node.name}`, "");
    const own = postsIn(node);
    for (const post of own) {
      lines.push(`- [${post.title}](${SITE_URL}${post.href}.md): ${post.description}`);
    }
    if (own.length) lines.push("");
    (node.children as CategoryNode[]).forEach((child) => walk(child, depth + 1));
  };
  CATEGORY_TREE.forEach((node) => walk(node, 0));

  lines.push("## Agents", "", `- [llms-full.txt](${SITE_URL}/llms-full.txt): Every post in full, in one Markdown file.`, "");

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
