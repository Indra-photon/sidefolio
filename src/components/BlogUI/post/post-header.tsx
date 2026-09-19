import Link from "next/link";
import type { Post } from "content-collections";

import { findCategory } from "@/lib/blog/categories";
import { categoryHref } from "@/lib/blog/posts";
import { BLOG_BASE } from "@/lib/blog/site";
import { Text } from "@/components/UINewBlocks/Typography";
import { cn } from "@/lib/utils";

import { CategoryIcon } from "../shell/category-icon";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Breadcrumb of the category path, then the title and meta line. */
export function PostHeader({ post, className }: { post: Post; className?: string }) {
  const crumbs = post.categoryPath.map((_, i) => post.categoryPath.slice(0, i + 1));
  const root = findCategory(post.categoryPath.slice(0, 1));

  return (
    <header className={cn("flex flex-col gap-4", className)}>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <li>
            <Link href={BLOG_BASE} className="transition-colors hover:text-foreground">
              Index
            </Link>
          </li>
          {crumbs.map((path, i) => {
            const category = findCategory(path);
            if (!category) return null;
            return (
              <li key={path.join("/")} className="flex items-center gap-1.5">
                <span aria-hidden="true">/</span>
                <Link
                  href={categoryHref(path)}
                  className="flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  {i === 0 && root && (
                    <CategoryIcon slug={root.slug} color={root.color} className="size-3" />
                  )}
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
      <h1 className="text-card-header text-balance font-medium text-foreground">
        {post.title}
      </h1>
      <Text variant="labelSm" as="p">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden="true"> · </span>
        {post.readingTime} min read
      </Text>
    </header>
  );
}
