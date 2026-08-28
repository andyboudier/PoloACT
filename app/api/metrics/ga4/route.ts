import { NextResponse } from "next/server";
import { getGoogleAccessToken, googleConfigured, GA4_SCOPE } from "../../../../lib/google-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PROPERTY_ID = process.env.GA4_PROPERTY_ID || "549797214";

type RunReportBody = {
  dateRanges: { startDate: string; endDate: string }[];
  dimensions?: { name: string }[];
  metrics: { name: string }[];
  orderBys?: unknown[];
  limit?: number;
  keepEmptyRows?: boolean;
};

async function runReport(token: string, body: RunReportBody) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(`GA4 runReport failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const num = (v: unknown) => Number(v ?? 0) || 0;

export async function GET() {
  if (!googleConfigured()) {
    return NextResponse.json({ configured: false });
  }

  try {
    const token = await getGoogleAccessToken(GA4_SCOPE);

    const [totals28, totals7, channels, pages, daily] = await Promise.all([
      // Site totals — last 28 days
      runReport(token, {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "keyEvents" },
        ],
      }),
      // Site totals — last 7 days (for trend)
      runReport(token, {
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "keyEvents" }],
      }),
      // Acquisition channels — last 28 days
      runReport(token, {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      }),
      // Top pages — last 28 days
      runReport(token, {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 8,
      }),
      // Daily active users — last 28 days (sparkline)
      runReport(token, {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
        keepEmptyRows: true,
      }),
    ]);

    const t28 = totals28.rows?.[0]?.metricValues ?? [];
    const t7 = totals7.rows?.[0]?.metricValues ?? [];

    return NextResponse.json({
      configured: true,
      totals: {
        users28: num(t28[0]?.value),
        sessions28: num(t28[1]?.value),
        views28: num(t28[2]?.value),
        keyEvents28: num(t28[3]?.value),
        users7: num(t7[0]?.value),
        sessions7: num(t7[1]?.value),
        keyEvents7: num(t7[2]?.value),
      },
      channels: (channels.rows ?? []).map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        name: r.dimensionValues[0]?.value || "(unknown)",
        sessions: num(r.metricValues[0]?.value),
      })),
      pages: (pages.rows ?? []).map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        path: r.dimensionValues[0]?.value || "/",
        views: num(r.metricValues[0]?.value),
      })),
      daily: (daily.rows ?? []).map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        date: r.dimensionValues[0]?.value || "",
        users: num(r.metricValues[0]?.value),
      })),
    });
  } catch (err) {
    console.error("GA4 metrics error:", err);
    return NextResponse.json(
      { configured: true, error: "Couldn't load Google Analytics data." },
      { status: 502 }
    );
  }
}
