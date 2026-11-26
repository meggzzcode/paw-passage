import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const JOURNAL = [
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
const ROUTES = ["/things-to-do-with-your-dog", "/discover"];
const OLD_LANDING = [
  "indoor-dog-adventures",
  "puppy-first-year-bucket-list",
  "senior-dog-adventures",
  "weekend-adventure-finder",
  "rainy-day-dog-adventures",
  "dog-birthday-ideas",
];

type Pin = { id: string; destination: string };
const load = (f: string) =>
  (JSON.parse(readFileSync(`marketing/pins/${f}`, "utf8")) as { pins: Pin[] }).pins;

describe.each([["pins.json"], ["article-pins.json"]])("%s destinations", (file) => {
  const pins = load(file);
  it("has 30 pins", () => expect(pins).toHaveLength(30));
  it("points only at existing routes with UTM parameters, never the old landing pages", () => {
    for (const p of pins) {
      const u = new URL(p.destination, "https://example.com");
      const ok =
        ROUTES.includes(u.pathname) ||
        (u.pathname.startsWith("/journal/") && JOURNAL.includes(u.pathname.slice(9)));
      expect(ok, p.id).toBe(true);
      expect(u.searchParams.get("utm_source"), p.id).toBe("pinterest");
      expect(u.searchParams.get("utm_medium"), p.id).toBe("social");
      expect(u.searchParams.get("utm_campaign"), p.id).toBeTruthy();
      for (const old of OLD_LANDING) expect(u.pathname).not.toContain(old);
    }
  });
});
