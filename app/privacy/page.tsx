import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Cookie Policy — PoloACT",
  description:
    "How ACT Systems Limited handles personal data collected through the PoloACT website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <header className="legal-nav">
        <div className="wrap legal-nav-in">
          <a className="legal-brand" href="/">
            <svg className="crest" viewBox="0 0 48 48" width="30" height="30" aria-hidden="true">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#C6A468" strokeWidth="1.5" />
              <g stroke="#C6A468" strokeWidth="2.4" strokeLinecap="round">
                <line x1="14" y1="34" x2="31" y2="15" />
                <line x1="34" y1="34" x2="17" y2="15" />
              </g>
              <rect x="29.4" y="12.2" width="6.4" height="4.2" rx="1.6" transform="rotate(41 32.6 14.3)" fill="#C6A468" />
              <rect x="12.2" y="12.2" width="6.4" height="4.2" rx="1.6" transform="rotate(-41 15.4 14.3)" fill="#C6A468" />
            </svg>
            <b>PoloACT</b>
          </a>
          <a href="/" className="legal-back">&larr; Back to site</a>
        </div>
      </header>

      <article className="legal">
        <div className="wrap">
          <span className="eyebrow">Legal</span>
          <h1>Privacy &amp; Cookie Policy</h1>
          <p className="legal-meta">Last updated 13 July 2026</p>

          <p className="lead">
            This policy explains how personal data is handled when you use the PoloACT website. PoloACT
            is a product of ACT Systems Limited, and mirrors the{" "}
            <a href="https://actsystems.co.uk/privacy-policy/" target="_blank" rel="noopener noreferrer">
              ACT Systems privacy policy
            </a>
            .
          </p>

          <h2>1. Who we are</h2>
          <p>
            ACT Systems Limited (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data controller responsible
            for personal data collected through this site. We operate from 4 Diddenham Court, Lambwood
            Hill, Grazeley, Reading, Berkshire, RG7 1JQ. You can reach us at{" "}
            <a href="mailto:privacy@actsystems.co.uk">privacy@actsystems.co.uk</a> or 01189 870 078.
          </p>

          <h2>2. What data we collect</h2>
          <ul>
            <li>
              <strong>Demo enquiries.</strong> When you use the &ldquo;Book a demo&rdquo; form we collect
              the club name and email address you provide.
            </li>
            <li>
              <strong>Technical data.</strong> Standard server and hosting logs such as IP address,
              browser type and pages requested.
            </li>
            <li>
              <strong>Cookie data.</strong> Essential cookies needed for the site to function (see
              section 9).
            </li>
          </ul>

          <h2>3. How we use your data</h2>
          <p>We use personal data to:</p>
          <ul>
            <li>respond to your enquiry and arrange a demo of PoloACT;</li>
            <li>provide information about our products and services;</li>
            <li>operate, secure and improve the website;</li>
            <li>meet our legal and accounting obligations.</li>
          </ul>

          <h2>4. Legal basis for processing</h2>
          <p>
            We rely on our legitimate interests in responding to enquiries and running our business, on
            your consent where required (for example non-essential communications), on contractual
            necessity where we provide a service, and on compliance with legal obligations.
          </p>

          <h2>5. Sharing your data</h2>
          <p>
            We do not sell your data. We share it only with service providers who help us run the site
            and respond to you — including our website host (Vercel) and our email provider (Microsoft
            365) — as well as professional advisers and regulatory authorities where legally required.
          </p>

          <h2>6. Data retention</h2>
          <p>
            We keep personal data only as long as needed for the purpose it was collected, and to meet
            legal, accounting and business requirements. Retention periods vary by data category.
          </p>

          <h2>7. Data security</h2>
          <p>
            We use secure systems, access controls, encryption in transit, monitoring and regular
            reviews to protect personal data.
          </p>

          <h2>8. Your rights</h2>
          <p>
            Under UK data protection law you have the right to access, correct or delete your data, to
            restrict or object to processing, to data portability, and to withdraw consent. To exercise
            any of these, contact <a href="mailto:privacy@actsystems.co.uk">privacy@actsystems.co.uk</a>.
            You also have the right to complain to the Information Commissioner&rsquo;s Office at{" "}
            <a href="https://www.ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.
          </p>

          <h2>9. Cookies</h2>
          <p>
            This site uses only <strong>essential cookies</strong> required for it to function and stay
            secure. We do not use advertising or third-party analytics cookies. Your browser can block or
            delete cookies at any time, though the site may not work as intended without the essential
            ones. A record of your acknowledgement of our cookie notice is stored locally in your browser.
          </p>

          <h2>10. International transfers</h2>
          <p>
            Some of our service providers process data outside the UK. Where they do, we rely on
            appropriate safeguards (such as UK-approved transfer mechanisms) to protect your data.
          </p>

          <h2>11. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The latest version will always appear on this
            page.
          </p>

          <h2>12. Contact</h2>
          <p>
            ACT Systems Limited · 4 Diddenham Court, Lambwood Hill, Grazeley, Reading, RG7 1JQ ·{" "}
            <a href="mailto:privacy@actsystems.co.uk">privacy@actsystems.co.uk</a> · 01189 870 078
          </p>
        </div>
      </article>

      <div className="legal-foot">
        <div className="wrap">
          <small>© 2026 ACT Systems Limited. PoloACT is a product of ACT Systems.</small>
          <a href="/">Back to PoloACT &rarr;</a>
        </div>
      </div>
    </main>
  );
}
