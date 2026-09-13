// Sign-in for the demo, on Firebase Auth. Implements the `window.auth`
// contract described in auth.js (shared with the club apps).
//
// Roles: everyone signed in is a member. Admins are the emails in the
// Firestore document config/admins ({ emails: [...] }) plus the fixed list in
// the deployment's environment — the same document the Firestore rules read,
// so the app and the database agree about who may write what.
//
// The member's profile (name, handicap, mobile, HPA number) lives in
// users/{uid}, readable and writable only by that member and by admins.
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink,
  GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  signOut as fbSignOut, setPersistence, browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth as fbAuth, db } from './firebase';
import { FIXED_ADMIN_EMAILS, APPLE_SIGN_IN_ENABLED } from './demoConfig';
import { announceAuthChange } from './auth';

const LINK_EMAIL_KEY = 'poloact-demo-link-email';
const ADMINS_DOC = ['config', 'admins'];

const lower = (s) => String(s || '').trim().toLowerCase();

let adminEmails = [];          // from config/admins, kept live
let stopAdminsWatch = null;
let stopProfileWatch = null;

const provider = {
  enabled: true,
  ready: false,
  methods: ['password', 'link', 'google', ...(APPLE_SIGN_IN_ENABLED ? ['apple'] : [])],
  fixedAdmins: FIXED_ADMIN_EMAILS,
  user: null,
  role: 'anon',
  profile: null,

  async signInWithPassword(email, password) {
    await signInWithEmailAndPassword(fbAuth, email, password);
  },
  async createAccount(email, password) {
    await createUserWithEmailAndPassword(fbAuth, email, password);
  },
  async sendPasswordReset(email) {
    await sendPasswordResetEmail(fbAuth, email);
  },
  // The link brings the visitor back to this same page; completeLinkSignIn()
  // below finishes the job on load. The email is kept locally so the link
  // can be completed without asking for it again.
  async sendSignInLink(email) {
    await sendSignInLinkToEmail(fbAuth, email, { url: window.location.origin + window.location.pathname, handleCodeInApp: true });
    try { localStorage.setItem(LINK_EMAIL_KEY, email); } catch (e) { /* ignore */ }
  },
  async signInWithGoogle() {
    const p = new GoogleAuthProvider();
    // Always offer the account chooser: people share iPads at the club.
    p.setCustomParameters({ prompt: 'select_account' });
    await popupOrRedirect(p);
  },
  async signInWithApple() {
    const p = new OAuthProvider('apple.com');
    p.addScope('email'); p.addScope('name');
    p.setCustomParameters({ locale: 'en_GB' });
    await popupOrRedirect(p);
  },
  async signOut() {
    await fbSignOut(fbAuth);
  },
  async saveProfile(profile) {
    if (!provider.user) throw new Error('Sign in first.');
    const clean = {
      name: String(profile.name || '').trim(),
      handicap: Number.isFinite(Number(profile.handicap)) ? Number(profile.handicap) : null,
      mobile: String(profile.mobile || '').trim(),
      hpa: String(profile.hpa || '').trim(),
      email: provider.user.email || '',
      updated: Date.now(),
    };
    await setDoc(doc(db, 'users', provider.user.uid), clean, { merge: true });
    provider.profile = clean;
    announceAuthChange();
  },
  async listAdmins() {
    const snap = await getDoc(doc(db, ...ADMINS_DOC));
    return snap.exists() ? (snap.data().emails || []).map(lower) : [];
  },
  async setAdmins(emails) {
    if (provider.role !== 'admin') throw new Error('Only an admin can change the admins.');
    await setDoc(doc(db, ...ADMINS_DOC), { emails: emails.map(lower).filter(Boolean) });
  },
};

// Pop-ups are the quicker path and work on desktop and most phones; where the
// browser refuses one (in-app browsers, some iOS setups) fall back to a full
// redirect, which getRedirectResult() completes on the way back.
async function popupOrRedirect(p) {
  // An installed PWA on iOS has no pop-up to open; go straight to redirect.
  const standalone = (window.navigator && window.navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches;
  if (standalone) { await signInWithRedirect(fbAuth, p); return; }
  try {
    await signInWithPopup(fbAuth, p);
  } catch (e) {
    const code = e && e.code;
    if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment' || code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(fbAuth, p);
      return;
    }
    throw e;
  }
}

const computeRole = () => {
  if (!provider.user) return 'anon';
  const e = lower(provider.user.email);
  if (e && (FIXED_ADMIN_EMAILS.includes(e) || adminEmails.includes(e))) return 'admin';
  return 'member';
};

const refreshRole = () => {
  const next = computeRole();
  if (next !== provider.role) { provider.role = next; announceAuthChange(); }
};

const watchAdmins = () => {
  if (stopAdminsWatch) return;
  stopAdminsWatch = onSnapshot(doc(db, ...ADMINS_DOC), (snap) => {
    adminEmails = snap.exists() ? (snap.data().emails || []).map(lower) : [];
    refreshRole();
  }, () => { /* rules may deny anon reads of config; role stays as computed */ });
};

const watchProfile = (uid) => {
  if (stopProfileWatch) { stopProfileWatch(); stopProfileWatch = null; }
  if (!uid) { provider.profile = null; return; }
  stopProfileWatch = onSnapshot(doc(db, 'users', uid), (snap) => {
    provider.profile = snap.exists() ? snap.data() : null;
    announceAuthChange();
  }, () => { provider.profile = null; announceAuthChange(); });
};

// Finish an email-link sign-in if this page load is one.
async function completeLinkSignIn() {
  if (!isSignInWithEmailLink(fbAuth, window.location.href)) return;
  let email = '';
  try { email = localStorage.getItem(LINK_EMAIL_KEY) || ''; } catch (e) { /* ignore */ }
  if (!email) email = window.prompt('Confirm the email address the sign-in link was sent to') || '';
  if (!email) return;
  try {
    await signInWithEmailLink(fbAuth, email, window.location.href);
    try { localStorage.removeItem(LINK_EMAIL_KEY); } catch (e) { /* ignore */ }
    // Drop the one-time code from the address bar.
    window.history.replaceState({}, '', window.location.origin + window.location.pathname);
  } catch (e) {
    console.error('Sign-in link failed', e);
  }
}

export function installFirebaseAuth() {
  window.auth = provider;
  setPersistence(fbAuth, browserLocalPersistence).catch(() => {});
  watchAdmins();
  getRedirectResult(fbAuth).catch((e) => console.error('Redirect sign-in failed', e));
  completeLinkSignIn();
  onAuthStateChanged(fbAuth, (u) => {
    provider.user = u ? { uid: u.uid, email: u.email || '', displayName: u.displayName || '' } : null;
    provider.role = computeRole();
    provider.ready = true;
    watchProfile(u ? u.uid : null);
    announceAuthChange();
  });
  return provider;
}
