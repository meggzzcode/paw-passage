// Gear coverage: for every ACTIVE product in content/products.yml, how a visitor can reach it from the packing planner
// and the Gear hub. Pure (data in, report out) so the build-time script and the tests classify the same way.
//
//   1  recommended directly by a packing item (listed under the item's `products` in content/packing.yml)
//   2  not listed by an item, but in a live Gear category the planner links to (an item's gearCategory, or the category
//      of a product an item lists): reachable from "Need to buy" and the pick-up list
//   3  only through the Gear hub: a live category page, a trip collection or the featured picks, not linked by the planner
//   4  unreachable: none of the above. This must be zero. Fix it by category wiring (content/products.yml categories),
//      never by padding a packing list.
//
// Every active product also needs a valid outbound link (resolveProductLink) or a documented info-only status.
import type { PackingConfig } from "./schema";

export type CoverageClass = 1 | 2 | 3 | 4;

export interface CoverageProduct {
  id: string;
  name: string;
  brand: string;
  active?: boolean | undefined;
  categories?: readonly string[] | undefined;
}

export interface CoverageInput {
  products: readonly CoverageProduct[];
  cfg: PackingConfig;
  /** Category slugs with enough active products to have a page, in display order. */
  liveCategories: readonly { slug: string; name: string }[];
  /** Gear trip collections: slug, heading and the product ids they show. */
  tripCollections: readonly { slug: string; heading: string; productIds: readonly string[] }[];
  featuredProductIds: readonly string[];
  /** The kind of outbound link the product resolves to today, or undefined for none. */
  linkKind: (id: string) => "affiliate" | "manufacturer" | "retailer" | undefined;
  /** Products that are on purpose information-only (no button), with the reason. Empty today. */
  infoOnly?: Readonly<Record<string, string>>;
}

export interface CoverageRow {
  id: string;
  name: string;
  brand: string;
  class: CoverageClass;
  /** Packing items that list the product directly (class 1). */
  items: string[];
  /** Live Gear categories the product is on. */
  categories: string[];
  /** The planner-linked categories among them (class 2). */
  plannerCategories: string[];
  trips: string[];
  featured: boolean;
  link: "affiliate" | "manufacturer" | "retailer" | "info-only" | "none";
}

export interface CoverageReport {
  rows: CoverageRow[];
  counts: Record<CoverageClass, number>;
  total: number;
  /** Active products with no outbound link and no documented info-only status. */
  noLink: string[];
  /** Products switched off in content/products.yml (not counted above). */
  inactive: number;
}

export const CLASS_LABELS: Record<CoverageClass, string> = {
  1: "Directly recommended by a packing item",
  2: "Reachable through a live Gear category the planner links to",
  3: "Reachable only through the Gear hub",
  4: "Unreachable (must be zero)",
};

export function classifyCoverage(input: CoverageInput): CoverageReport {
  const { cfg } = input;
  const active = input.products.filter((p) => p.active !== false);
  const byId = new Map(active.map((p) => [p.id, p]));
  const live = new Set(input.liveCategories.map((c) => c.slug));

  const itemsFor = new Map<string, string[]>();
  for (const item of cfg.items) {
    if (item.active === false) continue;
    for (const e of item.products) {
      if (!byId.has(e.id)) continue;
      const list = itemsFor.get(e.id) ?? [];
      if (!list.includes(item.id)) list.push(item.id);
      itemsFor.set(e.id, list);
    }
  }

  // Categories the planner points to: an item's own gearCategory, and the categories of products it lists.
  const planner = new Set<string>();
  for (const item of cfg.items) {
    if (item.active === false) continue;
    if (item.gearCategory && live.has(item.gearCategory)) planner.add(item.gearCategory);
    for (const e of item.products)
      for (const c of byId.get(e.id)?.categories ?? []) if (live.has(c)) planner.add(c);
  }

  const tripsFor = new Map<string, string[]>();
  for (const t of input.tripCollections)
    for (const id of t.productIds) {
      const list = tripsFor.get(id) ?? [];
      if (!list.includes(t.slug)) list.push(t.slug);
      tripsFor.set(id, list);
    }
  const featured = new Set(input.featuredProductIds);
  const catName = new Map(input.liveCategories.map((c) => [c.slug, c.name]));

  const rows: CoverageRow[] = active.map((p) => {
    const items = itemsFor.get(p.id) ?? [];
    const categories = (p.categories ?? []).filter((c) => live.has(c));
    const plannerCategories = categories.filter((c) => planner.has(c));
    const trips = tripsFor.get(p.id) ?? [];
    const isFeatured = featured.has(p.id);
    const cls: CoverageClass =
      items.length > 0
        ? 1
        : plannerCategories.length > 0
          ? 2
          : categories.length > 0 || trips.length > 0 || isFeatured
            ? 3
            : 4;
    const kind = input.linkKind(p.id);
    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      class: cls,
      items,
      categories: categories.map((c) => catName.get(c) ?? c),
      plannerCategories: plannerCategories.map((c) => catName.get(c) ?? c),
      trips,
      featured: isFeatured,
      link: kind ?? (input.infoOnly?.[p.id] ? "info-only" : "none"),
    };
  });

  const counts: Record<CoverageClass, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const r of rows) counts[r.class] += 1;
  return {
    rows,
    counts,
    total: rows.length,
    noLink: rows.filter((r) => r.link === "none").map((r) => r.id),
    inactive: input.products.length - active.length,
  };
}

const esc = (s: string) => s.replace(/\|/g, "\\|");

/** The text of docs/PACKING_GEAR_COVERAGE.md. Deterministic: no dates, so a test can tell when it is out of date. */
export function renderCoverageMarkdown(report: CoverageReport, cfg: PackingConfig): string {
  const itemName = (id: string) => cfg.items.find((i) => i.id === id)?.name ?? id;
  const lines: string[] = [];
  lines.push("# Packing planner: Gear coverage");
  lines.push("");
  lines.push(
    "Generated by `bun scripts/gear-coverage-report.ts` (the same classification the test `src/test/packing-coverage.test.ts` enforces). Do not edit by hand: run the script after changing `content/products.yml`, `content/packing.yml` or the Gear hub, and commit the result. The test fails when this file is out of date.",
  );
  lines.push("");
  lines.push(
    "Every ACTIVE product in `content/products.yml` is put in exactly one class, best first:",
  );
  lines.push("");
  for (const c of [1, 2, 3, 4] as const) lines.push(`${c}. ${CLASS_LABELS[c]}`);
  lines.push("");
  lines.push("| Class | Meaning | Products |");
  lines.push("| --- | --- | --- |");
  for (const c of [1, 2, 3, 4] as const)
    lines.push(`| ${c} | ${CLASS_LABELS[c]} | ${report.counts[c]} |`);
  lines.push(`| | Total active products | ${report.total} |`);
  lines.push("");
  lines.push(
    `Inactive products (kept in the file, shown nowhere): ${report.inactive}. Products with no outbound link and no documented info-only status: ${report.noLink.length}.`,
  );
  lines.push("");
  lines.push(
    "Fixing class 4: wire the product to a Gear category in `content/products.yml` (`categories`). Do not add it to a packing item just to make it reachable.",
  );
  lines.push("");
  for (const c of [1, 2, 3, 4] as const) {
    const rows = report.rows.filter((r) => r.class === c);
    lines.push(`## Class ${c}: ${CLASS_LABELS[c]} (${rows.length})`);
    lines.push("");
    if (rows.length === 0) {
      lines.push("None.");
      lines.push("");
      continue;
    }
    lines.push("| Product | How a visitor reaches it | Button goes to |");
    lines.push("| --- | --- | --- |");
    for (const r of rows) {
      const via =
        c === 1
          ? `Packing item: ${r.items.map(itemName).join(", ")}`
          : c === 2
            ? `Category: ${r.plannerCategories.join(", ")}`
            : [
                r.categories.length ? `Category: ${r.categories.join(", ")}` : "",
                r.trips.length ? `Trip: ${r.trips.join(", ")}` : "",
                r.featured ? "Featured picks" : "",
              ]
                .filter(Boolean)
                .join("; ") || "none";
      lines.push(`| ${esc(`${r.brand} ${r.name}`)} (\`${r.id}\`) | ${esc(via)} | ${r.link} |`);
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}
