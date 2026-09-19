"use client";

import { CheckCheck, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Demo } from "../mdx/demo";

const LETTER_SPRING = { type: "spring", damping: 20, stiffness: 350 } as const;

function Letters({ text, from }: { text: string; from: number }) {
  return (
    <>
      {text.slice(0, from)}
      {text
        .slice(from)
        .split("")
        .map((letter, index) => (
          <motion.span
            key={`${text}-${index}`}
            className="inline-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...LETTER_SPRING, delay: index * 0.1 }}
          >
            {letter}
          </motion.span>
        ))}
    </>
  );
}

function TrashIcon({ rotation }: { rotation: number }) {
  return (
    <motion.span
      className="inline-flex"
      animate={{ rotate: rotation }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <Trash2 className="size-4" />
    </motion.span>
  );
}

/**
 * Hover reveals "Delete"; click asks for confirmation, then plays the
 * deleting → deleted sequence and resets itself after a few seconds.
 */
export function AnimatedDeleteButton({
  itemName = "item",
  onDelete,
}: {
  itemName?: string;
  onDelete?: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "deleting" | "deleted">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const start = () => {
    if (phase !== "idle") return;
    setPhase("deleting");
    timers.current.push(
      setTimeout(() => {
        setPhase("deleted");
        onDelete?.();
        timers.current.push(setTimeout(() => setPhase("idle"), 3000));
      }, 2000),
    );
  };

  return (
    <Demo>
      <motion.button
        type="button"
        whileHover="hover"
        initial="rest"
        onClick={start}
        aria-live="polite"
        className={cn(
          "relative w-56 overflow-hidden rounded-full bg-destructive py-2.5 text-sm font-medium text-white shadow-border",
          "transition-transform duration-100 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {phase === "deleting" ? (
            <Letters text="Deleting" from={5} />
          ) : phase === "deleted" ? (
            <Letters text="Deleted" from={5} />
          ) : (
            "Are you sure?"
          )}
        </span>

        <motion.span
          variants={{ rest: { x: "-100%" }, hover: { x: 0 } }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-background text-destructive shadow-border"
        >
          {phase === "deleted" ? (
            <>
              <span>Deleted successfully</span>
              <CheckCheck className="size-4" />
            </>
          ) : (
            <>
              <span>Delete {itemName}</span>
              <TrashIcon rotation={phase === "deleting" ? 20 : 0} />
            </>
          )}
        </motion.span>
      </motion.button>
    </Demo>
  );
}
