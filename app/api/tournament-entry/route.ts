import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A tournament entry enquiry from a club app, emailed to the office.
//
// The club apps used to take full team registrations (squads per day) inside
// the fixtures list. That was too much form for a fixture card; now a fixture
// carries a short "enter a team" form that lands here and goes to the office
// as an email, and the office builds the team board from it.
//
// Same Microsoft Graph sender as /api/demo. Environment:
//   AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, DEMO_SENDER_UPN
//   ENTRY_RECIPIENT   where entries go (defaults to DEMO_RECIPIENT, then the sender)
//   ENTRY_ORIGINS     comma-separated origins allowed to post here (defaults
//                     to the demo and the club apps' own domains)
const TENANT = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const SENDER = process.env.DEMO_SENDER_UPN;
const RECIPIENT = process.env.ENTRY_RECIPIENT || process.env.DEMO_RECIPIENT || process.env.DEMO_SENDER_UPN;
const ORIGINS = (process.env.ENTRY_ORIGINS ||
  "https://demo.poloact.co.uk,https://tppc.poloact.co.uk,https://druids.poloact.co.uk,https://vaux.poloact.co.uk,http://localhost:5001,http://127.0.0.1:5001")
  .split(",").map((s) => s.trim()).filter(Boolean);

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

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

async function getGraphToken(): Promise<string> {
  const res = await fetch(`https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID!, client_secret: CLIENT_SECRET!,
      scope: "https://graph.microsoft.com/.default", grant_type: "client_credentials",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`token request failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("no access_token in token response");
  return data.access_token;
}

type Entry = {
  club?: string; fixture?: string; fixtureDate?: string; level?: string;
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
  const team = f(body.team), name = f(body.name), email = f(body.email), mobile = f(body.mobile, 40);
  const message = f(body.message, 2000);
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !fixture) {
    return NextResponse.json({ ok: false, error: "Please add your name, a valid email and the fixture." }, { status: 400, headers });
  }
  if (!TENANT || !CLIENT_ID || !CLIENT_SECRET || !SENDER) {
    console.error("Tournament entry: Microsoft Graph env vars are not configured.");
    return NextResponse.json({ ok: false, error: "Email is not configured yet. Please try again later." }, { status: 503, headers });
  }

  const row = (k: string, v: string) => v ? `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>` : "";
  try {
    const token = await getGraphToken();
    const message_ = {
      message: {
        subject: `Tournament entry — ${fixture}${team ? ` — ${team}` : ""}${club ? ` (${club})` : ""}`,
        body: {
          contentType: "HTML",
          content:
            `<p>A team would like to enter <strong>${escapeHtml(fixture)}</strong>${fixtureDate ? `, ${escapeHtml(fixtureDate)}` : ""}.</p>` +
            `<table cellpadding="6" style="border-collapse:collapse">` +
            row("Club", club) + row("Fixture", fixture) + row("Date", fixtureDate) + row("Level", level) +
            row("Team", team) + row("Contact", name) +
            `<tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>` +
            row("Mobile", mobile) +
            (message ? `<tr><td><strong>Message</strong></td><td>${escapeHtml(message).replace(/\n/g, "<br>")}</td></tr>` : "") +
            `</table>` +
            `<p style="color:#6b5e4e">Reply to this email to reach them.</p>`,
        },
        toRecipients: [{ emailAddress: { address: RECIPIENT! } }],
        replyTo: [{ emailAddress: { address: email } }],
      },
      saveToSentItems: true,
    };
    const sendRes = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER)}/sendMail`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(message_),
      cache: "no-store",
    });
    if (!sendRes.ok) {
      console.error(`Graph sendMail failed: ${sendRes.status} ${await sendRes.text()}`);
      return NextResponse.json({ ok: false, error: "We couldn't send that just now. Please try again." }, { status: 502, headers });
    }
    return NextResponse.json({ ok: true }, { headers });
  } catch (err) {
    console.error("Tournament entry send error:", err);
    return NextResponse.json({ ok: false, error: "We couldn't send that just now. Please try again." }, { status: 500, headers });
  }
}
