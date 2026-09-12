import React from 'react';
import ReactDOM from 'react-dom/client';
import { firebaseConfigured } from './demoConfig';

// Two ways to run the demo, chosen once at boot:
//
//   Firebase configured  → the demo's own Firebase project: real sign-in
//                          (email, sign-in link, Google, Apple once set up)
//                          and shared club data, reset to the sample club
//                          every night. What a real club gets.
//   not configured       → everything in the visitor's own browser: a
//                          browser-only stand-in for sign-in and a private
//                          copy of the sample club. Still the whole app.
//
// Each side is loaded only when chosen, so the browser-only demo never
// downloads the Firebase SDK. The app itself is the same either way: it reads
// window.storage and window.auth and does not know which it got.
//
// No top-level await: older iOS Safari does not have it, and a demo that fails
// to boot on an older iPhone is not a demo. boot() below does the sequencing.
import { installAuth } from './auth-provider.js';

// The demo bar takes a strip of the window, so the app lives in .demo-app and
// scrolls there rather than scrolling the window (see DemoChrome for why).
// The app scrolls to the nearest fixture when the Fixtures tab opens, and does
// it with window.scrollTo, which is now a no-op. Point those calls at the box.
//
// The app computes its target as `rect.top + pageYOffset - navHeight`, and
// pageYOffset is 0 here, so the value it passes is an offset from the top of
// the window. Converting that to a scroll position inside the box means adding
// where the box is scrolled to now and subtracting where the box starts.
const scrollWindowCallsToTheApp = () => {
  const nativeScrollTo = window.scrollTo.bind(window);
  window.scrollTo = (...args) => {
    const box = document.querySelector('.demo-scroll');
    const opts = typeof args[0] === 'object' && args[0] !== null
      ? args[0]
      : { left: args[0], top: args[1] };
    if (!box || typeof opts.top !== 'number') return nativeScrollTo(...args);
    box.scrollTo({
      behavior: opts.behavior,
      top: box.scrollTop + opts.top - box.getBoundingClientRect().top,
    });
  };
};
scrollWindowCallsToTheApp();

// The demo is web-only: it runs inside the PoloACT hub, or in any browser.
// There is no Capacitor wrapper, no native splash to dismiss and no service
// worker — a demo should always serve whatever was deployed last, never a
// cached copy of an older sample club.
async function boot() {
  await import(firebaseConfigured ? './storage-firestore.js' : './storage-local.js');
  await installAuth();
  const [{ default: PoloChukkas }, { default: DemoChrome }] = await Promise.all([
    import('./PoloChukkas.jsx'),
    import('./DemoChrome.jsx'),
  ]);
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <DemoChrome />
      <div className="demo-app">
        <div className="demo-scroll">
          <PoloChukkas />
        </div>
      </div>
    </React.StrictMode>
  );
}
boot();
