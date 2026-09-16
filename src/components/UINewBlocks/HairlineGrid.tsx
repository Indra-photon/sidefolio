"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "./Typography";

/**
 * HairlineGrid — "graph paper" layout block.
 *
 * A fixed content column with full-height rails on both sides. Sections
 * draw edge-to-edge horizontal rules; rows split into hairline-divided
 * cells; hatch bands act as spacers. Everything uses semantic tokens so it
 * flips with the theme.
 *
 * Usage:
 *
 *   <HairlineGrid>
 *     <HairlineGrid.Hatch />
 *
 *     <HairlineGrid.Section index={1} total={3}>
 *       <div className="px-6 py-20 lg:px-10">…hero…</div>
 *     </HairlineGrid.Section>
 *
 *     <HairlineGrid.Section>
 *       <HairlineGrid.Row cols={4}>
 *         <HairlineGrid.Cell>
 *           <HairlineGrid.Cell.Row>100%</HairlineGrid.Cell.Row>
 *           <HairlineGrid.Cell.Row><Text variant="label">Label</Text></HairlineGrid.Cell.Row>
 *           <HairlineGrid.Cell.Row>Body copy</HairlineGrid.Cell.Row>
 *         </HairlineGrid.Cell>
 *         …
 *       </HairlineGrid.Row>
 *     </HairlineGrid.Section>
 *
 *     <HairlineGrid.Hatch />
 *   </HairlineGrid>
 *
 * Props on the root:
 *   width   – Tailwind max-width class for the content column (default GRID_WIDTH)
 *   rails   – draw the vertical rails (default true, hidden below lg)
 */

/* ------------------------------------------------------------------ */
/* Context: share the column width with children                       */

/** Default content-column width. Navbar and other shell pieces import this. */
export const GRID_WIDTH = "max-w-4xl";

const WidthCtx = React.createContext<string>(GRID_WIDTH);
const useCol = () => `mx-auto w-full ${React.useContext(WidthCtx)}`;

/* ------------------------------------------------------------------ */
/* Root                                                                 */

type RootProps = {
  children: React.ReactNode;
  className?: string;
  width?: string;
  rails?: boolean;
};

function Root({
  children,
  className,
  width = GRID_WIDTH,
  rails = true,
}: RootProps) {
  return (
    <WidthCtx.Provider value={width}>
      <div className={twMerge("relative w-full", className)}>
        {rails && (
          <div
            aria-hidden
            className={twMerge(
              "mx-auto w-full",
              width,
              "pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 lg:block",
            )}
          >
            <div className="absolute inset-0 hairline-x" />
          </div>
        )}
        {children}
      </div>
    </WidthCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  /** Section number for the "[ 01 of 07 ]" counter. */
  index?: number;
  total?: number;
  /** Optional title shown on the left of the index row. */
  title?: React.ReactNode;
  /** Which edge-to-edge rules to draw. */
  rule?: "both" | "top" | "bottom" | "none";
  id?: string;
};

function Section({
  children,
  className,
  index,
  total,
  title,
  rule = "bottom",
  id,
}: SectionProps) {
  const col = useCol();
  return (
    <section
      id={id}
      className={twMerge(
        "relative w-full",
        (rule === "both" || rule === "top") && "hairline-t",
        (rule === "both" || rule === "bottom") && "hairline-b",
        className,
      )}
    >
      <div className={col}>
        {(index !== undefined || title) && (
          <div className="flex items-center justify-between gap-6 hairline-b px-6 py-8 lg:px-10">
            {title ? (
              <Text variant="mono" as="h2" className="text-brand">
                {title}
              </Text>
            ) : (
              <span />
            )}
            {index !== undefined && <Index index={index} total={total} />}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Row                                                                  */

const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

type RowProps = {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6;
  className?: string;
};

function Row({ children, cols = 4, className }: RowProps) {
  return (
    <div
      className={twMerge(
        "grid hairline-divide-y sm:hairline-divide-y-none sm:hairline-divide-x",
        // 4-col collapses to 2x2 on tablets: restore the rule between the two rows.
        cols === 4 &&
          "sm:[&>*:nth-child(n+3)]:hairline-t lg:[&>*:nth-child(n+3)]:hairline-t-none",
        // 2-col with more than one row: rule between rows on sm+.
        cols === 2 && "sm:[&>*:nth-child(n+3)]:hairline-t",
        // First cell of each sm row must not carry a left divider.
        cols === 2 && "sm:[&>*:nth-child(2n+1)]:hairline-l-none",
        cols === 4 &&
          "sm:[&>*:nth-child(2n+1)]:hairline-l-none lg:[&>*:nth-child(2n+1)]:hairline-l lg:[&>*:nth-child(4n+1)]:hairline-l-none",
        COLS[cols],
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cell + Cell.Row                                                      */

type CellProps = {
  children: React.ReactNode;
  className?: string;
  /** Column span inside a Row (desktop only). */
  span?: 2 | 3 | 4;
};

function CellBase({ children, className, span }: CellProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col",
        span === 2 && "lg:col-span-2",
        span === 3 && "lg:col-span-3",
        span === 4 && "lg:col-span-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CellRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "hairline-b px-6 py-5 last:hairline-b-none lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

const Cell = Object.assign(CellBase, { Row: CellRow });

/* ------------------------------------------------------------------ */
/* Hatch                                                                */

function Hatch({
  className,
  height = "h-24",
}: {
  className?: string;
  height?: string;
}) {
  const col = useCol();
  return (
    <div className={twMerge("w-full hairline-b", className)}>
      <div
        aria-hidden
        className={twMerge(col, height)}
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--hairline) 0 1px, transparent 1px 10px)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Eyebrow, Index (labels live in Typography.tsx as <Text variant="label"> */

function Eyebrow({
  children,
  className,
  dotClassName = "bg-primary",
}: {
  children: React.ReactNode;
  className?: string;
  dotClassName?: string;
}) {
  return (
    <Text
      variant="labelSm"
      className={twMerge(
        "inline-flex items-center gap-2 shadow-border px-3 py-1.5 text-foreground",
        className,
      )}
    >
      <span className={twMerge("h-2 w-2 shrink-0", dotClassName)} />
      {children}
    </Text>
  );
}

function Index({
  index,
  total,
  className,
}: {
  index: number;
  total?: number;
  className?: string;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <Text
      variant="labelSm"
      className={twMerge("tabular-nums normal-case", className)}
    >
      [ <span className="text-brand">{pad(index)}</span>
      {total !== undefined && <> of {pad(total)}</>} ]
    </Text>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Compound form for client components: <HairlineGrid.Section />.
 * Server components must use the named exports below — static props do
 * not survive the server -> client module boundary.
 */
export const HairlineGrid = Object.assign(Root, {
  Section,
  Row,
  Cell,
  Hatch,
  Eyebrow,
  Index,
});

export {
  Root as HairlineGridRoot,
  Section as HairlineGridSection,
  Row as HairlineGridRow,
  Cell as HairlineGridCell,
  Hatch as HairlineGridHatch,
  Eyebrow as HairlineGridEyebrow,
  Index as HairlineGridIndex,
};

export default HairlineGrid;
