"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { HairlineGrid } from "./HairlineGrid";
import { Heading, Text } from "./Typography";

type FeaturedBlog = {
  title: string;
  slug: string;
  publishedAt?: string;
  createdAt: string;
  categoryId: { slug: string; name?: string };
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${d.getDate()}, ${String(d.getFullYear()).slice(-2)}`;
}

/** Featured article row. Fetches client-side like the previous FeaturedBlog. */
export function HomeBlog({ index, total }: { index?: number; total?: number }) {
  const [blog, setBlog] = useState<FeaturedBlog | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/get-all-blogs?isFeatured=true&isPublished=true&limit=1")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.success && data.blogs.length > 0) setBlog(data.blogs[0]);
      })
      .catch((err) => console.error("Error loading featured blog:", err))
      .finally(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the grid stable: render nothing until we know, then hide if empty.
  if (loaded && !blog) return null;

  const url = blog ? `/blog/${blog.categoryId.slug}/${blog.slug}` : "#";

  return (
    <HairlineGrid.Section index={index} total={total} id="writing">
      <div className="flex items-end justify-between px-6 py-8 lg:px-10">
        <div>
          <HairlineGrid.Eyebrow>Writing</HairlineGrid.Eyebrow>
          <Heading variant="h2" className="mt-5">
            Latest article
          </Heading>
        </div>
        <Link href="/blog" className="group">
          <Text variant="labelSm" className="transition-colors group-hover:text-foreground">
            View all →
          </Text>
        </Link>
      </div>

      <div className="hairline-t">
        {blog ? (
          <Link
            href={url}
            onClick={() => {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: "blog_click",
                article_url: url,
                article_title: blog.title,
              });
            }}
            className="group flex items-center justify-between gap-6 px-6 py-6 transition-colors hover:bg-accent/40 lg:px-10"
          >
            <div className="min-w-0">
              {blog.categoryId.name && (
                <Text variant="labelSm">{blog.categoryId.name}</Text>
              )}
              <Text variant="cardHeader" className="mt-1 truncate">{blog.title}</Text>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Text as="time" variant="labelSm" className="tabular-nums">
                {formatDate(blog.publishedAt || blog.createdAt)}
              </Text>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
          </Link>
        ) : (
          // Skeleton while loading
          <div className="flex items-center justify-between px-6 py-6 lg:px-10" aria-hidden>
            <div className="h-5 w-2/3 animate-pulse bg-muted" />
            <div className="h-4 w-20 animate-pulse bg-muted" />
          </div>
        )}
      </div>
    </HairlineGrid.Section>
  );
}
