// Which products and categories the /gear hub shows. A category appears in navigation, tiles and the sitemap once it
// has MIN_LIVE or more active products (the same "no thin pages" rule as dog-type pages).
import { products, getProduct, type Product, type GearPick } from "./gear";
import {
  gearCategories,
  getGearCategory,
  legacyCategorySlugs,
  type GearCategory,
} from "./gear-categories";
import type { GearCategorySlug } from "./products-schema";
import { allGuides, getGuide, isPublic } from "./guides";
import { resolveProductLink } from "./gear-links";
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

// ---------------------------------------------------------------------------------------------------------------------
// Homepage curation. Everything the /gear homepage picks by hand lives below, as explicit product ids that point at the
// one catalog (content/products.yml). Nothing here duplicates product data: a record that is inactive, unknown or
// without a working link is dropped at render time, and tests (src/test/gear-curation.test.ts) fail if a config entry
// points at one. Order is the order written here, so output is deterministic.
// ---------------------------------------------------------------------------------------------------------------------

/** A trip collection needs at least this many shoppable products to be shown; otherwise the trip card is hidden. */
export const MIN_COLLECTION = 3;

export interface TripCollectionGroup {
  /** Short heading for the sub-group, e.g. "Keep them secure". */
  title: string;
  productIds: string[];
}

export interface TripCollection {
  /** Same slug as the matching entry in `shopByTrip`. */
  slug: string;
  /** Heading of the collection section on /gear?trip=<slug>. */
  heading: string;
  /** One or two sentences before the products. Descriptive only. */
  intro: string;
  groups: TripCollectionGroup[];
}

export const tripCollections: TripCollection[] = [
  {
    slug: "road-trip",
    heading: "Gear for a road trip",
    intro: "Keep the dog secure, get them in and out of the car, and keep the car clean.",
    groups: [
      {
        title: "Keep them secure in the car",
        productIds: [
          "kurgo-enhanced-strength-tru-fit",
          "lucky-duck-lucky-kennel",
          "kurgo-backseat-barrier",
        ],
      },
      {
        title: "Getting in and out",
        productIds: ["petsafe-happy-ride-extra-long-ramp", "petsafe-happy-ride-side-door-steps"],
      },
      {
        title: "Keep the car clean",
        productIds: ["kurgo-rover-hammock-extended-width", "kurgo-rover-cargo-cape"],
      },
      {
        title: "Water and food on the road",
        productIds: ["kurgo-collaps-a-bowl", "springland-22oz-original-travel-bottle"],
      },
    ],
  },
  {
    slug: "cabin-stay",
    heading: "Gear for a cabin stay",
    intro:
      "Contain the dog where there is no fenced yard, give them a place to settle, and clean up before checkout.",
    groups: [
      {
        title: "Containment",
        productIds: ["midwest-exercise-pen-with-door", "north-states-mypet-universal-petgate"],
      },
      {
        title: "Comfort",
        productIds: ["kurgo-loft-wander-dog-bed", "green-pet-shop-cool-pet-pad", "kong-classic"],
      },
      {
        title: "Cabin cleanup",
        productIds: [
          "soggy-doggy-microfiber-doormat",
          "soggy-doggy-super-shammy-towel",
          "pet-parents-pawtect-pads",
          "adventure-medical-kits-dog-wipes",
        ],
      },
    ],
  },
  {
    slug: "beach-and-lake",
    heading: "Gear for the beach and the lake",
    intro: "Flotation aids, a way to keep a dog cool, and a towel for the ride home.",
    groups: [
      {
        title: "On the water",
        productIds: [
          "ruffwear-float-coat",
          "outward-hound-dawson-swim-life-jacket",
          "ezydog-dfd-life-jacket",
        ],
      },
      {
        title: "Cool down and dry off",
        productIds: ["ruffwear-swamp-cooler", "soggy-doggy-super-shammy-towel"],
      },
      { title: "Drinking water", productIds: ["ruffwear-quencher-bowl"] },
    ],
  },
  {
    slug: "winter-trip",
    heading: "Gear for a winter trip",
    intro:
      "Layers, boots and a light for short days, plus something to catch the slush at the door.",
    groups: [
      {
        title: "Layers and boots",
        productIds: [
          "ruffwear-climate-changer-fleece",
          "ruffwear-timberline-fuse-vest",
          "ruffwear-polar-trex-boots",
        ],
      },
      {
        title: "Visibility and cleanup",
        productIds: ["ruffwear-the-beacon-dog-safety-light", "soggy-doggy-microfiber-doormat"],
      },
    ],
  },
  {
    slug: "hiking",
    heading: "Gear for the trail",
    intro: "A harness, a leash, boots, water and a small first aid kit for a day on the trail.",
    groups: [
      {
        title: "On the trail",
        productIds: [
          "ruffwear-web-master-harness",
          "ruffwear-knot-a-leash",
          "ruffwear-grip-trex-boots",
        ],
      },
      {
        title: "Water and safety",
        productIds: [
          "ruffwear-quencher-bowl",
          "springland-20oz-flip-travel-bottle",
          "amk-trail-dog",
          "ruffwear-the-beacon-dog-safety-light",
        ],
      },
    ],
  },
];

/** True when the product exists, is active and has a button we can honestly show (approved affiliate, maker or retailer). */
export function isShoppable(p: Product | undefined): p is Product {
  return !!p && p.active !== false && !!resolveProductLink(p);
}

export interface ResolvedTripGroup {
  title: string;
  products: Product[];
}
export interface ResolvedTripCollection {
  trip: GearShortcut;
  collection: TripCollection;
  groups: ResolvedTripGroup[];
  count: number;
}

/**
 * The collection for a trip slug with unusable products and empty groups removed, or undefined when fewer than
 * MIN_COLLECTION shoppable products remain (we show fewer good products rather than padding).
 */
export function resolveTripCollection(
  slug: string,
  list: Product[] = products,
): ResolvedTripCollection | undefined {
  const trip = shopByTrip.find((t) => t.slug === slug);
  const collection = tripCollections.find((c) => c.slug === slug);
  if (!trip || !collection) return undefined;
  const seen = new Set<string>();
  const groups = collection.groups
    .map((g) => ({
      title: g.title,
      products: g.productIds
        .map((id) => getProduct(id, list))
        .filter(isShoppable)
        .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true))),
    }))
    .filter((g) => g.products.length > 0);
  const count = groups.reduce((n, g) => n + g.products.length, 0);
  return count >= MIN_COLLECTION ? { trip, collection, groups, count } : undefined;
}

/** Trip shortcuts that have a real collection behind them, in `shopByTrip` order. */
export function liveTrips(list: Product[] = products): GearShortcut[] {
  return shopByTrip.filter((t) => !!resolveTripCollection(t.slug, list));
}

/** Hand-picked products for "A few good places to start": one per job, spread across trips. Order is display order. */
export const featuredProductIds: string[] = [
  "midwest-exercise-pen-with-door", // cabin containment (guide pick)
  "kurgo-loft-wander-dog-bed", // comfort
  "soggy-doggy-microfiber-doormat", // cabin cleanup
  "petsafe-happy-ride-extra-long-ramp", // getting into the car
  "amk-trail-dog", // safety and first aid (guide pick)
];

export interface FeaturedGear {
  product: Product;
  /** Guide that features the product, when one does. */
  guideSlug?: string;
}

export function featuredGear(list: Product[] = products): FeaturedGear[] {
  return featuredProductIds
    .map((id) => getProduct(id, list))
    .filter(isShoppable)
    .map((product) => {
      const guide = guidePickFor(product.id)?.guide.slug;
      return {
        product,
        ...(guide ? { guideSlug: guide } : {}),
      };
    });
}

/** Guides offered under "Plan the trip, not just the packing", in order. Unknown or unpublished slugs are skipped. */
export const planGuideSlugs: string[] = [
  "dog-ramp-or-steps-for-the-car-and-cabin",
  "protect-your-car-interior-from-a-dog-on-a-road-trip",
  "dog-travel-bowls-and-food-storage",
  "cold-weather-dog-gear-for-winter-cabin-trips",
];

export function planGuides(guides: Guide[] = allGuides): Guide[] {
  return planGuideSlugs
    .map((s) => guides.find((g) => g.slug === s) ?? getGuide(s))
    .filter((g): g is Guide => !!g && isPublic(g))
    .slice(0, 3);
}

/** Search params of /gear: `?trip=cabin-stay` shows that trip's collection. Unknown or empty trips are dropped. */
export function parseGearSearch(search: Record<string, unknown>): { trip?: string } {
  const trip = typeof search["trip"] === "string" ? search["trip"] : undefined;
  return trip && resolveTripCollection(trip) ? { trip } : {};
}
