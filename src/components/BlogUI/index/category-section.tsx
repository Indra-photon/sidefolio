import Link from "next/link";

import { HairlineGridEyebrow as Eyebrow } from "@/components/UINewBlocks/HairlineGrid";
import { Text } from "@/components/UINewBlocks/Typography";
import type { NavNode } from "@/lib/blog/posts";
import { cn } from "@/lib/utils";

import { CategoryIcon } from "../shell/category-icon";
import { PostRow, type PostRowData } from "./post-row";

const DOT_BG: Record<string, string> = {
  violet: "bg-violet-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  cyan: "bg-cyan-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  rose: "bg-rose-500",
};

/**
 * One category (any depth): an eyebrow header row, its posts as hairline
 * rows, then children recursively. Rows bleed to the column edges so their
 * rules meet the rails, like every other HairlineGrid section.
 */
export function CategorySection({
  node,
  rows,
  className,
}: {
  node: NavNode;
  /** Row data keyed by post href (built once on the server by the page). */
  rows: Map<string, PostRowData>;
  className?: string;
}) {
  const top = node.depth === 0;
  return (
    <section className={cn("-mx-6 lg:-mx-10", className)}>
      <div className="flex items-center justify-between gap-6 px-6 py-5 hairline-b lg:px-10">
        <Link href={node.href} className="group inline-flex items-center gap-3">
          {top ? (
            <Eyebrow dotClassName={DOT_BG[node.color]}>{node.name}</Eyebrow>
          ) : (
            <Text
              variant="labelSm"
              className="inline-flex items-center gap-2 text-foreground transition-colors group-hover:text-muted-foreground"
              style={{ paddingLeft: `${(node.depth - 1) * 1}rem` }}
            >
              <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", DOT_BG[node.color])} />
              {node.name}
            </Text>
          )}
        </Link>
        {top && (
          <CategoryIcon slug={node.slug} color={node.color} className="size-4" />
        )}
      </div>

      {node.posts.map((post) => {
        const row = rows.get(post.href);
        return row ? <PostRow key={post.href} post={row} /> : null;
      })}

      {node.children.map((child) => (
        <CategorySection key={child.href} node={child} rows={rows} className="mx-0 lg:mx-0" />
      ))}
    </section>
  );
}
