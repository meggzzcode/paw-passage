// Writes docs/stay-deeplink-worksheet.csv: one row per written-up stay that is NOT listed yet because it has no approved
// affiliate link. A stay is listed only when it earns (see STAYS_REQUIRE_AFFILIATE_LINK in src/content/publish-rule.ts).
//   bun scripts/stay-deeplink-worksheet.ts
// For each row: open the listing in the Expedia Group creator hub, generate the deeplink for that listing, paste it into
// "affiliate_url" and put yes in "approved". Then import the sheet:
//   bun scripts/import-affiliate-links.ts docs/stay-deeplink-worksheet.csv
// Each stay goes live on the next build. Paste each link exactly as the hub gives it; never edit or shorten it.
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { toCsv, parseCsv } from "./lib/affiliate-import";

const root = join(import.meta.dir, "..");
const out = join(root, "docs", "stay-deeplink-worksheet.csv");
const approved = new Set(
  (
    (parse(readFileSync(join(root, "content", "affiliates.yml"), "utf8")) as {
      links?: { id: string; approved: boolean; url?: string }[];
    }) ?? {}
  ).links
    ?.filter((l) => l.approved && l.url)
    .map((l) => l.id) ?? [],
);

// Keep anything already typed into an existing worksheet.
const prior = new Map<string, string[]>();
if (existsSync(out)) {
  const rows = parseCsv(readFileSync(out, "utf8"));
  const h = rows[0] ?? [];
  for (const r of rows.slice(1)) prior.set(r[h.indexOf("link_id")] ?? "", r);
}

const header = [
  "link_id",
  "network",
  "affiliate_url",
  "approved",
  "kind",
  "stay",
  "town",
  "listing_url",
  "notes",
];
const rows: string[][] = [header];
const dir = join(root, "content", "stays");
for (const f of readdirSync(dir)
  .filter((n) => n.endsWith(".yml"))
  .sort()) {
  const s = parse(readFileSync(join(dir, f), "utf8")) as {
    name: string;
    town: string;
    sourceUrl: string;
    affiliateId?: string;
  };
  const vrboId = /^https:\/\/(www\.)?vrbo\.com\/(\d+)/.exec(s.sourceUrl)?.[2];
  const id = s.affiliateId ?? (vrboId ? `vrbo-${vrboId}` : "");
  if (!id) continue; // not a Vrbo listing: there is no program to earn from, so it stays unlisted
  if (approved.has(id)) continue; // already earns
  const before = prior.get(id);
  rows.push([
    id,
    "Vrbo",
    before?.[2] ?? "",
    before?.[3] ?? "",
    "stay",
    s.name,
    s.town,
    s.sourceUrl,
    "",
  ]);
}
writeFileSync(out, toCsv(rows));
console.log(`Wrote ${out}: ${rows.length - 1} stays waiting for a deeplink.`);
