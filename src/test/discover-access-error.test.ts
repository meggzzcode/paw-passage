import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// A paying customer whose access check fails must not be shown the free quiz on /discover.
// (The rendering of AccessCheckFailed itself is covered in returning-home.test.tsx.)
describe("discover during an access error", () => {
  const src = readFileSync("src/components/passport/DiscoverPage.tsx", "utf8");
  it("shows the friendly retry state instead of the free starter", () => {
    expect(src).toContain('accessMode === "error"');
    expect(src).toContain("<AccessCheckFailed />");
    expect(src.indexOf('accessMode === "error"')).toBeLessThan(src.indexOf("<FreeStarter"));
  });
});
