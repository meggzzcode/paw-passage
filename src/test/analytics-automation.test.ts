import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

// @ts-expect-error plain .mjs script without types
import * as indexnow from "../../scripts/indexnow.mjs";

const root = process.cwd();

describe("workflows and dependabot parse as YAML", () => {
  for (const f of readdirSync(join(root, ".github/workflows"))) {
    it(f, () => {
      expect(parse(readFileSync(join(root, ".github/workflows", f), "utf8"))).toBeTruthy();
    });
  }
  it("dependabot.yml is grouped and limited", () => {
    const d = parse(readFileSync(join(root, ".github/dependabot.yml"), "utf8")) as {
      updates: {
        "package-ecosystem": string;
        "open-pull-requests-limit": number;
        groups: object;
      }[];
    };
    expect(d.updates.map((u) => u["package-ecosystem"]).sort()).toEqual(["github-actions", "npm"]);
    for (const u of d.updates) {
      expect(u["open-pull-requests-limit"]).toBeLessThanOrEqual(5);
      expect(Object.keys(u.groups).length).toBeGreaterThan(0);
    }
  });
  it("the IndexNow workflow only runs by hand", () => {
    const w = parse(readFileSync(join(root, ".github/workflows/indexnow.yml"), "utf8")) as {
      on: Record<string, unknown>;
    };
    expect(Object.keys(w.on)).toEqual(["workflow_dispatch"]);
  });
});

describe("IndexNow", () => {
  it("has a valid public key file", () => {
    const key = indexnow.findKey(join(root, "public"));
    expect(key).toMatch(/^[A-Za-z0-9-]{8,128}$/);
  });
  it("builds a payload with only own-host URLs", () => {
    const p = indexnow.buildPayload("k".repeat(16), "www.pawsandpassage.com", [
      "https://www.pawsandpassage.com/a",
      "https://evil.example/b",
      "https://www.pawsandpassage.com/a",
    ]);
    expect(p.urlList).toEqual(["https://www.pawsandpassage.com/a"]);
    expect(p.keyLocation).toBe(`https://www.pawsandpassage.com/${"k".repeat(16)}.txt`);
  });
});
