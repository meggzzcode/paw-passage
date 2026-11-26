#!/usr/bin/env node
// Regression test for the netlify.toml `ignore` command.
// Netlify runs the command; exit 0 = SKIP the build, non-zero = BUILD.
// For each change type we make a throwaway git repo, commit a baseline, change one file, and run the real command
// (read from netlify.toml) with CACHED_COMMIT_REF / COMMIT_REF set to the two commits. Usage: node scripts/test-netlify-ignore.mjs
import { execSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const toml = readFileSync(join(root, "netlify.toml"), "utf8");
const m = toml.match(/^\s*ignore\s*=\s*"((?:[^"\\]|\\.)*)"/m);
if (!m) {
  console.error("No ignore command found in netlify.toml");
  process.exit(2);
}
const command = JSON.parse(`"${m[1]}"`);

// [label, path changed, expected]: "build" or "skip"
const rows = [
  ["published guide .md (content/guides/*.md)", "content/guides/some-guide.md", "build"],
  ["nested content .md (content/adventures/x/y.md)", "content/adventures/x/y.md", "build"],
  ["content/packing.yml", "content/packing.yml", "build"],
  ["content/products.yml", "content/products.yml", "build"],
  ["content/affiliates.yml", "content/affiliates.yml", "build"],
  ["content/settings.yml", "content/settings.yml", "build"],
  ["content/collections.yml", "content/collections.yml", "build"],
  ["src code", "src/routes/index.tsx", "build"],
  ["src markdown (src/content/readme.md)", "src/content/readme.md", "build"],
  ["package.json", "package.json", "build"],
  ["netlify.toml", "netlify.toml", "build"],
  [".pages.yml (CMS config)", ".pages.yml", "build"],
  ["public asset", "public/robots.txt", "build"],
  ["docs only (docs/*.md)", "docs/NOTES.md", "skip"],
  ["docs only (nested docs/x/y.csv)", "docs/data/x.csv", "skip"],
  [".github workflow only", ".github/workflows/ci.yml", "skip"],
  ["root README.md", "README.md", "skip"],
  ["root COWORK-HANDOFF.md", "COWORK-HANDOFF.md", "skip"],
];

const dir = mkdtempSync(join(tmpdir(), "netlify-ignore-"));
const git = (args, o = {}) =>
  execSync(`git ${args}`, { cwd: dir, stdio: "pipe", ...o })
    .toString()
    .trim();
git("init -q");
git("config user.email t@example.com");
git("config user.name t");
git("config commit.gpgsign false");
const write = (p, s) => {
  mkdirSync(dirname(join(dir, p)), { recursive: true });
  writeFileSync(join(dir, p), s);
};
for (const [, p] of rows) write(p, "base\n");
git("add -A");
git("commit -q -m base");
const base = git("rev-parse HEAD");

let failed = 0;
const out = [];
for (const [label, p, expected] of rows) {
  git(`checkout -q -B t ${base}`);
  write(p, "changed\n");
  git("add -A");
  git("commit -q -m change");
  const head = git("rev-parse HEAD");
  const r = spawnSync("sh", ["-c", command], {
    cwd: dir,
    env: { ...process.env, CACHED_COMMIT_REF: base, COMMIT_REF: head },
    stdio: "pipe",
  });
  const actual = r.status === 0 ? "skip" : "build";
  const ok = actual === expected;
  if (!ok) failed++;
  out.push(
    `${ok ? "PASS" : "FAIL"}  exit=${r.status}  expect ${expected.padEnd(5)} got ${actual.padEnd(5)}  ${label}`,
  );
}
// Mixed: docs + a guide in one push must build; missing cached ref must build (fail-safe).
git(`checkout -q -B t ${base}`);
write("docs/NOTES.md", "x\n");
write("content/guides/some-guide.md", "x\n");
git("add -A");
git("commit -q -m mixed");
const mixed = spawnSync("sh", ["-c", command], {
  cwd: dir,
  env: { ...process.env, CACHED_COMMIT_REF: base, COMMIT_REF: git("rev-parse HEAD") },
  stdio: "pipe",
});
out.push(
  `${mixed.status !== 0 ? "PASS" : "FAIL"}  exit=${mixed.status}  expect build got ${mixed.status === 0 ? "skip" : "build"}  docs + guide in one push`,
);
if (mixed.status === 0) failed++;
const noRef = spawnSync("sh", ["-c", command], {
  cwd: dir,
  env: { ...process.env, CACHED_COMMIT_REF: "", COMMIT_REF: "HEAD" },
  stdio: "pipe",
});
out.push(
  `${noRef.status !== 0 ? "PASS" : "FAIL"}  exit=${noRef.status}  expect build got ${noRef.status === 0 ? "skip" : "build"}  missing CACHED_COMMIT_REF (fail-safe)`,
);
if (noRef.status === 0) failed++;

rmSync(dir, { recursive: true, force: true });
console.log(`ignore command: ${command}\n`);
console.log(out.join("\n"));
console.log(failed ? `\n${failed} FAILED` : "\nAll rows pass.");
process.exit(failed ? 1 : 0);
