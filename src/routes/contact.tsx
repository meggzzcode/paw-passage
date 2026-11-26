import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { ContactEmail } from "@/components/site/ContactEmail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact Paw & Passage",
      description:
        "Contact Paw & Passage about the Adventure Passport, a purchase or refund, a correction to a guide, or press.",
      path: "/contact",
    }),
  component: () => (
    <InfoPage
      title="Contact"
      updated="2026-11-26"
      intro="A question about the Passport, a purchase, or something out of date? We'd like to hear from you."
    >
      <div className="prose-article mt-8">
        <p>
          <strong>Purchases and access:</strong> if you cannot unlock or restore the full Passport,
          tell us which device you used and the email address you bought with. Never send us your
          license code in an email. See also our <a href="/refund-policy">refund policy</a>.
        </p>
        <p>
          <strong>Corrections:</strong> if a rule or detail in one of our guides has changed, tell
          us the page and what changed. We review every correction and update the "last reviewed"
          date. See our <a href="/corrections">corrections log</a>.
        </p>
        <p>
          <strong>Business and press:</strong> use the email below. It is a business address; we do
          not publish personal contact details.
        </p>
        <p>Please do not send photos of your dog to this address. The Passport never needs them.</p>
      </div>
      <div className="mt-8">
        <ContactEmail subject="Hello from the Paw & Passage site" />
      </div>
    </InfoPage>
  ),
});
