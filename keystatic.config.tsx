import { collection, config, fields, singleton } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";

import { CodeBlockPreview, ImgPreview, VideoPreview } from "./src/keystatic/previews";

import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS, type Category } from "./src/lib/blog/categories";

// Keystatic (local mode) = the writing UI at /keystatic, reached from
// /admin-panel. It only edits files under content/blog and public/blog; the
// site itself keeps reading them through content-collections.
//
// One collection per top-level category, so the editor's sidebar mirrors the
// blog's. Subcategories are a dropdown (frontmatter `subcategory`), so files
// stay flat: content/blog/motion/my-post.mdx + subcategory: springs.

const IMAGE_DIR = "public/blog";
const IMAGE_PUBLIC = "/blog/";

const LANGUAGES = [
  "tsx", "ts", "jsx", "js", "css", "html", "json", "bash", "mdx", "md", "yaml", "sql",
].map((value) => ({ label: value, value }));

const components = {
  Img: block({
    label: "Image",
    description: "Picture stored in the repo (public/blog). Alt text is required.",
    // `as never`: Keystatic bundles @types/react 19; our React 18 JSX.Element
    // is not assignable to its ReactNode. Runtime is fine.
    ContentView: ImgPreview as never,
    schema: {
      src: fields.image({
        label: "Image",
        directory: IMAGE_DIR,
        publicPath: IMAGE_PUBLIC,
        validation: { isRequired: true },
      }),
      alt: fields.text({ label: "Alt text", validation: { isRequired: true } }),
      caption: fields.text({ label: "Caption" }),
      priority: fields.checkbox({
        label: "Above the fold (hero)",
        description: "Load eagerly. Use on at most one image per post.",
      }),
    },
  }),
  Video: block({
    label: "Video",
    description: "Short muted loop from a URL/R2 key, or a Cloudflare Stream id.",
    ContentView: VideoPreview as never,
    schema: {
      src: fields.text({ label: "Video URL or R2 key (mp4/webm)" }),
      id: fields.text({ label: "Cloudflare Stream id (instead of URL)" }),
      poster: fields.text({ label: "Poster image URL" }),
      caption: fields.text({ label: "Caption" }),
      aspect: fields.text({ label: "Aspect ratio", defaultValue: "16 / 9" }),
    },
  }),
  CodeBlock: block({
    label: "Code block (tabs)",
    description: "Highlighted code with one or more tabs, filename header and copy button.",
    ContentView: CodeBlockPreview as never,
    schema: {
      tabs: fields.array(
        fields.object({
          label: fields.text({ label: "Tab label", validation: { isRequired: true } }),
          language: fields.select({ label: "Language", options: LANGUAGES, defaultValue: "tsx" }),
          filename: fields.text({ label: "Filename (header)" }),
          code: fields.text({ label: "Code", multiline: true, validation: { isRequired: true } }),
        }),
        { label: "Tabs", itemLabel: (props) => props.fields.label.value || "Tab" },
      ),
      hideHeader: fields.checkbox({ label: "Hide header (one-liners)" }),
    },
  }),
  LinkList: block({
    label: "Link list",
    schema: {
      links: fields.array(
        fields.object({
          url: fields.url({ label: "URL", validation: { isRequired: true } }),
          title: fields.text({ label: "Title", validation: { isRequired: true } }),
          description: fields.text({ label: "Description" }),
        }),
        { label: "Links", itemLabel: (props) => props.fields.title.value || "Link" },
      ),
    },
  }),
  // Interactive demos (src/components/BlogUI/demos). Add new ones here too.
  ColorPicker: block({
    label: "Demo: Colour picker",
    schema: { initialColor: fields.text({ label: "Initial colour", defaultValue: "#7c3aed" }) },
  }),
  AnimatedDeleteButton: block({
    label: "Demo: Animated delete button",
    schema: { itemName: fields.text({ label: "Item name", defaultValue: "item" }) },
  }),
  VariantDeleteButton: block({
    label: "Demo: Variant delete button",
    schema: {},
  }),
};

// Every subcategory below a category, any depth: value "springs/drag",
// label "Springs / Drag". Feeds the Subcategory dropdown in the post form.
function subcategoryOptions(
  children: Category[] | undefined,
  prefix: { value: string; label: string } = { value: "", label: "" },
): { value: string; label: string }[] {
  return (children ?? []).flatMap((child) => {
    const value = prefix.value ? `${prefix.value}/${child.slug}` : child.slug;
    const label = prefix.label ? `${prefix.label} / ${child.name}` : child.name;
    return [{ value, label }, ...subcategoryOptions(child.children, { value, label })];
  });
}

function postCollection(category: Category) {
  const { slug, name } = category;
  const subs = subcategoryOptions(category.children);
  return collection({
    label: name,
    path: `content/blog/${slug}/**`,
    slugField: "title",
    format: { contentField: "content" },
    entryLayout: "content",
    columns: ["subcategory", "publishedAt", "published"],
    schema: {
      title: fields.slug({
        name: { label: "Title", validation: { isRequired: true } },
        slug: { label: "Slug", description: "URL segment, generated from the title." },
      }),
      subcategory: fields.select({
        label: "Subcategory",
        description:
          subs.length > 0
            ? `Where inside ${name} this post lives.`
            : `${name} has no subcategories yet - add some under Settings → Categories, then restart the dev server.`,
        options: [{ label: `— ${name} (top level) —`, value: "" }, ...subs],
        defaultValue: "",
      }),
      description: fields.text({
        label: "Description",
        description: "One sentence - shown in lists, meta tags and llms.txt.",
        multiline: true,
        validation: { isRequired: true },
      }),
      published: fields.checkbox({
        label: "Published",
        description: "Off = draft: visible locally, hidden in production.",
        defaultValue: false,
      }),
      publishedAt: fields.date({ label: "Published on", validation: { isRequired: true } }),
      updatedAt: fields.date({ label: "Updated on" }),
      order: fields.integer({
        label: "Order",
        description: "Position inside the category (lower first).",
        defaultValue: 0,
      }),
      featured: fields.checkbox({ label: "Featured on the home page", defaultValue: false }),
      tags: fields.array(fields.text({ label: "Tag" }), {
        label: "Tags",
        itemLabel: (props) => props.value,
      }),
      thumbnail: fields.image({
        label: "Thumbnail (1200×630, for social previews)",
        directory: IMAGE_DIR,
        publicPath: IMAGE_PUBLIC,
      }),
      resources: fields.array(
        fields.object({
          url: fields.url({ label: "URL", validation: { isRequired: true } }),
          title: fields.text({ label: "Title (fetched at build if empty)" }),
          description: fields.text({ label: "Description (fetched at build if empty)" }),
        }),
        { label: "Resources", itemLabel: (props) => props.fields.title.value || props.fields.url.value || "Resource" },
      ),
      content: fields.mdx({
        label: "Content",
        options: {
          image: { directory: IMAGE_DIR, publicPath: IMAGE_PUBLIC },
        },
        components,
      }),
    },
  });
}

// --- Categories ---------------------------------------------------------
// Edits content/categories.json. Three levels deep from the editor (deeper
// nesting is possible by hand). After saving, RESTART `npm run dev`: the
// post collections in the editor's sidebar are generated from this file
// when the config loads. Renaming a slug does not move existing posts —
// rename the folder under content/blog to match.

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const baseCategoryFields = () => ({
  name: fields.text({ label: "Name", validation: { isRequired: true } }),
  slug: fields.text({
    label: "Slug",
    description: "Folder + URL segment, kebab-case. Matches content/blog/<slug>.",
    validation: { isRequired: true, pattern: { regex: SLUG_PATTERN, message: "kebab-case only" } },
  }),
  description: fields.text({ label: "Description", multiline: true }),
  order: fields.integer({ label: "Order", description: "Lower first.", defaultValue: 0 }),
});

const itemLabel = (props: { fields: { name: { value: string } } }) =>
  props.fields.name.value || "New category";

// Level 3 (sub-subcategory): no children.
const level3 = fields.object(baseCategoryFields());
// Level 2 (subcategory)
const level2 = fields.object({
  ...baseCategoryFields(),
  children: fields.array(level3, { label: "Sub-subcategories", itemLabel }),
});
// Level 1 (top-level): colour + icon + subcategories.
const level1 = fields.object({
  ...baseCategoryFields(),
  color: fields.select({
    label: "Colour",
    description: "Sidebar dot, icon and index eyebrow. Children inherit it.",
    options: CATEGORY_COLORS.map((value) => ({ label: value, value })),
    defaultValue: "violet",
  }),
  icon: fields.select({
    label: "Icon",
    options: CATEGORY_ICONS.map((value) => ({ label: value, value })),
    defaultValue: "folder",
  }),
  children: fields.array(level2, { label: "Subcategories", itemLabel }),
});

const categoriesSingleton = singleton({
  label: "Categories",
  path: "content/categories",
  format: "json",
  schema: {
    categories: fields.array(level1, {
      label: "Categories",
      description:
        "Save, then restart the dev server so new categories appear in the sidebar. The folder under content/blog is created when you add the first post.",
      itemLabel,
    }),
  },
});

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Articles" },
    navigation: {
      Posts: CATEGORIES.map((category) => category.slug),
      Settings: ["categories"],
    },
  },
  collections: Object.fromEntries(
    CATEGORIES.map((category) => [category.slug, postCollection(category)]),
  ),
  singletons: { categories: categoriesSingleton },
});
