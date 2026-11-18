import { describe, expect, it } from "vitest";
import { evaluate, summarize } from "@/lib/dog-accepted";
import { managerPolicies } from "@/content/manager-policies";

const base = { dogs: 2, weights: [null, null] as (number | null)[], breed: "none" as const };
const find = (rs: ReturnType<typeof evaluate>, name: string) => rs.find((r) => r.policy.name === name)!;

describe("dog accepted checker", () => {
  it("has the 38 verified managers", () => expect(managerPolicies).toHaveLength(38));
  it("flags too many dogs against a stated limit", () => {
    expect(find(evaluate({ ...base, dogs: 3, weights: [null, null, null] }), "Tahoe Getaways").status).toBe("conflict");
  });
  it("two dogs fit a limit of two", () => {
    expect(find(evaluate(base), "Tahoe Getaways").status).toBe("fits");
  });
  it("asks when no limit is stated", () => {
    expect(find(evaluate(base), "SkyRun Vacation Rentals").status).toBe("ask");
  });
  it("treats 'most homes' limits as a question, not a conflict", () => {
    expect(find(evaluate({ ...base, dogs: 3, weights: [null, null, null] }), "AvantStay").status).toBe("ask");
  });
  it("checks weight per dog and combined", () => {
    expect(find(evaluate({ dogs: 1, weights: [70], breed: "none" }), "Emmons Realty").status).toBe("conflict");
    expect(find(evaluate({ dogs: 2, weights: [30, 30], breed: "none" }), "AMI Locals").status).toBe("conflict");
  });
  it("matches a named breed list", () => {
    expect(find(evaluate({ ...base, breed: "pit" }), "Emmons Realty").status).toBe("conflict");
  });
  it("summary counts add up", () => {
    const s = summarize(evaluate(base));
    expect(s.fits + s.ask + s.conflict).toBe(s.total);
  });
  it("silence on breed is a question, not a pass, for a restricted-type dog", () => {
    const rs = evaluate({ dogs: 1, weights: [40], breed: "pit" });
    const silent = rs.find((r) => r.policy.breed === "not-stated" && r.policy.maxDogs !== null && r.policy.maxDogs >= 1 && !r.policy.weight)!;
    expect(silent.status).toBe("ask");
    const none = evaluate({ dogs: 1, weights: [40], breed: "none" }).find((r) => r.policy.name === silent.policy.name)!;
    expect(none.status).toBe("fits");
  });
});
