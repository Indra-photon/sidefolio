import type { MetadataRoute } from "next";

import CraftVideoModel from "@/app/api/models/CraftVideo";
import { products } from "@/constants/products";
import { flattenCategories } from "@/lib/blog/categories";
import { availablePosts, buildNavTree, type NavNode } from "@/lib/blog/posts";
import { BLOG_BASE, SITE_URL } from "@/lib/blog/site";
import dbConnect from "@/lib/dbConnect";

export const revalidate = 3600;

const STATIC: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/craft", changeFrequency: "weekly", priority: 0.9 },
  { path: "/resume", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: BLOG_BASE, changeFrequency: "weekly", priority: 0.9 },
];

async function craftVideos() {
  try {
    await dbConnect();
    return (await CraftVideoModel.find({ isPublished: true })
      .select("slug updatedAt")
      .limit(1000)
      .lean()) as { slug: string; updatedAt?: Date }[];
  } catch (error) {
    console.error("sitemap: craft videos unavailable", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = STATIC.map((s) => ({
    url: `${SITE_URL}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  const projectRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/projects/${product.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Blog: every category node that has content, then every published post.
  // A category's lastModified is its newest post.
  const posts = availablePosts();
  const nodes = flattenCategories();
  const newestIn = (node: NavNode): string | undefined => {
    const own = posts.filter((p) => p.categoryPath.join("/") === node.path.join("/"));
    const dates = [
      ...own.map((p) => p.updatedAt ?? p.publishedAt),
      ...node.children.map(newestIn).filter((d): d is string => Boolean(d)),
    ];
    return dates.sort().at(-1);
  };
  const navByPath = new Map<string, NavNode>();
  const walk = (n: NavNode) => {
    navByPath.set(n.path.join("/"), n);
    n.children.forEach(walk);
  };
  buildNavTree().forEach(walk);

  const categoryRoutes: MetadataRoute.Sitemap = nodes.flatMap((node) => {
    const nav = navByPath.get(node.path.join("/"));
    if (!nav) return []; // empty branch, pruned from the site too
    const newest = newestIn(nav);
    return [
      {
        url: `${SITE_URL}${nav.href}`,
        lastModified: newest ? new Date(newest) : now,
        changeFrequency: "weekly" as const,
        priority: node.depth === 0 ? 0.8 : 0.7,
      },
    ];
  });

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}${post.href}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const craftRoutes: MetadataRoute.Sitemap = (await craftVideos()).map((video) => ({
    url: `${SITE_URL}/craft/${video.slug}`,
    lastModified: video.updatedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...categoryRoutes, ...postRoutes, ...craftRoutes];
}
