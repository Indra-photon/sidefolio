import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Text } from "@/components/UINewBlocks/Typography";
import { cn } from "@/lib/utils";

export type PostRowData = {
  title: string;
  description: string;
  href: string;
  publishedAt: string;
  readingTime: number;
  available: boolean;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${d.getDate()}, ${String(d.getFullYear()).slice(-2)}`;
}

/** One post as a hairline-divided row, matching the home "Writing" block. */
export function PostRow({ post, className }: { post: PostRowData; className?: string }) {
  const inner = (
    <>
      <div className="min-w-0">
        <Text variant="cardHeader" className="truncate text-[15px]">
          {post.title}
        </Text>
        <Text variant="cardDescription" className="mt-1 line-clamp-2">
          {post.description}
        </Text>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <Text as="time" variant="labelSm" className="tabular-nums">
          {formatDate(post.publishedAt)}
        </Text>
        <Text variant="labelSm" className="hidden tabular-nums sm:inline">
          {post.readingTime} min
        </Text>
        {post.available ? (
          <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
        ) : (
          <Text variant="labelSm">Soon</Text>
        )}
      </div>
    </>
  );

  const rowClass = cn(
    "group flex items-center justify-between gap-6 px-6 py-5 hairline-b lg:px-10",
    className,
  );

  return post.available ? (
    <Link href={post.href} className={cn(rowClass, "transition-colors hover:bg-accent/40")}>
      {inner}
    </Link>
  ) : (
    <div aria-disabled="true" title="Coming soon" className={cn(rowClass, "opacity-50 select-none")}>
      {inner}
    </div>
  );
}
