"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Text } from "./Typography";
import { factsLeft, factsRight, TIMEZONE, type Fact } from "@/constants/facts";

/* ---------- live clock: "02:11 AM // 5h ahead" ---------- */

function useLocalClock(timeZone: string) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(now);

  // Offset difference between my timezone and the viewer's, in whole hours.
  const offsetMin = (tz: string) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(now);
    const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
    const m = raw.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/);
    if (!m) return 0;
    const sign = m[1].startsWith("-") ? -1 : 1;
    return (
      sign *
      (Math.abs(parseInt(m[1], 10)) * 60 + (m[2] ? parseInt(m[2], 10) : 0))
    );
  };
  const viewerTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const diffH = (offsetMin(timeZone) - offsetMin(viewerTz)) / 60;
  const abs = Math.abs(diffH);
  const rel =
    diffH === 0
      ? "same time"
      : `${Number.isInteger(abs) ? abs : abs.toFixed(1)}h ${diffH > 0 ? "ahead" : "behind"}`;

  return { time, rel };
}

/* ---------- one row ---------- */

function FactRow({ fact }: { fact: Fact }) {
  const clock = useLocalClock(fact.kind === "clock" ? TIMEZONE : "UTC");
  const isClock = fact.kind === "clock";

  const value = isClock ? (clock?.time ?? "--:-- --") : fact.value;
  const meta = isClock ? (clock ? `// ${clock.rel}` : undefined) : fact.meta;

  const ValueEl = fact.href ? (
    <Link
      href={fact.href}
      target={fact.href.startsWith("http") ? "_blank" : undefined}
      rel={fact.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="underline decoration-[color:var(--hairline-strong)] underline-offset-4 transition-colors hover:decoration-current"
    >
      {value}
    </Link>
  ) : (
    value
  );

  const MetaEl = meta ? (
    fact.metaHref ? (
      <Link
        href={fact.metaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {meta}
      </Link>
    ) : (
      <span className="text-muted-foreground">{meta}</span>
    )
  ) : null;

  return (
    <li className="flex items-center gap-4">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md shadow-border text-muted-foreground"
      >
        <HugeiconsIcon icon={fact.icon} size={16} strokeWidth={1.5} />
      </span>
      <Text variant="mono" className={isClock ? "tabular-nums" : undefined}>
        <span className="sr-only">{fact.label}: </span>
        {ValueEl}
        {MetaEl && <> {MetaEl}</>}
      </Text>
    </li>
  );
}

/* ---------- block ---------- */

export function HeroFacts({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
        <ul className="flex flex-col gap-2">
          {factsLeft.map((f) => (
            <FactRow key={f.label} fact={f} />
          ))}
        </ul>
        <ul className="flex flex-col gap-2 sm:justify-end">
          {factsRight.map((f) => (
            <FactRow key={f.label} fact={f} />
          ))}
        </ul>
      </div>
    </div>
  );
}
