// The demo's own Firebase project — sign-in, and the shared club data that
// real sign-ins need. Only imported when demoConfig says the project is
// configured; the browser-only mode never loads this file.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './demoConfig';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
