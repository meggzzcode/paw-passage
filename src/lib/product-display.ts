// Shared display helpers for product cards (pick cards, gear blocks, hub cards).
import type { GearCategorySlug } from "@/content/products-schema";

/** "KONG" + "KONG Classic" -> "KONG Classic"; never repeats the brand when the name already starts with it. */
export function productTitle(p: { brand: string; name: string }): string {
  const brand = p.brand.trim();
  const name = p.name.trim();
  if (!brand) return name;
  const b = brand.toLowerCase();
  const n = name.toLowerCase();
  if (n === b || n.startsWith(`${b} `) || n.startsWith(`${b}-`) || n.startsWith(`${b}'`))
    return name;
  // A longer corporate brand ("MidWest Homes for Pets") whose first word already starts the name ("MidWest Exercise Pen").
  const first = b.split(/\s+/)[0] ?? "";
  if (first.length >= 4 && n.startsWith(`${first} `)) return name;
  return `${brand} ${name}`;
}

/** The product name without its brand, for cards that already show the brand on its own line. */
export function productNameOnly(p: { brand: string; name: string }): string {
  const brand = p.brand.trim();
  const name = p.name.trim();
  if (!brand) return name;
  const b = brand.toLowerCase();
  const n = name.toLowerCase();
  const strip = (prefix: string) =>
    name
      .slice(prefix.length)
      .replace(/^[\s\-']+/, "")
      .trim();
  if (n.startsWith(`${b} `) || n.startsWith(`${b}-`)) return strip(b) || name;
  const first = b.split(/\s+/)[0] ?? "";
  if (first.length >= 4 && n.startsWith(`${first} `)) return strip(first) || name;
  return name;
}

/** Short job label for a pick card when the directive gives none. */
export const DEFAULT_PICK_LABELS: Record<GearCategorySlug, string> = {
  "car-safety": "Car safety pick",
  "car-interior": "Seat protection pick",
  "ramps-and-steps": "Ramp pick",
  "feeding-and-hydration": "Bowl and food pick",
  "pens-and-gates": "Containment pick",
  "comfort-and-cooling": "Comfort pick",
  "water-and-beach": "Water safety pick",
  "trail-and-hiking": "Trail gear pick",
  "cold-weather": "Cold-weather pick",
  "safety-id-first-aid": "Safety pick",
  "rental-cleanup": "Cleanup pick",
};

export function defaultPickLabel(p: { categories?: readonly string[] | undefined }): string {
  const c = p.categories?.[0];
  return (c && (DEFAULT_PICK_LABELS as Record<string, string>)[c]) || "Our pick";
}

/** Product ids that have a {{pick:id}} card in the article body. */
export function pickIdsInBody(body: string): string[] {
  return [...new Set([...body.matchAll(/^\{\{pick:([a-z0-9-]+)/gm)].map((m) => m[1]!))];
}
