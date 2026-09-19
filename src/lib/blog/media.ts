import manifest from "../../../content/media-manifest.json";

// Where blog media is served from.
//
// - "/blog/…"      a file the editor saved under public/blog. In development
//                  it is served locally; in production builds it is served
//                  from R2 when `npm run media:sync` has uploaded it (recorded
//                  in content/media-manifest.json), else from /public.
// - "blog/…"       an R2 key from `npm run media:upload` (no leading slash).
// - "https://…"    passes through untouched.

type ManifestEntry = { key: string; hash: string; width?: number; height?: number };
const MANIFEST = manifest as Record<string, ManifestEntry>;

const MEDIA_URL = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/$/, "");
const SERVE_FROM_R2 = process.env.NODE_ENV === "production" && MEDIA_URL !== "";

export function isAbsoluteUrl(value: string) {
  return /^https?:\/\//.test(value);
}

/** Images the editor saves into public/blog are referenced as "/blog/…". */
export function isLocalPath(value: string) {
  return value.startsWith("/");
}

/** Manifest entry for a local path, if it has been synced to R2. */
export function syncedMedia(localPath: string): ManifestEntry | undefined {
  return MANIFEST[localPath];
}

function r2Url(key: string) {
  if (!MEDIA_URL) {
    throw new Error(
      `NEXT_PUBLIC_MEDIA_URL is not set; cannot resolve media key "${key}". See docs/media-guide.md.`,
    );
  }
  // Keys keep the original file names (spaces, "@", "(1)" …); encode per segment.
  const encoded = key.replace(/^\//, "").split("/").map(encodeURIComponent).join("/");
  return `${MEDIA_URL}/${encoded}`;
}

/** URL usable by next/image. */
export function mediaUrl(keyOrUrl: string) {
  if (isAbsoluteUrl(keyOrUrl)) return keyOrUrl;
  if (isLocalPath(keyOrUrl)) {
    const synced = SERVE_FROM_R2 ? syncedMedia(keyOrUrl) : undefined;
    return synced ? r2Url(synced.key) : keyOrUrl;
  }
  return r2Url(keyOrUrl);
}

/** Absolute URL for metadata (Open Graph, JSON-LD, .md twins). */
export function absoluteMediaUrl(keyOrUrl: string, siteUrl: string) {
  const url = mediaUrl(keyOrUrl);
  return isLocalPath(url) ? `${siteUrl}${url}` : url;
}

/** Cloudflare Stream player URL (optional; only if Stream is enabled). */
export function streamUrl(id: string) {
  const customer = process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER;
  if (!customer) {
    throw new Error("NEXT_PUBLIC_CF_STREAM_CUSTOMER is not set; pass `src` to <Video> instead of `id`.");
  }
  return `https://customer-${customer}.cloudflarestream.com/${id}/iframe`;
}
