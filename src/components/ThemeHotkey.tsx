"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Press `D` (no modifier) to toggle light/dark.
 * Renders nothing; mount once inside ThemeProvider.
 */
export function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "d") return;
      // Plain "d" only — leave ⌘D / Ctrl+D / Alt+D to the browser
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;

      // Don't hijack the shortcut while typing (TinyMCE, inputs, textareas)
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))
      ) {
        return;
      }

      e.preventDefault();
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resolvedTheme, setTheme]);

  return null;
}
