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
import { unlockLine, usePremiumSummary } from "@/lib/premium-summary";
import { usePreviews } from "@/lib/usePreviews";
import { EarlyTesters } from "@/components/site/EarlyTesters";
import { BRAND } from "@/config/brand";
import {
  flags,
  FULL_OPTION_LABEL,
  GIFT_CTA,
  KEEP_LINE,
  libraryLine,
  price,
  REFUND_SUMMARY,
} from "@/config/commercial";
import { PhotoFilterExamples } from "@/components/site/PhotoFilterExamples";
import { FILTER_EXAMPLES } from "@/components/site/keepsake-examples";
import { pageHead } from "@/lib/seo";
import "@/design/ux-detail.css";
import "@/design/home-v9.css";
import { FaqList } from "@/components/site/FaqList";
import { FAQS, UNLOCK_FAQ_IDS } from "@/components/site/faq-content";

export const Route = createFileRoute("/unlock")({
  head: () =>
    pageHead({
      title: `Get the Adventure Passport: ${price} Once`,
      description:
        "Find something enjoyable for ordinary days with your dog. Your first adventure is free; the full Adventure Passport is one payment, yours to keep. No subscription.",
      path: "/unlock",
    }),
  component: Unlock,
});

/** True on this browser when a purchase was activated here before. Server render and first client render say false. */
const noopSubscribe = () => () => {};

const BENEFITS: readonly (readonly [string, string])[] = [
  [
    "Something enjoyable on ordinary days",
    "Little adventures for cozy days at home, short outings and bigger days out.",
  ],
  ["Discovery by dog and plans", "Picks that fit your dog, your day, your time and your budget."],
  ["Little surprises", "Mystery adventures, revealed when you are ready."],
  ["No endless searching", "Curated collections instead of a blank search box."],
  ["Memories to collect", "Passport stamps and a saved history of your adventures."],
  [
    "Personalized keepsakes",
    "Make a postcard, magazine cover or trading card from your dog's photo, on your device.",
  ],
  ["Save and plan", "Save favorites, build your own collections and plan an outing."],
];
const FREE_INCLUDES = [
  "One complete personalized adventure",
  "Your intro Passport stamp",
  "Public previews, and bookmarks saved on this device",
  "No account and no payment",
];
const FULL_INCLUDES = [
  "The complete supported adventure library",
  "Full contextual discovery and curated collections",
  "Mystery adventures",
  "Saving and your own collections",
  "The complete collectible experience",
  "Personalized photo keepsakes, made on your device",
  "Adventure planning",
  "Supported progress sync across devices",
  "Digital delivery, restore access, support and refund terms",
];

function Unlock() {
  const ent = useEntitlement();
  const summary = usePremiumSummary();
  const previews = usePreviews();
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
  const showCode = (!entitled && !pending) || submitted;
  // ONE activation form. It sits at the same place in the tree in every state, so activating here (which flips the page
  // to its entitled state) keeps the confirmation message and the Continue links on screen.
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
      <AccessForm kind="activate" embedded />
    </details>
  ) : null;

  const link = checkoutUrl();
  const verified =
    previews.status === "ready" && (previews.data?.total ?? 0) > 0
      ? libraryLine(previews.data?.total, collections.length)
      : unlockLine(summary);

  let top: React.ReactNode;
  if (pending && !submitted)
    top = (
      <>
        <h1 className="pa-h1">The Adventure Passport</h1>
        <p role="status" aria-busy="true">
          Checking your Passport...
        </p>
      </>
    );
  else if (entitled)
    top = (
      <>
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
      </>
    );
  else
    top = (
      <>
        <p className="pa-kicker">The Adventure Passport</p>
        <h1 className="pa-h1">{BRAND.unlockHeadline}</h1>
        <p className="pa-sub">
          <strong>{PASSPORT_INVITE}</strong> Your digital Adventure Passport: little adventures for
          you and your dog, in your browser.
        </p>
      </>
    );

  const sales = !entitled && !pending;
  return (
    <Container>
      <div
        className={entitled ? "pa-page ux-owned" : "pa-page"}
        data-testid={entitled ? "unlock-entitled" : undefined}
      >
        <div key="top">{top}</div>
        {code}
        {sales && (
          <>
            <section className="pa-panel" aria-labelledby="benefit-h" data-testid="benefits">
              <h2 id="benefit-h" className="pa-h">
                What the Passport gives you
              </h2>
              <ul className="co-plain">
                {BENEFITS.map(([h, t]) => (
                  <li key={h}>
                    <strong>{h}.</strong> {t}
                  </li>
                ))}
              </ul>
              <p className="pa-fine">{verified}</p>
            </section>

            <section className="pa-panel" aria-labelledby="compare-h" data-testid="compare">
              <h2 id="compare-h" className="pa-h">
                Free and full, side by side
              </h2>
              <div className="co-compare ux-options">
                <div className="pa-card">
                  <h3 className="pa-h">{BRAND.freeOption}</h3>
                  <ul className="co-plain">
                    {FREE_INCLUDES.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <p>
                    <AppLink to="/discover" className="pa-linkbtn inline-flex items-center">
                      Find our first adventure
                    </AppLink>
                  </p>
                </div>
                <div className="pa-card">
                  <h3 className="pa-h">{FULL_OPTION_LABEL}</h3>
                  <p>
                    <strong>{PASSPORT_PAYMENT}</strong> {KEEP_LINE}
                  </p>
                  <ul className="co-plain">
                    {FULL_INCLUDES.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                    {flags.notifications && (
                      <li>Optional reminders in My Passport, only if you turn them on</li>
                    )}
                  </ul>
                </div>
              </div>
            </section>

            <section className="pa-panel" aria-labelledby="buy-h" data-testid="buy-panel">
              <h2 id="buy-h" className="pa-h">
                Get the Adventure Passport
              </h2>
              <p className="pa-fine">
                Digital and browser-based, so nothing is shipped. {PASSPORT_PAYMENT} One purchase
                covers your household on your own devices, with one shared profile for one dog or
                several (for example, Luna and Milo).
              </p>
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
                <>
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
                  <p className="pa-fine">
                    You will leave this site for our checkout provider to pay securely, then come
                    back with your code.
                  </p>
                </>
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
              <h3 className="pa-h" id="delivery-h">
                How you get it, and get it back
              </h3>
              <p className="pa-fine">
                After you pay, our checkout provider emails you a purchase code. Enter it under
                "Already have a code?" above and the full Passport opens on this device. On a new
                device, use Restore access with the same code. Questions?{" "}
                <AppLink to="/contact" className="pa-linkbtn">
                  Contact support
                </AppLink>
                .
              </p>
            </section>

            <EarlyTesters compact headingLevel={2} />

            <section className="pa-panel" aria-labelledby="examples-h" style={{ minWidth: 0 }}>
              <h2 id="examples-h" className="pa-h">
                Keepsakes you can make with the full Passport
              </h2>
              <p className="pa-fine">
                Personalized keepsake creation is part of the full Passport. These are examples, not
                customer stories: licensed dog photographs, made on-device with the same tool you
                would use, with sample names.
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

            <p className="pa-fine">
              Every adventure is a gentle suggestion. Your dog can stop at any time.
            </p>
          </>
        )}
      </div>
    </Container>
  );
}
