// Categories for the /gear hub. Copy is descriptive only: no prices, ratings or "tested" claims, and no suitability
// claim the makers do not state. Which products belong to a category is set in content/products.yml (categories).
import type { GearCategorySlug } from "./products-schema";

export interface GearCategory {
  slug: GearCategorySlug;
  name: string;
  /** One line for tiles. */
  tagline: string;
  /** Two sentences at the top of the category page. */
  intro: string;
  /** Existing guides worth reading first (shown only if public). */
  guideSlugs?: string[];
  /** An existing /dogs/<slug> page for readers with this kind of dog. */
  dogTypeSlug?: string;
}

export const gearCategories: GearCategory[] = [
  { slug: "road-trips", name: "Road trips", tagline: "Car restraint, hammock and feeding gear for the drive.", intro: "Gear for the drive itself: restraints, a seat cover and feeding items. Each card says what the maker states and what we could not find on the maker's page.", guideSlugs: ["dog-car-safety-harness-and-crate-guide"] },
  { slug: "cabin-vacations", name: "Cabin vacations", tagline: "Fences, pens and bedding for a rental.", intro: "Portable pens, yard panels and bedding for staying in a rental. Check the rental's own rules first: some hosts limit what you can set up.", guideSlugs: ["portable-dog-fence-and-playpen-guide-for-rentals"] },
  { slug: "beach-vacations", name: "Beach vacations", tagline: "Gear for beach trips.", intro: "Gear for beach trips." },
  { slug: "senior-dogs", name: "Senior dogs", tagline: "Gear for older dogs.", intro: "Gear for older dogs.", dogTypeSlug: "senior-dogs" },
  { slug: "large-dogs", name: "Large dogs", tagline: "Picks whose makers state sizes for bigger dogs.", intro: "Products whose makers publish sizes or weights for larger dogs. Size ranges differ by maker, so each card quotes the range the maker states.", dogTypeSlug: "big-dogs" },
  { slug: "multiple-dogs", name: "Multiple dogs", tagline: "Gear for travelling with more than one dog.", intro: "Gear for travelling with more than one dog.", dogTypeSlug: "multi-dog-families" },
  { slug: "travel-safety", name: "Travel safety", tagline: "First aid, car safety and ID or tracking.", intro: "Items for when something goes wrong: first aid kits, car restraints, and ID or tracking for a dog that gets loose. Safety claims are quoted from the maker or the independent body named on each card.", guideSlugs: ["dog-travel-first-aid-kit-guide", "if-your-dog-gets-loose-on-a-trip", "dog-car-safety-harness-and-crate-guide"] },
  { slug: "feeding-and-hydration", name: "Feeding and hydration", tagline: "Bowls, bottles and food carriers.", intro: "Bowls, bottles and a food carrier for the road and the rental. Capacities are the sizes the maker lists.", guideSlugs: [] },
  { slug: "travel-comfort", name: "Travel comfort", tagline: "Beds, throws and hammocks.", intro: "Beds, throws and a seat hammock to keep a dog comfortable and a rental clean. Dimensions and materials come from the maker's page.", guideSlugs: [] },
];

export function getGearCategory(slug: string): GearCategory | undefined {
  return gearCategories.find((c) => c.slug === slug);
}
