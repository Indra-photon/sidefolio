"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { twMerge } from "tailwind-merge";

/* Icon swap: outgoing shrinks + blurs out, incoming un-blurs + scales in. */
const swap = {
  initial: { scale: 0.6, opacity: 0, filter: "blur(4px)" },
  animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
  exit: { scale: 0.6, opacity: 0, filter: "blur(4px)" },
};

export function ThemeToggle({
  className,
  iconOnly = false,
  children,
}: {
  className?: string;
  iconOnly?: boolean;
  /** Optional trailing content (e.g. a key hint) rendered inside the button. */
  children?: React.ReactNode;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  // Avoid hydration mismatch: theme is unknown until mounted on the client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const Icon = mounted && isDark ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle theme (D)"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={twMerge(
        iconOnly
          ? "flex h-9 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-[0.98]"
          : "w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition duration-200 flex items-center space-x-2 py-2 px-2 rounded-md text-sm",
        className,
      )}
    >
      {/* Fixed-size stage so the swap never shifts layout; square cell when icon-only */}
      <span
        className={twMerge(
          "relative flex h-4 w-4 shrink-0 items-center justify-center",
          iconOnly && "h-full w-9",
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={mounted ? (isDark ? "sun" : "moon") : "moon"}
            className="absolute inset-0 flex items-center justify-center"
            variants={swap}
            initial={reduceMotion ? false : "initial"}
            animate="animate"
            exit={reduceMotion ? undefined : "exit"}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <Icon className="h-3 w-3" strokeWidth={1.8} />
          </motion.span>
        </AnimatePresence>
      </span>
      {!iconOnly && (
        <span>{mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}</span>
      )}
      {children}
    </button>
  );
}
