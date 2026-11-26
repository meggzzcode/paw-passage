import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { AppLink } from "@/components/shell/AppLink";
import { AccessForm } from "@/components/passport/AccessForms";
import { track } from "@/passport/events";
import { checkoutUrl } from "@/lib/passport-api";
import { collections } from "@/passport/content";
import { offer } from "@/config/site";
import { unlockLine, usePremiumSummary } from "@/lib/premium-summary";
import { TrustBlock } from "@/components/passport/TrustBlock";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/unlock")({
  head: () =>
    pageHead({
      title: "Get the Adventure Passport",
      description:
        "What the free Adventure Passport includes and what the full Passport adds. One-time purchase, no subscription.",
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
        <h1 className="pa-h1">Get the full Passport</h1>
        <p className="pa-sub">
          Tell us about your dog. Get one adventure picked for them, free. The full Passport is for
          when you want more.
        </p>
        <p>Want more little adventures with your dog? {unlockLine(summary)}</p>

        <div className="co-compare">
          <section className="pa-card" aria-labelledby="free-h">
            <h2 id="free-h" className="pa-h">
              Free, always
            </h2>
            <ul className="co-plain">
              <li>A short survey about your dog, then one adventure picked for them</li>
              <li>“Your first adventure”: do it, collect it, make a photo filter</li>
              <li>A stamp and a keepsake postcard made on your device</li>
              <li>Re-read your pick and keep your keepsake any time</li>
              <li>No account needed</li>
            </ul>
          </section>
          <section className="pa-card" aria-labelledby="full-h">
            <h2 id="full-h" className="pa-h">
              The full Passport adds
            </h2>
            <p className="pa-price">
              <strong>{offer.price}</strong> <span>one-time, no subscription</span>
            </p>
            <p className="pa-fine">
              <AppLink to="/refund-policy" className="pa-linkbtn">
                Refund policy
              </AppLink>
            </p>
            <ul className="co-plain">
              <li>Browse and pick from the whole library, not just one adventure</li>
              <li>Mystery reveals and “Made for you” picks, matched to your dog</li>
              <li>Every collection, from puppies to seniors, hyper dogs to homebodies</li>
              <li>Daily and seasonal suggestions, plus birthday and adoption reminders</li>
              <li>Your own collections and more keepsake designs</li>
              <li>Synced progress that follows you across devices</li>
            </ul>
            <p className="pa-fine">One-time purchase, no subscription.</p>
            {link ? (
              <a
                className="pp-btn pp-btn-primary"
                href={link}
                rel="noopener noreferrer"
                onClick={() => track("checkout_started")}
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
          </section>
        </div>

        <section className="pa-panel" aria-labelledby="coll-h">
          <h2 id="coll-h" className="pa-h">
            The {collections.length} collections
          </h2>
          <p className="pa-fine">
            Premium adventures fill these collections. We do not list individual premium adventures.
          </p>
          <ul className="co-plain pa-cols">
            {collections.map((c) => (
              <li key={c.slug}>{c.title}</li>
            ))}
          </ul>
        </section>

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
