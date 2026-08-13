import type { Metadata } from "next";
import PageShell from "../page-shell";

export const metadata: Metadata = {
  title: "Polo club software: how to choose the right system | PoloACT",
  description:
    "What to look for in polo club management software — bookings, balanced team draws, tournaments, live scoring and member apps — and the questions to ask before you commit.",
  alternates: { canonical: "/polo-club-software" },
  openGraph: {
    title: "How to choose polo club management software",
    description:
      "The features that matter, the questions to ask, and how to run a fair trial before committing your club.",
    type: "website",
  },
};

const faq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is polo club management software?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Polo club management software handles the administration a club runs on: members signing up for chukka sessions, building balanced team draws, managing tournament fixtures and programmes, recording live scores, and giving members an app for fixtures and results. The goal is to replace spreadsheets, group chats and paper team sheets with one system.",
      },
    },
    {
      "@type": "Question",
      name: "How does an automatic polo team draw work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An automatic draw takes the confirmed players and their handicaps and allocates them to chukkas and to two teams, balancing total team handicap in each chukka. A good draw also spreads each player's chukkas with rest gaps, honours availability windows and no-consecutive-chukka requests, and keeps players in a consistent shirt colour through the session.",
      },
    },
    {
      "@type": "Question",
      name: "What are the alternatives to PoloACT?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Other polo software includes Polo Connect, Lineup Polo, ChukkerApp and general club-management platforms such as PlayPass. They differ in emphasis: some focus on tournaments and fixtures, others on the player network. The right choice depends on whether your club's biggest job is the weekly chukka draw, running tournaments, or member administration — so trial against your own fixtures before committing.",
      },
    },
    {
      "@type": "Question",
      name: "How much does polo club software cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing is usually per club rather than per member, and often scaled to the size of the club and the length of the season. Ask whether tournaments, programme generation and the member app are included or charged separately, and whether there is a setup fee for loading members and branding.",
      },
    },
  ],
};

export default function PoloClubSoftware() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <PageShell
        eyebrow="Guide"
        title="How to choose polo club software"
        standfirst={
          <>
            Polo is a small sport with particular problems, and general sports-club software rarely
            solves them. Here is what actually matters when a club is choosing a system &mdash; and how
            to test it honestly before you commit a season to it.
          </>
        }
      >
        <h2>Start with your club&rsquo;s biggest job</h2>
        <p>
          Every club has one task that eats the most committee time. For most, it is the weekly chukka
          draw: collecting who is playing, then balancing handicaps across teams and chukkas without
          leaving anyone sitting out three in a row. For others it is the tournament &mdash; fixtures,
          officials, programmes and prizegivings. For a few it is simply knowing who has paid.
        </p>
        <p>
          Software that is excellent at fixtures can still be weak at the weekly draw, and vice versa.
          Decide which job you are buying to solve before you look at feature lists, or you will be
          persuaded by the wrong strengths.
        </p>

        <h2>The features that matter in polo specifically</h2>
        <ul>
          <li>
            <strong>Handicap-aware draws.</strong> Polo is played off handicap, so a draw that only
            splits players evenly by number is no use. Ask whether teams are balanced in{" "}
            <em>every chukka</em> or only in total.
          </li>
          <li>
            <strong>Per-day rules.</strong> Clubs run ladies&rsquo; chukkas, beginners&rsquo;
            instructional sessions and open days with different eligibility. The system should enforce
            those at sign-up rather than leaving the captain to police them.
          </li>
          <li>
            <strong>Rest gaps and availability.</strong> Players arrive late, leave early, and cannot
            play four consecutive chukkas. A draw that ignores this gets rewritten by hand &mdash; which
            defeats the point.
          </li>
          <li>
            <strong>Programmes and officials.</strong> If you run tournaments, check whether print-ready
            programmes are generated from the fixture data you have already entered, including umpires,
            goal judges and HPA handicap head-starts.
          </li>
          <li>
            <strong>Something members actually open.</strong> Fixtures, draws and results need to reach
            members where they are &mdash; an app or a browser link, not a PDF attached to an email.
          </li>
          <li>
            <strong>Your club&rsquo;s identity.</strong> Crest, colours and ground names should be
            yours. White-labelling matters more in a heritage sport than software vendors expect.
          </li>
        </ul>

        <h2>What else is out there</h2>
        <p>
          PoloACT is not the only option, and a good decision means looking at a few. Other polo-specific
          products include{" "}
          <a href="https://poloconnect.io" target="_blank" rel="noopener noreferrer">Polo Connect</a>,{" "}
          <a href="https://www.lineuppolo.com" target="_blank" rel="noopener noreferrer">Lineup Polo</a>{" "}
          and ChukkerApp, and there are general club-management platforms such as PlayPass and Clubspark
          that some clubs adapt. They put their weight in different places &mdash; some on the player
          network and international handicaps, some on tournament planning, some on generic bookings.
        </p>
        <p>
          Rather than trusting anyone&rsquo;s comparison table (including ours), run the test below on
          any system you are considering.
        </p>

        <h2>A fair one-hour trial</h2>
        <p>Take a real session from last season and put it through the software:</p>
        <ol>
          <li>Enter the actual players and handicaps who turned up.</li>
          <li>Add the real constraints &mdash; two who could only play early, one who cannot play consecutive chukkas, a beginner who should not be on an open day.</li>
          <li>Generate the draw and check every chukka&rsquo;s handicap balance by hand.</li>
          <li>Count how many manual corrections you had to make. That number is your real answer.</li>
          <li>Then share the draw the way you actually share it &mdash; to the club WhatsApp group &mdash; and see whether it arrives readable.</li>
        </ol>

        <h2>Questions worth asking any vendor</h2>
        <ul>
          <li>Is pricing per club or per member, and what happens as we grow?</li>
          <li>Who loads our members, ponies, grounds and branding &mdash; and is that included?</li>
          <li>Can members use it without installing an app?</li>
          <li>Where is our data held, and can we export it if we leave?</li>
          <li>Who do we contact mid-season when something breaks on a Wednesday evening?</li>
        </ul>

        <h2>Where PoloACT sits</h2>
        <p>
          PoloACT was built inside Tedworth Park Polo Club and shaped by a real Wednesday evening: the
          weekly draw is the thing it does best, with tournaments, programmes, live scoring and a
          members&rsquo; shop around it. It is white-labelled per club and runs on iPhone, Android and
          any browser. See the <a href="/features">full feature list</a>, read{" "}
          <a href="/how-polo-team-draws-work">how the balanced draw works</a>, or{" "}
          <a href="/#demo">book a 30-minute walkthrough</a> on your own fixtures.
        </p>
      </PageShell>
    </>
  );
}
