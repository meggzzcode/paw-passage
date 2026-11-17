// Writes docs/affiliate-link-worksheet.csv: one row per product, ready to fill in as you join affiliate programs.
//   bun scripts/affiliate-worksheet.ts
// Fill in "network", "affiliate_url" and "approved" for the rows you have links for, then run:
//   bun scripts/import-affiliate-links.ts docs/affiliate-link-worksheet.csv
import { readdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { toCsv, parseCsv } from "./lib/affiliate-import";

const root = join(import.meta.dir, "..");
const gearDir = join(root, "src", "content", "gear");
const out = join(root, "docs", "affiliate-link-worksheet.csv");

// Keep anything already typed into an existing worksheet.
const prior = new Map<string, string[]>();
if (existsSync(out)) {
  const rows = parseCsv(readFileSync(out, "utf8"));
  const h = rows[0] ?? [];
  for (const r of rows.slice(1)) prior.set(r[h.indexOf("link_id")] ?? "", r);
}

const articlesFor = new Map<string, string[]>();
for (const f of readdirSync(join(root, "src", "content", "guides")).filter((n) => n.endsWith(".ts") && n !== "index.ts")) {
  const { guide } = (await import(join(root, "src", "content", "guides", f))) as { guide: { slug: string; gear?: { productId: string }[] } };
  for (const p of guide.gear ?? []) articlesFor.set(p.productId, [...(articlesFor.get(p.productId) ?? []), guide.slug]);
}
const mdDir = join(root, "content", "guides");
if (existsSync(mdDir)) {
  for (const f of readdirSync(mdDir).filter((n) => n.endsWith(".md"))) {
    const m = readFileSync(join(mdDir, f), "utf8").replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/);
    const fm = (m ? parse(m[1]!) : {}) as { gear?: { productId: string }[] };
    for (const p of fm.gear ?? []) articlesFor.set(p.productId, [...(articlesFor.get(p.productId) ?? []), f.replace(/\.md$/, "")]);
  }
}

const header = ["link_id", "brand", "product", "used_in_articles", "maker_page", "network", "affiliate_url", "approved", "notes"];
const rows: string[][] = [header];
for (const f of readdirSync(gearDir).filter((n) => n.endsWith(".ts")).sort()) {
  const { products } = (await import(join(gearDir, f))) as { products: { id: string; brand: string; name: string; specSource: { url: string } }[] };
  for (const p of products) {
    const old = prior.get(p.id);
    const col = (n: string) => old?.[header.indexOf(n)] ?? "";
    rows.push([p.id, p.brand, p.name, (articlesFor.get(p.id) ?? []).join("; "), p.specSource.url, col("network"), col("affiliate_url"), col("approved") || "no", col("notes")]);
  }
}
writeFileSync(out, toCsv(rows));
console.log(`Wrote ${rows.length - 1} products to ${out}`);
