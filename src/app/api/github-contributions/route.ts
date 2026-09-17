import { NextResponse } from "next/server";

const USER = "Indra-photon";
export const revalidate = 3600; // 1h

export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

async function fromJogruber(): Promise<{ total: number; days: Day[] }> {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, {
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`jogruber ${res.status}`);
  const j = await res.json();
  return { total: j.total?.lastYear ?? 0, days: j.contributions as Day[] };
}

// Fallback: parse GitHub's own contributions fragment (no auth needed)
async function fromGithubHtml(): Promise<{ total: number; days: Day[] }> {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    next: { revalidate },
    headers: { "user-agent": "Mozilla/5.0 (portfolio contributions widget)" },
  });
  if (!res.ok) throw new Error(`github ${res.status}`);
  const html = await res.text();
  const days: Day[] = [];
  const re = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) days.push({ date: m[1], count: 0, level: Number(m[2]) as Day["level"] });
  days.sort((a, b) => a.date.localeCompare(b.date));
  const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in the last year/i);
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : 0;
  return { total, days };
}

export async function GET() {
  try {
    const data = await fromJogruber().catch(fromGithubHtml);
    return NextResponse.json({ user: USER, ...data });
  } catch (err) {
    console.error("github-contributions:", err);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
