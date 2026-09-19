"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Demo } from "../mdx/demo";

// Playground for text-box-trim / text-box-edge. The left box applies the real
// CSS to a sample; the right box is a diagram of the same font's metrics
// (measured via canvas) with the chosen edges and the trimmed regions marked.

const TRIM = ["none", "trim-start", "trim-end", "trim-both"] as const;
const OVER = ["text", "cap", "ex"] as const;
const UNDER = ["text", "alphabetic"] as const;
type Trim = (typeof TRIM)[number];
type Over = (typeof OVER)[number];
type Under = (typeof UNDER)[number];

type Metrics = {
  line: number;
  baseline: number;
  ascent: number;
  descent: number;
  cap: number;
  ex: number;
};

function measure(el: HTMLElement): Metrics | null {
  const style = getComputedStyle(el);
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const h = ctx.measureText("H");
  const x = ctx.measureText("x");
  const ascent = h.fontBoundingBoxAscent;
  const descent = h.fontBoundingBoxDescent;
  if (!ascent || !descent) return null;
  const line = parseFloat(style.lineHeight) || el.getBoundingClientRect().height;
  const baseline = (line - (ascent + descent)) / 2 + ascent;
  return { line, baseline, ascent, descent, cap: h.actualBoundingBoxAscent, ex: x.actualBoundingBoxAscent };
}

const field =
  "h-8 w-full rounded-md bg-background px-2 font-mono text-xs text-foreground shadow-border outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="flex w-36 flex-col gap-1">
      <span className="truncate font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={field}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

const SAMPLE = "Hxg";

export function TextBoxPlayground() {
  const [trim, setTrim] = useState<Trim>("trim-both");
  const [over, setOver] = useState<Over>("cap");
  const [under, setUnder] = useState<Under>("alphabetic");
  const ref = useRef<HTMLSpanElement>(null);
  const [m, setM] = useState<Metrics | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const update = () => setM(ref.current ? measure(ref.current) : null);
    update();
    document.fonts?.ready.then(update);
  }, []);

  const trimsStart = trim === "trim-start" || trim === "trim-both";
  const trimsEnd = trim === "trim-end" || trim === "trim-both";

  // y positions inside the diagram's line box.
  const y = m
    ? {
        lineTop: 0,
        contentTop: m.baseline - m.ascent,
        cap: m.baseline - m.cap,
        ex: m.baseline - m.ex,
        baseline: m.baseline,
        contentBottom: m.baseline + m.descent,
        lineBottom: m.line,
      }
    : null;
  const overY = y ? { text: y.contentTop, cap: y.cap, ex: y.ex }[over] : 0;
  const underY = y ? { text: y.contentBottom, alphabetic: y.baseline }[under] : 0;
  const boxTop = trimsStart ? overY : 0;
  const boxBottom = trimsEnd ? underY : (y?.lineBottom ?? 0);

  const guides = y
    ? [
        { key: "cap", label: "cap", y: y.cap, active: over === "cap" },
        { key: "ex", label: "ex", y: y.ex, active: over === "ex" },
        { key: "baseline", label: "alphabetic", y: y.baseline, active: under === "alphabetic" },
        { key: "top", label: "text", y: y.contentTop, active: over === "text" },
        { key: "bottom", label: "text", y: y.contentBottom, active: under === "text" },
      ]
    : [];

  const css = `text-box-trim: ${trim};\ntext-box-edge: ${over} ${under};`;

  return (
    <Demo className="gap-6 px-4 sm:px-8">
      <div className="flex flex-wrap items-end justify-center gap-3">
        <Select label="text-box-trim" value={trim} options={TRIM} onChange={setTrim} />
        <Select label="edge · over" value={over} options={OVER} onChange={setOver} />
        <Select label="edge · under" value={under} options={UNDER} onChange={setUnder} />
      </div>

      {/* Diagram: same font, metrics measured, trimming shown as lines. */}
      <div className="flex w-full max-w-md justify-center rounded-xl bg-background py-10 pr-24 pl-8 shadow-border">
        <span
          ref={ref}
          className="relative inline-block text-6xl font-medium leading-normal text-foreground"
        >
          <span className="opacity-40">{SAMPLE}</span>
          {y && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-0">
              {/* full line box */}
              <span className="absolute inset-0 outline-1 outline-dashed outline-muted-foreground/40" />
              {/* trimmed regions */}
              {trimsStart && (
                <span className="absolute inset-x-0 top-0 skeleton-hatch" style={{ height: boxTop }} />
              )}
              {trimsEnd && (
                <span
                  className="absolute inset-x-0 bottom-0 skeleton-hatch"
                  style={{ height: y.lineBottom - boxBottom }}
                />
              )}
              {/* resulting box */}
              <span
                className="absolute inset-x-0 outline-1 outline-emerald-500/90"
                style={{ top: boxTop, height: Math.max(0, boxBottom - boxTop) }}
              />
              {/* metric guides */}
              {guides.map((g) => (
                <span
                  key={g.key}
                  className={cn(
                    "absolute -right-20 left-0 flex items-center",
                    g.active ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/60",
                  )}
                  style={{ top: g.y }}
                >
                  <span className={cn("h-px flex-1", g.active ? "bg-emerald-500" : "bg-muted-foreground/40")} />
                  <span className="ml-1.5 font-mono text-[10px] leading-none">{g.label}</span>
                </span>
              ))}
            </span>
          )}
        </span>
      </div>

      <pre className="w-full max-w-md rounded-md bg-background px-4 py-3 font-mono text-xs text-foreground shadow-border">
        {css}
      </pre>
    </Demo>
  );
}
