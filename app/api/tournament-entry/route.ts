import { NextResponse } from "next/server";
import { escapeHtml, mailConfigured, sendMail } from "@/lib/mail";
import { recipientFor } from "@/lib/recipients";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A tournament entry enquiry from a club app, emailed to the office.
//
// The club apps used to take full team registrations (squads per day) inside
// the fixtures list. That was too much form for a fixture card; now a fixture
// carries a short "enter a team" form that lands here and goes to the office
// as an email, and the office builds the team board from it.
//
// Every app sends here and only the office differs: the app names itself with
// `clubId` and lib/recipients maps that to an address held on the server, so
// no request can choose where mail goes.
//
// Sent through lib/mail (Resend for poloact.co.uk, or the Microsoft Graph
// fallback). Environment:
//   CLUB_RECIPIENTS   "tppc:…,druids:…,vaux:…,demo:…" — see lib/recipients
//   ENTRY_RECIPIENT   where an unknown clubId goes (then DEMO_RECIPIENT, then
//                     the Graph sender mailbox)
//   ENTRY_ORIGINS     comma-separated origins allowed to post here (defaults
//                     to the demo and the club apps' own domains)
const ORIGINS = (process.env.ENTRY_ORIGINS ||
  "https://demo.poloact.co.uk,https://tppc.poloact.co.uk,https://druids.poloact.co.uk,https://vaux.poloact.co.uk,http://localhost:5001,http://127.0.0.1:5001")
  .split(",").map((s) => s.trim()).filter(Boolean);

// The apps live on other origins, so the browser asks first.
function corsHeaders(origin: string | null) {
  const allow = origin && ORIGINS.includes(origin) ? origin : ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

type Entry = {
  club?: string; clubId?: string; fixture?: string; fixtureDate?: string; level?: string;
  team?: string; name?: string; email?: string; mobile?: string; message?: string;
  company?: string; // honeypot
};

export async function POST(request: Request) {
  const headers = corsHeaders(request.headers.get("origin"));
  let body: Entry;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400, headers }); }

  if (body.company && body.company.trim() !== "") return NextResponse.json({ ok: true }, { headers });

  const f = (v: unknown, n = 200) => String(v || "").trim().slice(0, n);
  const club = f(body.club), fixture = f(body.fixture), fixtureDate = f(body.fixtureDate), level = f(body.level);
  const clubId = f(body.clubId, 40);
  const team = f(body.team), name = f(body.name), email = f(body.email), mobile = f(body.mobile, 40);
  const message = f(body.message, 2000);
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !fixture) {
    return NextResponse.json({ ok: false, error: "Please add your name, a valid email and the fixture." }, { status: 400, headers });
  }
  const { to: RECIPIENT, matched } = recipientFor(clubId);
  if (!mailConfigured() || !RECIPIENT) {
    console.error("Tournament entry: no email sender or recipient is configured.");
    return NextResponse.json({ ok: false, error: "Email is not configured yet. Please try again later." }, { status: 503, headers });
  }
  // Worth knowing about: a club whose id is missing from CLUB_RECIPIENTS is
  // having its entries delivered to the default office rather than its own.
  if (clubId && !matched) console.warn(`Tournament entry: no recipient for clubId "${clubId}" — sent to the default office.`);

  const row = (k: string, v: string) => v ? `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>` : "";
  try {
    await sendMail({
      to: RECIPIENT,
      subject: `Tournament entry — ${fixture}${team ? ` — ${team}` : ""}${club ? ` (${club})` : ""}`,
      html:
        `<p>A team would like to enter <strong>${escapeHtml(fixture)}</strong>${fixtureDate ? `, ${escapeHtml(fixtureDate)}` : ""}.</p>` +
        `<table cellpadding="6" style="border-collapse:collapse">` +
        row("Club", club) + row("Fixture", fixture) + row("Date", fixtureDate) + row("Level", level) +
        row("Team", team) + row("Contact", name) +
        `<tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>` +
        row("Mobile", mobile) +
        (message ? `<tr><td><strong>Message</strong></td><td>${escapeHtml(message).replace(/\n/g, "<br>")}</td></tr>` : "") +
        `</table>` +
        `<p style="color:#6b5e4e">Reply to this email to reach them.</p>`,
      replyTo: email,
    });
    return NextResponse.json({ ok: true }, { headers });
  } catch (err) {
    console.error("Tournament entry send error:", err);
    return NextResponse.json({ ok: false, error: "We couldn't send that just now. Please try again." }, { status: 502, headers });
  }
}
