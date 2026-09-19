"use client";

import { CheckCheck, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Demo } from "../mdx/demo";
import { Button } from "../ui/button";

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

// Lid rotates from its hinge while the can stays put.
function TrashIcon({ rotation }: { rotation: number }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="-2 -6 28 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        style={{
          transformOrigin: "right bottom",
          transformBox: "fill-box",
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        <path d="M4 7l16 0" />
      </g>
      <path d="M10 11l0 6" />
      <path d="M14 11l0 6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    </svg>
  );
}

const slideVariants = {
  rest: {
    x: "0%",
    justifyContent: "center",
    transition: { type: "spring" as const, stiffness: 300, damping: 20, mass: 2 },
  },
  hover: {
    x: "-80%",
    justifyContent: "space-between",
    transition: { type: "spring" as const, stiffness: 300, damping: 20, mass: 1 },
  },
};

/**
 * Variant: the label sheet slides aside on hover to expose "Are you sure?";
 * clicking runs the deleting → deleted sequence. Reset with the button.
 */
export function VariantDeleteButton() {
  const [phase, setPhase] = useState<"idle" | "deleting" | "deleted">("idle");
  const [hovered, setHovered] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const start = () => {
    if (phase !== "idle") return;
    setPhase("deleting");
    timers.current.push(setTimeout(() => setPhase("deleted"), 5000));
    timers.current.push(setTimeout(() => setHovered(false), 7000));
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setPhase("idle");
    setHovered(false);
  };

  const open = hovered || phase === "deleting";

  return (
    <Demo className="relative">
      <motion.button
        type="button"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => phase === "idle" && setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => phase === "idle" && setHovered(false)}
        animate={open ? "hover" : "rest"}
        onClick={start}
        aria-live="polite"
        className="relative w-52 overflow-hidden rounded-full bg-destructive py-2 text-sm font-medium text-white shadow-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span className="flex items-center justify-center gap-2 pl-4">
          {phase === "deleting" ? (
            <Letters text="Deleting" from={5} />
          ) : phase === "deleted" ? (
            <Letters text="Deleted" from={5} />
          ) : (
            "Are you sure?"
          )}
        </span>

        <motion.span
          variants={slideVariants}
          className="pointer-events-none absolute inset-0 flex items-center rounded-full bg-background px-3 text-destructive shadow-border"
        >
          <span>{phase === "deleted" ? "Deleted successfully" : "Delete"}</span>
          {phase === "deleted" ? <CheckCheck className="size-4" /> : <TrashIcon rotation={phase === "deleting" ? 20 : 0} />}
        </motion.span>
      </motion.button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Reset"
        onClick={reset}
        className="absolute top-3 right-3"
      >
        <RotateCcw />
      </Button>
    </Demo>
  );
}
