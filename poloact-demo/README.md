# PoloACT demo club

The club app with a sample club in it, for **demo.poloact.co.uk** — the fourth
tile in the PoloACT hub.

It is the TPPC app, copied and rebranded, because that is the most complete of
the three: five session days, the Thursday/Friday capacity caps, the waiting
list, editable cut-offs, fixtures with published draws and live scoring. A demo
should show the most, not the least.

## Two ways to run

`src/main.jsx` picks one at boot, from `src/demoConfig.js`:

**Browser-only** (no `VITE_FIREBASE_*` set). `src/storage-local.js` implements
the `window.storage` API against the visitor's own browser, and
`src/authLocal.js` stands in for sign-in: any email and password opens an
account, "email me a link" signs you in on the spot, and the Google and Apple
buttons sign you in as a sample account. Every visitor gets their own clean
copy of the sample club; nothing is shared and nothing to police. **Reset demo**
in the top bar puts it back. `admin@poloact.demo` is an admin, so the whole
admin side can be shown.

**Firebase** (the six `VITE_FIREBASE_*` values set — see `.env.example`). The
demo runs on its own Firebase project: `src/storage-firestore.js` (TPPC's own
storage layer, copied by the resync) for shared club data and
`src/authFirebase.js` for real sign-in — email and password, a sign-in link,
Google, and Apple once configured. Members' bookings are visible to admins,
live sync works across devices, and the club is put back to the sample every
night. This is what a real club gets.

`src/demoSeed.js` is the sample club. Every date in it is computed relative to
whenever it is built, so the roster is always for this week and the fixtures
always straddle today — it never looks abandoned. Bump `SEED_VERSION` in
`storage-local.js` after changing the seed so returning browser-only visitors
get the new one; the Firebase mode simply reseeds nightly.

Sign-ups are seeded open on every day using the app's own captain override
(`booking-open-<day>`), so a visitor who arrives after a deadline can still try
the thing the app is for.

## Sign-in and roles

Sign-in is a small contract the app reads from `window.auth` (`src/auth.js`,
shared with the club apps and switched off there). With it on:

| Who | Can |
|---|---|
| Anyone, not signed in | See fixtures, published draws and live scores. |
| Member (signed in) | Book chukkas as themselves and, if their player record names a team, book their teammates in too — nobody else. Take off a list what they put on it. |
| Captain PIN (`0000`) | Enter live scores. Nothing else. |
| Admin | Everything the PIN used to cover: chukka lists and the draw, the player database, tournaments and the team board, shop, payments, and the admins list itself (Players → Admins). |

A member is matched to the **player database** (Players tab) on the email
they sign in with: an admin puts the email on the record, and from then on that
person books as that record — its name and handicap, no profile questions on
first sign-in. Records carry a free-text *Team*; players who share one may book
each other in, and the list shows who did the booking. With no record, a member
books as their profile says, and only themselves.

The sample club seeds thirteen players at `<first name>@poloact.demo` in three
teams — The Kestrels (Harriet, Tom, Priya, Nick), Longacre (Rosie, Clare, Sam,
James) and Mill House (Anna, Ed, Marcus) — plus Louisa and Hugo with no team.
In browser-only mode any password works, so `harriet@poloact.demo` is the
quickest way to try booking a teammate.

Admins are the emails in the Firestore document `config/admins`, plus whatever
`VITE_ADMIN_EMAILS` names — those can never be removed in-app, so nobody can
lock everyone out. `firestore.rules` enforces the same split in the database:
public read; signed-in users may write the chukka side (`roster-*`,
`waitlist-*`, `schedule*`, `members`, `transactions`); admins may write
everything.

### Setting up the Firebase project

1. Firebase console → **Add project** (e.g. `poloact-demo`). No Analytics needed.
2. **Authentication → Sign-in method**: enable *Email/Password* (tick *Email
   link (passwordless sign-in)* too) and *Google*. Apple later — it needs a
   Services ID and key from the Apple Developer account; then set
   `VITE_AUTH_APPLE=1`.
3. **Authentication → Settings → Authorized domains**: add `demo.poloact.co.uk`
   (and `localhost` is there already).
4. **Firestore Database → Create database** (production mode), then paste
   `firestore.rules` into **Rules** and publish.
5. **Project settings → Your apps → Web app**: register one and copy the six
   config values into Vercel as `VITE_FIREBASE_*`, with `VITE_ADMIN_EMAILS`
   set to your own address. Redeploy.
6. Sign in with that address, then press **Reset demo** in the top bar once to
   seed the sample club.

### Nightly reset

`vercel.json` at the repo root runs `/api/demo-reset` (a route in the hub,
`app/api/demo-reset/route.ts`) at 03:00 UTC. It writes the sample club over
the shared data with a service account, leaving `config/admins` alone. It
needs two environment variables on the hub's Vercel project:
`FIREBASE_SERVICE_ACCOUNT_JSON` (Project settings → Service accounts →
Generate new private key, pasted whole) and `CRON_SECRET` (any long random
string; Vercel sends it as the bearer token). Until those are set, an admin's
**Reset demo** button does the same job by hand.

## Keeping it current

The demo has no behaviour of its own, so keeping it in step with TPPC is a copy
plus a rebrand rather than a merge:

```bash
node resync-from-tppc.mjs /path/to/tppc/polo-chukkas-deploy
```

It copies the shared source (including `auth.js` and `AuthSheet.jsx`, and
TPPC's `storage.js` as `storage-firestore.js`), re-applies the palette and the
names, and leaves the files that *are* the demo — `storage-local.js`,
`demoSeed.js`, `demoReset.js`, `demoConfig.js`, `firebase.js`, the auth
providers, `DemoChrome.jsx`, `main.jsx`, `index.html`, `vite.config.js` —
alone. If TPPC has moved an anchor the script stops and names it rather than
half-rebranding.

## Rebranding

The palette is the club apps' CSS variables with PoloACT's values — field green
and brass. The variable *names* are unchanged, so the whole app is rebranded by
that one block rather than by touching thousands of lines.

## Develop

```bash
npm install
npm run dev
```

## Deploy

A Vercel project with **root directory `poloact-demo`**, domain
`demo.poloact.co.uk`.
