import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { AppLink } from "@/components/shell/AppLink";
import { AccessForm } from "@/components/passport/AccessForms";
import { freeLibrary } from "@/passport/content";
import { track } from "@/passport/events";
import { checkoutUrl } from "@/lib/passport-api";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/unlock")({
  head: () =>
    pageHead({
      title: "Get the Adventure Passport",
      description:
        "What the free Adventure Passport includes and what the full Passport adds. One-time purchase, price shown at checkout.",
      path: "/unlock",
    }),
  component: Unlock,
});

function Unlock() {
  const n = freeLibrary().length;
  const link = checkoutUrl();
  useEffect(() => {
    track("unlock_viewed");
  }, []);
  return (
    <Container>
      <div className="pa-page">
        <p className="pa-kicker">The Adventure Passport</p>
        <h1 className="pa-h1">Get the full Passport</h1>
        <p className="pa-sub">
          The free passport is a real, working passport. The full Passport adds more to collect.
        </p>

        <div className="co-compare">
          <section className="pa-card" aria-labelledby="free-h">
            <h2 id="free-h" className="pa-h">
              Free, always
            </h2>
            <ul className="co-plain">
              <li>
                {n} free {n === 1 ? "adventure" : "adventures"} to try
              </li>
              <li>Mystery reveals matched to your dog</li>
              <li>A daily suggestion, “For you today”, from the free library</li>
              <li>A “This season” shelf of the free adventures tagged for the season</li>
              <li>Suggestions from your own smart collections</li>
              <li>Occasion ideas near your dog's birthday or adoption anniversary</li>
              <li>Stamps, milestones and memories</li>
              <li>Your own collections</li>
              <li>Keepsake postcards made on your device</li>
              <li>No account needed</li>
            </ul>
          </section>
          <section className="pa-card" aria-labelledby="full-h">
            <h2 id="full-h" className="pa-h">
              The full Passport adds
            </h2>
            <ul className="co-plain">
              <li>A much larger library of adventures to suggest from</li>
              <li>A fuller “This season” shelf, with the full library's seasonal adventures</li>
              <li>Yearly calendar reminders for your dog's birthday and adoption anniversary</li>
              <li>Smart-collection picks drawn from the larger library</li>
              <li>Collections that only exist in the full Passport</li>
              <li>More keepsake designs</li>
              <li>Synced progress that follows you across devices</li>
            </ul>
            <p className="pa-fine">One-time purchase, price shown at checkout. No subscription.</p>
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

        <p className="pa-fine">
          Every adventure is a gentle suggestion: your dog can stop at any time, and your vet is the
          one to ask about health questions.
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
