"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { navlinks } from "@/constants/navlinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GRID_WIDTH } from "./HairlineGrid";
import { Text } from "./Typography";
import avatar from "../../../public/images/profilepic.webp";

const NAME = "Indranil Maiti";

function track(label: string, url: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "navigation_click",
    menu_item: label,
    destination_url: url,
  });
}

/**
 * Top navbar. Left: avatar + name. Right: links + theme toggle.
 * Sits on the same content column as HairlineGrid so the rails line up.
 */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full hairline-b bg-background/80 backdrop-blur-md">
      <div className={twMerge("mx-auto w-full", GRID_WIDTH)}>
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            onClick={() => track("Brand", "/")}
            className="flex items-center gap-3"
            aria-label={`${NAME} — home`}
          >
            <Text variant="brand">{NAME}</Text>
          </Link>

          {/* Desktop links */}
          <nav
            aria-label="Primary"
            className="hidden h-14 items-center gap-1 md:flex"
          >
            {navlinks.map((l) => {
              const active = isActive(l.url);
              return (
                <Link
                  key={l.url}
                  href={l.url}
                  onClick={() => track(l.label, l.url)}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex h-14 items-center px-3 perspective-[100px]"
                >
                  {/* Cube: both faces pushed out by half the box height on Z;
                      the box turns 90° about its centre so the front face recedes
                      and the bottom face comes forward. One motion, no fades. */}
                  <span
                    className={twMerge(
                      "relative block transform-3d transition-transform duration-300 ease-in-out",
                      "motion-safe:group-hover:transform-[rotateX(90deg)]",
                      "motion-safe:group-focus-visible:transform-[rotateX(90deg)]",
                      "motion-safe:group-active:transform-[rotateX(90deg)_scale(0.98)]",
                    )}
                  >
                    <Text
                      variant="nav"
                      className={twMerge(
                        "block backface-hidden motion-safe:transform-[translateZ(0.5em)]",
                        "motion-reduce:transition-colors motion-reduce:duration-150 motion-reduce:group-hover:text-foreground",
                        active && "text-foreground",
                      )}
                    >
                      {l.label}
                    </Text>
                    <Text
                      variant="nav"
                      aria-hidden
                      className={twMerge(
                        "absolute inset-0 block backface-hidden text-brand",
                        "motion-safe:transform-[rotateX(-90deg)_translateZ(0.5em)]",
                        "motion-reduce:hidden",
                      )}
                    >
                      {l.label}
                    </Text>
                  </span>
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 bottom-0 h-px bg-brand"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                      }}
                    />
                  )}
                </Link>
              );
            })}
            <span
              className="mx-2 h-4 w-px bg-[var(--hairline-strong)]"
              aria-hidden
            />
            {/* Toggle + key hint in one box: theme-aware ring + inner highlight */}
            <ThemeToggle
              iconOnly
              className="h-8 overflow-hidden rounded-md shadow-[var(--shadow-border)] [&>span:first-child]:w-8"
            >
              <kbd
                aria-hidden
                className="flex h-full min-w-7 items-center justify-center px-2 shadow-[inset_1px_0_0_0_var(--hairline-strong)]"
              >
                <Text variant="nav" as="span" className="normal-case">
                  D
                </Text>
              </kbd>
            </ThemeToggle>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle iconOnly />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              aria-label="Primary"
              key="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="overflow-hidden hairline-t md:hidden"
            >
              <ul className="hairline-divide-y">
                {navlinks.map((l) => {
                  const active = isActive(l.url);
                  return (
                    <li key={l.url}>
                      <Link
                        href={l.url}
                        onClick={() => track(l.label, l.url)}
                        aria-current={active ? "page" : undefined}
                        className={twMerge(
                          "group flex items-center gap-3 px-6 py-3.5 transition-colors",
                          active ? "bg-accent" : "hover:bg-accent/60",
                        )}
                      >
                        <l.icon
                          className={twMerge(
                            "h-4 w-4 shrink-0 transition-colors group-hover:text-foreground",
                            active
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        />
                        <Text
                          variant="nav"
                          className={twMerge(
                            "transition-colors group-hover:text-foreground",
                            active && "text-foreground",
                          )}
                        >
                          {l.label}
                        </Text>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
