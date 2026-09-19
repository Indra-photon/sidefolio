"use client";

import { Button } from "@/components/BlogUI/ui/button";
import { Text } from "@/components/UINewBlocks/Typography";

export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <article>
      <h1 className="text-card-header font-medium text-foreground">Something broke</h1>
      <Text variant="body" className="mt-3">
        This page failed to render.
      </Text>
      <Button variant="outline" size="sm" className="mt-6" onClick={reset}>
        Try again
      </Button>
    </article>
  );
}
