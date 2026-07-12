import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://poloact.app"),
  title: "PoloACT — Polo club management software, chukka to clubhouse",
  description:
    "PoloACT is the operating system for polo clubs — chukka bookings, automatic balanced team draws, tournaments, live scoring and a members' shop. Proven at Tedworth Park Polo Club. Ready for yours.",
  openGraph: {
    title: "PoloACT — Polo club management software",
    description:
      "Bookings, automatic team draws, tournaments, live scoring and a members' shop — the operating system for polo clubs.",
    type: "website",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
