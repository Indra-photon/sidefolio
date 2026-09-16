"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Text } from "./Typography";
import { useContributions } from "./data";
import { HeatmapView } from "./contributions/HeatmapView";
import { AreaView } from "./contributions/AreaView";
import { SkylineView } from "./contributions/SkylineView";
import { RingView } from "./contributions/RingView";

const VIEWS = [
  { id: "heatmap", label: "Heatmap" },
  { id: "area", label: "Area" },
  { id: "skyline", label: "Skyline" },
  { id: "ring", label: "Ring" },
] as const;

/** Fixed stage height: tall enough for the ring, others centre inside it. */
const STAGE_H = "h-[300px]";

// Swap: outgoing shrinks + blurs out (fast), incoming un-blurs + scales in.
const EASE = [0.2, 0, 0, 1] as const;
const swap = {
  initial: { opacity: 0, scale: 0.96, filter: "blur(6px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.3, ease: EASE } },
  exit: { opacity: 0, scale: 0.96, filter: "blur(6px)", transition: { duration: 0.2, ease: EASE } },
};
type ViewId = (typeof VIEWS)[number]["id"];
const KEY = "contrib-view";

/**
 * GitHub contributions with a user-selectable encoding. One fetch, four
 * views, crossfade between them; choice persists per browser.
 */
export function ContributionsWidget({ className }: { className?: string }) {
  const { days, total, error } = useContributions();
  const [view, setView] = useState<ViewId>("heatmap");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as ViewId | null;
      if (saved && VIEWS.some((v) => v.id === saved)) setView(saved);
    } catch {}
  }, []);
  const choose = (id: ViewId) => {
    setView(id);
    try { localStorage.setItem(KEY, id); } catch {}
  };

  const t = { duration: reduceMotion ? 0 : 0.3, ease: EASE };

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={300}>
      <div className={twMerge("flex flex-col gap-4", className)}>
        {/* Header: label · total · view switcher */}
        <div className="flex min-h-7 flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex items-baseline gap-3">
            <Text variant="body" className="text-foreground">GitHub Contributions</Text>
            <Text variant="body" className="tabular-nums">
              {error ? "unavailable" : days ? `${total.toLocaleString()} · last year` : "…"}
            </Text>
          </div>
          <div role="tablist" aria-label="Graph type" className="flex items-center gap-4">
            {VIEWS.map((v) => {
              const selected = v.id === view;
              return (
                <button
                  key={v.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => choose(v.id)}
                  className="group relative flex h-7 items-center outline-none"
                >
                  <Text
                    variant="nav"
                    as="span"
                    className={twMerge(
                      "transition-colors group-hover:text-foreground group-focus-visible:text-foreground",
                      selected && "text-foreground",
                    )}
                  >
                    {v.label}
                  </Text>
                  {selected && (
                    <motion.span
                      layoutId="contrib-view-active"
                      className="absolute inset-x-0 bottom-0 h-px bg-brand"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage: fixed height, content centred. popLayout lets the outgoing
            view blur/shrink away while the incoming one arrives. */}
        <div className={twMerge("relative flex items-center justify-center rounded-2xl bg-muted/40 bezel px-6", STAGE_H)}>
          <AnimatePresence initial={false} mode="popLayout">
            {!days ? (
              <motion.div
                key="loading"
                className="h-28 w-full animate-pulse rounded-sm bg-foreground/[0.04]"
                variants={swap}
                initial={false}
                animate="animate"
                exit="exit"
                transition={t}
              />
            ) : (
              <motion.div
                key={view}
                className="w-full"
                variants={swap}
                initial={reduceMotion ? false : "initial"}
                animate={reduceMotion ? { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0 } } : "animate"}
                exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : "exit"}
              >
                {view === "heatmap" && <HeatmapView days={days} />}
                {view === "area" && <AreaView days={days} />}
                {view === "skyline" && <SkylineView days={days} />}
                {view === "ring" && <RingView days={days} total={total} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}
