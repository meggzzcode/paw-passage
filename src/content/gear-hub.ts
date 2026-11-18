// Which products and categories the /gear hub shows. A category appears in navigation, tiles and the sitemap once it
// has MIN_LIVE or more active products (the same "no thin pages" rule as dog-type pages).
import { products, type Product, type GearPick } from "./gear";
import { gearCategories, getGearCategory, type GearCategory } from "./gear-categories";
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

export { getGearCategory };

/** The guide pick (bestFor, why, watch-outs) for a product, from the first public guide that features it. */
export function guidePickFor(productId: string, guides: Guide[] = allGuides): { pick: GearPick; guide: Guide } | undefined {
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
