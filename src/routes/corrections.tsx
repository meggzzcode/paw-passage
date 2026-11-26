import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/corrections")({
  head: () =>
    pageHead({
      title: "Corrections and updates",
      description:
        "A dated log of notable corrections and changes to Paw & Passage guides, gear pages and the Adventure Passport, plus how to report an error you have spotted.",
      path: "/corrections",
    }),
  component: () => (
    <InfoPage
      title="Corrections and updates"
      updated="2026-11-26"
      intro="A plain log of notable changes. Entries are added when something is corrected or removed."
      body={`## Report a problem

If a rule or detail has changed or is wrong, [contact us](/contact) with the page and what changed. We check it against the source, fix confirmed errors and update the page's review date. Our standards are in [editorial standards](/editorial-standards).

## Log

| Date | Page | What changed |
|---|---|---|
| 2026-11-26 | Whole site | Paw & Passage is now the Adventure Passport. The earlier dog-friendly stays directory, destination pages, rental pet-policy data, rental guides and their tools were retired and are no longer published. Their old addresses now say the page is gone. |
| 2026-11-26 | Guides | Guides that only served the stays directory were retired. The dog travel, outdoor, safety and gear guides remain, with links to retired pages removed. |

Earlier fixes made before this page was rewritten are not listed.`}
    />
  ),
});
