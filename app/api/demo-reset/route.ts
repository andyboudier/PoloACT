import { NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// The sample club, exactly as the demo app seeds it for itself.
import { buildDemoData } from "../../../poloact-demo/src/demoSeed.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Puts the demo's shared Firestore data back to the sample club. Runs nightly
// from the cron in vercel.json, and may be called by hand with the same
// secret. Needs, in Vercel → Settings → Environment Variables:
//
//   FIREBASE_SERVICE_ACCOUNT_JSON  the demo project's service-account key,
//                                  pasted whole (Firebase console → Project
//                                  settings → Service accounts → Generate key)
//   CRON_SECRET                    any long random string; Vercel sends it as
//                                  a bearer token on cron invocations
//
// The admins list (config/admins) is left alone, so nobody is locked out by a
// reset. Everything else in `shared` that the seed does not mention is
// removed, so a reset is a reset.
function firestore() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not set");
  const app = getApps()[0] ?? initializeApp({ credential: cert(JSON.parse(raw)) });
  return getFirestore(app);
}

const todayISO = () => {
  // London calendar day: the reset runs for the club's morning, not UTC's.
  const d = new Date(new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

async function handle(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") || "";
  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  }
  try {
    const db = firestore();
    const fresh: Record<string, string> = buildDemoData();
    const keep = new Set([...Object.keys(fresh), "admins"]);
    const shared = db.collection("shared");
    const existing = await shared.listDocuments();

    let batch = db.batch();
    let n = 0;
    const flush = async () => { if (n) { await batch.commit(); batch = db.batch(); n = 0; } };
    const op = async (fn: () => void) => { fn(); n += 1; if (n >= 400) await flush(); };

    let removed = 0;
    for (const ref of existing) {
      if (!keep.has(ref.id)) { await op(() => batch.delete(ref)); removed += 1; }
    }
    for (const [key, value] of Object.entries(fresh)) {
      await op(() => batch.set(shared.doc(key), { value }));
    }
    await op(() => batch.set(shared.doc("demo-seeded-on"), { value: todayISO() }));
    await flush();

    return NextResponse.json({ ok: true, seeded: Object.keys(fresh).length, removed, on: todayISO() });
  } catch (err) {
    console.error("Demo reset failed:", err);
    return NextResponse.json({ ok: false, error: "Reset failed — see the function logs." }, { status: 500 });
  }
}

export async function GET(request: Request) { return handle(request); }
export async function POST(request: Request) { return handle(request); }
