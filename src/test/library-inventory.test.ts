// The inventory script runs and its counts agree with each other and with the card files. Reads aggregates only.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const run = (flag: string) =>
  execFileSync("node", [join(root, "scripts/library-stats.mjs"), flag], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
// Premium text is not tracked in the repository. The script runs in FREE-ONLY mode unless PREMIUM_DIR points at the premium folder.
// The checks that need the real library are OWNER-MACHINE checks (skipped here, visibly, without PREMIUM_DIR; docs/PREMIUM-INTEGRATION-TESTS.md).
const PREMIUM_DIR = process.env["PREMIUM_DIR"]?.trim() || "";
const HAS_PREMIUM = Boolean(PREMIUM_DIR) && existsSync(PREMIUM_DIR);
const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

describe("library inventory script", () => {
  const out = run("--json");
  const s = JSON.parse(out);
  const d = s.distributions;

  it("validates every card and finds no duplicate ids", () => {
    expect(s.validation.invalidCards).toEqual([]);
    expect(s.validation.duplicateIds).toEqual([]);
  });

  it("card counts are internally consistent", () => {
    const c = s.cards;
    expect(c.published + c.draft).toBe(c.uniqueCore);
    expect(c.freeIntroPool + c.premiumPublished).toBe(c.published);
    expect(c.publicPremiumPreviews).toBeLessThanOrEqual(c.premiumPublished);
    expect(c.showcaseWithoutTeaser).toEqual([]);
    const free = readdirSync(join(root, "content/adventures")).filter((f) => f.endsWith(".yml"));
    expect(c.freeIntroPool + c.freeDraft).toBe(free.length);
    const prem = HAS_PREMIUM
      ? readdirSync(PREMIUM_DIR).filter((f) => f.endsWith(".json")).length
      : 0;
    expect(c.premiumPublished + c.premiumDraft).toBe(prem);
  });

  it("states its mode: free-only (with a notice) without PREMIUM_DIR, full with it", () => {
    expect(s.mode).toBe(HAS_PREMIUM ? "full" : "free-only");
    expect(typeof s.notice).toBe("string");
    if (!HAS_PREMIUM) {
      expect(s.notice).toMatch(/PARTIAL MODE/);
      expect(s.cards.premiumPublished).toBe(0);
      expect(run("--md")).toMatch(/PARTIAL MODE/);
    }
  });

  it.skipIf(!HAS_PREMIUM)(
    "OWNER-MACHINE check (skipped without PREMIUM_DIR): full mode counts every premium file",
    () => {
      expect(s.cards.premiumPublished + s.cards.premiumDraft).toBeGreaterThan(0);
      expect(s.cards.publicPremiumPreviews).toBeGreaterThan(0);
    },
  );

  it("single-valued distributions each add up to the published count", () => {
    const n = s.cards.published;
    for (const k of ["dogEnergy", "ownerEffort", "duration", "budget", "setting", "role"])
      expect(sum(d[k]), k).toBe(n);
    expect(sum(d.activityTypePrimary)).toBe(n);
  });

  it("subset counts never exceed the library and no-spend splits add up", () => {
    const n = s.cards.published;
    for (const k of [
      "family",
      "twoDogHousehold",
      "limitedMobilityDog",
      "apartmentFriendly",
      "noCar",
    ])
      expect(d[k], k).toBeLessThanOrEqual(n);
    expect(d.noAdditionalSpending).toBe(d.noAdditionalSpendingFree + d.noAdditionalSpendingPremium);
    expect(d.budget.free ?? 0).toBe(d.noAdditionalSpending);
    expect(s.noSpendCheck.costMaxZeroCards).toBe(d.noAdditionalSpending);
  });

  it("keepsake, collection and reward counts match their sources", () => {
    const k = s.keepsake;
    expect(sum(k.themesPerFamily)).toBe(k.themesRegistered);
    expect(k.cardsWithRegisteredTheme + k.cardsWithUnregisteredTheme.length).toBe(
      s.cards.published,
    );
    expect(k.adventureSpecificConfigurations).toBeLessThanOrEqual(k.themesRegistered);
    expect(s.collections.curatedWithPublishedCards).toBeLessThanOrEqual(s.collections.defined);
    expect(s.rewards.stamps).toBe(
      (readFileSync(join(root, "content/stamps.yml"), "utf8").match(/^\s+- slug:/gm) ?? []).length,
    );
    expect(s.bonusExperiences.total).toBe(
      s.bonusExperiences.printables + s.bonusExperiences.itineraries + s.bonusExperiences.shortcuts,
    );
  });

  it("showcase composition adds up and the markdown table renders", () => {
    expect(sum(s.showcase.role)).toBe(s.showcase.count);
    expect(sum(s.showcase.energy)).toBe(s.showcase.count);
    expect(sum(s.showcase.setting)).toBe(s.showcase.count);
    const md = run("--md");
    expect(md).toContain("| Measure | Value |");
    expect(md).toContain("Free intro pool");
  });

  it.skipIf(!HAS_PREMIUM)(
    "OWNER-MACHINE check (skipped without PREMIUM_DIR): prints no premium titles or teasers",
    () => {
      const premDir = PREMIUM_DIR;
      for (const f of readdirSync(premDir).filter((x) => x.endsWith(".json"))) {
        const a = JSON.parse(readFileSync(join(premDir, f), "utf8")) as {
          title: string;
          teaser?: string;
        };
        expect(out).not.toContain(a.title);
        if (a.teaser) expect(out).not.toContain(a.teaser);
      }
    },
  );
});
