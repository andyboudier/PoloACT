"use client";

import { useCallback, useEffect, useState } from "react";

type GA4 = {
  configured: boolean;
  error?: string;
  totals?: {
    users28: number; sessions28: number; views28: number; keyEvents28: number;
    users7: number; sessions7: number; keyEvents7: number;
  };
  channels?: { name: string; sessions: number }[];
  pages?: { path: string; views: number }[];
  daily?: { date: string; users: number }[];
};

type Search = {
  configured: boolean;
  error?: string;
  window?: { startDate: string; endDate: string };
  totals?: { clicks: number; impressions: number; ctr: number; position: number };
  queries?: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
  pages?: { page: string; clicks: number; impressions: number; position: number }[];
};

type Clarity = {
  configured: boolean;
  error?: string;
  days?: number;
  traffic?: { sessions: number; bots: number; distinctUsers: number; pagesPerSession: number };
  quality?: { rageClicks: number; deadClicks: number; quickBack: number; excessiveScroll: number; scriptErrors: number };
};

const fmt = (n: number | undefined) =>
  n == null ? "—" : n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString("en-GB");
const pct = (n: number | undefined) => (n == null ? "—" : `${(n * 100).toFixed(1)}%`);
const pos = (n: number | undefined) => (n == null || n === 0 ? "—" : n.toFixed(1));

function Trend({ now, prev }: { now?: number; prev?: number }) {
  // prev is the 7-day figure; compare it to the prior 7 days implied by 28d isn't exact,
  // so we simply show the last-7-day contribution as a share of 28 days.
  if (now == null || prev == null || now === 0) return null;
  const share = Math.round((prev / now) * 100);
  return <span className="gx-trend">{share}% in last 7d</span>;
}

function Spark({ data }: { data?: { date: string; users: number }[] }) {
  if (!data || data.length < 2) return null;
  const w = 260, h = 46, max = Math.max(1, ...data.map((d) => d.users));
  const step = w / (data.length - 1);
  const pts = data.map((d, i) => `${(i * step).toFixed(1)},${(h - (d.users / max) * (h - 6) - 3).toFixed(1)}`);
  return (
    <svg className="gx-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts.join(" ")} fill="none" stroke="var(--brass)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="gx-bars">
      {rows.map((r, i) => (
        <div className="gx-bar-row" key={i}>
          <span className="gx-bar-label" title={r.label}>{r.label}</span>
          <span className="gx-bar-track"><span className="gx-bar-fill" style={{ width: `${(r.value / max) * 100}%` }} /></span>
          <span className="gx-bar-val">{fmt(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

function Connect({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="gx-connect">
      <p className="gx-connect-title">{title} isn&rsquo;t connected yet</p>
      <ol>{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
    </div>
  );
}

export default function Dashboard() {
  const [ga4, setGa4] = useState<GA4 | null>(null);
  const [search, setSearch] = useState<Search | null>(null);
  const [clarity, setClarity] = useState<Clarity | null>(null);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    const j = async (u: string) => {
      try { const r = await fetch(u, { cache: "no-store" }); return await r.json(); }
      catch { return { configured: true, error: "Request failed." }; }
    };
    const [a, b, c] = await Promise.all([
      j("/api/metrics/ga4"), j("/api/metrics/search"), j("/api/metrics/clarity"),
    ]);
    setGa4(a); setSearch(b); setClarity(c);
    setUpdated(new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const t = ga4?.totals;

  return (
    <div className="gx">
      <header className="gx-head">
        <div>
          <span className="gx-eyebrow">Internal · not indexed</span>
          <h1>PoloACT Growth</h1>
          <p className="gx-sub">Traffic, search and behaviour in one place. Windows: analytics &amp; search = last 28 days; Clarity = last 3 days.</p>
        </div>
        <div className="gx-head-actions">
          <button className="gx-btn" onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</button>
          {updated && <span className="gx-updated">Updated {updated}</span>}
        </div>
      </header>

      {/* KPI row */}
      <section className="gx-kpis">
        <div className="gx-kpi">
          <span className="gx-kpi-label">Visitors <em>28d</em></span>
          <span className="gx-kpi-num">{fmt(t?.users28)}</span>
          <Trend now={t?.users28} prev={t?.users7} />
        </div>
        <div className="gx-kpi">
          <span className="gx-kpi-label">Sessions <em>28d</em></span>
          <span className="gx-kpi-num">{fmt(t?.sessions28)}</span>
          <Trend now={t?.sessions28} prev={t?.sessions7} />
        </div>
        <div className="gx-kpi">
          <span className="gx-kpi-label">Search clicks <em>28d</em></span>
          <span className="gx-kpi-num">{fmt(search?.totals?.clicks)}</span>
          {search?.totals && <span className="gx-trend">{fmt(search.totals.impressions)} impressions</span>}
        </div>
        <div className="gx-kpi gx-kpi-accent">
          <span className="gx-kpi-label">Demo leads <em>28d</em></span>
          <span className="gx-kpi-num">{fmt(t?.keyEvents28)}</span>
          <span className="gx-trend">{fmt(t?.keyEvents7)} in last 7d</span>
        </div>
      </section>

      <div className="gx-grid">
        {/* Search Console */}
        <section className="gx-card gx-card-wide">
          <h2>Search — what people type to find you</h2>
          {search && !search.configured && (
            <Connect title="Google Search Console" steps={[
              "Create a Google Cloud service account and JSON key (Analytics Data + Search Console APIs enabled).",
              "In Search Console → Settings → Users and permissions, add the service-account email as a Full user.",
              "Set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in Vercel.",
            ]} />
          )}
          {search?.error && <p className="gx-err">{search.error}</p>}
          {search?.configured && search.totals && (
            <>
              <div className="gx-mini">
                <div><b>{fmt(search.totals.clicks)}</b><span>clicks</span></div>
                <div><b>{fmt(search.totals.impressions)}</b><span>impressions</span></div>
                <div><b>{pct(search.totals.ctr)}</b><span>CTR</span></div>
                <div><b>{pos(search.totals.position)}</b><span>avg position</span></div>
              </div>
              <table className="gx-table">
                <thead><tr><th>Query</th><th>Clicks</th><th>Impr.</th><th>Pos.</th></tr></thead>
                <tbody>
                  {(search.queries ?? []).slice(0, 12).map((q, i) => (
                    <tr key={i}><td className="gx-q">{q.query || "—"}</td><td>{fmt(q.clicks)}</td><td>{fmt(q.impressions)}</td><td>{pos(q.position)}</td></tr>
                  ))}
                  {(!search.queries || search.queries.length === 0) && <tr><td colSpan={4} className="gx-empty">No search data yet — impressions build up over the first few weeks.</td></tr>}
                </tbody>
              </table>
            </>
          )}
        </section>

        {/* GA4 channels */}
        <section className="gx-card">
          <h2>Where visitors come from</h2>
          {ga4 && !ga4.configured && (
            <Connect title="Google Analytics" steps={[
              "Reuse the same Google service account.",
              "In GA4 → Admin → Property access, add its email as a Viewer.",
              "Property ID 549797214 is already wired.",
            ]} />
          )}
          {ga4?.error && <p className="gx-err">{ga4.error}</p>}
          {ga4?.configured && ga4.channels && (
            ga4.channels.length ? <Bars rows={ga4.channels.map((c) => ({ label: c.name, value: c.sessions }))} />
              : <p className="gx-empty">No sessions in range yet.</p>
          )}
          {ga4?.configured && ga4.daily && ga4.daily.length > 1 && (
            <div className="gx-spark-wrap"><span className="gx-spark-cap">Daily visitors</span><Spark data={ga4.daily} /></div>
          )}
        </section>

        {/* GA4 top pages */}
        <section className="gx-card">
          <h2>Top pages</h2>
          {ga4?.configured && ga4.pages
            ? (ga4.pages.length ? <Bars rows={ga4.pages.map((p) => ({ label: p.path, value: p.views }))} /> : <p className="gx-empty">No page views yet.</p>)
            : (ga4 && !ga4.configured ? <p className="gx-empty">Connect Google Analytics to see this.</p> : null)}
        </section>

        {/* Clarity */}
        <section className="gx-card gx-card-wide">
          <h2>Behaviour — Microsoft Clarity <span className="gx-badge">last 3 days</span></h2>
          {clarity && !clarity.configured && (
            <Connect title="Microsoft Clarity" steps={[
              "In Clarity → Settings → Data export, generate an API token.",
              "Set CLARITY_API_TOKEN in Vercel.",
              "Session replays and heatmaps stay in the Clarity dashboard — this shows the headline signals.",
            ]} />
          )}
          {clarity?.error && <p className="gx-err">{clarity.error}</p>}
          {clarity?.configured && clarity.traffic && (
            <div className="gx-mini gx-mini-6">
              <div><b>{fmt(clarity.traffic.sessions)}</b><span>sessions</span></div>
              <div><b>{fmt(clarity.traffic.distinctUsers)}</b><span>users</span></div>
              <div><b>{clarity.traffic.pagesPerSession.toFixed(1)}</b><span>pages/session</span></div>
              <div><b>{fmt(clarity.quality?.rageClicks)}</b><span>rage clicks</span></div>
              <div><b>{fmt(clarity.quality?.deadClicks)}</b><span>dead clicks</span></div>
              <div><b>{fmt(clarity.quality?.quickBack)}</b><span>quick-backs</span></div>
            </div>
          )}
        </section>
      </div>

      <footer className="gx-foot">
        <span>Live from GA4, Search Console &amp; Microsoft Clarity · read-only · consent-gated collection.</span>
        <span className="gx-links">
          <a href="https://analytics.google.com/analytics/web/#/p549797214/realtime/overview" target="_blank" rel="noopener noreferrer">GA4</a>
          <a href="https://search.google.com/search-console?resource_id=https://poloact.co.uk/" target="_blank" rel="noopener noreferrer">Search Console</a>
          <a href="https://clarity.microsoft.com/projects/view/y9i7z4uls1/dashboard" target="_blank" rel="noopener noreferrer">Clarity</a>
        </span>
      </footer>
    </div>
  );
}
