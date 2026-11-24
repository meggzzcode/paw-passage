import { describe, expect, it } from "vitest";
import { AMAZON_TAG_PLACEHOLDER, getApprovedLink, resolveAffiliateUrl } from "@/content/affiliates";
import { settingsSchema } from "@/content/schema";
import { site } from "@/config/site";

describe("Amazon tracking ID", () => {
  it("is set in site settings (any valid ID, or empty): a buyer's replacement must not break this test", () => {
    expect(settingsSchema.safeParse({ amazonTrackingId: site.amazonTrackingId }).success).toBe(
      true,
    );
  });

  it("accepts a store ID or empty and rejects anything else", () => {
    expect(settingsSchema.safeParse({ amazonTrackingId: "sample-20" }).success).toBe(true);
    expect(settingsSchema.safeParse({ amazonTrackingId: "" }).success).toBe(true);
    expect(settingsSchema.safeParse({ amazonTrackingId: "not an id" }).success).toBe(false);
    expect(settingsSchema.safeParse({ amazonTrackingId: "https://amazon.com" }).success).toBe(
      false,
    );
  });

  it("fills the tag into Amazon addresses and leaves other addresses alone", () => {
    const url = `https://www.amazon.com/dp/B000000000?tag=${AMAZON_TAG_PLACEHOLDER}`;
    expect(resolveAffiliateUrl(url, "sample-20")).toBe(
      "https://www.amazon.com/dp/B000000000?tag=sample-20",
    );
    expect(resolveAffiliateUrl("https://vrbo.com/affiliate/abc", "sample-20")).toBe(
      "https://vrbo.com/affiliate/abc",
    );
  });

  it("never produces an untagged Amazon link: with no tag the link resolves to nothing and is not shown", () => {
    const url = `https://www.amazon.com/dp/B000000000?tag=${AMAZON_TAG_PLACEHOLDER}`;
    expect(resolveAffiliateUrl(url, "")).toBe("");
    const links = [{ id: "amazon-x", network: "Amazon", url: "", approved: true }];
    expect(getApprovedLink("amazon-x", links)).toBeUndefined();
  });
});
