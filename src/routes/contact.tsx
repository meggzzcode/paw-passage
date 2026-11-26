import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { ContactEmail } from "@/components/site/ContactEmail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact Paws & Passage",
      description:
        "Contact Paws & Passage about the Adventure Passport, a purchase or refund, a correction to a guide, or press.",
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
          <strong>Purchases and access:</strong> first try{" "}
          <a href="/restore-access">Restore access</a> with the license key from your purchase
          email. If that does not work, email us the address you bought with, the date, and which
          device and browser you used. Never send your license key. Refunds: see our{" "}
          <a href="/refund-policy">refund policy</a>.
        </p>
        <p>
          <strong>Your data:</strong> to download or delete your synced Passport copy, use the
          buttons on your Passport page once you are signed in. If you cannot sign in and want a
          record deleted, or have a privacy question, email us. See our{" "}
          <a href="/privacy">privacy policy</a>.
        </p>
        <p>
          <strong>Corrections:</strong> if a rule or detail in one of our guides has changed, tell
          us the page and what changed. We review every correction and update the "last reviewed"
          date. See our <a href="/corrections">corrections log</a>.
        </p>
        <p>
          <strong>Business and press:</strong> use the same email. It is a business address; we do
          not publish personal contact details. There is no phone line, chat or contact form.
        </p>
        <p>Please do not send photos of your dog. The Passport never needs them.</p>
      </div>
      <div className="mt-8">
        <ContactEmail subject="Hello from the Paws & Passage site" />
      </div>
    </InfoPage>
  ),
});
