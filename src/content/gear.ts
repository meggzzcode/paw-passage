import { products as records } from "virtual:content";
import type { GearCategorySlug } from "./products-schema";

// Products that gear guides can recommend. No prices, ratings or "tested" claims live here:
// prices change and we have not tested these products. Facts must come from the maker's own
// page or an independent standard, and the source is recorded so an editor can re-check it.
export interface Product {
  id: string;
  name: string;
  brand: string;
  /** Other exact spellings of the name used in guide text; each links to the affiliate link while the product earns. */
  aliases?: string[];
  /** Up to three short fact chips for the spec card (our own graphic, no photo). */
  cardSpecs?: string[];
  /** What the product is, in plain words. */
  summary: string;
  /** Specs/claims taken from `specSource` (size range, weight limit, certification...). */
  keySpecs: string[];
  specSource: { title: string; url: string; publisher: string; accessedOn: string };
  /**
   * The maker's own page for this product. The pick's button goes here until an affiliate link is approved
   * (then the affiliate link takes the button's place). If left out, the spec source is used when it is a web page.
   */
  productUrl?: string;
  /** Id of an entry in affiliates.ts. Leave unset until you are approved: no button is shown. */
  affiliateId?: string;
  /** Hub categories (first = primary). Set in content/products.yml. */
  categories?: GearCategorySlug[];
  /** Plain (non-affiliate) retailer page, used only when there is no approved affiliate link and no maker page. */
  retailerUrl?: string;
  retailerName?: string;
  /** Name of the affiliate program entry in content/affiliates.yml (reference only; never a URL). */
  affiliateProgram?: string;
  /** Plain second retailer shown as "Also at X". Never an affiliate link. */
  alternativeRetailer?: { name: string; url: string };
  /** Guide web addresses worth reading with this product. */
  relatedGuides?: string[];
  /** Why there is (or is no) photo: "none" = photo-less card. */
  imageSource?: string;
  imageRights?: "none" | "permitted" | "own";
  /** Plain text. "none cited" unless a named independent tester is cited. */
  manufacturerClaimsVsIndependentTesting?: string;
  /** Date (YYYY-MM-DD) the record was last read against its source page. */
  lastVerified?: string;
  /** false hides the product from guides, the packing tool and /gear while keeping the record. Default true. */
  active?: boolean;
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

// Products live in content/products.yml (editable in Pages CMS) and are checked by src/content/products-schema.ts.
// A guide's `gear` array refers to them by id.
export const products: Product[] = records.map((r) => ({
  id: r.id,
  name: r.name,
  brand: r.brand,
  ...(r.aliases.length ? { aliases: r.aliases } : {}),
  ...(r.cardSpecs.length ? { cardSpecs: r.cardSpecs } : {}),
  summary: r.summary,
  keySpecs: r.keySpecs,
  specSource: r.specSource,
  categories: r.categories,
  lastVerified: r.lastVerified,
  active: r.active,
  ...(r.manufacturerUrl ? { productUrl: r.manufacturerUrl } : {}),
  ...(r.retailerUrl ? { retailerUrl: r.retailerUrl } : {}),
  ...(r.retailerName ? { retailerName: r.retailerName } : {}),
  // affiliateTrackingId is the name of the link entry in content/affiliates.yml, so productLinkId() finds it.
  ...(r.affiliateTrackingId ? { affiliateId: r.affiliateTrackingId } : {}),
  ...(r.affiliateProgram ? { affiliateProgram: r.affiliateProgram } : {}),
  ...(r.alternativeRetailer ? { alternativeRetailer: r.alternativeRetailer } : {}),
  relatedGuides: r.relatedGuides,
  imageRights: r.imageRights,
  ...(r.imageSource ? { imageSource: r.imageSource } : {}),
  manufacturerClaimsVsIndependentTesting: r.manufacturerClaimsVsIndependentTesting,
}));

/** Products by id, for components that take ids from a guide's frontmatter. Unknown or inactive ids are skipped. */
export function getProducts(ids: string[], list: Product[] = products): Product[] {
  return ids.map((id) => getProduct(id, list)).filter((p): p is Product => !!p);
}

/** An inactive product is not found, so it drops out of guides, the packing tool and the hub. */
export function getProduct(id: string, list: Product[] = products): Product | undefined {
  return list.find((p) => p.id === id && p.active !== false);
}
