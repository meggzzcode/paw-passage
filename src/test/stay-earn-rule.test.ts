import { describe, expect, it } from "vitest";
import {
  allStayRecords,
  stayAffiliateId,
  stayAwaitingAffiliateLink,
  stayEarns,
  visibleStays,
  vrboListingId,
} from "@/content/stays";
import { getApprovedLink } from "@/content/affiliates";
import { STAYS_REQUIRE_AFFILIATE_LINK } from "@/content/publish-rule";

describe("stays are listed only when they earn", () => {
  it("reads the Vrbo listing id from a source address", () => {
    expect(vrboListingId("https://www.vrbo.com/2193383")).toBe("2193383");
    expect(vrboListingId("https://vrbo.com/989362?x=1")).toBe("989362");
    expect(vrboListingId("https://www.vacasa.com/unit/1")).toBeUndefined();
  });

  it("derives vrbo-<id> unless the stay names its own affiliate entry", () => {
    expect(stayAffiliateId({ sourceUrl: "https://www.vrbo.com/42" })).toBe("vrbo-42");
    expect(stayAffiliateId({ sourceUrl: "https://www.vrbo.com/42", affiliateId: "vrbo-7" })).toBe(
      "vrbo-7",
    );
    expect(stayAffiliateId({ sourceUrl: "https://www.vacasa.com/unit/1" })).toBeUndefined();
  });

  it("the rule is on, and every listed stay has an approved affiliate link", () => {
    expect(STAYS_REQUIRE_AFFILIATE_LINK).toBe(true);
    const listed = visibleStays({ includeSamples: false });
    expect(listed.length).toBeGreaterThan(0);
    for (const s of listed) {
      expect(stayEarns(s), s.slug).toBe(true);
      expect(getApprovedLink(s.affiliateId), s.slug).toBeTruthy();
    }
  });

  it("stays without an approved link are kept but not listed", () => {
    const all = allStayRecords();
    const waiting = stayAwaitingAffiliateLink();
    const listed = new Set(visibleStays({ includeSamples: false }).map((s) => s.slug));
    expect(all.length).toBe(listed.size + waiting.length);
    for (const s of waiting) expect(listed.has(s.slug), s.slug).toBe(false);
  });
});
