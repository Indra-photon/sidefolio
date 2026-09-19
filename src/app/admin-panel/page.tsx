import { ArrowUpRight, PenLine } from "lucide-react";
import Link from "next/link";
import { allPosts } from "content-collections";

import { Text } from "@/components/UINewBlocks/Typography";
import { CATEGORY_TREE, findCategory } from "@/lib/blog/categories";
import { postId } from "@/lib/blog/posts";
import { BLOG_BASE } from "@/lib/blog/site";
import { cn } from "@/lib/utils";

// Keystatic's editor URLs: /keystatic/collection/<top-level category>/item/<file slug>
// where <file slug> is the file path below that folder (usually just the slug;
// hand-made nested folders give "sub/slug", encoded as one segment).
function editHref(post: (typeof allPosts)[number]) {
  const [collection, ...file] = post.sourcePath.replace(/\.mdx$/, "").split("/");
  return `/keystatic/collection/${collection}/item/${encodeURIComponent(file.join("/"))}`;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 px-6 py-5">
      <Text variant="labelSm">{label}</Text>
      <span className="text-card-header font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const isDev = process.env.NODE_ENV === "development";
  const posts = [...allPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <header className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-card-header font-medium text-foreground">Dashboard</h1>
          <Text variant="body" className="mt-1">
            Posts live as MDX files in <code className="font-mono text-xs">content/blog/</code>; the
            editor writes them for you.
          </Text>
        </div>
        {isDev ? (
          <div className="flex items-center gap-2">
            <Link
              href="/keystatic/singleton/categories"
              className="inline-flex h-9 items-center rounded-md px-3 text-sm text-foreground shadow-border transition-colors hover:bg-muted"
            >
              Categories
            </Link>
            <Link
              href="/admin-panel/new"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <PenLine className="size-4" aria-hidden="true" />
              New post
            </Link>
          </div>
        ) : (
          <Text variant="labelSm">Editor available on localhost only</Text>
        )}
      </header>

      <section className="grid grid-cols-3 rounded-xl bg-card shadow-border hairline-divide-x">
        <Stat label="Posts" value={posts.length} />
        <Stat label="Published" value={published.length} />
        <Stat label="Drafts" value={drafts.length} />
      </section>

      <section>
        <div className="flex items-center justify-between pb-3 hairline-b">
          <Text variant="labelSm">New post in…</Text>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORY_TREE.map((category) => (
            <Link
              key={category.slug}
              href={isDev ? `/admin-panel/new?category=${category.slug}` : "#"}
              aria-disabled={!isDev}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs text-foreground shadow-border transition-colors hover:bg-muted",
                !isDev && "pointer-events-none opacity-50",
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between pb-3 hairline-b">
          <Text variant="labelSm">All posts</Text>
          <Link href={BLOG_BASE} className="group inline-flex items-center gap-1">
            <Text variant="labelSm" className="transition-colors group-hover:text-foreground">
              View blog
            </Text>
            <ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </Link>
        </div>
        {posts.length === 0 ? (
          <Text variant="body" className="py-6">
            No posts yet.
          </Text>
        ) : (
          <ul className="hairline-divide-y">
            {posts.map((post) => {
              const category = findCategory(post.categoryPath);
              return (
                <li key={postId(post)}>
                  <Link
                    href={isDev ? editHref(post) : post.href}
                    className="group flex items-center justify-between gap-6 py-3.5 transition-colors hover:bg-accent/40"
                  >
                    <div className="min-w-0">
                      <Text variant="labelSm">{category?.name ?? post.categoryPath.join(" / ")}</Text>
                      <p className="mt-0.5 truncate text-sm text-foreground">{post.title}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <Text as="time" variant="labelSm" className="tabular-nums">
                        {post.publishedAt}
                      </Text>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider shadow-border",
                          post.published ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                        )}
                      >
                        {post.published ? "Live" : "Draft"}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
