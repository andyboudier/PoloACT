"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "poloact-cookie-consent";

export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      // localStorage unavailable (private mode) — show once, don't persist
      setShow(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, `accepted:${new Date().toISOString()}`);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="cookie-notice" role="dialog" aria-label="Cookie notice" aria-live="polite">
      <p className="cookie-copy">
        PoloACT uses only essential cookies needed to make the site work — no advertising or
        third-party tracking. See our <a href="/privacy">Privacy &amp; Cookie Policy</a>.
      </p>
      <button type="button" className="btn btn-brass cookie-ok" onClick={accept}>
        Got it
      </button>
    </div>
  );
}
