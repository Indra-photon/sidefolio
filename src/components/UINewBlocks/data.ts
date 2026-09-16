"use client";

import { useEffect, useState } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  CloudAngledRainIcon,
  CloudAngledRainZapIcon,
  CloudFogIcon,
  CloudIcon,
  CloudLittleRainIcon,
  CloudSnowIcon,
  Moon02Icon,
  MoonCloudIcon,
  Sun03Icon,
  SunCloud01Icon,
} from "@hugeicons/core-free-icons";

export const LOCATION = {
  city: "Toruń",
  country: "Poland",
  countryCode: "PL",
  timeZone: "Europe/Warsaw",
  lat: 53.0138,
  lon: 18.5984,
};

/* ---------------- clock ---------------- */

export type ClockParts = {
  hh: string; mm: string; ss: string;
  h12: string; ampm: string;
  weekday: string; day: string; month: string;
  /** 0–1 progress through the day, for arcs and bars */
  dayFraction: number;
  /** minutes offset from viewer's zone (+ = ahead) */
  offsetFromViewer: number;
  tzAbbr: string;
  /** "GMT+2" */
  gmt: string;
  /** ISO week number */
  week: number;
};

function offsetMinutes(date: Date, timeZone: string) {
  const raw =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = raw.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1].startsWith("-") ? -1 : 1;
  return sign * (Math.abs(parseInt(m[1], 10)) * 60 + (m[2] ? parseInt(m[2], 10) : 0));
}

export function getClockParts(date: Date, timeZone: string, viewerZone: string): ClockParts {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone, hour12: false,
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    weekday: "short", day: "2-digit", month: "short", timeZoneName: "short",
  }).formatToParts(date);
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  const hh = g("hour") === "24" ? "00" : g("hour");
  const mm = g("minute"); const ss = g("second");
  const h = Number(hh);
  const dayFraction = (h * 3600 + Number(mm) * 60 + Number(ss)) / 86400;
  const offMin = offsetMinutes(date, timeZone);
  const gmt = `GMT${offMin >= 0 ? "+" : "-"}${Math.floor(Math.abs(offMin) / 60)}${offMin % 60 ? ":" + String(Math.abs(offMin) % 60).padStart(2, "0") : ""}`;
  // ISO week, computed on the zone-local calendar date
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  const [y, mo, d] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(y, mo - 1, d));
  const dow = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dow);
  const week = Math.ceil(((utc.getTime() - Date.UTC(utc.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7);
  return {
    hh, mm, ss,
    h12: String(h % 12 || 12).padStart(2, "0"),
    ampm: h < 12 ? "AM" : "PM",
    weekday: g("weekday"), day: g("day"), month: g("month"),
    dayFraction,
    offsetFromViewer: offMin - offsetMinutes(date, viewerZone),
    tzAbbr:
      new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "short" })
        .formatToParts(date)
        .find((x) => x.type === "timeZoneName")?.value ?? g("timeZoneName"),
    gmt,
    week,
  };
}

export function useClock(timeZone = LOCATION.timeZone) {
  const [now, setNow] = useState<Date | null>(null);
  const [viewerZone, setViewerZone] = useState(timeZone);
  useEffect(() => {
    setViewerZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now ? getClockParts(now, timeZone, viewerZone) : null;
}

export function relativeText(offsetMin: number) {
  if (offsetMin === 0) return "same time";
  const h = Math.abs(offsetMin) / 60;
  const n = Number.isInteger(h) ? h : h.toFixed(1);
  return `${n} ${h === 1 ? "hr" : "hrs"} ${offsetMin > 0 ? "ahead" : "behind"}`;
}

/* ---------------- weather ---------------- */

export type Weather = {
  temperature: number; code: number; wind: number; isDay: boolean; updatedAt: string;
  sunrise: string | null; sunset: string | null; // "HH:MM" in LOCATION.timeZone
};

export function useWeather() {
  const [w, setW] = useState<Weather | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => !cancelled && setW(d))
      .catch(() => !cancelled && setError(true));
    return () => { cancelled = true; };
  }, []);
  return { weather: w, error };
}

/** WMO weather code → label + icon (day/night aware) */
export function describeWeather(code: number, isDay: boolean): { label: string; icon: IconSvgElement } {
  if (code === 0) return { label: isDay ? "Clear sky" : "Clear night", icon: isDay ? Sun03Icon : Moon02Icon };
  if (code <= 2) return { label: "Partly cloudy", icon: isDay ? SunCloud01Icon : MoonCloudIcon };
  if (code === 3) return { label: "Overcast", icon: CloudIcon };
  if (code <= 48) return { label: "Fog", icon: CloudFogIcon };
  if (code <= 57) return { label: "Drizzle", icon: CloudLittleRainIcon };
  if (code <= 67) return { label: "Rain", icon: CloudAngledRainIcon };
  if (code <= 77) return { label: "Snow", icon: CloudSnowIcon };
  if (code <= 82) return { label: "Showers", icon: CloudAngledRainIcon };
  if (code <= 86) return { label: "Snow showers", icon: CloudSnowIcon };
  return { label: "Thunderstorm", icon: CloudAngledRainZapIcon };
}

/* ---------------- GitHub contributions ---------------- */

export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export function useContributions() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/github-contributions")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => { if (!cancelled) { setDays(d.days); setTotal(d.total); } })
      .catch(() => !cancelled && setError(true));
    return () => { cancelled = true; };
  }, []);
  return { days, total, error };
}

/** Derived shapes most graphs need. */
export function summarize(days: Day[]) {
  const weekly: number[] = [];
  const monthly = Array(12).fill(0) as number[];
  const byWeekdayMonth = Array.from({ length: 7 }, () => Array(12).fill(0) as number[]);
  const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  days.forEach((d, i) => {
    const w = Math.floor((i + first) / 7);
    weekly[w] = (weekly[w] ?? 0) + d.count;
    const dt = new Date(d.date + "T00:00:00Z");
    monthly[dt.getUTCMonth()] += d.count;
    byWeekdayMonth[dt.getUTCDay()][dt.getUTCMonth()] += d.count;
  });
  let cur = 0, longest = 0, run = 0;
  for (const d of days) { run = d.count > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  for (let i = days.length - 1; i >= 0 && days[i].count > 0; i--) cur++;
  const best = days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);
  const active = days.filter((d) => d.count > 0).length;
  const max = Math.max(1, ...days.map((d) => d.count));
  return { weekly, monthly, byWeekdayMonth, currentStreak: cur, longestStreak: longest, best, active, max };
}
