#!/usr/bin/env node
// Scans a build output directory for premium text. Run by the lead after `vite build`:
//   node scripts/check-leaks.mjs dist          (also try .output/public if that is where the build writes)
// Fails (exit 1) when it finds
//   1. any marker string taken from the synthetic premium fixtures (src/passport/fixtures/premium.synthetic.ts), or
//   2. an `instructions` array that sits next to `access:"premium"` (a non-free card shipped in the bundle).
// By default it cannot see real premium text (not tracked in the repo), so it proves the pipeline cannot ship a card record.
// OWNER-MACHINE MODE: add `--premium-dir <folder>` (or set PREMIUM_DIR) to also scan the build for REAL premium fragments
// (titles, ids, instructions, twist, safety text, clue/reveal/objective/completion/memoryPrompt) taken from that folder:
//   PREMIUM_DIR=<protected package folder>/adventures node scripts/check-leaks.mjs dist
// Fragments are never printed in full (40 characters). Needs Node 22.18+ (imports the TypeScript fixture directly).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { syntheticPremium } from "../src/passport/fixtures/premium.synthetic.ts";

const argv = process.argv.slice(2);
const pdIdx = argv.indexOf("--premium-dir");
const premiumDir = (pdIdx >= 0 ? argv[pdIdx + 1] : process.env.PREMIUM_DIR) || undefined;
const dir = argv.find((a, i) => !a.startsWith("--") && (pdIdx < 0 || i !== pdIdx + 1));
if (!dir) {
  console.error("usage: node scripts/check-leaks.mjs <build output dir> [--premium-dir <folder>]");
  process.exit(2);
}
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEXT = /\.(?:js|mjs|cjs|css|html|json|txt|xml|map|webmanifest|svg|md|yml|yaml)$/i;

export const PREMIUM_TEXT_KEYS = [
  "clue",
  "reveal",
  "objective",
  "twist",
  "completion",
  "memoryPrompt",
];
/** Real premium fragments from a folder of <id>.json files: whole fields only, at least 12 characters. */
export function realMarkers(folder) {
  const out = new Set();
  for (const f of readdirSync(folder)) {
    if (!f.endsWith(".json")) continue;
    let a;
    try {
      a = JSON.parse(readFileSync(join(folder, f), "utf8"));
    } catch {
      continue;
    }
    const parts = [
      a.title,
      a.id,
      ...PREMIUM_TEXT_KEYS.map((k) => a[k]),
      ...(Array.isArray(a.instructions) ? a.instructions : []),
      ...(Array.isArray(a.safety) ? a.safety : []),
    ];
    for (const p of parts) if (typeof p === "string" && p.trim().length >= 12) out.add(p.trim());
  }
  return [...out];
}
export function markers() {
  const out = new Set();
  for (const a of syntheticPremium) {
    for (const k of PREMIUM_TEXT_KEYS) if (typeof a[k] === "string") out.add(a[k]);
    for (const s of [...a.instructions, ...a.safety]) out.add(s);
    out.add(a.title);
    out.add(a.id);
  }
  return [...out];
}

/** Finds `instructions` arrays whose surrounding record says it is premium. Returns offsets. */
export function premiumInstructionHits(text) {
  const hits = [];
  const re = /["']?instructions["']?\s*:\s*\[/g;
  let m;
  while ((m = re.exec(text))) {
    const near = text.slice(Math.max(0, m.index - 4000), m.index + 4000);
    if (/["']?access["']?\s*:\s*["']premium["']/.test(near)) hits.push(m.index);
  }
  return hits;
}

function* walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (TEXT.test(n)) yield p;
  }
}

const abs = resolve(dir);
const found = [];
const ms = markers();
let real = [];
if (premiumDir) {
  try {
    real = realMarkers(resolve(premiumDir));
  } catch (e) {
    console.error(`Premium folder not readable: ${premiumDir}`);
    process.exit(2);
  }
  if (real.length === 0) {
    console.error(`No premium fragments found in ${premiumDir}: wrong folder?`);
    process.exit(2);
  }
}
let files = 0;
for (const f of walk(abs)) {
  files++;
  const text = readFileSync(f, "utf8");
  for (const m of ms)
    if (text.includes(m))
      found.push(`${f.replace(root + "/", "")}: contains fixture marker "${m.slice(0, 40)}"`);
  for (const m of real)
    if (text.includes(m))
      found.push(
        `${f.replace(root + "/", "")}: contains a REAL premium fragment (${m.length} chars, starts "${m.slice(0, 40)}")`,
      );
  for (const at of premiumInstructionHits(text))
    found.push(
      `${f.replace(root + "/", "")}: instructions array next to access:"premium" at offset ${at}`,
    );
}
if (files === 0) {
  console.error(`No text files found in ${abs}: wrong directory?`);
  process.exit(2);
}
if (found.length) {
  console.error(`LEAK CHECK FAILED (${found.length}):\n${found.join("\n")}`);
  process.exit(1);
}
console.log(
  `Leak check passed: ${files} files scanned, ${ms.length} fixture markers${premiumDir ? `, ${real.length} REAL premium fragments` : " (no premium folder given: real premium text NOT checked; set PREMIUM_DIR on the owner machine)"}, no premium instructions.`,
);
