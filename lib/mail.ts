// The one place the hub sends email from.
//
// Resend is the sender for poloact.co.uk: set RESEND_API_KEY and the domain
// is verified in the Resend dashboard (DKIM and return-path records on
// poloact.co.uk), and everything goes out as MAIL_FROM. The Microsoft Graph
// sender the site started with stays as the fallback, so nothing breaks while
// the switch is made: it is used only when Resend is not configured.
//
// Environment:
//   RESEND_API_KEY     from resend.com → API Keys (sending access is enough)
//   MAIL_FROM          e.g. "PoloACT <hello@poloact.co.uk>" — must be on a
//                      domain verified in Resend; defaults to that address
//   AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, DEMO_SENDER_UPN
//                      the Graph fallback (see /api/demo for what they are)

export type Mail = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

const RESEND_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || "PoloACT <hello@poloact.co.uk>";

const TENANT = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const SENDER = process.env.DEMO_SENDER_UPN;

export const resendConfigured = () => Boolean(RESEND_KEY);
export const graphConfigured = () => Boolean(TENANT && CLIENT_ID && CLIENT_SECRET && SENDER);
export const mailConfigured = () => resendConfigured() || graphConfigured();

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function sendWithResend(m: Mail) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [m.to],
      subject: m.subject,
      html: m.html,
      ...(m.replyTo ? { reply_to: m.replyTo } : {}),
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend send failed: ${res.status} ${await res.text()}`);
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

async function sendWithGraph(m: Mail) {
  const token = await getGraphToken();
  const message = {
    message: {
      subject: m.subject,
      body: { contentType: "HTML", content: m.html },
      toRecipients: [{ emailAddress: { address: m.to } }],
      ...(m.replyTo ? { replyTo: [{ emailAddress: { address: m.replyTo } }] } : {}),
    },
    saveToSentItems: true,
  };
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER!)}/sendMail`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(message),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Graph sendMail failed: ${res.status} ${await res.text()}`);
}

// Throws when nothing is configured or the provider refuses the message.
export async function sendMail(m: Mail): Promise<void> {
  if (resendConfigured()) return sendWithResend(m);
  if (graphConfigured()) return sendWithGraph(m);
  throw new Error("No email sender is configured (set RESEND_API_KEY, or the AZURE_* variables).");
}
