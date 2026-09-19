// The category tree is the single source of truth for the sidebar, the
// index page, routes, llms.txt and the sitemap. Folders under content/blog
// mirror it: content/blog/<slug>/<child-slug>/<post>.mdx.
//
// Adding a category  = one entry here + a folder.
// Adding a subcategory = a `children` entry + a nested folder.
// Top-level nodes carry the colour used by the sidebar dot; descendants
// inherit it unless they set their own.

export type CategoryColor =
  | "violet"
  | "orange"
  | "amber"
  | "cyan"
  | "emerald"
  | "blue"
  | "rose";

export type Category = {
  slug: string;
  name: string;
  description?: string;
  /** Only top-level nodes need a colour; children inherit. */
  color?: CategoryColor;
  /** Sidebar / index order within the parent. Lower first. */
  order: number;
  children?: Category[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "motion",
    name: "Motion",
    description: "Easing, springs, gestures and the feel of interfaces in motion.",
    color: "violet",
    order: 1,
    children: [
      {
        slug: "springs",
        name: "Springs",
        description: "Physics-based motion.",
        order: 1,
      },
    ],
  },
  {
    slug: "design-engineering",
    name: "Design Engineering",
    description: "Where design decisions meet implementation details.",
    color: "orange",
    order: 2,
    children: [],
  },
  {
    slug: "redesigning",
    name: "Redesigning",
    description: "Case studies: taking an existing interface apart and rebuilding it.",
    color: "amber",
    order: 3,
    children: [],
  },
  {
    slug: "how-to-ai",
    name: "How to AI",
    description: "Practical workflows for building with and alongside AI.",
    color: "cyan",
    order: 4,
    children: [],
  },
  {
    slug: "experiment",
    name: "Experiment",
    description: "Prototypes, half-ideas and things tried for the sake of it.",
    color: "emerald",
    order: 5,
    children: [],
  },
  {
    slug: "full-stack",
    name: "Full Stack",
    description: "Backends, data, deployment and the plumbing behind the UI.",
    color: "blue",
    order: 6,
    children: [],
  },
];

/** A category plus the path of slugs from the root down to it. */
export type CategoryNode = Category & {
  path: string[];
  depth: number;
  /** Effective colour (own or inherited from the nearest ancestor). */
  color: CategoryColor;
  children: CategoryNode[];
};

function resolve(
  category: Category,
  parentPath: string[],
  inherited: CategoryColor,
): CategoryNode {
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
