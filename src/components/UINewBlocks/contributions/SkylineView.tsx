"use client";

import { useMemo } from "react";
import { Text } from "../Typography";
import { summarize, type Day } from "../data";
import { GraphTip, fmtCount, fmtWeek } from "./GraphTip";

/**
 * Skyline — 52 weekly columns as isometric blocks in one straight row.
 *
 * 2:1 dimetric projection:  project(x, y, z) = [x − y, (x + y) / 2 − z]
 *
 * Blocks are placed along the ground direction (1, −1), which projects to a
 * horizontal screen line, so the street reads straight instead of diagonal.
 * PITCH = BW + BD, so adjacent footprints touch but never overlap and every
 * block shows its top and both side faces. Faces recede by mixing toward the
 * page background (not by opacity), so shading holds in both themes.
 */

const BW = 6;               // block width  (x extent)
const BD = 6;               // block depth  (y extent)
const PITCH = BW + BD;      // screen distance between block centres
const HMAX = 88;            // tallest block
const WEEKS = 53;

const project = (x: number, y: number, z: number) => [x - y, (x + y) / 2 - z] as const;
const pt = (x: number, y: number, z: number) => project(x, y, z).join(",");

function fills(kind: "current" | "lit" | "zero") {
  const base =
    kind === "current"
      ? "var(--brand)"
      : kind === "lit"
        ? "color-mix(in oklab, var(--foreground) 42%, var(--background))"
        : "color-mix(in oklab, var(--foreground) 14%, var(--background))";
  return {
    top: base,
    left: `color-mix(in oklab, ${base} 72%, var(--background))`,
    right: `color-mix(in oklab, ${base} 52%, var(--background))`,
  };
}

export function SkylineView({ days }: { days: Day[] }) {
  const { weekly, starts, months } = useMemo(() => {
    const { weekly } = summarize(days);
    const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const starts = weekly.map((_, w) => days[Math.max(0, w * 7 - first)].date);
    const months: { col: number; label: string }[] = [];
    let last = -1;
    starts.forEach((iso, i) => {
      const m = new Date(iso + "T00:00:00Z").getUTCMonth();
      if (m !== last && m % 2 === 0)
        months.push({ col: i, label: new Date(iso + "T00:00:00Z").toLocaleString("en", { month: "short", timeZone: "UTC" }) });
      last = m;
    });
    return { weekly, starts, months };
  }, [days]);

  const max = Math.max(1, ...weekly);
  const n = weekly.length;

  // Block i sits at ground point (t, −t) with t = i·PITCH/2 → screen x = i·PITCH.
  // Screen-space extents for the viewBox:
  const spanX = (n - 1) * PITCH + BW + BD;         // first block's left edge to last block's right edge
  const minX = -BD;                                 // leftmost projected corner of block 0
  const groundY = (BW + BD) / 2;                    // y' of the front vertex on the ground
  const vbX = minX - 8, vbW = spanX + 16;
  const vbY = -HMAX - BD / 2 - 8, vbH = HMAX + BD + groundY + 16;

  return (
    <div className="w-full">
      <svg viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} className="w-full" role="img" aria-label="Weekly contributions as isometric columns">
        {/* Ground line: the front edge of the street */}
        <line x1={minX} x2={minX + spanX} y1={groundY} y2={groundY} stroke="var(--hairline-strong)" />

        {weekly.map((v, i) => {
          const t = (i * PITCH) / 2;
          const x0 = t, x1 = t + BW;
          const y0 = -t, y1 = -t + BD;
          const h = Math.max(1.5, (v / max) * HMAX);
          const kind = i === n - 1 ? "current" : v > 0 ? "lit" : "zero";
          const f = fills(kind);
          const left = `${pt(x0, y1, h)} ${pt(x1, y1, h)} ${pt(x1, y1, 0)} ${pt(x0, y1, 0)}`;
          const right = `${pt(x1, y0, h)} ${pt(x1, y1, h)} ${pt(x1, y1, 0)} ${pt(x1, y0, 0)}`;
          const top = `${pt(x0, y0, h)} ${pt(x1, y0, h)} ${pt(x1, y1, h)} ${pt(x0, y1, h)}`;
          return (
            <GraphTip key={i} label={fmtWeek(starts[i])} value={fmtCount(v)}>
              <g className="cursor-default outline-none transition-opacity duration-150 hover:opacity-70" tabIndex={-1}>
                <polygon points={left} style={{ fill: f.left }} />
                <polygon points={right} style={{ fill: f.right }} />
                <polygon points={top} style={{ fill: f.top }} />
              </g>
            </GraphTip>
          );
        })}
      </svg>

      {/* Month labels under their column */}
      <div className="relative mt-1 h-4" aria-hidden>
        {months.map((m) => (
          <Text
            key={`${m.label}-${m.col}`}
            variant="labelSm"
            as="span"
            className="absolute normal-case tracking-normal"
            style={{ left: `${((m.col * PITCH - vbX) / vbW) * 100}%` }}
          >
            {m.label}
          </Text>
        ))}
      </div>
    </div>
  );
}
