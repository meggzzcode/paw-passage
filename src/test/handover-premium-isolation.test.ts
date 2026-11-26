import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// The paid library lives in content/premium/ (one JSON per adventure). The website build must never read, glob, watch or
// bundle it. This test builds nothing: it asserts the source of every build-time reader excludes that folder.
const REPO = process.cwd();
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((n) => {
    if (n === "node_modules" || n === ".git" || n === "dist" || n === ".output") return [];
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

// Minimal glob -> RegExp (supports ** and *), enough for import.meta.glob patterns.
const globToRe = (g: string) =>
  new RegExp(
    "^" +
      g
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*\*\//g, "(?:.*/)?")
        .replace(/\*/g, "[^/]*") +
      "$",
  );

describe("content/premium is never read by the site build", () => {
  it("no import.meta.glob pattern in src/ can match a content/premium file", () => {
    const sample = ["content/premium/adv-abc123.json", "content/premium/sub/adv-abc123.json"];
    const bad: string[] = [];
    for (const f of walk(join(REPO, "src")).filter((p) => /\.(?:ts|tsx)$/.test(p))) {
      const src = readFileSync(f, "utf8");
      for (const m of src.matchAll(/import\.meta\.glob\(\s*(\[[^\]]*\]|"[^"]*"|'[^']*')/g)) {
        const pats = [...m[1]!.matchAll(/["']([^"']+)["']/g)].map((x) => x[1]!);
        for (const pat of pats) {
          // resolve relative patterns against the file's folder
          const abs = join(f, "..", pat).replace(REPO + "/", "");
          const norm = pat.startsWith(".") ? abs : pat.replace(/^\//, "");
          if (sample.some((s) => globToRe(norm).test(s))) bad.push(`${f}: ${pat}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it("no source file imports from content/premium", () => {
    for (const f of walk(join(REPO, "src")).filter((p) => /\.(?:ts|tsx)$/.test(p))) {
      if (f.includes(join("src", "test"))) continue;
      expect(readFileSync(f, "utf8"), f).not.toMatch(/content\/premium/);
    }
  });

  it("the content plugin excludes content/premium from reading and watching", () => {
    const src = readFileSync(join(REPO, "plugins", "content.ts"), "utf8");
    expect(src).toMatch(/EXCLUDED_CONTENT_DIR\s*=\s*"premium"/);
    expect(src).toMatch(/d === join\(dir, EXCLUDED_CONTENT_DIR\)\) return/);
    // it lists content files only by explicit name or sub-folder (guides); never the whole content tree for reading
    expect(src).not.toMatch(/readdirSync\(join\(root,\s*"content"\)\)/);
  });

  it("the build output folder and Netlify config never publish content/", () => {
    const toml = readFileSync(join(REPO, "netlify.toml"), "utf8");
    expect(toml).not.toMatch(/publish\s*=\s*"content/);
    expect(toml).not.toMatch(/included_files[^\n]*content/);
  });

  it("scripts/check-leaks.mjs scans only the directory it is given (build output), never content/", () => {
    const src = readFileSync(join(REPO, "scripts", "check-leaks.mjs"), "utf8");
    expect(src).not.toMatch(/content\/premium|"content"/);
  });
});
