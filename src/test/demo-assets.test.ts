// The homepage / unlock keepsake examples are made from real, licensed dog photographs. These checks keep the assets
// small, described and credited, and make sure nothing points at an image that no longer exists.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  FILTER_EXAMPLES,
  HOME_EXAMPLES,
  PURCHASE_EXAMPLES,
} from "@/components/site/keepsake-examples";

const root = process.cwd();
const dir = join(root, "public/examples");
const credits = readFileSync(join(root, "docs/IMAGE-CREDITS.md"), "utf8");
const fileOf = (src: string) => join(root, "public", src);

describe("keepsake example assets", () => {
  it("has examples and every file exists", () => {
    expect(FILTER_EXAMPLES.length).toBeGreaterThanOrEqual(6);
    for (const e of FILTER_EXAMPLES) {
      expect(existsSync(fileOf(e.src)), e.src).toBe(true);
      if (e.before) expect(existsSync(fileOf(e.before.src)), e.before.src).toBe(true);
    }
  });

  it("keeps every file at 90 KB or less and the folder at 900 KB or less", () => {
    const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));
    let total = 0;
    for (const f of files) {
      const size = statSync(join(dir, f)).size;
      expect(size, f).toBeLessThanOrEqual(90 * 1024);
      total += size;
    }
    expect(total).toBeLessThanOrEqual(900 * 1024);
  });

  it("shows Story-ratio keepsakes beside their original photo, with a credit, and no EXIF", () => {
    const photos = FILTER_EXAMPLES.filter((e) => !e.illustration);
    expect(photos.length).toBeGreaterThanOrEqual(6);
    for (const e of photos) {
      expect(e.width! / e.height!, e.src).toBeCloseTo(9 / 16, 2);
      expect(e.before, e.src).toBeTruthy();
      expect(e.credit?.author, e.src).toBeTruthy();
      expect(credits, e.src).toContain(e.credit!.author);
    }
    for (const f of readdirSync(dir)) {
      expect(readFileSync(join(dir, f)).includes("EXIF"), `${f} has EXIF`).toBe(false);
      expect(f, "intermediate source files are not shipped").not.toMatch(/-source/);
    }
  });

  it("omits Then and Now from the public gallery and keeps the home set small", () => {
    expect(HOME_EXAMPLES.length).toBeGreaterThanOrEqual(3);
    expect(HOME_EXAMPLES.length).toBeLessThanOrEqual(4);
    expect(PURCHASE_EXAMPLES.length).toBeGreaterThanOrEqual(4);
    expect(PURCHASE_EXAMPLES.length).toBeLessThanOrEqual(6);
    for (const e of [...HOME_EXAMPLES, ...PURCHASE_EXAMPLES]) {
      expect(e.illustration, e.src).toBeFalsy();
      expect(e.src).not.toMatch(/then-and-now/);
    }
  });

  it("gives every image alt text and every example a label", () => {
    for (const e of FILTER_EXAMPLES) {
      expect(e.alt.trim().length, e.src).toBeGreaterThan(20);
      expect(e.label, e.src).toBeTruthy();
      if (e.before) expect(e.before.alt.trim().length, e.before.src).toBeGreaterThan(20);
    }
  });

  it("has a credit entry for every real photo and no orphan files", () => {
    for (const e of FILTER_EXAMPLES) {
      const id = e.src.replace("/examples/", "");
      expect(credits, `credit for ${id}`).toContain(id);
    }
    for (const f of readdirSync(dir)) expect(credits, `no credit entry for ${f}`).toContain(f);
  });

  it("credits state a license and a source for each photo", () => {
    expect(credits).toMatch(/Wikimedia Commons/);
    expect(credits).toMatch(/creativecommons\.org\/publicdomain\/zero\/1\.0|Public domain/);
    expect(credits).not.toMatch(/TODO|unknown license/i);
  });

  it("references no image that is not on disk", () => {
    const srcs = [
      "src/components/site/keepsake-examples.ts",
      "src/components/passport/KeepsakeUnlock.tsx",
      "src/routes/index.tsx",
      "src/routes/unlock.tsx",
    ];
    for (const s of srcs) {
      const text = readFileSync(join(root, s), "utf8");
      for (const m of text.matchAll(/\/examples\/[a-z0-9-]+\.webp/g))
        expect(existsSync(fileOf(m[0])), `${s} -> ${m[0]}`).toBe(true);
    }
  });
});
