// The clubs the hub opens. Adding a club is a one-line change here — the grid,
// the frame and the back handling all read from this list.
//
// `url` is loaded full-screen inside the hub rather than handed off to a
// separately installed app, so PoloACT is one download that covers every club.
export const CLUBS = [
  {
    key: 'tppc',
    name: 'Tedworth Park',
    short: 'TPPC',
    blurb: 'Home of Services Polo',
    url: 'https://tppc.poloact.co.uk/',
    icon: '/clubs/tppc.png',
  },
  {
    key: 'druids',
    name: 'Druids Lodge',
    short: 'Druids',
    blurb: 'Salisbury, Wiltshire',
    url: 'https://druids.poloact.co.uk/',
    icon: '/clubs/druids.png',
  },
  {
    key: 'vaux',
    name: 'Vaux Park',
    short: 'Vaux',
    blurb: 'Vaux Park Polo Club',
    url: 'https://vaux.poloact.co.uk/',
    icon: '/clubs/vaux.png',
  },
  {
    key: 'demo',
    name: 'PoloACT Demo',
    short: 'Demo',
    blurb: 'Try it with sample players',
    url: 'https://demo.poloact.co.uk/',
    icon: '/poloact-mark.svg',
    demo: true,
  },
];
