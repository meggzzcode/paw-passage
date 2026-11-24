import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { visibleStays, type Stay } from "@/content/stays";
import { destinations } from "@/content/destinations";
import { affiliateLinks } from "@/content/affiliates";
import {
  stayIndexability,
  townIndexability,
  stateIndexability,
  textSimilarity,
  type StayQuality,
} from "@/content/publish-rule";
import { stayIsIndexable, townIsIndexable, stateIsIndexable } from "@/lib/seo";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { filterStays, defaultFilters } from "@/lib/filters";

const good = (over: Partial<StayQuality> = {}): StayQuality => ({
  slug: "a",
  status: "unverified",
  summary: "Short summary of the cabin.",
  description:
    "A two-bedroom cabin with a deck, a hot tub and a fire pit on a quiet road. The listing allows two dogs under fifty pounds and mentions a fenced run beside the deck, which we have not confirmed with the host. The kitchen is fully equipped and parking is on site.",
  maxDogs: 2,
  largeDogsOk: null,
  weightLimitLbs: 50,
  petFee: null,
  fencedYard: null,
  sleeps: 4,
  bedrooms: 2,
  bathrooms: 1,
  beds: ["Bedroom 1: 1 queen bed"],
  amenityGroups: [{ items: ["Kitchen"] }],
  locationNote: "Quiet road near town.",
  distances: [],
  accessNotes: ["Steep drive"],
  guestNotes: [],
  generalRules: ["Non-smoking"],
  houseRules: ["2 dogs"],
  checkIn: "4 PM",
  ...over,
});

describe("stay indexing quality rule", () => {
  it("passes a complete, original, non-duplicate stay without host verification", () => {
    expect(stayIndexability(good())).toMatchObject({ indexable: true, missing: [] });
  });
  it.each([
    ["dog limit", { maxDogs: null }, "dog limit"],
    ["pet policy detail", { weightLimitLbs: null }, "weight limit"],
    ["size facts", { bedrooms: null }, "bedrooms"],
    ["location note", { locationNote: "" }, "location"],
    ["thin description", { description: "Nice cabin." }, "too short"],
    ["sample status", { status: "sample" }, "samples"],
  ])("rejects a stay missing the %s", (_n, over, text) => {
    const r = stayIndexability(good(over as Partial<StayQuality>));
    expect(r.indexable).toBe(false);
    expect(r.missing.join(" ")).toContain(text);
  });
  it("rejects too few filled sections", () => {
    const r = stayIndexability(
      good({
        amenityGroups: [],
        accessNotes: [],
        generalRules: [],
        checkIn: undefined,
        houseRules: [],
      }),
    );
    expect(r.indexable).toBe(false);
    expect(r.missing.join(" ")).toContain("sections filled");
  });
  it("rejects a near-duplicate description but not shared boilerplate", () => {
    const a = good({ slug: "a" });
    expect(stayIndexability(a, [a, good({ slug: "b" })]).missing.join(" ")).toContain("duplicates");
    const b = good({
      slug: "b",
      description:
        "Another place entirely, with a screened porch and a creek at the bottom of the lot. The listing allows one dog and charges a fee per stay, but we have not confirmed it with the host. Guests describe it as quiet and clean with a short walk to the trail.",
    });
    expect(textSimilarity(a.description, b.description)).toBeLessThan(0.6);
    expect(stayIndexability(a, [a, b]).indexable).toBe(true);
  });
  it("applies the rule to the real stays, and the page head, sitemap and rule agree exactly", () => {
    const list = visibleStays({ includeSamples: false });
    const paths = sitemapEntries().map((e) => e.path);
    for (const s of list) {
      expect(paths.includes(`/stays/${s.slug}`), s.slug).toBe(stayIsIndexable(s, list));
      expect(stayIndexability(s, list).indexable).toBe(stayIsIndexable(s, list));
    }
    for (const d of destinations) {
      expect(paths.includes(`/destinations/${d.slug}`), d.slug).toBe(
        stateIsIndexable(d.slug, list),
      );
      for (const t of d.towns)
        expect(paths.includes(`/destinations/${d.slug}/${t.slug}`), t.slug).toBe(
          townIsIndexable(d.slug, t.slug, list),
        );
    }
  }, 30000);
  it("never indexes sample stays", () => {
    expect(
      sitemapEntries().some(
        (e) =>
          e.path.startsWith("/stays/") &&
          !visibleStays({ includeSamples: false }).some((s) => e.path === `/stays/${s.slug}`),
      ),
    ).toBe(false);
  });
});

describe("town and state indexing", () => {
  const town = (notes: number, len = 120) => ({
    blurb: "x".repeat(100),
    planningNotes: Array.from({ length: notes }, () => "n".repeat(len)),
  });
  it("needs an indexable stay or substantive own text", () => {
    expect(townIndexability(town(2, 50), 0).indexable).toBe(false);
    expect(townIndexability(town(2, 50), 1).indexable).toBe(true);
    expect(townIndexability(town(3, 120), 0).indexable).toBe(true);
    expect(townIndexability(town(3, 20), 0).indexable).toBe(false);
  });
  it("a state needs a real intro and an indexable town", () => {
    expect(stateIndexability({ intro: "x".repeat(300) }, 0).indexable).toBe(false);
    expect(stateIndexability({ intro: "short" }, 2).indexable).toBe(false);
    expect(stateIndexability({ intro: "x".repeat(300) }, 1).indexable).toBe(true);
  });
});

describe("stay data integrity", () => {
  const stays = visibleStays({ includeSamples: false });
  it("each stay with an affiliateId matches the listing id in its sourceUrl and an approved link exists", () => {
    // Stays without an affiliateId (non-Vrbo sources, or Vrbo stays still waiting for a deeplink from the Expedia hub) are skipped.
    for (const s of stays.filter((x) => !!x.affiliateId)) {
      const id = /vrbo\.com\/(\d+)/.exec(s.sourceUrl)?.[1];
      expect(id, s.slug).toBeTruthy();
      expect(s.affiliateId, s.slug).toBe(`vrbo-${id}`);
      expect(
        affiliateLinks.some(
          (l) =>
            l.id === s.affiliateId &&
            l.approved &&
            /^https:\/\/vrbo\.com\/affiliate\/[A-Za-z0-9]+$/.test(l.url),
        ),
        s.slug,
      ).toBe(true);
    }
  });
  it("shows no listing photos: photoPermission is false and no image is set for any real stay", () => {
    for (const s of stays) {
      expect(s.photoPermission, s.slug).toBe(false);
      expect(s.image ?? s.imageUpload ?? "", s.slug).toBe("");
    }
  });
  it("never calls a stay verified unless its status is verified", () => {
    const route = readFileSync("src/routes/stays.$slug.tsx", "utf8");
    expect(route).toContain('s.status === "verified" && s.lastVerified');
    for (const s of stays.filter((x) => x.status !== "verified"))
      expect(`${s.summary} ${s.description}`.toLowerCase()).not.toMatch(
        /\bverified by\b|we verified|host.verified/,
      );
  });
});

describe("stay filters match only confirmed data", () => {
  const stays = visibleStays({ includeSamples: false });
  const base = (over: Partial<Stay>): Stay => ({ ...stays[0]!, ...over });
  it("unknown weight limit, fence, fee, amenities never match", () => {
    const unknown = base({
      weightLimitLbs: null,
      fencedYard: null,
      petFee: null,
      maxDogs: null,
      largeDogsOk: null,
      breedRestrictions: null,
      hotTub: null,
      privateOutdoor: null,
      amenityGroups: [],
    });
    for (const f of [
      { weightMin: 20 },
      { fenced: true },
      { noFee: true },
      { dogs: 1 },
      { multi: true },
      { large: true },
      { noBreed: true },
      { hotTub: true },
      { outdoor: true },
      { airCon: true },
      { grill: true },
      { parking: true },
    ]) {
      expect(filterStays([unknown], { ...defaultFilters, ...f }), JSON.stringify(f)).toHaveLength(
        0,
      );
    }
  });
  it("weight and amenity filters match stated values", () => {
    const s = base({
      weightLimitLbs: 50,
      amenityGroups: [
        { title: "x", items: ["Air conditioning", "Barbecue grill", "Onsite parking"] },
      ],
    });
    expect(filterStays([s], { ...defaultFilters, weightMin: 50 })).toHaveLength(1);
    expect(filterStays([s], { ...defaultFilters, weightMin: 70 })).toHaveLength(0);
    expect(
      filterStays([s], { ...defaultFilters, airCon: true, grill: true, parking: true }),
    ).toHaveLength(1);
  });
});
