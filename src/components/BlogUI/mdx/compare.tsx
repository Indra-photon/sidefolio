import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type Verdict = "wrong" | "right";

/** Coloured "Wrong" / "Right" heading used above side-by-side examples. */
export function CompareLabel({
  verdict,
  children,
  className,
}: {
  verdict: Verdict;
  children?: React.ReactNode;
  className?: string;
}) {
  const Icon = verdict === "wrong" ? XCircle : CheckCircle2;
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium",
        verdict === "wrong" ? "text-destructive" : "text-emerald-600 dark:text-emerald-400",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {children ?? (verdict === "wrong" ? "Wrong" : "Right")}
    </div>
  );
}

/** Two-column grid for side-by-side comparisons inside a Demo. */
export function Compare({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-10", className)}>
      {children}
    </div>
  );
}

/** One column of a Compare grid: optional verdict heading, content, optional caption. */
export function CompareItem({
  verdict,
  label,
  caption,
  children,
  className,
}: {
  verdict?: Verdict;
  label?: React.ReactNode;
  caption?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-6", className)}>
      {verdict ? <CompareLabel verdict={verdict}>{label}</CompareLabel> : null}
      {children}
      {caption ? <span className="text-xs text-muted-foreground">{caption}</span> : null}
    </div>
  );
}

export const WRONG_ICON = (
  <XCircle aria-hidden="true" className="size-4 text-destructive" />
);
export const RIGHT_ICON = (
  <CheckCircle2 aria-hidden="true" className="size-4 text-emerald-600 dark:text-emerald-400" />
);
