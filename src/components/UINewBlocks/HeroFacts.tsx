"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Text } from "./Typography";
import { factsLeft, factsRight, type Fact } from "@/constants/facts";

/* ---------- one row ---------- */

function FactRow({ fact }: { fact: Fact }) {
  const { value, meta } = fact;

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
        className="m-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bezel-sm text-muted-foreground"
      >
        <HugeiconsIcon icon={fact.icon} size={16} strokeWidth={1.5} />
      </span>
      <Text variant="mono">
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
      <ul className="flex flex-col gap-2">
        {[...factsLeft, ...factsRight].map((f) => (
          <FactRow key={f.label} fact={f} />
        ))}
      </ul>
    </div>
  );
}
