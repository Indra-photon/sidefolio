"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid hydration mismatch: theme is unknown until mounted on the client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={twMerge(
        "w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition duration-200 flex items-center space-x-2 py-2 px-2 rounded-md text-sm",
        className
      )}
    >
      {/* Render both icons at build time; only swap once mounted */}
      {mounted && isDark ? (
        <Sun className="h-4 w-4 shrink-0" />
      ) : (
        <Moon className="h-4 w-4 shrink-0" />
      )}
      <span>{mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}</span>
    </button>
  );
}
