import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { AppLink } from "@/components/shell/AppLink";
import { AccessForm } from "@/components/passport/AccessForms";
import { track } from "@/passport/events";
import { checkoutUrl } from "@/lib/passport-api";
import { collections } from "@/passport/content";
import { flags, GIFT_CTA, KEEP_LINE, price, pricing, REFUND_SUMMARY } from "@/config/commercial";
import { DemoAdventure } from "@/components/site/DemoAdventure";
import { PhotoFilterExamples } from "@/components/site/PhotoFilterExamples";
import { FILTER_EXAMPLES } from "@/components/site/keepsake-examples";
import { TrustStrip } from "@/components/site/TrustStrip";
import { unlockLine, usePremiumSummary } from "@/lib/premium-summary";
import { TrustBlock } from "@/components/passport/TrustBlock";
import { pageHead } from "@/lib/seo";
import { PREVIEWS_PATH } from "@/passport/starter";
import { FaqList } from "@/components/site/FaqList";
import { FAQS, UNLOCK_FAQ_IDS } from "@/components/site/faq-content";

export const Route = createFileRoute("/unlock")({
  head: () =>
    pageHead({
      title: `Get the Adventure Passport: ${price} Once`,
      description:
        "One free adventure picked for your dog, then the full Adventure Passport library for a single payment. No subscription, no account.",
      path: "/unlock",
    }),
  component: Unlock,
});

function Unlock() {
  const link = checkoutUrl();
  const summary = usePremiumSummary();
  useEffect(() => {
    track("unlock_viewed");
  }, []);
  return (
    <Container>
      <div className="pa-page">
        <p className="pa-kicker">The Adventure Passport</p>
        <h1 className="pa-h1">The full Passport: one payment, no subscription</h1>
        <p className="pa-sub">
          A digital collection of little adventures for you and your dog, in your browser. Start
          with one free adventure picked for your dog. When you want more, the full Passport opens
          the whole library for {price}, once, and it is yours to keep.
        </p>
        <p className="pp-fine">{KEEP_LINE}</p>
        <p>{unlockLine(summary)}</p>
        <p className="pp-cta-row">
          <AppLink to="/discover" className="pp-btn pp-btn-primary">
            Find Our First Adventure — Free
          </AppLink>
          <AppLink
            to={PREVIEWS_PATH}
            className="pp-btn pp-btn-secondary"
            onClick={() => track("preview_viewed", { where: "unlock" })}
          >
            Explore the Adventure Collection
          </AppLink>
        </p>

        <div className="co-compare">
          <section className="pa-card" aria-labelledby="free-h">
            <h2 id="free-h" className="pa-h">
              Free, always
            </h2>
            <ul className="co-plain">
              <li>
                A few quick questions about your dog, then one complete adventure picked for them
              </li>
              <li>
                Practical details first (time, cost, setting, effort), and another pick if you like
              </li>
              <li>
                A stamp for your passport, and the matching keepsake style shown as an example
              </li>
              <li>Selected previews from the larger collection</li>
              <li>No account, no email, no card</li>
            </ul>
          </section>
          <section className="pa-card" aria-labelledby="full-h">
            <h2 id="full-h" className="pa-h">
              The full Passport adds
            </h2>
            <p className="pa-price">
              <strong>{price}</strong> <span>{pricing}</span>
            </p>
            <ul className="co-plain">
              <li>The whole library, in every collection, not just one adventure</li>
              <li>
                Mystery reveals and picks matched to your dog, with filters for time, budget and
                setting
              </li>
              <li>Collections from puppies to seniors, homebodies to hikers</li>
              <li>Daily and seasonal suggestions, plus birthday and adoption reminders</li>
              {flags.notifications && (
                <li>Optional reminders in My Passport, only if you turn them on</li>
              )}
              <li>
                Personalized keepsakes: make your own from your dog's photo, drawn on your device
                and never uploaded
              </li>
              <li>Your own collections</li>
              <li>Progress that can follow you to your other devices</li>
            </ul>
            <p className="pa-fine">
              Many adventures cost nothing extra to do. Each shows its cost range before you start.
              It is digital, so nothing ships. One purchase covers your household on your own
              devices. The Passport keeps one shared profile, so you can add one dog or several (for
              example, Luna and Milo) and pick activities that suit every dog.
            </p>
            <div className="pa-fine" data-testid="refund-terms">
              <h3 className="pa-h">Refund terms, before you pay</h3>
              <ul className="co-plain">
                {REFUND_SUMMARY.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <AppLink to="/refund-policy" className="pa-linkbtn inline-flex items-center">
                Read the full refund policy
              </AppLink>
            </div>
            {link ? (
              <a
                className="pp-btn pp-btn-primary"
                href={link}
                rel="noopener noreferrer"
                onClick={() => {
                  track("purchase_cta_clicked", { where: "unlock" });
                  track("checkout_handoff");
                }}
              >
                Continue to checkout
              </a>
            ) : (
              <>
                <button
                  type="button"
                  className="pp-btn pp-btn-primary"
                  disabled
                  aria-describedby="checkout-note"
                >
                  Get the Passport
                </button>
                <p id="checkout-note" className="pa-fine">
                  Checkout opens soon. Nothing can be bought yet, and nothing is charged.
                </p>
              </>
            )}
            {flags.gifting && link && (
              <p className="pa-fine">
                <a
                  className="pp-btn pp-btn-secondary"
                  href={link}
                  rel="noopener noreferrer"
                  data-testid="gift-cta"
                  onClick={() => {
                    track("purchase_cta_clicked", { where: "unlock-gift" });
                    track("checkout_handoff");
                  }}
                >
                  {GIFT_CTA}
                </a>{" "}
                Same Passport, same price. On the checkout page, choose the gift option.
              </p>
            )}
          </section>
        </div>

        <DemoAdventure open />

        <section className="pa-panel" aria-labelledby="examples-h" style={{ minWidth: 0 }}>
          <h2 id="examples-h" className="pa-h">
            Examples of what you can make with the full Passport
          </h2>
          <p className="pa-fine">
            Personalized keepsake creation is part of the full Passport. These are examples, not
            customer stories: licensed dog photographs, made on-device with the same tool you would
            use, with sample names.
          </p>
          <PhotoFilterExamples
            images={FILTER_EXAMPLES}
            caption="Original photo on the left, finished keepsake on the right. Photos are CC0 (public domain) from Wikimedia Commons."
          />
        </section>

        <section className="pa-panel" aria-labelledby="faq-h">
          <h2 id="faq-h" className="pa-h">
            Quick answers
          </h2>
          <FaqList
            items={FAQS.filter((f) => (UNLOCK_FAQ_IDS as readonly string[]).includes(f.id))}
          />
          <p className="pa-fine">
            <AppLink to="/faq" className="pa-linkbtn">
              All questions and answers
            </AppLink>
          </p>
        </section>

        <section className="pa-panel" aria-labelledby="coll-h">
          <h2 id="coll-h" className="pa-h">
            The {collections.length} collections
          </h2>
          <p className="pa-fine">
            The full library fills these collections. You can see selected previews before you buy.
          </p>
          <ul className="co-plain pa-cols">
            {collections.map((c) => (
              <li key={c.slug}>{c.title}</li>
            ))}
          </ul>
        </section>

        <TrustStrip />
        <TrustBlock />

        <p className="pa-fine">
          Every adventure is a gentle suggestion. Your dog can stop at any time.
        </p>

        <AccessForm kind="activate" />
        <p className="pa-fine">
          Bought it on another device?{" "}
          <AppLink to="/restore-access" className="pa-linkbtn">
            Restore access
          </AppLink>
          .
        </p>
      </div>
    </Container>
  );
}
