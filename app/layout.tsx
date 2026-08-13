import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import CookieNotice from "./cookie-notice";

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
  metadataBase: new URL("https://poloact.co.uk"),
  title: "PoloACT — Polo club management software, chukka to clubhouse",
  description:
    "Polo club management software: chukka bookings, automatic team draws, tournaments, live scoring and a members' shop. Built with Tedworth Park Polo Club.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "PoloACT — Polo club management software",
    description:
      "Bookings, automatic team draws, tournaments, live scoring and a members' shop — the operating system for polo clubs.",
    type: "website",
    siteName: "PoloACT",
    url: "https://poloact.co.uk",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://poloact.co.uk/#org",
      name: "PoloACT",
      url: "https://poloact.co.uk",
      description:
        "Polo club management software — bookings, automatic team draws, tournaments, live scoring and a members' shop.",
      parentOrganization: { "@type": "Organization", name: "ACT Systems Limited", url: "https://actsystems.co.uk" },
    },
    {
      "@type": "SoftwareApplication",
      name: "PoloACT",
      applicationCategory: "BusinessApplication",
      operatingSystem: "iOS, Android, Web",
      url: "https://poloact.co.uk",
      description:
        "The operating system for polo clubs: chukka bookings, automatic balanced team draws, tournaments, live scoring and a members' shop.",
      publisher: { "@id": "https://poloact.co.uk/#org" },
      offers: { "@type": "Offer", category: "Subscription" },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${outfit.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
