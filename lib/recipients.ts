// Which office an app's mail goes to.
//
// Every app — the three clubs and the demo — sends through the same route
// here; the only thing that differs is the recipient. The apps say who they
// are (`clubId`), never where to send: an address taken from the request
// would make this an open relay anyone could mail through.
//
// Environment:
//   CLUB_RECIPIENTS   the map, as "id:email" pairs separated by commas or
//                     newlines. Ids are the apps' own: tppc, druids, vaux,
//                     demo. For example
//                       tppc:info@tedworthparkpolo.com,
//                       druids:office@druidslodgepolo.com,
//                       vaux:office@vauxpolo.com,
//                       demo:hello@poloact.co.uk
//   ENTRY_RECIPIENT   where an unrecognised or missing id goes; falls back to
//                     DEMO_RECIPIENT, then to the Graph sender's own mailbox.
//
// Adding a club is one more pair in CLUB_RECIPIENTS and a redeploy — no code.

const parse = (raw: string): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const pair of raw.split(/[,\n]/)) {
    const at = pair.indexOf(":");
    if (at < 1) continue;
    const id = pair.slice(0, at).trim().toLowerCase();
    const email = pair.slice(at + 1).trim();
    if (id && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) out[id] = email;
  }
  return out;
};

export const clubRecipients = (): Record<string, string> =>
  parse(process.env.CLUB_RECIPIENTS || "");

export const defaultRecipient = (): string =>
  process.env.ENTRY_RECIPIENT || process.env.DEMO_RECIPIENT || process.env.DEMO_SENDER_UPN || "";

// The office for this club, or the default when the id is unknown — so a new
// app still reaches someone rather than failing silently.
export function recipientFor(clubId: unknown): { to: string; matched: boolean } {
  const id = String(clubId || "").trim().toLowerCase();
  const to = id ? clubRecipients()[id] : undefined;
  return to ? { to, matched: true } : { to: defaultRecipient(), matched: false };
}
