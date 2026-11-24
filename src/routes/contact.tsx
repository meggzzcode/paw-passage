import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { ContactEmail } from "@/components/site/ContactEmail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact Paws & Passage",
      description:
        "Get in touch with Paws & Passage about a correction, a partnership or listing a dog-friendly property. Tell us what is out of date and where you saw it.",
      path: "/contact",
    }),
  component: () => (
    <InfoPage
      title="Contact"
      updated="2026-11-18"
      intro="Spotted something out of date, or want to work with us? We'd like to hear from you."
    >
      <div className="prose-article mt-8">
        <p>
          <strong>Corrections:</strong> If a rule, fee or detail in one of our guides has changed,
          tell us the page and what changed. We review every correction and update the "last
          reviewed" date.
        </p>
        <p>
          <strong>Hosts:</strong> see <a href="/list-your-property">List your property</a> for what
          to send.
        </p>
        <p>
          <strong>Business and press:</strong> use the email below. It is a business address; we do
          not publish personal contact details. See also our{" "}
          <a href="/corrections">corrections log</a>.
        </p>
      </div>
      <div className="mt-8">
        <ContactEmail subject="Hello from the Paws & Passage site" />
      </div>
    </InfoPage>
  ),
});
