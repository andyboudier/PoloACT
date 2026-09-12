// Demo storage — the same window.storage API the club apps use, but backed by
// the visitor's own browser instead of Firestore.
//
// Why no backend: this is a public demo. A shared database would mean the first
// person to clear the roster spoils it for everyone after them, and it would
// need policing and periodic resetting. Here every visitor gets their own clean,
// complete club, can change anything they like, and nobody else is affected.
// "Reset the demo" puts it back.
//
// The trade-off worth knowing: nothing syncs between devices, so the live
// cross-device updates the real apps have are the one thing the demo cannot
// show. Everything else behaves exactly as it does for a real club.

import { buildDemoData } from './demoSeed';

const STORE_KEY = 'poloact-demo-store';
const SEED_KEY = 'poloact-demo-seeded';

// Bumped whenever demoSeed changes, so returning visitors pick up a new seed
// rather than being stuck with last month's sample club.
const SEED_VERSION = '3';

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const writeStore = (obj) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch (e) { /* private mode */ }
};

// Seed on first visit, and re-seed when the sample data itself has moved on.
// The dates in the seed are relative to now, so a fresh seed is also how the
// demo stays looking current.
const seedIfNeeded = () => {
  let store = readStore();
  let seeded = null;
  try { seeded = localStorage.getItem(SEED_KEY); } catch (e) { /* ignore */ }
  if (!store || seeded !== SEED_VERSION) {
    store = buildDemoData();
    writeStore(store);
    try { localStorage.setItem(SEED_KEY, SEED_VERSION); } catch (e) { /* ignore */ }
  }
  return store;
};

// The whole demo lives in memory for the session; localStorage is the copy that
// survives a reload. Reads never touch storage, so the demo is instant.
const store = seedIfNeeded();

const notify = (key) => {
  window.dispatchEvent(new CustomEvent('storage-changed', { detail: { key } }));
};

const storage = {
  async get(key) {
    return Object.prototype.hasOwnProperty.call(store, key)
      ? { key, value: store[key], shared: true }
      : null;
  },

  async set(key, value) {
    store[key] = value;
    writeStore(store);
    return { key, value, shared: true };
  },

  async delete(key) {
    delete store[key];
    writeStore(store);
    return { key, deleted: true, shared: true };
  },

  async list(prefix = '') {
    const keys = Object.keys(store).filter((k) => !prefix || k.startsWith(prefix));
    return { keys, prefix, shared: true };
  },

  // The real adapter warms a Firestore cache here. Nothing to warm.
  primeShared() { return Promise.resolve(); },

  // Wipe this visitor's changes and rebuild the sample club. Exposed on
  // window.storage so the demo banner can offer it.
  resetDemo() {
    try {
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem(SEED_KEY);
    } catch (e) { /* ignore */ }
    const fresh = buildDemoData();
    for (const k of Object.keys(store)) delete store[k];
    Object.assign(store, fresh);
    writeStore(store);
    try { localStorage.setItem(SEED_KEY, SEED_VERSION); } catch (e) { /* ignore */ }
    for (const k of Object.keys(store)) notify(k);
  },
};

if (typeof window !== 'undefined') {
  window.storage = storage;
  window.__poloactDemo = true;
}

export default storage;
