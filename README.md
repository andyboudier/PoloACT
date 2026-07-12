# PoloACT

Marketing site for **PoloACT** — polo club management software (bookings, automatic
team draws, tournaments, live scoring and a members' shop). The site pitches the
platform to polo clubs, uses **Tedworth Park Polo Club** ("TPPC Chukkas") as the
flagship case study, and runs a partner-shop discount network.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript
- Hand-authored CSS (`app/globals.css`) with light/dark theming via CSS variables
- Brand fonts via `next/font/google` — **Fraunces** (display) + **Outfit** (body)

## Develop

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build

```bash
npm run build
npm start
```

## Deploy

Deploys on [Vercel](https://vercel.com) with zero config — Next.js is auto-detected.
Push to the connected branch and Vercel builds and deploys automatically.

## Notes

- Brand: deep polo green + brass. The **Tedworth Park** case-study section deliberately
  uses the club's own burgundy/parchment identity to demonstrate PoloACT's per-club
  white-labelling.
- Placeholder content is flagged in the footer. Items still needed from the owner
  (real crest SVG, confirmed partner discounts, pricing, contact details) are listed
  in `CLAUDE.md`.
- The demo form is front-end only (no backend yet); wire it to an email/CRM endpoint
  before launch.
