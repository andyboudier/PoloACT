import crypto from "crypto";

/**
 * Mints a short-lived Google API access token from a service account, using the
 * JWT-bearer flow signed with Node's built-in crypto (no SDK needed).
 *
 * Env vars (set in Vercel → Settings → Environment Variables):
 *   GOOGLE_CLIENT_EMAIL  - the service account email (…@…iam.gserviceaccount.com)
 *   GOOGLE_PRIVATE_KEY   - the service account private key (PEM). Newlines may be
 *                          stored literally as "\n" and are normalised here.
 *
 * The same service account is granted read access to both the GA4 property and
 * the Search Console site, so one credential powers both metric routes.
 */

const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

export function googleConfigured(): boolean {
  return Boolean(CLIENT_EMAIL && PRIVATE_KEY);
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// Cache tokens in-memory per scope for their lifetime (minus a safety margin).
const tokenCache = new Map<string, { token: string; expires: number }>();

export async function getGoogleAccessToken(scope: string): Promise<string> {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) {
    throw new Error("Google service account is not configured.");
  }

  const cached = tokenCache.get(scope);
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.expires - 60 > now) {
    return cached.token;
  }

  const key = PRIVATE_KEY.replace(/\\n/g, "\n");
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: CLIENT_EMAIL,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const signingInput = `${header}.${claim}`;
  const signature = base64url(
    crypto.createSign("RSA-SHA256").update(signingInput).sign(key)
  );
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Google token request failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("No access_token in Google token response.");

  tokenCache.set(scope, {
    token: data.access_token,
    expires: now + (data.expires_in || 3600),
  });
  return data.access_token;
}

export const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
export const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
