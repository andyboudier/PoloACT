import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PoloACT — polo club management software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card used when any PoloACT page is linked (Facebook, X,
// LinkedIn, WhatsApp, iMessage). Field-green ground, brass crest and wordmark.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1f3d2b 0%, #14291d 100%)",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="88" height="88" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="none" stroke="#C6A468" strokeWidth="1.5" />
            <g stroke="#C6A468" strokeWidth="2.4" strokeLinecap="round">
              <line x1="14" y1="34" x2="31" y2="15" />
              <line x1="34" y1="34" x2="17" y2="15" />
            </g>
            <rect x="29.4" y="12.2" width="6.4" height="4.2" rx="1.6" transform="rotate(41 32.6 14.3)" fill="#C6A468" />
            <rect x="12.2" y="12.2" width="6.4" height="4.2" rx="1.6" transform="rotate(-41 15.4 14.3)" fill="#C6A468" />
          </svg>
          <span style={{ marginLeft: 24, fontSize: 48, color: "#f3ede1", letterSpacing: -1 }}>PoloACT</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, color: "#f3ede1", lineHeight: 1.05, maxWidth: 900 }}>
            Polo club management, chukka to clubhouse.
          </div>
          <div style={{ fontSize: 30, color: "#c6a468", marginTop: 28, fontFamily: "Arial, sans-serif" }}>
            Bookings · balanced team draws · tournaments · live scoring
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#b9c3b4", fontFamily: "Arial, sans-serif" }}>
          poloact.co.uk · a product of ACT Systems
        </div>
      </div>
    ),
    { ...size }
  );
}
