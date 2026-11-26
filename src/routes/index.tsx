import { createFileRoute, Link } from "@tanstack/react-router";
import { CloudRain, Compass, Hourglass, PawPrint, Sprout, Timer } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/shell/Button";
import { Card } from "@/components/shell/Card";
import { Container } from "@/components/shell/Container";
import { SectionHeading } from "@/components/shell/SectionHeading";
import { visibleGuides } from "@/content/guides";
import { pageHead } from "@/lib/seo";
import { site, offer } from "@/config/site";
import { freeLibrary } from "@/passport/content";
import { PhotoFilterExamples } from "@/components/site/PhotoFilterExamples";
import { summaryText, usePremiumSummary } from "@/lib/premium-summary";

/** Real photo-filter example images go here (paths under public/, e.g. "/examples/filter-1.jpg"). Empty hides the slot. */
const FILTER_EXAMPLES: readonly string[] = [];

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: `The Adventure Passport | ${site.name}`,
      description:
        "Little adventures for you and your dog. Free to start, no account needed. Pick a mystery card, do it together, collect it and make a photo filter.",
      path: "/",
    }),
  component: Home,
});

const collections: { name: string; blurb: string; icon: ReactNode }[] = [
  { name: "Five-Minute Moments", blurb: "Tiny rituals for a busy day.", icon: <Timer size={22} /> },
  {
    name: "Rainy Day Club",
    blurb: "Indoor games for gray weather.",
    icon: <CloudRain size={22} />,
  },
  { name: "Road Trip Adventures", blurb: "Stops worth the detour.", icon: <Compass size={22} /> },
  {
    name: "The Golden Years",
    blurb: "Gentle outings at a slower pace.",
    icon: <Hourglass size={22} />,
  },
  {
    name: "Puppy's First Chapter",
    blurb: "First times worth remembering.",
    icon: <Sprout size={22} />,
  },
];

const faqs = [
  {
    q: "Is it really free to try?",
    a: "Yes. You can find an adventure and flip your first card without paying and without creating an account.",
  },
  {
    q: "Do I need an account?",
    a: "No. There are no accounts. If you buy the full Passport, you get an access code you can use to restore it on another device.",
  },
  {
    q: "What does the full Passport cost?",
    a: `${offer.price}, ${offer.pricing}. Start free first.`,
  },
  {
    q: "Is it just for puppies or active dogs?",
    a: "No. Collections range from five-minute moments to gentle outings for older dogs.",
  },
];

function Stamp({ label, state }: { label: string; state: "earned" | "empty" }) {
  return (
    <div className={`pp-stamp is-${state}`}>
      <div>
        <PawPrint aria-hidden="true" />
        {label}
      </div>
    </div>
  );
}

function Home() {
  const guides = visibleGuides().slice(0, 3);
  const free = freeLibrary().length;
  const summary = usePremiumSummary();
  return (
    <>
      <section className="pp-hero" aria-labelledby="home-h1">
        <Container>
          <div className="pp-hero-grid">
            <div>
              <p className="pp-eyebrow">The Adventure Passport</p>
              <h1 id="home-h1" className="pp-h1">
                Little adventures for you and <em>your dog</em>.
              </h1>
              <p className="pp-lede">
                A free set of small, doable things to do together: flip a mystery card, go do it,
                collect it, and turn it into a photo filter. A lifetime of little adventures.
              </p>
              <ul className="pp-hero-points" aria-label="Good to know">
                <li>Free to start</li>
                <li>No account</li>
                <li>{free} free adventures</li>
              </ul>
              <div className="mt-6">
                <Button to="/discover">Find our next adventure</Button>
              </div>
            </div>
            <MysteryCard />
          </div>
        </Container>
      </section>

      <div className="pp-perf" aria-hidden="true" />

      {FILTER_EXAMPLES.length > 0 && (
        <section className="pp-section pb-0" aria-label="Photo filter examples">
          <Container>
            <PhotoFilterExamples images={FILTER_EXAMPLES} />
          </Container>
        </section>
      )}

      <section className="pp-section" aria-labelledby="passport-h">
        <Container>
          <div className="pp-split">
            <div>
              <SectionHeading
                eyebrow="Your passport"
                title="Every adventure earns a stamp"
                id="passport-h"
              >
                Mark an adventure done and it lands in your passport. Over time the pages fill with
                the little things you did together.
              </SectionHeading>
              <div className="mt-5">
                <Button to="/passport" variant="secondary">
                  See how the passport works
                </Button>
              </div>
            </div>
            <PassportPreview />
          </div>
        </Container>
      </section>

      <section className="pp-section pp-band" aria-labelledby="collections-h">
        <Container>
          <SectionHeading eyebrow="Collections" title="Pick a chapter" id="collections-h">
            Adventures come in themed collections. A first look at some of them:
          </SectionHeading>
          <div className="pp-grid pp-grid-3 mt-6">
            {collections.map((c) => (
              <Card key={c.name} to="/collections">
                <div className="pp-collection">
                  <span className="pp-collection-icon" aria-hidden="true">
                    {c.icon}
                  </span>
                  <div>
                    <h3>{c.name}</h3>
                    <p>{c.blurb}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Button to="/collections" variant="ghost">
              Browse collections
            </Button>
          </div>
        </Container>
      </section>

      <section className="pp-section" aria-labelledby="keepsake-h">
        <Container>
          <div className="pp-split">
            <div className="order-2 md:order-1">
              <Keepsake />
            </div>
            <div className="order-1 md:order-2">
              <SectionHeading eyebrow="Keepsakes" title="Something to keep" id="keepsake-h">
                Finished adventures can become a keepsake page to save or print, a small record of
                the day you did it.
              </SectionHeading>
            </div>
          </div>
        </Container>
      </section>

      <section className="pp-section pp-band" aria-labelledby="how-h">
        <Container>
          <SectionHeading eyebrow="How it works" title="Three steps" id="how-h" />
          <ol className="pp-steps mt-6">
            <li>
              <h3>Find</h3>
              <p>
                Tell us a little about your day and your dog. We suggest an adventure that fits.
              </p>
            </li>
            <li>
              <h3>Do</h3>
              <p>Flip the card, read the idea and go. Most take less than an afternoon.</p>
            </li>
            <li>
              <h3>Stamp</h3>
              <p>Mark it done. Your passport fills up, and you can save a keepsake.</p>
            </li>
          </ol>
        </Container>
      </section>

      <section className="pp-section" aria-labelledby="buy-h">
        <Container>
          <div className="pp-card" style={{ padding: "1.5rem" }}>
            <SectionHeading eyebrow="The full Passport" title="Pay once, keep it" id="buy-h">
              Start with the {free} free adventures. The full Passport adds {summaryText(summary)}:{" "}
              {offer.price}, {offer.pricing}. No account.
            </SectionHeading>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button to="/unlock">Get the Passport</Button>
              <Button to="/discover" variant="secondary">
                Try the free adventures
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="pp-section pt-0" aria-labelledby="faq-h">
        <Container>
          <SectionHeading eyebrow="Questions" title="Quick answers" id="faq-h" />
          <div className="pp-faq mt-4">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {guides.length > 0 && (
        <section className="pp-section pt-0" aria-labelledby="guides-h">
          <Container>
            <SectionHeading eyebrow="From the guides" title="Reading for the road" id="guides-h" />
            <div className="mt-4">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  to="/guides/$slug"
                  params={{ slug: g.slug }}
                  className="pp-guide"
                >
                  <span className="pp-guide-title">{g.title}</span>
                  <span className="pp-guide-dek">{g.dek}</span>
                </Link>
              ))}
            </div>
            <div className="mt-5">
              <Button to="/guides" variant="secondary">
                All guides
              </Button>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function MysteryCard() {
  return (
    <div className="pp-mini" role="group" aria-label="Sample mystery card">
      <span className="pp-meta">Mystery card</span>
      <p className="pp-mini-clue">
        “Four contenders enter the ring, and only one makes the front page.”
      </p>
      <p className="pp-mini-note">
        A sample clue. Tap an adventure in Discover to reveal the real thing.
      </p>
    </div>
  );
}

function PassportPreview() {
  return (
    <div
      className="pp-passport"
      role="img"
      aria-label="Preview of a passport page with three earned stamps and three empty spaces"
    >
      <p className="pp-passport-title">Adventure Passport</p>
      <div className="pp-page">
        <div className="pp-stamps">
          <Stamp label="First Sniff" state="earned" />
          <Stamp label="Rainy Day" state="earned" />
          <Stamp label="Road Stop" state="earned" />
          <Stamp label="Next up" state="empty" />
          <Stamp label="Next up" state="empty" />
          <Stamp label="Next up" state="empty" />
        </div>
      </div>
    </div>
  );
}

function Keepsake() {
  return (
    <div className="pp-keepsake" role="img" aria-label="Preview of a keepsake page">
      <div className="pp-keepsake-frame">
        <span className="pp-postmark" aria-hidden="true">
          Adventure done
        </span>
        <strong>The Slow Sniff Walk</strong>
        <p>Collected together. Date and a line of your own go here.</p>
      </div>
    </div>
  );
}
