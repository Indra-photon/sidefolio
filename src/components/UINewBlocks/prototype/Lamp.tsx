"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Text } from "../Typography";

/**
 * Lamp — a physical light source pointing at the CTAs. Pure CSS + inline SVG.
 *
 *  - beam: clip-path cone, warm gradient, blurred, `plus-lighter` so it adds
 *    light to whatever sits under it (the buttons and the wall grain)
 *  - pool: elliptical radial gradient where the beam lands
 *  - swing: the whole fixture rotates about the cord anchor (transform only)
 *  - pointer: cursor x tilts the lamp a few degrees toward it
 *  - flicker: one-shot on mount, then steady
 *  - reduced motion: beam on, no swing, no flicker
 */

const WARM = "oklch(0.93 0.06 85)"; // tungsten
const WARM_DIM = "oklch(0.85 0.09 80)";

// Wall grain: tiny SVG turbulence as a data URI, tiled.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const t = ((e.clientX - r.left) / r.width - 0.5) * 6; // −3..3 deg
    el.style.setProperty("--tilt", `${t.toFixed(2)}deg`);
  };
  const onLeave = () => ref.current?.style.setProperty("--tilt", "0deg");
  return { ref, onMove, onLeave };
}

function CTAs({ lit }: { lit?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <Link href="/contact" className="inline-flex w-full items-center justify-between gap-2 bg-primary px-4 py-2.5 transition-colors hover:bg-primary/90">
        <Text variant="labelSm" className="text-primary-foreground">Contact me</Text>
        <ArrowUpRight className="h-3.5 w-3.5 text-primary-foreground" />
      </Link>
      <Link href="https://topmate.io/indranil_dev" target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-between gap-2 shadow-border shadow-border-hover px-4 py-2.5 transition-[box-shadow,background-color] duration-150 ease-out hover:bg-accent">
        <Text variant="labelSm" className="text-foreground">Book a free call</Text>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

/* ---------------- Floor lamp (reference 2) ---------------- */

export function FloorLamp({ className }: { className?: string }) {
  const { ref, onMove, onLeave } = useTilt();
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={twMerge("relative flex h-[420px] w-full max-w-[260px] flex-col justify-end overflow-hidden bg-card p-6", className)}
      style={{ "--tilt": "0deg" } as CSSProperties}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay dark:opacity-[0.12]" style={{ backgroundImage: GRAIN }} />

      {/* pole, right side */}
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-8 top-24 w-[3px] rounded-full bg-gradient-to-b from-[oklch(0.72_0.08_80)] to-[oklch(0.45_0.06_80)]" />

      {/* arm + shade + beam, hinged at the pole top */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-8 top-24 origin-right"
        style={{ transform: "rotate(calc(var(--tilt) * -0.5))" }}
      >
        <div className="lamp-sway origin-right motion-reduce:animate-none">
          {/* arm */}
          <div className="h-[3px] w-28 rounded-full bg-gradient-to-l from-[oklch(0.72_0.08_80)] to-[oklch(0.55_0.07_80)]" />
          {/* shade, hanging from the arm's far end */}
          <div className="relative -ml-[104px] w-[76px]">
            <svg viewBox="0 0 76 44" className="block w-full" aria-hidden>
              <defs>
                <linearGradient id="fshade" x1="0" x2="1">
                  <stop offset="0" stopColor="oklch(0.45 0.09 75)" />
                  <stop offset="0.45" stopColor="oklch(0.8 0.1 80)" />
                  <stop offset="1" stopColor="oklch(0.4 0.08 75)" />
                </linearGradient>
              </defs>
              <path d="M34 0 h8 l32 40 H2 Z" fill="url(#fshade)" />
              <ellipse cx="38" cy="40" rx="36" ry="4" fill={WARM} className="lamp-bulb" />
            </svg>
            {/* beam */}
            <div
              className="lamp-beam absolute left-1/2 top-[40px] h-[280px] w-[260px] -translate-x-1/2 blur-[20px]"
              style={{
                clipPath: "polygon(36% 0, 64% 0, 100% 100%, 0 100%)",
                background: `linear-gradient(to bottom, ${WARM} 0%, color-mix(in oklab, ${WARM} 50%, transparent) 35%, transparent 100%)`,
                mixBlendMode: "plus-lighter",
                opacity: 0.55,
              }}
            />
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="lamp-beam pointer-events-none absolute inset-x-0 bottom-0 h-44 blur-2xl"
        style={{ background: `radial-gradient(65% 60% at 38% 100%, color-mix(in oklab, ${WARM_DIM} 45%, transparent), transparent 70%)`, mixBlendMode: "plus-lighter" }}
      />

      <div className="relative pr-16">
        <Text variant="label" className="mb-3 text-foreground/80">Get in touch</Text>
        <CTAs />
      </div>
    </div>
  );
}
