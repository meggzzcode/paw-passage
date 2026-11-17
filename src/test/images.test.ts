import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { images, srcSetFor } from "@/lib/images";

const dir = join(process.cwd(), "src/assets");
const LIMIT = 420 * 1024; // photos are capped at q78+ and 1600px; the largest sits just over 400 KB

describe("image assets", () => {
  it("keeps every file in src/assets under the size limit", () => {
    const big = readdirSync(dir)
      .map((f) => [f, statSync(join(dir, f)).size] as const)
      .filter(([, size]) => size > LIMIT);
    expect(big).toEqual([]);
  });

  it("resolves every key in the images map to a string src", () => {
    for (const [key, img] of Object.entries(images)) {
      expect(typeof img.src, key).toBe("string");
      expect(img.src.length, key).toBeGreaterThan(0);
    }
  });

  it("offers an 800w/1600w srcset for hero images", () => {
    expect(srcSetFor("hero-porch")).toMatch(/ 800w, .* 1600w$/);
  });
});
