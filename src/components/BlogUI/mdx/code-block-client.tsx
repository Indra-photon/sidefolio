"use client";

import { Copy, FileCode2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

import { CopyIcon } from "./copy-icon";

export type HighlightedCodeTab = {
  label: string;
  language: string;
  code: string;
  html: string;
  filename?: string;
};

// The header shows a made-up filename for the active tab, so the snippet
// reads as "where this goes" rather than a bare code dump.
const FILE_BY_LANGUAGE: Record<string, string> = {
  css: "styles.css",
  html: "app.tsx",
  tsx: "app.tsx",
  jsx: "app.jsx",
  ts: "app.ts",
  js: "app.js",
  bash: "terminal",
  sh: "terminal",
  json: "config.json",
  md: "README.md",
  mdx: "post.mdx",
};

const TAB_MORPH = { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } as const;

export function CodeBlockClient({
  tabs,
  hideHeader = false,
}: {
  tabs: HighlightedCodeTab[];
  /** Drops the filename/tab bar; for one-liners like a terminal command. */
  hideHeader?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pillId = useId();
  const tabId = useId();
  const activeTab = tabs[activeIndex] ?? tabs[0];
  const reduceMotion = useReducedMotion();

  // Inactive panels sit out of flow, so the wrapper only ever knows the
  // active panel's height. Measure it and let motion tween between tabs;
  // the observer keeps it honest when wrapped lines reflow on resize.
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [panelHeight, setPanelHeight] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    const panel = panelRefs.current[activeIndex];
    if (!panel) return;
    const measure = () => setPanelHeight(panel.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [activeIndex]);

  useEffect(
    () => () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    },
    [],
  );

  function selectTab(index: number) {
    setActiveIndex(index);
    setCopied(false);
  }

  function handleTabKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    selectTab(nextIndex);
    document.getElementById(`${tabId}-tab-${nextIndex}`)?.focus();
  }

  async function copyCode() {
    await navigator.clipboard.writeText(activeTab.code);
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl bg-card shadow-border">
      {!hideHeader && (
        <div className="flex items-center justify-between gap-3 py-2 pr-2 pl-4 hairline-b">
          {/* One label per tab, stacked and crossfaded on the same 200ms
              curve as the code panels below. */}
          <div className="grid min-w-0 font-mono text-[11px] text-muted-foreground">
            {tabs.map((tab, index) => {
              const active = index === activeIndex;
              const name = tab.filename ?? FILE_BY_LANGUAGE[tab.language] ?? "app.tsx";
              return (
                <span
                  key={tab.label}
                  aria-hidden={!active}
                  className={cn(
                    "col-start-1 row-start-1 flex min-w-0 items-center gap-2 transition-opacity duration-200",
                    active ? "opacity-100" : "opacity-0",
                  )}
                >
                  <FileCode2 aria-hidden="true" className="size-3 shrink-0" />
                  <span className="truncate">{name}</span>
                </span>
              );
            })}
          </div>
          {tabs.length > 1 && (
            <div
              role="tablist"
              aria-label="Code examples"
              className="inline-flex h-8 items-center rounded-full p-0.5"
            >
              {tabs.map((tab, index) => {
                const active = index === activeIndex;
                return (
                  <button
                    key={tab.label}
                    id={`${tabId}-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls={`${tabId}-panel-${index}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => selectTab(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={cn(
                      "relative flex h-7 cursor-pointer items-center rounded-full px-2.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={pillId}
                        transition={reduceMotion ? { duration: 0 } : TAB_MORPH}
                        className="absolute inset-0 rounded-full bg-muted"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <motion.div
        className="relative overflow-hidden"
        initial={false}
        animate={{ height: panelHeight }}
        transition={reduceMotion ? { duration: 0 } : TAB_MORPH}
      >
        {/* Floats over the code's top-right corner. The backdrop keeps it
            readable when a long line scrolls underneath. */}
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="absolute top-2.5 right-2.5 z-10 backdrop-blur-sm"
          aria-label={copied ? "Code copied" : `Copy ${activeTab.label} code`}
          onClick={() => void copyCode()}
        >
          <CopyIcon copied={copied} icon={<Copy />} />
        </Button>
        {tabs.map((tab, index) => {
          const active = index === activeIndex;
          return (
            <div
              key={tab.label}
              ref={(node) => {
                panelRefs.current[index] = node;
              }}
              id={`${tabId}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${tabId}-tab-${index}`}
              // React 18 types don't know `inert`; the empty string is the
              // boolean-attribute form the DOM expects.
              {...({ inert: active ? undefined : "" } as Record<string, unknown>)}
              className={cn(
                "code-block-panel min-w-0 transition-opacity duration-200",
                active
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-x-0 top-0 opacity-0",
              )}
              dangerouslySetInnerHTML={{ __html: tab.html }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
