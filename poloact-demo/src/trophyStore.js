// Trophy photographs, in whichever store the demo is running on (see
// main.jsx). The app imports this file by name and calls the same functions
// either way; each one hands off to the mode's own implementation, loaded on
// first use. trophyKeyFor is pure and shared.
import { firebaseConfigured } from './demoConfig';

let implPromise = null;
const impl = () => {
  if (!implPromise) {
    implPromise = firebaseConfigured ? import('./trophyStore-firestore') : import('./trophyStore-local');
  }
  return implPromise;
};

export const trophyKeyFor = (name) =>
  String(name || '')
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export const loadTrophyIndex   = (...a) => impl().then((m) => m.loadTrophyIndex(...a));
export const loadTrophyImage   = (...a) => impl().then((m) => m.loadTrophyImage(...a));
export const saveTrophyImage   = (...a) => impl().then((m) => m.saveTrophyImage(...a));
export const deleteTrophyImage = (...a) => impl().then((m) => m.deleteTrophyImage(...a));
export const prepareTrophyImage = (...a) => impl().then((m) => m.prepareTrophyImage(...a));
