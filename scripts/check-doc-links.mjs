#!/usr/bin/env node
// Checks that internal links in the buyer-facing documents resolve. Read-only and offline.
//   node scripts/check-doc-links.mjs                 check the default buyer-facing set
//   node scripts/check-doc-links.mjs path/a.md ...   check the files you name
//   node scripts/check-doc-links.mjs --anchors       also check #heading anchors
//   node scripts/check-doc-links.mjs --unlinked      also WARN about `docs/...md` or `*.md` paths written in code
//                                                    formatting that are not links (buyers cannot click those)
// Exit 1 when any markdown link points at a file or folder that does not exist.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const checkAnchors = args.includes("--anchors");
const warnUnlinked = args.includes("--unlinked");
const named = args.filter((a) => !a.startsWith("--"));

function defaultSet() {
  const out = ["BUYER_HANDOVER.md", "HANDOVER.md", "README.md", "docs/TRANSFER_CHECKLIST.md"];
  for (const f of readdirSync(join(root, "docs")))
    if (/^BUYER_.*\.md$/.test(f)) out.push(`docs/${f}`);
  for (const f of readdirSync(join(root, "docs/buyer")))
    if (f.endsWith(".md")) out.push(`docs/buyer/${f}`);
  return out;
}

const slug = (h) =>
  h
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9 \-]/g, "")
    .trim()
    .replace(/ /g, "-");

function anchorsOf(file) {
  const set = new Set();
  let inFence = false;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (/^```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^#{1,6}\s+(.*)$/.exec(line);
    if (m) set.add(slug(m[1]));
  }
  return set;
}

const files = (named.length ? named : defaultSet()).filter((f) => existsSync(join(root, f)));
let broken = 0;
let warnings = 0;
let total = 0;

for (const rel of files) {
  const abs = resolve(root, rel);
  const lines = readFileSync(abs, "utf8").split("\n");
  let inFence = false;
  const linkedTargets = new Set();
  lines.forEach((line, i) => {
    if (/^```/.test(line)) inFence = !inFence;
    if (inFence) return;
    const noCode = line.replace(/`[^`]*`/g, "");
    for (const m of noCode.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = m[1];
      if (/^(https?:|mailto:|tel:|#)/.test(target) && !target.startsWith("#")) continue;
      total++;
      const [pathPart, anchor] = target.split("#");
      const dest = pathPart ? resolve(dirname(abs), decodeURIComponent(pathPart)) : abs;
      linkedTargets.add(relative(root, dest));
      if (!existsSync(dest)) {
        broken++;
        console.log(`BROKEN  ${rel}:${i + 1}  ${target}`);
        continue;
      }
      if (checkAnchors && anchor && statSync(dest).isFile() && dest.endsWith(".md")) {
        if (!anchorsOf(dest).has(anchor.toLowerCase())) {
          broken++;
          console.log(`ANCHOR  ${rel}:${i + 1}  ${target}`);
        }
      }
    }
  });
  if (warnUnlinked) {
    inFence = false;
    lines.forEach((line, i) => {
      if (/^```/.test(line)) inFence = !inFence;
      if (inFence) return;
      const stripped = line.replace(/\[[^\]]*\]\([^)]*\)/g, "");
      for (const m of stripped.matchAll(/`((?:docs\/)[\w./-]+\.md|[A-Z][A-Z_-]+\.md)`/g)) {
        warnings++;
        console.log(`UNLINKED  ${rel}:${i + 1}  ${m[1]} (written as code, not a link)`);
      }
    });
  }
}

console.log(
  `\nChecked ${files.length} files, ${total} internal links: ${broken} broken${
    warnUnlinked ? `, ${warnings} unlinked file mentions` : ""
  }.`,
);
process.exit(broken ? 1 : 0);
