#!/usr/bin/env node
// Scans a build output directory for premium text. Run by the lead after `vite build`:
//   node scripts/check-leaks.mjs dist          (also try .output/public if that is where the build writes)
// Fails (exit 1) when it finds
//   1. any marker string taken from the synthetic premium fixtures (src/passport/fixtures/premium.synthetic.ts), or
//   2. an `instructions` array that sits next to `access:"premium"` (a non-free card shipped in the bundle).
// It cannot see real premium text (that never enters the repo), so it proves the pipeline cannot ship a card record,
// not that the owner's private content is clean. Needs Node 22.18+ (imports the TypeScript fixture directly).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { syntheticPremium } from "../src/passport/fixtures/premium.synthetic.ts";

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node scripts/check-leaks.mjs <build output dir>");
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
let files = 0;
for (const f of walk(abs)) {
  files++;
  const text = readFileSync(f, "utf8");
  for (const m of ms)
    if (text.includes(m))
      found.push(`${f.replace(root + "/", "")}: contains fixture marker "${m.slice(0, 40)}"`);
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
  `Leak check passed: ${files} files scanned, ${ms.length} markers, no premium instructions.`,
);
