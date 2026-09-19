import { NextResponse, type NextRequest } from "next/server";

// Serves the Markdown version of a blog post at `<post href>.md`, and to any
// client that asks for `text/markdown` via the Accept header. Both rewrite
// to the prerendered route handler under `<base>/md/<path>`.
//
// The matcher must be a literal, so it repeats BLOG_BASE from
// src/lib/blog/site.ts - update both at cutover.

const BLOG_BASE = "/blog";

function prefersMarkdown(accept: string | null) {
  if (!accept) return false;
  let markdown = -1;
  let html = -1;
  accept.split(",").forEach((entry, index) => {
    const [type, ...params] = entry.trim().split(";");
    const q = Number(params.find((p) => p.trim().startsWith("q="))?.split("=")[1] ?? 1);
    if (q <= 0) return;
    // Earlier entries win ties, so fold position into the score.
    const score = q * 1000 - index;
    if (type.trim() === "text/markdown") markdown = score;
    if (type.trim() === "text/html") html = score;
  });
  return markdown > html;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith(`${BLOG_BASE}/`)) return NextResponse.next();

  const rest = pathname.slice(BLOG_BASE.length + 1);
  if (rest.startsWith("md/")) return NextResponse.next();

  const explicit = rest.match(/^([\w-]+(?:\/[\w-]+)*)\.md$/);
  if (explicit) {
    const url = request.nextUrl.clone();
    url.pathname = `${BLOG_BASE}/md/${explicit[1]}`;
    return NextResponse.rewrite(url);
  }

  // Category pages never have a Markdown twin; the md route 404s for them,
  // so only rewrite paths deep enough to be a post (category + slug).
  const page = rest.match(/^([\w-]+(?:\/[\w-]+)+)$/);
  if (page && prefersMarkdown(request.headers.get("accept"))) {
    const url = request.nextUrl.clone();
    url.pathname = `${BLOG_BASE}/md/${page[1]}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/blog/:path*",
};
