import { collections } from "@/passport/content";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/shell/Button";
import { AppLink } from "@/components/shell/AppLink";
import { Container } from "@/components/shell/Container";
import { SectionHeading } from "@/components/shell/SectionHeading";
import { pageHead } from "@/lib/seo";
import { site } from "@/config/site";
import { BRAND } from "@/config/brand";
import { PhotoFilterExamples } from "@/components/site/PhotoFilterExamples";
import { HOME_EXAMPLES } from "@/components/site/keepsake-examples";
import { FaqList } from "@/components/site/FaqList";
import { FAQS } from "@/components/site/faq-content";
import { HeroCollage } from "@/components/site/HeroCollage";
import { AccessCheckFailed, HomeSkeleton, ReturningHome } from "@/components/site/ReturningHome";
import { EarlyTesters } from "@/components/site/EarlyTesters";
import { useNavMode } from "@/components/shell/useNavMode";
import {
  FULL_OPTION_LABEL,
  homePromo,
  KEEP_LINE,
  libraryLine,
  ONE_TIME_LINE,
  price,
  pricing,
} from "@/config/commercial";
import { unlockLine, usePremiumSummary } from "@/lib/premium-summary";
import { usePreviews } from "@/lib/usePreviews";
import { track } from "@/passport/events";
import { PREVIEWS_PATH } from "@/passport/starter";
import { WORLDS } from "@/passport/worlds";
import "@/design/home-v9.css";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: `Dog Adventures, Free to Start | ${site.name}`,
      description: `Cozy days at home to little outings: a free first adventure for your dog, then the full Adventure Passport for ${price}, once. No subscription.`,
      path: "/",
    }),
  component: Home,
});

/**
 * One home page, two audiences. Server HTML and the first client render are the visitor page (hydration matches and the
 * indexable content stays); a verified customer gets the returning-customer home, and a browser that holds an account
 * flag shows a neutral skeleton until access is known (CSS hides the visitor page from the first frame via data-acct).
 */
function Home() {
  const { mode } = useNavMode();
  if (mode === "paid") return <ReturningHome />;
  if (mode === "error") return <AccessCheckFailed />;
  if (mode === "loading") return <HomeSkeleton />;
  return (
    <div className="pp-home-visitor">
      <SalesHome />
    </div>
  );
}

const HOME_FAQ_IDS = [
  "what-you-buy",
  "subscription",
  "try-first",
  "digital-not-book",
  "puppies",
  "photos-not-uploaded",
];

const MOOD_BG = ["butter", "powder", "strawberry", "sage"] as const;

const STEPS = [
  { h: "Discover", p: "Tell us a little about your dog and find an adventure that fits." },
  { h: "Adventure", p: "Reveal your adventure and go make a little memory." },
  {
    h: "Collect",
    p: "Earn Passport stamps and create personalized keepsakes with the full Passport. Your first stamp is free.",
  },
];

function SalesHome() {
  const summary = usePremiumSummary();
  const previews = usePreviews();
  // Counts are advertised only when the previews API verified them; otherwise the summary or honest fallback wording.
  const variety =
    previews.status === "ready" && (previews.data?.total ?? 0) > 0
      ? libraryLine(previews.data?.total, collections.length)
      : unlockLine(summary);
  return (
    <>
      <section className="pp-hero" aria-labelledby="home-h1">
        <Container>
          <div className="pp-hero-grid">
            <div>
              <p className="pp-eyebrow">{homePromo.eyebrow}</p>
              <h1 id="home-h1" className="pp-h1">
                {homePromo.titleLead} <em>{homePromo.titleEm}</em> {homePromo.titleTail}
              </h1>
              <p className="pp-lede">{homePromo.lede}</p>
              <p className="pp-cta-row">
                <Button to="/discover">{homePromo.primaryCta}</Button>
              </p>
              <p className="pp-offer-line">
                {homePromo.productLine} {ONE_TIME_LINE} <span>{KEEP_LINE}</span>
              </p>
            </div>
            <div>
              <HeroCollage />
            </div>
          </div>
        </Container>
      </section>

      <section className="pp-section" aria-labelledby="steps-h">
        <Container>
          <SectionHeading eyebrow="How it works" title="Three little steps" id="steps-h" />
          <ol className="pp-steps mt-6" aria-label="How it works">
            {STEPS.map((s) => (
              <li key={s.h}>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="pp-section pp-library" aria-labelledby="variety-h">
        <Container>
          <SectionHeading
            eyebrow="A taste of the possibilities"
            title="Something for every kind of day"
            id="variety-h"
          >
            Cozy days at home, little doggy dates, playful moments, outdoor discoveries and quiet
            little adventures. {variety}
          </SectionHeading>
          <ul className="pp-moods pp-plainlist" aria-label="Collections">
            {WORLDS.map((w, i) => (
              <li key={w.id}>
                <Link
                  to="/collections"
                  search={{ tab: "curated", world: w.slug } as never}
                  className={`pp-mood pp-mood-${MOOD_BG[i % MOOD_BG.length]}`}
                >
                  <span className="pp-mood-img" aria-hidden="true">
                    <img src={w.image} alt="" loading="lazy" width={640} height={420} />
                  </span>
                  <span>
                    <h3>{w.title}</h3>
                    <p className="font-hand-note">{w.blurb}</p>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="pp-invite-links">
            <AppLink to="/collections" className="pp-btn pp-btn-secondary">
              {homePromo.collectionsCta}
            </AppLink>
          </p>
          <p className="pa-fine">
            Collections group adventures by the kind of day you are having.{" "}
            <AppLink to={PREVIEWS_PATH} className="pp-textlink">
              {homePromo.secondaryCta}
            </AppLink>{" "}
            to peek at a few selected adventure cards, without the steps.
          </p>
        </Container>
      </section>

      <section className="pp-section pp-band" aria-labelledby="keepsake-h">
        <Container>
          <SectionHeading eyebrow="Keepsakes" title={BRAND.keepsakeHeadline} id="keepsake-h">
            Every adventure earns a stamp for your passport. The full Passport adds personalized
            keepsakes: a postcard, magazine cover or trading card from your own dog's photo, drawn
            on your device and never uploaded.
          </SectionHeading>
          <div className="mt-6">
            <PhotoFilterExamples
              images={HOME_EXAMPLES}
              caption="Sample keepsakes, drawn by the same tool you would use. Examples, not customer stories. Photos are CC0 (public domain) from Wikimedia Commons."
            />
          </div>
        </Container>
      </section>

      <EarlyTesters framed />

      <section className="pp-section pp-invite" aria-labelledby="invite-h">
        <Container>
          <SectionHeading eyebrow="Choose how to begin" title="Two ways in" id="invite-h">
            Digital and browser-based: nothing is shipped, and there is no account to make.
          </SectionHeading>
          <div className="co-compare mt-6">
            <div className="pp-card pp-pad">
              <h3>{BRAND.freeOption}</h3>
              <p>One complete adventure picked for your dog, with a stamp. No account or card.</p>
              <p className="mt-4">
                <Button to="/discover">{homePromo.primaryCta}</Button>
              </p>
            </div>
            <div className="pp-card pp-pad">
              <h3>{FULL_OPTION_LABEL}</h3>
              <p className="pp-price-line">
                <strong>{price}</strong> <span>{pricing}</span>
              </p>
              <p>The full library, personalized keepsakes and your own collections.</p>
              <p className="mt-4">
                <AppLink
                  to="/unlock"
                  className="pp-btn pp-btn-secondary"
                  onClick={() => track("purchase_cta_clicked", { where: "home-invite" })}
                >
                  Get the Adventure Passport
                </AppLink>
              </p>
            </div>
          </div>
          <p className="pp-invite-links">
            <AppLink to="/refund-policy" className="pp-textlink">
              Refund terms
            </AppLink>
            <AppLink to="/restore-access" className="pp-textlink">
              Restore access
            </AppLink>
            <AppLink to="/contact" className="pp-textlink">
              Contact support
            </AppLink>
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
    </>
  );
}
