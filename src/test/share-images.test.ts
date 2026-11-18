import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { allGuides, isPublic } from "@/content/guides";

// Run `python3 scripts/make-share-images.py` after adding or retitling a guide.
describe("share images and pins", () => {
  it("every public guide has a share image and a Pinterest pin", () => {
    for (const g of allGuides.filter(isPublic)) {
      expect(existsSync(`public/share/${g.slug}.jpg`), `public/share/${g.slug}.jpg`).toBe(true);
      expect(existsSync(`public/pins/${g.slug}.jpg`), `public/pins/${g.slug}.jpg`).toBe(true);
    }
  });
});
