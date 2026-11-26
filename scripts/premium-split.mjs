#!/usr/bin/env node
// Owner-only, run LOCALLY. Splits one premium JSON array (the old single-file format) into one <id>.json file per adventure,
// the layout that premium-import.mjs --dir and Pages CMS use. Needs no network and no tokens; never writes to a store.
//
//   node scripts/premium-split.mjs --file ~/private/premium.json --dir content/premium            # writes the files
//   add --overwrite to replace files that already exist. Reverse (backup from the store): premium-export.mjs --dir.
// The folder must be outside the repository or exactly content/premium (see docs/PREMIUM-CONTENT-WORKFLOW.md).
import { readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resolvePremiumDir, writePremiumDir } from "./premium-dir-lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : undefined);
const die = (m, c = 2) => {
  console.error(m);
  process.exit(c);
};
const file = opt("--file") ?? die("Missing --file <premium JSON array>");
const dirOpt = opt("--dir") ?? die("Missing --dir <target folder>");
let data;
try {
  data = JSON.parse(readFileSync(realpathSync(resolve(file)), "utf8"));
} catch (e) {
  die(`Could not read JSON: ${e instanceof Error ? e.message : "error"}`);
}
if (!Array.isArray(data)) die("The file must be a JSON array of adventures.");
try {
  const abs = resolvePremiumDir(dirOpt, root, { create: true });
  const n = writePremiumDir(abs, data, { overwrite: args.includes("--overwrite") });
  console.log(
    `Wrote ${n} files to ${abs}. Next: node scripts/premium-import.mjs --dir ${dirOpt} --env preview (dry run).`,
  );
} catch (e) {
  die(e instanceof Error ? e.message : "error");
}
