import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import { PostToolbar } from "@/components/BlogUI/post/post-toolbar";
import { BlogShell } from "@/components/BlogUI/shell/blog-shell";
import { availablePosts, buildNavTree } from "@/lib/blog/posts";
import { BLOG_BASE, BLOG_DESCRIPTION, BLOG_NAME } from "@/lib/blog/site";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: BLOG_NAME, template: `%s • ${BLOG_NAME}` },
  description: BLOG_DESCRIPTION,
  alternates: { canonical: BLOG_BASE },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  // Serialisable nav rows only cross into the client sidebar.
  const tree = buildNavTree();
  // href → content file path, for the toolbar's post-only actions.
  const sourcePaths = Object.fromEntries(
    availablePosts().map((post) => [post.href, post.sourcePath]),
  );
  return (
    <BlogShell
      tree={tree}
      toolbar={<PostToolbar sourcePaths={sourcePaths} />}
      className={geistMono.variable}
    >
      {children}
    </BlogShell>
  );
}
