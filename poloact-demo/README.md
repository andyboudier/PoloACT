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
admin side can be shown; any address in `VITE_ADMIN_EMAILS` is an admin here too.

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
| Admin | Everything the PIN used to cover: chukka lists and the draw, the player database, tournaments and the team board, shop, payments, and the admins list itself (an **Admin** switch on each player record, and Players → Admins for anyone not in the database). |

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

`./setup-firebase.sh` does the parts that have an API: it creates the project
and the Firestore database, deploys these rules, writes the `config/admins`
document, registers a web app and writes its config to `.env.local` (and, with
`--vercel`, sets the same values on the Vercel project). Run
`./setup-firebase.sh --dry-run` first to see what it would do. It stops and
waits at the two points Google offers no API for — turning the sign-in methods
on, and the authorised domains.

Or do it all by hand:

1. Firebase console → **Add project** (e.g. `poloact-demo`). No Analytics needed.
2. **Authentication → Sign-in method**: enable *Email/Password* (tick *Email
   link (passwordless sign-in)* too) and *Google*. Apple later — it needs a
   Services ID and key from the Apple Developer account; then set
   `VITE_AUTH_APPLE=1`.
3. **Authentication → Settings → Authorized domains**: add `demo.poloact.co.uk`
   (and `localhost` is there already).
4. **Firestore Database → Create database** (production mode), then paste
   `firestore.rules` into **Rules** and publish.
5. **Firestore → Data → Start collection** `config`, document id `admins`,
   with one field `emails`, type *array*, holding your own address in lower
   case.

   Do this before using the app, not after. The rules decide who may write by
   reading this document, and only an admin may create it — so on a brand-new
   project nobody can write anything, the seed included, until it exists. It
   is the one step that cannot be done from inside the app.
6. **Project settings → Your apps → Web app**: register one and copy the six
   config values into Vercel as `VITE_FIREBASE_*`, with `VITE_ADMIN_EMAILS`
   set to the same address. Redeploy — Vercel only applies environment
   variables to deployments built after they are set.
7. Sign in with that address, then press **Reset demo** in the top bar once to
   seed the sample club. If the bar says Firestore refused it, step 5 is
   missing or names a different address.

From then on the demo is a club app in every respect: real sign-in, shared
data, the same rules, the same live sync between devices. Admins are managed
in the app (Players → any record → **Admin**, or Players → Admins), and
`VITE_ADMIN_EMAILS` stays as the lock you cannot be shut out of.

### Google and Apple sign-in

The app already has both: `authFirebase.js` opens a pop-up and falls back to a
full-page redirect where pop-ups are not available (an installed PWA on iOS,
in-app browsers). What remains is on the provider side.

**Google** — Firebase console → Authentication → Sign-in method → Google →
Enable; pick a project support email; save. Nothing else is needed for the
web app. For a native app later, add the iOS bundle ID under Project
settings → Your apps, and the OAuth client Firebase creates.

**Apple** — needs an Apple Developer account:

1. Certificates, Identifiers & Profiles → Identifiers → **+** → *Services
   IDs*. Identifier e.g. `co.uk.poloact.demo.web`; enable *Sign In with
   Apple*; configure it with the primary App ID and, as the return URL,
   `https://<project-id>.firebaseapp.com/__/auth/handler`. Domain: the
   `firebaseapp.com` host (and `demo.poloact.co.uk` if you use it as the auth
   domain — see below).
2. Keys → **+** → tick *Sign In with Apple* → download the `.p8` once.
3. Firebase console → Authentication → Sign-in method → Apple → Enable, and
   paste the Services ID, Apple Team ID, Key ID and the key's contents.
4. Set `VITE_AUTH_APPLE=1` on the Vercel project and redeploy; the Apple
   button appears.

**Redirect sign-in on iOS.** Safari blocks the cross-site storage the redirect
flow uses unless the auth pages are on the app's own domain. So set
`VITE_FIREBASE_AUTH_DOMAIN=demo.poloact.co.uk` and add to `vercel.json`:

```json
"rewrites": [
  { "source": "/__/auth/:path*", "destination": "https://<project-id>.firebaseapp.com/__/auth/:path*" }
]
```

then add `demo.poloact.co.uk` to the authorised domains in Firebase, and use
it as the return URL for Apple and in the Google OAuth client's authorised
redirect URIs (`https://demo.poloact.co.uk/__/auth/handler`).

### Email from poloact.co.uk (Resend)

Two kinds of email leave the platform. The forms (demo requests, tournament
entries) go through the hub's `lib/mail.ts`, which sends with
[Resend](https://resend.com) when `RESEND_API_KEY` is set and falls back to
the older Microsoft Graph sender otherwise. Firebase's own emails (sign-in
links, password resets) can go the same way through Resend's SMTP.

1. Resend → Domains → **Add domain** `poloact.co.uk`. Add the DNS records it
   gives you (DKIM `resend._domainkey`, and the `send` subdomain's MX and SPF
   TXT for the return path) where the domain's DNS lives; wait for
   *Verified*.
2. Resend → API Keys → create one with *Sending access*. On the hub's Vercel
   project set `RESEND_API_KEY`, `MAIL_FROM=PoloACT <hello@poloact.co.uk>`,
   `DEMO_RECIPIENT`, and `CLUB_RECIPIENTS` (below). Redeploy — Vercel only
   applies environment variables to deployments built after they are set.

   All four apps send through this one route; the only difference is the
   office each reaches. Each app names itself with a `CLUB_ID` in its source
   and the hub maps that to an address, so no address ever travels in the
   request:

   ```
   CLUB_RECIPIENTS=tppc:info@tedworthparkpolo.com,druids:…,vaux:…,demo:hello@poloact.co.uk
   ```

   `ENTRY_RECIPIENT` catches anything whose id is not in the map.
3. Firebase console → Authentication → Templates → **SMTP settings**: enable,
   host `smtp.resend.com`, port `465` (SSL), username `resend`, password the
   API key, sender `PoloACT <noreply@poloact.co.uk>`. Then, still under
   Templates, set the sender name and reply-to on each template.

Firebase's sign-in link and password-reset emails then arrive from
`noreply@poloact.co.uk` rather than the project's `firebaseapp.com` address.

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
