import { NextResponse } from "next/server";

// Toruń, Poland — Open-Meteo is free and needs no key. Cached 10 min.
const LAT = 53.0138;
const LON = 18.5984;
const TZ = "Europe/Warsaw";

export const revalidate = 600;

export async function GET() {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    `&current=temperature_2m,weather_code,wind_speed_10m,is_day&daily=sunrise,sunset&forecast_days=1&timezone=${encodeURIComponent(TZ)}`;
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const data = await res.json();
    const c = data.current;
    return NextResponse.json({
      temperature: Math.round(c.temperature_2m),
      code: c.weather_code as number,
      wind: Math.round(c.wind_speed_10m),
      isDay: c.is_day === 1,
      updatedAt: c.time as string,
      sunrise: (data.daily?.sunrise?.[0] as string | undefined)?.slice(11, 16) ?? null, // "HH:MM" local
      sunset: (data.daily?.sunset?.[0] as string | undefined)?.slice(11, 16) ?? null,
    });
  } catch (err) {
    console.error("weather:", err);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
