import React from 'react';
import ReactDOM from 'react-dom/client';
import './storage'; // attaches window.storage, backed by the visitor's browser
import PoloChukkas from './PoloChukkas.jsx';
import DemoChrome from './DemoChrome.jsx';

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
