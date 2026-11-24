import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/corrections")({
  head: () =>
    pageHead({
      title: "Corrections and updates",
      description:
        "A dated log of notable corrections and changes to Paws & Passage guides, gear pages and tools, plus how to report an error you have spotted.",
      path: "/corrections",
    }),
  component: () => (
    <InfoPage
      title="Corrections and updates"
      updated="2026-11-18"
      intro="A plain log of notable changes. Entries are added when something is corrected or removed."
      body={`## Report a problem

If a rule, fee or detail has changed or is wrong, [contact us](/contact) with the page and what changed. We check it against the source, fix confirmed errors and update the page's review date. Our standards are in [editorial standards](/editorial-standards).

## Log

| Date | Page | What changed |
|---|---|---|
| 2026-11-18 | Seven guides (four destination and getaway guides, a water and feeding gear guide, a rental protection gear guide, and Airbnb vs Vrbo) | Retired. Their old URLs redirect (301) to the closest current page. |
| 2026-11-18 | Dog-friendly rental pools and hot tubs guide | Corrected how we describe Twiddy's pool rule. Twiddy's own pet page says pets are not permitted in pools or hot tubs, although the page used in our dataset named only one home. |

Earlier fixes made before this page existed are not listed.`}
    />
  ),
});
