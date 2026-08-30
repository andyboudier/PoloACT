// The sample club the demo is populated with.
//
// Everything here is invented. Names are ordinary-sounding but fictional, and
// the only contact details are the demo's own address — nothing in this file
// belongs to a real person or a real club.
//
// Dates are computed relative to whenever the demo is opened, so it never looks
// stale: the roster is always for this week's sessions and the fixtures always
// straddle today.

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// The next date falling on `dow` (0 Sun … 6 Sat), today included.
const nextDow = (dow) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + ((dow - d.getDay() + 7) % 7));
  return d;
};
const addDays = (d, n) => { const c = new Date(d); c.setDate(c.getDate() + n); return c; };
const longDate = (d) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const shortDate = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });

const player = (id, name, handicap, chukkas, extra = {}) => ({
  id, name, handicap, chukkas,
  availableFrom: '', availableTo: '', vip: false, noConsecutive: false, ponyHire: false,
  ...extra,
});

// A Wednesday roster with a spread of handicaps, so the draw has something
// interesting to balance.
const WED = [
  player(1001, 'Harriet Vane', 2, 3),
  player(1002, 'Tom Fenwick', 1, 3),
  player(1003, 'Priya Raman', 0, 2),
  player(1004, 'James Ackroyd', -1, 3, { ponyHire: true }),
  player(1005, 'Clare Ogilvy', 1, 2),
  player(1006, 'Sam Whitfield', 0, 3),
  player(1007, 'Nick Barlow', -1, 2, { noConsecutive: true }),
  player(1008, 'Rosie Calder', 2, 3),
  player(1009, 'Ed Mainwaring', 0, 2, { ponyHire: true }),
  player(1010, 'Anna Delacroix', 1, 3),
];

// Thursday is the capped ladies session — seeded one short of full so a visitor
// can add themselves and watch it fill, then see the waiting list appear.
const THU = [
  player(2001, 'Clare Ogilvy', 1, 2),
  player(2002, 'Rosie Calder', 2, 2),
  player(2003, 'Priya Raman', 0, 2),
  player(2004, 'Anna Delacroix', 1, 2),
  player(2005, 'Harriet Vane', 2, 2, { ponyHire: true }),
];

const SAT = [
  player(3001, 'Tom Fenwick', 1, 4),
  player(3002, 'James Ackroyd', -1, 4),
  player(3003, 'Sam Whitfield', 0, 4),
  player(3004, 'Ed Mainwaring', 0, 3),
  player(3005, 'Harriet Vane', 2, 4),
  player(3006, 'Nick Barlow', -1, 3),
  player(3007, 'Rosie Calder', 2, 4),
  player(3008, 'Marcus Vane', 1, 4, { ponyHire: true }),
];

// Friday is instructional — beginners only, so every handicap here is 0 or below.
const FRI = [
  player(4001, 'Nick Barlow', -1, 2),
  player(4002, 'James Ackroyd', -1, 2, { ponyHire: true }),
  player(4003, 'Priya Raman', 0, 2),
  player(4004, 'Ed Mainwaring', 0, 2),
];

const SUN = [
  player(5001, 'Rosie Calder', 2, 3),
  player(5002, 'Anna Delacroix', 1, 3),
  player(5003, 'Sam Whitfield', 0, 3),
  player(5004, 'Marcus Vane', 1, 3),
  player(5005, 'Clare Ogilvy', 1, 2, { ponyHire: true }),
  player(5006, 'Tom Fenwick', 1, 3),
  player(5007, 'Harriet Vane', 2, 2),
  player(5008, 'Nick Barlow', -1, 2, { noConsecutive: true }),
];

// The members directory the sign-up form autocompletes from.
const directory = () => {
  const all = [...WED, ...THU, ...FRI, ...SAT, ...SUN];
  const out = {};
  for (const p of all) {
    const key = p.name.trim().toLowerCase();
    if (out[key]) continue;
    out[key] = {
      name: p.name, handicap: p.handicap, mobile: '', availableFrom: '', availableTo: '',
      vip: false, noConsecutive: false, lastUsed: Date.now(),
    };
  }
  return out;
};

// Two fixtures either side of today, so the list shows both a finished one and
// one still to come.
const buildFixtures = () => {
  const satThis = nextDow(6);
  const past = addDays(satThis, -14);
  const soon = addDays(satThis, 7);
  return {
    fixtures: [
      {
        id: 'demo-past', month: past.toLocaleDateString('en-GB', { month: 'long' }),
        date: `${shortDate(past)} & ${shortDate(addDays(past, 1))}`,
        name: 'The Meadow Cup', level: '4 Goal', titleLines: [], detailsPublished: true,
      },
      {
        id: 'demo-next', month: soon.toLocaleDateString('en-GB', { month: 'long' }),
        date: `${shortDate(soon)} & ${shortDate(addDays(soon, 1))}`,
        name: 'The PoloACT Trophy', level: '2 Goal', titleLines: [], detailsPublished: true,
      },
    ],
    details: {
      'demo-next': {
        days: [{
          id: 'demo-day-1',
          dateLabel: longDate(soon),
          ground: 'Number One Ground',
          matches: [
            {
              id: 'demo-m1', time: '11:00', label: 'Semi-final', chukkas: 4, division: '',
              teamA: { name: 'The Kestrels', handicap: 2, players: [
                { name: 'Harriet Vane', handicap: 2 }, { name: 'Tom Fenwick', handicap: 1 },
                { name: 'Priya Raman', handicap: 0 }, { name: 'Nick Barlow', handicap: -1 }] },
              teamB: { name: 'Longacre', handicap: 2, players: [
                { name: 'Rosie Calder', handicap: 2 }, { name: 'Clare Ogilvy', handicap: 1 },
                { name: 'Sam Whitfield', handicap: 0 }, { name: 'James Ackroyd', handicap: -1 }] },
            },
            {
              id: 'demo-m2', time: '12:30', label: 'Final', chukkas: 4, division: '',
              teamA: { name: 'Winner Semi-final', handicap: null, players: [] },
              teamB: { name: 'Mill House', handicap: 2, players: [
                { name: 'Anna Delacroix', handicap: 1 }, { name: 'Ed Mainwaring', handicap: 0 },
                { name: 'Marcus Vane', handicap: 1 }, { name: 'Sam Whitfield', handicap: 0 }] },
            },
          ],
          prizegiving: '16:00 — prizegiving and tea on the lawn',
        }],
      },
    },
  };
};

// storageKey() in the app: bare key for Wednesday, suffixed for every other day.
const key = (base, day) => (day === 'wed' ? base : `${base}-${day}`);

export function buildDemoData() {
  const { fixtures, details } = buildFixtures();
  const data = {
    // Every day the app has, so the demo always opens on a populated roster
    // whatever weekday the visitor arrives on.
    [key('roster', 'wed')]: JSON.stringify(WED),
    [key('roster', 'thu')]: JSON.stringify(THU),
    [key('roster', 'fri')]: JSON.stringify(FRI),
    [key('roster', 'sat')]: JSON.stringify(SAT),
    [key('roster', 'sun')]: JSON.stringify(SUN),
    // Stamped with the session each roster is for, so the app's weekly
    // auto-clear leaves them alone.
    [key('roster-week', 'wed')]: iso(nextDow(3)),
    [key('roster-week', 'thu')]: iso(nextDow(4)),
    [key('roster-week', 'fri')]: iso(nextDow(5)),
    [key('roster-week', 'sat')]: iso(nextDow(6)),
    [key('roster-week', 'sun')]: iso(nextDow(0)),
    // A demo where you arrive after the deadline and cannot sign up is a poor
    // demo. Rather than special-case anything, use the captain's own "open
    // sign-ups anyway" override, stamped with each session's date exactly as
    // the app does — so every day is open to try, and the override still
    // behaves like the real feature.
    [key('booking-open', 'wed')]: iso(nextDow(3)),
    [key('booking-open', 'thu')]: iso(nextDow(4)),
    [key('booking-open', 'fri')]: iso(nextDow(5)),
    [key('booking-open', 'sat')]: iso(nextDow(6)),
    [key('booking-open', 'sun')]: iso(nextDow(0)),
    [key('ground', 'thu')]: 'Arena',
    [key('ground', 'fri')]: 'Arena',
    [key('ground', 'sat')]: 'Number One Ground',
    [key('ground', 'sun')]: 'Number One Ground',
    members: JSON.stringify(directory()),
    fixtures: JSON.stringify(fixtures),
    'fixture-details': JSON.stringify(details),
    committee: JSON.stringify(['R. Calder', 'T. Fenwick', 'P. Raman', 'S. Whitfield']),
  };
  return data;
}
