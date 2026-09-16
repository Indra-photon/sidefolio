"use client";

import { useMemo } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";

/**
 * Inline SVG world map (Natural Earth 110m land, ~55 KB bundled) with a
 * blinking marker at a lon/lat. Projection: Natural Earth I, same as the
 * reference. Colours are inherited: `fill` from currentColor via className.
 */

const W = 960;
const H = 480;

type Props = {
  lat: number;
  lon: number;
  /** Extra marker dots (other zones), no pulse */
  others?: { lat: number; lon: number }[];
  className?: string;
  landClassName?: string;
  /** width: natural; contain: shrink into the box; cover: fill the box, crop overflow */
  fit?: "width" | "contain" | "cover";
  /** Multiplier for the home marker (dot + ring). */
  markerScale?: number;
};

export function WorldMap({ lat, lon, others = [], className, landClassName, fit = "width", markerScale = 1 }: Props) {
  const { landPath, projection } = useMemo(() => {
    const topo = land110 as unknown as Topology<{ land: GeometryCollection }>;
    const land = feature(topo, topo.objects.land);
    const projection = geoNaturalEarth1().fitSize([W, H], land);
    const landPath = geoPath(projection)(land) ?? "";
    return { landPath, projection };
  }, []);

  const [x, y] = projection([lon, lat]) ?? [0, 0];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={fit === "cover" ? "xMidYMid slice" : "xMidYMid meet"}
      className={className}
      style={fit !== "width" ? { width: "100%", height: "100%" } : undefined}
      role="img"
      aria-label="World map"
    >
      <defs>
        {/* Subtle halftone like the reference: horizontal hairlines over the land */}
        <pattern id="wm-lines" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="currentColor" />
          <rect y="2" width="4" height="1" className="fill-background/40" />
        </pattern>
      </defs>

      <path d={landPath} fill="url(#wm-lines)" className={landClassName} />

      {others.map((o, i) => {
        const [ox, oy] = projection([o.lon, o.lat]) ?? [0, 0];
        return <circle key={i} cx={ox} cy={oy} r="4" className="fill-foreground/70" />;
      })}

      {/* Home marker: solid dot + expanding ring; pops in after the land settles */}
      <g transform={`translate(${x} ${y})`}>
        {/* inner group carries the CSS scale so it doesn't clobber the SVG translate */}
        {/* Pop: scale 0.6→1 (never from 0), steep ease-out-expo, after the land settles */}
        <g className="wm-pop" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle r={6 * markerScale} className="fill-brand" />
          {/* Ping: transform + opacity only (composited), never the `r` attribute */}
          <circle
            r={6 * markerScale}
            className="wm-ping fill-none stroke-brand"
            strokeWidth={2 * markerScale}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
          <circle r={3 * markerScale} className="fill-background" />
        </g>
      </g>

      <style>{`
        .wm-pop  { animation: wm-pop 350ms cubic-bezier(0.19, 1, 0.22, 1) 350ms both; }
        .wm-ping { animation: wm-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes wm-pop  { from { transform: scale(0.6); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes wm-ping { 0% { transform: scale(1); opacity: .9 } 100% { transform: scale(5); opacity: 0 } }
        @media (prefers-reduced-motion: reduce) {
          .wm-pop  { animation: wm-fade 350ms ease-out 350ms both; }
          .wm-ping { animation: none; transform: scale(2); opacity: .45; }
        }
        @keyframes wm-fade { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </svg>
  );
}
