// A stand-in for sign-in that lives entirely in the visitor's browser, used
// when no Firebase project is configured. It exists so the sign-in flow, the
// member/admin split and the captain PIN can all be tried before the real
// project is set up — and so the demo never breaks if that configuration is
// ever missing.
//
// It is deliberately easy: any email and password creates or opens an
// account, "email me a link" signs you in on the spot, and the Google and
// Apple buttons sign you in as a sample account. Nothing leaves the browser.
// The admin bootstrap list is VITE_ADMIN_EMAILS plus the sample admin below,
// so there is always a way to see the admin side whatever the deployment sets.
import { FIXED_ADMIN_EMAILS } from './demoConfig';
import { announceAuthChange } from './auth';

const KEY = 'poloact-demo-auth';
export const SAMPLE_ADMIN = 'admin@poloact.demo';

const lower = (s) => String(s || '').trim().toLowerCase();
const fixed = [...new Set([...FIXED_ADMIN_EMAILS.map(lower), SAMPLE_ADMIN])];

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
};
const write = (state) => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
};
const state = { accounts: {}, current: null, admins: [], ...read() };
const persist = () => write({ accounts: state.accounts, current: state.current, admins: state.admins });

const provider = {
  enabled: true,
  ready: true,
  methods: ['password', 'link', 'google', 'facebook', 'apple'],
  fixedAdmins: fixed,
  user: null,
  role: 'anon',
  profile: null,

  async signInWithPassword(email, password) {
    const e = lower(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw { code: 'auth/invalid-email' };
    if (!password) throw { code: 'auth/wrong-password' };
    if (!state.accounts[e]) state.accounts[e] = { email: e, profile: null };
    become(e);
  },
  async createAccount(email, password) {
    const e = lower(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw { code: 'auth/invalid-email' };
    if (!password || password.length < 6) throw { code: 'auth/weak-password' };
    if (state.accounts[e]) throw { code: 'auth/email-already-in-use' };
    state.accounts[e] = { email: e, profile: null };
    become(e);
  },
  async sendPasswordReset() { /* nothing to reset in the browser stand-in */ },
  async sendSignInLink(email) {
    const e = lower(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw { code: 'auth/invalid-email' };
    if (!state.accounts[e]) state.accounts[e] = { email: e, profile: null };
    // No email leaves the browser: the "link" is followed at once.
    setTimeout(() => become(e), 600);
  },
  async signInWithGoogle() {
    const e = 'sample.google@poloact.demo';
    if (!state.accounts[e]) state.accounts[e] = { email: e, displayName: 'Sam Google', profile: null, providers: ['google.com'] };
    become(e);
  },
  async signInWithFacebook() {
    const e = 'sample.facebook@poloact.demo';
    if (!state.accounts[e]) state.accounts[e] = { email: e, displayName: 'Frankie Face', profile: null, providers: ['facebook.com'] };
    become(e);
  },
  async signInWithApple() {
    const e = 'sample.apple@poloact.demo';
    if (!state.accounts[e]) state.accounts[e] = { email: e, displayName: 'Alex Apple', profile: null, providers: ['apple.com'] };
    become(e);
  },
  async signOut() {
    state.current = null; persist(); sync();
  },
  async saveProfile(profile) {
    if (!state.current) throw new Error('Sign in first.');
    state.accounts[state.current].profile = {
      name: String(profile.name || '').trim(),
      handicap: Number.isFinite(Number(profile.handicap)) ? Number(profile.handicap) : null,
      mobile: String(profile.mobile || '').trim(),
      hpa: String(profile.hpa || '').trim(),
    };
    persist(); sync();
  },
  // The stand-in has no real providers to link, so it just records that this
  // account now has another way in — enough for the sheet and the bench to
  // behave as they will against a real project.
  async linkProvider(which) {
    if (!state.current) throw new Error('Sign in first, then add another way in.');
    const id = which === 'google' ? 'google.com' : which === 'apple' ? 'apple.com' : 'facebook.com';
    const acc = state.accounts[state.current];
    acc.providers = Array.from(new Set([...(acc.providers || []), id]));
    persist(); sync();
  },
  async existingMethodsFor(email) {
    const acc = state.accounts[lower(email)];
    return acc ? (acc.providers || []) : [];
  },
  async listAdmins() { return [...state.admins]; },
  async setAdmins(emails) {
    if (provider.role !== 'admin') throw new Error('Only an admin can change the admins.');
    state.admins = emails.map(lower).filter(Boolean); persist(); sync();
  },
};

function become(email) { state.current = email; persist(); sync(); }

function sync() {
  const acc = state.current ? state.accounts[state.current] : null;
  provider.user = acc ? { uid: 'local:' + acc.email, email: acc.email, displayName: acc.displayName || '', providers: acc.providers || [] } : null;
  provider.profile = acc ? acc.profile : null;
  provider.role = !acc ? 'anon'
    : (fixed.includes(acc.email) || state.admins.includes(acc.email)) ? 'admin'
    : 'member';
  announceAuthChange();
}

export function installLocalAuth() {
  window.auth = provider;
  sync();
  return provider;
}

// For the demo bar: wipe accounts along with everything else.
export function resetLocalAuth() {
  try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
}
