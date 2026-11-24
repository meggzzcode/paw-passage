// What a /gear/<category> page shows, worked out from the catalog. Kept out of the route so tests can call it directly.
// Primary vs secondary: a product's first category is its primary one; a second entry is a cross-listing and shows as a
// compact related row on that category's page (docs/GEAR-TAXONOMY.md).
import { products, type Product } from "./gear";
import { gearCategories, getGearCategory, type GearCategory } from "./gear-categories";
import { categoryIsLive, categoryProducts, guidesFeaturing } from "./gear-hub";
import { allGuides, getGuide, isPublic } from "./guides";
import { dogTypeIsLive, getDogType } from "./dog-types";
import type { Guide } from "./types";

/** The most guides a category page lists, so related reading never turns into a wall of cards. */
export const MAX_CATEGORY_GUIDES = 3;

export interface CategoryView {
  category: GearCategory;
  /** Products whose primary category this is, in catalog order. */
  primary: Product[];
  /** Cross-listed products (this is their second category), in catalog order. */
  secondary: Product[];
  guides: Guide[];
  /** A live /dogs page for readers with this kind of dog, if the category names one. */
  dogType?: { slug: string; name: string };
  /** Safety-critical categories keep their essential distinctions visible above the products. */
  safetyCritical: boolean;
  /** Two or three plain sentences for safety-critical categories. */
  safetyNote?: string;
}

/** True for the categories where a wrong choice can hurt the dog: restraints, ramps and steps, pens and gates. */
export function isSafetyCritical(c: GearCategory): boolean {
  return !!c.safetyNote;
}

/** The page model, or undefined when the slug is unknown or the category has no active products (the page is a 404). */
export function buildCategoryView(
  slug: string,
  list: Product[] = products,
  guideList: Guide[] = allGuides,
): CategoryView | undefined {
  const category = getGearCategory(slug);
  if (!category) return undefined;
  const all = categoryProducts(slug, list);
  if (all.length === 0) return undefined;
  const primary = all.filter((p) => p.categories?.[0] === slug);
  const secondary = all.filter((p) => p.categories?.[0] !== slug);
  const named = (category.guideSlugs ?? []).map((s) =>
    guideList === allGuides ? getGuide(s) : guideList.find((g) => g.slug === s),
  );
  const guides = [
    ...new Map(
      [...named, ...guidesFeaturing(all, guideList)]
        .filter((g): g is Guide => !!g && isPublic(g))
        .map((g) => [g.slug, g]),
    ).values(),
  ].slice(0, MAX_CATEGORY_GUIDES);
  const dt = category.dogTypeSlug ? getDogType(category.dogTypeSlug) : undefined;
  const dogType = dt && dogTypeIsLive(dt) ? { slug: dt.slug, name: dt.name } : undefined;
  return {
    category,
    primary,
    secondary,
    guides,
    ...(dogType ? { dogType } : {}),
    safetyCritical: isSafetyCritical(category),
    ...(category.safetyNote ? { safetyNote: category.safetyNote } : {}),
  };
}

/** Other live categories for the footer navigation (the same two the page has always linked). */
export function siblingCategories(slug: string, list: Product[] = products, n = 2): GearCategory[] {
  return gearCategories.filter((x) => x.slug !== slug && categoryIsLive(x.slug, list)).slice(0, n);
}
