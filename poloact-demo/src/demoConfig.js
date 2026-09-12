// Deployment settings for the demo, read from the environment. Kept free of
// any Firebase import so the browser-only mode never loads the SDK.
//
// Set these in Vercel (Settings → Environment Variables) or a local .env:
//
//   VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
//   VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID,
//   VITE_FIREBASE_APP_ID     the web config from the Firebase console
//   VITE_ADMIN_EMAILS        comma-separated emails that are always admins
//   VITE_AUTH_APPLE=1        once Sign in with Apple is configured
//
// A Firebase web config is not a secret: it identifies the project to the
// browser and is meant to ship. Access is governed by the Firestore rules and
// by Firebase Auth.
const env = import.meta.env || {};

export const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY || '',
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId:         env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId:             env.VITE_FIREBASE_APP_ID || '',
};

// The switch main.jsx boots on: real Firebase, or the browser-only demo.
export const firebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

// Emails that are always admins, whatever the admins list in the database
// says — so whoever deploys the demo can never be locked out.
export const FIXED_ADMIN_EMAILS = String(env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Sign in with Apple needs a Services ID and key from the Apple Developer
// account wired into the Firebase console first. Hidden until that is done.
export const APPLE_SIGN_IN_ENABLED = env.VITE_AUTH_APPLE === '1';
