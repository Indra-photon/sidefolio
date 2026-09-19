import { withContentCollections } from "@content-collections/next";

// Public media host (Cloudflare R2). Read at build time so remotePatterns
// stays strict: exact host, https only, no query strings.
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_URL
  ? new URL(process.env.NEXT_PUBLIC_MEDIA_URL).hostname
  : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      ...(mediaHost
        ? [{ protocol: "https", hostname: mediaHost, pathname: "/**", search: "" }]
        : []),
    ],
    // Blog media keys carry a content hash, so a changed file is a new URL and
    // optimized images can be cached for a year (Next uses the larger of this
    // and the upstream Cache-Control max-age, and forwards max-age downstream).
    minimumCacheTTL: 31536000,
    // WebP only: AVIF would double the optimizer's cache storage for a
    // marginal size win on screenshots.
    formats: ["image/webp"],
    qualities: [75],
  },
  turbopack: {},
};

export default withContentCollections(nextConfig);
