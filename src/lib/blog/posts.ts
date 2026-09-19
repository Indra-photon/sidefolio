import { cache } from "react";
import { allPosts, type Post } from "content-collections";

import {
  CATEGORY_TREE,
  findCategory,
  type CategoryColor,
  type CategoryNode,
} from "./categories";
import { BLOG_BASE } from "./site";

/** Stable id for a post: category path + slug, e.g. "motion/springs/foo". */
export function postId(post: Pick<Post, "categoryPath" | "slug">) {
  return [...post.categoryPath, post.slug].join("/");
}

/**
 * Drafts (`published: false` in frontmatter, the editor's "Published" toggle)
 * still build and render locally so they can be previewed, but are hidden
 * from the sidebar, index, sitemap, llms.txt and OG routes in production.
 */
export function isPostAvailable(post: Pick<Post, "published">) {
  if (process.env.NODE_ENV === "development") return true;
  return post.published;
}

/** The minimal, serialisable shape client components (sidebar, ⌘K) receive. */
export type NavPost = {
  title: string;
  slug: string;
  href: string;
  categoryPath: string[];
  available: boolean;
};

export type NavNode = {
  slug: string;
  name: string;
  path: string[];
  href: string;
  depth: number;
  color: CategoryColor;
  posts: NavPost[];
  children: NavNode[];
};

export function categoryHref(path: string[]) {
  return `${BLOG_BASE}/${path.join("/")}`;
}

function sortPosts(posts: Post[]) {
  return [...posts].sort(
    (a, b) =>
      a.order - b.order ||
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.title.localeCompare(b.title),
  );
}

function toNavPost(post: Post): NavPost {
  return {
    title: post.title,
    slug: post.slug,
    href: post.href,
    categoryPath: post.categoryPath,
    available: isPostAvailable(post),
  };
}

function buildNode(node: CategoryNode): NavNode {
  const key = node.path.join("/");
  const posts = sortPosts(
    allPosts.filter((post) => post.categoryPath.join("/") === key),
  ).map(toNavPost);
  return {
    slug: node.slug,
    name: node.name,
    path: node.path,
    href: categoryHref(node.path),
    depth: node.depth,
    color: node.color,
    posts,
    children: node.children.map(buildNode),
  };
}

function hasContent(node: NavNode): boolean {
  return node.posts.length > 0 || node.children.some(hasContent);
}

function prune(node: NavNode): NavNode {
  return { ...node, children: node.children.filter(hasContent).map(prune) };
}

/**
 * Category tree with posts attached at each node. Empty branches are pruned
 * so the sidebar never shows a heading with nothing under it. Memoised per
 * request since layout and page both read it.
 */
export const buildNavTree = cache((): NavNode[] =>
  CATEGORY_TREE.map(buildNode).filter(hasContent).map(prune),
);

/**
 * Depth-first list of every post in sidebar order. The sidebar dot's travel
 * distance and prev/next both come from this, so they always agree.
 */
export const flattenNavPosts = cache((): NavPost[] => {
  const walk = (node: NavNode): NavPost[] => [
    ...node.posts,
    ...node.children.flatMap(walk),
  ];
  return buildNavTree().flatMap(walk);
});

export function getPrevNext(post: Pick<Post, "href">) {
  const ordered = flattenNavPosts().filter((p) => p.available);
  const index = ordered.findIndex((p) => p.href === post.href);
  return {
    prev: index > 0 ? ordered[index - 1] : undefined,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined,
  };
}

/** Posts that ship in production, in sidebar order. */
export function availablePosts(): Post[] {
  const order = new Map(flattenNavPosts().map((p, i) => [p.href, i]));
  return allPosts
    .filter(isPostAvailable)
    .sort((a, b) => (order.get(a.href) ?? 0) - (order.get(b.href) ?? 0));
}

export function findPost(path: string[]): Post | undefined {
  const id = path.join("/");
  return allPosts.find((post) => postId(post) === id);
}

export type Resolved =
  | { kind: "category"; category: CategoryNode; node: NavNode | undefined }
  | { kind: "post"; post: Post }
  | { kind: "none" };

/** Turn a catch-all `[...path]` into a category page or a post page. */
export function resolvePath(path: string[]): Resolved {
  const post = findPost(path);
  if (post) {
    return isPostAvailable(post) ? { kind: "post", post } : { kind: "none" };
  }
  const category = findCategory(path);
  if (category) {
    const key = path.join("/");
    const find = (nodes: NavNode[]): NavNode | undefined => {
      for (const node of nodes) {
        if (node.path.join("/") === key) return node;
        const hit = find(node.children);
        if (hit) return hit;
      }
      return undefined;
    };
    return { kind: "category", category, node: find(buildNavTree()) };
  }
  return { kind: "none" };
}

/** Every static path under BLOG_BASE: all category nodes + all live posts. */
export function allStaticPaths(): string[][] {
  const categories: string[][] = [];
  const walk = (node: CategoryNode) => {
    categories.push(node.path);
    node.children.forEach(walk);
  };
  CATEGORY_TREE.forEach(walk);
  const posts = availablePosts().map((post) => [...post.categoryPath, post.slug]);
  return [...categories, ...posts];
}
