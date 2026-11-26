// Premium adventure text must not be tracked in this repository (owner directive 2026-11-26). These tests guard the CURRENT tree only.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const REPO = process.cwd();

function gitLsFiles(path: string): string[] | null {
  try {
    return execFileSync("git", ["ls-files", path], {
      cwd: REPO,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .filter(Boolean);
  } catch {
    return null; // git unavailable, or not a git checkout (for example a source archive)
  }
}

describe("premium text is not tracked in git", () => {
  const tracked = gitLsFiles("content/premium");
  it.skipIf(tracked === null)(
    "git ls-files content/premium lists no JSON file (skipped only when git is unavailable)",
    () => {
      const json = (tracked ?? []).filter((f) => /\.json$/i.test(f));
      expect(json).toEqual([]);
    },
  );

  it("no tracked JSON file anywhere under content/ looks like a premium adventure", () => {
    const all = gitLsFiles("content");
    if (all === null) return; // covered by the skip above; nothing else to read
    for (const f of all.filter((x) => x.endsWith(".json")))
      expect(f, "premium-looking file is tracked").not.toMatch(/premium|adv-[a-z0-9]{6}\.json$/);
  });

  it(".gitignore carries the content/premium/*.json rule with an explanatory comment", () => {
    const text = readFileSync(join(REPO, ".gitignore"), "utf8");
    const lines = text.split("\n").map((l) => l.trim());
    expect(lines).toContain("content/premium/*.json");
    const at = lines.indexOf("content/premium/*.json");
    expect(lines[at - 1] ?? "").toMatch(/^#/);
  });

  it("content/premium/README.md exists, explains the local working copy and holds no premium text", () => {
    const p = join(REPO, "content", "premium", "README.md");
    expect(existsSync(p)).toBe(true);
    const t = readFileSync(p, "utf8");
    expect(t).toMatch(/not stored in this repository/);
    expect(t).toMatch(/PREMIUM_DIR/);
    expect(t).not.toMatch(/"instructions"\s*:/);
  });
});
