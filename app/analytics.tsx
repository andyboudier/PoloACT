"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export const GA_ID = "G-7TLMCW17S9";
export const CLARITY_ID = "y9i7z4uls1";
export const CONSENT_KEY = "poloact-cookie-consent";
/** Fired when the visitor accepts or rejects, so the layout can react without a reload. */
export const CONSENT_EVENT = "poloact-consent-change";

export function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

type Gtag = (command: string, eventName: string, params?: Record<string, unknown>) => void;

/**
 * Sends a GA4 event. No-ops when the visitor hasn't consented (gtag never loaded),
 * so tracking calls are safe to make unconditionally.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, params);
}

/**
 * Loads Google Analytics and Microsoft Clarity only after the visitor has
 * explicitly accepted analytics. Nothing loads or is sent before then.
 */
export default function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasAnalyticsConsent());
    const onChange = () => setConsented(hasAnalyticsConsent());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
      <Script id="clarity-init" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `}
      </Script>
    </>
  );
}
