import { useState } from 'react';

// A slim strip across the top saying, plainly, that this is a demo: what the
// data is, how to see the captain's side of the app, and how to put it back.
//
// It sits at the top rather than the bottom because the PoloACT hub puts its
// own "back" control bottom-left, and two floating controls in one corner is
// one too many.
export default function DemoChrome() {
  const [confirming, setConfirming] = useState(false);

  const reset = () => {
    try {
      window.storage.resetDemo();
    } catch (e) { /* fall through to the reload, which re-seeds anyway */ }
    window.location.reload();
  };

  return (
    <>
      <style>{`
        :root { --demo-bar: 34px; }
        body { padding-top: var(--demo-bar); }
        .demo-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
          height: var(--demo-bar);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 0 12px;
          background: #14291d; color: #efe9db;
          font-family: 'Outfit', system-ui, sans-serif;
          font-size: 12px; line-height: 1;
          box-shadow: 0 1px 0 rgba(198, 164, 104, 0.35);
        }
        .demo-bar b { color: #c6a468; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
        .demo-bar .sep { color: rgba(239, 233, 219, 0.3); }
        .demo-bar .hint { color: rgba(239, 233, 219, 0.75); }
        .demo-bar button {
          background: none; border: 1px solid rgba(239, 233, 219, 0.3);
          color: #efe9db; font: inherit; font-size: 11px;
          padding: 4px 9px; border-radius: 999px; cursor: pointer; white-space: nowrap;
        }
        .demo-bar button:hover { border-color: #c6a468; color: #c6a468; }
        .demo-bar .go { background: #c6a468; border-color: #c6a468; color: #14291d; font-weight: 600; }
        @media (max-width: 560px) { .demo-bar .hide-sm { display: none; } }
      `}</style>

      <div className="demo-bar" role="note">
        <b>Demo</b>
        <span className="sep">·</span>
        {confirming ? (
          <>
            <span className="hint">Clear your changes and start again?</span>
            <button type="button" className="go" onClick={reset}>Reset</button>
            <button type="button" onClick={() => setConfirming(false)}>Cancel</button>
          </>
        ) : (
          <>
            <span className="hint">
              Sample club. Changes are yours alone
              <span className="hide-sm"> — captain PIN 1907</span>
            </span>
            <button type="button" onClick={() => setConfirming(true)}>Reset demo</button>
          </>
        )}
      </div>
    </>
  );
}
