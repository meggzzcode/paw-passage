import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const SLUGS = [
  "things-to-do-with-your-dog-at-home",
  "rainy-day-dog-activities",
  "things-to-do-with-your-dog-this-weekend",
  "doggy-date-ideas",
  "free-things-to-do-with-your-dog",
  "activities-to-bond-with-your-dog",
  "puppy-bucket-list",
  "fun-things-to-do-with-your-senior-dog",
  "family-activities-with-dogs",
  "activities-for-high-energy-dogs",
];
const TEMPLATES = ["poster", "stamp", "postcard", "magazine", "passport", "ticket"];

type Pin = {
  id: string;
  theme: string;
  template: string;
  headline: string;
  title: string;
  description: string;
  destination: string;
  kicker: string;
  sub: string;
};
const { pins } = JSON.parse(readFileSync("marketing/pins/article-pins.json", "utf8")) as {
  pins: Pin[];
};

describe("Journal article pins", () => {
  it("has exactly three pins for each of the ten articles", () => {
    expect(pins).toHaveLength(30);
    for (const s of SLUGS) expect(pins.filter((p) => p.theme === s)).toHaveLength(3);
    expect(new Set(pins.map((p) => p.id)).size).toBe(30);
  });

  it("points each pin at an existing journal slug with UTM parameters", () => {
    for (const p of pins) {
      const u = new URL(p.destination, "https://example.com");
      const slug = u.pathname.replace("/journal/", "");
      expect(SLUGS).toContain(slug);
      expect(slug).toBe(p.theme);
      expect(u.searchParams.get("utm_source")).toBe("pinterest");
      expect(u.searchParams.get("utm_medium")).toBe("social");
      expect(u.searchParams.get("utm_campaign")).toMatch(new RegExp(`^${slug}-[123]$`));
    }
  });

  it("keeps copy within limits and plain", () => {
    for (const p of pins) {
      expect(p.headline.length).toBeLessThanOrEqual(60);
      expect(p.title.length).toBeLessThanOrEqual(100);
      expect(p.description.length).toBeLessThanOrEqual(300);
      expect(TEMPLATES).toContain(p.template);
      for (const t of [p.headline, p.sub, p.kicker, p.title, p.description]) {
        expect(t).not.toMatch(/#/);
        expect(t).not.toMatch(/\bfree (access|premium|adventures?|keepsake)\b/i);
        expect(t).not.toMatch(/\b(cure|treat|heal|reduce anxiety|calm|train|behavior)/i);
      }
    }
  });
});
