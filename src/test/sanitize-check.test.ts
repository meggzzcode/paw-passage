// scripts/sanitize-check.mjs: private markers and secret shapes in tracked files. Uses synthetic fixtures in a throwaway git repo.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error plain .mjs script without types
import { scanRepo, scanText, extraMarkers } from "../../scripts/sanitize-check.mjs";

const j = (...p: string[]) => p.join("");

function fixture(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "sanitize-"));
  execFileSync("git", ["init", "-q"], { cwd: dir });
  for (const [n, t] of Object.entries(files)) writeFileSync(join(dir, n), t);
  execFileSync("git", ["add", "-A"], { cwd: dir });
  return dir;
}

describe("sanitize-check", () => {
  it("passes a clean tree", () => {
    const dir = fixture({ "a.md": "Nothing private here.\n" });
    try {
      expect(scanRepo(dir).findings).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("flags private path, id and exposure wording without printing the text", () => {
    const dir = fixture({
      "a.md": `see ${j("/home/", "user", "/x")}\n`,
      "b.md": `id ${j("16_18", "luR", "abc")}\n`,
      "c.md": `${j("Historical", " Exposure")} note\n`,
    });
    try {
      const f = scanRepo(dir).findings as { file: string; line: number; kind: string }[];
      expect(f.map((x) => x.file).sort()).toEqual(["a.md", "b.md", "c.md"]);
      for (const x of f) expect(JSON.stringify(x)).not.toContain("luR");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("flags secret shapes", () => {
    const hits = scanText(
      `${j("ghp", "_")}${"a".repeat(36)}\n${j("-----BEGIN RSA PRIVATE", " KEY-----")}\n`,
    );
    expect(hits.map((h: { kind: string }) => h.kind)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("github"),
        expect.stringContaining("private key"),
      ]),
    );
  });

  it("honors SANITIZE_EXTRA_MARKERS and ignores very short entries", () => {
    expect(extraMarkers({ SANITIZE_EXTRA_MARKERS: " zebra-secret , ab ,," })).toEqual([
      "zebra-secret",
    ]);
    expect(scanText("has Zebra-Secret inside\n", ["zebra-secret"])).toHaveLength(1);
    expect(scanText("has Zebra-Secret inside\n", [])).toHaveLength(0);
  });

  it("exits non-zero on a hit and zero when clean (CLI)", () => {
    const bad = fixture({ "a.md": `${j("195d", "159")}\n` });
    const good = fixture({ "a.md": "ok\n" });
    try {
      const run = (cwd: string) => {
        try {
          execFileSync("node", [join(process.cwd(), "scripts/sanitize-check.mjs")], {
            cwd,
            stdio: "pipe",
          });
          return 0;
        } catch (e) {
          return (e as { status: number }).status;
        }
      };
      expect(run(good)).toBe(0);
      expect(run(bad)).toBe(1);
    } finally {
      rmSync(bad, { recursive: true, force: true });
      rmSync(good, { recursive: true, force: true });
    }
  });

  it("the real tracked tree has no private markers", () => {
    const { findings } = scanRepo(process.cwd());
    expect(findings).toEqual([]);
  });
});
