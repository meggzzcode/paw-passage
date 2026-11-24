// Which products the planner may suggest for an item, and how they are described. Matching is by the item's own
// product list in content/packing.yml, the trip (only/unless conditions the content states), the product being
// active and having a working link, and a caution that is always shown. Suitability is never inferred from
// "older dog" or "large dog". The link itself always comes from resolveProductLink() (affiliate link when approved,
// else the maker's page); this file builds no URL and stores none.
import { products as catalog, getProduct, type Product } from "@/content/gear";
import { resolveProductLink, type ResolvedProductLink } from "@/content/gear-links";
import { isAmazon, getApprovedLink } from "@/content/affiliates";
import { productLinkId } from "@/content/affiliate-usage";
import { productEntryApplies, type Trip } from "./engine";
import type { PackingConfig, PackingItem } from "./schema";

export interface Recommendation {
  role: "primary" | "alternative";
  product: Product;
  link: ResolvedProductLink;
  /** Button text that matches where the link goes. */
  ctaLabel: string;
  /** True for an approved affiliate link (the visitor's purchase may earn a commission). */
  affiliate: boolean;
  amazon: boolean;
  because: string | undefined;
  caution: string;
  /** One sentence: what it is. */
  benefit: string;
  facts: string[];
}

/** "View at Amazon" for an affiliate link, "See at the manufacturer" for a maker page. Never a checkout label for an information page. */
export function ctaLabelFor(link: ResolvedProductLink): string {
  if (link.kind === "affiliate")
    return `View at ${(link.network ?? "the store").replace(/ Associates$/i, "")}`;
  if (link.kind === "manufacturer") return "See at the manufacturer";
  return "See at the retailer";
}

export interface ShoppingDeps {
  products?: Product[];
  resolve?: (p: Product) => ResolvedProductLink | undefined;
}

const firstSentence = (s: string) => {
  const m = /^(.+?[.!?])(\s|$)/.exec(s.trim());
  return (m ? m[1]! : s.trim()).trim();
};

/** At most two: the first suitable product, and one more only when the content says how it differs. */
export function recommendationsFor(
  item: PackingItem,
  trip: Trip,
  cfg: PackingConfig,
  deps: ShoppingDeps = {},
): Recommendation[] {
  const list = deps.products ?? catalog;
  const resolve = deps.resolve ?? ((p: Product) => resolveProductLink(p));
  const out: Recommendation[] = [];
  for (const entry of item.products) {
    if (out.length >= 2) break;
    if (!productEntryApplies(entry, trip, cfg)) continue;
    const product = getProduct(entry.id, list);
    if (!product) continue;
    const link = resolve(product);
    if (!link) continue;
    if (out.length === 1 && !entry.because) continue;
    out.push({
      role: out.length === 0 ? "primary" : "alternative",
      product,
      link,
      ctaLabel: ctaLabelFor(link),
      affiliate: link.kind === "affiliate",
      amazon: link.kind === "affiliate" && isAmazonNetwork(link.network),
      because: out.length === 0 ? undefined : entry.because,
      caution: entry.caution,
      benefit: entry.benefit ?? firstSentence(product.summary),
      facts: (product.cardSpecs ?? []).slice(0, 3),
    });
  }
  return out;
}

function isAmazonNetwork(network: string | undefined): boolean {
  return !!network && isAmazon({ id: "", network, url: "", approved: true });
}

/** True when any of these suggestions would show an Amazon affiliate button (so the Amazon sentence must be shown). */
export function needsAmazonSentence(recs: Recommendation[]): boolean {
  return recs.some((r) => r.amazon);
}
export function hasAffiliate(recs: Recommendation[]): boolean {
  return recs.some((r) => r.affiliate);
}

/** For tests and tooling: does this product id resolve to an approved affiliate link right now? */
export function hasApprovedLink(p: Product): boolean {
  return !!getApprovedLink(productLinkId(p));
}
