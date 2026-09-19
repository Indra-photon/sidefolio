# Blog authoring & maintenance guide

How to add and change things in the MDX blog (`/blogs-new` today, `/blog` after cutover).
Everything derives from two places: the **content folder** (`content/blog/`) and the
**category tree** (`src/lib/blog/categories.ts`). Routes, sidebar, index, `.md` twins,
`llms.txt`, OG images and metadata all follow automatically.

```
content/blog/<category>/[<subcategory>/…]/<slug>.mdx   ← posts
src/lib/blog/categories.ts                             ← category tree (order, colours)
src/lib/blog/posts.ts        → LAUNCHED_POSTS          ← what ships in production
src/lib/blog/site.ts         → BLOG_BASE, SITE_URL, GITHUB_REPO
src/components/BlogUI/       ← ALL blog UI (never touch src/components/ui or UINewBlocks)
src/components/BlogUI/demos/ ← interactive components usable inside MDX
```

---

## 1. Add a post

1. Create `content/blog/<category-path>/<slug>.mdx`. The **folder is the category** —
   `content/blog/motion/springs/foo.mdx` lands under Motion → Springs. The file name is
   the URL slug (`kebab-case`, no spaces).
2. Frontmatter (required fields marked *):

```yaml
---
title: Hello MDX                       # *
description: One sentence for cards, meta and llms.txt   # *
publishedAt: "2026-09-18"              # * ISO date, quoted
order: 1                               # position inside its category (lower first); default 0
updatedAt: "2026-10-01"                # optional
thumbnail: https://imagedelivery.net/<hash>/<id>/public   # optional; card + OG image
tags: [motion, springs]                # optional
featured: true                         # optional; used by the home "Writing" section after cutover
resources:                             # optional; rendered at the bottom + in the .md twin
  - url: https://example.com/article
    title: Optional title              # fetched from the page at build time if omitted
    description: Optional description  # same
---
```

3. Write Markdown. Standard syntax works: headings (`##`, `###`), lists, links, `**bold**`,
   blockquotes, tables, images, fenced code (` ```tsx `), inline code.
   Fenced and inline code are highlighted at build time (light + dark themes).
4. Run `npm run dev` and open the URL. **In development every post renders**, launched or not.
5. Reading time is computed automatically.

### Launching (making it live in production)
Posts are hidden in production until listed in `LAUNCHED_POSTS` in `src/lib/blog/posts.ts`:

```ts
const LAUNCHED_POSTS = new Set<string>([
  "motion/hello-mdx",              // <category path>/<slug>
  "motion/springs/nested-sample",
]);
```

Unlaunched posts: not in the sidebar/index/sitemap/llms/OG, and their URL 404s in prod.
Remove the entry to unpublish.

### Removing a post
Delete the `.mdx` file and its `LAUNCHED_POSTS` entry. If it was public, keep the URL
alive with a redirect in `next.config.mjs` (`redirects()`), or leave a short stub post.

---

## 2. Components you can use inside MDX (no imports needed)

| Component | Use |
|---|---|
| `<CodeBlock tabs={[…]} />` | Tabbed code with filename header and copy button (see below) |
| `<CodeBlock hideHeader tabs={[…]} />` | One-liner (terminal command) without the header |
| `<Demo>…</Demo>` | Framed figure for an interactive example |
| `<Compare>` / `<CompareItem verdict="wrong\|right" label caption>` | Side-by-side wrong/right |
| `<Img … />` | Cloudflare image (see §4) |
| `<Video … />` | Cloudflare Stream or short muted clip (see §4) |
| `<LinkList links={[{ url, title, description }]} />` | Inline resource-style link rows |
| Any export of `BlogUI/demos/index.ts` | e.g. `<ColorPicker initialColor="#7c3aed" />` |

### CodeBlock
```mdx
<CodeBlock
  tabs={[
    {
      label: "Tailwind",
      language: "html",          // any shiki language id: tsx, css, bash, json, …
      filename: "button.tsx",    // optional; header shows a sensible default per language
      code: `<button class="active:scale-[0.97]">Save</button>`,
    },
    {
      label: "CSS",
      language: "css",
      code: `.button:active { transform: scale(0.97); }`,
    },
  ]}
/>
```
- `code` is a JS template literal: escape backticks as `` \` `` and `${` as `\${`.
- Leading indentation inside the template literal is preserved automatically.
- Prefer plain fenced ` ``` ` blocks when there is only one snippet and no filename matters.

---

## 3. Add an interactive demo (live code)

1. Create `src/components/BlogUI/demos/<name>.tsx`, first line `"use client";`.
   Export a named component. Use `cn()` from `@/lib/utils`, `motion/react` for animation,
   `lucide-react` for icons, `shadow-border` / `hairline-*` for lines (no `border-*`).
   Wrap the visual in `<Demo>` (import from `../mdx/demo`) so it gets the standard frame.
   Use `useReducedMotion()` for any non-trivial animation.
2. Export it from `src/components/BlogUI/demos/index.ts`:
   ```ts
   export { SpringDemo } from "./spring-demo";
   ```
3. Use it in MDX: `<SpringDemo />`. Props must be JSX-literal (`stiffness={200}`, `label="x"`).
4. In the `.md` twin and `llms-full.txt` it becomes a "> Interactive demo: … open the page" note.

Shared building blocks for demos live in `BlogUI/mdx/`: `Compare`, `SegmentedControl`,
and `BlogUI/ui/` (`Button`, `Tooltip`, `Skeleton`). Need a slider/switch/etc.? Generate the
shadcn component **into `BlogUI/ui/`** (copy the file, fix imports to `@/lib/utils`) — do not
edit the site-wide `src/components/ui/*`.

---

## 4. Images and video (R2 + next/image)

Full setup, upload script, caching details and troubleshooting: **`docs/media-guide.md`**.

1. Upload: `npm run media:upload -- ./file.png --alt "…"` → prints the `<Img>` snippet.
2. Paste:
   ```mdx
   <Img src="blog/file.3f9a1c2b.png" alt="…" width={1600} height={900} />
   <Img src="…" alt="…" width={…} height={…} priority caption="Fig. 1" />   # hero only
   <Video src="blog/clip.9b1d2e3f.mp4" aspect="16 / 9" />                    # short muted loop
   ```
   - `alt`, `width`, `height` required; `priority` on at most one image per post.
   - `src` is the R2 key from the script (or any absolute URL).
3. Thumbnail for cards/OG: `thumbnail: blog/hero.8c1d9e0f.png` in frontmatter (1200×630).
4. Env: `NEXT_PUBLIC_MEDIA_URL` (Vercel + `.env`) and the four `R2_*` vars (`.env` only).

---

## 5. Add a category

Edit `src/lib/blog/categories.ts` and add an entry to `CATEGORIES`:

```ts
{
  slug: "systems",                 // folder name + URL segment
  name: "Systems",
  description: "Shown on the category page and llms.txt.",
  color: "rose",                   // one of CategoryColor (violet|orange|amber|cyan|emerald|blue|rose)
  order: 7,                        // sidebar/index position among top-level categories
  children: [],
},
```

Then:
1. `mkdir content/blog/systems` and add at least one post (empty categories are hidden from
   the sidebar/index automatically, but the `/blogs-new/systems` page still exists).
2. Give it an icon: `src/components/BlogUI/shell/category-icon.tsx` → `icons` map,
   `systems: Boxes` (any `lucide-react` icon). Top-level categories only.
3. Need a new colour name? Add it to `CategoryColor` in `categories.ts`, then to the three
   maps in `category-icon.tsx` (`categoryTextColor`, `dotColorFrom`, `dotColorTo`) and to
   `HUES` in `src/app/og/blog/[...path]/route.tsx`.

### Add a subcategory (any depth)
```ts
{
  slug: "motion", …,
  children: [
    { slug: "springs", name: "Springs", order: 1 },
    { slug: "gestures", name: "Gestures", order: 2, children: [
      { slug: "drag", name: "Drag", order: 1 },   // → content/blog/motion/gestures/drag/
    ]},
  ],
},
```
Create the matching nested folder. Subcategories inherit the parent's colour (set `color`
to override) and have no icon. The sidebar indents each level; the breadcrumb shows the
full path; the dot animation already accounts for nesting.

### Rename / reorder / remove
- **Reorder**: change `order`.
- **Rename (label only)**: change `name`.
- **Rename slug**: rename the folder **and** the slug, update `LAUNCHED_POSTS` entries, and
  add a redirect for the old URLs.
- **Remove**: delete the entry and folder; a post left in an unknown folder fails the build
  with a clear error naming the file.

---

## 6. Site-wide knobs

| What | Where |
|---|---|
| Blog URL prefix (`/blogs-new` → `/blog`) | `BLOG_BASE` in `src/lib/blog/site.ts` **and** the literal `BLOG_BASE` + `config.matcher` in `src/proxy.ts` |
| Site URL, blog name/description, author | `src/lib/blog/site.ts` |
| Media host (R2 URL → custom domain later) | `NEXT_PUBLIC_MEDIA_URL`; resolver in `src/lib/blog/media.ts`; `remotePatterns` + cache TTL in `next.config.mjs` |
| GitHub "View source" links | `GITHUB_REPO` in `site.ts` (repo must be public for links to work) |
| Code font | `Geist_Mono` in `src/app/blogs-new/layout.tsx`; token scoped in `BlogUI/blog.css` (`.blog-root { --font-mono }`) |
| Shiki themes | `themes: { light, dark }` in `BlogUI/mdx/code-block.tsx` **and** `src/lib/blog/rehype-syntax-highlight.ts` (keep both identical) |
| Prose styling (h2/h3/p/code/quote/table) | `BlogUI/mdx/prose.tsx` — body copy goes through `Text variant="body"`; don't add new type sizes at call sites |
| Sidebar animation timing | constants at the top of `BlogUI/shell/sidebar-nav.tsx`; keyframes in `BlogUI/blog.css` |
| Sidebar width / column width | `BlogUI/shell/blog-shell.tsx` (`w-56`, `max-w-160`) |
| OG card design | `src/app/og/blog/[...path]/route.tsx` |
| Reading-time formula | `readingTimeMinutes()` in `content-collections.ts` (200 wpm) |
| Frontmatter schema | `content-collections.ts` (zod). Adding a field = add it to the schema, then use it in the page/components |

Any new blog UI goes in `src/components/BlogUI/` (server component by default; add
`"use client"` only for state/effects/motion). Client components must receive plain,
serialisable props and must not import from `content-collections`.

---

## 7. Cutover to `/blog` (one-time, after content migration)

1. Delete the old tree: `src/app/blog/`, blog/category API routes, `Blog`/`BlogCategory`
   models, admin blog pages (keep craft-video ones), `PrismHighlighter`, legacy blog
   components, `mdx-components.tsx`.
2. `git mv src/app/blogs-new src/app/blog`.
3. `BLOG_BASE = "/blog"` in `site.ts`; `BLOG_BASE` and `matcher: "/blog/:path*"` in `src/proxy.ts`.
4. `navlinks.tsx` already points at `/blog`; update `HomeBlog` to read `allPosts` (featured)
   on the server; add blog entries to `src/app/sitemap.ts` from `availablePosts()`.
5. Remove unused deps: `@next/mdx`, `@mdx-js/loader`, `next-mdx-remote`, `react-markdown`,
   `remark-gfm`, `prismjs`, `@types/prismjs`, `@mapbox/rehype-prism`, `tinymce`,
   `@tinymce/tinymce-react`. Drop `NEXT_PUBLIC_TINYMCE_API_KEY` from `.env.example`.
6. `npm run build` — every `/blog/*` route must be `○ Static` / `● SSG`.

---

## 8. Before you commit — checklist

- [ ] `npm run build` passes (content errors print the offending file path).
- [ ] New post has `title`, `description`, `publishedAt`; slug is kebab-case; folder is a real category.
- [ ] Post is in `LAUNCHED_POSTS` if it should be public.
- [ ] Every `<Img>` has `alt`, `width`, `height`; hero image has `priority`.
- [ ] Demos are `"use client"`, exported from `demos/index.ts`, wrapped in `<Demo>`.
- [ ] No `border-*` utilities in BlogUI (use `hairline-*` / `shadow-border`).
- [ ] Nothing changed under `src/components/ui` or `src/components/UINewBlocks`.
- [ ] Check `<post>.md` and `/llms.txt` still read well (components degrade to notes/fences).
