import { ImageResponse } from "next/og";

import { findCategory } from "@/lib/blog/categories";
import { availablePosts, findPost } from "@/lib/blog/posts";
import { BLOG_NAME, SITE_URL } from "@/lib/blog/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return availablePosts().map((post) => ({ path: [...post.categoryPath, post.slug] }));
}

const HUES: Record<string, string> = {
  violet: "#7c3aed",
  orange: "#ea580c",
  amber: "#d97706",
  cyan: "#0891b2",
  emerald: "#059669",
  blue: "#2563eb",
  rose: "#e11d48",
};

// Neutral card in the site's palette: category eyebrow in its hue, title,
// description, site name. Satori uses its bundled sans-serif, which keeps
// this route free of font fetching.
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const post = findPost(path);
  if (!post) return new Response("Not found", { status: 404 });

  const root = findCategory(post.categoryPath.slice(0, 1));
  const crumbs = post.categoryPath
    .map((_, i) => findCategory(post.categoryPath.slice(0, i + 1))?.name)
    .filter(Boolean)
    .join(" / ");
  const hue = HUES[root?.color ?? "violet"];
  const host = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: hue }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: hue }} />
          {crumbs}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.1, letterSpacing: -1.5 }}>
            {post.title}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.4, color: "#a3a3a3", maxWidth: 960 }}>
            {post.description}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#737373" }}>
          <span>{BLOG_NAME}</span>
          <span>{host}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
