# PoloACT — the hub app

Four tiles: Tedworth Park, Druids Lodge, Vaux Park, and a PoloACT demo club.
Tapping one opens that club's app **full-screen inside this one**, so PoloACT is
a single download that covers every club.

Lives at **app.poloact.co.uk**. `poloact.co.uk` (the Next.js app at the repo
root) remains the marketing site — this is a separate Vite build deployed from
the `poloact-app/` directory.

## Why the club apps are framed, not navigated to

Navigating away would unload the hub, and iOS has no system back button inside
an app — you would be stuck in whichever club you opened until you force-quit.
Framing keeps the hub alive underneath, so the floating **‹ PoloACT** control
can always bring you home. It fades back after a few seconds so it isn't sitting
over the roster, and any tap restores it. On Android the hardware back button
does the same thing; on the web, so does browser back.

None of the club domains send `X-Frame-Options` or a `frame-ancestors` CSP, and
the TPPC app already runs framed on `tedworthparkpolo.com/booking`, so this is
the arrangement the apps are already known to work in.

## Adding a club

One entry in `src/clubs.js`. The grid, the frame and the back handling all read
from that list.

## Develop

```bash
npm install
npm run dev
```

## Deploy

A Vercel project with **root directory `poloact-app`**, domain
`app.poloact.co.uk`. Push to `main` and Vercel builds it.
