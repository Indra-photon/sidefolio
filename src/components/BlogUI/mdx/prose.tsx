import type { MDXComponents } from "mdx/types";

import { Text } from "@/components/UINewBlocks/Typography";
import { cn } from "@/lib/utils";

import { ProseLink } from "./prose-link";

// Prose element overrides for MDX. Body copy goes through the site's
// Typography primitive; headings and code use existing size tokens so no
// new type scale is introduced here.
export const proseComponents: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-10 mb-4 text-card-header text-balance font-medium text-foreground",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 mb-3 text-body-lg text-balance font-medium text-foreground",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, children }) => (
    <Text variant="body" className={cn("my-4", className)}>
      {children}
    </Text>
  ),
  a: ProseLink,
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-4 list-disc space-y-2 pl-5 text-body text-muted-foreground lg:text-body-lg",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-4 list-decimal space-y-2 pl-5 text-body text-muted-foreground lg:text-body-lg",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("text-pretty", className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-medium text-foreground", className)} {...props} />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "mx-0.5 rounded-[3px] bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground shadow-border",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-xl bg-card p-4 font-mono text-xs leading-relaxed whitespace-pre shadow-border [&>code]:mx-0 [&>code]:bg-transparent [&>code]:p-0 [&>code]:shadow-none",
        className,
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-6 pl-4 text-body text-muted-foreground italic hairline-l lg:text-body-lg",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-10 h-px border-0 bg-(--hairline)", className)} {...props} />
  ),
  img: ({ className, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("my-6 rounded-xl shadow-border", className)}
      alt={alt ?? ""}
      loading="lazy"
      decoding="async"
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-6 overflow-x-auto">
      <table className={cn("w-full text-left text-body", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th className={cn("py-2 pr-4 font-medium text-foreground hairline-b", className)} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td className={cn("py-2 pr-4 text-muted-foreground hairline-b", className)} {...props} />
  ),
};
