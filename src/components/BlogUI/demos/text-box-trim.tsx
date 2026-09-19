"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Demo } from "../mdx/demo";
import { SegmentedControl } from "../mdx/segmented-control";

// Shows the "invisible space" a font reserves above cap height and below the
// baseline inside a line box, on a button and a card. Metrics are measured
// from the real font via canvas so the overlay is exact, not illustrative.

type Metrics = {
  /** Height of the line box. */
  line: number;
  /** Distance from the top of the line box to the alphabetic baseline. */
  baseline: number;
  /** Cap height of the font at this size. */
  cap: number;
};

function measure(el: HTMLElement): Metrics | null {
  const style = getComputedStyle(el);
  const canvas = document.createElement("canvas").getContext("2d");
  if (!canvas) return null;
  canvas.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const m = canvas.measureText("H");
  const ascent = m.fontBoundingBoxAscent;
  const descent = m.fontBoundingBoxDescent;
  if (!ascent || !descent) return null;
  const line = parseFloat(style.lineHeight) || el.getBoundingClientRect().height;
  // Half-leading splits the difference between line-height and the font's
  // content area; the baseline then sits `ascent` below that.
  const baseline = (line - (ascent + descent)) / 2 + ascent;
  return { line, baseline, cap: m.actualBoundingBoxAscent };
}

/**
 * Text that can reveal its own line box: dashed outline, hatched bands for
 * the space above the caps and below the baseline, and (optionally) labels.
 */
function Skeleton({
  children,
  show,
  trim,
  labels,
  className,
}: {
  children: string;
  show: boolean;
  trim: boolean;
  labels?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useLayoutEffect(() => {
    if (!(show || trim) || !ref.current) return;
    const update = () => setMetrics(ref.current ? measure(ref.current) : null);
    update();
    document.fonts?.ready.then(update);
    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [show, trim]);

  // Trimmed: the box now runs cap-to-baseline, so there is no slack to hatch.
  const top = metrics && !trim ? metrics.baseline - metrics.cap : 0;
  const bottom = metrics && !trim ? metrics.line - metrics.baseline : 0;

  return (
    <span
      ref={ref}
      className={cn("relative inline-block", className)}
      style={
        trim
          ? ({ textBoxTrim: "trim-both", textBoxEdge: "cap alphabetic" } as React.CSSProperties)
          : undefined
      }
    >
      {children}
      {(show || trim) && metrics && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* line box (after trimming it hugs the caps and the baseline) */}
          <span
            className={cn(
              "absolute inset-0 rounded-[2px] outline-1 outline-dashed",
              trim ? "outline-emerald-500/80" : "outline-muted-foreground/60",
            )}
          />
          {/* space above the caps */}
          <span className="absolute inset-x-0 top-0 skeleton-hatch" style={{ height: top }} />
          {/* space below the baseline */}
          <span className="absolute inset-x-0 bottom-0 skeleton-hatch" style={{ height: bottom }} />
          {labels && !trim && (
            <>
              <span
                className="absolute right-full mr-2 flex -translate-y-1/2 items-center gap-1 whitespace-nowrap font-mono text-[10px] text-amber-600 dark:text-amber-400"
                style={{ top: top / 2 }}
              >
                invisible space
                <span aria-hidden="true">→</span>
              </span>
              <span
                className="absolute right-full mr-2 flex translate-y-1/2 items-center gap-1 whitespace-nowrap font-mono text-[10px] text-amber-600 dark:text-amber-400"
                style={{ bottom: bottom / 2 }}
              >
                below baseline
                <span aria-hidden="true">→</span>
              </span>
            </>
          )}
        </span>
      )}
    </span>
  );
}

/**
 * `<TextBoxTrimDemo />` - the problem. `<TextBoxTrimDemo fix />` - adds a
 * third state that applies `text-box-trim: trim-both; text-box-edge: cap
 * alphabetic` so the reader can compare.
 */
export function TextBoxTrimDemo({ fix = false }: { fix?: boolean }) {
  const [mode, setMode] = useState<"rendered" | "skeleton" | "trimmed">("rendered");
  const show = mode === "skeleton";
  const trim = mode === "trimmed";

  const options = [
    { value: "rendered" as const, label: "Rendered" },
    { value: "skeleton" as const, label: "Skeleton" },
    ...(fix ? [{ value: "trimmed" as const, label: "Trimmed" }] : []),
  ];

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="flex w-full max-w-md flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
        {/* Button: equal padding, yet the label floats. */}
        <div className="pl-24 sm:pl-0">
          <span
            className={cn(
              "inline-flex rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-border",
              show && "outline-1 outline-dashed outline-offset-2 outline-muted-foreground/40",
            )}
          >
            <Skeleton show={show} trim={trim} labels>
              Save changes
            </Skeleton>
          </span>
        </div>

        {/* Card: a heading and a list with identical gaps between rows. The
            rows read as unevenly spaced because each line box carries the
            font's slack above and below the letters. */}
        <div
          className={cn(
            "w-56 rounded-xl bg-background p-4 shadow-border",
            show && "outline-1 outline-dashed outline-offset-2 outline-muted-foreground/40",
          )}
        >
          <p className="text-sm font-medium text-foreground">
            <Skeleton show={show} trim={trim}>
              Workspace
            </Skeleton>
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            {["General", "Members", "Billing", "Integrations"].map((item) => (
              <li key={item} className="flex">
                <Skeleton show={show} trim={trim}>
                  {item}
                </Skeleton>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SegmentedControl ariaLabel="View" options={options} value={mode} onChange={setMode} />
    </Demo>
  );
}
