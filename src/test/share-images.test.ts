import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { allGuides, isPublic } from "@/content/guides";

// Run `python3 scripts/make-share-images.py` after adding, retitling or unpublishing a guide, then
// `python3 scripts/make-pin-sheet.py` to refresh docs/pinterest-pins.csv.
const publicSlugs = new Set(allGuides.filter(isPublic).map((g) => g.slug));

describe("share images and pins", () => {
  it("every public guide has a share image and a Pinterest pin", () => {
    for (const g of allGuides.filter(isPublic)) {
      expect(existsSync(`public/share/${g.slug}.jpg`), `public/share/${g.slug}.jpg`).toBe(true);
      expect(existsSync(`public/pins/${g.slug}.jpg`), `public/pins/${g.slug}.jpg`).toBe(true);
    }
  });

  it("no stale pin or share image exists for a guide that is not public", () => {
    const stalePins = readdirSync("public/pins").filter((f) => f.endsWith(".jpg") && !publicSlugs.has(f.slice(0, -4)));
    const staleShares = readdirSync("public/share").filter((f) => f.endsWith(".jpg") && f !== "default.jpg" && !publicSlugs.has(f.slice(0, -4)));
    expect(stalePins, "run scripts/make-share-images.py to prune").toEqual([]);
    expect(staleShares, "run scripts/make-share-images.py to prune").toEqual([]);
  });

  it("docs/pinterest-pins.csv has one UTM-tagged row per public guide and none for others", () => {
    const lines = readFileSync("docs/pinterest-pins.csv", "utf8").trim().split("\n").slice(1);
    const dests = lines.map((l) => l.match(/https:\/\/www\.pawsandpassage\.com\/guides\/([a-z0-9-]+)\?(utm_source=pinterest&utm_medium=social&utm_campaign=[a-z0-9-]+&utm_content=([a-z0-9-]+))/));
    expect(dests.every(Boolean)).toBe(true);
    const slugs = dests.map((m) => m![1]);
    expect(new Set(slugs)).toEqual(publicSlugs);
    expect(slugs.length).toBe(publicSlugs.size);
    dests.forEach((m) => expect(m![3]).toBe(m![1]));
  });
});
