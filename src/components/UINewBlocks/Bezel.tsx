import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * Two-strip frame — reads like a clock bezel. Both strips are shadows:
 * inner ring, a gap of page background, outer ring. No borders.
 * Utilities `bezel` / `bezel-sm` live in globals.css for non-React use.
 */
export function Bezel({
  children,
  className,
  shape = "rounded-xl",
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  shape?: string;
  /** md: 1·5·6px strips (widgets). sm: 1·3·4px (icon tiles, keycaps). */
  size?: "md" | "sm";
}) {
  return (
    <div className={twMerge("bg-background", size === "sm" ? "bezel-sm" : "bezel", shape, className)}>
      {children}
    </div>
  );
}
