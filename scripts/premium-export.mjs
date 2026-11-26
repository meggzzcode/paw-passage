#!/usr/bin/env node
// Owner-only, run LOCALLY. Backs up the premium library from the Netlify Blobs store premium-<env> to a JSON file.
// Not an HTTP endpoint, never deployed, never run by Claude. Needs Node 22.18+.
//
//   NETLIFY_AUTH_TOKEN=... SITE_ID=... node scripts/premium-export.mjs --out ~/private/premium-backup.json --env production
//
// --dir <folder> (or env PREMIUM_DIR; no default) writes one <id>.json per adventure instead of one array file (the same files premium-import.mjs --dir reads).
// The output path must be OUTSIDE the git repository (the repo is public). The file is the same array premium-import.mjs reads.
import { existsSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  NO_PREMIUM_DIR_MESSAGE,
  premiumDirFromArgs,
  resolvePremiumDir,
  writePremiumDir,
} from "./premium-dir-lib.mjs";
import { getStore } from "@netlify/blobs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : undefined);
const die = (m, c = 2) => {
  console.error(m);
  process.exit(c);
};
let dirOpt;
try {
  dirOpt = opt("--out") ? opt("--dir") : premiumDirFromArgs(args);
} catch (e) {
  die(e instanceof Error ? e.message : "bad --dir");
}
if (dirOpt && opt("--out")) die("Use either --out or --dir, not both.");
const out =
  opt("--out") ??
  (dirOpt
    ? ""
    : die(`Missing --out <file outside the repo> or --dir <folder>. ${NO_PREMIUM_DIR_MESSAGE}`));
const env = opt("--env") ?? "preview";
if (!["preview", "production"].includes(env)) die("--env must be preview or production");
let dirAbs;
if (dirOpt) {
  try {
    dirAbs = resolvePremiumDir(dirOpt, root, { create: true });
  } catch (e) {
    die(e instanceof Error ? e.message : "bad folder");
  }
} else {
  const dir = realpathSync(dirname(resolve(out)));
  if (dir === root || dir.startsWith(root + sep))
    die("Refusing: write the backup OUTSIDE the git repository.");
  if (existsSync(resolve(out)) && !args.includes("--overwrite"))
    die("Output exists. Add --overwrite to replace it.");
}

const token = process.env.NETLIFY_AUTH_TOKEN ?? die("NETLIFY_AUTH_TOKEN is not set");
const siteID = process.env.SITE_ID ?? die("SITE_ID is not set");
const store = getStore({ name: `premium-${env}`, siteID, token, consistency: "strong" });
const ids = (await store.get("index", { type: "json" }))?.ids ?? [];
const list = [];
for (const id of ids) {
  const a = await store.get(`adventure/${id}`, { type: "json" });
  if (a) list.push(a);
}
if (dirAbs) {
  try {
    writePremiumDir(dirAbs, list, { overwrite: args.includes("--overwrite") });
  } catch (e) {
    die(e instanceof Error ? e.message : "could not write");
  }
  console.log(
    `Exported ${list.length} adventures from premium-${env} to ${list.length} files in ${dirAbs}.`,
  );
} else {
  writeFileSync(resolve(out), JSON.stringify(list, null, 2) + "\n", { mode: 0o600 });
  console.log(`Exported ${list.length} adventures from premium-${env}.`);
}
