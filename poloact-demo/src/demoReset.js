// Putting the sample club back.
//
// Browser-only mode: the store on this device is rebuilt (storage-local.js
// does it) and the stand-in accounts are cleared.
//
// Firebase mode: the sample club is written over the shared data. That is a
// write to the shared collection, which the Firestore rules allow only to an
// admin, so the button is offered to admins alone. The nightly reset is the
// same operation run from the hub's cron (app/api/demo-reset in the poloact
// repo) with a service account, so it does not depend on anyone being signed
// in at 3am.
import { buildDemoData } from './demoSeed';
import { firebaseConfigured } from './demoConfig';

export const SEEDED_ON_KEY = 'demo-seeded-on';

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Everything the seed does not mention is removed too, so a reset is a reset:
// yesterday's extra rosters, drawn schedules and test fixtures all go.
export async function resetSharedDemo() {
  const fresh = buildDemoData();
  const { keys } = await window.storage.list('', true);
  const keep = new Set([...Object.keys(fresh), 'admins']);
  await Promise.all(keys.filter((k) => !keep.has(k)).map((k) => window.storage.delete(k, true).catch(() => {})));
  await Promise.all(Object.entries(fresh).map(([k, v]) => window.storage.set(k, v, true)));
  await window.storage.set(SEEDED_ON_KEY, todayISO(), true);
}

export async function resetDemo() {
  if (firebaseConfigured) {
    await resetSharedDemo();
  } else {
    const { resetLocalAuth } = await import('./authLocal');
    resetLocalAuth();
    window.storage.resetDemo();
  }
}

// Whether the shared demo has ever been seeded — an admin's first visit to a
// brand-new project sees an empty club and is offered the seed.
export async function sharedDemoSeededOn() {
  try {
    const rec = await window.storage.get(SEEDED_ON_KEY, true);
    return rec && rec.value ? rec.value : null;
  } catch (e) {
    return null;
  }
}
