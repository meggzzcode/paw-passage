import { describe, it, expect } from "vitest";
import { staySearchSchema } from "@/lib/stay-search";
import { placeSearchSchema } from "@/lib/place-search";

const stayDefaults = {
  q: "", state: "", town: "", type: "", dogs: 0,
  fenced: false, outdoor: false, large: false, multi: false, noFee: false, noBreed: false,
  beach: false, mountain: false, hotTub: false, airCon: false, grill: false, parking: false,
  weightMin: 0, sort: "recommended",
};
const placeDefaults = { q: "", state: "", kind: "", trails: "" };

const huge = Array.from({ length: 50_000 }, (_, i) => String(i));
const bigString = "x".repeat(1_000_000);

describe("stays search params keep their defaults and fallbacks", () => {
  it("missing params give every default", () => {
    expect(staySearchSchema.parse({})).toEqual(stayDefaults);
  });
  it("invalid values fall back per field and valid ones are kept", () => {
    const out = staySearchSchema.parse({ dogs: "abc", weightMin: "zzz", fenced: "yes", sort: 5, state: "georgia", dogsExtra: 1 });
    expect(out).toEqual({ ...stayDefaults, state: "georgia" });
  });
  it("valid typed values pass through", () => {
    const out = staySearchSchema.parse({ dogs: 2, weightMin: 40, fenced: true, q: "cabin", sort: "name" });
    expect(out).toEqual({ ...stayDefaults, dogs: 2, weightMin: 40, fenced: true, q: "cabin", sort: "name" });
  });
  it("array-like, object and null values fall back", () => {
    const out = staySearchSchema.parse({ q: ["a", "b"], state: { a: 1 }, town: null, type: [1], dogs: [2], fenced: [true], sort: ["x"] });
    expect(out).toEqual(stayDefaults);
  });
  it("oversized arrays fall back quickly", () => {
    const t = Date.now();
    const out = staySearchSchema.parse({ q: huge, dogs: huge, fenced: huge, sort: huge, extra: huge });
    expect(out).toEqual(stayDefaults);
    expect(Date.now() - t).toBeLessThan(2000);
  });
  it("oversized strings stay strings, and a huge number string falls back", () => {
    expect(staySearchSchema.parse({ q: bigString }).q).toHaveLength(1_000_000);
    expect(staySearchSchema.parse({ dogs: bigString }).dogs).toBe(0);
  });
  it("undefined values count as missing", () => {
    expect(staySearchSchema.parse({ q: undefined, dogs: undefined })).toEqual(stayDefaults);
  });
});

describe("dog-rules search params keep their defaults and fallbacks", () => {
  it("missing params give every default", () => {
    expect(placeSearchSchema.parse({})).toEqual(placeDefaults);
  });
  it("invalid values fall back per field and valid ones are kept", () => {
    expect(placeSearchSchema.parse({ q: 5, state: "georgia", kind: false, trails: "yes" })).toEqual({ ...placeDefaults, state: "georgia", trails: "yes" });
  });
  it("array-like and object values fall back", () => {
    expect(placeSearchSchema.parse({ q: ["a"], state: { a: 1 }, kind: null, trails: [1, 2] })).toEqual(placeDefaults);
  });
  it("oversized arrays fall back quickly", () => {
    const t = Date.now();
    expect(placeSearchSchema.parse({ q: huge, state: huge, kind: huge, trails: huge, extra: huge })).toEqual(placeDefaults);
    expect(Date.now() - t).toBeLessThan(2000);
  });
  it("oversized strings stay strings", () => {
    expect(placeSearchSchema.parse({ q: bigString }).q).toHaveLength(1_000_000);
  });
});
