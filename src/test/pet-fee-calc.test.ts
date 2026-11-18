import { describe, expect, it } from "vitest";
import { petFeeTotal } from "@/lib/pet-fee-calc";

describe("petFeeTotal", () => {
  it("handles each fee basis", () => {
    expect(petFeeTotal({ amount: 75, basis: "stay", nights: 2, dogs: 2 })).toBe(75);
    expect(petFeeTotal({ amount: 25, basis: "night", nights: 2, dogs: 2 })).toBe(50);
    expect(petFeeTotal({ amount: 50, basis: "dog", nights: 2, dogs: 2 })).toBe(100);
    expect(petFeeTotal({ amount: 20, basis: "dog-night", nights: 2, dogs: 2 })).toBe(80);
  });
  it("rejects bad input", () => {
    expect(petFeeTotal({ amount: 10, basis: "night", nights: -1, dogs: 1 })).toBeNull();
    expect(petFeeTotal({ amount: NaN, basis: "night", nights: 1, dogs: 1 })).toBeNull();
  });
});
