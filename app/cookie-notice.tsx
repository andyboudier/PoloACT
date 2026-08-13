"use client";

import { useEffect, useState } from "react";
import { CONSENT_KEY, CONSENT_EVENT } from "./analytics";

export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setShow(true);
    } catch {
      // localStorage unavailable (private mode) — show once, don't persist
      setShow(true);
    }
  }, []);

  function choose(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="cookie-notice" role="dialog" aria-label="Cookie choices" aria-live="polite">
      <p className="cookie-copy">
        We use essential cookies to make the site work. With your permission we&rsquo;d also use
        Google Analytics to understand how the site is used &mdash; never for advertising. See our{" "}
        <a href="/privacy">Privacy &amp; Cookie Policy</a>.
      </p>
      <div className="cookie-actions">
        <button type="button" className="btn btn-ghost cookie-btn" onClick={() => choose("rejected")}>
          Essential only
        </button>
        <button type="button" className="btn btn-brass cookie-btn" onClick={() => choose("accepted")}>
          Accept all
        </button>
      </div>
    </div>
  );
}
