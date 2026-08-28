import type { Metadata } from "next";
import PageShell from "../page-shell";

export const metadata: Metadata = {
  title: "Polo tournament management software | PoloACT",
  description:
    "Run polo tournaments end to end: fixtures, officials, print-ready programmes with HPA handicap head-starts, live scoring and prizegivings — from one system built inside a working polo club.",
  alternates: { canonical: "/polo-tournament-software" },
  openGraph: {
    title: "Polo tournament management software",
    description:
      "Fixtures, officials, print-ready programmes, live scoring and prizegivings — the whole tournament in one place.",
    type: "website",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "PoloACT", item: "https://poloact.co.uk" },
        { "@type": "ListItem", position: 2, name: "Polo tournament software", item: "https://poloact.co.uk/polo-tournament-software" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does polo tournament management software do?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It holds the whole tournament in one place: the fixture list and match details, the teams and up to five players each, officials (umpires, goal judges, timekeeper), chukka counts, prizegivings and the trophy custodian. From that data it generates print-ready programmes with HPA handicap head-starts, records live scores that sync in real time, and publishes fixtures and results to a member app.",
          },
        },
        {
          "@type": "Question",
          name: "Can it produce printed tournament programmes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. PoloACT builds professional programme PDFs from the fixture data you have already entered — a cover page with your crest and dates, a day-by-day running order with teams, players and officials, an optional results summary, and a rules page with your tournament committee and HPA handicap calculations, set in your club's fonts and colours.",
          },
        },
        {
          "@type": "Question",
          name: "Does live scoring work during matches?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Team scores and per-player goals are entered live and synced in real time, so anyone with the app can follow along. It is built to keep you on the live game even if the app reloads mid-match.",
          },
        },
      ],
    },
  ],
};

export default function PoloTournamentSoftware() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageShell
        eyebrow="Tournaments"
        title="Polo tournament management software"
        standfirst={
          <>
            A polo tournament is a logistics exercise wearing a blazer: fixtures, teams, officials,
            programmes, scores and prizegivings, usually run off a clipboard and three group chats.
            PoloACT holds all of it in one place &mdash; and turns the data you already keep into the
            programme and the live scoreboard.
          </>
        }
      >
        <h2>The whole tournament, from one fixture list</h2>
        <p>
          You enter each fixture once: the days, the matches, the two teams with up to five players
          each, chukka counts, umpires, goal judges, timekeeper, up to three prizegivings a day, the
          ground and the trophy custodian. Everything downstream &mdash; the programme, the running
          order, the live scoreboard, the results &mdash; is generated from that single source, so
          nothing is re-typed and nothing drifts out of sync.
        </p>

        <h2>Print-ready programmes, generated not typeset</h2>
        <p>
          The night before a tournament should not be spent in a word processor. PoloACT produces
          professional programme PDFs straight from your fixtures:
        </p>
        <ul>
          <li><strong>A cover page</strong> with your club crest, the tournament name and dates.</li>
          <li><strong>A day-by-day running order</strong> with teams, players and match officials.</li>
          <li><strong>An optional results summary</strong> with winners highlighted.</li>
          <li><strong>A rules page</strong> carrying your editable tournament committee and HPA rules.</li>
          <li><strong>HPA handicap head-starts</strong> calculated automatically and set in your club&rsquo;s fonts and colours.</li>
        </ul>

        <h2>Live scoring that spectators can follow</h2>
        <p>
          During matches, team scores and per-player goals are entered live and synced in real time, so
          members and spectators can follow along from the app. It is designed to stay on the live game
          even if a phone reloads mid-match &mdash; the moment you least want to lose the score.
        </p>

        <h2>Fixtures that reach your members</h2>
        <p>
          A season fixtures list, match details and results publish to an app members actually open, on
          iPhone, Android or any browser &mdash; not a PDF buried in an email. Fixtures can be merged and
          consolidated, and programme details can be imported from JSON when you are migrating an
          existing season.
        </p>

        <h2>Built inside a working club</h2>
        <p>
          PoloACT was shaped by real tournaments at Tedworth Park Polo Club, where the same people who
          run the draw run the prizegiving. That is why the tournament tools assume a committee doing ten
          jobs at once, not a full-time administrator. See the{" "}
          <a href="/features">full feature list</a>, read{" "}
          <a href="/how-polo-team-draws-work">how the balanced team draw works</a>, compare your options
          in <a href="/polo-club-software">choosing polo club software</a>, or{" "}
          <a href="/#demo">book a 30-minute walkthrough</a> on your own fixtures.
        </p>
      </PageShell>
    </>
  );
}
