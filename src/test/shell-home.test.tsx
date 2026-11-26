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
  // The homepage copy lives in the one commercial config; the route reads it.
  const src =
    readFileSync("src/routes/index.tsx", "utf8") + readFileSync("src/config/commercial.ts", "utf8");
  it("leads with the adventure headline and one clear primary CTA", () => {
    expect(src).toContain("Life is better with a little");
    expect(src).toContain("Find Our First Adventure");
    expect(src).toContain("Explore the Adventure Collection");
    expect(src).toContain("One payment, not a subscription");
    expect(src).toContain("No account");
  });
  it("shows the price from the one offer constant, with no discount or unproven claim", () => {
    expect(src).toContain("offer.price");
    expect(src).toContain("offer.pricing");
    expect(readFileSync("src/routes/index.tsx", "utf8")).toContain("{price}");
    expect(src).not.toMatch(/\$\d|% off|\breviews?\b|customers|testimonial/i);
  });
  it("keeps the old slogan out of the hero", () => {
    expect(src).not.toMatch(/collect\s+adventures/i);
  });
});
