#!/usr/bin/env node
// Re-derive the demo from the TPPC app.
//
// The demo is the TPPC app with a different palette and a different name, run
// against the visitor's browser instead of Firestore. It has no changes of its
// own to the app's behaviour, so keeping it current is a copy plus a rebrand
// rather than a merge — run this whenever TPPC gains something the demo should
// show.
//
//   node resync-from-tppc.mjs /path/to/tppc/polo-chukkas-deploy
//
// Files that ARE the demo — storage.js, demoSeed.js, DemoChrome.jsx, main.jsx,
// index.html, vite.config.js — are never touched.

import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const tppc = process.argv[2];
if (!tppc) {
  console.error('usage: node resync-from-tppc.mjs /path/to/tppc/polo-chukkas-deploy');
  process.exit(1);
}
const from = join(tppc, 'src');
const to = new URL('./src/', import.meta.url).pathname;

// Shared with TPPC verbatim.
const SHARED = [
  'PoloChukkas.jsx', 'tournamentPdf.js', 'pdfShared.js', 'pdfFonts.js',
  'FixtureBoard.jsx', 'ChukkaBoard.jsx', 'liveScoreActivity.js',
  'handicap.js', 'stageMode.js',
];
for (const f of SHARED) {
  const src = join(from, f);
  if (!existsSync(src)) { console.warn(`  skipped (not in TPPC): ${f}`); continue; }
  copyFileSync(src, join(to, f));
}
console.log(`copied ${SHARED.length} shared source files`);

// ── Rebrand ────────────────────────────────────────────────────────────
const p = join(to, 'PoloChukkas.jsx');
let s = readFileSync(p, 'utf8');
const fail = [];
const sub = (old, next, label) => {
  const n = s.split(old).length - 1;
  if (n !== 1) { fail.push(`${label}: ${n} matches`); return; }
  s = s.replace(old, next);
};

// PoloACT house colours in place of TPPC's. The variable NAMES are the club
// apps' and deliberately unchanged, so the whole app is rebranded by this block
// alone — "burgundy" here means "the club's primary", not the hue.
sub(`          --burgundy: #6b1f2a;
          --burgundy-deep: #4a1419;
          --burgundy-soft: #8a2f3a;
          --cream: #f4ecd8;
          --cream-warm: #e9dec3;
          --cream-pale: #faf5e6;
          --gold: #b8924a;
          --gold-bright: #d4a85a;
          --ink: #1c1612;
          --muted: #6b5e4e;
          --line: #d4c8a8;`,
`          --burgundy: #1f3d2b;
          --burgundy-deep: #14291d;
          --burgundy-soft: #2c5540;
          --cream: #f3ede1;
          --cream-warm: #e8e0cf;
          --cream-pale: #fbf9f4;
          --gold: #a97f45;
          --gold-bright: #c6a468;
          --ink: #1a241c;
          --muted: #6b6456;
          --line: #e0d8c4;`, 'palette');

sub("  const CONTACT_EMAIL = 'info@tedworthparkpolo.com';",
    "  const CONTACT_EMAIL = 'hello@poloact.co.uk';", 'contact email');

sub(`              Est. 1907
            </div>`, `              A PoloACT demo club
            </div>`, 'header eyebrow');
sub(`              Tedworth Park
            </h1>`, `              PoloACT
            </h1>`, 'header title');
sub(`              Polo Club
            </div>`, `              Demo Polo Club
            </div>`, 'header subtitle');
sub(`              Home of Military Polo
            </div>`, `              Everything here is made up
            </div>`, 'header strapline');

const clubs = s.split('Tedworth Park Polo Club').length - 1;
s = s.split('Tedworth Park Polo Club').join('PoloACT Demo Polo Club');
const files = s.split('TPPC-chukkas-').length - 1;
s = s.split('TPPC-chukkas-').join('poloact-demo-chukkas-');

if (fail.length) {
  console.error('\nrebrand failed — TPPC has moved and these anchors need updating:');
  for (const f of fail) console.error('  -', f);
  process.exit(1);
}
writeFileSync(p, s);
console.log(`rebranded: palette, contact, header, ${clubs} club names, ${files} download prefixes`);
console.log('\nleft alone: storage.js, demoSeed.js, DemoChrome.jsx, main.jsx, index.html, vite.config.js');
