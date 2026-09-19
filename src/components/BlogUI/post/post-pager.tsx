import Link from "next/link";

import type { NavPost } from "@/lib/blog/posts";

export function PostPager({ prev, next }: { prev?: NavPost; next?: NavPost }) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Previous and next posts"
      className="mt-16 flex items-baseline justify-between pt-6 text-xs hairline-t"
    >
      <span>
        {prev && (
          <Link href={prev.href} className="text-muted-foreground transition-colors hover:text-foreground">
            ← <span className="ml-1">{prev.title}</span>
          </Link>
        )}
      </span>
      <span>
        {next && (
          <Link href={next.href} className="text-muted-foreground transition-colors hover:text-foreground">
            <span className="mr-1">{next.title}</span> →
          </Link>
        )}
      </span>
    </nav>
  );
}
