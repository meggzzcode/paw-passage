// One-off: writes content/products.yml from the legacy product arrays in src/content/gear/*.ts.
// No URL is typed by hand: manufacturerUrl = productUrl ?? (specSource.url unless it is a PDF), exactly what
// productButton() used before. The legacy files stay in place as the baseline for src/test/gear-parity.test.ts.
// Run: bun scripts/migrate-gear-to-yaml.ts
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { stringify } from "yaml";
import type { Product } from "../src/content/gear";

// Only categories where the existing products honestly fit (see docs/recovery/10-travel-essentials-hub-spec.md section 3).
const categories: Record<string, string[]> = {
  "sleepypod-clickit-range": ["road-trips", "travel-safety", "large-dogs"],
  "saker-bomber-harness": ["road-trips", "travel-safety"],
  "sleepypod-atom": ["road-trips", "travel-safety"],
  "gunner-g1-kennel": ["road-trips", "travel-safety", "large-dogs"],
  "lucky-duck-lucky-kennel": ["road-trips", "travel-safety", "large-dogs"],
  "kurgo-heather-hammock": ["road-trips", "travel-comfort"],
  "kurgo-kibble-carrier": ["road-trips", "feeding-and-hydration"],
  "kurgo-collaps-a-bowl": ["road-trips", "feeding-and-hydration"],
  "midwest-exercise-pen-with-door": ["cabin-vacations"],
  "north-states-petyard-passage-8-panel": ["cabin-vacations"],
  "carlson-convertible-pet-yard": ["cabin-vacations"],
  "kurgo-loft-wander-dog-bed": ["cabin-vacations", "travel-comfort"],
  "orvis-embossed-sherpa-throw": ["cabin-vacations", "travel-comfort"],
  "amk-me-and-my-dog": ["travel-safety"],
  "amk-trail-dog": ["travel-safety"],
  "kurgo-dog-first-aid-kit": ["travel-safety"],
  "kurgo-rsg-dog-first-aid-kit": ["travel-safety"],
  "baskerville-ultra-muzzle": ["travel-safety"],
  "akc-reunite-stainless-collar-tag": ["travel-safety"],
  "tractive-dog-6": ["travel-safety"],
  "tractive-dog-6-xl": ["travel-safety", "large-dogs"],
  "fi-series-3-plus": ["travel-safety"],
  "springland-22oz-original-travel-bottle": ["feeding-and-hydration"],
  "springland-20oz-flip-travel-bottle": ["feeding-and-hydration"],
  "vittles-vault-travel-tainer": ["feeding-and-hydration"],
};

const dir = join(import.meta.dir, "..", "src", "content", "gear");
// content/products.yml is now the source of truth (it has many more products and fields than this one-off writes).
if (existsSync(join(import.meta.dir, "..", "content", "products.yml")) && !process.argv.includes("--force")) {
  console.error("content/products.yml already exists and is edited by hand now. Re-run with --force only to start over from src/content/gear/*.ts.");
  process.exit(1);
}
const out: Record<string, unknown>[] = [];
for (const f of readdirSync(dir).filter((n) => n.endsWith(".ts")).sort()) {
  const mod = (await import(join(dir, f))) as { products: Product[] };
  for (const p of mod.products) {
    const manufacturerUrl = p.productUrl ?? (/\.pdf(\?|#|$)/i.test(p.specSource.url) ? undefined : p.specSource.url);
    const cats = categories[p.id];
    if (!cats) throw new Error(`no category for ${p.id}`);
    out.push({
      id: p.id, name: p.name, brand: p.brand, categories: cats, summary: p.summary, keySpecs: p.keySpecs, specSource: p.specSource,
      manufacturerUrl: manufacturerUrl ?? "",
      retailerUrl: "", retailerName: "",
      // The date the repo already records for the maker page this record was read from.
      lastVerified: p.specSource.accessedOn,
      active: true,
      affiliateId: p.affiliateId ?? "",
    });
  }
}
const header = `# Products shown in gear guides, the packing tool and /gear (Pages CMS: "Products").
# No prices, ratings, commissions or "tested" claims belong here. Facts come from the maker's own page or an
# independent standard; specSource records where. manufacturerUrl and retailerUrl are plain (non-affiliate) links.
# affiliateId stays EMPTY unless content/affiliates.yml has an approved entry for this product: the product never
# stores an affiliate URL. Generated once by scripts/migrate-gear-to-yaml.ts; edit freely from here.
`;
writeFileSync(join(import.meta.dir, "..", "content", "products.yml"), header + stringify({ products: out }, { lineWidth: 0 }));
console.log(`wrote ${out.length} products`);
