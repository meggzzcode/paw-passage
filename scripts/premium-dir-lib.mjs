// Shared helpers for the `--dir` mode of premium-import.mjs and premium-export.mjs: one JSON file per premium adventure.
// Pure file handling, no network. The folder must be OUTSIDE the repository, except the single sanctioned in-repo folder
// content/premium, which is git-ignored and may only be used once the repository is private (docs/PREMIUM-CONTENT-WORKFLOW.md).
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { join, relative, resolve, sep } from "node:path";

/** Resolves and checks a premium folder. Returns the real path. Throws an Error with a plain message. */
export function resolvePremiumDir(dir, root, { create = false } = {}) {
  const p = resolve(dir);
  if (!existsSync(p)) {
    if (!create) throw new Error(`Folder not found: ${dir}`);
    mkdirSync(p, { recursive: true, mode: 0o700 });
  }
  const abs = realpathSync(p);
  const realRoot = realpathSync(root);
  const sanctioned = join(realRoot, "content", "premium");
  const inside = abs === realRoot || abs.startsWith(realRoot + sep);
  if (inside && abs !== sanctioned && !abs.startsWith(sanctioned + sep))
    throw new Error(
      "Refusing: the premium folder must be outside the repository, or exactly content/premium (git-ignored; private repositories only).",
    );
  return abs;
}

/** Recursively lists *.json files (sorted) under a folder. */
export function listJsonFiles(abs) {
  const out = [];
  for (const e of readdirSync(abs, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const full = join(abs, e.name);
    if (e.isDirectory() && !e.name.startsWith(".")) out.push(...listJsonFiles(full));
    else if (e.isFile() && e.name.endsWith(".json")) out.push(full);
  }
  return out;
}

/** Reads one adventure per file. Returns { items: [{file, raw}], problems: string[] }. A file name must be <id>.json. */
export function readPremiumDir(abs) {
  const items = [];
  const problems = [];
  for (const file of listJsonFiles(abs)) {
    const rel = relative(abs, file);
    let raw;
    try {
      raw = JSON.parse(readFileSync(file, "utf8"));
    } catch (e) {
      problems.push(`${rel}: not valid JSON (${e instanceof Error ? e.message : "error"})`);
      continue;
    }
    if (Array.isArray(raw) || raw === null || typeof raw !== "object") {
      problems.push(`${rel}: must contain ONE adventure object, not an array`);
      continue;
    }
    const base = file
      .split(sep)
      .pop()
      .replace(/\.json$/, "");
    if (raw.id !== base)
      problems.push(`${rel}: file name must be the adventure id (${raw.id ?? "missing id"}.json)`);
    items.push({ file: rel, raw });
  }
  return { items, problems };
}

/** Writes one <id>.json per adventure (mode 0600). Refuses to replace existing files unless overwrite. Returns count. */
export function writePremiumDir(abs, list, { overwrite = false } = {}) {
  for (const a of list)
    if (!/^adv-[a-z0-9]{6}$/.test(a?.id ?? ""))
      throw new Error(`Refusing to write an adventure with a bad id: ${a?.id}`);
  const clash = list.filter((a) => existsSync(join(abs, `${a.id}.json`)));
  if (clash.length && !overwrite)
    throw new Error(
      `${clash.length} file(s) already exist (first: ${clash[0].id}.json). Add --overwrite to replace them.`,
    );
  for (const a of list)
    writeFileSync(join(abs, `${a.id}.json`), JSON.stringify(a, null, 2) + "\n", { mode: 0o600 });
  return list.length;
}
