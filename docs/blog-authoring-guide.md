# Blog authoring & maintenance guide

How to add and change things in the MDX blog (`/blog`).
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

## 1. Add a post (the editor — recommended)

1. `npm run dev`, open **http://localhost:3000/keystatic** (or `/admin-panel` → **Editor**).
   Everything here is local-only; on the deployed site these routes are 404s.
2. Pick the category in the left sidebar (Motion, Design Engineering, …) → **Add**.
3. Fill the form on the right:
   - **Title** → the **Slug** is generated; edit it if you like.
   - **Subcategory** dropdown: top level, or any subcategory of that category (nested ones
     show as "Springs / Drag"). Changing it later moves the post in the sidebar/URL.
   - **Description** (one sentence), **Published on**, optional Tags / Order / Featured /
     Thumbnail (1200×630) / Resources.
   - **Published** toggle: off = draft (renders locally only), on = live after deploy.
   (Alternative entry point: `/admin-panel` → **New post** — a category picker that creates
   the draft and jumps into the same editor.)
4. Write in the **Content** editor. Type `/` for blocks: headings, lists, quotes, code,
   tables, and the site's components — *Image*, *Video*, *Code block (tabs)*, *Link list*,
   and every demo (*Demo: Colour picker* …). Images: drop/paste a file or use the Image
   block; the file is saved to `public/blog/…` and referenced as `/blog/…`.
5. **Save**. The `.mdx` (and images) are written to the repo. Preview at
   `http://localhost:3000/blog/<category>/<path>` — it's the real page.
6. `npm run media:sync` (uploads any new images to R2 and updates
   `content/media-manifest.json`), then commit and push; Vercel deploys and serves the
   images from R2.

Everything the editor writes is a plain file, so §1b still works whenever you prefer a
text editor, and both can be mixed on the same post.

### 1b. Add a post by hand (text editor)

1. Create `content/blog/<category>/<slug>.mdx`. The **folder is the top-level category**;
   for a subcategory add `subcategory: springs` (or `springs/drag`) to the frontmatter —
   that's what the editor writes. Nested folders (`motion/springs/foo.mdx`) also work.
   The file name is the URL slug (`kebab-case`, no spaces).
2. Frontmatter (required fields marked *):

```yaml
---
title: Hello MDX                       # *
description: One sentence for cards, meta and llms.txt   # *
publishedAt: "2026-09-18"              # * ISO date, quoted
published: true                        # false/omitted = draft (local only)
subcategory: springs                   # optional; "springs/drag" for deeper levels
order: 1                               # position inside its category (lower first); default 0
updatedAt: "2026-10-01"                # optional
thumbnail: /blog/motion/foo/hero.png   # optional; repo path, R2 key or URL; social preview image
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
4. Reading time is computed automatically.

### Publishing
`published: true` in frontmatter (the editor's **Published** toggle). Drafts still render
in development so you can preview them; in production they are absent from the sidebar,
index, sitemap, llms.txt and OG routes, and their URL 404s.

### Removing a post
Delete it in the editor (item → *Delete*) or delete the `.mdx` file. If it was public,
keep the URL alive with a redirect in `next.config.mjs` (`redirects()`).

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
- **Editor compatibility:** Keystatic can only open component props written as strings or
  JSON (`tabs={[{"label":"CSS","language":"css","code":"…\n…"}]}`) — that is the form it
  writes itself. A hand-written template-literal `CodeBlock` renders fine on the site but
  the editor will refuse the file with "mdxJsxFlowElement has unexpected attributes".
  If you write by hand and want to edit later in the editor, use the JSON form.

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
   To make it insertable from the editor's `/` menu, add a `block()` for it in
   `keystatic.config.ts` → `components` (label + a `fields.*` entry per prop).
4. In the `.md` twin and `llms-full.txt` it becomes a "> Interactive demo: … open the page" note.

Shared building blocks for demos live in `BlogUI/mdx/`: `Compare`, `SegmentedControl`,
and `BlogUI/ui/` (`Button`, `Tooltip`, `Skeleton`). Need a slider/switch/etc.? Generate the
shadcn component **into `BlogUI/ui/`** (copy the file, fix imports to `@/lib/utils`) — do not
edit the site-wide `src/components/ui/*`.

---

## 4. Images and video

**In the editor** (default): the *Image* block, or drop/paste a picture into the content.
Keystatic saves it under `public/blog/…` and writes `<Img src="/blog/…" alt="…" />`.
Run **`npm run media:sync`** before committing: it mirrors `public/blog` to R2 (same
folders, hashed names) and updates `content/media-manifest.json`; production then serves
from R2, development from the local file. Width/height come from the manifest (or the file),
and `next/image` resizes/converts with a 1-year cache. Thumbnails use the *Thumbnail* field
the same way. Originals stay in git for the editor; keep them reasonable (≤ 2 MB, ≥ 1600 px
wide for in-post, 1200×630 for thumbnails).

**Videos / off-repo media**: R2 + `npm run media:upload` (see `docs/media-guide.md`):
```mdx
<Img src="blog/shot.3f9a1c2b.png" alt="…" width={1600} height={900} />   # R2 key: size required
<Video src="blog/clip.9b1d2e3f.mp4" aspect="16 / 9" />                    # short muted loop
```
The editor's *Video* block takes the R2 key/URL (or a Cloudflare Stream id).

Env for R2: `NEXT_PUBLIC_MEDIA_URL` (Vercel + `.env`), `R2_*` (`.env` only).

---

## 5. Add a category or subcategory

**In the editor:** `/admin-panel` → **Categories** (or `/keystatic` → **Settings → Categories**). Add an item (name, slug,
description, order; top-level ones also pick a colour and an icon), or open a category and add
entries under **Subcategories** (and, inside those, **Sub-subcategories**). Save.

Then **restart `npm run dev`** — the editor builds its post collections from this file when
it starts, so a new category only shows up in the *Posts* sidebar after a restart. The folder
under `content/blog/` is created automatically when you add the first post to it.

The file behind the screen is `content/categories.json`; the site reads it at build, so
sidebar order, colours, icons, routes, llms.txt and the sitemap all follow it.

Rules:
- Slugs are kebab-case and become the folder + URL segment. **Renaming a slug does not move
  existing posts** — rename the matching folder under `content/blog/` too.
- Subcategories inherit the parent's colour; only top-level categories have icons.
- The editor goes three levels deep; deeper nesting can be added by hand in the JSON.
- Removing a category with posts in it makes the build fail (posts in an unknown folder) —
  move or delete the posts first.

**New colour or icon names:** `CATEGORY_COLORS` / `CATEGORY_ICONS` in
`src/lib/blog/categories.ts`, then the matching maps in
`src/components/BlogUI/shell/category-icon.tsx` (colour → three maps; icon → lucide component)
and `HUES` in `src/app/og/blog/[...path]/route.tsx`.

---

## 6. Site-wide knobs

| What | Where |
|---|---|
| Blog URL prefix (`/blog` → `/blog`) | `BLOG_BASE` in `src/lib/blog/site.ts` **and** the literal `BLOG_BASE` + `config.matcher` in `src/proxy.ts` |
| Editor (fields, component blocks, collections per category) | `keystatic.config.ts`; UI at `/keystatic` (dev only), linked from `/admin-panel` |
| Site URL, blog name/description, author | `src/lib/blog/site.ts` |
| Media host (R2 URL → custom domain later) | `NEXT_PUBLIC_MEDIA_URL`; resolver in `src/lib/blog/media.ts`; `remotePatterns` + cache TTL in `next.config.mjs` |
| GitHub "View source" links | `GITHUB_REPO` in `site.ts` (repo must be public for links to work) |
| Code font | `Geist_Mono` in `src/app/blog/layout.tsx`; token scoped in `BlogUI/blog.css` (`.blog-root { --font-mono }`) |
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

## 7. Old URLs

The Mongo-era blog is gone. Its indexed URLs are 301-redirected in `next.config.mjs`
(`redirects()`): the Zustand post maps to its new path, the two Framer Motion posts go to
`/blog/motion`, and `/blogs-new/*` (the pre-cutover preview base) maps to `/blog/*`. Add a
redirect there whenever you rename or delete a published post.

---

## 8. Before you commit — checklist

- [ ] `npm run build` passes (content errors print the offending file path).
- [ ] New post has `title`, `description`, `publishedAt`; slug is kebab-case; folder is a real category.
- [ ] `published: true` if it should be public.
- [ ] `npm run media:sync` run; `content/media-manifest.json` committed with the images.
- [ ] Every `<Img>` has `alt`, `width`, `height`; hero image has `priority`.
- [ ] Demos are `"use client"`, exported from `demos/index.ts`, wrapped in `<Demo>`.
- [ ] No `border-*` utilities in BlogUI (use `hairline-*` / `shadow-border`).
- [ ] Nothing changed under `src/components/ui` or `src/components/UINewBlocks`.
- [ ] Check `<post>.md` and `/llms.txt` still read well (components degrade to notes/fences).
