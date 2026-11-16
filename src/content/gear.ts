// Products that gear guides can recommend. No prices, ratings or "tested" claims live here:
// prices change and we have not tested these products. Facts must come from the maker's own
// page or an independent standard, and the source is recorded so an editor can re-check it.
export interface Product {
  id: string;
  name: string;
  brand: string;
  /** What the product is, in plain words. */
  summary: string;
  /** Specs/claims taken from `specSource` (size range, weight limit, certification...). */
  keySpecs: string[];
  specSource: { title: string; url: string; publisher: string; accessedOn: string };
  /** Id of an entry in affiliates.ts. Leave unset until you are approved: no button is shown. */
  affiliateId?: string;
}

/** A product as it appears inside one gear guide. */
export interface GearPick {
  productId: string;
  /** Short label, e.g. "Best for car travel with one large dog". */
  bestFor: string;
  /** Why it made the list, tied to the criteria explained in the article. */
  whyItMadeTheList: string;
  /** Honest trade-offs and what to check before buying. */
  watchOuts: string[];
}

// Each gear guide keeps its products in src/content/gear/<guide-slug>.ts (export const products).
// They are collected here; a guide's `gear` array refers to them by id.
const modules = import.meta.glob<{ products: Product[] }>("./gear/*.ts", { eager: true });
export const products: Product[] = Object.values(modules).flatMap((m) => m.products ?? []);

export function getProduct(id: string, list: Product[] = products): Product | undefined {
  return list.find((p) => p.id === id);
}
