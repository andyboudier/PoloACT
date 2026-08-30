import React from 'react';
import ReactDOM from 'react-dom/client';
import './storage'; // attaches window.storage, backed by the visitor's browser
import PoloChukkas from './PoloChukkas.jsx';
import DemoChrome from './DemoChrome.jsx';

// The demo is web-only: it runs inside the PoloACT hub, or in any browser.
// There is no Capacitor wrapper, no native splash to dismiss and no service
// worker — a demo should always serve whatever was deployed last, never a
// cached copy of an older sample club.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DemoChrome />
    <PoloChukkas />
  </React.StrictMode>
);
