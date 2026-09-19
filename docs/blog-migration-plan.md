# Blog migration plan — adopt `gustavo-fior/craft` mechanics, keep sidefolio styling

Date: 2026-09-18. Status: **Phases 0–5 done** (⌘K menu deferred). `/blogs-new` is feature-complete on sample content: static pages, animated sidebar, `.md` twins + `Accept: text/markdown` proxy, `/llms.txt`, `/llms-full.txt`, `/og/blog/…` cards, post toolbar (copy Markdown / copy link / view source). Next: Phase 6 (content + media migration — needs Mongo access and Cloudflare details) or restyle of the legacy demos.

---

## 1. How craft works (what we are adopting)

### 1.1 Content pipeline
| Piece | craft implementation |
|---|---|
| Source of truth | `content/<section>/<slug>.mdx` files in the repo. No DB, no CMS. |
| Frontmatter | `title`, `description`, `section` (enum), `order`, `publishedAt`, `resources[]` |
| Loader | **Content Collections** (`@content-collections/core` + `/mdx` + `/next`). `content-collections.ts` defines a zod schema + `transform` that compiles MDX at build time (`compileMDX`) and adds `slug`, `sourcePath`, `mdx` (compiled JS string). |
| Import | `import { allConcepts } from "content-collections"` — typed, static, zero runtime fetch. `next.config.ts` wraps with `withContentCollections()`. |
| Syntax highlighting | Custom rehype plugin (`src/lib/rehype-syntax-highlight.ts`) runs **shiki** at compile time on fenced *and inline* code, dual theme (`light: github-light`, `dark: vesper`, `defaultColor:false`) → CSS vars `--shiki-light/--shiki-dark` switched by `.dark`. Inline code language is sniffed (css / html / tsx). |
| Drafts | `src/lib/concepts.ts` — a launch allow-list; unlaunched posts render in dev only, hidden from sidebar/sitemap/llms in prod. |
| Indentation hack | `preserveCodeIndentation()` escapes leading spaces as `\x20` inside `code:` template literals so MDX doesn't dedent `<CodeBlock>` props. |

### 1.2 Rendering
- `src/components/app/mdx.tsx` — one `components` map passed to `MDXContent` (from `@content-collections/mdx/react`): prose overrides (`h2 h3 p a ul ol strong code pre blockquote hr`) **plus a registry of every demo component by name** (`ButtonPressDemo`, …) plus `CodeBlock`, `LinkList`, `Demo`.
- MDX authors just write `<ButtonPressDemo />` — no imports in the MDX file.
- `[slug]/page.tsx` — `generateStaticParams`, `generateMetadata` (canonical, `text/markdown` alternate, OG, twitter), JSON-LD `TechArticle`, `<Mdx code={concept.mdx}/>`, `<Resources/>`, `<ConceptPager prev next/>` (prev/next computed from sidebar order).

### 1.3 Live code
- **`CodeBlock` (async server component)** → highlights each tab via `shiki.codeToHtml` → hands HTML to **`CodeBlockClient`**: tab pill with `motion` `layoutId`, animated panel height (`useLayoutEffect` + `ResizeObserver`), copy button, filename header derived from language, keyboard arrows between tabs, `inert` on inactive panels.
- **Demos** live in `src/components/demos/*.tsx` (client components). Wrapped in `<Demo>` (a `<figure>`), often use `<Compare>/<CompareItem verdict="wrong|right">`, `SegmentedControl`, `Slider`.
- Demo + explanation + `<CodeBlock tabs=[{Tailwind},{CSS}]>` is the standard essay shape.

### 1.4 Sidebar (the category/section animation)
`src/components/app/sidebar-nav.tsx` (client):
- Fixed left `<aside>`, vertically centered, `fade-mask-y` gradient mask top/bottom, hidden scrollbar. On mobile the same `SidebarNav` renders inside a `Sheet`.
- Rows: 3 static pages, then sections (icon + label) → concept links. Each section has a **colour** (`sectionTextColor`, `dotColorFrom/To` maps → CSS vars `--dot-from`, `--dot-to`).
- **Active dot** = one `motion.span` with a shared `layoutId` so it *flies* between rows (spring `stiffness 800 / damping 52`). On top of the layout projection an `x` keyframe `[0, -arc, -5, 0]` bows it out to the left; arc size scales with rows travelled (10→36px).
- Colour crossfade is pure CSS (`@keyframes dot-crossfade` from `--dot-from` to `--dot-to`) because Motion can't interpolate Tailwind oklch vars.
- **Name recoil**: active label is a `motion.span` animated `x: 12`, delayed until the dot "impacts" (`DOT_FLIGHT_MS * 0.8`). Then `name-hit` runs a `background-clip:text` gradient sweep using registered `@property --name-sweep / --name-tint`.
- Travel direction is derived state (`useState` updated during render) so the dot mounts already knowing where it came from.
- Optional sounds (`@web-kits/audio`) on hover/click with pitch rising down the list.

### 1.5 Shell & extras
- Fixed header: mobile nav trigger, wordmark, action buttons (copy as Markdown, copy link, view in repo, theme cycle, sound toggle) with tooltips.
- `CommandMenu` (⌘K, cmdk) listing pages + concepts by section.
- `src/proxy.ts` (Next 16 middleware) rewrites `/<slug>.md` and `Accept: text/markdown` → `/md/<slug>` route which serves the MDX converted to plain Markdown (`src/lib/markdown.ts`: `<CodeBlock>` → fences, `<LinkList>` → bullets, demos → "open the page" note).
- `/llms.txt`, `/llms-full.txt`, `/og/[slug]` (satori `ImageResponse`), `sitemap.ts`, `robots.ts`.
- Index page: sections → `ConceptCard` grid with hand-drawn `thumbnails`.

---

## 2. Where sidefolio is today

| Area | Current state |
|---|---|
| Storage | MongoDB (`Blog`, `BlogCategory` models). Posts are TinyMCE **HTML** (`contentType:'html'`) or raw `mdx` text. |
| Authoring | `/admin-panel/*` pages + ~15 API routes (`upload-blog`, `update-blog`, categories, imagekit auth …). |
| Rendering | `src/app/blog/[category]/[slug]/page.tsx` — DB fetch at request time (`revalidate = 3600`), Prism for HTML, and a regex-based `MDXContentRenderer` (react-markdown + Prism + hand-rolled `<Component prop="x"/>` parser). Only self-closing string-prop components work; no real MDX. |
| URLs | `/blog` → categories grid; `/blog/[category]` → paginated posts; `/blog/[category]/[slug]` → post. **Keep these** (SEO). |
| Interactive bits | `blog/components/interactive/{ColorPicker,AnimatedDeleteButton,VariantDeleteButton}` — reusable as the first "demos". |
| Design system | Tailwind v4 oklch tokens, `hairline-*` / `shadow-border` / `bezel` utilities (never CSS borders), `HairlineGrid` layout block (`GRID_WIDTH` column + rails), `Typography` (`Heading`/`Text` variants — the *only* place type lives), Inter, top `Navbar` (sticky, `hairline-b`), `next-themes` (default dark), `next-view-transitions`, `motion` v12 already installed. |
| Home | `HomeBlog` fetches `/api/get-all-blogs?isFeatured=true` client-side. |
| Versions | Next 16.3.5, **React 18.2** (Next 16 expects React 19 — pre-existing risk, see §7), Tailwind 4.3, motion 12.19. `next-themes` is in package.json but not in `node_modules` (needs `npm install`). |

---

## 3. Target architecture (mechanism = craft, skin = sidefolio)

### Route strategy
- Build everything under a **new route `/blogs-new`** so the existing `/blog` (Mongo) keeps working untouched during the build.
- Cutover (after §6 checklist passes): delete the old `app/blog` tree, rename `app/blogs-new` → `app/blog` (**final base is `/blog`**, so indexed URLs survive with no redirects), flip `BLOG_BASE` in `src/lib/blog/site.ts` **and** the literal `BLOG_BASE` + `config.matcher` in `src/proxy.ts`, and switch `navlinks.tsx`.
- All internal links, `proxy.ts` matchers, sitemap, llms and OG paths read a single `BLOG_BASE = "/blogs-new"` constant in `src/lib/blog/site.ts` so the rename is a one-line change.

### Nested categories
Categories are a **tree** of arbitrary depth (category → subcategory → … → posts). Folder structure mirrors the tree; the sidebar renders it recursively.

Initial top-level categories (decided 2026-09-18; sidebar order = this order):

| # | Name | Slug (folder + URL) | Icon (lucide) | Colour hue (dot / icon) |
|---|---|---|---|---|
| 1 | Motion | `motion` | `Spline` (bezier) | violet |
| 2 | Design Engineering | `design-engineering` | `PenTool` | orange |
| 3 | Redesigning | `redesigning` | `Layers` | amber |
| 4 | How to AI | `how-to-ai` | `Sparkles` | cyan |
| 5 | Experiment | `experiment` | `FlaskConical` | emerald |
| 6 | Full Stack | `full-stack` | `Server` | blue |

- `redesigning` is the "case studies" category; description in `categories.ts` says so.
- Adding a category later = one entry in `categories.ts` + a folder under `content/blog/`. Adding a subcategory = a `children` entry + a nested folder. Nothing else changes (routes, sidebar, index, llms, sitemap all derive from the tree).
- Each category starts with `children: []`; subcategories are added on demand.
- Hues are chosen to sit on the neutral oklch palette; final values live in `category-icon.tsx` as `--dot-from/--dot-to` vars and are easy to retune.

```
content/
  blog/
    <category>/
      <post-slug>.mdx           ← frontmatter + prose + <Demo/> + <CodeBlock/>
      <subcategory>/
        <post-slug>.mdx         ← any depth; folder path = category path
content-collections.ts          ← schema + compileMDX + shiki rehype
next.config.mjs                 ← withContentCollections()
src/
  proxy.ts                      ← /blog/<cat>/<slug>.md rewrite + Accept: text/markdown
  lib/blog/
    categories.ts               ← static category config (slug, name, icon, colour, order)
    posts.ts                    ← groupByCategory(), isPostAvailable(), prev/next helpers
    markdown.ts                 ← mdx → plain markdown (ported)
    rehype-syntax-highlight.ts  ← ported as-is
    site.ts                     ← SITE_URL, GITHUB_REPO (content deep-links)
  components/BlogUI/            ← EVERYTHING blog-visual lives here (see §4b)
    ui/                         ← shadcn primitives generated fresh for the blog
      button.tsx, tooltip.tsx, sheet.tsx, slider.tsx, command.tsx, scroll-area.tsx …
    shell/
      blog-shell.tsx            ← server: rail + main column composition
      sidebar-nav.tsx           ← client: dot/recoil/sweep animation
      sidebar-nav.css.ts?  (no) ← keyframes go in blog.css (below)
      mobile-nav.tsx            ← client: Sheet trigger + SidebarNav
      category-icon.tsx         ← server-safe icon + colour maps
    post/
      post-header.tsx           ← server: breadcrumb, title, date, reading time
      post-pager.tsx            ← server
      post-toolbar.tsx          ← client: copy-md / copy-link (phase 5)
      resources.tsx             ← server (+ LinkList)
    index/
      post-card.tsx             ← server
      category-section.tsx      ← server
    mdx/
      mdx.tsx                   ← server: registry + prose map
      prose.tsx                 ← server: h2/h3/p/ul/… styled via Typography
      prose-link.tsx            ← server
      code-block.tsx            ← server (shiki) → code-block-client.tsx (client)
      demo.tsx, compare.tsx     ← server-safe wrappers
      segmented-control.tsx     ← client
      media.tsx                 ← server: <Img> / <Video> (Cloudflare)
    demos/                      ← client demo components (ColorPicker … moved here)
    command-menu.tsx            ← client (phase 5)
    blog.css                    ← blog-only @utility / @keyframes / shiki rules, imported by globals.css
  app/blogs-new/                ← temporary base; renamed at cutover
    layout.tsx                  ← BlogShell wraps everything under the base
    page.tsx                    ← index: category tree → post cards
    [...path]/page.tsx          ← catch-all: resolves to a category node OR a post
    md/[...path]/route.ts       ← markdown twin of a post
  app/llms.txt/route.ts, app/llms-full.txt/route.ts
  app/og/blogs/[...path]/route.tsx
scripts/
  export-mongo-to-mdx.ts        ← one-off migration
```

### Frontmatter schema (zod)
```yaml
title: string
description: string
# category is NOT in frontmatter: it is derived from the folder path
# (content/blog/a/b/post.mdx → categoryPath ["a","b"]) and validated against categories.ts
order: number (default 0)                  # position inside the category in the sidebar
publishedAt: "YYYY-MM-DD"
updatedAt?: "YYYY-MM-DD"
thumbnail?: string                         # Cloudflare Images URL (re-uploaded from ImageKit in Phase 6)
tags?: string[]
featured?: boolean                         # replaces isFeatured
readingTime: computed in transform (words / 200)
resources?: [{ url, title?, description? }]
```
`isPublished` → replaced by craft's launch allow-list (`src/lib/blog/posts.ts`), plus every file present renders in dev.

---

## 4. Styling mapping (craft → ours)

| craft | sidefolio replacement |
|---|---|
| `shadow-(--custom-shadow)` on cards/code blocks | `shadow-border` / `shadow-border-hover`; hairlines via `hairline-*` — **no `border-*` classes anywhere** |
| `border-b` in code-block header, `border-t` in pager | `hairline-b` / `hairline-t` |
| `bg-card`, `bg-muted`, `text-muted-foreground` | same token names already exist in our `globals.css` — keep |
| Prose overrides with raw `text-sm leading-[1.8]` | **Keep our current type**: `Text variant="body"` / `Heading variant` from `UINewBlocks/Typography`; add `h3` / `prose` variants there if needed. No new type sizes at call sites. |
| Redaction display font, Inter body | Inter only (`--font-sans`, `--font-heading`) — no display font |
| JetBrains Mono for code | **Geist Mono** via `next/font/google` (`Geist_Mono`), exposed as `--font-mono` in `@theme` and applied to `.shiki`, inline `code`, and the code-block header filename |
| Phosphor duotone icons | `lucide-react` (already used in Navbar) — one icon per category in `categories.ts` |
| Section colours (blue/rose/amber/violet…) | keep the *mechanism* (`--dot-from/--dot-to` CSS vars) but pick hues that sit on our neutral oklch palette; defined once in `categories.ts` |
| Fixed, vertically-centred `<aside>` | **On the HairlineGrid** (decided 2026-09-18): the blog uses `HairlineGridRoot` (rails + hatch bands, same `max-w-4xl` column as the homepage). Inside it a `13.5rem` sidebar cell with `hairline-r`; a `sticky top-14` box the height of the viewport keeps the nav vertically centred while the reading column scrolls (craft's centred rail, aligned to our grid). Toolbar row `hairline-b`; content `px-6 lg:px-10`. |
| Fixed transparent header with wordmark | none — our `Navbar` stays; header actions (copy md, copy link, theme) move into a small toolbar at the top of the post column |
| Base UI `Sheet` for mobile nav | our Radix `dialog.tsx`/`animated-modal` (or install `vaul` drawer) |
| Base UI `Tooltip`, `Button`, `Slider` | our `ui/tooltip`, `ui/button`; add `ui/slider` (Radix) when the first slider demo needs it |
| `max-w-160` (640px) content column | the grid's right cell (`max-w-4xl` − sidebar ≈ 670px, minus padding ≈ 590px measure) |
| shiki `github-light` / `vesper` | keep dual-theme mechanism; pick themes closer to our neutral palette (e.g. `github-light` / `github-dark-default` or `vesper`) — decide visually |
| Sounds | **not ported** (decided). `@web-kits/audio`, `sounds.ts`, `SoundToggle` are left out; hover/click handlers in the sidebar carry no side effects. |
| Hand-drawn card thumbnails / `ConceptCard` grid | **Hairline rows** (`BlogUI/index/post-row.tsx`), same pattern as the home "Writing" block: title, description, date, reading time, arrow; category header = `HairlineGrid.Eyebrow` with the category dot; subcategories indent with a small dot. `thumbnail` frontmatter is used only for OG/social. |
| `next/image` with `remotePatterns: **` | **Cloudflare for all blog media**: images via Cloudflare Images (`imagedelivery.net/<hash>/<id>/<variant>`), video via Cloudflare Stream (`<iframe>`/`<stream>` embed or HLS `<video>`). Add `<Img>` and `<Video>` MDX components that take a Cloudflare id + alt/caption and render `<figure>`; `next.config` `remotePatterns` for `imagedelivery.net` + `*.cloudflarestream.com`. ImageKit stays only for craft videos until those move too. |

---

## 4b. Component architecture & Next.js conventions (binding for every phase)

### Isolation
- **All blog UI lives in `src/components/BlogUI/`.** Nothing in `src/components/ui/*`, `UINewBlocks/*`, `Navbar`, `Typography`, or `globals.css` tokens is modified.
- shadcn primitives the blog needs are generated **into `BlogUI/ui/`** (`npx shadcn add button tooltip sheet slider command scroll-area …` then move, or add with a `--path` and fix the import alias). Existing `src/components/ui/*` files are never edited; if the blog needs a variant, it gets its own copy in `BlogUI/ui/`.
- Blog-only CSS (`fade-mask-y`, `scrollbar-hidden`, `dot-crossfade`, `name-hit`, `@property` registrations, `.shiki*`, `.code-block-panel`) lives in `BlogUI/blog.css` and is `@import`-ed from `globals.css` in one line — tokens are consumed, never redefined.
- Class composition always through `cn()` from `@/lib/utils` (clsx + twMerge). No string concatenation, no template-literal class lists. `Typography` `Heading`/`Text` are imported *read-only* for prose; new type sizes are not introduced at call sites.
- Icons: `lucide-react` only (shadcn's configured library).

### Server / client split (Next.js App Router rules)
- Default is **Server Component**. `"use client"` only on leaves that need state, effects, refs, browser APIs, or `motion` hooks:
  - client: `sidebar-nav.tsx`, `mobile-nav.tsx`, `code-block-client.tsx`, `segmented-control.tsx`, `post-toolbar.tsx`, `command-menu.tsx`, every file in `demos/`.
  - server: everything else — layout, pages, `mdx.tsx`, `prose.tsx`, `code-block.tsx` (shiki runs on the server, ships HTML), `post-header`, `post-card`, `resources`, `media.tsx`, `category-icon.tsx`.
- Client components receive **serialisable props only** (strings, numbers, plain objects, `NavSection[]`). No functions, no `allPosts` objects, no compiled MDX code across the boundary. The layout maps `allPosts` → the minimal `{ title, href, categoryPath }` rows before passing to `SidebarNav`.
- Server components may be passed as `children` into client wrappers (e.g. `<Demo>` server → demo client inside; `MobileNav` client wraps `SidebarNav`), never imported *into* a client file.
- `motion/react` is imported only inside client files; `layoutId` animation is scoped with `useId()` per `SidebarNav` instance (desktop + sheet render twice).
- Third-party client-only libs (`cmdk`, `vaul`/Sheet) are wrapped in a client file inside `BlogUI/` so server files never import them.
- `next/dynamic` with `ssr:false` is **not** used; demos SSR fine and hydrate.

### Rendering & caching (matches the "caching without Cache Components" model, since `cacheComponents` is not enabled site-wide and Mongo routes still exist)
- Every blog page is **fully static at build**: data comes from `content-collections` (a build-time import, not a fetch), so no dynamic APIs (`cookies()`, `headers()`, `searchParams`) are read anywhere under `/blogs-new`. This makes the segment prerender to static HTML + RSC payload.
- `[...path]/page.tsx`: `generateStaticParams()` lists every category path + post path; `export const dynamicParams = false` (unknown paths → 404, no on-demand render).
- Route handlers (`md/[...path]`, `llms*.txt`, `og/…`): `export const dynamic = "force-static"` + `generateStaticParams` where parameterised.
- Data helpers in `src/lib/blog/posts.ts` are pure functions over `allPosts`; the few that are called from both layout and page in one request (`buildNavTree`) are wrapped in `React.cache()` for per-request memoisation.
- `HomeBlog` reads `allPosts` on the server — no `/api` fetch, no client `useEffect`.
- `generateMetadata` uses only `allPosts` → static. `metadataBase` already set in root layout.
- Links: `next/link` (or the `next-view-transitions` `Link`) so the router prefetches static segments on viewport; no `router.push` except in the command menu.
- `next/image` for every Cloudflare image with explicit `width/height` (or `fill` inside an aspect-ratio box) to avoid CLS; `priority` only on the post hero.
- `loading.tsx` under `/blogs-new` with a skeleton built from `BlogUI/ui/skeleton` (kept because navigation between static segments still streams the RSC payload).
- `error.tsx` + `not-found.tsx` in the segment using BlogUI components.
- Optional later: if the whole site moves to `cacheComponents: true`, the blog needs no change beyond adding `'use cache'` + `cacheLife('max')` at the page level — noted, not done now.

### Accessibility / motion baseline
- `prefers-reduced-motion`: `useReducedMotion()` in client files disables arc keyframes, sweep, and panel-height tween (instant), keeps the dot's position change.
- Tab list in code block keeps `role="tablist"`, arrow-key navigation, `inert` on hidden panels (ported).
- Sidebar `nav aria-label="Blog"`, current page link gets `aria-current="page"`.

## 5. Phases

### Phase 0 — Decisions & prerequisites
1. Confirm §8 decisions (file-based content, admin panel retirement, category list).
2. `npm install` (restores `next-themes`).
3. Add deps: `@content-collections/core`, `@content-collections/mdx`, `@content-collections/next`, `shiki`, `zod`, `@types/mdx`. Optional later: `cmdk`, `vaul`, `@radix-ui/react-slider`.
4. Add `.content-collections/` to `.gitignore`; add `"content-collections": ["./.content-collections/generated"]` path to `tsconfig.json`.

### Phase 1 — Content pipeline
1. `src/lib/blog/categories.ts` — static **tree**: `{ slug, name, description?, icon?, color, order, children?: Category[] }`. Top-level nodes carry icon + colour; descendants inherit colour (used by the sidebar dot) unless overridden. Seed it with the six categories from §3 (each with empty `children`). Old Mongo posts are mapped onto these categories in Phase 6 (old DB slugs may differ → add 301 redirects for those specific old paths at cutover). Helpers: `flattenCategories()`, `findCategory(path[])`, `categoryHref(path[])`.
2. `content-collections.ts` — collection `posts`, directory `content/blog`, include `**/*.mdx`, schema from §3, transform: `compileMDX` with `rehypeSyntaxHighlight`, derive `slug` from filename and `categoryPath: string[]` from the folder path (fail the build if the path is not in `categories.ts`), `href = BLOG_BASE + "/" + [...categoryPath, slug].join("/")`, compute `readingTime`, keep `preserveCodeIndentation`, resolve `resources` (port `resolveResource` with build-time fetch + cache).
3. `next.config.mjs` — wrap with `withContentCollections`. Keep existing `images.remotePatterns` for ImageKit.
4. Port `rehype-syntax-highlight.ts` verbatim; add `.shiki` / `.shiki-inline` / `.code-block-panel` CSS to `globals.css` using our tokens and hairline utilities.
5. `src/lib/blog/posts.ts` — `buildNavTree()` (category tree with posts attached at each node, sorted by `order` then title), `flattenNav()` (depth-first row list — the sidebar dot's travel index and prev/next both come from this), `isPostAvailable()` (launch list + dev override), `getPrevNext()`, `resolvePath(path[])` → `{kind:"category"|"post", …}`.
6. Create the six category folders and write **one** sample post `content/blog/motion/hello-mdx.mdx` (plus one nested sample `content/blog/motion/springs/sample.mdx` to prove depth) using a fence, inline code, `<CodeBlock>` with two tabs, and `<ColorPicker />` to validate the whole chain.

### Phase 2 — Rendering primitives
0. Generate the shadcn primitives the blog needs into `BlogUI/ui/` (button, tooltip, sheet, skeleton; slider/command later). Create `BlogUI/blog.css` and import it from `globals.css`.
1. `BlogUI/mdx/mdx.tsx` (server) — `Mdx` wrapper + `components` map; `prose.tsx` routes elements through `Typography` variants; `code`/`pre` styled with `shadow-border`, `bg-card`, no borders.
2. `BlogUI/mdx/code-block.tsx` (server, shiki) + `code-block-client.tsx` (client: tabs pill `layoutId`, animated height, copy, `inert`). Header divider → `hairline-b`. File icons → lucide `FileCode`, or drop icons.
3. `demo.tsx`, `compare.tsx` (server-safe), `segmented-control.tsx` (client), `prose-link.tsx`, `resources.tsx` (+`LinkList`), `media.tsx` (`<Img id alt caption width height variant>` → `next/image` on `imagedelivery.net`; `<Video id caption poster>` → Cloudflare Stream embed, lazy, `playsInline`, reduced-motion respects autoplay=false).
4. Move `blog/components/interactive/*` → `BlogUI/demos/` (all `"use client"`) and register in the map. Delete `BlogContentRenderer.tsx`, `MDXContentRenderer.tsx`, `PrismHighlighter` usage in blog.
5. `mdx-components.tsx` at root (currently for `@next/mdx`) — remove along with `@next/mdx`/`@mdx-js/loader` config.

### Phase 3 — Routes & shell
1. `app/blog/layout.tsx` — `BlogShell` ported from craft's `site-shell.tsx` minus its header: fixed left `<aside>` (`top-1/2 -translate-y-1/2 w-56 pl-8 hidden lg:block`, nav height `calc(65vh+6rem)` with `py-12` so fade stops match), centred `<main className="mx-auto max-w-160 px-7 pt-28 pb-24">`, mobile drawer trigger placed in a small toolbar at the top of `<main>` (our `Navbar` remains the global header).
2. `app/blogs-new/page.tsx` — index: walks the category tree → section heading per top-level category (icon + label), nested sub-headings, `PostCard` grid (thumbnail, title, description, date, reading time). Static, from `allPosts`.
3. `app/blogs-new/[...path]/page.tsx` — one catch-all. `generateStaticParams` emits every category path *and* every post path. `resolvePath()` decides: **category node** → listing of its posts + child categories (breadcrumb of ancestors); **post** → `generateMetadata` (title, description, canonical, `alternates.types['text/markdown']`, OG image, twitter), JSON-LD `BlogPosting`, header (breadcrumb of category path, title, date, reading time), `<Mdx/>`, `<Resources/>`, `<PostPager/>`. No `dbConnect`, no `incrementBlogViews`, no `revalidate`.
5. `HomeBlog.tsx` — become a server component reading `allPosts.filter(featured)`; remove the fetch.
6. `sitemap.ts` — blog entries from `allPosts`.

### Phase 4 — Sidebar animation (the core port)
1. `category-icon.tsx` — `icons`, `categoryTextColor`, `dotColorFrom`, `dotColorTo` keyed by **top-level** category slug; nested nodes resolve to their root's colour.
2. `sidebar-nav.tsx` — port with constants unchanged (`DOT_FLIGHT_MS 350`, `DOT_IMPACT 0.8`, springs, arc 10–36px, `NAME_RECOIL/RETURN`). Rows come from `flattenNav()`: `[ {href: BLOG_BASE, label:'Index'}, …depth-first category headings and post links ]`. Rendering is a recursive `<NavGroup node depth>`: top-level heading = icon + label (like craft's section row, links to the category page), sub-category heading = label only, indented `pl-3` per depth with the same `mt-5` group spacing at depth 0 and `mt-2` deeper. The dot's `activeIndex` is the row's position in the flat list, so it arcs correctly across nested groups. Drop `playSound`, sound toggle, and `SHOW_NEW_BADGE` entirely — **no sound**.
3. `globals.css` — add `fade-mask-y`, `scrollbar-hidden`, `@keyframes dot-crossfade`, `@utility dot-crossfade`, `@property --name-sweep / --name-tint`, `@keyframes name-hit`, `@utility name-hit`. Colours reference `--dot-from/--dot-to` and `--foreground` (theme-aware via our tokens). `prefers-reduced-motion`: disable arc keyframe + sweep, keep instant dot move.
4. Mobile: same `SidebarNav` inside a drawer; close on `pathname` change.
5. `next-view-transitions` `Link` vs `next/link`: sidebar must use `next/link` (or the transitions `Link` with the same `href`) — verify the shared-layout dot still animates across a view transition; if VT interferes, opt the blog subtree out.

### Phase 5 — Agent/SEO extras (each independent, can ship later)
1. `src/lib/blog/markdown.ts` port + `app/blog/md/[category]/[slug]/route.ts` (`force-static`) + `src/proxy.ts` matcher `/blog/:category/:slug` for `.md` and `Accept: text/markdown`.
2. `app/llms.txt` + `app/llms-full.txt` routes.
3. `app/og/blog/[slug]/route.tsx` — satori card in our palette (Inter only); referenced by metadata.
4. `header-actions.tsx` — Copy as Markdown (prefetch on hover), Copy link; theme toggle already exists in Navbar.
5. `command-menu.tsx` — ⌘K with `cmdk` (nice-to-have).
6. "View source" link → GitHub content path (`site.ts`).

### Phase 6 — Content migration (Mongo → MDX)
1. `scripts/export-mongo-to-mdx.ts` (run once with `MONGODB_URI`): for each published `Blog`, write `content/blog/<category.slug>/<slug>.mdx` with frontmatter from `title/description/publishedAt/thumbnail/tags/isFeatured/seo.*`.
   - `contentType:'mdx'` → body copied as-is; convert `<Component prop='x' />` string props to real JSX (`prop="x"` is fine).
   - `contentType:'html'` → convert with `rehype-parse` + `rehype-remark` + `remark-stringify` (dev-only deps), then **manual review** of every file (tables, images, TinyMCE spans).
2. Unpublished drafts export too but are omitted from the launch list.
3. Diff old vs new URL list; every old `/blog/c/s` must exist as a file.
4. **Media → Cloudflare** *(Cloudflare account details are not set up yet — I will ask for the Images delivery hash, Stream customer code and an API token when this step starts; until then `<Img>`/`<Video>` are built against the documented URL shapes and the sample post uses placeholder ids)*: script step that downloads each post's ImageKit assets, uploads to Cloudflare Images (API token + account id env vars), and rewrites `<img src>` / thumbnail URLs to `imagedelivery.net/...` in the generated MDX (or to `<Img id="…" />`). Videos → Cloudflare Stream. Keep a `media-map.json` (old URL → new id) for auditing.

### Phase 7 — Cleanup (after cutover verified)
- Delete the old `app/blog` tree, rename `app/blogs-new` → `app/blog`; update `BLOG_BASE` to `/blog`, `navlinks.tsx`, `HomeBlog`, sitemap. No redirects needed.
- Delete `app/admin-panel/{blogs,categories,create-blog,edit-blog}`, blog/category API routes, `api/models/Blog.ts`, `api/models/BlogCategory.ts`, `types/blog.tsx`, `lib/blogHelpers.ts` (if blog-only), `lib/getAllBlogs.ts`, `BlogLayout/BlogLink/BlogCategoryLink/Blogs/FeaturedBlog` legacy components, `PrismHighlighter`.
- Remove deps: `@next/mdx`, `@mdx-js/loader`, `next-mdx-remote`, `react-markdown`, `remark-gfm`, `prismjs`, `@types/prismjs`, `@mapbox/rehype-prism`, `tinymce`, `@tinymce/tinymce-react`.
- **Keep**: Mongo + ImageKit + admin for **craft videos** (`CraftVideo` model, `/admin-panel/craft-videos`, `api/craft/*`), `dbConnect`, `imagekit*`.
- Update `.env.example`: drop TinyMCE key (R2 vars already added). `README.md` "how to add a post / upload media".

---

## 6. Verification checklist (you run these — no dev server / screenshots from me)
- [ ] `npm run build` passes; `.content-collections/generated` has every post.
- [ ] During build: `/blogs-new`, `/blogs-new/<cat>`, `/blogs-new/<cat>/<sub>`, `/blogs-new/<cat>/…/<slug>` all render; old `/blog` still works untouched.
- [ ] After cutover: every URL from the old sitemap resolves (or 301s) under the final base.
- [ ] Nested categories: sidebar shows indentation per depth, dot arcs correctly when jumping between a deeply nested post and a top-level one, category heading links open the listing page, breadcrumb on post shows the full path.
- [ ] Sidebar: dot flies with arc between rows, colour crossfades between categories, label recoils and sweeps; works in dark + light; mobile drawer opens/closes on navigation.
- [ ] Reduced-motion: dot jumps without arc/sweep.
- [ ] Code block: tabs morph, height animates, copy works, horizontal scroll on long lines, both shiki themes switch with theme toggle, no `!important` leaks.
- [ ] Inline code highlighted; fenced ```tsx highlighted at build (view source → no runtime shiki).
- [ ] A demo component renders inside prose and is interactive.
- [ ] `/blog/<cat>/<slug>.md` returns markdown; `curl -H 'Accept: text/markdown'` on the HTML URL does too; `/llms.txt` lists all posts.
- [ ] OG image renders at `/og/blog/<slug>`; metadata canonical/OG/twitter present in `<head>`.
- [ ] No `border-*` utility on any new blog component (grep); all lines are `hairline-*`/`shadow-border`.
- [ ] `grep -rl "use client" src/components/BlogUI` lists only the files named in §4b; no client file imports from `content-collections`.
- [ ] `git diff --stat` shows zero changes under `src/components/ui`, `src/components/UINewBlocks`, and no token edits in `globals.css` (only the one `@import`).
- [ ] `next build` output marks every `/blogs-new/*` route as `○ (Static)`; no `ƒ (Dynamic)` under the segment.
- [ ] Every class list in BlogUI goes through `cn()` (grep for `className={\``).
- [ ] Home "Writing" section shows the featured post without a client fetch.
- [ ] Sidebar is fixed and vertically centred on `lg:`, does not overlap the Navbar or the `max-w-160` column at 1024px; hidden below `lg:` with drawer working.
- [ ] `<Img>` / `<Video>` render from Cloudflare (Images variants + Stream), lazy-load, no layout shift (explicit width/height).
- [ ] Craft videos admin still works after cleanup.

---

## 7. Risks
- **React 18.2 + Next 16**: pre-existing mismatch; content-collections and `motion` are fine on 18, but if the build already warns, upgrading to React 19 should be its own task before Phase 1.
- **`next-view-transitions`** may fight `motion`'s `layoutId` on route change (dot animation). Test early in Phase 4; fallback = plain `next/link` inside `/blog`.
- **HTML → Markdown conversion** of TinyMCE posts is lossy; budget manual review per post.
- **Build-time `resources` fetch** needs network on Vercel; falls back to domain (as in craft) — acceptable.
- **`proxy.ts`** is Next 16's middleware name; confirm our version supports it (craft runs 16.2, we run 16.3 — yes).

---

## 8. Decisions
Settled (2026-09-18):
- ✅ File-based MDX replaces MongoDB for blogs; admin panel + TinyMCE retired for blogs.
- ✅ Sidebar exactly like craft: fixed, vertically centred left aside (Navbar stays as global header).
- ✅ Typography: keep current Inter + `Typography` variants; simple body copy, no display font.
- ✅ Media: Cloudflare R2 (originals) + next/image (transforms). Stream optional for long videos. ImageKit retired for blog.

- ✅ Categories: same style as craft, **nested to any depth** (folder tree = category tree).
- ✅ No sound.
- ✅ Code font: Geist Mono (`--font-mono`).
- ✅ Build under `/blogs-new`; rename to the final base at cutover (old `/blog` untouched until then).
- ✅ Media decision (2026-09-19): **Cloudflare R2 for storage + `next/image` for resizing/format/caching** (hashed immutable keys, 1-year TTL). No Cloudflare Images/Stream subscription. Tooling: `scripts/media-upload.mjs` (`npm run media:upload`), `src/lib/blog/media.ts`, `docs/media-guide.md`. ⏳ User creates the bucket + token and sets `NEXT_PUBLIC_MEDIA_URL` / `R2_*`.

- ✅ Final base path is `/blog` (rename `blogs-new` → `blog` at cutover; no redirects).
- ✅ Category tree: six top-level categories (Motion, Design Engineering, Redesigning, How to AI, Experiment, Full Stack), each may get subcategories later; more categories can be added any time. Old Mongo posts mapped onto these in Phase 6 (do **not** query the DB before then).

Nothing blocks Phase 0–5.

---

## 9. Candidate follow-up: retire MongoDB + ImageKit entirely
After Phase 7, the only remaining users of MongoDB and ImageKit are the **craft videos**
(`/craft`, `api/craft/*`, `CraftVideo` model, admin craft-videos, `api/upload-video`,
`api/imagekit-auth`), plus `sitemap.ts` and `api/admin/dashboard-stats`. Moving craft to a
content-collections list (`content/craft/*.mdx` or a typed TS array) with videos on
Cloudflare Stream would let us delete `mongoose`, `imagekit`, `dbConnect`, the admin panel
and `MONGODB_URI` / `IMAGEKIT_*` env vars, leaving the whole site static. Not scheduled yet.
