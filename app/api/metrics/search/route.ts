import { NextResponse } from "next/server";
import { getGoogleAccessToken, googleConfigured, GSC_SCOPE } from "../../../../lib/google-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// URL-prefix property, verified in layout.tsx. Override via env if it ever changes.
const SITE_URL = process.env.GSC_SITE_URL || "https://poloact.co.uk/";

function daysAgo(n: number): string {
  // Search Console data lags ~2-3 days; window is computed from "today" anyway.
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString().slice(0, 10);
}

async function query(token: string, body: Record<string, unknown>) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      SITE_URL
    )}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(`Search Console query failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const num = (v: unknown) => Number(v ?? 0) || 0;

export async function GET() {
  if (!googleConfigured()) {
    return NextResponse.json({ configured: false });
  }

  try {
    const token = await getGoogleAccessToken(GSC_SCOPE);
    const startDate = daysAgo(28);
    const endDate = daysAgo(1);

    const [totals, queries, pages] = await Promise.all([
      query(token, { startDate, endDate, dimensions: [] }),
      query(token, { startDate, endDate, dimensions: ["query"], rowLimit: 15 }),
      query(token, { startDate, endDate, dimensions: ["page"], rowLimit: 10 }),
    ]);

    const t = totals.rows?.[0] ?? {};

    return NextResponse.json({
      configured: true,
      window: { startDate, endDate },
      totals: {
        clicks: num(t.clicks),
        impressions: num(t.impressions),
        ctr: num(t.ctr),
        position: num(t.position),
      },
      queries: (queries.rows ?? []).map(
        (r: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }) => ({
          query: r.keys?.[0] || "",
          clicks: num(r.clicks),
          impressions: num(r.impressions),
          ctr: num(r.ctr),
          position: num(r.position),
        })
      ),
      pages: (pages.rows ?? []).map(
        (r: { keys: string[]; clicks: number; impressions: number; position: number }) => ({
          page: r.keys?.[0] || "",
          clicks: num(r.clicks),
          impressions: num(r.impressions),
          position: num(r.position),
        })
      ),
    });
  } catch (err) {
    console.error("Search Console metrics error:", err);
    return NextResponse.json(
      { configured: true, error: "Couldn't load Search Console data." },
      { status: 502 }
    );
  }
}
