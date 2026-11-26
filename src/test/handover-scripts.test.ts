import { afterAll, describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { syntheticPremium } from "@/passport/fixtures/premium.synthetic";

// Tests the --dir import/export mode with temp folders and the SYNTHETIC fixtures. Never touches real premium data, never
// uses --write, never reaches the network (no token is set, so the scripts stop before any store is opened).
const REPO = process.cwd();
const made: string[] = [];
const tmp = () => {
  const d = mkdtempSync(join(tmpdir(), "handover-"));
  made.push(d);
  return d;
};
afterAll(() => made.forEach((d) => rmSync(d, { recursive: true, force: true })));

const run = (script: string, args: string[]) => {
  try {
    const out = execFileSync("node", [join(REPO, "scripts", script), ...args], {
      stdio: "pipe",
      env: { PATH: process.env["PATH"] ?? "", HOME: tmpdir() },
    });
    return { code: 0, out: out.toString(), err: "" };
  } catch (e) {
    const x = e as { status: number; stdout: Buffer; stderr: Buffer };
    return { code: x.status, out: x.stdout.toString(), err: x.stderr.toString() };
  }
};
const fill = (dir: string) => {
  for (const a of syntheticPremium)
    writeFileSync(join(dir, `${a.id}.json`), JSON.stringify(a, null, 2));
};

describe("premium-import.mjs --dir", () => {
  it("validates one-file-per-adventure folders and is a dry run by default", () => {
    const d = tmp();
    fill(d);
    mkdirSync(join(d, "road-trips"));
    writeFileSync(
      join(d, "road-trips", "adv-syn009.json"),
      JSON.stringify({ ...syntheticPremium[0], id: "adv-syn009", title: "SYNTHETIC Nine" }),
    );
    const r = run("premium-import.mjs", ["--dir", d, "--env", "preview"]);
    expect(r.err).toBe("");
    expect(r.code).toBe(0);
    expect(r.out).toContain(`Validated ${syntheticPremium.length + 1} premium adventures`);
    expect(r.out).toContain("Dry run: nothing written");
  });

  it("without --write it never needs credentials; with --write and no token it stops before any store", () => {
    const d = tmp();
    fill(d);
    const r = run("premium-import.mjs", ["--dir", d, "--env", "preview", "--write"]);
    expect(r.code).toBe(2);
    expect(r.err).toContain("NETLIFY_AUTH_TOKEN is not set");
  });

  it("reports schema problems with the file named, and refuses mismatched file names and arrays", () => {
    const d = tmp();
    fill(d);
    writeFileSync(
      join(d, "adv-syn001.json"),
      JSON.stringify({ ...syntheticPremium[0], title: "" }),
    );
    writeFileSync(
      join(d, "wrong-name.json"),
      JSON.stringify({ ...syntheticPremium[1], id: "adv-syn777" }),
    );
    writeFileSync(join(d, "list.json"), JSON.stringify(syntheticPremium));
    writeFileSync(join(d, "broken.json"), "{ nope");
    const r = run("premium-import.mjs", ["--dir", d, "--env", "preview"]);
    expect(r.code).toBe(1);
    expect(r.err).toContain("title");
    expect(r.err).toContain("wrong-name.json: file name must be the adventure id");
    expect(r.err).toContain("list.json: must contain ONE adventure object");
    expect(r.err).toContain("broken.json: not valid JSON");
  });

  it("rejects free adventures and duplicate ids", () => {
    const d = tmp();
    fill(d);
    mkdirSync(join(d, "copy"));
    writeFileSync(join(d, "copy", "adv-syn001.json"), JSON.stringify(syntheticPremium[0]));
    expect(run("premium-import.mjs", ["--dir", d]).err).toContain("duplicate adventure id");
    const d2 = tmp();
    writeFileSync(
      join(d2, "adv-syn001.json"),
      JSON.stringify({ ...syntheticPremium[0], access: "free" }),
    );
    expect(run("premium-import.mjs", ["--dir", d2]).err).toContain('access must be "premium"');
  });

  it("refuses folders inside the repository other than content/premium, and --file with --dir", () => {
    const r = run("premium-import.mjs", ["--dir", join(REPO, "src")]);
    expect(r.code).toBe(2);
    expect(r.err).toContain("outside the repository");
    const d = tmp();
    expect(run("premium-import.mjs", ["--dir", d, "--file", join(d, "x.json")]).code).toBe(2);
    expect(
      run("premium-import.mjs", ["--dir", join(tmpdir(), "does-not-exist-xyz")]).err,
    ).toContain("Folder not found");
  });

  it("content/premium is still the one accepted in-repo folder (git-ignored local working copy): not refused as in-repo", () => {
    // Absent in a clean checkout (the premium text is not tracked): the error must be "not found", never the in-repo refusal.
    const target = join(REPO, "content", "premium");
    const r = run("premium-import.mjs", ["--dir", target, "--env", "preview"]);
    expect(r.err).not.toContain("outside the repository");
    if (!existsSync(target)) expect(r.err).toContain("Folder not found");
  });

  it("without --dir and without PREMIUM_DIR it stops with an explicit message; PREMIUM_DIR is honored", () => {
    for (const script of ["premium-import.mjs", "premium-split.mjs"]) {
      const r = run(script, script === "premium-split.mjs" ? ["--file", "x.json"] : []);
      expect(r.code, script).toBe(2);
      expect(r.err, script).toContain("PREMIUM_DIR");
      expect(r.err, script).toContain("not stored in this repository");
    }
    const d = tmp();
    fill(d);
    const out = execFileSync("node", [join(REPO, "scripts", "premium-import.mjs")], {
      stdio: "pipe",
      env: { PATH: process.env["PATH"] ?? "", HOME: tmpdir(), PREMIUM_DIR: d },
    }).toString();
    expect(out).toContain(`Validated ${syntheticPremium.length} premium adventures`);
    expect(out).toContain("Dry run");
  });
});

describe("premium-export.mjs --dir and premium-split.mjs", () => {
  it("export --dir refuses repository folders and needs credentials before touching a store", () => {
    expect(run("premium-export.mjs", ["--dir", join(REPO, "src")]).err).toContain(
      "outside the repository",
    );
    const d = join(tmp(), "backup");
    const r = run("premium-export.mjs", ["--dir", d, "--env", "production"]);
    expect(r.code).toBe(2);
    expect(r.err).toContain("NETLIFY_AUTH_TOKEN is not set");
    expect(run("premium-export.mjs", ["--dir", d, "--out", join(d, "a.json")]).code).toBe(2);
  });

  it("split writes one <id>.json per adventure, round-trips through import --dir, and refuses to overwrite", () => {
    const base = tmp();
    const src = join(base, "all.json");
    writeFileSync(src, JSON.stringify(syntheticPremium));
    const out = join(base, "folder");
    const s = run("premium-split.mjs", ["--file", src, "--dir", out]);
    expect(s.code).toBe(0);
    expect(readdirSync(out).sort()).toEqual(syntheticPremium.map((a) => `${a.id}.json`).sort());
    const first = JSON.parse(readFileSync(join(out, `${syntheticPremium[0]!.id}.json`), "utf8"));
    expect(first).toEqual(JSON.parse(JSON.stringify(syntheticPremium[0])));
    const imp = run("premium-import.mjs", ["--dir", out, "--env", "preview"]);
    expect(imp.code).toBe(0);
    expect(imp.out).toContain("Dry run");
    const again = run("premium-split.mjs", ["--file", src, "--dir", out]);
    expect(again.code).toBe(2);
    expect(again.err).toContain("already exist");
    expect(run("premium-split.mjs", ["--file", src, "--dir", out, "--overwrite"]).code).toBe(0);
    expect(run("premium-split.mjs", ["--file", src, "--dir", join(REPO, "src")]).code).toBe(2);
  });
});
