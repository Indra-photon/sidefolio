"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

/**
 * PendantLamp — a light fixture that points at its children. CSS + inline SVG.
 *
 * Theme-specific via tokens in globals.css (`--lamp-*`):
 *   dark  → additive warm beam (plus-lighter) on the dark card
 *   light → warm multiply tint + a soft shadow under the shade, so the lamp
 *           still reads on white without trying to "glow"
 *
 *  - beam: clip-path cone, blurred; pool: elliptical radial gradient
 *  - swing: whole fixture rotates about the cord anchor (transform only)
 *  - pointer x tilts the lamp up to ±3°; one-shot flicker on mount
 *  - reduced motion: beam on, no sway, no flicker
 */

// Wall grain: tiny SVG turbulence as a data URI, tiled.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function PendantLamp({
  children,
  className,
  /** Cord length in px — where the shade hangs */
  drop = 64,
}: {
  children: ReactNode;
  className?: string;
  drop?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--tilt", `${(((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2)}deg`);
  };
  const onLeave = () => ref.current?.style.setProperty("--tilt", "0deg");

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={twMerge("relative flex h-full min-h-[400px] w-full flex-col justify-end overflow-hidden bg-background", className)}
      style={{ "--tilt": "0deg", "--drop": `${drop}px` } as CSSProperties}
    >
      {/* wall grain */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[var(--lamp-grain)]" style={{ backgroundImage: GRAIN }} />

      {/* fixture + beam: one swinging group anchored at the ceiling */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 origin-top" style={{ transform: "rotate(var(--tilt))" }}>
        <div className="lamp-sway origin-top motion-reduce:animate-none">
          {/* cord */}
          <div className="mx-auto w-px bg-[var(--lamp-cord)]" style={{ height: "var(--drop)" }} />
          {/* shade */}
          <svg viewBox="0 0 80 40" className="mx-auto -mt-px block w-20 drop-shadow-[0_6px_10px_var(--lamp-shadow)]" aria-hidden>
            <defs>
              <linearGradient id="lamp-shade" x1="0" x2="1">
                <stop offset="0" stopColor="var(--lamp-shade-dark)" />
                <stop offset="0.5" stopColor="var(--lamp-shade-light)" />
                <stop offset="1" stopColor="var(--lamp-shade-dark)" />
              </linearGradient>
            </defs>
            <path d="M32 0 h16 l30 34 H2 Z" fill="url(#lamp-shade)" />
            <ellipse cx="40" cy="34" rx="38" ry="5" fill="var(--lamp-bulb)" className="lamp-bulb" style={{ filter: "drop-shadow(0 0 6px var(--lamp-light)) drop-shadow(0 2px 14px var(--lamp-light))" }} />
          </svg>
          {/* beam: blur on the wrapper, clip on the child (clip-path runs after
              filter, so blurring the clipped element itself gives hard edges) */}
          <div
            className="lamp-beam relative mx-auto -mt-[6px] h-[330px] w-[260px]"
            style={{
              mixBlendMode: "var(--lamp-blend)" as CSSProperties["mixBlendMode"],
              opacity: "var(--lamp-beam-opacity)",
              // nothing above the rim line, even after blur
              maskImage: "linear-gradient(to bottom, transparent 0, #000 10px)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 10px)",
            }}
          >
            {/* wide soft cone — top edge matches the rim (76px of 260) */}
            <div
              className="absolute inset-0 blur-[14px]"
              style={{
                clipPath: "polygon(35.4% 0, 64.6% 0, 100% 100%, 0 100%)",
                background: "linear-gradient(to bottom, var(--lamp-light) 0%, color-mix(in oklab, var(--lamp-light) 45%, transparent) 40%, transparent 100%)",
              }}
            />
            {/* bright core right under the bulb, fading fast */}
            <div
              className="absolute inset-0 blur-[6px]"
              style={{
                clipPath: "polygon(36% 0, 64% 0, 80% 100%, 20% 100%)",
                background: "linear-gradient(to bottom, var(--lamp-light) 0%, color-mix(in oklab, var(--lamp-light) 35%, transparent) 18%, transparent 55%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* pool on the floor */}
      <div
        aria-hidden
        className="lamp-beam pointer-events-none absolute inset-x-0 bottom-0 h-44 blur-2xl"
        style={{
          background: "radial-gradient(60% 55% at 50% 100%, color-mix(in oklab, var(--lamp-light) 45%, transparent), transparent 70%)",
          mixBlendMode: "var(--lamp-blend)" as CSSProperties["mixBlendMode"],
          opacity: "var(--lamp-beam-opacity)",
        }}
      />

      {/* content sits in the light */}
      <div className="relative p-6 lg:px-8">{children}</div>
    </div>
  );
}
