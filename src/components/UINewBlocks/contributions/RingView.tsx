"use client";

import { Text } from "../Typography";
import type { Day } from "../data";
import { GraphTip, fmtCount, fmtDay } from "./GraphTip";

const S = 300, C = S / 2, R0 = 58, STEP = 10.5, WEEKS = 53;
const ALPHA = [0.1, 0.3, 0.55, 0.8, 1];

export function RingView({ days, total }: { days: Day[]; total: number }) {
  const short = days.length <= 31; // 7 / 30-day ranges: one ring of larger dots
  const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const cells: (Day | null)[] = short ? days : [...Array<null>(first).fill(null), ...days];

  return (
    <div className="relative mx-auto aspect-square h-full max-h-[300px] max-w-full">
      <svg viewBox={`0 0 ${S} ${S}`} className="h-full w-full" role="img" aria-label="Contributions by week, circular">
        {cells.map((d, i) => {
          if (!d) return null;
          let a: number, r: number, dotR: number;
          if (short) {
            // today at 12 o'clock, going clockwise back through the range
            a = ((i + 1 - cells.length) / cells.length) * Math.PI * 2 - Math.PI / 2;
            r = 122;
            dotR = cells.length <= 7 ? 10 : 6;
          } else {
            const w = Math.floor(i / 7), dow = i % 7;
            a = ((w - WEEKS) / WEEKS) * Math.PI * 2 - Math.PI / 2;
            r = R0 + dow * STEP;
            dotR = d.level ? 3 : 2;
          }
          return (
            <GraphTip key={d.date} label={fmtDay(d.date)} value={fmtCount(d.count)}>
              <circle
                cx={C + Math.cos(a) * r} cy={C + Math.sin(a) * r}
                r={dotR}
                fill={d.level ? "var(--brand)" : "currentColor"}
                opacity={d.level ? ALPHA[d.level] : 0.12}
                className="text-foreground outline-none transition-opacity duration-150 hover:opacity-100"
                tabIndex={-1}
              />
            </GraphTip>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <Text variant="cardHeader" as="p" className="tabular-nums">{total.toLocaleString()}</Text>
        <Text variant="labelSm" as="p">contributions</Text>
      </div>
    </div>
  );
}
