import { BRAND } from "@/config/brand";
import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { Button } from "@/components/shell/Button";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FaqList } from "@/components/site/FaqList";
import { TrustStrip } from "@/components/site/TrustStrip";
import { PurchasePrompt } from "@/components/site/PurchasePrompt";
import { FAQS } from "@/components/site/faq-content";
import { breadcrumbLd, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => ({
    ...pageHead({
      title: "Adventure Passport FAQ",
      description:
        "Answers about the Adventure Passport: what you buy, the free adventure, puppies and senior dogs, privacy, restoring access and refunds.",
      path: "/faq",
    }),
    scripts: [
      breadcrumbLd([{ name: "FAQ", path: "/faq" }]),
      {
        type: "application/ld+json",
        children: jsonLd({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <Container>
      <div className="pp-landing">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "FAQ" }]} />
        <h1 className="pp-h1">Questions, answered</h1>
        <p className="pp-lede">
          What the Adventure Passport is, what is free, what you pay for, and how your dog and your
          photos are treated.
        </p>
        <FaqList />
        <TrustStrip />
        <p className="pp-cta-row">
          <Button to="/discover">{BRAND.hero.primaryCta}</Button>
          <Button to="/unlock" variant="secondary">
            See what is included
          </Button>
        </p>
        <PurchasePrompt where="faq" />
      </div>
    </Container>
  );
}
