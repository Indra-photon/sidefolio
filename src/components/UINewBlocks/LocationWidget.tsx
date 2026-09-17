"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, GlobeIcon } from "@hugeicons/core-free-icons";
import { Bezel } from "./Bezel";
import { Text } from "./Typography";
import { LOCATION, describeWeather, useClock, useWeather } from "./data";
import { TeletypeClock } from "./TeletypeClock";
import { WorldMap } from "./WorldMap";

/**
 * LocationWidget — where I am, right now.
 * Two views in one housing: a world map with a blinking marker (default), and
 * a bento board of weather / date / split-flap time. The globe tile and the
 * clock button swap between them. Tile colours are fixed; housing follows theme.
 */

// Tile palette (oklch). Ink = text colour that reads on that tile.
const TILE = {
  blue: { bg: "oklch(0.72 0.14 250)", ink: "oklch(0.13 0.02 260)" },
  orange: { bg: "oklch(0.76 0.17 55)", ink: "oklch(0.15 0.03 60)" },
  red: { bg: "oklch(0.60 0.22 27)", ink: "oklch(0.98 0 0)" },
  dark: { bg: "oklch(0.22 0 0)", ink: "oklch(0.98 0 0)" },
} as const;

function tile(c: { bg: string; ink: string }): CSSProperties {
  return { backgroundColor: c.bg, color: c.ink };
}

// Flap skins on the red tile: override the tokens the clock reads, locally.
const flapVars = {
  "--muted": "oklch(0.42 0.17 27)",
  "--foreground": "oklch(0.98 0 0)",
  "--hairline": "oklch(0 0 0 / 0.35)",
  "--shadow-border": "0 0 0 1px oklch(0 0 0 / 0.35)",
} as CSSProperties;

// The tile board always defines the housing height; the map is an overlay.
// Tiles recede (opacity + 3% shrink); the map arrives with a slow zoom-out
// (108% → 100%) and leaves fast on opacity alone — exits are shorter and
// simpler than entries.
const EASE = [0.2, 0, 0, 1] as const;
const tilesAnim = {
  shown: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.97 },
};

export function LocationWidget({
  defaultView = "map",
  className,
}: {
  defaultView?: "tiles" | "map";
  className?: string;
}) {
  const clock = useClock();
  const { weather } = useWeather();
  const wx = weather ? describeWeather(weather.code, weather.isDay) : null;
  const [view, setView] = useState<"tiles" | "map">(defaultView);
  const reduceMotion = useReducedMotion();
  const t = { duration: reduceMotion ? 0 : 0.3, ease: EASE };
  // Reduced motion: keep the fade, drop the zoom.
  const mapAnim = {
    initial: { opacity: 0, scale: reduceMotion ? 1 : 1.08 },
    animate: { opacity: 1, scale: 1, transition: { duration: reduceMotion ? 0 : 0.5, ease: EASE } },
    exit: { opacity: 0, transition: { duration: reduceMotion ? 0 : 0.2, ease: EASE } },
  };

  return (
    <Bezel shape="rounded-2xl" className={twMerge("w-full max-w-md", className)}>
      {/* Housing follows the theme (card token); the colour tiles are fixed */}
      <div className="relative overflow-hidden rounded-2xl bg-card text-card-foreground">
        <AnimatePresence initial={false}>
          {view === "map" && (
            <motion.div
              key="map"
              className="absolute inset-0 z-10 text-card-foreground"
              variants={mapAnim}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Map — fills the whole housing */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Zoomed and pushed down so Poland lands near the centre of the box */}
                <div className="absolute inset-0 origin-center scale-[1.5] translate-y-[34%]">
                  <WorldMap
                    lat={LOCATION.lat}
                    lon={LOCATION.lon}
                    fit="cover"
                    markerScale={1.6}
                    className="text-foreground/30"
                  />
                </div>
                {/* Scrims so the text stays legible over land */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-card to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent" />
              </div>

              {/* Header: back to clock · title */}
              <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setView("tiles")}
                  aria-label="Back to clock"
                  className="group -m-[10px] flex h-11 w-11 items-center justify-center text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.97]"
                >
                  {/* Same tile as the facts list: 24px, rounded-sm, bezel-sm.
                      The bezel gap reads the housing colour, not the page. */}
                  <span
                    aria-hidden
                    className="flex h-6 w-6 items-center justify-center rounded-sm bezel-sm bg-card [--background:var(--card)]"
                  >
                    <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.5} />
                  </span>
                </button>
                <span className="w-8" />
              </div>

              {/* Caption — mono, same size as the facts list */}
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <Text variant="mono" as="p" className="uppercase">
                    {LOCATION.city}
                  </Text>
                  <Text variant="mono" as="p" className="mt-1 truncate text-muted-foreground">
                    {LOCATION.country} · {LOCATION.lat.toFixed(2)}°N {LOCATION.lon.toFixed(2)}°E
                  </Text>
                </div>
                <div className="flex shrink-0 items-baseline gap-1.5">
                  <Text variant="mono" as="p" className="tabular-nums">
                    {clock ? `${clock.hh}:${clock.mm}` : "--:--"}
                  </Text>
                  <Text variant="mono" as="p" className="text-muted-foreground">
                    {clock?.gmt ?? ""}
                  </Text>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tiles: always mounted (they set the height), faded back under the map */}
        <motion.div
          className="grid grid-cols-[1.1fr_1fr_1fr] grid-rows-[auto_auto] gap-2 p-2"
          variants={tilesAnim}
          initial={defaultView === "map" ? "hidden" : "shown"}
          animate={view === "map" ? "hidden" : "shown"}
          transition={t}
          aria-hidden={view === "map"}
          style={{ pointerEvents: view === "map" ? "none" : "auto" }}
        >
          {/* Weather — tall blue tile */}
          <div
            className="row-span-2 flex flex-col justify-between rounded-2xl p-4"
            style={tile(TILE.blue)}
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              {wx && (
                <HugeiconsIcon
                  icon={wx.icon}
                  size={18}
                  strokeWidth={1.5}
                  className="shrink-0"
                />
              )}
              <span className="truncate text-[13px] font-medium leading-none">
                {wx?.label ?? "…"}
              </span>
            </div>
            <p className="text-[56px] font-semibold leading-none tracking-[-0.04em] tabular-nums">
              {weather ? `${weather.temperature}°` : "--°"}
            </p>
          </div>

          {/* Date — orange: weekday, day, month, week */}
          <div
            className="flex flex-col justify-between rounded-2xl p-3"
            style={tile(TILE.orange)}
          >
            <div className="flex items-baseline justify-between">
              <p className="text-[20px] font-semibold leading-none">
                {clock?.weekday ?? "—"}
              </p>
              <p className="text-[12px] font-medium leading-none opacity-80">
                {clock?.month ?? ""}
              </p>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-[32px] font-semibold leading-none tabular-nums">
                {clock?.day ?? "--"}
              </p>
              <p className="text-[11px] font-medium leading-none opacity-80 tabular-nums">
                {clock ? `W${clock.week}` : ""}
              </p>
            </div>
          </div>

          {/* Globe — opens the map view */}
          <button
            type="button"
            onClick={() => setView("map")}
            aria-label="Show location on map"
            className="group flex items-center justify-center rounded-2xl p-3 transition-transform duration-150 ease-out active:scale-[0.97]"
            style={tile(TILE.dark)}
          >
            <HugeiconsIcon
              icon={GlobeIcon}
              size={30}
              strokeWidth={1.5}
              className="transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:rotate-12"
              style={{ color: TILE.orange.bg }}
            />
          </button>

          {/* Split-flap HH MM SS + zone — red, spans two columns */}
          <div
            className="col-span-2 flex flex-col items-start gap-2.5 rounded-2xl p-3"
            style={tile(TILE.red)}
          >
            <div style={flapVars} className="origin-left scale-[0.8]">
              <TeletypeClock
                zones={[{ city: LOCATION.city, timeZone: LOCATION.timeZone }]}
                showSeconds
                hideLabel
                seam={false}
                className="[&>div]:gap-2"
              />
            </div>
            <p className="-mt-2 text-[12px] font-medium tabular-nums opacity-90">
              {clock ? `${clock.gmt} · ${clock.tzAbbr}` : "—"}
            </p>
          </div>
        </motion.div>
      </div>
    </Bezel>
  );
}
