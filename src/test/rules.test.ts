import { describe, expect, it } from "vitest";
import { filterStays, defaultFilters } from "@/lib/filters";
import { computeCost, petFeeTotal } from "@/lib/cost";
import { buildHostQuestions } from "@/lib/host-questions";
import { getApprovedLink } from "@/content/affiliates";
import { visibleStays } from "@/content/stays";
import { sampleStays } from "@/content/stays/samples";
import { allGuides, isPublic } from "@/content/guides";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { stayIsIndexable } from "@/lib/seo";
import type { Stay } from "@/content/stays/types";

const base = sampleStays[0]!;
const mk = (o: Partial<Stay>): Stay => ({ ...base, ...o });

describe("stay filters", () => {
  const stays = [
    mk({
      slug: "a",
      fencedYard: "full",
      maxDogs: 2,
      petFee: { amount: 0, basis: "stay" },
      state: "georgia",
    }),
    mk({
      slug: "b",
      fencedYard: "partial",
      maxDogs: 3,
      petFee: { amount: 50, basis: "stay" },
      state: "georgia",
    }),
    mk({ slug: "c", fencedYard: null, maxDogs: null, petFee: null, state: "california" }),
  ];
  it("combines filters (fenced + no fee)", () => {
    expect(
      filterStays(stays, { ...defaultFilters, fenced: true, noFee: true }).map((s) => s.slug),
    ).toEqual(["a"]);
  });
  it("partial fence does not count as fenced", () => {
    expect(filterStays(stays, { ...defaultFilters, fenced: true }).map((s) => s.slug)).toEqual([
      "a",
    ]);
  });
  it("unconfirmed details never match a filter", () => {
    expect(
      filterStays(stays, { ...defaultFilters, multi: true })
        .map((s) => s.slug)
        .sort(),
    ).toEqual(["a", "b"]);
    expect(filterStays(stays, { ...defaultFilters, dogs: 3 }).map((s) => s.slug)).toEqual(["b"]);
  });
});

describe("live site visibility", () => {
  it("sample stays never appear when samples are off (production)", () => {
    expect(visibleStays({ includeSamples: false }).some((s) => s.status === "sample")).toBe(false);
  });
  it("unverified stays are listed after verified ones, and reach the sitemap only when they pass the indexing quality rule", () => {
    const list = visibleStays({ includeSamples: false });
    const firstUnverified = list.findIndex((s) => s.status === "unverified");
    if (firstUnverified >= 0)
      expect(list.slice(firstUnverified).every((s) => s.status === "unverified")).toBe(true);
    const paths = sitemapEntries().map((e) => e.path);
    for (const s of list.filter((x) => x.status === "unverified"))
      expect(paths.includes(`/stays/${s.slug}`)).toBe(stayIsIndexable(s, list));
  });
  it("sitemap excludes samples and drafts", () => {
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths.some((p) => p.includes("sample-"))).toBe(false);
    for (const g of allGuides.filter((g) => !isPublic(g)))
      expect(paths).not.toContain(`/guides/${g.slug}`);
  });
  it("a guide with unverified claims is never public", () => {
    expect(
      isPublic({
        ...allGuides[0]!,
        status: "published",
        research: { ...allGuides[0]!.research, unverified: ["x"] },
      }),
    ).toBe(false);
  });
  it("a guide whose research is incomplete is never public", () => {
    expect(
      isPublic({
        ...allGuides[0]!,
        status: "published",
        research: { ...allGuides[0]!.research, unverified: [], researchComplete: false },
      }),
    ).toBe(false);
  });
  it("every public guide has finished research and no open follow-ups", () => {
    for (const g of allGuides.filter(isPublic)) {
      expect(g.research.researchComplete).toBe(true);
      expect(g.research.followUps ?? []).toEqual([]);
      expect(g.research.competitors.length).toBeGreaterThanOrEqual(5);
      for (const c of g.research.competitors)
        expect(c.gaps.toLowerCase()).not.toContain("outstanding");
    }
  });
  it("all ten launch guides exist", () => {
    expect(allGuides.length).toBeGreaterThanOrEqual(10);
  });
});

describe("cost calculator", () => {
  it("per dog per night: $20 x 2 dogs x 3 nights = $120", () => {
    expect(petFeeTotal(20, "dog-night", 3, 2)).toBe(120);
  });
  it("totals lodging, cleaning, pet fee and tax; deposit kept separate", () => {
    const r = computeCost({
      label: "x",
      nightly: 200,
      nights: 3,
      cleaning: 100,
      otherFees: 0,
      petFee: 25,
      petFeeBasis: "dog",
      dogs: 2,
      taxPct: 10,
      deposit: 300,
    });
    expect(r.lodging).toBe(600);
    expect(r.pet).toBe(50);
    expect(r.tax).toBe(70);
    expect(r.total).toBe(820);
    expect(r.upfront).toBe(1120);
  });
});

describe("host question generator", () => {
  const p = {
    dogName: "Juno",
    dogs: 1,
    size: "medium" as const,
    breed: "",
    needs: {
      fencedYard: false,
      jumper: false,
      digger: false,
      pool: false,
      crate: false,
      leftAlone: false,
      furniture: false,
      stairsHard: false,
      reactive: false,
      beach: false,
    },
  };
  it("asks fence and gate questions only when a yard matters", () => {
    expect(buildHostQuestions(p).questions.some((q) => q.includes("gate"))).toBe(false);
    const r = buildHostQuestions({ ...p, needs: { ...p.needs, fencedYard: true } });
    expect(r.questions.some((q) => q.includes("gate"))).toBe(true);
    expect(r.photos.length).toBeGreaterThan(0);
  });
  it("asks about combined weight for multiple dogs", () => {
    expect(
      buildHostQuestions({ ...p, dogs: 2 }).questions.some((q) => q.includes("combined weight")),
    ).toBe(true);
  });
});

describe("affiliate links", () => {
  it("only approved links with a URL produce a booking link", () => {
    const links = [
      { id: "a", network: "X", url: "https://x.test", approved: false },
      { id: "b", network: "Y", url: "https://y.test", approved: true },
    ];
    expect(getApprovedLink("a", links)).toBeUndefined();
    expect(getApprovedLink("b", links)?.url).toBe("https://y.test");
    expect(getApprovedLink(undefined, links)).toBeUndefined();
  });
});
