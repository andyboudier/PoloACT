import type { Metadata } from "next";
import PageShell from "../page-shell";

export const metadata: Metadata = {
  title: "Features — Polo club management software | PoloACT",
  description:
    "Chukka bookings, automatic balanced team draws, tournament management, live scoring, programme PDFs and a members' shop — every feature in PoloACT.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "PoloACT features — everything a polo club runs on",
    description:
      "Chukka bookings, automatic team draws, tournaments, live scoring, programme PDFs and a members' shop.",
    type: "website",
  },
};

export default function Features() {
  return (
    <PageShell
      eyebrow="Features"
      title="Everything a polo club runs on, in one app."
      standfirst={
        <>
          PoloACT is polo club management software built inside a working club. Bookings, draws,
          tournaments, scoring and members &mdash; joined up, so more of the week goes to polo.
        </>
      }
    >
      <h2>Chukka booking</h2>
      <p>
        Members sign up to play, day by day. Each sign-up captures handicap, number of chukkas,
        availability window, pony hire and an optional &ldquo;no consecutive chukkas&rdquo; preference.
        Every session day carries its own rules &mdash; ladies&rsquo; chukkas, beginners&rsquo;
        instructional, open to all handicaps &mdash; and PoloACT enforces them at sign-up, so a player
        above the handicap limit is politely redirected rather than quietly breaking the draw. Sign-ups
        close automatically ahead of each session, so the captain is never chasing late entries.
      </p>

      <h2>Automatic balanced team draws</h2>
      <p>
        The team draw is the job that eats a captain&rsquo;s evening, and it is the reason PoloACT
        exists. Tell it who is playing and it produces a balanced Blue v White draw in seconds. The
        algorithm evens total team handicap in <em>every</em> chukka rather than just across the
        session, spreads each player&rsquo;s chukkas with sensible rest gaps, honours availability
        windows and no-consecutive requests, and keeps every player in a consistent shirt colour
        throughout. The captain can still set the ground and adjust the throw-in time, and re-draw with
        one tap if numbers change.
      </p>
      <p>
        The finished draw shares straight to the club WhatsApp group as a team sheet, a plain-text
        table, an Excel file or a branded image.
      </p>

      <h2>Tournaments &amp; fixtures</h2>
      <p>
        A season fixtures list with real match detail behind each entry: multiple days, two teams of up
        to five a side, scores, umpires, goal judges, a timekeeper, chukka counts, up to three
        prizegivings per day, the ground, and who is holding the trophy. Fixtures can be merged and
        consolidated as the season takes shape.
      </p>

      <h2>Programme PDFs</h2>
      <p>
        Print-ready tournament programmes, generated from the fixtures you have already entered: a crest
        cover, a day-by-day running order with teams and officials, an optional results summary with
        winners highlighted, and a rules page carrying your tournament committee and HPA handicap
        head-start calculations &mdash; all set in your club&rsquo;s own fonts and colours.
      </p>

      <h2>Live scoring</h2>
      <p>
        Scores are entered live, team by team and player by player, and synced in real time. Members and
        spectators follow the match from wherever they are, and the app keeps you on the live game even
        if it reloads mid-chukka.
      </p>

      <h2>Member app &amp; club shop</h2>
      <p>
        Fixtures, draws and results sit in every member&rsquo;s pocket &mdash; on iPhone, Android or any
        browser, with nothing to install if they prefer the web. The members&rsquo; shop adds discounts
        across our partner retailers, so membership pays members back and the club earns on every
        basket. Management tools sit behind a PIN-protected captain mode; ordinary members get a clean
        booking-and-results experience.
      </p>

      <h2>White-labelled to your club</h2>
      <p>
        Your crest, your colours, your grounds and your session rules. PoloACT was built with Tedworth
        Park Polo Club and is set up per club, so it arrives looking like your club rather than someone
        else&rsquo;s.
      </p>

      <h2>How clubs get started</h2>
      <p>
        Most clubs are running inside a fortnight: we load your members, teams, ponies, grounds and
        branding; configure your session days and rules; get the app to your members; and hand back the
        committee hours that used to go on spreadsheets and group chats. See{" "}
        <a href="/how-polo-team-draws-work">how the balanced draw works</a>, or read the{" "}
        <a href="/polo-club-software">guide to choosing polo club software</a>.
      </p>
    </PageShell>
  );
}
