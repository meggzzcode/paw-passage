import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "yaml";
import { loadContent } from "../../plugins/content";
import { placeIsPublic, placeNeedsRecheck } from "@/content/publish-rule";
import {
  getPlace,
  visiblePlaces,
  filterPlaces,
  dogsOnTrailsOrBeaches,
  defaultPlaceFilters,
} from "@/content/places";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { hasPlaces } from "@/lib/launch";
import { Route as IndexRoute } from "@/routes/dog-rules.index";

// The promise: a park, trail or beach is public only after someone read the official page and recorded the
// exact sentence and the date. Seeds from our articles stay out of search, the sitemap and the shipped code.
let root = "";
const placeYaml = (extra: Record<string, string> = {}, drop: string[] = []) => {
  const base: Record<string, string> = {
    status: "verified",
    name: '"Test Park"',
    state: "georgia",
    managedBy: '"Test Agency"',
    kind: "state-park",
    sourceUrl: '"https://example.gov/test-park"',
    sourceQuote: '"Leashed pets are welcome."',
    lastChecked: "2026-11-01",
    verifiedBy: '"Tester"',
    ...extra,
  };
  for (const d of drop) delete base[d];
  return (
    Object.entries(base)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n") + "\ndogsAllowed:\n  - area: Trails\n    rule: leash\n"
  );
};
const put = (name: string, text: string) => writeFileSync(join(root, "content/places", name), text);
const reset = () => {
  rmSync(join(root, "content"), { recursive: true, force: true });
  mkdirSync(join(root, "content/places"), { recursive: true });
};
beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "paws-places-"));
  mkdirSync(join(root, "public"), { recursive: true });
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe("publish gate", () => {
  const full = {
    status: "verified",
    sourceUrl: "https://x.gov/a",
    sourceQuote: "Dogs on leash.",
    lastChecked: "2026-11-01",
  };
  it("is public only with status verified AND source address AND exact quote AND date checked", () => {
    expect(placeIsPublic(full)).toBe(true);
    expect(placeIsPublic({ ...full, status: "unverified" })).toBe(false);
    expect(placeIsPublic({ ...full, sourceUrl: null })).toBe(false);
    expect(placeIsPublic({ ...full, sourceQuote: "  " })).toBe(false);
    expect(placeIsPublic({ ...full, lastChecked: undefined })).toBe(false);
  });
});

describe("needs recheck", () => {
  const now = new Date("2026-11-17T12:00:00Z");
  it("flags a place last checked more than 12 months ago", () => {
    expect(placeNeedsRecheck({ lastChecked: "2025-11-16" }, now)).toBe(true);
    expect(placeNeedsRecheck({ lastChecked: "2024-01-01" }, now)).toBe(true);
  });
  it("does not flag a recent check, or exactly one year ago", () => {
    expect(placeNeedsRecheck({ lastChecked: "2026-06-01" }, now)).toBe(false);
    expect(placeNeedsRecheck({ lastChecked: "2025-11-17" }, now)).toBe(false);
  });
  it("treats a missing date as needing a check", () => {
    expect(placeNeedsRecheck({ lastChecked: null }, now)).toBe(true);
  });
});

describe("content build step for places", () => {
  it("includes a verified place with source, quote and date in production", () => {
    reset();
    put("ok.yml", placeYaml());
    const prod = loadContent(root, false);
    expect(prod.places.length).toBe(1);
    expect((prod.places[0] as { slug: string }).slug).toBe("ok");
  });

  it("leaves unverified places OUT of production but includes them with includeUnpublished", () => {
    reset();
    put(
      "seed.yml",
      placeYaml({ status: "unverified" }, ["sourceQuote", "lastChecked", "verifiedBy"]),
    );
    expect(loadContent(root, false).places).toEqual([]);
    expect(loadContent(root, true).places.length).toBe(1);
  });

  it("a place marked verified but missing the quote, the source or the date is not published", () => {
    reset();
    put("no-quote.yml", placeYaml({}, ["sourceQuote"]));
    put("no-date.yml", placeYaml({}, ["lastChecked"]));
    put("no-source.yml", placeYaml({}, ["sourceUrl"]));
    expect(loadContent(root, false).places).toEqual([]);
    expect(loadContent(root, true).places.length).toBe(3);
  });

  it("never puts unverified text into the production content bundle", () => {
    reset();
    put(
      "seed.yml",
      placeYaml({
        status: "unverified",
        name: '"ZZ-SECRET-SEED-NAME"',
        sourceQuote: '"ZZ-SECRET-QUOTE"',
      }),
    );
    put("ok.yml", placeYaml());
    const prod = JSON.stringify(loadContent(root, false));
    expect(prod).not.toContain("ZZ-SECRET");
    expect(prod).toContain("Test Park");
    expect(JSON.stringify(loadContent(root, true))).toContain("ZZ-SECRET-SEED-NAME");
  });

  it("a source address that is not https stops the build with a clear message", () => {
    reset();
    put("bad.yml", placeYaml({ sourceUrl: '"http://example.gov/page"' }));
    expect(() => loadContent(root, false)).toThrow(
      /content[\\/]places[\\/]bad\.yml[\s\S]*sourceUrl[\s\S]*https:\/\//,
    );
  });

  it("an unfinished unverified place is skipped (not a build failure), a broken verified one fails", () => {
    reset();
    put("half.yml", "status: unverified\nname: Half\nsourceUrl: http://nope\n");
    expect(loadContent(root, false).places).toEqual([]);
    reset();
    put("broken.yml", placeYaml({ kind: "spaceport" }));
    expect(() => loadContent(root, false)).toThrow(/kind/);
  });

  it("rejects an invalid file name for a verified place, an unknown town and an unknown article", () => {
    reset();
    put("Bad Name.yml", placeYaml());
    expect(() => loadContent(root, false)).toThrow(/lowercase letters/);
    reset();
    put("t.yml", placeYaml({ nearTown: "atlantis" }));
    expect(() => loadContent(root, false)).toThrow(/nearTown/);
    reset();
    put("c.yml", placeYaml({ claimFrom: "no-such-article" }));
    expect(() => loadContent(root, false)).toThrow(/claimFrom/);
  });

  it("an empty status means unverified (the safe answer)", () => {
    reset();
    put("e.yml", placeYaml({ status: '""' }));
    expect(loadContent(root, false).places).toEqual([]);
  });
});

describe("the seeded places in /content/places", () => {
  const dir = join(process.cwd(), "content/places");
  const files = readdirSync(dir).filter((f) => f.endsWith(".yml"));
  it("starts from places already researched in our articles", () => {
    expect(files.length).toBeGreaterThanOrEqual(14);
  });
  it("every file says it is an unverified seed and none is marked verified without its source, quote and date", () => {
    for (const f of files) {
      const text = readFileSync(join(dir, f), "utf8");
      const y = parse(text) as Record<string, unknown>;
      if (y["status"] === "verified") {
        expect(y["sourceUrl"], f).toBeTruthy();
        expect(y["sourceQuote"], f).toBeTruthy();
        expect(y["lastChecked"], f).toBeTruthy();
      } else {
        expect(
          text.startsWith(
            "# UNVERIFIED seed from our articles. Not public until verified against the official page.",
          ),
          f,
        ).toBe(true);
        expect(y["lastChecked"] ?? null, f).toBeNull();
      }
    }
  });
  it("loads cleanly, and production carries only places that pass the gate", () => {
    const prod = loadContent(process.cwd(), false).places as { slug: string; status: string }[];
    for (const p of prod) expect(placeIsPublic(p as never)).toBe(true);
    const all = loadContent(process.cwd(), true).places as { slug: string }[];
    expect(all.length).toBe(files.length);
  });
});

describe("site before the first verified place", () => {
  it("hides the nav item and leaves the lookup and every place out of the sitemap", () => {
    const live = visiblePlaces({ includeUnverified: false });
    const paths = sitemapEntries().map((e) => e.path);
    expect(hasPlaces()).toBe(live.length > 0);
    expect(paths.includes("/dog-rules")).toBe(live.length > 0);
    if (live.length === 0) expect(paths.filter((p) => p.startsWith("/dog-rules"))).toEqual([]);
    expect(paths).not.toContain("/dog-rules/tallulah-gorge-state-park");
  });

  it("the index page is noindex while no verified place exists", () => {
    const head = IndexRoute.options.head!({ match: { search: defaultPlaceFilters } } as never) as {
      meta: Record<string, string>[];
    };
    const noindex = head.meta.some(
      (m) => m["name"] === "robots" && /noindex/.test(m["content"] ?? ""),
    );
    expect(noindex).toBe(!hasPlaces());
  });

  it("an unverified place does not exist in production (the detail page returns 404) but shows in preview", () => {
    expect(getPlace("tallulah-gorge-state-park", { includeUnverified: false })).toBeUndefined();
    expect(getPlace("tallulah-gorge-state-park", { includeUnverified: true })?.status).toBe(
      "unverified",
    );
    expect(getPlace("no-such-place", { includeUnverified: true })).toBeUndefined();
  });
});

describe("search and filters", () => {
  const all = visiblePlaces({ includeUnverified: true });
  it("filters by state, kind and name", () => {
    expect(
      filterPlaces(all, { ...defaultPlaceFilters, state: "georgia" }).every(
        (p) => p.state === "georgia",
      ),
    ).toBe(true);
    expect(
      filterPlaces(all, { ...defaultPlaceFilters, kind: "beach" }).every((p) => p.kind === "beach"),
    ).toBe(true);
    expect(filterPlaces(all, { ...defaultPlaceFilters, q: "tallulah" }).map((p) => p.slug)).toEqual(
      ["tallulah-gorge-state-park"],
    );
  });
  it("'dogs on trails or beaches' reads the rule rows", () => {
    expect(
      dogsOnTrailsOrBeaches({
        kind: "state-park",
        dogsAllowed: [{ area: "Rim trails", rule: "leash", note: null }],
      }),
    ).toBe("yes");
    expect(
      dogsOnTrailsOrBeaches({
        kind: "national-park",
        dogsAllowed: [
          { area: "Hiking trails", rule: "no", note: null },
          { area: "Campgrounds", rule: "leash", note: null },
        ],
      }),
    ).toBe("no");
    expect(
      dogsOnTrailsOrBeaches({
        kind: "national-park",
        dogsAllowed: [{ area: "Campgrounds", rule: "leash", note: null }],
      }),
    ).toBe("unclear");
    expect(
      filterPlaces(all, { ...defaultPlaceFilters, trails: "yes" }).map((p) => p.slug),
    ).toContain("tallulah-gorge-state-park");
    expect(
      filterPlaces(all, { ...defaultPlaceFilters, trails: "no" }).map((p) => p.slug),
    ).not.toContain("tallulah-gorge-state-park");
  });
});
