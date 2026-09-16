"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { twMerge } from "tailwind-merge";
import { PullCord } from "./PullCord";

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
 *  - one-shot flicker on mount
 *  - pull-cord on the rim: pulling it toggles the site theme (lamp on = dark)
 *  - reduced motion: beam on, no sway, no flicker
 */

// Wall grain: tiny SVG turbulence as a data URI, tiled.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function PendantLamp({
  children,
  className,
  /** Cord length in px — where the shade hangs */
  drop = 35,
}: {
  children: ReactNode;
  className?: string;
  drop?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isOn = mounted && resolvedTheme === "dark";
  const toggle = () => setTheme(isOn ? "light" : "dark");

  return (
    <div
      ref={ref}
      className={twMerge("relative flex h-full min-h-[400px] w-full flex-col justify-end overflow-hidden bg-background", className)}
      style={{ "--drop": `${drop}px` } as CSSProperties}
    >
      {/* wall grain */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[var(--lamp-grain)]" style={{ backgroundImage: GRAIN }} />

      {/* fixture + beam: one swinging group anchored at the ceiling.
          Everything is centred on the container midline with left-1/2 +
          translate, never with auto margins (which can't centre an element
          wider than its parent). The beam's top edge is exactly the rim width. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full origin-top">
        <div className="lamp-sway relative h-full origin-top motion-reduce:animate-none">
          {/* cord */}
          <div className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-[var(--lamp-cord)]" style={{ height: "var(--drop)" }} />

          {/* shade: 80px wide, rim (bulb ellipse) is 76px wide at y = 34px */}
          <svg viewBox="0 0 80 40" className="absolute left-1/2 z-10 block w-20 -translate-x-1/2" style={{ top: "var(--drop)" }} aria-hidden>
            <defs>
              <linearGradient id="lamp-shade" x1="0" x2="1">
                <stop offset="0" stopColor="var(--lamp-shade-dark)" />
                <stop offset="0.5" stopColor="var(--lamp-shade-light)" />
                <stop offset="1" stopColor="var(--lamp-shade-dark)" />
              </linearGradient>
            </defs>
            <path d="M32 0 h16 l30 34 H2 Z" fill="url(#lamp-shade)" />
            <ellipse cx="40" cy="34" rx="38" ry="5" fill="var(--lamp-bulb)" className="lamp-bulb" />
          </svg>

          {/* pull-cord: hangs from the centre of the bulb; the bead is a real button */}
          <PullCord
            onPull={toggle}
            label={isOn ? "Pull to turn the light off (light mode)" : "Pull to turn the light on (dark mode)"}
            className="pointer-events-auto absolute z-0"
            style={{ left: "calc(50% - 24.4px)", top: "calc(var(--drop) + 28px)" }}
          />

          {/* beam: starts on the rim line (drop + 34px), wide enough for any column */}
          <div
            className="lamp-beam absolute left-1/2 -translate-x-1/2"
            style={{
              ["--lamp-o" as string]: "var(--lamp-beam-opacity)",
              top: "calc(var(--drop) + 34px)",
              width: "max(260px, 130%)",
              height: "calc(100% - var(--drop) - 34px)",
              ["--rim" as string]: "76px",
              mixBlendMode: "var(--lamp-blend)" as CSSProperties["mixBlendMode"],
              opacity: "var(--lamp-beam-opacity)",
              // nothing above the rim line, even after blur
              maskImage: "linear-gradient(to bottom, transparent 0, #000 8px)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 8px)",
            }}
          >
            {/* rim glow: HTML ellipse (an SVG drop-shadow would clip to a box) */}
            <div
              className="lamp-bulb absolute left-1/2 top-0 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[10px]"
              style={{ ["--lamp-o" as string]: "var(--lamp-glow-opacity)", width: "calc(var(--rim) - 12px)", background: "var(--lamp-light)", opacity: "var(--lamp-glow-opacity)" }}
            />
            {/* wide soft cone — top edge = rim width, computed from the centre */}
            <div className="absolute inset-0" style={{ filter: "blur(var(--lamp-blur))" }}>
              <div
                className="h-full w-full"
                style={{
                  clipPath: "polygon(calc(50% - var(--rim) / 2 + var(--lamp-inset)) 0, calc(50% + var(--rim) / 2 - var(--lamp-inset)) 0, 100% 100%, 0 100%)",
                  background: "linear-gradient(to bottom, var(--lamp-light) 0%, color-mix(in oklab, var(--lamp-light) 45%, transparent) 40%, transparent 100%)",
                }}
              />
            </div>
            {/* bright core right under the bulb, fading fast */}
            <div className="absolute inset-0 blur-[6px]" style={{ opacity: "var(--lamp-core-opacity)" }}>
              <div
                className="h-full w-full"
                style={{
                  clipPath: "polygon(calc(50% - var(--rim) / 2 + 6px) 0, calc(50% + var(--rim) / 2 - 6px) 0, 78% 100%, 22% 100%)",
                  background: "linear-gradient(to bottom, var(--lamp-light) 0%, color-mix(in oklab, var(--lamp-light) 35%, transparent) 18%, transparent 55%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* pool on the floor */}
      <div
        aria-hidden
        className="lamp-beam pointer-events-none absolute inset-x-0 bottom-0 h-44 blur-2xl"
        style={{
          ["--lamp-o" as string]: "var(--lamp-beam-opacity)",
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
