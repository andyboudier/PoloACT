// Installs the demo's sign-in provider on window.auth before the app renders.
// Real Firebase Auth when the project is configured; otherwise the
// browser-only stand-in. See demoConfig.js for the switch.
import { firebaseConfigured } from './demoConfig';

export async function installAuth() {
  if (firebaseConfigured) {
    const { installFirebaseAuth } = await import('./authFirebase');
    return installFirebaseAuth();
  }
  const { installLocalAuth } = await import('./authLocal');
  return installLocalAuth();
}
