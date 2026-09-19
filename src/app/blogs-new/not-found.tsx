import Link from "next/link";

import { Text } from "@/components/UINewBlocks/Typography";
import { BLOG_BASE } from "@/lib/blog/site";

export default function BlogNotFound() {
  return (
    <article>
      <h1 className="text-card-header font-medium text-foreground">Not found</h1>
      <Text variant="body" className="mt-3">
        That post or category doesn&apos;t exist.{" "}
        <Link href={BLOG_BASE} className="text-foreground underline underline-offset-4">
          Back to the index
        </Link>
        .
      </Text>
    </article>
  );
}
