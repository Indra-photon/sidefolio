"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";

import type { NavNode } from "@/lib/blog/posts";
import { BLOG_BASE } from "@/lib/blog/site";
import { cn } from "@/lib/utils";

import { CategoryIcon, dotColorFrom, dotColorTo, type DotColor } from "./category-icon";

const PAGES = [{ href: BLOG_BASE, label: "Index" }];

// Flight time (ms) of the dot's arc and colour crossfade. The layout spring
// below settles in roughly the same window, so the three stay in step.
const DOT_FLIGHT_MS = 350;
// Moment in the flight (0-1) when the dot's arc closes on the row and "hits"
// the name. Drives the name's recoil and the colour sweep.
const DOT_IMPACT = 0.8;
const DOT_IMPACT_MS = DOT_FLIGHT_MS * DOT_IMPACT;
// Near-critically damped: spring overshoot scales with distance, so anything
// bouncier visibly sails past the target on long jumps down the list.
const DOT_SPRING = { type: "spring", stiffness: 800, damping: 52 } as const;

// How far (px) the dot bows out to the left while travelling between rows.
// Scales with distance so adjacent hops barely bend and long jumps swing wide.
const DOT_ARC_MIN = 10;
const DOT_ARC_MAX = 36;
const DOT_ARC_PER_ROW = 3;

// Where the dot sits (px) at the moment of impact: just left of the name's
// edge, which is still at x=0 until the hit shoves it right. The dot then
// follows the name in to its resting spot, so it never draws over the text.
const DOT_TOUCH_OFFSET = -5;

function arcOffset(rows: number) {
  if (rows === 0) return 0;
  return -Math.min(DOT_ARC_MAX, DOT_ARC_MIN + (rows - 1) * DOT_ARC_PER_ROW);
}

// The active name sits shoved to the right of the dot. On a hit it snaps
// out quickly and settles without bouncing; on leaving it slides back.
const NAME_RECOIL = { type: "spring", stiffness: 1000, damping: 60 } as const;
const NAME_RETURN = { type: "spring", stiffness: 900, damping: 45 } as const;

function nameTransition(active: boolean, travelling: boolean) {
  if (!active) return NAME_RETURN;
  // Wait for the dot to arrive so the name reads as pushed, not self-moving.
  return { ...NAME_RECOIL, delay: travelling ? DOT_IMPACT_MS / 1000 : 0 };
}

type Row = { href: string; color: DotColor };
type Travel = { from: number; to: number };

// Every focusable row in nav order (pages, category headings, posts), so the
// dot knows how far it travels and which colour it leaves behind. Must match
// the render order below exactly.
function collectRows(tree: NavNode[]): Row[] {
  const rows: Row[] = PAGES.map((page) => ({ href: page.href, color: "foreground" }));
  const walk = (node: NavNode) => {
    rows.push({ href: node.href, color: node.color });
    node.posts.forEach((post) => rows.push({ href: post.href, color: node.color }));
    node.children.forEach(walk);
  };
  tree.forEach(walk);
  return rows;
}

function ActiveDot({
  layoutId,
  from,
  to,
  offset,
  reduceMotion,
}: {
  layoutId: string;
  /** Colour of the row the dot is leaving (crossfaded from mid-flight). */
  from: DotColor;
  /** Colour of the row the dot lands on. */
  to: DotColor;
  /** Arc bow in px; 0 means no travel (initial mount), so no arc/crossfade. */
  offset: number;
  reduceMotion: boolean;
}) {
  const travelling = offset !== 0 && !reduceMotion;
  return (
    <motion.span
      layoutId={layoutId}
      // The shared-layout projection moves the dot in a straight line between
      // rows; a synced x keyframe on top of it bends that path into an arc.
      animate={{ x: travelling ? [0, offset, DOT_TOUCH_OFFSET, 0] : 0 }}
      transition={{
        layout: reduceMotion ? { duration: 0 } : DOT_SPRING,
        // Peak early, close in on the name's edge by impact, then ride the
        // last few px alongside the name as it gets pushed.
        x: {
          duration: DOT_FLIGHT_MS / 1000,
          times: [0, 0.3, DOT_IMPACT, 1],
          ease: ["easeOut", "easeInOut", "easeOut"],
        },
      }}
      className="absolute top-[calc(50%-2px)] left-0 size-1"
    >
      {/* Colour lives on an inner span, kept separate from the element that
          owns the layout projection. */}
      <span
        className={cn(
          "block size-full rounded-full bg-(--dot-to)",
          dotColorFrom[from],
          dotColorTo[to],
          // The dot mounts fresh on each row, so the CSS keyframe plays once
          // per landing and crossfades the previous colour into the new.
          travelling && "dot-crossfade",
        )}
      />
    </motion.span>
  );
}

const linkClass =
  "inline-block rounded-[3px] py-1 outline-none transition-colors duration-200 focus-visible:ring-[1.5px] focus-visible:ring-inset focus-visible:ring-ring/60";

type RowRenderer = {
  pathname: string;
  travelling: boolean;
  renderDot: (to: DotColor) => React.ReactNode;
};

function NavGroup({ node, ctx }: { node: NavNode; ctx: RowRenderer }) {
  const top = node.depth === 0;
  const headingActive = ctx.pathname === node.href;
  return (
    <li className={cn(top ? "mt-5" : "mt-2")}>
      <div className="relative">
        {headingActive && ctx.renderDot(node.color)}
        <Link
          href={node.href}
          aria-current={headingActive ? "page" : undefined}
          className={cn(
            linkClass,
            top || headingActive
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <motion.span
            className="inline-flex items-center gap-1.5"
            initial={false}
            animate={{ x: headingActive ? 12 : 0 }}
            transition={nameTransition(headingActive, ctx.travelling)}
          >
            {top && <CategoryIcon slug={node.slug} color={node.color} className="mb-px" />}
            <span
              className={cn(
                dotColorTo[node.color],
                headingActive && ctx.travelling && "name-hit",
              )}
            >
              {node.name}
            </span>
          </motion.span>
        </Link>
      </div>
      <ul className={cn("mt-1 flex flex-col", !top && "pl-3")}>
        {node.posts.map((post) => {
          const active = ctx.pathname === post.href;
          return (
            <li key={post.href} className="relative">
              {active && ctx.renderDot(node.color)}
              {post.available ? (
                <Link
                  href={post.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    linkClass,
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <motion.span
                    className="inline-block"
                    initial={false}
                    animate={{ x: active ? 12 : 0 }}
                    transition={nameTransition(active, ctx.travelling)}
                  >
                    <span
                      className={cn(
                        dotColorTo[node.color],
                        // Class is added when the row becomes active, which
                        // is what starts the CSS sweep.
                        active && ctx.travelling && "name-hit",
                      )}
                    >
                      {post.title}
                    </span>
                  </motion.span>
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  title="Coming soon"
                  className="inline-block cursor-not-allowed py-1 text-muted-foreground/40 select-none"
                >
                  {post.title}
                </span>
              )}
            </li>
          );
        })}
        {node.children.map((child) => (
          <NavGroup key={child.href} node={child} ctx={ctx} />
        ))}
      </ul>
    </li>
  );
}

export function SidebarNav({ tree, className }: { tree: NavNode[]; className?: string }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion() ?? false;
  // The nav renders twice (rail + mobile sheet) - keep the dot's
  // shared-layout animation scoped to each instance.
  const dotId = useId();

  const rows = collectRows(tree);
  const activeIndex = rows.findIndex((row) => row.href === pathname);

  // Remember where the dot came from. Updated during render (the React
  // "derived state" pattern) so the dot mounts already knowing its journey.
  // On first paint from === to, which reads as "no travel".
  const [travel, setTravel] = useState<Travel>({ from: activeIndex, to: activeIndex });
  if (travel.to !== activeIndex) {
    setTravel({ from: travel.to, to: activeIndex });
  }

  // A previous index of -1 means the dot wasn't on screen (e.g. a 404 page);
  // it then appears in place rather than flying in.
  const travelled =
    travel.from >= 0 && activeIndex >= 0 ? Math.abs(activeIndex - travel.from) : 0;
  const offset = reduceMotion ? 0 : arcOffset(travelled);
  const travelling = offset !== 0;
  const fromColor = travel.from >= 0 ? rows[travel.from].color : rows[activeIndex]?.color;

  const ctx: RowRenderer = {
    pathname,
    travelling,
    renderDot: (to) => (
      <ActiveDot
        layoutId={dotId}
        from={fromColor ?? to}
        to={to}
        offset={offset}
        reduceMotion={reduceMotion}
      />
    ),
  };

  return (
    <nav
      aria-label="Blog"
      // pt-4 centres the 24px "Index" row inside the toolbar's 56px band so
      // the two line up; pb-12 matches the 3rem fade-mask-b stop so resting
      // content stays opaque and only overflow fades at the bottom.
      // overflow-y also clips horizontally, so pl-10/-ml-10 give the active
      // dot room for its widest arc without shifting anything visually.
      className={cn(
        "fade-mask-b scrollbar-hidden -ml-10 overflow-y-auto pt-4 pb-12 pl-10",
        className,
      )}
      // Shared with the CSS keyframes (dot-crossfade, name-hit) so every part
      // of the landing is timed from the same two numbers.
      style={
        {
          "--dot-flight": `${DOT_FLIGHT_MS}ms`,
          "--dot-impact": `${DOT_IMPACT_MS}ms`,
        } as React.CSSProperties
      }
    >
      <ul className="flex flex-col gap-1 text-xs">
        {PAGES.map((page) => {
          const active = pathname === page.href;
          return (
            <li key={page.href} className="relative">
              {active && ctx.renderDot("foreground")}
              <Link
                href={page.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  linkClass,
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <motion.span
                  className="inline-block"
                  initial={false}
                  animate={{ x: active ? 10 : 0 }}
                  transition={nameTransition(active, travelling)}
                >
                  {page.label}
                </motion.span>
              </Link>
            </li>
          );
        })}
        {tree.map((node) => (
          <NavGroup key={node.href} node={node} ctx={ctx} />
        ))}
      </ul>
    </nav>
  );
}
