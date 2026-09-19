import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function getFaviconUrl(href?: string) {
  if (!href) return;
  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url.hostname)}&sz=64`;
  } catch {
    return;
  }
}

/** Inline text link; external links get the site's favicon and open in a new tab. */
export function ProseLink({ className, children, href, ...props }: ComponentProps<"a">) {
  const faviconUrl = getFaviconUrl(href);

  return (
    <a
      className={cn(
        "-mx-0.5 rounded-sm px-1 py-0.5 text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-[color,background-color,text-decoration-color] hover:bg-muted hover:decoration-muted",
        className,
      )}
      href={href}
      target={faviconUrl ? "_blank" : undefined}
      rel={faviconUrl ? "noreferrer" : undefined}
      {...props}
    >
      {faviconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          aria-hidden="true"
          alt=""
          className="mr-1 inline-block size-3 rounded-[3px] align-[-1px]"
          decoding="async"
          height={14}
          loading="lazy"
          src={faviconUrl}
          width={14}
        />
      ) : null}
      {children}
    </a>
  );
}
