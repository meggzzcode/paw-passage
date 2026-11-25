import { describe, expect, it } from "vitest";
import { adventures, collections, stamps, achievements, freeLibrary } from "@/passport/content";
import { adventureSchema, validateLibrary, LIFE_STAGES } from "@/passport/schema";
import { exclusions } from "@/passport/engine";
import { syntheticPremium } from "@/passport/fixtures/premium.synthetic";

const FORBIDDEN = [
  /\bcure[sd]?\b/i,
  /treat your dog's/i,
  /\bmedications?\b/i,
  /\bdiagnos(e|es|ed|is)\b/i,
  /minutes of exercise/i,
];
const allText = (a: (typeof adventures)[number]) => JSON.stringify(a);

describe("free adventure library", () => {
  it("has 12 free published adventures", () => {
    expect(adventures).toHaveLength(12);
    expect(freeLibrary()).toBe(adventures);
    for (const a of adventures) {
      expect(a.access).toBe("free");
      expect(a.status).toBe("published");
    }
  });
  it.each(adventures.map((a) => [a.id, a] as const))("%s validates", (_id, a) => {
    expect(adventureSchema.safeParse(a).success).toBe(true);
  });
  it("has unique ids and unique titles", () => {
    expect(new Set(adventures.map((a) => a.id)).size).toBe(adventures.length);
    expect(new Set(adventures.map((a) => a.title)).size).toBe(adventures.length);
  });
  it("references only defined collections and stamps", () => {
    expect(
      validateLibrary(
        adventures,
        collections.map((c) => c.slug),
        stamps.map((s) => s.slug),
      ),
    ).toEqual([]);
  });
  it("never gives the title away in the clue", () => {
    for (const a of adventures) expect(a.clue.toLowerCase()).not.toContain(a.title.toLowerCase());
  });
  it("contains no forbidden claim words", () => {
    for (const a of adventures)
      for (const re of FORBIDDEN) expect(allText(a), `${a.id} ${re}`).not.toMatch(re);
  });
  it("gives every adventure at least one safety line", () => {
    for (const a of adventures) expect(a.safety.length).toBeGreaterThan(0);
  });
  it("has water, heat or cold adventures that tell owners to check conditions and supervise", () => {
    for (const a of adventures.filter((x) =>
      /\b(water|beach|shore|heat|cold|sun|hot (?:pavement|surfaces|weather))\b/i.test(
        x.safety.join(" "),
      ),
    ))
      expect(a.safety.join(" "), a.id).toMatch(/check|supervis|weather|temperature/i);
  });
  it("has at least 4 mobility-friendly adventures", () => {
    expect(adventures.filter((a) => a.mobilityFriendly).length).toBeGreaterThanOrEqual(4);
  });
});

describe("life-stage suitability", () => {
  it.each(LIFE_STAGES)("has at least 6 suitable free adventures for %s", (lifeStage) => {
    expect(
      adventures.filter((a) => exclusions(a, { lifeStage }).length === 0).length,
    ).toBeGreaterThanOrEqual(6);
  });
  it("keeps at least 4 for a limited-mobility, nervous dog", () => {
    const profile = { limitedMobility: true, nervousAroundDogs: true, nervousAroundPeople: true };
    expect(
      adventures.filter((a) => exclusions(a, profile).length === 0).length,
    ).toBeGreaterThanOrEqual(4);
  });
});

describe("collections, stamps, achievements", () => {
  it("has 8 to 10 collections with unique slugs and orders", () => {
    expect(collections.length).toBeGreaterThanOrEqual(8);
    expect(collections.length).toBeLessThanOrEqual(10);
    expect(new Set(collections.map((c) => c.slug)).size).toBe(collections.length);
    expect(new Set(collections.map((c) => c.order)).size).toBe(collections.length);
  });
  it("fills every non-premium collection with 3 or more free adventures", () => {
    for (const c of collections.filter((x) => !x.premiumOnly))
      expect(
        adventures.filter((a) => a.collections.includes(c.slug)).length,
        c.slug,
      ).toBeGreaterThanOrEqual(3);
    for (const c of collections.filter((x) => x.premiumOnly))
      expect(c.description).toMatch(/premium library/i);
  });
  it("keeps the zero-cost collection honest", () => {
    for (const a of adventures.filter((x) =>
      x.collections.includes("adventures-without-spending-a-dollar"),
    ))
      expect(a.costMax, a.id).toBe(0);
  });
  it("has the 12 named stamps", () => {
    expect(stamps.map((s) => s.slug).sort()).toEqual(
      [
        "first-adventure",
        "cozy-companion",
        "beach-explorer",
        "trail-blazer",
        "city-explorer",
        "playtime-champion",
        "road-tripper",
        "night-owl",
        "sunshine-seeker",
        "memory-maker",
        "seasonal-explorer",
        "adventure-legend",
      ].sort(),
    );
  });
  it("lets a senior apartment dog earn at least 6 stamps from the free set", () => {
    const earned = new Set<string>();
    for (const a of adventures)
      if (a.lifeStages.includes("senior") && a.environments.includes("apartment"))
        a.stamps.forEach((s) => earned.add(s));
    expect(earned.size).toBeGreaterThanOrEqual(6);
  });
  it("has milestones for every threshold plus collection complete", () => {
    expect(achievements.filter((a) => a.kind === "count").map((a) => a.threshold)).toEqual([
      1, 5, 10, 20, 30, 50, 75,
    ]);
    expect(achievements.some((a) => a.kind === "collection-complete")).toBe(true);
  });
});

describe("synthetic premium fixtures", () => {
  it("are clearly marked, valid and kept out of the free library", () => {
    expect(syntheticPremium).toHaveLength(3);
    for (const a of syntheticPremium) {
      expect(a.id).toMatch(/^adv-syn00[1-3]$/);
      expect(a.title.startsWith("SYNTHETIC")).toBe(true);
      expect(adventureSchema.safeParse(a).success).toBe(true);
      expect(freeLibrary().some((f) => f.id === a.id)).toBe(false);
    }
  });
});
