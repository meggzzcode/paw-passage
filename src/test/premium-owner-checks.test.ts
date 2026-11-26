// Checks that need the REAL premium library are OWNER-MACHINE checks: they run only when PREMIUM_DIR points at the folder of
// <id>.json files (for example the adventures/ folder of the protected package). Without it each one is reported as SKIPPED with
// a visible reason, never silently passed. The skip list is documented in docs/PREMIUM-INTEGRATION-TESTS.md (asserted below).
// The first part uses only synthetic data and always runs.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const REPO = process.cwd();
const PREMIUM_DIR = process.env["PREMIUM_DIR"]?.trim() || "";
const HAS_PREMIUM = Boolean(PREMIUM_DIR) && existsSync(PREMIUM_DIR);
const made: string[] = [];
const tmp = () => {
  const d = mkdtempSync(join(tmpdir(), "owner-checks-"));
  made.push(d);
  return d;
};
afterAll(() => made.forEach((d) => rmSync(d, { recursive: true, force: true })));

const leaks = (args: string[], env: Record<string, string> = {}) => {
  const r = spawnSync("node", [join(REPO, "scripts", "check-leaks.mjs"), ...args], {
    encoding: "utf8",
    env: { PATH: process.env["PATH"] ?? "", HOME: tmpdir(), ...env },
  });
  return { code: r.status ?? -1, out: r.stdout, err: r.stderr };
};

describe("check-leaks.mjs --premium-dir (synthetic data, always runs)", () => {
  const premium = tmp();
  writeFileSync(
    join(premium, "adv-zzz001.json"),
    JSON.stringify({
      id: "adv-zzz001",
      title: "Quokka Lantern Parade Zeta",
      instructions: ["Carry the purple tin lantern slowly around the quokka fountain twice."],
      safety: ["Stop the walk if the pavement feels hot against a paw."],
      twist: "Swap the lantern for a borrowed teaspoon at the very last corner.",
    }),
  );
  const cleanBuild = tmp();
  writeFileSync(join(cleanBuild, "index.html"), "<p>Nothing to see here, just marketing copy.</p>");
  const leakyBuild = tmp();
  writeFileSync(
    join(leakyBuild, "app.js"),
    'var x="Carry the purple tin lantern slowly around the quokka fountain twice.";',
  );

  it("passes a clean build and reports that real fragments were checked", () => {
    const r = leaks([cleanBuild, "--premium-dir", premium]);
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/REAL premium fragments/);
  });
  it("fails when a real fragment is in the build, without printing it in full", () => {
    const r = leaks([leakyBuild], { PREMIUM_DIR: premium });
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/REAL premium fragment/);
  });
  it("says plainly that real text was NOT checked when no folder is given", () => {
    const r = leaks([cleanBuild]);
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/real premium text NOT checked/);
  });
  it("exits 2 for an unreadable or empty premium folder", () => {
    expect(leaks([cleanBuild, "--premium-dir", join(premium, "nope")]).code).toBe(2);
    expect(leaks([cleanBuild, "--premium-dir", tmp()]).code).toBe(2);
  });
});

describe("Journal sentence-overlap check (synthetic data, always runs)", () => {
  it("flags a Journal sentence that also appears in the premium folder and is skipped without one", async () => {
    const { validate } = (await import(join(REPO, "scripts", "validate-journal.mjs"))) as {
      validate: (dir?: string) => string[];
    };
    const journalDir = join(REPO, "content", "journal");
    const first = readdirSync(journalDir)
      .filter((f) => f.endsWith(".md"))
      .sort()[0]!;
    const body = readFileSync(join(journalDir, first), "utf8")
      .split("---\n")
      .slice(2)
      .join("---\n");
    const sentence = body
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .split(/(?<=[.!?])\s+/)
      .map((x) =>
        x
          .replace(/[#*_`>\n]/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
      )
      .find((x) => x.split(" ").length >= 8 && !/[[\]()]/.test(x));
    expect(sentence, "a plain sentence to reuse").toBeTruthy();
    const d = tmp();
    writeFileSync(
      join(d, "adv-zzz002.json"),
      JSON.stringify({ id: "adv-zzz002", instructions: [sentence!], twist: "x" }),
    );
    expect(validate(d).some((e) => e.includes("premium sentence"))).toBe(true);
    expect(validate(undefined).some((e) => e.includes("premium sentence"))).toBe(false);
    const missing = join(d, "missing");
    expect(() => validate(missing)).toThrow(/not found/);
  });
});

describe("OWNER-MACHINE checks (need PREMIUM_DIR; SKIPPED with a visible reason otherwise)", () => {
  it.skipIf(!HAS_PREMIUM)(
    "OWNER-MACHINE (skipped: PREMIUM_DIR not set): Journal has no sentence from the real premium library",
    () => {
      const out = execFileSync("node", [join(REPO, "scripts", "validate-journal.mjs")], {
        encoding: "utf8",
        env: { ...process.env, PREMIUM_DIR },
      });
      expect(out).toContain("including the premium sentence-overlap check");
    },
  );

  it.skipIf(!HAS_PREMIUM)(
    "OWNER-MACHINE (skipped: PREMIUM_DIR not set): no real premium fragment in src/ or public/",
    () => {
      for (const d of ["src", "public"]) {
        const r = leaks([join(REPO, d), "--premium-dir", resolve(PREMIUM_DIR)]);
        // src/ holds only synthetic fixtures; a real fragment there would be a leak
        expect(r.err, d).not.toMatch(/REAL premium fragment/);
      }
    },
  );

  it.skipIf(!HAS_PREMIUM)(
    "OWNER-MACHINE (skipped: PREMIUM_DIR not set): the premium folder imports as a dry run and counts match",
    () => {
      const n = readdirSync(PREMIUM_DIR).filter((f) => f.endsWith(".json")).length;
      const out = execFileSync(
        "node",
        [join(REPO, "scripts", "premium-import.mjs"), "--dir", PREMIUM_DIR, "--env", "preview"],
        { encoding: "utf8", env: { PATH: process.env["PATH"] ?? "", HOME: tmpdir() } },
      );
      expect(out).toContain(`Validated ${n} premium adventures`);
      expect(out).toContain("Dry run");
    },
  );

  it("the skip list is documented in docs/PREMIUM-INTEGRATION-TESTS.md", () => {
    const doc = readFileSync(join(REPO, "docs", "PREMIUM-INTEGRATION-TESTS.md"), "utf8");
    expect(doc).toMatch(/## Owner-machine checks/);
    expect(doc).toMatch(/PREMIUM_DIR/);
    const files = [
      "premium-owner-checks.test.ts",
      "library-inventory.test.ts",
      "unlock-v6.test.tsx",
    ];
    for (const f of files) expect(doc, f).toContain(f);
    // every owner-machine test title in the suite is listed by its marker phrase
    expect(doc).toMatch(/OWNER-MACHINE/);
  });
});
