import { createFileRoute, Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import { Button } from "@/components/shell/Button";
import { AppLink } from "@/components/shell/AppLink";
import { Container } from "@/components/shell/Container";
import { SectionHeading } from "@/components/shell/SectionHeading";
import { Stamp } from "@/passport/art/stamps";
import { pageHead } from "@/lib/seo";
import { site, offer } from "@/config/site";
import { PhotoFilterExamples } from "@/components/site/PhotoFilterExamples";
import { FILTER_EXAMPLES } from "@/components/site/keepsake-examples";
import { FaqList } from "@/components/site/FaqList";
import { FAQS } from "@/components/site/faq-content";
import { PurchasePrompt } from "@/components/site/PurchasePrompt";
import { unlockLine, usePremiumSummary } from "@/lib/premium-summary";
import { usePreviews } from "@/lib/usePreviews";
import { track } from "@/passport/events";
import { PREVIEWS_PATH } from "@/passport/starter";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: `Dog Adventures, Free to Start | ${site.name}`,
      description: `Life is better with a little adventure. One free adventure picked for your dog, then a large library for ${offer.price}, once. No subscription.`,
      path: "/",
    }),
  component: Home,
});

const HOME_FAQ_IDS = [
  "what-you-buy",
  "subscription",
  "try-first",
  "puppies",
  "seniors",
  "photos-not-uploaded",
];

const COLLECTION_TASTE = [
  { slug: "five-minute-wonders", name: "Five-Minute Wonders", blurb: "Tiny games for a busy day." },
  { slug: "rainy-day-club", name: "Rainy Day Club", blurb: "Indoor fun for gray weather." },
  { slug: "doggy-date-club", name: "Doggy Date Club", blurb: "An outing, just the two of you." },
  {
    slug: "puppys-first-chapter",
    name: "Puppy's First Chapter",
    blurb: "First times to remember.",
  },
  { slug: "the-golden-years", name: "The Golden Years", blurb: "Gentle days at a slower pace." },
  { slug: "road-trip-adventures", name: "Road Trip Adventures", blurb: "Stops worth the detour." },
];

function Home() {
  const summary = usePremiumSummary();
  const previews = usePreviews();
  const total = previews.data?.total ?? 0;
  const cols = previews.data?.collections ?? 0;
  const variety =
    previews.status === "ready" && total > 0
      ? `${total} adventures across ${cols} ${cols === 1 ? "collection" : "collections"}, for every kind of dog.`
      : unlockLine(summary);
  return (
    <>
      <section className="pp-hero" aria-labelledby="home-h1">
        <Container>
          <div className="pp-hero-grid">
            <div>
              <p className="pp-eyebrow">Digital adventures for you and your dog</p>
              <h1 id="home-h1" className="pp-h1">
                Life is better with a little <em>adventure</em>.
              </h1>
              <p className="pp-lede">
                Five-minute games at home, doggy dates, weekend adventures. A personalized library
                of little adventures for you and your dog, with a free first adventure picked just
                for them.
              </p>
              <ul className="pp-hero-points" aria-label="Good to know">
                <li>One free adventure to start</li>
                <li>Personalized to your dog</li>
                <li>One payment, not a subscription</li>
                <li>No account</li>
              </ul>
              <p className="pp-cta-row">
                <Button to="/discover">Find Our First Adventure — Free</Button>
                <Button to={PREVIEWS_PATH} variant="secondary">
                  Explore the Adventure Collection
                </Button>
              </p>
              <p className="pp-fine">
                Want it all?{" "}
                <AppLink
                  to="/unlock"
                  className="pp-textlink"
                  onClick={() => track("purchase_cta_clicked", { where: "home-hero" })}
                >
                  Get the full Passport, {offer.price} once
                </AppLink>
                .
              </p>
            </div>
            <figure className="pp-hero-art">
              <img
                src="/examples/postcard.webp"
                alt="A finished postcard keepsake with a sample illustrated dog named Biscuit"
                width={560}
                height={560}
              />
              <figcaption>A keepsake you make at the end of an adventure (sample art).</figcaption>
            </figure>
          </div>
        </Container>
      </section>

      <div className="pp-perf" aria-hidden="true" />

      <section className="pp-section" aria-labelledby="benefit-h">
        <Container>
          <SectionHeading
            eyebrow="Why it matters"
            title="The little moments are the big ones"
            id="benefit-h"
          >
            Your dog is not waiting for a grand vacation. They are waiting for you to notice them,
            do something a little different, and share it. Five minutes of searching for hidden
            treats. A new street. A rainy-day game. These are the days you will remember, and the
            Adventure Passport helps you make more of them.
          </SectionHeading>
        </Container>
      </section>

      <section className="pp-section pp-band" aria-labelledby="variety-h">
        <Container>
          <SectionHeading
            eyebrow="The library"
            title="A lot of ways to spend a day together"
            id="variety-h"
          >
            {variety} From five-minute games to weekend outings.
          </SectionHeading>
          <ul className="pp-grid pp-grid-3 mt-6 pp-plainlist">
            {COLLECTION_TASTE.map((c) => (
              <li key={c.slug}>
                <Link to="/collections/$slug" params={{ slug: c.slug }} className="pp-card pp-chip">
                  <h3>{c.name}</h3>
                  <p>{c.blurb}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 pp-cta-row">
            <Button to="/collections" variant="secondary">
              Browse all collections
            </Button>
            <Button to={PREVIEWS_PATH} variant="ghost">
              See selected previews
            </Button>
          </p>
        </Container>
      </section>

      <section className="pp-section" aria-labelledby="discover-h">
        <Container>
          <div className="pp-split">
            <div>
              <SectionHeading eyebrow="Personalized" title="Picked for your dog" id="discover-h">
                Answer a few quick taps: your dog's age and energy, how they feel about people, dogs
                and noise, and whether you have a car or a yard. We pick an adventure that fits. If
                we do not know something that matters, we ask instead of guessing, and a nervous dog
                is never sent into a crowd.
              </SectionHeading>
              <p className="mt-4">
                Before you commit, you see the practical details: time, cost, setting, effort and
                anything it needs. Not the steps. If it is not right, ask for another, as often as
                you like.
              </p>
              <p className="mt-5">
                <Button to="/discover">Find Our First Adventure — Free</Button>
              </p>
            </div>
            <ol className="pp-steps" aria-label="How it works">
              <li>
                <h3>Tell us about your dog</h3>
                <p>A few taps. Skip anything you are unsure of.</p>
              </li>
              <li>
                <h3>See your pick</h3>
                <p>Time, cost, setting and effort first. Accept it, or ask for another.</p>
              </li>
              <li>
                <h3>Reveal and go</h3>
                <p>
                  The full instructions appear when you say yes. Stop whenever your dog wants to.
                </p>
              </li>
            </ol>
          </div>
        </Container>
      </section>

      <section className="pp-section pp-band" aria-labelledby="mystery-h">
        <Container>
          <div className="pp-split">
            <MysteryCard />
            <SectionHeading
              eyebrow="The mystery"
              title="Part of the fun is not knowing"
              id="mystery-h"
            >
              Many adventures begin with a clue instead of a list. You decide to say yes, then the
              reveal turns the page into a plan. This sample is only a clue: the real instructions
              appear after you accept an adventure.
            </SectionHeading>
          </div>
        </Container>
      </section>

      <section className="pp-section" aria-labelledby="passport-h">
        <Container>
          <div className="pp-split">
            <div>
              <SectionHeading
                eyebrow="Your passport"
                title="Every adventure earns a stamp"
                id="passport-h"
              >
                Finish an adventure and a stamp lands in your passport. Over time the pages fill
                with the little things you did together. No streaks, no scores, no pressure.
              </SectionHeading>
              <p className="mt-5">
                <Button to="/passport" variant="secondary">
                  See how the passport works
                </Button>
              </p>
            </div>
            <PassportPreview />
          </div>
        </Container>
      </section>

      <section className="pp-section pp-band" aria-labelledby="keepsake-h">
        <Container>
          <SectionHeading eyebrow="Keepsakes" title="Something to keep" id="keepsake-h">
            Turn a favorite day into a postcard, a magazine cover, a detective ID or a trading card.
            They are drawn on your own device, your photos are never uploaded, and you can save or
            print them. The examples below use a sample illustrated dog, not a real customer.
          </SectionHeading>
          <div className="mt-6">
            <PhotoFilterExamples
              images={FILTER_EXAMPLES}
              caption="Sample keepsakes drawn by the same tool you will use. Sample dog art, not a customer."
            />
          </div>
        </Container>
      </section>

      <section className="pp-section" aria-labelledby="included-h">
        <Container>
          <SectionHeading
            eyebrow="What is included"
            title="Free to start, one payment to unlock"
            id="included-h"
          />
          <div className="co-compare mt-6">
            <div className="pp-card pp-pad">
              <h3>Free</h3>
              <ul className="pp-plainlist-dots">
                <li>One complete adventure, personalized to your dog</li>
                <li>A stamp and a keepsake</li>
                <li>Selected previews from the larger collection</li>
                <li>No account, no email, no card</li>
              </ul>
            </div>
            <div className="pp-card pp-pad">
              <h3>The full Passport</h3>
              <p className="pp-price-line">
                <strong>{offer.price}</strong> <span>{offer.pricing}</span>
              </p>
              <ul className="pp-plainlist-dots">
                <li>The whole library in every collection</li>
                <li>Personalized picks, mystery reveals and filters</li>
                <li>Your own collections and more keepsake designs</li>
                <li>Progress that can follow you to your other devices</li>
              </ul>
              <p className="mt-4">
                <Button to="/unlock">See the full Passport</Button>
              </p>
            </div>
          </div>
          <p className="pp-fine mt-4">
            Many adventures cost nothing extra to do, and each shows its cost range before you
            start.
          </p>
        </Container>
      </section>

      <section className="pp-section pt-0" aria-labelledby="faq-h">
        <Container>
          <SectionHeading eyebrow="Questions" title="Quick answers" id="faq-h" />
          <div className="mt-4">
            <FaqList items={FAQS.filter((f) => HOME_FAQ_IDS.includes(f.id))} />
          </div>
          <p className="mt-4">
            <AppLink to="/faq" className="pp-textlink">
              All questions and answers
            </AppLink>
          </p>
        </Container>
      </section>

      <section className="pp-section pp-band" aria-labelledby="final-h">
        <Container>
          <SectionHeading eyebrow="Start here" title="Find your first adventure" id="final-h">
            It takes a minute, it is free, and it is a complete adventure. Your dog is probably
            ready.
          </SectionHeading>
          <p className="mt-6 pp-cta-row">
            <Button to="/discover">Find Our First Adventure — Free</Button>
            <Button to={PREVIEWS_PATH} variant="secondary">
              Explore the Adventure Collection
            </Button>
          </p>
          <PurchasePrompt where="home" />
        </Container>
      </section>
    </>
  );
}

function MysteryCard() {
  return (
    <div className="pp-mini" role="group" aria-label="Sample mystery card">
      <span className="pp-meta">Mystery card (sample clue)</span>
      <p className="pp-mini-clue">
        “Four contenders enter the ring, and only one makes the front page.”
      </p>
      <p className="pp-mini-note">
        A clue only. What it means, and what to do about it, is revealed when you accept an
        adventure.
      </p>
    </div>
  );
}

const SAMPLE_STAMPS = [
  "first-adventure",
  "cozy-companion",
  "road-tripper",
  "memory-maker",
] as const;

function PassportPreview() {
  return (
    <div className="pp-passport" role="group" aria-label="Sample passport page with earned stamps">
      <p className="pp-passport-title">
        <PawPrint aria-hidden="true" size={16} /> Adventure Passport (sample page)
      </p>
      <ul className="pp-stamp-sample">
        {SAMPLE_STAMPS.map((s, i) => (
          <li key={s}>
            <Stamp slug={s} earned={i < 3} size={92} />
          </li>
        ))}
      </ul>
    </div>
  );
}
