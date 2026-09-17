"use client";

import { twMerge } from "tailwind-merge";
import { Text } from "../Typography";

/**
 * One legend per graph, same footprint, same type. Rendered by the widget in
 * the bottom-right corner of the stage so every view carries its key in the
 * same place.
 */

export type LegendView = "heatmap" | "area" | "skyline" | "ring";

const LEVELS = ["bg-foreground/[0.06]", "bg-brand/30", "bg-brand/55", "bg-brand/80", "bg-brand"];

function Item({ swatch, children }: { swatch: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      {swatch}
      <Text variant="labelSm" as="span" className="normal-case tracking-normal">{children}</Text>
    </span>
  );
}

export function Legend({ view, granularity = "week", className }: { view: LegendView; granularity?: "week" | "day"; className?: string }) {
  const unit = granularity === "week" ? "week" : "day";
  return (
    <div className={twMerge("flex items-center gap-4", className)} aria-hidden>
      {view === "heatmap" && (
        <span className="flex items-center gap-1.5">
          <Text variant="labelSm" as="span" className="normal-case tracking-normal">Less</Text>
          {LEVELS.map((c) => <span key={c} className={twMerge("h-2.5 w-2.5 rounded-[2px]", c)} />)}
          <Text variant="labelSm" as="span" className="normal-case tracking-normal">More</Text>
        </span>
      )}

      {view === "area" && (
        <>
          <Item swatch={<span className="h-px w-4 bg-brand" />}>{unit === "week" ? "Weekly" : "Daily"} total</Item>
          <Item swatch={<span className="h-2 w-2 rounded-full bg-brand" />}>Latest {unit}</Item>
        </>
      )}

      {view === "skyline" && (
        <>
          <Item swatch={<span className="h-2.5 w-2.5 rounded-[2px] bg-foreground/40" />}>{unit === "week" ? "Week" : "Day"}</Item>
          <Item swatch={<span className="h-2.5 w-2.5 rounded-[2px] bg-brand" />}>{unit === "week" ? "Current week" : "Today"}</Item>
        </>
      )}

      {view === "ring" && (
        <>
          <span className="flex items-center gap-1.5">
            <Text variant="labelSm" as="span" className="normal-case tracking-normal">Less</Text>
            {[0.12, 0.3, 0.55, 0.8, 1].map((o, i) => (
              <span key={i} className={i ? "h-2 w-2 rounded-full bg-brand" : "h-2 w-2 rounded-full bg-foreground"} style={{ opacity: o }} />
            ))}
            <Text variant="labelSm" as="span" className="normal-case tracking-normal">More</Text>
          </span>
          <Item swatch={<span className="h-2 w-2 rounded-full bg-brand" />}>Today at 12 o&apos;clock</Item>
        </>
      )}
    </div>
  );
}
