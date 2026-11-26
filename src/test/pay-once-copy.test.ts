import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { KEEP_LINE, ONE_TIME_LINE, homePromo, price } from "@/config/commercial";
import { FAQS } from "@/components/site/faq-content";

const read = (f: string) => readFileSync(f, "utf8");
const ONCE = /one[- ]time|pay once|paid once|one payment|yours to keep/i;

describe("pay-once copy", () => {
  it("the shared lines say what the offer is, once, in one place", () => {
    expect(ONE_TIME_LINE).toBe(`One payment of ${price}. Yours to keep.`);
    expect(KEEP_LINE).toBe("No subscription. No renewals. Your Passport does not expire.");
  });
  it("every page that shows the price also says it is one-time", () => {
    expect(homePromo.lede).toMatch(ONCE);
    const home = read("src/routes/index.tsx");
    expect(home).toContain("ONE_TIME_LINE");
    expect(home).toContain("KEEP_LINE");
    const unlock = read("src/routes/unlock.tsx");
    expect(unlock).toMatch(ONCE);
    expect(unlock).toContain("KEEP_LINE");
    const faqText = FAQS.map((f) => f.a).join(" ");
    expect(faqText).toContain(price);
    expect(faqText).toMatch(ONCE);
    expect(FAQS.map((f) => f.id)).toEqual(expect.arrayContaining(["pay-again", "keep-access"]));
    expect(read("src/components/site/WelcomePage.tsx")).toMatch(/yours to keep/);
  });
  it("no customer-facing file promises forever, lifetime access or unlimited updates", () => {
    const files: string[] = [];
    const walk = (d: string) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(tsx?|md)$/.test(n) && !/\.test\./.test(n)) files.push(p);
      }
    };
    for (const d of ["src/routes", "src/components", "src/config", "content/journal"]) walk(d);
    for (const f of files) {
      const t = read(f).replace(/a lifetime of little adventures/gi, "");
      expect(t, f).not.toMatch(
        /lifetime access|unlimited updates|updates forever|access forever|yours forever/i,
      );
    }
  });
});
