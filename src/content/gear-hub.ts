// Which products and categories the /gear hub shows. A category appears in navigation, tiles and the sitemap once it
// has MIN_LIVE or more active products (the same "no thin pages" rule as dog-type pages).
import { products, type Product, type GearPick } from "./gear";
import {
  gearCategories,
  getGearCategory,
  legacyCategorySlugs,
  type GearCategory,
} from "./gear-categories";
import type { GearCategorySlug } from "./products-schema";
import { allGuides, isPublic } from "./guides";
import type { Guide } from "./types";

export const MIN_LIVE = 3;

export function categoryProducts(slug: string, list: Product[] = products): Product[] {
  return list.filter((p) => p.active !== false && (p.categories ?? []).includes(slug as never));
}

export function categoryIsLive(slug: string, list: Product[] = products): boolean {
  return categoryProducts(slug, list).length >= MIN_LIVE;
}

export function liveCategories(list: Product[] = products): GearCategory[] {
  return gearCategories.filter((c) => categoryIsLive(c.slug, list));
}

/** True once at least one category is live: the Gear menu item, footer link, tile and sitemap entries appear. */
export function hasGear(list: Product[] = products): boolean {
  return liveCategories(list).length > 0;
}

export { getGearCategory, legacyCategorySlugs };

/** The guide pick (bestFor, why, watch-outs) for a product, from the first public guide that features it. */
export function guidePickFor(
  productId: string,
  guides: Guide[] = allGuides,
): { pick: GearPick; guide: Guide } | undefined {
  for (const g of guides.filter(isPublic)) {
    const pick = g.gear?.find((x) => x.productId === productId);
    if (pick) return { pick, guide: g };
  }
  return undefined;
}

/** Public guides that feature at least one of these products. */
export function guidesFeaturing(list: Product[], guides: Guide[] = allGuides): Guide[] {
  const ids = new Set(list.map((p) => p.id));
  return guides.filter(isPublic).filter((g) => (g.gear ?? []).some((x) => ids.has(x.productId)));
}

/** The first live /gear category a product belongs to (its primary one when live), for "see more like this" links. */
export function liveCategoryFor(p: Product, list: Product[] = products): GearCategory | undefined {
  for (const slug of p.categories ?? [])
    if (categoryIsLive(slug, list)) return getGearCategory(slug);
  return undefined;
}

/** The new category slug an old /gear/<slug> address points to, or undefined when the slug was never a category. */
export function legacyRedirectFor(slug: string): GearCategorySlug | undefined {
  return Object.hasOwn(legacyCategorySlugs, slug) ? legacyCategorySlugs[slug] : undefined;
}

/** A shortcut on the hub: a trip or a kind of dog, linking to category pages and (for dogs) a /dogs page. */
export interface GearShortcut {
  slug: string;
  label: string;
  /** One line under the label. */
  line: string;
  /** Category pages (/gear/<slug>) this shortcut links to, in order. */
  categorySlugs: GearCategorySlug[];
  /** An existing /dogs/<slug> page, for dog shortcuts. */
  dogTypeSlug?: string;
}

export const shopByTrip: GearShortcut[] = [
  {
    slug: "road-trip",
    label: "Road trip",
    line: "Restraints, seat covers, ramps and bowls for the drive.",
    categorySlugs: ["car-safety", "car-interior", "ramps-and-steps", "feeding-and-hydration"],
  },
  {
    slug: "cabin-stay",
    label: "Cabin stay",
    line: "Pens, beds and cleanup for a rental with a dog.",
    categorySlugs: ["pens-and-gates", "comfort-and-cooling", "rental-cleanup"],
  },
  {
    slug: "beach-and-lake",
    label: "Beach and lake",
    line: "Life jackets and ways to keep a dog cool.",
    categorySlugs: ["water-and-beach", "comfort-and-cooling"],
  },
  {
    slug: "winter-trip",
    label: "Winter trip",
    line: "Fleece, a vest and snow boots.",
    categorySlugs: ["cold-weather"],
  },
  {
    slug: "hiking",
    label: "Hiking",
    line: "Harness, boots and a leash for the trail.",
    categorySlugs: ["trail-and-hiking"],
  },
];

export const shopByDog: GearShortcut[] = [
  {
    slug: "large-dogs",
    label: "Large dogs",
    line: "Ramps and car restraints, with the sizes the makers list.",
    categorySlugs: ["ramps-and-steps", "car-safety"],
    dogTypeSlug: "big-dogs",
  },
  {
    slug: "senior-dogs",
    label: "Senior dogs",
    line: "Ramps and steps for getting into a car.",
    categorySlugs: ["ramps-and-steps"],
    dogTypeSlug: "senior-dogs",
  },
  {
    slug: "escape-artists",
    label: "Escape artists",
    line: "GPS, ID and a safety light for a dog that bolts.",
    categorySlugs: ["safety-id-first-aid"],
    dogTypeSlug: "escape-artists",
  },
  {
    slug: "multi-dog-families",
    label: "Multi-dog families",
    line: "Pens and gates for more than one dog.",
    categorySlugs: ["pens-and-gates"],
    dogTypeSlug: "multi-dog-families",
  },
];

/** Only the shortcuts whose category pages are live, with those pages resolved, for the hub UI. */
export function liveShortcuts(
  list: GearShortcut[],
  products_: Product[] = products,
): (GearShortcut & { categories: GearCategory[] })[] {
  return list
    .map((s) => ({
      ...s,
      categories: s.categorySlugs
        .filter((c) => categoryIsLive(c, products_))
        .map((c) => getGearCategory(c))
        .filter((c): c is GearCategory => !!c),
    }))
    .filter((s) => s.categories.length > 0);
}
