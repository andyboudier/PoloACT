import type { Metadata } from "next";
import PageShell from "../page-shell";

export const metadata: Metadata = {
  title: "How polo team draws work — balancing handicaps | PoloACT",
  description:
    "How a balanced polo team draw is built: handicaps evened in every chukka, rest gaps, availability windows and consistent shirt colours — explained by the club that automated it.",
  alternates: { canonical: "/how-polo-team-draws-work" },
  openGraph: {
    title: "How polo team draws work",
    description:
      "Balancing handicaps chukka by chukka, rest gaps, availability and shirt colours — the maths behind a fair draw.",
    type: "article",
  },
};

export default function HowDrawsWork() {
  return (
    <PageShell
      eyebrow="Explainer"
      title="How polo team draws work"
      standfirst={
        <>
          A good draw looks effortless and takes an hour to build by hand. Here is what a club captain is
          actually solving on a Wednesday afternoon &mdash; and why it is harder than splitting a list in
          two.
        </>
      }
    >
      <h2>First, the vocabulary</h2>
      <p>
        A <strong>chukka</strong> is a period of play, roughly seven minutes. A club practice session is
        measured in chukkas rather than matches. Every player carries a{" "}
        <strong>handicap</strong> &mdash; a rating from about &minus;2 for a beginner up to +10 for the
        best in the world. Club players in the UK are typically somewhere between &minus;2 and +2, and
        higher is better. The <strong>draw</strong> is the allocation of players to chukkas and to teams,
        usually two: Blue and White.
      </p>

      <h2>The actual problem</h2>
      <p>
        Suppose fourteen members sign up for a six-chukka evening. Four can only play early. One is a
        beginner on &minus;1. Two have asked not to play consecutive chukkas. Everybody wants roughly
        the number of chukkas they signed up for. The captain must produce six chukkas of four-a-side
        polo where <em>each individual chukka</em> is a fair contest.
      </p>
      <p>
        That last point is the one people miss. It is not enough for the two teams to have equal total
        handicap across the evening &mdash; if the +2 players all land in chukkas one and two, those
        chukkas are a mismatch and the later ones are flat. The balance has to hold chukka by chukka.
      </p>

      <h2>What a balanced draw has to honour</h2>
      <ul>
        <li>
          <strong>Handicap balance per chukka.</strong> Team totals should be as close as possible in
          every chukka, not just in aggregate. A lopsided chukka should be re-evened rather than
          accepted.
        </li>
        <li>
          <strong>Chukka counts.</strong> Everyone gets close to the number of chukkas they asked for
          &mdash; the fairness people actually notice.
        </li>
        <li>
          <strong>Rest gaps.</strong> Chukkas are hard on both player and pony. Allocations should be
          spread across the session rather than stacked.
        </li>
        <li>
          <strong>Availability windows.</strong> Someone arriving at 18:30 cannot be drawn into the
          first chukka, however neatly it balances.
        </li>
        <li>
          <strong>No-consecutive requests.</strong> Some players, and anyone with one pony, need a break
          between chukkas.
        </li>
        <li>
          <strong>Consistent shirt colours.</strong> A player who is Blue in chukka one should stay Blue
          all evening &mdash; otherwise nobody on the sideline can follow the game.
        </li>
        <li>
          <strong>Eligibility.</strong> A beginners&rsquo; instructional session is for beginners; an
          open day is for everyone. The draw should respect the day&rsquo;s rules.
        </li>
      </ul>

      <h2>Why it is genuinely hard</h2>
      <p>
        These constraints pull against each other. Perfect handicap balance might demand that a player
        plays three chukkas in a row. Honouring every availability window might leave one team a goal
        light in chukka four. There is rarely a solution that satisfies everything, so the real task is
        finding the best compromise &mdash; and then, when two people drop out an hour before throw-in,
        finding it again.
      </p>
      <p>
        Done on paper, that is why the draw eats an evening, and why it so often gets finished in the
        car park.
      </p>

      <h2>How PoloACT automates it</h2>
      <p>
        PoloACT collects sign-ups through the week with each player&rsquo;s handicap, requested chukkas,
        availability and preferences already attached. When the captain generates the draw, it allocates
        players to chukkas and teams while balancing handicaps in every chukka, spreading rest gaps,
        respecting availability and no-consecutive requests, and holding shirt colours steady. It takes
        seconds, and it can be re-run the moment the numbers change.
      </p>
      <p>
        The finished draw goes straight to the club WhatsApp group as a team sheet or a branded image
        &mdash; so the version in everyone&rsquo;s pocket is the current one.
      </p>
      <p>
        See <a href="/features">the full feature list</a>, or read our{" "}
        <a href="/polo-club-software">guide to choosing polo club software</a>.
      </p>
    </PageShell>
  );
}
