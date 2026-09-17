"use client";

import { useMemo } from "react";
import type { Day } from "../data";
import { GraphTip, fmtCount, series, type Granularity } from "./GraphTip";

const W = 640, H = 150, P = 8;

export function AreaView({ days, granularity = "week" }: { days: Day[]; granularity?: Granularity }) {
  const { path, area, pts, labels } = useMemo(() => {
    const pts0 = series(days, granularity);
    const labels = pts0.map((p) => p.label);
    const weekly = pts0.map((p) => p.value);
    const max = Math.max(1, ...weekly);
    const pts = weekly.map((v, i) => [P + (i / (weekly.length - 1)) * (W - 2 * P), H - P - (v / max) * (H - 2 * P), v] as const);
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
      // Catmull-Rom → Bézier; clamp control-point y to the baseline so zero
      // weeks never pull the curve below the axis.
      const floor = H - P;
      const c1y = Math.min(floor, p1[1] + (p2[1] - p0[1]) / 6);
      const c2y = Math.min(floor, p2[1] - (p3[1] - p1[1]) / 6);
      d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${c1y} ${p2[0] - (p3[0] - p1[0]) / 6},${c2y} ${p2[0]},${p2[1]}`;
    }
    return { path: d, area: `${d} L${pts[pts.length - 1][0]},${H - P} L${pts[0][0]},${H - P} Z`, pts, labels };
  }, [days, granularity]);
  const colW = (W - 2 * P) / (pts.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="max-h-full w-full" role="img" aria-label={granularity === "week" ? "Weekly contributions" : "Daily contributions"}>
      <defs>
        <linearGradient id="cw-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={P} x2={W - P} y1={H - P} y2={H - P} stroke="var(--hairline-strong)" />
      <path d={area} fill="url(#cw-area)" />
      <path d={path} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" />
      {/* hit areas: one per week, with a hover dot */}
      {pts.map(([x, y, v], i) => (
        <GraphTip key={i} label={labels[i]} value={fmtCount(v)}>
          <g className="group cursor-default outline-none" tabIndex={-1}>
            <rect x={x - colW / 2} y={0} width={colW} height={H} fill="transparent" />
            <line x1={x} x2={x} y1={y} y2={H - P} stroke="var(--brand)" strokeOpacity="0" className="transition-[stroke-opacity] duration-150 group-hover:[stroke-opacity:0.35]" />
            <circle cx={x} cy={y} r="4" className={i === pts.length - 1 ? "fill-brand" : "fill-brand opacity-0 transition-opacity duration-150 group-hover:opacity-100"} />
          </g>
        </GraphTip>
      ))}
    </svg>
  );
}
