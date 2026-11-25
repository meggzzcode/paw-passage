import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { navItems, unlockCta } from "@/components/shell/nav-items";

describe("shell navigation", () => {
  it("lists the five primary destinations and the unlock CTA", () => {
    expect(navItems.map((n) => n.label)).toEqual([
      "Discover",
      "Collections",
      "My Passport",
      "Guides",
      "Restore Access",
    ]);
    expect(unlockCta).toEqual({ to: "/unlock", label: "Get the Passport" });
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
    expect(src).toContain("Find our next adventure");
    for (const c of [
      "Five-Minute Moments",
      "Rainy Day Club",
      "Road Trip Adventures",
      "The Golden Years",
      "Puppy's First Chapter",
    ])
      expect(src).toContain(c);
  });
  it("states one-time purchase without a price or unproven claim", () => {
    expect(src).toContain("one-time purchase, price shown at checkout");
    expect(src).not.toMatch(/\$\d|% off|\breviews?\b|customers|testimonial/i);
  });
});
