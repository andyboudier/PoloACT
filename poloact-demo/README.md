# PoloACT demo club

The club app with a sample club in it, for **demo.poloact.co.uk** — the fourth
tile in the PoloACT hub.

It is the TPPC app, copied and rebranded, because that is the most complete of
the three: five session days, the Thursday/Friday capacity caps, the waiting
list, editable cut-offs, fixtures with published draws and live scoring. A demo
should show the most, not the least.

## No backend

`src/storage.js` implements the same `window.storage` API the club apps use, but
against the visitor's own browser instead of Firestore. There is no Firebase
project, no cost and nothing to police: every visitor gets their own clean copy
of the sample club, can change anything, and cannot affect anyone else. **Reset
demo** in the top bar puts it back.

The one thing the demo cannot show is live cross-device sync, since there is no
shared store.

`src/demoSeed.js` is the sample club. Every date in it is computed relative to
whenever the demo is opened, so the roster is always for this week and the
fixtures always straddle today — it never looks abandoned. Bump `SEED_VERSION`
in `storage.js` after changing the seed so returning visitors get the new one.

Sign-ups are seeded open on every day using the app's own captain override
(`booking-open-<day>`), so a visitor who arrives after a deadline can still try
the thing the app is for.

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
