import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { findCategory } from "@/lib/blog/categories";
import { availablePosts } from "@/lib/blog/posts";
import { BLOG_BASE } from "@/lib/blog/site";

import {
  HairlineGridEyebrow as Eyebrow,
  HairlineGridSection as Section,
} from "./HairlineGrid";
import { Heading, Text } from "./Typography";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${d.getDate()}, ${String(d.getFullYear()).slice(-2)}`;
}

/**
 * Featured article row. Server component: reads the MDX collection at build,
 * so there is no client fetch and the row is part of the static page.
 * Picks the newest post flagged `featured`, falling back to the newest post.
 */
export function HomeBlog({ index, total }: { index?: number; total?: number }) {
  const posts = availablePosts().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const blog = posts.find((p) => p.featured) ?? posts[0];
  if (!blog) return null;

  const category = findCategory(blog.categoryPath);

  return (
    <Section index={index} total={total} id="writing">
      <div className="flex items-end justify-between px-6 py-8 lg:px-10">
        <div>
          <Eyebrow>Writing</Eyebrow>
          <Heading variant="h2" className="mt-5">
            Latest article
          </Heading>
        </div>
        <Link href={BLOG_BASE} className="group">
          <Text variant="labelSm" className="transition-colors group-hover:text-foreground">
            View all →
          </Text>
        </Link>
      </div>

      <div className="hairline-t">
        <Link
          href={blog.href}
          className="group flex items-center justify-between gap-6 px-6 py-6 transition-colors hover:bg-accent/40 lg:px-10"
        >
          <div className="min-w-0">
            {category && <Text variant="labelSm">{category.name}</Text>}
            <Text variant="cardHeader" className="mt-1 truncate">
              {blog.title}
            </Text>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <Text as="time" variant="labelSm" className="tabular-nums">
              {formatDate(blog.publishedAt)}
            </Text>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
        </Link>
      </div>
    </Section>
  );
}
