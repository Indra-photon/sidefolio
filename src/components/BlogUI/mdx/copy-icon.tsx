"use client";

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Swaps an idle icon for a check with a small blur/scale crossfade. */
export function CopyIcon({
  copied,
  icon,
  className,
}: {
  copied: boolean;
  icon: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const hidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.25, filter: "blur(4px)" };
  const shown = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, filter: "blur(0px)" };

  // `relative` so the exiting (position: absolute, via popLayout) icon is
  // pinned directly over the entering one.
  return (
    <span className="relative inline-flex">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          className="inline-flex"
          initial={hidden}
          animate={shown}
          exit={hidden}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          {copied ? (
            <CheckCircle2
              className={cn("text-emerald-600 dark:text-emerald-400", className)}
            />
          ) : (
            icon
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
