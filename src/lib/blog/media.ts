// Media lives in a public Cloudflare R2 bucket. MDX and frontmatter refer to
// objects by key ("blog/dot-flight.3f9a1c.png"); this resolves them to the
// public URL so the same content works on r2.dev today and on a custom
// domain later. Absolute URLs pass through untouched.

const MEDIA_URL = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/$/, "");

export function isAbsoluteUrl(value: string) {
  return /^https?:\/\//.test(value);
}

export function mediaUrl(keyOrUrl: string) {
  if (isAbsoluteUrl(keyOrUrl)) return keyOrUrl;
  if (!MEDIA_URL) {
    throw new Error(
      `NEXT_PUBLIC_MEDIA_URL is not set; cannot resolve media key "${keyOrUrl}". See docs/media-guide.md.`,
    );
  }
  return `${MEDIA_URL}/${keyOrUrl.replace(/^\//, "")}`;
}

/** Cloudflare Stream player URL (optional; only if Stream is enabled). */
export function streamUrl(id: string) {
  const customer = process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER;
  if (!customer) {
    throw new Error("NEXT_PUBLIC_CF_STREAM_CUSTOMER is not set; pass `src` to <Video> instead of `id`.");
  }
  return `https://customer-${customer}.cloudflarestream.com/${id}/iframe`;
}
