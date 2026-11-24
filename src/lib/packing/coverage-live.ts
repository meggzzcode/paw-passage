// The coverage report for the real catalog. Used by the test and by scripts/gear-coverage-report.ts.
import { products } from "@/content/gear";
import { liveCategories, tripCollections, featuredProductIds } from "@/content/gear-hub";
import { resolveProductLink } from "@/content/gear-links";
import { packingConfig } from "@/content/packing";
import { classifyCoverage, renderCoverageMarkdown, type CoverageReport } from "./coverage";

/** Products that are deliberately information-only (no button). None today: every active product has a link. */
export const INFO_ONLY: Record<string, string> = {};

export function liveCoverage(): CoverageReport {
  return classifyCoverage({
    products,
    cfg: packingConfig,
    liveCategories: liveCategories().map((c) => ({ slug: c.slug, name: c.name })),
    tripCollections: tripCollections.map((t) => ({
      slug: t.slug,
      heading: t.heading,
      productIds: t.groups.flatMap((g) => g.productIds),
    })),
    featuredProductIds,
    linkKind: (id) => {
      const p = products.find((x) => x.id === id);
      return p ? resolveProductLink(p)?.kind : undefined;
    },
    infoOnly: INFO_ONLY,
  });
}

export function liveCoverageMarkdown(): string {
  return renderCoverageMarkdown(liveCoverage(), packingConfig);
}
