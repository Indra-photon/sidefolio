"use client";

import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Design-system skin for the shadcn tooltip, applied at the call site.
 * ui/tooltip.tsx is untouched: popover surface, shadow-border (no border),
 * mono label type, arrow recoloured to match.
 */
const CONTENT =
  "rounded-sm bg-popover px-2.5 py-1.5 text-popover-foreground shadow-border " +
  "font-mono text-[12px] leading-[1.4] tracking-normal normal-case " +
  "[&_svg]:fill-popover [&_svg]:bg-popover";

export function GraphTip({
  label,
  value,
  children,
  side = "top",
}: {
  /** e.g. "Tue, 14 Sep" */
  label: string;
  /** e.g. "6 contributions" */
  value: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={6} className={CONTENT}>
        <span className="tabular-nums text-popover-foreground">{value}</span>
        <span className="text-muted-foreground"> · {label}</span>
      </TooltipContent>
    </Tooltip>
  );
}

export const fmtDay = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
  });
export const fmtCount = (n: number) => `${n} contribution${n === 1 ? "" : "s"}`;
export const fmtWeek = (iso: string) => `week of ${fmtDay(iso)}`;

export type Granularity = "week" | "day";

/** Points for the line/bar views: one per week (Sunday-aligned) or one per day. */
export function series(days: import("../data").Day[], granularity: Granularity) {
  if (granularity === "day") {
    return days.map((d) => ({ value: d.count, start: d.date, label: fmtDay(d.date) }));
  }
  const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const out: { value: number; start: string; label: string }[] = [];
  days.forEach((d, i) => {
    const w = Math.floor((i + first) / 7);
    if (!out[w]) out[w] = { value: 0, start: d.date, label: fmtWeek(d.date) };
    out[w].value += d.count;
  });
  return out;
}
