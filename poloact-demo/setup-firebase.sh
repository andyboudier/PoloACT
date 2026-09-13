#!/usr/bin/env bash
#
# Stand the demo's Firebase project up from the command line.
#
# Run it on your own machine, from this directory:
#
#   ./setup-firebase.sh              # do it
#   ./setup-firebase.sh --dry-run    # print what it would run, change nothing
#   ./setup-firebase.sh --vercel     # also push the config to Vercel
#
# It is safe to run twice: every step checks whether it has already been done.
#
# What it CANNOT do, because Google offers no API for it — the script stops and
# tells you at the right moment:
#   · turning on the sign-in methods (Email/Password, the email link, Google)
#   · adding demo.poloact.co.uk to the authorised domains
#   · Sign in with Apple, which needs a Services ID and key from Apple first
#
set -euo pipefail

# ── What to build ────────────────────────────────────────────────────────
PROJECT_ID="${PROJECT_ID:-poloact-demo}"          # must be globally unique
DISPLAY_NAME="${DISPLAY_NAME:-PoloACT Demo}"
# Firestore location. europe-west2 is London; it cannot be changed later.
LOCATION="${LOCATION:-europe-west2}"
# The address that runs the demo. Goes in config/admins and VITE_ADMIN_EMAILS.
ADMIN_EMAIL="${ADMIN_EMAIL:-andyboudier@googlemail.com}"
# The Vercel project to push the config to with --vercel.
VERCEL_PROJECT="${VERCEL_PROJECT:-poloact-demo}"
# ─────────────────────────────────────────────────────────────────────────

DRY=0; PUSH_VERCEL=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    --vercel)  PUSH_VERCEL=1 ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

FB="npx --yes firebase-tools@latest"
say()  { printf '\n\033[1m%s\033[0m\n' "$*"; }
note() { printf '  %s\n' "$*"; }
run()  { note "\$ $*"; [ "$DRY" = "1" ] || "$@"; }
pause_for() {
  [ "$DRY" = "1" ] && return 0
  printf '\n  Press return when that is done, or Ctrl-C to stop here. '
  read -r _
}

cd "$(dirname "$0")"
[ -f firestore.rules ] || { echo "Run this from poloact-demo (firestore.rules is missing)." >&2; exit 1; }

say "0. Signing in to Firebase"
if [ "$DRY" = "1" ]; then
  note "\$ $FB login"
elif $FB login:list 2>/dev/null | grep -qi "logged in"; then
  note "already signed in"
else
  $FB login
fi

say "1. The project"
if [ "$DRY" = "0" ] && $FB projects:list --json 2>/dev/null | grep -q "\"projectId\": \"$PROJECT_ID\""; then
  note "$PROJECT_ID exists — leaving it alone"
else
  run $FB projects:create "$PROJECT_ID" --display-name "$DISPLAY_NAME"
fi

say "2. Firestore"
# Older CLIs have no databases:create; the console makes the default database
# in two clicks, so fall back to asking rather than failing.
if [ "$DRY" = "1" ]; then
  note "\$ $FB firestore:databases:create '(default)' --location $LOCATION --project $PROJECT_ID"
elif $FB firestore:databases:list --project "$PROJECT_ID" 2>/dev/null | grep -q '(default)'; then
  note "the default database is already there"
elif ! $FB firestore:databases:create "(default)" --location "$LOCATION" --project "$PROJECT_ID"; then
  note "This CLI cannot create the database."
  note "Firebase console → Firestore Database → Create database → production mode → $LOCATION."
  pause_for
fi

say "3. The rules"
# firebase deploy needs a firebase.json saying where the rules live. Written
# here rather than committed, so the repo stays free of Firebase project files.
if [ ! -f firebase.json ]; then
  note "$([ "$DRY" = "1" ] && echo would\ write || echo writing) firebase.json (points at firestore.rules)"
  [ "$DRY" = "1" ] || cat > firebase.json <<'JSON'
{
  "firestore": {
    "rules": "firestore.rules"
  }
}
JSON
fi
run $FB deploy --only firestore:rules --project "$PROJECT_ID"

say "4. The admins document"
# The rules decide who may write by reading config/admins, and only an admin
# may create it — so nothing can be written until this exists. It is the one
# piece of data that has to come from outside the app.
ADMIN_LOWER="$(printf '%s' "$ADMIN_EMAIL" | tr '[:upper:]' '[:lower:]')"
DOC_URL="https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents/config/admins"
if [ "$DRY" = "1" ]; then
  note "\$ curl -X PATCH '$DOC_URL' … emails: [$ADMIN_LOWER]"
elif command -v gcloud >/dev/null 2>&1; then
  TOKEN="$(gcloud auth print-access-token 2>/dev/null || true)"
  if [ -n "$TOKEN" ]; then
    note "writing config/admins with $ADMIN_LOWER"
    curl -sS -X PATCH "$DOC_URL" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"fields\":{\"emails\":{\"arrayValue\":{\"values\":[{\"stringValue\":\"$ADMIN_LOWER\"}]}}}}" \
      >/dev/null
    note "done"
  else
    TOKEN=""
  fi
fi
if [ "$DRY" = "0" ] && [ -z "${TOKEN:-}" ]; then
  note "No gcloud token available, so do this one by hand:"
  note "Firebase console → Firestore → Data → Start collection 'config',"
  note "document id 'admins', field 'emails' (array) containing $ADMIN_LOWER."
  pause_for
fi

say "5. Sign-in methods — console only, no API for this"
note "Firebase console → Authentication → Sign-in method:"
note "  · Email/Password → Enable, and tick 'Email link (passwordless sign-in)'"
note "  · Google → Enable, pick a support email"
note "Authentication → Settings → Authorized domains → add demo.poloact.co.uk"
note "Apple comes later: a Services ID and key from Apple Developer, then"
note "set VITE_AUTH_APPLE=1. See the README."
pause_for

say "6. The web app, and its config"
if [ "$DRY" = "1" ]; then
  note "\$ $FB apps:create WEB '$DISPLAY_NAME' --project $PROJECT_ID"
  note "\$ $FB apps:sdkconfig WEB <appId> --project $PROJECT_ID --json"
else
  APP_ID="$($FB apps:list WEB --project "$PROJECT_ID" --json 2>/dev/null \
    | python3 -c 'import sys,json;d=json.load(sys.stdin);print((d.get("result") or [{}])[0].get("appId",""))' 2>/dev/null || true)"
  if [ -z "$APP_ID" ]; then
    $FB apps:create WEB "$DISPLAY_NAME" --project "$PROJECT_ID" >/dev/null
    APP_ID="$($FB apps:list WEB --project "$PROJECT_ID" --json \
      | python3 -c 'import sys,json;d=json.load(sys.stdin);print((d.get("result") or [{}])[0].get("appId",""))')"
  fi
  note "web app $APP_ID"
  $FB apps:sdkconfig WEB "$APP_ID" --project "$PROJECT_ID" --json \
    | python3 -c '
import sys, json
c = json.load(sys.stdin)["result"]["sdkConfig"]
pairs = [
    ("VITE_FIREBASE_API_KEY", c.get("apiKey", "")),
    ("VITE_FIREBASE_AUTH_DOMAIN", c.get("authDomain", "")),
    ("VITE_FIREBASE_PROJECT_ID", c.get("projectId", "")),
    ("VITE_FIREBASE_STORAGE_BUCKET", c.get("storageBucket", "")),
    ("VITE_FIREBASE_MESSAGING_SENDER_ID", c.get("messagingSenderId", "")),
    ("VITE_FIREBASE_APP_ID", c.get("appId", "")),
]
open(".env.local", "w").write("\n".join(f"{k}={v}" for k, v in pairs) + "\n")
print("\n".join(f"  {k}={v}" for k, v in pairs))
'
  echo "$ADMIN_LOWER" | awk '{print "VITE_ADMIN_EMAILS=" $0}' >> .env.local
  note 'written to .env.local — npm run dev now runs against the real project'
fi

say "7. Vercel"
if [ "$PUSH_VERCEL" = "0" ]; then
  note "Set the same values on the $VERCEL_PROJECT project, or re-run with --vercel."
  note "Vercel only applies environment variables to deployments built AFTER"
  note "they are set, so redeploy once they are in."
elif [ "$DRY" = "1" ]; then
  note "\$ vercel env add <NAME> production   (for each value, from .env.local)"
else
  command -v vercel >/dev/null 2>&1 || { echo "  The Vercel CLI is not installed (npm i -g vercel)." >&2; exit 1; }
  while IFS='=' read -r k v; do
    [ -n "$k" ] || continue
    for env in production preview; do
      printf '%s' "$v" | vercel env add "$k" "$env" --force >/dev/null 2>&1 \
        && note "$k → $env" || note "$k → $env (skipped; already set?)"
    done
  done < .env.local
  note "now redeploy: vercel --prod"
fi

say "Last step"
note "Open the demo, sign in as $ADMIN_LOWER, and press 'Reset demo' once to"
note "seed the sample club. If the bar says Firestore refused it, step 4 did"
note "not take — check config/admins names exactly that address."
