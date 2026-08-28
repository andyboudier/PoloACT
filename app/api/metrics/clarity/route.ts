import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Microsoft Clarity Data Export API.
// Generate a token in Clarity → Settings → Data Export, then set CLARITY_API_TOKEN in Vercel.
// The API returns at most the last 3 days.
const TOKEN = process.env.CLARITY_API_TOKEN;

type ClarityMetric = {
  metricName: string;
  information: Record<string, string>[];
};

const num = (v: unknown) => Number(v ?? 0) || 0;

export async function GET() {
  if (!TOKEN) {
    return NextResponse.json({ configured: false });
  }

  try {
    const res = await fetch(
      "https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3",
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Clarity export failed: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as ClarityMetric[];
    const byName = new Map<string, Record<string, string>[]>();
    for (const m of data ?? []) byName.set(m.metricName, m.information || []);

    const traffic = byName.get("Traffic")?.[0] ?? {};
    const firstCount = (name: string) => num(byName.get(name)?.[0]?.sessionsCount);

    return NextResponse.json({
      configured: true,
      days: 3,
      traffic: {
        sessions: num(traffic.totalSessionCount),
        bots: num(traffic.totalBotSessionCount),
        distinctUsers: num(traffic.distinctUserCount),
        pagesPerSession: num(traffic.pagesPerSessionPercentage),
      },
      quality: {
        rageClicks: firstCount("RageClickCount"),
        deadClicks: firstCount("DeadClickCount"),
        quickBack: firstCount("QuickbackClick"),
        excessiveScroll: firstCount("ExcessiveScroll"),
        scriptErrors: firstCount("ScriptErrorCount"),
      },
    });
  } catch (err) {
    console.error("Clarity metrics error:", err);
    return NextResponse.json(
      { configured: true, error: "Couldn't load Microsoft Clarity data." },
      { status: 502 }
    );
  }
}
