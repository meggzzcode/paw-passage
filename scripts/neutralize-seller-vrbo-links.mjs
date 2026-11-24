#!/usr/bin/env node
// Safe first step of the buyer transfer: switches OFF every one of the SELLER's Vrbo/Impact deeplinks in content/affiliates.yml
// without deleting the entries. Each seller deeplink gets the plain address https://www.vrbo.com/ and approved: false, so:
//   - no commission link of the seller's remains,
//   - the entry names that stay files and articles refer to still exist (deleting them stops the build: "the booking link ... does not exist"),
//   - the buyer later pastes their own deeplink into the same entry and ticks Approved (docs/BUYER_AFFILIATE_TRANSITION.md).
// Dry run by default (prints what it would change). Add --write to change the file. It edits only lines inside content/affiliates.yml.
//   node scripts/neutralize-seller-vrbo-links.mjs            dry run
//   node scripts/neutralize-seller-vrbo-links.mjs --write    apply
// NOTE: with the default stayDirectoryMode ("affiliate-only") the stay directory then lists 0 stays until the buyer's own links are in
// (or until the owner deliberately sets stayDirectoryMode to "public-sources"). Read docs/BUYER_AFFILIATE_TRANSITION.md first.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "content/affiliates.yml");
const baselinePath = join(root, "scripts/seller-ids.json");
const sellerCodes = existsSync(baselinePath)
  ? new Set(JSON.parse(readFileSync(baselinePath, "utf8")).vrboDeeplinkCodes ?? [])
  : null;
const write = process.argv.includes("--write");
const PLAIN = "https://www.vrbo.com/";

const lines = readFileSync(file, "utf8").split("\n");
let changed = 0;
let entryId = "";
let currentUrlLine = -1;
let currentSeller = false;
for (let i = 0; i < lines.length; i++) {
  const idm = /^\s*-\s+id:\s*(\S+)/.exec(lines[i]);
  if (idm) {
    entryId = idm[1];
    currentUrlLine = -1;
    currentSeller = false;
    continue;
  }
  const um = /^(\s+url:\s*)(https?:\/\/(?:www\.)?vrbo\.com\/affiliate\/([A-Za-z0-9]+))\s*$/.exec(
    lines[i],
  );
  if (um) {
    if (!sellerCodes || sellerCodes.has(um[3])) {
      lines[i] = `${um[1]}${PLAIN}`;
      currentSeller = true;
      currentUrlLine = i;
      changed++;
      console.log(`${write ? "switched off" : "would switch off"}: ${entryId}`);
    }
    continue;
  }
  if (currentSeller && /^\s+approved:\s*true\s*$/.test(lines[i]))
    lines[i] = lines[i].replace("true", "false");
}
if (write && changed) writeFileSync(file, lines.join("\n"));
console.log(
  `${changed} seller Vrbo deeplink entr${changed === 1 ? "y" : "ies"} ${write ? "switched off (url set to " + PLAIN + ", approved: false)" : "found (dry run: nothing written; add --write)"}.`,
);
