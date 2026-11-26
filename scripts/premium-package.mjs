#!/usr/bin/env node
// Owner-only, run LOCALLY. Builds the PROTECTED CONTENT PACKAGE: a versioned, self-contained folder (plus .zip) holding the whole
// premium library, the public preview records, collections, keepsake configs, a validation report, a manifest and the
// import / recovery instructions. It is the authoritative copy of the paid content and lives OUTSIDE the repository.
//
//   node scripts/premium-package.mjs --out <folder outside the repo>
//   options: --source <folder> (or --dir, or env PREMIUM_DIR; no default)  premium JSON folder   --date YYYY-MM-DD  (default today, UTC)
//
// Safety: refuses to write inside the git repository; only ever runs the premium-import.mjs DRY RUN (never --write, and the
// Netlify credentials are removed from the child's environment); reads no store; never includes customer data (the package is
// built from adventure files only, and any email address or credential-looking text in them stops the build).
// Needs Node 22.18+ (imports the TypeScript schema directly, like premium-import.mjs).
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import {
  NO_PREMIUM_DIR_MESSAGE,
  premiumDirFromArgs,
  readPremiumDir,
  resolvePremiumDir,
} from "./premium-dir-lib.mjs";
import { adventureSchema } from "../src/passport/schema.ts";
import { buildPreviewIndex } from "../src/server/passport/previews.ts";

const root = realpathSync(join(dirname(fileURLToPath(import.meta.url)), ".."));
const args = process.argv.slice(2);
const opt = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : undefined);
const die = (m, c = 2) => {
  console.error(m);
  process.exit(c);
};
const sha = (buf) => createHash("sha256").update(buf).digest("hex");

const outOpt = opt("--out") ?? die("Missing --out <folder outside the repository>");
const date = opt("--date") ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) die("--date must be YYYY-MM-DD");

// Refuse to write inside the repo: resolve the nearest existing ancestor through symlinks.
function realish(p) {
  let cur = resolve(p);
  const tail = [];
  while (!existsSync(cur)) {
    tail.unshift(cur.slice(dirname(cur).length + 1));
    cur = dirname(cur);
  }
  return join(realpathSync(cur), ...tail);
}
const outAbs = realish(outOpt);
if (outAbs === root || outAbs.startsWith(root + sep))
  die("Refusing: the package must be written OUTSIDE the git repository.");

let srcAbs;
try {
  const srcOpt = opt("--source") ?? premiumDirFromArgs(args);
  if (!srcOpt) die(`Missing --source <folder>. ${NO_PREMIUM_DIR_MESSAGE}`);
  srcAbs = resolvePremiumDir(srcOpt, root);
} catch (e) {
  die(e instanceof Error ? e.message : "bad source folder");
}

// 1. The real dry run (same code path as the import script). stdout is the report; credentials are stripped.
const childEnv = { ...process.env };
delete childEnv.NETLIFY_AUTH_TOKEN;
delete childEnv.SITE_ID;
const run = spawnSync(
  process.execPath,
  [join(root, "scripts", "premium-import.mjs"), "--dir", srcAbs, "--env", "preview"],
  { cwd: root, env: childEnv, encoding: "utf8" },
);
if (run.status !== 0)
  die(`Dry run failed (exit ${run.status}); nothing was packaged.\n${run.stdout}${run.stderr}`, 1);
if (!/Dry run: nothing written/.test(run.stdout)) die("Unexpected dry-run output; refusing.", 1);
const noise = /UNDICI-EHPA|--trace-warnings/;
const warnings = run.stderr
  .split("\n")
  .filter((l) => l.trim() && !noise.test(l))
  .map((l) => l.trim());

// 2. Read and validate the adventures again with the real schema (the data the package carries).
const { items, problems } = readPremiumDir(srcAbs);
if (problems.length) die(`Premium folder problems:\n${problems.join("\n")}`, 1);
const adventures = [];
for (const it of items) {
  const r = adventureSchema.parse(it.raw);
  adventures.push({ file: it.file, adv: r });
}
adventures.sort((a, b) => a.adv.id.localeCompare(b.adv.id));
const list = adventures.map((a) => a.adv);

// 3. Customer-data guard: adventure files must not hold email addresses or credential-looking strings.
const SUSPECT =
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\b(?:sk|pk|ghp|nfp|xox[bp])[-_][A-Za-z0-9_-]{16,}|\bBearer\s+[A-Za-z0-9._-]{16,}/;
for (const a of adventures) {
  const m = SUSPECT.exec(JSON.stringify(a.adv));
  if (m) die(`Refusing: ${a.adv.id} contains text that looks like customer data or a secret.`, 1);
}

// 4. Public previews exactly as premium-import.mjs builds them.
const freeDir = join(root, "content", "adventures");
const free = readdirSync(freeDir)
  .filter((f) => f.endsWith(".yml"))
  .map((f) => adventureSchema.parse(parseYaml(readFileSync(join(freeDir, f), "utf8"))));
const previewIndex = buildPreviewIndex(list, free);
const publicPreviews = {
  v: previewIndex.v,
  total: previewIndex.total,
  collections: previewIndex.collections,
  items: previewIndex.items,
};

// 5. Collections.
const collectionDefs = parseYaml(
  readFileSync(join(root, "content", "collections.yml"), "utf8"),
).collections;
const collections = {
  collections: collectionDefs.map((c) => ({
    slug: c.slug,
    title: c.title,
    premiumOnly: Boolean(c.premiumOnly),
    premiumIds: list.filter((a) => a.collections.includes(c.slug)).map((a) => a.id),
  })),
  byAdventure: Object.fromEntries(list.map((a) => [a.id, [...a.collections]])),
  unknownSlugs: [
    ...new Set(
      list.flatMap((a) => a.collections).filter((s) => !collectionDefs.some((c) => c.slug === s)),
    ),
  ].sort(),
};

// 6. Keepsake configs plus the theme ids registered in src/passport/keepsake/themes*.ts (read as text: those files are not
// loadable by plain Node).
const themeRegistry = {};
const kdir = join(root, "src", "passport", "keepsake");
for (const f of ["themes.ts", "themes-extra.ts", "themes-more.ts"]) {
  const src = readFileSync(join(kdir, f), "utf8");
  for (const m of src.matchAll(/\bid:\s*"([a-z0-9-]+)",\s*family:\s*"([a-z-]+)"/g))
    themeRegistry[m[1]] = m[2];
  for (const m of src.matchAll(/\bx\(\s*"([a-z0-9-]+)",\s*"([a-z-]+)"/g))
    themeRegistry[m[1]] = m[2];
}
const sortedRegistry = Object.fromEntries(
  Object.entries(themeRegistry).sort(([a], [b]) => a.localeCompare(b)),
);
const keepsakeConfigs = {
  themeRegistry: sortedRegistry,
  cards: list.map((a) => ({
    id: a.id,
    family: a.keepsake.family,
    theme: a.keepsake.theme,
    headline: a.keepsake.headline,
    subhead: a.keepsake.subhead,
    explainer: a.keepsake.explainer,
    themeRegistered: sortedRegistry[a.keepsake.theme] === a.keepsake.family,
  })),
};
const unregistered = keepsakeConfigs.cards.filter((c) => !c.themeRegistered);

// 7. Version: premium-<date>-<n>, n = next unused for that date.
mkdirSync(outAbs, { recursive: true, mode: 0o700 });
let n = 1;
while (existsSync(join(outAbs, `premium-${date}-${n}`))) n++;
const version = `premium-${date}-${n}`;
const pkg = join(outAbs, version);

// 8. Git commit of the repo at build time.
const git = (a) => spawnSync("git", a, { cwd: root, encoding: "utf8" });
const commit = git(["rev-parse", "HEAD"]).stdout.trim() || "unknown";
const dirty = git(["status", "--porcelain"]).stdout.trim() !== "";

const counts = {
  adventures: list.length,
  published: list.filter((a) => a.status === "published").length,
  draft: list.filter((a) => a.status !== "published").length,
  showcase: list.filter((a) => a.status === "published" && a.showcase).length,
  previewRecords: previewIndex.items.length,
  libraryPublished: previewIndex.total,
  collectionsInLibrary: previewIndex.collections,
  byRole: Object.fromEntries(
    ["signature", "everyday", "lifestyle", "aspirational"].map((r) => [
      r,
      list.filter((a) => a.role === r).length,
    ]),
  ),
};

const report = [
  `Package ${version}`,
  `Built ${date} from git ${commit}${dirty ? " (working tree had uncommitted changes)" : ""}`,
  `Source: ${relative(root, srcAbs) || srcAbs}`,
  "",
  "--- premium-import.mjs dry run (stdout, exact) ---",
  run.stdout.trimEnd(),
  "--- end dry run ---",
  "",
  `Counts: ${JSON.stringify(counts)}`,
  `Keepsake cards whose theme id is not registered for their family in themes*.ts: ${unregistered.length}${
    unregistered.length ? ` (${unregistered.map((c) => c.id).join(", ")})` : ""
  }`,
  `Collection slugs used by premium cards but missing from content/collections.yml: ${collections.unknownSlugs.length}${
    collections.unknownSlugs.length ? ` (${collections.unknownSlugs.join(", ")})` : ""
  }`,
  `Warnings from the dry run (stderr, runtime noise removed): ${warnings.length ? "" : "none"}`,
  ...warnings,
  "Customer-data scan (no email addresses, no key-like strings in adventure files): passed",
  "",
].join("\n");

const importCmd = (extra) =>
  `node scripts/premium-import.mjs --dir <PACKAGE>/${version}/adventures ${extra}`;
const importMd = `# Import ${version}

Run from a checkout of the website repository (Node 22.18+, \`npm ci\` done once). \`<PACKAGE>\` is the folder that holds \`${version}\`. The scripts never run on the live site; nothing is written unless \`--write\` is typed.

## 1. Dry run (writes nothing, needs no password)

\`\`\`bash
${importCmd("--env preview")}
\`\`\`

It must print the same counts as \`validation-report.txt\` (${counts.adventures} adventures, ${counts.showcase} showcase previews). The \`adventures/\` folder is the same layout as \`content/premium\`. \`premium-import.json\` (one array) works with \`--file\` instead of \`--dir\`:

\`\`\`bash
node scripts/premium-import.mjs --file <PACKAGE>/${version}/premium-import.json --env preview
\`\`\`

## 2. Environment variables (only for --write; type them in your terminal, never in a file)

- \`NETLIFY_AUTH_TOKEN\`: a Netlify personal access token.
- \`SITE_ID\`: the site's API id.

## 3. Write to the preview store, then look at a preview deploy

\`\`\`bash
${importCmd("--env preview --write")}
\`\`\`

## 4. Write to production only when satisfied

\`\`\`bash
${importCmd("--env production --write --yes-production")}
\`\`\`

Add \`--prune\` only to deliberately remove adventures that are not in this package.

## 5. Roll back

Before step 3 or 4, export what is live (see EXPORT-RECOVERY.md). To roll back, import that export the same way (dry run first, then \`--write\`, with \`--prune\` if you must remove cards added since). If you never had a live export, importing an earlier package version restores that version.

## What the package does not do

\`public-previews.json\`, \`collections.json\` and \`keepsake-configs.json\` are reference copies: the import builds the live preview records itself from the adventures. Do not edit files here by hand; make a new package instead. MANIFEST.json lists the sha256 of every file so you can check nothing changed.
`;
const recoveryMd = `# Export, recovery and transfer for ${version}

Needs the website repository, Node 22.18+ and the two variables from IMPORT.md.

## Export the live library to files

\`\`\`bash
export NETLIFY_AUTH_TOKEN=...   # typed in your terminal only
export SITE_ID=...
node scripts/premium-export.mjs --dir <BACKUP_FOLDER> --env production
\`\`\`

One \`<id>.json\` per live adventure. The folder must be outside the repository (or exactly \`content/premium\`, a git-ignored local working copy). It refuses to overwrite files unless \`--overwrite\`.

## Restore

\`\`\`bash
node scripts/premium-import.mjs --dir <BACKUP_FOLDER> --env production                    # dry run
node scripts/premium-import.mjs --dir <BACKUP_FOLDER> --env production --write --yes-production
\`\`\`

Or restore from this package: unzip it and use the commands in IMPORT.md.

## Verify counts

1. Dry run of the folder you are about to import: note "Validated N premium adventures" and the showcase count.
2. After a write, the import prints "Imported N adventures into premium-<env>". Export again to a new folder and compare: the file count must equal N, and every file's sha256 should match the source file.
3. Against this package: ${counts.adventures} adventures, ${counts.published} published, ${counts.showcase} showcase previews, ${counts.previewRecords} preview records (free teaser cards included), library ${counts.libraryPublished} published across ${counts.collectionsInLibrary} collections.

## Transfer to a new owner

1. Give the new owner the .zip (private channel) and the sha256 shown next to it; they compare it to the file they received.
2. They unzip it, run the dry run in IMPORT.md against their own store, then preview, then production. They use their own Netlify token and site id.
3. You then revoke your own Netlify token. No secret or customer detail is in the package.
4. Delete or archive your copies once the transfer is confirmed. See OWNERSHIP-TRANSFER.md in the repository for the rest of a sale.
`;

// 9. Write the folder.
const write = (rel, content) => {
  const p = join(pkg, rel);
  mkdirSync(dirname(p), { recursive: true, mode: 0o700 });
  writeFileSync(p, content, { mode: 0o600 });
};
const json = (v) => JSON.stringify(v, null, 2) + "\n";
write("premium-import.json", json(list));
for (const a of adventures) write(join("adventures", a.file), readFileSync(join(srcAbs, a.file)));
write("public-previews.json", json(publicPreviews));
write("collections.json", json(collections));
write("keepsake-configs.json", json(keepsakeConfigs));
write("validation-report.txt", report);
write("IMPORT.md", importMd);
write("EXPORT-RECOVERY.md", recoveryMd);

const walk = (d) =>
  readdirSync(d, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const files = walk(pkg).map((f) => {
  const buf = readFileSync(f);
  return { path: relative(pkg, f).split(sep).join("/"), bytes: buf.length, sha256: sha(buf) };
});
write(
  "MANIFEST.json",
  json({
    version,
    created: date,
    gitCommit: commit,
    gitWorkingTreeDirty: dirty,
    note: "sha256 of every file except MANIFEST.json itself. Contains adventure text: keep private.",
    counts,
    files,
  }),
);

// 10. Zip (deterministic order, no extra attributes).
const zipPath = join(outAbs, `${version}.zip`);
rmSync(zipPath, { force: true });
const z = spawnSync("zip", ["-X", "-q", "-r", zipPath, version], { cwd: outAbs, encoding: "utf8" });
if (z.status !== 0) die(`zip failed: ${z.stderr || z.error?.message || "zip not available"}`, 1);
const zipSha = sha(readFileSync(zipPath));
writeFileSync(`${zipPath}.sha256`, `${zipSha}  ${version}.zip\n`, { mode: 0o600 });
console.log(`Package ${version}: ${files.length + 1} files, ${counts.adventures} adventures.`);
console.log(`Folder: ${pkg}`);
console.log(`Zip:    ${zipPath} (${statSync(zipPath).size} bytes)`);
console.log(`sha256: ${zipSha}`);
