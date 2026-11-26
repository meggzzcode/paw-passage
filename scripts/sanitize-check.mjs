#!/usr/bin/env node
// Sanitize check: scans every git-tracked text file for private markers and secret patterns. Exits 1 on any hit, 0 when clean.
// Run it before publishing a snapshot or handing the repository over:   node scripts/sanitize-check.mjs [--root <dir>]
// Extra private strings that must never be in the repository (a storage path, a file id) cannot be written here, so pass them
// through the environment, comma separated:   SANITIZE_EXTRA_MARKERS="string one,string two" node scripts/sanitize-check.mjs
// Hits print the file, the line number and the marker NAME only, never the matched text. Needs git and Node 22+.
// The built-in marker strings are assembled from pieces so that this file does not match itself.
import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const j = (...p) => p.join("");

/** Plain strings (case-insensitive). */
export const BUILTIN_MARKERS = [
  j("premium", "-content"),
  j("/home/", "user"),
  j("16_18", "luR"),
  j("1quE", "q2"),
  j("195d", "159"),
  j("c776", "905"),
  j("historical", " exposure"),
  j("historical", "-exposure"),
  j("drive.google.com", "/file/d/"),
  j("drive.google.com", "/drive/folders/"),
];

/** Secret shapes. */
export const SECRET_PATTERNS = [
  [j("private key", " block"), new RegExp(j("-----BEGIN [A-Z ]*PRIVATE", " KEY-----"))],
  [j("aws access", " key id"), /\bAKIA[0-9A-Z]{16}\b/],
  [
    j("github", " token"),
    /\b(?:ghp|gho|ghs|ghu)_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b/,
  ],
  [j("slack", " token"), /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  [j("live payment", " key"), /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/],
  [j("netlify", " token"), /\bnfp_[A-Za-z0-9]{30,}\b/],
  [
    j("secret env", " assigned a literal"),
    /\b(?:SESSION_SECRET|PP_DATA_KEY|NETLIFY_AUTH_TOKEN|VAPID_PRIVATE_KEY)\s*[=:]\s*["']?[A-Za-z0-9+/_-]{24,}/,
  ],
];

export function extraMarkers(env = process.env) {
  return (env.SANITIZE_EXTRA_MARKERS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length >= 4);
}

/** Pure: findings for one file's text. `name` is a label only, never the matched text. */
export function scanText(text, extra = []) {
  const hits = [];
  const lines = text.split("\n");
  const markers = [...BUILTIN_MARKERS, ...extra].map((m, i) => [
    i < BUILTIN_MARKERS.length
      ? `marker #${i + 1}`
      : `extra marker #${i - BUILTIN_MARKERS.length + 1}`,
    m.toLowerCase(),
  ]);
  lines.forEach((line, idx) => {
    // the name of the workflow document is public and legitimately contains the first marker's words
    const low = line.toLowerCase().replaceAll(j("premium", "-content", "-workflow"), "");
    for (const [name, m] of markers) if (low.includes(m)) hits.push({ line: idx + 1, kind: name });
    for (const [name, re] of SECRET_PATTERNS)
      if (re.test(line)) hits.push({ line: idx + 1, kind: `secret: ${name}` });
  });
  return hits;
}

export function scanRepo(root, extra = []) {
  const files = execFileSync("git", ["ls-files", "-z"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1 << 28,
  })
    .split("\0")
    .filter(Boolean);
  const out = [];
  for (const f of files) {
    if (f.endsWith("package-lock.json")) continue;
    let st;
    try {
      st = statSync(join(root, f));
    } catch {
      continue; // deleted in the working tree but still listed
    }
    if (!st.isFile() || st.size > 2_000_000) continue;
    const buf = readFileSync(join(root, f));
    if (buf.includes(0)) continue; // binary
    for (const h of scanText(buf.toString("utf8"), extra)) out.push({ file: f, ...h });
  }
  return { scanned: files.length, findings: out };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = process.argv.slice(2);
  const root = resolve(a.includes("--root") ? a[a.indexOf("--root") + 1] : process.cwd());
  const extra = extraMarkers();
  const { scanned, findings } = scanRepo(root, extra);
  for (const f of findings) console.error(`${f.file}:${f.line}  ${f.kind}`);
  console.log(
    `sanitize-check: ${scanned} tracked files, ${findings.length} finding(s), ${extra.length} extra marker(s) from SANITIZE_EXTRA_MARKERS.`,
  );
  process.exit(findings.length ? 1 : 0);
}
