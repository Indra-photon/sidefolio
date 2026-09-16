"use client";

import { Text } from "../Typography";
import type { Day } from "../data";
import { GraphTip, fmtCount, fmtDay } from "./GraphTip";

const S = 300, C = S / 2, R0 = 58, STEP = 10.5, WEEKS = 53;
const ALPHA = [0.1, 0.3, 0.55, 0.8, 1];

export function RingView({ days, total }: { days: Day[]; total: number }) {
  const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const cells: (Day | null)[] = [...Array<null>(first).fill(null), ...days];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px]">
      <svg viewBox={`0 0 ${S} ${S}`} className="h-full w-full" role="img" aria-label="Contributions by week, circular">
        {cells.map((d, i) => {
          if (!d) return null;
          const w = Math.floor(i / 7), dow = i % 7;
          const a = ((w - WEEKS) / WEEKS) * Math.PI * 2 - Math.PI / 2;
          const r = R0 + dow * STEP;
          return (
            <GraphTip key={d.date} label={fmtDay(d.date)} value={fmtCount(d.count)}>
              <circle
                cx={C + Math.cos(a) * r} cy={C + Math.sin(a) * r}
                r={d.level ? 3 : 2}
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
