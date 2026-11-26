import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";

// Synthetic data only: the "premium" cards here are copies of two PUBLIC free adventures with new ids, access flipped to
// premium and showcase on. No real premium text is read or written by this test.
const REPO = process.cwd();
const script = join(REPO, "scripts", "premium-package.mjs");
const node = process.execPath;

function run(argv: string[]) {
  return spawnSync(node, [script, ...argv], {
    cwd: REPO,
    encoding: "utf8",
    env: { ...process.env, NETLIFY_AUTH_TOKEN: "", SITE_ID: "" },
    timeout: 90_000,
  });
}

function syntheticSource(dir: string) {
  const free = readdirSync(join(REPO, "content", "adventures")).filter((f) => f.endsWith(".yml"));
  const ids = ["adv-aaaaaa", "adv-bbbbbb"];
  ids.forEach((id, i) => {
    const a = parseYaml(
      readFileSync(join(REPO, "content", "adventures", free[i] as string), "utf8"),
    ) as Record<string, unknown>;
    writeFileSync(
      join(dir, `${id}.json`),
      JSON.stringify({ ...a, id, access: "premium", showcase: true }),
    );
  });
  return ids;
}

describe("scripts/premium-package.mjs", () => {
  it("refuses to write inside the repository and creates nothing there", () => {
    const r = run(["--out", join(REPO, "node_modules", ".tmp-package-test")]);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/OUTSIDE the git repository/);
  });

  it("requires --out", () => {
    const r = run([]);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/Missing --out/);
  });

  it("builds a complete, hashed package from synthetic cards", () => {
    const tmp = mkdtempSync(join(tmpdir(), "pkg-test-"));
    try {
      const src = join(tmp, "src");
      mkdirSync(src);
      const ids = syntheticSource(src);
      const out = join(tmp, "out");
      const r = run(["--out", out, "--source", src, "--date", "2030-01-02"]);
      expect(r.stderr.replace(/.*UNDICI.*|.*trace-warnings.*/g, "").trim()).toBe("");
      expect(r.status).toBe(0);
      const pkg = join(out, "premium-2030-01-02-1");
      for (const f of [
        "premium-import.json",
        "public-previews.json",
        "collections.json",
        "keepsake-configs.json",
        "validation-report.txt",
        "MANIFEST.json",
        "IMPORT.md",
        "EXPORT-RECOVERY.md",
      ])
        expect(readdirSync(pkg)).toContain(f);
      expect(readdirSync(out)).toContain("premium-2030-01-02-1.zip");
      const all = JSON.parse(readFileSync(join(pkg, "premium-import.json"), "utf8")) as {
        id: string;
      }[];
      expect(all.map((a) => a.id)).toEqual(ids);
      expect(readFileSync(join(pkg, "validation-report.txt"), "utf8")).toMatch(
        /Validated 2 premium adventures/,
      );
      const manifest = JSON.parse(readFileSync(join(pkg, "MANIFEST.json"), "utf8")) as {
        version: string;
        files: { path: string; sha256: string }[];
      };
      expect(manifest.version).toBe("premium-2030-01-02-1");
      expect(manifest.files.length).toBe(9);
      for (const f of manifest.files)
        expect(
          createHash("sha256")
            .update(readFileSync(join(pkg, f.path)))
            .digest("hex"),
        ).toBe(f.sha256);
      // Public previews carry only allowlisted keys, never premium-only text fields.
      const prev = JSON.parse(readFileSync(join(pkg, "public-previews.json"), "utf8")) as {
        items: Record<string, unknown>[];
      };
      for (const it of prev.items)
        for (const banned of ["instructions", "twist", "reveal", "clue", "objective", "safety"])
          expect(it).not.toHaveProperty(banned);
      // A second build the same day gets the next number.
      const r2 = run(["--out", out, "--source", src, "--date", "2030-01-02"]);
      expect(r2.status).toBe(0);
      expect(readdirSync(out)).toContain("premium-2030-01-02-2");
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }, 120_000);

  it("refuses a card that carries an email address (customer-data guard)", () => {
    const tmp = mkdtempSync(join(tmpdir(), "pkg-test-"));
    try {
      const src = join(tmp, "src");
      mkdirSync(src);
      syntheticSource(src);
      const p = join(src, "adv-aaaaaa.json");
      const a = JSON.parse(readFileSync(p, "utf8")) as Record<string, unknown>;
      a["memoryPrompt"] = "Write to someone@example.com about it";
      writeFileSync(p, JSON.stringify(a));
      const r = run(["--out", join(tmp, "out"), "--source", src]);
      expect(r.status).not.toBe(0);
      expect(r.stderr).toMatch(/customer data or a secret/);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }, 120_000);
});
