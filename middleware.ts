import { NextRequest, NextResponse } from "next/server";

/**
 * Protects the internal growth dashboard (and its metric APIs) with HTTP Basic Auth.
 *
 * Set these in Vercel → Settings → Environment Variables:
 *   GROWTH_DASHBOARD_USER      - username (defaults to "poloact")
 *   GROWTH_DASHBOARD_PASSWORD  - password; when unset, auth is skipped (the page
 *                                only shows setup instructions until the metric
 *                                APIs are configured, so nothing sensitive leaks).
 */

const USER = process.env.GROWTH_DASHBOARD_USER || "poloact";
const PASSWORD = process.env.GROWTH_DASHBOARD_PASSWORD;

export const config = {
  matcher: ["/growth/:path*", "/growth", "/api/metrics/:path*"],
};

export function middleware(req: NextRequest) {
  if (!PASSWORD) return NextResponse.next();

  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const idx = decoded.indexOf(":");
      const user = decoded.slice(0, idx);
      const pass = decoded.slice(idx + 1);
      if (user === USER && pass === PASSWORD) {
        return NextResponse.next();
      }
    } catch {
      // fall through to challenge
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="PoloACT Growth", charset="UTF-8"',
    },
  });
}
