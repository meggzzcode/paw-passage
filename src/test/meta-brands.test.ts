import { describe, expect, it } from "vitest";
import { allGuides } from "@/content/guides";

// Expedia Group's affiliate terms bar its marks in meta tags (section 12.7 as read 2026-11-18). H1 and body text may use the names.
describe("meta tags", () => {
  it("no guide's seoTitle or seoDescription names an Expedia Group brand", () => {
    for (const g of allGuides) {
      expect(`${g.seoTitle} ${g.seoDescription}`, g.slug).not.toMatch(/vrbo|expedia|hotels\.com|homeaway/i);
    }
  });
});
