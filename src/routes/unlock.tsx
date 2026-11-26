import { useEffect, useState, useSyncExternalStore } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { AppLink } from "@/components/shell/AppLink";
import { AccessForm } from "@/components/passport/AccessForms";
import { track } from "@/passport/events";
import { hasAccountFlag } from "@/passport/premium-client";
import { useEntitlement } from "@/passport/useEntitlement";
import { PASSPORT_INVITE, PASSPORT_PAYMENT } from "@/components/passport/purchase-copy";
import { checkoutUrl } from "@/lib/passport-api";
import { collections } from "@/passport/content";
import { BRAND } from "@/config/brand";
import { flags, GIFT_CTA, KEEP_LINE, price, REFUND_SUMMARY } from "@/config/commercial";
import { DemoAdventure } from "@/components/site/DemoAdventure";
import { PhotoFilterExamples } from "@/components/site/PhotoFilterExamples";
import { FILTER_EXAMPLES } from "@/components/site/keepsake-examples";
import { TrustStrip } from "@/components/site/TrustStrip";
import { TrustBlock } from "@/components/passport/TrustBlock";
import { pageHead } from "@/lib/seo";
import "@/design/ux-detail.css";
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

/** True on this browser when a purchase was activated here before. Server render and first client render say false. */
const noopSubscribe = () => () => {};

function Unlock() {
  const ent = useEntitlement();
  const flagged = useSyncExternalStore(noopSubscribe, hasAccountFlag, () => false);
  const entitled = ent.status === "entitled";
  // A returning customer is never shown the sales page while we are still checking: neutral state until we know.
  const pending = !entitled && (ent.status === "checking" || (flagged && ent.status === "free"));
  const [submitted, setSubmitted] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  useEffect(() => {
    if (submitted && entitled) setCodeOpen(true); // keep the "confirmed" message visible after activating here
  }, [submitted, entitled]);
  useEffect(() => {
    if (!entitled && !pending) track("unlock_viewed");
  }, [entitled, pending]);
  const showCode = !entitled || submitted;
  const code = showCode ? (
    <details
      key="code"
      className="ux-code pa-card"
      open={codeOpen}
      onSubmitCapture={() => setSubmitted(true)}
      data-testid="code-section"
    >
      <summary
        onClick={(e) => {
          e.preventDefault();
          setCodeOpen((v) => !v);
        }}
      >
        Already have a code?
      </summary>
      <AccessForm kind="activate" />
    </details>
  ) : null;

  if (pending)
    return (
      <Container>
        <div className="pa-page">
          <h1 className="pa-h1">The Adventure Passport</h1>
          <p role="status" aria-busy="true">
            Checking your Passport...
          </p>
        </div>
      </Container>
    );

  if (entitled)
    return (
      <Container>
        <div className="pa-page ux-owned" data-testid="unlock-entitled">
          <p className="pa-kicker">Thank you</p>
          <h1 className="pa-h1">You have the Passport</h1>
          <p className="pa-sub">
            The full library is open on this device, and it is yours to keep. Pick up wherever you
            like.
          </p>
          <p>
            <AppLink to="/discover" className="pp-btn pp-btn-primary">
              Find today's adventure
            </AppLink>
            <AppLink to="/passport" className="pp-btn pp-btn-secondary">
              My Passport
            </AppLink>
          </p>
          <p className="pa-fine">
            Using another device?{" "}
            <AppLink to="/restore-access" className="pa-linkbtn">
              Restore access
            </AppLink>
            . Questions?{" "}
            <AppLink to="/contact" className="pa-linkbtn">
              Contact support
            </AppLink>
            .
          </p>
          {code}
        </div>
      </Container>
    );

  const link = checkoutUrl();
  return (
    <Container>
      <div className="pa-page">
        <p className="pa-kicker">The Adventure Passport</p>
        <h1 className="pa-h1">{BRAND.unlockHeadline}</h1>
        <p className="pa-sub">
          <strong>{PASSPORT_INVITE}</strong> Little adventures for you and your dog, in your
          browser. Start free, or get the complete Passport.
        </p>
        {code}

        <div className="co-compare ux-options">
          <section className="pa-card" aria-labelledby="free-h">
            <h2 id="free-h" className="pa-h">
              Try your first adventure: free
            </h2>
            <ul className="co-plain">
              <li>A few quick questions, then one complete adventure picked for your dog</li>
              <li>The practical details first: time, cost, setting and effort</li>
              <li>
                A stamp for your passport, and the matching keepsake style shown as an example
              </li>
              <li>No account, no email, no card</li>
            </ul>
            <p>
              <AppLink to="/discover" className="pp-btn pp-btn-primary">
                Find our first adventure
              </AppLink>
            </p>
          </section>
          <section className="pa-card" aria-labelledby="full-h">
            <h2 id="full-h" className="pa-h">
              The complete Adventure Passport: {price} once
            </h2>
            <p>
              <strong>{PASSPORT_PAYMENT}</strong>
            </p>
            <p className="pa-fine">Digital and browser-based, so nothing is shipped. {KEEP_LINE}</p>
            <ul className="co-plain">
              <li>Over a hundred adventures, in every collection</li>
              <li>Picks matched to your dog, mystery reveals and filters for time and budget</li>
              <li>
                Personalized keepsakes: make your own from your dog's photo, drawn on your device
                and never uploaded
              </li>
              <li>Your own collections, and progress that can follow you to your other devices</li>
              {flags.notifications && (
                <li>Optional reminders in My Passport, only if you turn them on</li>
              )}
            </ul>
            <details className="pa-fold" data-testid="refund-terms">
              <summary>Refund terms, before you pay</summary>
              <div className="pa-fold-body">
                <ul className="co-plain">
                  {REFUND_SUMMARY.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <AppLink to="/refund-policy" className="pa-linkbtn inline-flex items-center">
                  Read the full refund policy
                </AppLink>
              </div>
            </details>
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
                  Checkout opens soon
                </button>
                <p id="checkout-note" className="pa-fine">
                  Nothing can be bought yet, and nothing is charged.
                </p>
              </>
            )}
            <p className="pa-fine">
              One purchase covers your household on your own devices. The Passport keeps one shared
              profile, so you can add one dog or several (for example, Luna and Milo).
            </p>
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
                {BRAND.giftLine} Same Passport, same price. On the checkout page, choose the gift
                option.
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
