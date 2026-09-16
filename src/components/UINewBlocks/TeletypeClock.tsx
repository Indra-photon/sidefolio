"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { Text } from "./Typography";

/* ------------------------------------------------------------------ */
/* Split-flap physics (from craftui/teletype-clock): top flap falls on   */
/* the seam, then the bottom flap swings up, overshoots and settles.     */

const FALL_DURATION = 0.14;
const LAND_DURATION = 0.16;
const FALL_EASE = [0.55, 0.055, 0.675, 0.19] as const; // ease-in-cubic

/* ------------------------------------------------------------------ */
/* Time helpers                                                          */

export type Zone = { city: string; timeZone: string };

function partsIn(date: Date, timeZone: string) {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
    day: "numeric",
  }).formatToParts(date);
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  // "24" can appear for midnight in some engines
  const hh = get("hour") === "24" ? "00" : get("hour");
  return { hh, mm: get("minute"), ss: get("second"), day: Number(get("day")) };
}

function offsetMinutes(date: Date, timeZone: string) {
  const raw =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = raw.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1].startsWith("-") ? -1 : 1;
  return sign * (Math.abs(parseInt(m[1], 10)) * 60 + (m[2] ? parseInt(m[2], 10) : 0));
}

/** "Today | 3.5 hrs ahead" relative to the viewer's own clock. */
function relativeLabel(date: Date, timeZone: string, viewerZone: string) {
  const diffH = (offsetMinutes(date, timeZone) - offsetMinutes(date, viewerZone)) / 60;
  const there = partsIn(date, timeZone).day;
  const here = partsIn(date, viewerZone).day;
  const day = there === here ? "Today" : there > here || here - there > 1 ? "Tomorrow" : "Yesterday";
  if (diffH === 0) return `${day} | same time`;
  const abs = Math.abs(diffH);
  const n = Number.isInteger(abs) ? abs : abs.toFixed(1);
  return `${day} | ${n} ${abs === 1 ? "hr" : "hrs"} ${diffH > 0 ? "ahead" : "behind"}`;
}

/* ------------------------------------------------------------------ */
/* One digit card                                                        */

const SIZES = {
  sm: { card: "h-12 w-9", text: "text-[28px]" },
  md: { card: "h-16 w-12", text: "text-[40px]" },
  lg: { card: "h-24 w-16", text: "text-6xl" },
} as const;
type Size = keyof typeof SIZES;

function Half({ digit, half, text }: { digit: string; half: "top" | "bottom"; text: string }) {
  return (
    <div
      className={twMerge(
        "absolute left-0 flex h-[200%] w-full items-center justify-center font-mono font-medium tabular-nums",
        text,
        half === "top" ? "top-0 text-foreground/80" : "bottom-0 text-foreground",
      )}
    >
      {digit}
    </div>
  );
}

function FlipDigit({ digit, size, seam }: { digit: string; size: Size; seam: boolean }) {
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(digit);
  const isFlipping = digit !== current && !reduceMotion;
  const { card, text } = SIZES[size];

  useEffect(() => {
    if (reduceMotion) setCurrent(digit);
  }, [digit, reduceMotion]);

  // Card halves: token surfaces; the top is a touch darker (printed-flap look)
  const topSkin = "bg-muted [background-image:linear-gradient(to_bottom,rgb(0_0_0/0.10),rgb(0_0_0/0.02))]";
  const bottomSkin = "bg-muted [background-image:linear-gradient(to_bottom,rgb(255_255_255/0.04),rgb(0_0_0/0.06))]";

  return (
    <div className={twMerge("relative", card)} style={{ perspective: "300px" }}>
      {/* Static halves */}
      <div className={twMerge("absolute inset-x-0 top-0 h-1/2 overflow-hidden", topSkin)}>
        <Half digit={isFlipping ? digit : current} half="top" text={text} />
      </div>
      <div className={twMerge("absolute inset-x-0 bottom-0 h-1/2 overflow-hidden", bottomSkin)}>
        <Half digit={current} half="bottom" text={text} />
      </div>

      <AnimatePresence>
        {isFlipping && (
          <motion.div key={`${current}-${digit}`} className="contents">
            {/* Falling top flap (old digit) */}
            <motion.div
              className={twMerge("absolute inset-x-0 top-0 z-20 h-1/2 overflow-hidden", topSkin)}
              style={{ transformOrigin: "bottom", backfaceVisibility: "hidden" }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              exit={{ rotateX: -90 }}
              transition={{ duration: FALL_DURATION, ease: FALL_EASE }}
            >
              <Half digit={current} half="top" text={text} />
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ duration: FALL_DURATION, ease: FALL_EASE }}
              />
            </motion.div>

            {/* Landing bottom flap (new digit) — waits for the fall, hits 0°, bounces, settles */}
            <motion.div
              className={twMerge("absolute inset-x-0 bottom-0 z-20 h-1/2 overflow-hidden", bottomSkin)}
              style={{ transformOrigin: "top", backfaceVisibility: "hidden" }}
              initial={{ rotateX: 90 }}
              animate={{ rotateX: [90, 0, -8, 0] }}
              exit={{ rotateX: 0 }}
              transition={{
                delay: FALL_DURATION,
                duration: LAND_DURATION,
                times: [0, 0.6, 0.8, 1],
                ease: ["easeIn", "easeOut", "easeInOut"],
              }}
              onAnimationComplete={() => setCurrent(digit)}
            >
              <Half digit={digit} half="bottom" text={text} />
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0.45 }}
                animate={{ opacity: 0 }}
                transition={{ delay: FALL_DURATION, duration: LAND_DURATION }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hinge seam — a shadow line, no border */}
      {seam && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 h-px -translate-y-1/2 shadow-[0_0_0_0.5px_rgb(0_0_0/0.6)]" />
      )}
    </div>
  );
}

/** Two digits in one frame, seam between them */
function Pair({ a, b, size, seam }: { a: string; b: string; size: Size; seam: boolean }) {
  return (
    <div className="flex overflow-hidden rounded-md shadow-border hairline-divide-x">
      <FlipDigit digit={a} size={size} seam={seam} />
      <FlipDigit digit={b} size={size} seam={seam} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Widget                                                                */

export function TeletypeClock({
  zones,
  defaultZone = 0,
  size = "sm",
  showSeconds = false,
  hideLabel = false,
  seam = true,
  className,
}: {
  zones: Zone[];
  defaultZone?: number;
  size?: Size;
  /** Add a third flap pair for seconds. */
  showSeconds?: boolean;
  /** Dial only — no city / relative-time label. */
  hideLabel?: boolean;
  /** Draw the dark hinge line across each digit. */
  seam?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(defaultZone);
  const [now, setNow] = useState(() => new Date());
  const [viewerZone, setViewerZone] = useState(zones[defaultZone].timeZone);

  useEffect(() => {
    setViewerZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const zone = zones[active];
  const { hh, mm, ss } = useMemo(() => partsIn(now, zone.timeZone), [now, zone.timeZone]);
  const rel = useMemo(
    () => relativeLabel(now, zone.timeZone, viewerZone),
    [now, zone.timeZone, viewerZone],
  );

  return (
    <div className={twMerge("flex w-fit flex-col gap-5", className)}>
      {/* Dial */}
      <div className="flex items-center gap-3" aria-live="off">
        <Pair a={hh[0]} b={hh[1]} size={size} seam={seam} />
        <Pair a={mm[0]} b={mm[1]} size={size} seam={seam} />
        {showSeconds && <Pair a={ss[0]} b={ss[1]} size={size} seam={seam} />}
        <span className="sr-only">
          {hh}:{mm}{showSeconds ? `:${ss}` : ""} in {zone.city}
        </span>
      </div>

      {/* Label */}
      {!hideLabel && (
      <div>
        <Text variant="cardHeader" as="p" className="uppercase tracking-[0.02em]">
          {zone.city}
        </Text>
        <Text variant="cardDescription" as="p" className="mt-0.5 text-foreground">
          {rel}
        </Text>
      </div>
      )}

      {/* Zone tabs */}
      {zones.length > 1 && (
        <div role="tablist" aria-label="Time zones" className="flex gap-6">
          {zones.map((z, i) => {
            const { hh: zh, mm: zm } = partsIn(now, z.timeZone);
            const selected = i === active;
            return (
              <button
                key={z.timeZone}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setActive(i)}
                className={twMerge(
                  "group relative flex flex-col items-start pb-2 text-left transition-colors",
                  selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Text variant="mono" as="span" className="tabular-nums text-current">
                  {zh}:{zm}
                </Text>
                <Text variant="labelSm" as="span" className="mt-0.5 text-current">
                  {z.city}
                </Text>
                {selected && (
                  <motion.span
                    layoutId="clock-zone-active"
                    className="absolute inset-x-0 bottom-0 h-px bg-brand"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TeletypeClock;
