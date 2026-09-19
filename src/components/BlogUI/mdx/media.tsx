import Image from "next/image";

import { mediaUrl, streamUrl } from "@/lib/blog/media";
import { cn } from "@/lib/utils";

// Reading column is ~590px wide on desktop; below lg it spans the viewport.
// Keeping this accurate lets next/image pick the smallest adequate srcset
// candidate instead of the 100vw default.
const COLUMN_SIZES = "(max-width: 1024px) calc(100vw - 3rem), 600px";

function Figure({
  caption,
  className,
  children,
}: {
  caption?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className={cn("my-6", className)}>
      <div className="overflow-hidden rounded-xl bg-card shadow-border">{children}</div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * `<Img src="blog/shot.3f9a1c.png" alt="…" width={1600} height={900} />`
 * `src` is an R2 key (from `npm run media:upload`) or any absolute URL.
 * Width/height are the intrinsic size and are required so the page never
 * shifts; next/image resizes and converts on the way through.
 */
export function Img({
  src,
  alt,
  width,
  height,
  caption,
  priority,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Figure caption={caption} className={className}>
      <Image
        src={mediaUrl(src)}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={COLUMN_SIZES}
        className="h-auto w-full"
      />
    </Figure>
  );
}

/**
 * `<Video src="blog/clip.9b1d2e.mp4" />` renders a native muted, looping,
 * autoplaying clip straight from R2 (short UI recordings). `<Video id="…" />`
 * embeds a Cloudflare Stream player instead (long videos with sound).
 * `aspect` keeps the box sized before the media loads.
 */
export function Video({
  src,
  id,
  poster,
  title,
  caption,
  aspect = "16 / 9",
  className,
}: {
  src?: string;
  id?: string;
  poster?: string;
  title?: string;
  caption?: string;
  aspect?: string;
  className?: string;
}) {
  if (!src && !id) throw new Error("<Video> needs either `src` (R2 key / URL) or `id` (Stream).");
  return (
    <Figure caption={caption} className={className}>
      <div className="relative w-full" style={{ aspectRatio: aspect }}>
        {id ? (
          <iframe
            src={streamUrl(id)}
            title={title ?? caption ?? "Video"}
            loading="lazy"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <video
            src={mediaUrl(src!)}
            poster={poster ? mediaUrl(poster) : undefined}
            title={title}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="absolute inset-0 size-full object-cover"
          />
        )}
      </div>
    </Figure>
  );
}
