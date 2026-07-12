import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Config from environment (set these in Vercel → Settings → Environment Variables) ---
// AZURE_TENANT_ID       - Directory (tenant) ID of the Azure AD app registration
// AZURE_CLIENT_ID       - Application (client) ID
// AZURE_CLIENT_SECRET   - a client secret value for that app registration
// DEMO_SENDER_UPN       - the M365 mailbox to send *from* (e.g. noreply@actsystems.co.uk)
// DEMO_RECIPIENT        - where demo requests are delivered (defaults to DEMO_SENDER_UPN)

const TENANT = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const SENDER = process.env.DEMO_SENDER_UPN;
const RECIPIENT = process.env.DEMO_RECIPIENT || process.env.DEMO_SENDER_UPN;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function getGraphToken(): Promise<string> {
  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(`token request failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("no access_token in token response");
  return data.access_token;
}

export async function POST(request: Request) {
  let body: { club?: string; email?: string; company?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const club = (body.club || "").trim().slice(0, 200);
  const email = (body.email || "").trim().slice(0, 200);

  if (!club || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please add your club and a valid email." },
      { status: 400 }
    );
  }

  if (!TENANT || !CLIENT_ID || !CLIENT_SECRET || !SENDER) {
    console.error("Demo form: Microsoft Graph env vars are not configured.");
    return NextResponse.json(
      { ok: false, error: "Email is not configured yet. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const token = await getGraphToken();

    const message = {
      message: {
        subject: `New PoloACT demo request — ${club}`,
        body: {
          contentType: "HTML",
          content:
            `<p>A new demo request came in from the PoloACT site.</p>` +
            `<table cellpadding="6" style="border-collapse:collapse">` +
            `<tr><td><strong>Club</strong></td><td>${escapeHtml(club)}</td></tr>` +
            `<tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>` +
            `</table>` +
            `<p style="color:#6b5e4e">Reply directly to this email to reach the enquirer.</p>`,
        },
        toRecipients: [{ emailAddress: { address: RECIPIENT! } }],
        // Let the recipient hit "Reply" and land in the enquirer's inbox.
        replyTo: [{ emailAddress: { address: email } }],
      },
      saveToSentItems: true,
    };

    const sendRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER)}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
        cache: "no-store",
      }
    );

    if (!sendRes.ok) {
      const detail = await sendRes.text();
      console.error(`Graph sendMail failed: ${sendRes.status} ${detail}`);
      return NextResponse.json(
        { ok: false, error: "We couldn't send that just now. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Demo form send error:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send that just now. Please try again." },
      { status: 500 }
    );
  }
}
