# Media guide — R2 storage + next/image

Blog images and short clips are stored in a **Cloudflare R2** bucket (free tier: 10 GB,
no egress fees). Resizing, WebP conversion and caching are done by **`next/image`** on
Vercel — nothing else to pay for or configure. Long videos with sound can optionally use
Cloudflare Stream.

```
editor      →  public/blog/<post>/file.png   (local; shows in editor + dev server)
media:sync  →  R2  blog/<post>/file.<hash>.png + content/media-manifest.json
production  →  <Img src="/blog/…"> resolves to the R2 URL via the manifest
browser     →  /_next/image?url=…&w=640   (Vercel resizes + converts once, caches 1 year)
```

---

## 1. One-time setup (≈10 min)

### 1.1 Create the bucket
1. https://dash.cloudflare.com → left sidebar **R2 Object Storage** → *Create bucket*.
2. Name: `sidefolio-media`. Location: *Automatic*. Create.
   (R2 asks for a payment method once; the free tier covers 10 GB storage,
   10 M reads/month, and egress is always free.)

### 1.2 Make it public
1. Open the bucket → **Settings** → **Public access**.
2. **Now (domain not on Cloudflare):** *R2.dev subdomain* → *Allow Access*. Copy the URL,
   e.g. `https://pub-1a2b3c4d5e6f.r2.dev`.
   → `NEXT_PUBLIC_MEDIA_URL=https://pub-1a2b3c4d5e6f.r2.dev`
   r2.dev is rate-limited and "not for production" in Cloudflare's words, but here only
   Vercel's image optimizer fetches from it (once per size, then cached for a year), so
   traffic to it is tiny. Short `<Video>` clips *are* served from it directly — fine at
   blog scale.
3. **Later (once DNS is on Cloudflare):** same screen → *Custom Domains* → *Connect
   Domain* → `media.indrabuildswebsites.com`. Change `NEXT_PUBLIC_MEDIA_URL` to
   `https://media.indrabuildswebsites.com`, redeploy. Existing keys keep working.

### 1.3 CORS (only needed for `<Video src>` and fonts — safe to set now)
Bucket → **Settings** → **CORS policy** → Add:
```json
[{ "AllowedOrigins": ["https://www.indrabuildswebsites.com", "https://*.vercel.app", "http://localhost:3000"],
   "AllowedMethods": ["GET", "HEAD"], "AllowedHeaders": ["*"], "MaxAgeSeconds": 86400 }]
```

### 1.4 API token (upload script only)
1. **R2 Object Storage** → *Manage R2 API Tokens* (right side) → *Create API token*.
2. Name `sidefolio media upload`; Permissions **Object Read & Write**; *Specify bucket* →
   `sidefolio-media`; TTL forever. Create.
3. The page shows **Access Key ID** and **Secret Access Key** once. Also note the
   **Account ID** shown in the S3 endpoint `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.

### 1.5 Env vars
`.env` (local only — the script runs on your machine):
```
NEXT_PUBLIC_MEDIA_URL=https://pub-xxxx.r2.dev
R2_ACCOUNT_ID=…
R2_ACCESS_KEY_ID=…
R2_SECRET_ACCESS_KEY=…
R2_BUCKET=sidefolio-media
```
Vercel → Settings → Environment Variables: **only** `NEXT_PUBLIC_MEDIA_URL` (all
environments). Redeploy after adding it — `next.config.mjs` reads it at build time to
allow the host in `images.remotePatterns`.

---

## 2. Uploading

### 2a. Editor images → `npm run media:sync` (the normal path)
Images you add in the editor are saved to `public/blog/<post>/…` and referenced in MDX as
`/blog/…`. They work immediately in development from the local folder. Before you commit:

```bash
npm run media:sync            # uploads new/changed files, skips the rest
npm run media:sync -- --dry   # preview
```
- Mirrors the **same folder structure** into the bucket, adding a content hash before the
  extension: `public/blog/hello-mdx/shot.png` → `blog/hello-mdx/shot.3f9a1c2b.png`.
- Records each file in `content/media-manifest.json` (path → key + width/height).
  **Commit the manifest with the post** — the production build reads it and serves those
  images from R2; anything not in the manifest falls back to the copy in `public/`.
- Unchanged files are skipped by hash; existing objects are detected with a HEAD.
- Files deleted (or replaced) locally are dropped from the manifest **and deleted from R2**.
  `--keep` skips the delete; `--prune` additionally removes every object under `blog/`
  in the bucket that the manifest doesn't reference (use after manual clean-ups).
  A page that is already deployed keeps pointing at an old key until the next deploy, so
  push soon after a sync that removed something.
- The MDX never changes — the editor keeps working from the local files.

Workflow: write & upload in the editor → `npm run media:sync` → `git add` post + images +
manifest → push.

### 2b. Files outside the editor → `npm run media:upload`

```bash
npm run media:upload -- ./screenshots/dot-flight.png --alt "Sidebar dot mid-flight"
npm run media:upload -- ./clips/tabs.mp4
npm run media:upload -- ./a.png ./b.jpg ./c.webp          # batch
```
Output per file:
```
✓ dot-flight.png  →  blog/dot-flight.3f9a1c2b.png  (412 KB)
  url: https://pub-xxxx.r2.dev/blog/dot-flight.3f9a1c2b.png
  <Img src="blog/dot-flight.3f9a1c2b.png" alt="Sidebar dot mid-flight" width={1600} height={900} />
  thumbnail: blog/dot-flight.3f9a1c2b.png
```
What the script does:
- names the object `blog/<slug>.<8-char sha256>.<ext>` — **same file → same key** (re-uploads
  are skipped), **changed file → new key** (so caches never serve a stale image);
- sets `Cache-Control: public, max-age=31536000, immutable` and the right `Content-Type`;
- reads PNG/JPEG/GIF/WebP dimensions for the `<Img>` snippet.

Prefer PNG for UI screenshots, JPEG/WebP for photos. Upload the largest size you have
(≥ 1600 px wide for in-post images, 1200×630 for thumbnails); the optimizer makes the
small versions.

Manual alternative: bucket → *Upload* in the dashboard. Then write the key yourself and
set `Cache-Control` in the object's metadata (the script does this for you).

---

## 3. Using media in MDX

```mdx
<Img src="blog/dot-flight.3f9a1c2b.png" alt="Sidebar dot mid-flight" width={1600} height={900} />
<Img src="blog/hero.8c1d9e0f.png" alt="…" width={2400} height={1350} priority caption="Fig. 1" />
<Img src="https://any-host/full-url.png" alt="…" width={800} height={600} />   # absolute URLs pass through
<Video src="blog/tabs.9b1d2e3f.mp4" aspect="16 / 9" poster="blog/tabs-poster.1a2b3c4d.jpg" />
<Video id="<stream id>" title="Walkthrough" />                                # Cloudflare Stream (optional)
```
- `alt`, `width`, `height` required on `<Img>` (`alt=""` only if decorative).
  `width`/`height` = intrinsic pixels; the image renders fluid and `sizes` tells the
  browser the column is ~600 px on desktop, so phones get a ~640 px WebP, not the original.
- `priority` on at most one image per post (visible on first paint); everything else lazy.
- Frontmatter `thumbnail: blog/hero.8c1d9e0f.png` (key or URL) → Open Graph / Twitter
  image and JSON-LD. 1200×630 recommended. Without it, the generated `/og/blog/…` card is used.
- Plain Markdown `![alt](https://…)` still works but has no size hint (small layout
  shift) and is not optimized unless the host is in `remotePatterns`. Use `<Img>`.
- In the `.md` twin / `llms-full.txt`, `<Img>` becomes `![alt](absolute url)`.

---

## 4. How caching works (and why it's safe to cache for a year)

Per the Next.js image docs, the optimized image's max-age is the **larger** of
`images.minimumCacheTTL` and the upstream `Cache-Control: max-age`, and it is forwarded to
CDNs and browsers. There is no cache invalidation for `/_next/image`, so long TTLs are
only safe when a changed source gets a **new URL** — which the hashed key guarantees.

Configured in `next.config.mjs`:
| Setting | Value | Why |
|---|---|---|
| `remotePatterns` | `https`, exact media host, `pathname: "/**"`, `search: ""` | only your bucket can be optimized; no query-string enumeration |
| `minimumCacheTTL` | `31536000` (1 year) | hashed keys → immutable |
| `formats` | `["image/webp"]` | AVIF would double optimizer cache storage for little gain on UI screenshots |
| `qualities` | `[75]` | Next 16 requires an allow-list; one value keeps the cache small |
| `deviceSizes` / `imageSizes` | defaults | `<Img sizes>` already narrows what gets generated |

R2 object headers set by the script: `Cache-Control: public, max-age=31536000, immutable`.

Vercel Hobby optimizes up to 1,000 **source** images/month for free (each original counts
once, whatever sizes are generated); Pro is 5,000. A blog stays far below.

---

## 5. Videos
- **Short silent UI clips** (≤ ~20 s): export as H.264 MP4 (or WebM), ≤ 1080p, upload to R2,
  `<Video src>`. Add a `poster` for the first frame. Served straight from R2.
- **Long / with sound**: enable Cloudflare Stream ($5/mo per 1,000 min), set
  `NEXT_PUBLIC_CF_STREAM_CUSTOMER` (from any video's *Embed* code:
  `customer-XXXX.cloudflarestream.com`), use `<Video id>`.
- Often a live demo component beats a video of one — consider `BlogUI/demos/` first.

---

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| Build: `NEXT_PUBLIC_MEDIA_URL is not set; cannot resolve media key` | Add the var in `.env` / Vercel, redeploy |
| `next/image` 400 "hostname not configured" | `NEXT_PUBLIC_MEDIA_URL` missing **at build time** (it feeds `remotePatterns`); redeploy after setting it |
| Image 404 from r2.dev | Public access not enabled on the bucket, or key typo (keys are case-sensitive) |
| Script: `AccessDenied` | Token not scoped to this bucket, or wrong `R2_ACCOUNT_ID` |
| Script: `unsupported extension` | Add the type to `TYPES` in `scripts/media-upload.mjs` |
| Updated an image but the site shows the old one | You overwrote the object manually; re-run the script instead — it produces a new hashed key |
| Video won't play in Safari | Use H.264 MP4 with `-movflags +faststart`; WebM is not supported there |
