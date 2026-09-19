import data from "../../../content/categories.json";

// The category tree is the single source of truth for the sidebar, the
// index page, routes, llms.txt and the sitemap. It is edited in the
// Keystatic "Categories" screen (content/categories.json) — or by hand.
// Folders under content/blog mirror it: content/blog/<slug>/<child>/<post>.mdx.
//
// Top-level nodes carry the colour + icon used by the sidebar; descendants
// inherit the colour unless they set their own.

export const CATEGORY_COLORS = [
  "violet",
  "orange",
  "amber",
  "cyan",
  "emerald",
  "blue",
  "rose",
] as const;
export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export const CATEGORY_ICONS = [
  "spline",
  "pen-tool",
  "layers",
  "sparkles",
  "flask",
  "server",
  "code",
  "palette",
  "book",
  "lightbulb",
  "terminal",
  "folder",
] as const;
export type CategoryIconName = (typeof CATEGORY_ICONS)[number];

export type Category = {
  slug: string;
  name: string;
  description?: string;
  /** Only top-level nodes need a colour; children inherit. */
  color?: CategoryColor;
  /** Top-level only. */
  icon?: CategoryIconName;
  /** Sidebar / index order within the parent. Lower first. */
  order: number;
  children?: Category[];
};

type RawCategory = {
  slug: string;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  order?: number | null;
  children?: RawCategory[] | null;
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalise(raw: RawCategory, trail: string[]): Category {
  const path = [...trail, raw.slug].join("/");
  if (!SLUG.test(raw.slug)) {
    throw new Error(`Category slug "${path}" must be kebab-case (letters, digits, hyphens).`);
  }
  if (!raw.name) throw new Error(`Category "${path}" has no name.`);
  const color = raw.color && (CATEGORY_COLORS as readonly string[]).includes(raw.color)
    ? (raw.color as CategoryColor)
    : undefined;
  const icon = raw.icon && (CATEGORY_ICONS as readonly string[]).includes(raw.icon)
    ? (raw.icon as CategoryIconName)
    : undefined;
  return {
    slug: raw.slug,
    name: raw.name,
    description: raw.description ?? undefined,
    color,
    icon,
    order: raw.order ?? 0,
    children: (raw.children ?? []).map((child) => normalise(child, [...trail, raw.slug])),
  };
}

export const CATEGORIES: Category[] = (data.categories as RawCategory[]).map((raw) =>
  normalise(raw, []),
);

/** A category plus the path of slugs from the root down to it. */
export type CategoryNode = Category & {
  path: string[];
  depth: number;
  /** Effective colour (own or inherited from the nearest ancestor). */
  color: CategoryColor;
  children: CategoryNode[];
};

function resolve(category: Category, parentPath: string[], inherited: CategoryColor): CategoryNode {
  const path = [...parentPath, category.slug];
  const color = category.color ?? inherited;
  const children = [...(category.children ?? [])]
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map((child) => resolve(child, path, color));
  return { ...category, path, depth: parentPath.length, color, children };
}

/** The tree with paths, depths and inherited colours resolved, sorted by order. */
export const CATEGORY_TREE: CategoryNode[] = [...CATEGORIES]
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
  .map((category) => resolve(category, [], category.color ?? "violet"));

/** Depth-first list of every node in the tree. */
export function flattenCategories(nodes: CategoryNode[] = CATEGORY_TREE): CategoryNode[] {
  return nodes.flatMap((node) => [node, ...flattenCategories(node.children)]);
}

const byPath = new Map(flattenCategories().map((node) => [node.path.join("/"), node]));

/** Find a category by its slug path, e.g. ["motion", "springs"]. */
export function findCategory(path: string[]): CategoryNode | undefined {
  return byPath.get(path.join("/"));
}

export function isCategoryPath(path: string[]) {
  return byPath.has(path.join("/"));
}

/** Top-level ancestor of a path (owns the icon and colour). */
export function rootCategory(path: string[]): CategoryNode | undefined {
  return findCategory(path.slice(0, 1));
}
