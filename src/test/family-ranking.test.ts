import { describe, expect, it } from "vitest";
import { freeLibrary } from "@/passport/content";
import { emptySave } from "@/passport/progress";
import { selectStarter } from "@/passport/starter";

// Family-tagged adventures are preferred ONLY when children are joining; they must not win ties for unrelated profiles.
const lib = freeLibrary();
const withAnswers = (dog: Record<string, unknown>, owner: Record<string, unknown>) => {
  const s = emptySave();
  return { ...s, profile: { data: dog, at: 1 }, owner: { data: owner, at: 1 } } as typeof s;
};
const pick = (dog: Record<string, unknown>, owner: Record<string, unknown>, relax = false) => {
  const r = selectStarter(lib, withAnswers(dog, owner), new Set(), { relax });
  if (!r.ok) throw new Error(r.reason);
  return r.adventure;
};

describe("family preference", () => {
  it("the free pool has family-tagged adventures to test with", () => {
    expect(lib.filter((a) => a.household.includes("family")).length).toBeGreaterThan(0);
  });

  it.each([
    ["no answers", {}, {}],
    ["young puppy", { lifeStage: "puppy" }, {}],
    ["senior", { lifeStage: "senior" }, {}],
    ["senior and quiet", { lifeStage: "senior", energy: "gentle" }, { quiet: true }],
    ["puppy, nearby", { lifeStage: "puppy" }, { where: "nearby" }],
    ["kids explicitly false", { lifeStage: "senior" }, { kids: false }],
  ])("without children (%s) the top pick is not family-tagged", (_n, dog, owner) => {
    expect(pick(dog, owner).household).not.toContain("family");
  });

  it.each([{ lifeStage: "puppy" }, { lifeStage: "senior" }, {}])(
    "with children joining a family adventure is preferred (%j), also when widened",
    (dog) => {
      expect(pick(dog, { kids: true }).household).toContain("family");
      expect(pick(dog, { kids: true }, true).household).toContain("family");
    },
  );
});
