import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";
import { AMAZON_DISCLOSURE } from "@/content/affiliates";
import { affiliateDisclosureBody } from "@/lib/disclosure";

export const Route = createFileRoute("/affiliate-disclosure")({
  head: () =>
    pageHead({
      title: "Affiliate disclosure",
      description:
        "Where Paw & Passage earns money through affiliate links, where the notices appear, and how our product choices work.",
      path: "/affiliate-disclosure",
    }),
  component: () => (
    <InfoPage
      title="Affiliate disclosure"
      updated="2026-11-26"
      body={affiliateDisclosureBody(AMAZON_DISCLOSURE)}
    />
  ),
});
