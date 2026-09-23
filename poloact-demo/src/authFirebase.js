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
  GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  linkWithPopup, fetchSignInMethodsForEmail,
  signOut as fbSignOut, setPersistence, browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth as fbAuth, db } from './firebase';
import { FIXED_ADMIN_EMAILS, APPLE_SIGN_IN_ENABLED } from './demoConfig';
import { announceAuthChange } from './auth';

// The demo is where sign-in is actually on, unlike the clubs — the shared
// Sign-in panel on the Lessons tab reads this to say so. installClubAuth() is
// its way of asking for the provider; here auth-provider.js has already
// installed it at boot, so there is nothing left to do.
export const SIGN_IN_LIVE = true;
export const installClubAuth = () => Promise.resolve(window.auth);

const LINK_EMAIL_KEY = 'poloact-demo-link-email';
const ADMINS_DOC = ['config', 'admins'];

const lower = (s) => String(s || '').trim().toLowerCase();

let adminEmails = [];          // from config/admins, kept live
let stopAdminsWatch = null;
let stopProfileWatch = null;

const provider = {
  enabled: true,
  ready: false,
  methods: ['password', 'link', 'google', 'facebook', ...(APPLE_SIGN_IN_ENABLED ? ['apple'] : [])],
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
  async signInWithFacebook() {
    const p = new FacebookAuthProvider();
    p.addScope('email');
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
  // Firebase keeps one account per email, so someone who signed up with Google
  // and later taps Apple is refused. Linking is the way through: the second
  // provider joins the same account, and either signs them in from then on. A
  // second account would split their bookings in two.
  async linkProvider(which) {
    if (!fbAuth.currentUser) throw new Error('Sign in first, then add another way in.');
    const p = which === 'google' ? new GoogleAuthProvider()
      : which === 'facebook' ? new FacebookAuthProvider()
      : which === 'apple' ? new OAuthProvider('apple.com')
      : null;
    if (!p) throw new Error('That sign-in method cannot be added.');
    await linkWithPopup(fbAuth.currentUser, p);
    provider.user = snapshotUser(fbAuth.currentUser);
    announceAuthChange();
  },
  // Empty where the project has email-enumeration protection on, which is why
  // the club's own record of a player's providers is the fallback — see
  // accountLink.js.
  async existingMethodsFor(email) {
    try { return await fetchSignInMethodsForEmail(fbAuth, String(email || '').trim()); }
    catch (e) { return []; }
  },
  async saveProfile(profile) {
    if (!provider.user) throw new Error('Sign in first.');
    const clean = {
      name: String(profile.name || '').trim(),
      handicap: Number.isFinite(Number(profile.handicap)) ? Number(profile.handicap) : null,
      mobile: String(profile.mobile || '').trim(),
      hpa: String(profile.hpa || '').trim(),
      email: provider.user.email || '',
      // Normally now, but the caller may pass the timestamp it is copying
      // from. That is what lets the app seed a profile from the club's player
      // record and leave the two stamps equal — without it the seed would look
      // like a fresh edit and be pushed straight back, forever.
      updated: Number(profile.updated) || Date.now(),
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

// The fields the app renders from, plus the ways this account can sign in —
// that last one is how the app can say which way was used the first time.
const snapshotUser = (u) => (u ? {
  uid: u.uid,
  email: u.email || '',
  displayName: u.displayName || '',
  providers: (u.providerData || []).map((d) => d && d.providerId).filter(Boolean),
} : null);

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
    provider.user = snapshotUser(u);
    provider.role = computeRole();
    provider.ready = true;
    watchProfile(u ? u.uid : null);
    announceAuthChange();
  });
  return provider;
}
