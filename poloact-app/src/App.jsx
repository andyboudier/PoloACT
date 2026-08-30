import { useCallback, useEffect, useState } from 'react';
import { CLUBS } from './clubs';

// PoloACT — the hub. Four tiles; tapping one opens that club's app full-screen
// inside this one.
//
// The club apps are loaded in a frame rather than navigated to, for one reason:
// if we navigated away, the hub would be gone and there would be no way back on
// iOS, which has no system back button inside an app. Framing keeps the hub
// alive underneath, so the home control below can always return you.
export default function App() {
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idle, setIdle] = useState(false);   // dims the home pill once you're reading

  const club = CLUBS.find((c) => c.key === openKey) || null;

  const goHome = useCallback(() => {
    setOpenKey(null);
    setLoading(false);
  }, []);

  const openClub = (c) => {
    setOpenKey(c.key);
    setLoading(true);
    setIdle(false);
  };

  // Android's hardware back should mean "back to the clubs", not "quit the app".
  // Registered only while a club is open, so back on the hub still exits.
  useEffect(() => {
    if (!club) return undefined;
    let remove = () => {};
    let cancelled = false;
    (async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        const handle = await CapApp.addListener('backButton', goHome);
        if (cancelled) handle.remove();
        else remove = () => handle.remove();
      } catch (e) {
        // Web build, or the plugin isn't present — the on-screen control covers it.
      }
    })();
    // The browser back button should do the same thing on the web.
    window.history.pushState({ club: club.key }, '');
    const onPop = () => goHome();
    window.addEventListener('popstate', onPop);
    return () => {
      cancelled = true;
      remove();
      window.removeEventListener('popstate', onPop);
    };
  }, [club, goHome]);

  // Fade the home pill back once someone has settled into the club app, so it
  // isn't sitting over the roster the whole time. Any tap brings it back.
  useEffect(() => {
    if (!club || loading) return undefined;
    const t = setTimeout(() => setIdle(true), 4000);
    return () => clearTimeout(t);
  }, [club, loading]);

  if (club) {
    return (
      <div className="stage" onPointerDown={() => setIdle(false)}>
        <iframe
          key={club.key}
          className="club-frame"
          src={club.url}
          title={club.name}
          onLoad={() => setLoading(false)}
          allow="clipboard-write; web-share"
        />

        {loading && (
          <div className="frame-loading" role="status">
            <img src={club.icon} alt="" width="72" height="72" />
            <span className="spinner" aria-hidden="true" />
            <p>Opening {club.name}…</p>
          </div>
        )}

        {/* Deliberately a small floating control rather than a bar: the club app
            keeps the full screen, but there is always a way back. */}
        <button
          type="button"
          className={`home-pill${idle ? ' is-idle' : ''}`}
          onClick={goHome}
          aria-label="Back to PoloACT"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          PoloACT
        </button>
      </div>
    );
  }

  return (
    <main className="hub">
      <header className="masthead">
        <img className="mark" src="/poloact-mark.svg" alt="" width="64" height="64" />
        <h1>PoloACT</h1>
        <p className="tagline">Chukka to clubhouse — pick your club</p>
      </header>

      <div className="grid">
        {CLUBS.map((c) => (
          <button key={c.key} type="button" className="tile" onClick={() => openClub(c)}>
            <span className="tile-icon">
              <img src={c.icon} alt="" width="96" height="96" loading="eager" />
            </span>
            <span className="tile-name">{c.name}</span>
            <span className="tile-blurb">{c.blurb}</span>
            {c.demo && <span className="tile-badge">Demo</span>}
          </button>
        ))}
      </div>

      <footer className="foot">
        <span>poloact.co.uk</span>
      </footer>
    </main>
  );
}
