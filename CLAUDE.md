# TPPC Chukkas — App Brief for Claude Code

> **What this file is:** everything you (Claude Code) need to know about the *TPPC Chukkas* app so you can design and build a website **for** it. It covers what the app does, who it's for, the brand/visual identity, the tech behind it, and the links and assets a marketing/informational site should point to.
>
> **How to use it:** save this file as `CLAUDE.md` in the root of the website project and Claude Code will pick it up automatically, or paste it into the chat as context. Anything marked **[NEEDS INPUT]** is a club-specific detail the owner (Andy) should fill in — don't invent these.

---

## 1. One-paragraph summary

**TPPC Chukkas** is the digital home of **Tedworth Park Polo Club (TPPC)** — a mobile and web app that lets members book their weekly polo chukkas, generates balanced team draws automatically, runs the club's tournaments (fixtures, programmes, live scoring), and will soon include a club shop. It's available on the Apple App Store and in any web browser. The website we're building is a **shop-window / landing site for the app and the club** — it should explain what the app does, make it easy to download or open, and reflect the club's heritage, equestrian, understated-elegant brand.

---

## 2. The club — Tedworth Park Polo Club (TPPC)

- **Name:** Tedworth Park Polo Club (abbreviated **TPPC** or **TPC** on the crest).
- **Strapline (on the crest):** *"Home of Services Polo"* — the club has a strong armed-services connection.
- **Where they play:** **Perham Down** (a military training area near Tidworth, on the Wiltshire/Hampshire border, UK). The club uses several grounds — **Fisher**, **Tattoo**, and **Perham Down**.
- **Run by:** Andy Boudier (club captain / app owner) and the tournament committee: **Rosie Ross, David Eadie, Helen Gredington & Simon Ledger**.
- **Primary domain:** `tedworthparkpolo.com` (the app lives at `tedworthparkpolo.com/booking`).
- **[NEEDS INPUT]** for the website: full postal address, contact email/phone, membership/joining info and fees, a short history, and any social media handles (Instagram/Facebook).

---

## 3. The app — what it is & who it's for

**What it is:** a Progressive Web App (installable, works offline-ish, real-time) that also ships as a native iOS app. One product, three jobs:

1. **Chukka booking** — members sign up to play on given days; the app builds the team draw.
2. **Tournament management** — fixtures, match details, printable programmes, and live scoring.
3. **Club shop** — (in progress) equipment sales, Stripe checkout to come.

**Who uses it:**
- **Members / players** of all standards — book chukkas, see the draw and their teams, follow live scores.
- **Beginners** — a dedicated beginners-only instructional session (Fridays).
- **The captain & committee** — a PIN-protected "captain mode" unlocks all the management tools.
- **Spectators** — can follow live match scores.

**Naming note:** the product is called **"TPPC Chukkas"** in the interface. Its App Store listing is currently titled **"TPPC PoloACT"** (this is being tidied up — use "TPPC Chukkas" as the public name on the website unless told otherwise).

---

## 4. How people access it (platforms & links)

| Platform | How | Link / detail |
|---|---|---|
| **iPhone / iPad** | Download from the Apple App Store | App ID `6773771166`, bundle `uk.co.tedworthparkpolo.chukkas`. Search "TPPC Chukkas". |
| **Android phone** | Open in the browser (no app store version) | `tedworthparkpolo.com/booking` |
| **Windows / Mac / any browser** | Open the web app | `tedworthparkpolo.com/booking` |

- The web app is also reachable at its host URL `tppc-chukkas.vercel.app` (the custom `tedworthparkpolo.com/booking` path is the one to promote).
- **For the website:** include an **Apple App Store badge** (linking to the App Store listing) and a clear **"Open in your browser"** button linking to `tedworthparkpolo.com/booking`. Make the browser route obvious for Android/desktop users, since there's no Play Store version.
- **[NEEDS INPUT]:** the exact public App Store URL once confirmed live.

---

## 5. Features in detail

### 5.1 Chukka booking
Members book onto chukka sessions through the week. Each day has its own rules:

| Day | Who it's for | Notes |
|---|---|---|
| **Wednesday** | Open to all handicaps | Evening session (default 17:30 throw-in) |
| **Thursday** | **Ladies only** | |
| **Friday** | **Instructional chukkas — beginners only** | Handicap 0 and below; one-hour session; fixed at **2 chukkas** |
| **Saturday** | Open to all handicaps | |
| **Sunday** | Open to all handicaps | |

To book, a member adds themselves to that day's roster with: **name, handicap, mobile (optional), number of chukkas, availability window, pony-hire (yes/no)**, and an optional **"no consecutive chukkas"** preference. Sign-ups **close automatically** ahead of each session (e.g. the evening before, or Tuesday noon for Wednesday). On the beginners' day, anyone with a handicap of 1 or above is politely blocked and pointed to the open days.

### 5.2 Automatic team draw
Once players have signed up, the app **generates a balanced draw**: it assigns each player to chukkas and to one of two teams (shirt colours — **Blue / White**), and it:
- balances the **total handicap** of the two teams in every chukka (and re-evens any lopsided chukka),
- spreads each player's chukkas across the session with **rest gaps**,
- honours **availability windows** and **no-consecutive** requests,
- keeps players on a **consistent shirt colour** through the evening,
- lets the captain pick the **ground** and adjust the **throw-in time** per day.

### 5.3 Sharing & exports
The draw can be shared as a **WhatsApp team sheet**, a **plain-text table**, an **Excel file**, or a **polished PNG image** (branded, ready to post to the club WhatsApp group). There's a built-in WhatsApp group link.

### 5.4 Tournaments & fixtures
- A **season fixtures list**.
- Rich **match details** per fixture: multiple days, matches with two teams, **up to five players** per team, scores, umpires, goal judges, timekeeper, chukka counts, **up to three prizegivings** per day, ground, and a **trophy custodian** field.
- Fixtures can be **merged/consolidated**, and programme details can be **imported from JSON**.

### 5.5 Programme PDFs
Generates **professional printed tournament programmes** as PDFs:
- a **cover page** (club crest, tournament name, dates),
- a **day-by-day running order** with teams, players and match officials,
- an optional **results summary** page (winners highlighted),
- a **rules page** with the (editable) **tournament committee** and HPA rules,
- handicap head-start (HPA) calculations, set in the club's fonts and colours.

### 5.6 Live scoring
During matches, scores are entered live (team scores and per-player goals) and **synced in real time**, so anyone with the app can follow along. It's built to keep you on the live game even if the app reloads mid-match.

### 5.7 Club shop *(in progress)*
A **club shop** for polo equipment (e.g. mallets). Currently a captain-only preview; **Stripe checkout is planned** but not yet wired up.

### 5.8 Captain mode
A **PIN-protected "captain mode"** unlocks management: editing fixtures and match details, generating and editing draws, the shop, the members directory, teams, the committee list, and per-day settings. Regular members see a clean, read-only-plus-booking experience.

---

## 6. Brand & visual identity  *(most important section for the website)*

The look is **English polo-club heritage**: classic, understated, warm — think parchment, claret, and elegant serif type. Not flashy, not corporate, not "tech startup."

### 6.1 Colour palette
Use these exact values so the website matches the app.

| Role | Name | Hex |
|---|---|---|
| Primary / brand | Burgundy (claret) | `#6b1f2a` |
| Background | Cream (parchment) | `#f4ecd8` |
| Body text | Ink (near-black) | `#1c1612` |
| Secondary text | Muted brown | `#6b5e4e` |
| Borders / rules | Line (soft tan) | `#d4c8a8` |
| Errors / alerts | Danger red | `#9a2a2a` |
| Accent | Antique gold *(approx.)* | ~`#a8842c` — **[confirm exact token from the app]** |
| Panels | Cream-pale *(lighter parchment)* | a hair lighter than `#f4ecd8` — **[confirm exact token]** |

Backgrounds are cream/parchment; burgundy is the accent for headings, buttons and highlights; gold is used sparingly for fine detail (rules, eyebrows).

### 6.2 Typography (all free Google Fonts)
- **Headings / display:** **Fraunces** (a characterful serif) — used for titles, product names, big numbers.
- **Body & UI:** **Outfit** (a clean geometric sans-serif).
- **Print / PDF:** **Jost** (a Futura-like geometric sans) — for programmes; not essential on the web, but good to know.

### 6.3 Logo / crest
- The club crest is a **circular monogram**: navy-blue and red, with a **"TPC"** monogram and **crossed polo mallets** at the centre, **"TEDWORTH PARK POLO CLUB"** around the ring, and **"HOME OF SERVICES POLO"** beneath.
- **[NEEDS INPUT]:** the crest is embedded in the app as a bitmap; for the website, ask Andy for a **high-resolution PNG or (ideally) SVG** of the crest.

### 6.4 Tone of voice
Warm, plain-spoken, welcoming to newcomers, quietly proud of the club's services heritage. British spelling throughout ("chukkas", "programme", "colours"). Avoid jargon-heavy or salesy copy.

### 6.5 Polo vocabulary (so copy reads right)
- **Chukka** — a period of play (~7 minutes). Practice sessions are measured in chukkas.
- **Handicap** — a player's rating, from about −2 (beginner) up to +10 (best in the world). Club members here are roughly −2 to +2. Higher is better.
- **Throw-in** — the start of play.
- **Draw** — the allocation of players to chukkas and teams.
- **HPA** — the Hurlingham Polo Association, the sport's UK governing body.

---

## 7. Technical architecture *(context — the website is separate)*

The **app** and the **website** are separate projects. You're building the website; this is just so you understand the product and can link/integrate correctly.

- **App frontend:** React + Vite, single-page app, built as a PWA.
- **Data / backend:** Firebase **Firestore** (real-time sync; public reads, PIN-gated captain writes). No traditional server.
- **PDF generation:** jsPDF with embedded fonts, in-browser.
- **iOS app:** a **Capacitor** wrapper running in *remote-load* mode — the native app simply loads the live web app, so web updates reach everyone instantly.
- **Hosting:** **Vercel** (auto-deploys on push).
- The app is a **single large React component** styled with CSS variables (the palette above).

**Implications for the website:**
- Match the palette and fonts above and it will feel like part of the same family.
- The website can be its own simple static/SSR site — **[NEEDS INPUT]:** confirm the preferred stack (e.g. Next.js/Astro/plain HTML) and where it will be hosted (Vercel is the natural choice given the app).
- If the website ever needs live data (e.g. "next fixture"), it can read the same public Firestore, but that's optional and not required for a v1 marketing site.

---

## 8. Building the website — suggested structure

A good v1 for a club-and-app landing site:

1. **Hero** — crest, club name, "Home of Services Polo", one line on what the app does, and two clear calls to action: **App Store badge** + **"Open in your browser →"** (`tedworthparkpolo.com/booking`).
2. **What you can do** — a feature section: book chukkas, get your draw, follow live scores, tournament programmes. Use short benefit-led copy and a screenshot or two of the app.
3. **The week** — the five session types (Wed all-comers, Thu ladies, Fri beginners/instructional, Sat & Sun all-comers) as a simple, friendly timetable.
4. **New to polo?** — a welcoming section pointing beginners to Friday instructional chukkas and how to get started.
5. **The club** — a short about section (heritage, services connection, where they play), committee, and **[NEEDS INPUT]** contact/joining details.
6. **Get the app** — a dedicated download/access block reiterating both routes (App Store + browser), with device guidance (iPhone → App Store; Android/desktop → browser).
7. **Footer** — contact, social links, primary domain.

**Design direction:** cream/parchment backgrounds, burgundy accents, Fraunces headings, Outfit body, generous whitespace, real photography of polo/ponies where possible. Understated and classic — no gradients-heavy "SaaS" styling.

---

## 9. What's still needed from the owner (checklist)

Collect these from Andy before finishing the site:

- [ ] High-res **crest** (SVG or large PNG) and any club **photography**.
- [ ] Confirmed **public App Store URL**.
- [ ] **Contact details** (email, phone, postal address).
- [ ] **Membership / joining** info and any fees.
- [ ] Short **club history / about** copy and the services connection.
- [ ] **Social media** links.
- [ ] Preferred **website stack + hosting** and the exact **gold / cream-pale** hex tokens from the app.
- [ ] Whether the app should be publicly named "TPPC Chukkas" (recommended) vs the App Store's current "TPPC PoloACT".

---

## 10. Quick reference

- **Club:** Tedworth Park Polo Club (TPPC) — "Home of Services Polo", Perham Down, UK.
- **App:** TPPC Chukkas — booking, draws, tournaments, live scoring, shop (soon).
- **Get it:** App Store (iPhone/iPad) · `tedworthparkpolo.com/booking` (Android/desktop/any browser).
- **Grounds:** Fisher · Tattoo · Perham Down.
- **Committee:** Rosie Ross · David Eadie · Helen Gredington · Simon Ledger.
- **Palette:** burgundy `#6b1f2a` · cream `#f4ecd8` · ink `#1c1612` · muted `#6b5e4e` · line `#d4c8a8` · gold ~`#a8842c`.
- **Fonts:** Fraunces (headings) · Outfit (body) · Jost (print).
- **Voice:** warm, classic, British spelling, welcoming to beginners.
