#!/usr/bin/env node
// Owner-only, run LOCALLY. Imports the premium adventure library into the Netlify Blobs store premium-<env>.
// Not an HTTP endpoint, never deployed, never run by Claude. Needs Node 22.18+ (imports the TypeScript schema directly).
//
//   NETLIFY_AUTH_TOKEN=... SITE_ID=... node scripts/premium-import.mjs --file ~/private/premium.json --env preview          # DRY RUN
//   NETLIFY_AUTH_TOKEN=... SITE_ID=... node scripts/premium-import.mjs --file ~/private/premium.json --env preview --write  # writes
//   add --env production --write --yes-production to touch the live store; add --prune to delete adventures not in the file.
//
// --dir <folder> instead of --file: one JSON file per adventure (<id>.json, any sub-folders). The folder comes from --dir or the
// environment variable PREMIUM_DIR (no default: premium text is not tracked in this repository). Use the adventures/ folder of the
// protected package, or a git-ignored local working copy in content/premium (content/premium/README.md). Same validation, same dry-run default.
// The file is a JSON array of adventures (schema: src/passport/schema.ts), kept OUTSIDE git. Paths inside this repo are refused (except content/premium).
// Public previews: cards flagged showcase:true are projected (allowlist, src/server/passport/previews.ts) into `previews/index`,
// together with library totals and structural match fields for every published card (free ones are read from content/adventures).
// A showcase card with no teaser, or a teaser that explains mechanics, is REFUSED. The dry run reports the showcase count.
// Store layout (read by src/server/passport/store.ts readPremium): `index` -> {v:1, ids:[...], items:[{id,status,collections}]}, `adventure/<id>` -> adventure.
import { readdirSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { getStore } from "@netlify/blobs";
import { parse as parseYaml } from "yaml";
import {
  NO_PREMIUM_DIR_MESSAGE,
  premiumDirFromArgs,
  readPremiumDir,
  resolvePremiumDir,
} from "./premium-dir-lib.mjs";
import { adventureSchema, validateLibrary } from "../src/passport/schema.ts";
import { buildPreviewIndex, PREVIEW_INDEX_KEY } from "../src/server/passport/previews.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : undefined);
const die = (m, c = 2) => {
  console.error(m);
  process.exit(c);
};

let dirOpt;
try {
  dirOpt = opt("--file") ? opt("--dir") : premiumDirFromArgs(args);
} catch (e) {
  die(e instanceof Error ? e.message : "bad --dir");
}
if (dirOpt && opt("--file")) die("Use either --file or --dir, not both.");
const file =
  dirOpt ??
  opt("--file") ??
  die(`Missing --file <premium JSON array> or --dir <folder>. ${NO_PREMIUM_DIR_MESSAGE}`);
const env = opt("--env") ?? "preview";
if (!["preview", "production"].includes(env)) die("--env must be preview or production");
let abs;
let dirProblems = [];
if (dirOpt) {
  try {
    abs = resolvePremiumDir(dirOpt, root);
  } catch (e) {
    die(e instanceof Error ? e.message : "bad folder");
  }
} else {
  abs = realpathSync(resolve(file));
  if (abs === root || abs.startsWith(root + sep))
    die("Refusing: the premium file must live OUTSIDE the git repository.");
}
if (env === "production" && flag("--write") && !flag("--yes-production"))
  die("Writing to production needs --yes-production.");

let data;
if (dirOpt) {
  const r = readPremiumDir(abs);
  data = r.items.map((i) => i.raw);
  dirProblems = r.problems;
} else {
  try {
    data = JSON.parse(readFileSync(abs, "utf8"));
  } catch (e) {
    die(`Could not read JSON: ${e instanceof Error ? e.message : "error"}`);
  }
  if (!Array.isArray(data)) die("The file must be a JSON array of adventures.");
}
const problems = [...dirProblems];
const adventures = [];
for (const [i, raw] of data.entries()) {
  const r = adventureSchema.safeParse(raw);
  if (!r.success)
    problems.push(
      `#${i} ${raw?.id ?? "?"}: ${r.error.issues.map((x) => `${x.path.join(".")} ${x.message}`).join("; ")}`,
    );
  else if (r.data.access !== "premium")
    problems.push(`#${i} ${r.data.id}: access must be "premium"`);
  else adventures.push(r.data);
}
// Collection and stamp slugs live with the free content; here we only check IDs are unique.
problems.push(
  ...validateLibrary(
    adventures,
    [...new Set(adventures.flatMap((a) => a.collections))],
    [...new Set(adventures.flatMap((a) => a.stamps))],
  ),
);
if (problems.length) die(`Validation failed:\n${problems.join("\n")}`, 1);
const freeDir = join(root, "content", "adventures");
const free = readdirSync(freeDir)
  .filter((f) => f.endsWith(".yml"))
  .map((f) => adventureSchema.parse(parseYaml(readFileSync(join(freeDir, f), "utf8"))));
let previewIndex;
try {
  previewIndex = buildPreviewIndex(adventures, free);
} catch (e) {
  die(`Preview import refused: ${e instanceof Error ? e.message : "error"}`, 1);
}
const showcase = adventures.filter((a) => a.status === "published" && a.showcase).length;
console.log(`Validated ${adventures.length} premium adventures for store premium-${env}.`);
// The index carries what GET /api/premium/summary needs (published status and collection slugs, no titles or text).
function buildIndex(list) {
  return {
    v: 1,
    ids: list.map((a) => a.id),
    items: list.map((a) => ({ id: a.id, status: a.status, collections: a.collections })),
  };
}
console.log(
  `Showcase previews: ${showcase} premium (${previewIndex.items.length} preview records in total); library ${previewIndex.total} published across ${previewIndex.collections} collections.`,
);
console.log(
  `Index will list ${adventures.filter((a) => a.status === "published").length} published of ${adventures.length} adventures.`,
);
if (!flag("--write")) {
  console.log("Dry run: nothing written. Add --write to import.");
  process.exit(0);
}

const token = process.env.NETLIFY_AUTH_TOKEN ?? die("NETLIFY_AUTH_TOKEN is not set");
const siteID = process.env.SITE_ID ?? die("SITE_ID is not set");
const store = getStore({ name: `premium-${env}`, siteID, token, consistency: "strong" });
const old = (await store.get("index", { type: "json" }))?.ids ?? [];
for (const a of adventures) await store.setJSON(`adventure/${a.id}`, a);
await store.setJSON("index", buildIndex(adventures));
await store.setJSON(PREVIEW_INDEX_KEY, previewIndex);
if (flag("--prune"))
  for (const id of old)
    if (!adventures.some((a) => a.id === id)) await store.delete(`adventure/${id}`);
console.log(`Imported ${adventures.length} adventures into premium-${env}.`);
