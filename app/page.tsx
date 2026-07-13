"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [sending, setSending] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const year = 2026;

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3600);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const club = (form.elements.namedItem("club") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const company = (form.elements.namedItem("company") as HTMLInputElement).value;
    if (!club || !email || !email.includes("@")) {
      showToast("Add your club and a valid email to continue.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ club, email, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        form.reset();
        showToast("Thanks — your request is on its way. We’ll be in touch shortly.");
      } else {
        showToast(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      showToast("Network error — please try again in a moment.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top" aria-label="PoloACT home">
            <svg className="crest" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#C6A468" strokeWidth="1.5" />
              <circle cx="24" cy="24" r="18.5" fill="none" stroke="#C6A468" strokeWidth=".7" opacity=".6" />
              <g stroke="#C6A468" strokeWidth="2.4" strokeLinecap="round">
                <line x1="14" y1="34" x2="31" y2="15" />
                <line x1="34" y1="34" x2="17" y2="15" />
              </g>
              <rect x="29.4" y="12.2" width="6.4" height="4.2" rx="1.6" transform="rotate(41 32.6 14.3)" fill="#C6A468" />
              <rect x="12.2" y="12.2" width="6.4" height="4.2" rx="1.6" transform="rotate(-41 15.4 14.3)" fill="#C6A468" />
              <circle cx="24" cy="33" r="2.4" fill="#F3EDE1" />
            </svg>
            <span>
              <b>PoloACT</b>
              <span className="by">Polo Club Software</span>
            </span>
          </a>
          <nav className={`navlinks${menuOpen ? " open" : ""}`} id="nav">
            <a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#case" onClick={() => setMenuOpen(false)}>Case study</a>
            <a href="#shops" onClick={() => setMenuOpen(false)}>Shop network</a>
            <a href="#members" onClick={() => setMenuOpen(false)}>Members</a>
          </nav>
          <div className="nav-cta">
            <a href="#case" className="btn btn-ghost hide-sm">See it live</a>
            <a href="#demo" className="btn btn-brass">Book a demo</a>
            <button
              className="menu-btn"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="hero on-field" id="top">
        <div className="wrap hero-in">
          <div>
            <span className="eyebrow">Polo club management software</span>
            <h1>Run your whole club from one app.</h1>
            <p className="lead">
              PoloACT is the operating system for polo clubs — chukka bookings, automatic balanced team
              draws, tournaments, live scoring and a members&rsquo; shop. Proven at Tedworth Park Polo Club.
              Ready for yours.
            </p>
            <div className="hero-cta">
              <a href="#demo" className="btn btn-brass">
                Book a demo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a href="#platform" className="btn btn-ghost">Explore the platform</a>
            </div>
            <div className="hero-note">
              <span className="dot" /> In daily use on the App Store and any browser — no kit to install.
            </div>
          </div>
          <div className="card-match rv">
            <div className="cm-top">
              <span>Wednesday · Perham Down</span>
              <span className="cm-live"><span className="pulse" /> Live · 3rd Chukka</span>
            </div>
            <div className="cm-teams">
              <div className="team home">
                <div className="badge">B</div>
                <div className="nm">Blue</div>
                <div className="hc">Team handicap +3</div>
              </div>
              <div className="cm-score">5&ndash;4</div>
              <div className="team away">
                <div className="badge">W</div>
                <div className="nm">White</div>
                <div className="hc">Team handicap +3</div>
              </div>
            </div>
            <div className="cm-chukkas" aria-label="Chukka 3 of 6">
              <span>Chukkas</span>
              <i className="chk done" /><i className="chk done" /><i className="chk now" /><i className="chk" /><i className="chk" /><i className="chk" />
            </div>
          </div>
        </div>
      </div>

      <div className="strip">
        <div className="wrap">
          <div className="t">In daily use at Tedworth Park Polo Club — &ldquo;Home of Services Polo&rdquo;.</div>
          <div className="stats">
            <div className="stat"><b>&minus;2 &rarr; +10</b><span>Every handicap</span></div>
            <div className="stat"><b>5</b><span>Sessions a week, drawn</span></div>
            <div className="stat"><b>1</b><span>App: office &amp; field</span></div>
          </div>
        </div>
      </div>

      <section id="platform">
        <div className="wrap">
          <div className="sec-head rv">
            <span className="eyebrow">The Platform</span>
            <h2>Everything a polo club runs on, in one app.</h2>
            <p className="lead">
              Stop running the club across spreadsheets, group chats and a shoebox of receipts. PoloACT brings
              bookings, draws, tournaments and members together — so more of the week goes to polo.
            </p>
          </div>
          <div className="grid-feat">
            <div className="feat rv">
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
              </div>
              <h3>Chukka booking</h3>
              <p>Members sign up per day with handicap, chukkas, availability and pony-hire. Sign-ups close automatically before each session.</p>
            </div>
            <div className="feat rv">
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7" /></svg>
              </div>
              <h3>Automatic team draws</h3>
              <p>Balanced Blue v White draws in seconds — handicaps evened every chukka, rest gaps, availability windows and no-consecutive honoured.</p>
            </div>
            <div className="feat rv">
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M5 4h14v6a7 7 0 0 1-14 0z" /><path d="M5 8H3a2 2 0 0 0 0 4h2M19 8h2a2 2 0 0 1 0 4h-2" /></svg>
              </div>
              <h3>Tournaments &amp; fixtures</h3>
              <p>A season fixtures list with rich match details — up to five a side, umpires, goal judges, prizegivings and a trophy custodian.</p>
            </div>
            <div className="feat rv">
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
              </div>
              <h3>Programme PDFs</h3>
              <p>Print-ready tournament programmes — crest cover, running order, results, rules and HPA handicap head-starts, in your club&rsquo;s fonts.</p>
            </div>
            <div className="feat rv">
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>
              </div>
              <h3>Live scoring</h3>
              <p>Scores entered live and synced in real time, so members and spectators follow along — and stay on the game even if the app reloads.</p>
            </div>
            <div className="feat rv">
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18h2" /></svg>
              </div>
              <h3>Member app &amp; club shop</h3>
              <p>Fixtures, draws and results in every member&rsquo;s pocket — plus a club shop with partner discounts. Captain mode is PIN-protected.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="band">
        <div className="wrap">
          <div className="sec-head rv">
            <span className="eyebrow">Onboarding</span>
            <h2>Your club, live in four chukkas.</h2>
            <p className="lead">Bringing PoloACT to a club runs like a match — short periods, clear play. Most clubs are up and running inside a fortnight.</p>
          </div>
          <div className="chukkas">
            <div className="chukka rv"><div className="num">1st Chukka</div><h3>We set you up</h3><p>Members, teams, ponies, grounds and your crest and colours loaded and checked.</p></div>
            <div className="chukka rv"><div className="num">2nd Chukka</div><h3>The week goes live</h3><p>Your session days and rules configured; bookings and auto-draws start running.</p></div>
            <div className="chukka rv"><div className="num">3rd Chukka</div><h3>Members get the app</h3><p>On the App Store and any browser — fixtures, results and shop discounts included.</p></div>
            <div className="chukka rv"><div className="num">4th Chukka</div><h3>You get the season back</h3><p>Hours of committee admin returned to where they belong — the field.</p></div>
          </div>
        </div>
      </section>

      <section id="case" className="case on-field">
        <div className="wrap">
          <span className="eyebrow">Case study · Tedworth Park Polo Club</span>
          <h2>Built with a real club, from the first chukka.</h2>
          <div className="case-grid">
            <div className="rv">
              <p className="lead">
                PoloACT began life as <strong style={{ color: "var(--on-field)" }}>TPPC PoloACT</strong> — the
                digital home of Tedworth Park Polo Club. Every feature was forged in a working
                club&rsquo;s Wednesday-evening reality, then made ready for any club to adopt.
              </p>
              <div className="case-facts">
                <span className="fact"><b>Home of Services Polo</b></span>
                <span className="fact">Grounds: <b>Fisher · Tattoo · Perham Down</b></span>
                <span className="fact">Committee of <b>five</b></span>
                <span className="fact">iOS <b>+</b> any browser</span>
              </div>
              <p className="whitelabel">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brass-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16.5 7.1 19l.9-5.5-4-3.9L9.5 8z" /></svg>
                White-labelled per club — your crest, your colours, your grounds.
              </p>
              <div className="case-cta">
                <a className="badge-app" href="https://apps.apple.com/app/id6773771166" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="24" viewBox="0 0 24 28" fill="#fff" aria-hidden="true"><path d="M17.6 14.8c0-2.6 2.1-3.9 2.2-3.9-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9s-2-.9-3.4-.9c-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.3 2.5 1.3-.05 1.8-.85 3.4-.85s2 .85 3.4.82c1.4-.02 2.3-1.25 3.2-2.46.6-.9.9-1.5 1.4-2.5-3.6-1.4-3.6-4.9-2.6-6.03zM15 5.4c.7-.9 1.2-2.1 1.1-3.4-1 .05-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.4z" /></svg>
                  <span><small>Download on the</small><b>App Store</b></span>
                </a>
                <a className="btn btn-ghost" href="https://tedworthparkpolo.com/booking" target="_blank" rel="noopener noreferrer">Open in your browser &rarr;</a>
              </div>
              <p className="case-fine">App Store ID 6773771166 · tedworthparkpolo.com/booking</p>
            </div>

            <div className="club rv" aria-label="Tedworth Park Polo Club — the week">
              <div className="club-top">
                <svg className="club-crest" viewBox="0 0 56 56" aria-hidden="true">
                  <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="28" cy="28" r="20" fill="none" stroke="var(--claret-gold)" strokeWidth="1" />
                  <g stroke="var(--claret-gold)" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="38" x2="37" y2="19" /><line x1="38" y1="38" x2="19" y2="19" /></g>
                  <text x="28" y="32" textAnchor="middle" fontFamily="var(--serif)" fontSize="12" fontWeight="700" fill="currentColor">TPC</text>
                </svg>
                <div>
                  <h3>Tedworth Park Polo Club</h3>
                  <div className="sub">Home of Services Polo</div>
                </div>
              </div>
              <ul className="week">
                <li><span className="day">Wed</span><span className="who">All handicaps · evening throw-in</span><span className="tag">Open</span></li>
                <li><span className="day">Thu</span><span className="who">Ladies&rsquo; chukkas</span><span className="tag">Ladies</span></li>
                <li><span className="day">Fri</span><span className="who">Instructional · beginners</span><span className="tag">New to polo</span></li>
                <li><span className="day">Sat</span><span className="who">All handicaps</span><span className="tag">Open</span></li>
                <li><span className="day">Sun</span><span className="who">All handicaps</span><span className="tag">Open</span></li>
              </ul>
              <p className="club-foot">Every day has its own rules — PoloACT enforces them at sign-up and builds each draw automatically.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="shops">
        <div className="wrap">
          <div className="sec-head rv">
            <span className="eyebrow">Shop network</span>
            <h2>A members&rsquo; shop that pays the club back.</h2>
            <p className="lead">
              Every PoloACT member gets a code that unlocks discounts across our partner shops — mallets to
              boots, saddlery to apparel. Members save; the club earns on every basket.
            </p>
          </div>
          <div className="shops">
            <a className="shop rv" href="https://www.satsfaction.com" target="_blank" rel="noopener noreferrer">
              <div className="row"><div className="mk">S</div><span className="chip">Founding partner</span></div>
              <h3>SATSfaction</h3><div className="cat">Polo equipment &amp; apparel</div>
              <span className="go">Visit the shop <span className="arw">&rarr;</span></span>
            </a>
            <a className="shop rv" href="https://blackhoundsports.com" target="_blank" rel="noopener noreferrer">
              <div className="row"><div className="mk">B</div><span className="chip">Founding partner</span></div>
              <h3>Black Hound Sports</h3><div className="cat">Polo equipment &amp; sportswear</div>
              <span className="go">Visit the shop <span className="arw">&rarr;</span></span>
            </a>
            <a className="shop rv" href="#demo">
              <div className="row"><div className="mk add">+</div><span className="chip soft">Your shop here</span></div>
              <h3>Become a partner</h3><div className="cat">Reach every member across the network</div>
              <span className="go">Join the network <span className="arw">&rarr;</span></span>
            </a>
          </div>
          <p className="shops-note">
            SATSfaction and Black Hound Sports are onboarding as founding partners — member offers are being
            finalised. Are you a polo retailer? <a href="#demo">Join the network &rarr;</a>
          </p>
        </div>
      </section>

      <section id="members" className="members on-field">
        <div className="wrap">
          <div className="sec-head rv">
            <span className="eyebrow">For members</span>
            <h2>Play more. Spend less on kit.</h2>
            <p className="lead">If your club is on PoloACT, your membership does more than book chukkas — it pays you back every time you shop the polo trade.</p>
          </div>
          <div className="steps">
            <div className="step rv"><h3>Join your club on PoloACT</h3><p>Your club adds you; the app arrives with fixtures, bookings and results.</p></div>
            <div className="step rv"><h3>Get your member code</h3><p>A single code in your profile unlocks discounts across every partner shop.</p></div>
            <div className="step rv"><h3>Save across the network</h3><p>Boots, mallets, kit and more — checkout at member prices, all season.</p></div>
          </div>
          <div className="hero-cta mt-lg"><a href="#demo" className="btn btn-brass">Ask your club about PoloACT</a></div>
        </div>
      </section>

      <section id="demo" className="cta">
        <div className="wrap">
          <span className="eyebrow">Book a demo</span>
          <h2>Bring PoloACT to your club.</h2>
          <p className="lead lead-center">See the platform on your own fixtures in a 30-minute walkthrough. Simple per-club pricing — we&rsquo;ll tailor it to your season.</p>
          <form onSubmit={onSubmit} noValidate>
            <input type="text" name="club" placeholder="Your club" aria-label="Your club" required />
            <input type="email" name="email" placeholder="Email address" aria-label="Email address" required />
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />
            <button type="submit" className="btn btn-brass" disabled={sending}>
              {sending ? "Sending…" : "Request a demo"}
            </button>
          </form>
          <p className="fine">Already a Tedworth member? <strong>Open the app</strong> at tedworthparkpolo.com/booking</p>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-brand">
            <b>PoloACT</b>
            <p>Polo club management software — bookings, draws, tournaments, live scoring and a members&rsquo; shop. Built with Tedworth Park Polo Club.</p>
          </div>
          <div>
            <h4>Platform</h4>
            <a href="#platform">Features</a>
            <a href="#how">Onboarding</a>
            <a href="#case">Case study</a>
            <a href="#members">For members</a>
          </div>
          <div>
            <h4>Shop network</h4>
            <a href="#shops">Partner shops</a>
            <a href="#demo">Become a partner</a>
            <a href="#demo">Book a demo</a>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="wrap">
            <small>
              © {year} Copyright{" "}
              <a href="https://actsystems.co.uk" target="_blank" rel="noopener noreferrer">ACT Systems Limited</a>.
              PoloACT is a product of ACT Systems, built with Tedworth Park Polo Club.
            </small>
            <span className="foot-meta">
              <a href="/privacy">Privacy &amp; Cookies</a>
              <span className="preview-tag">Preview · partner offers being finalised</span>
            </span>
          </div>
        </div>
      </footer>

      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
