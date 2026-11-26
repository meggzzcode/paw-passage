import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { guidesLink, navItems, restoreLink, unlockCta } from "@/components/shell/nav-items";

describe("shell navigation", () => {
  it("lists the four product areas, the unlock CTA and a small restore link", () => {
    expect(navItems.map((n) => n.label)).toEqual([
      "Discover",
      "Collections",
      "My Passport",
      "Our Story",
    ]);
    expect(unlockCta).toEqual({ to: "/unlock", label: "Get the Passport" });
    expect(restoreLink).toEqual({ to: "/restore-access", label: "Restore access" });
  });
  it("keeps Guides out of the primary nav but in the footer", () => {
    expect(navItems.map((n) => n.label as string)).not.toContain("Guides");
    expect(readFileSync("src/components/shell/SiteFooter.tsx", "utf8")).toContain("guidesLink");
    expect(guidesLink.to).toBe("/guides");
  });
  it("the footer links to the legal and about pages", () => {
    const src = readFileSync("src/components/shell/SiteFooter.tsx", "utf8");
    for (const p of ["/about", "/privacy", "/terms", "/affiliate-disclosure", "/contact"])
      expect(src).toContain(`"${p}"`);
    expect(src).toContain("Some links on this site are affiliate links");
  });
});

describe("homepage copy", () => {
  const src = readFileSync("src/routes/index.tsx", "utf8");
  it("has the single primary CTA and the five placeholder collections", () => {
    expect(src).toContain("Pick our free adventure");
    expect(src).toContain("Tell us about your dog. Get one adventure picked for them, free.");
    for (const c of [
      "Five-Minute Moments",
      "Rainy Day Club",
      "Road Trip Adventures",
      "The Golden Years",
      "Puppy's First Chapter",
    ])
      expect(src).toContain(c);
  });
  it("shows the price from the one offer constant, with no discount or unproven claim", () => {
    expect(src).toContain("offer.price");
    expect(src).toContain("offer.pricing");
    expect(src).not.toMatch(/\$\d|% off|\breviews?\b|customers|testimonial/i);
  });
  it("leads with a concrete H1 and keeps the old slogan out of the hero", () => {
    expect(src).toContain("Little adventures for you and");
    expect(src).toContain("Free to start");
    expect(src).toContain("No account");
    expect(src).not.toMatch(/collect\s+adventures/i);
  });
});
