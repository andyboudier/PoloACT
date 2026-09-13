import { NextResponse } from "next/server";
import { escapeHtml, mailConfigured, sendMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A demo request from the site's form, emailed to the office.
//
// Sent through lib/mail (Resend for poloact.co.uk, or the Microsoft Graph
// fallback). Environment:
//   DEMO_RECIPIENT   where requests are delivered (falls back to the Graph
//                    sender mailbox, DEMO_SENDER_UPN)
const RECIPIENT = process.env.DEMO_RECIPIENT || process.env.DEMO_SENDER_UPN;

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

  if (!mailConfigured() || !RECIPIENT) {
    console.error("Demo form: no email sender or recipient is configured.");
    return NextResponse.json(
      { ok: false, error: "Email is not configured yet. Please try again later." },
      { status: 503 }
    );
  }

  try {
    await sendMail({
      to: RECIPIENT,
      subject: `New PoloACT demo request — ${club}`,
      html:
        `<p>A new demo request came in from the PoloACT site.</p>` +
        `<table cellpadding="6" style="border-collapse:collapse">` +
        `<tr><td><strong>Club</strong></td><td>${escapeHtml(club)}</td></tr>` +
        `<tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>` +
        `</table>` +
        `<p style="color:#6b5e4e">Reply directly to this email to reach the enquirer.</p>`,
      // Let the recipient hit "Reply" and land in the enquirer's inbox.
      replyTo: email,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Demo form send error:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send that just now. Please try again." },
      { status: 502 }
    );
  }
}
