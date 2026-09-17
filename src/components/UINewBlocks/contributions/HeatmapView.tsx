"use client";

import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "../Typography";
import type { Day } from "../data";
import { GraphTip, fmtCount, fmtDay } from "./GraphTip";

const LEVEL = ["bg-foreground/[0.06]", "bg-brand/30", "bg-brand/55", "bg-brand/80", "bg-brand"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function HeatmapView({ days }: { days: Day[] }) {
  const week = days.length <= 7;
  const { cells, monthLabels } = useMemo(() => {
    const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const cells: (Day | null)[] = [...Array<null>(first).fill(null), ...days];
    const monthLabels: { col: number; label: string }[] = [];
    let last = -1;
    cells.forEach((d, i) => {
      if (!d) return;
      const m = new Date(d.date + "T00:00:00Z").getUTCMonth();
      if (m !== last) { monthLabels.push({ col: Math.floor(i / 7), label: MONTHS[m] }); last = m; }
    });
    if (monthLabels.length > 1 && monthLabels[1].col - monthLabels[0].col < 3) monthLabels.shift();
    return { cells, monthLabels };
  }, [days]);
  const weeks = Math.ceil(cells.length / 7);
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // 7 days: one row of large cells with weekday labels
  if (week) {
    return (
      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-2">
        <div className="grid grid-cols-7 gap-1" aria-hidden>
          {days.map((d) => (
            <Text key={d.date} variant="labelSm" as="span" className="text-center normal-case tracking-normal">
              {DOW[new Date(d.date + "T00:00:00Z").getUTCDay()]}
            </Text>
          ))}
        </div>
        <div role="img" aria-label="Daily contributions, last 7 days" className="grid grid-cols-7 gap-1">
          {days.map((d) => (
            <GraphTip key={d.date} label={fmtDay(d.date)} value={fmtCount(d.count)}>
              <span className={twMerge("aspect-square w-full rounded-[3px] outline-none", LEVEL[d.level])} tabIndex={-1} />
            </GraphTip>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-2" style={{ maxWidth: weeks < 20 ? weeks * 26 : undefined }}>
      <div className="relative mb-2 h-3" style={{ display: "grid", gridTemplateColumns: `repeat(${weeks}, minmax(0,1fr))`, gap: 2 }} aria-hidden>
        {monthLabels.map((m) => (
          <Text key={`${m.label}-${m.col}`} variant="labelSm" as="span" className="col-span-3 whitespace-nowrap normal-case tracking-normal" style={{ gridColumnStart: m.col + 1 }}>
            {m.label}
          </Text>
        ))}
      </div>
      <div
        role="img" aria-label="Daily contributions"
        className="grid grid-flow-col gap-[2px]"
        style={{ gridTemplateRows: "repeat(7, minmax(0,1fr))", gridTemplateColumns: `repeat(${weeks}, minmax(0,1fr))` }}
      >
        {cells.map((d, i) =>
          d ? (
            <GraphTip key={d.date} label={fmtDay(d.date)} value={fmtCount(d.count)}>
              <span className={twMerge("aspect-square w-full rounded-[2px] outline-none focus-visible:ring-2 focus-visible:ring-ring", LEVEL[d.level])} tabIndex={-1} />
            </GraphTip>
          ) : (
            <span key={`pad-${i}`} className="aspect-square w-full" />
          ),
        )}
      </div>
    </div>
  );
}
