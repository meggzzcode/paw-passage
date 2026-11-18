import { describe, it, expect } from "vitest";
import { buildHostQuestions, type DogProfile } from "@/lib/host-questions";
import {
  computeCost,
  petFeeTotal,
  parseStay,
  blankStay,
  lowestIndex,
  differenceText,
  summaryText,
  exampleStays,
  type StayForm,
} from "@/lib/cost";
import { parseChecklist } from "@/lib/checklist-storage";

const needs = {
  fencedYard: false,
  jumper: false,
  digger: false,
  pool: false,
  crate: true,
  leftAlone: true,
  furniture: false,
  stairsHard: false,
  reactive: false,
  beach: false,
};
const prof = (o: Partial<DogProfile>): DogProfile => ({
  dogName: "Biscuit",
  dogs: 1,
  size: "large",
  breed: "Border Collie mix",
  needs,
  ...o,
});

describe("host questions grammar", () => {
  it("singular uses the dog's name", () => {
    const m = buildHostQuestions(prof({})).message;
    expect(m).toContain("Biscuit is left");
    expect(m).toContain("Can Biscuit be left alone");
    expect(m).toContain("traveling with Biscuit, a large Border Collie mix");
  });
  it.each([2, 3])("plural (%i dogs) is grammatical and keeps details", (n) => {
    const m = buildHostQuestions(prof({ dogs: n })).message;
    expect(m).not.toMatch(/\bthem\b/);
    expect(m).toContain("the dogs are left");
    expect(m).toContain("Can the dogs be left alone");
    expect(m).toContain(n === 2 ? "two dogs" : "three dogs");
    expect(m).toContain("including Biscuit");
    expect(m).toContain("largest is large");
    expect(m).toContain("Border Collie mix");
  });
  it("plural without a name still reads well", () => {
    const m = buildHostQuestions(prof({ dogs: 2, dogName: "", breed: "" })).message;
    expect(m).toContain("traveling with two dogs. The largest is large.");
  });
});

const base = {
  nightly: 200,
  nights: 4,
  cleaning: 100,
  otherFees: 25,
  petFee: 50,
  dogs: 2,
  taxPct: 10,
  deposit: 300,
  label: "A",
};
describe("cost helper", () => {
  it("per stay / night / dog / dog-night", () => {
    expect(computeCost({ ...base, petFeeBasis: "stay" }).total).toBe(1067.5);
    expect(computeCost({ ...base, petFeeBasis: "night" }).total).toBe(1217.5);
    expect(computeCost({ ...base, petFeeBasis: "dog" }).total).toBe(1117.5);
    expect(computeCost({ ...base, petFeeBasis: "dog-night" }).total).toBe(1417.5);
    expect(petFeeTotal(10, "dog", 5, 3)).toBe(30);
  });
  it("tax and deposit", () => {
    const r = computeCost({ ...base, petFeeBasis: "stay" });
    expect(r.tax).toBe(92.5);
    expect(r.upfront).toBe(1367.5);
    expect(r.perNight).toBe(266.88);
  });
  it("parses blank strings as zero", () => {
    expect(parseStay(blankStay("x")).nightly).toBe(0);
    expect(parseStay({ ...blankStay("x"), nightly: "abc" }).nightly).toBe(0);
  });
  it("lowest only compares filled stays and needs two", () => {
    const a: StayForm = { ...blankStay("A"), nightly: "200" };
    const b = blankStay("B");
    expect(lowestIndex([a, b])).toBe(-1);
    expect(differenceText([a, b])).toBeNull();
    const c: StayForm = { ...blankStay("C"), nightly: "100" };
    expect(lowestIndex([a, b, c])).toBe(2);
  });
  it("example stays give a difference sentence and summary", () => {
    const ex = exampleStays();
    expect(differenceText(ex)).toMatch(
      /^Example Stay [AB] costs \$[\d,.]+ more than Example Stay [AB] \(4 nights, 2 dogs\)\.$/,
    );
    expect(summaryText(ex)).toContain("Total:");
  });
});

describe("checklist storage parsing", () => {
  it("ignores null and non-object JSON", () => {
    for (const raw of ["null", "5", "[1]", '"x"', "{bad", "", null])
      expect(parseChecklist(raw)).toEqual({});
  });
  it("keeps ticked booleans", () => {
    expect(parseChecklist('{"a":true,"b":false,"c":3}')).toEqual({ a: true });
  });
});
