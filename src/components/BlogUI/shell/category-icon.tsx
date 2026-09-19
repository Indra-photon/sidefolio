import {
  FlaskConical,
  Layers,
  PenTool,
  Server,
  Sparkles,
  Spline,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

import type { CategoryColor } from "@/lib/blog/categories";
import { cn } from "@/lib/utils";

// Icon per top-level category slug. Nested categories have no icon.
const icons: Record<string, LucideIcon> = {
  motion: Spline,
  "design-engineering": PenTool,
  redesigning: Layers,
  "how-to-ai": Sparkles,
  experiment: FlaskConical,
  "full-stack": Server,
};

export const categoryTextColor: Record<CategoryColor, string> = {
  violet: "text-violet-600 dark:text-violet-400",
  orange: "text-orange-600 dark:text-orange-400",
  amber: "text-amber-600 dark:text-amber-400",
  cyan: "text-cyan-600 dark:text-cyan-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  blue: "text-blue-600 dark:text-blue-400",
  rose: "text-rose-600 dark:text-rose-400",
};

export type DotColor = CategoryColor | "foreground";

// The sidebar's active dot reads its colour from CSS custom properties so it
// can crossfade from the previous category to the next one in CSS (Motion
// can't interpolate Tailwind's oklch palette). Two maps, since a single
// element carries both ends of the crossfade.
export const dotColorFrom: Record<DotColor, string> = {
  foreground: "[--dot-from:var(--foreground)]",
  violet: "[--dot-from:var(--color-violet-500)] dark:[--dot-from:var(--color-violet-400)]",
  orange: "[--dot-from:var(--color-orange-500)] dark:[--dot-from:var(--color-orange-400)]",
  amber: "[--dot-from:var(--color-amber-500)] dark:[--dot-from:var(--color-amber-400)]",
  cyan: "[--dot-from:var(--color-cyan-500)] dark:[--dot-from:var(--color-cyan-400)]",
  emerald: "[--dot-from:var(--color-emerald-500)] dark:[--dot-from:var(--color-emerald-400)]",
  blue: "[--dot-from:var(--color-blue-500)] dark:[--dot-from:var(--color-blue-400)]",
  rose: "[--dot-from:var(--color-rose-500)] dark:[--dot-from:var(--color-rose-400)]",
};

export const dotColorTo: Record<DotColor, string> = {
  foreground: "[--dot-to:var(--foreground)]",
  violet: "[--dot-to:var(--color-violet-500)] dark:[--dot-to:var(--color-violet-400)]",
  orange: "[--dot-to:var(--color-orange-500)] dark:[--dot-to:var(--color-orange-400)]",
  amber: "[--dot-to:var(--color-amber-500)] dark:[--dot-to:var(--color-amber-400)]",
  cyan: "[--dot-to:var(--color-cyan-500)] dark:[--dot-to:var(--color-cyan-400)]",
  emerald: "[--dot-to:var(--color-emerald-500)] dark:[--dot-to:var(--color-emerald-400)]",
  blue: "[--dot-to:var(--color-blue-500)] dark:[--dot-to:var(--color-blue-400)]",
  rose: "[--dot-to:var(--color-rose-500)] dark:[--dot-to:var(--color-rose-400)]",
};

export function CategoryIcon({
  slug,
  color,
  className,
  ...props
}: { slug: string; color: CategoryColor; className?: string } & LucideProps) {
  const Icon = icons[slug];
  if (!Icon) return null;
  return (
    <Icon
      aria-hidden="true"
      strokeWidth={1.75}
      className={cn("size-3.5", categoryTextColor[color], className)}
      {...props}
    />
  );
}
