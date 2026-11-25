import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("affiliate notices are legible on phones", () => {
  it("the article notice and stay label are not set in tiny type", () => {
    const notice = readFileSync("src/components/site/AffiliateNotice.tsx", "utf8");
    expect(notice).not.toMatch(/text-\[1[01]px\]/);
    expect(notice).toMatch(/text-sm/);
    expect(readFileSync("src/lib/disclosure.ts", "utf8")).toMatch(
      /AFFILIATE_LABEL_CLASS = "text-sm/,
    );
  });
  it("the planner shopping notice is at least 14px", () => {
    const css = readFileSync("src/components/packing/packing.css", "utf8");
    const block = /\.pk-notice \{[^}]*\}/.exec(css)![0];
    const size = /font-size:\s*([\d.]+)rem/.exec(block)![1]!;
    expect(parseFloat(size)).toBeGreaterThanOrEqual(0.875);
  });
});
