import type { ReactNode } from "react";

/**
 * Shared shell for content sub-pages (features, guides, privacy).
 * Reuses the `.legal-*` styles, which are the generic sub-page chrome.
 */
export default function PageShell({
  eyebrow,
  title,
  standfirst,
  children,
}: {
  eyebrow: string;
  title: string;
  standfirst?: ReactNode;
  children: ReactNode;
}) {
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
          <a href="/#demo" className="legal-back">Book a demo &rarr;</a>
        </div>
      </header>

      <article className="legal">
        <div className="wrap">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {standfirst ? <p className="lead">{standfirst}</p> : null}
          {children}
        </div>
      </article>

      <section className="subcta">
        <div className="wrap">
          <h2>Bring PoloACT to your club.</h2>
          <p>See the platform on your own fixtures in a 30-minute walkthrough.</p>
          <a href="/#demo" className="btn btn-brass">Book a demo</a>
        </div>
      </section>

      <div className="legal-foot">
        <div className="wrap">
          <small>© 2026 ACT Systems Limited. PoloACT is a product of ACT Systems.</small>
          <a href="/">Back to PoloACT &rarr;</a>
        </div>
      </div>
    </main>
  );
}
