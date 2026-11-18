// Reads the filled-in worksheet and adds/updates the links in content/affiliates.yml.
//   bun scripts/import-affiliate-links.ts docs/affiliate-link-worksheet.csv
// Only rows with an "affiliate_url" are imported. Nothing is shown on the site until a link is also marked approved.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import {
  mergeLinks,
  parseCsv,
  renderAffiliatesYaml,
  rowsToLinks,
  type AffLink,
} from "./lib/affiliate-import";

const root = join(import.meta.dir, "..");
const file = process.argv[2];
if (!file) {
  console.error("Usage: bun scripts/import-affiliate-links.ts <worksheet.csv>");
  process.exit(2);
}
const { links, errors } = rowsToLinks(parseCsv(readFileSync(file, "utf8")));
if (errors.length) {
  console.error("The worksheet has problems, so nothing was changed:\n - " + errors.join("\n - "));
  process.exit(1);
}
const target = join(root, "content", "affiliates.yml");
const existing =
  ((existsSync(target) ? parse(readFileSync(target, "utf8")) : {}) as { links?: AffLink[] })
    ?.links ?? [];
const merged = mergeLinks(existing, links);
writeFileSync(target, renderAffiliatesYaml(merged));
console.log(
  `Imported ${links.length} link(s). content/affiliates.yml now has ${merged.length}. ${links.filter((l) => l.approved).length} of the imported links are marked approved.`,
);
