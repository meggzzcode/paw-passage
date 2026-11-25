import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadContent } from "../../plugins/content";

// These tests protect the promise a buyer relies on: saving something in the CMS never makes it public
// by accident, and a mistake in a content file stops the build with a clear message instead of publishing.
const realGuide = join(process.cwd(), "content/guides/how-vacation-rental-pet-fees-work.md");
// A real stay record used as a fixture (its booking link is removed so it stands alone in a temporary site).
const realStayPath = join(process.cwd(), "content/stays/mountain-view-cabin-hilltop-hideaway.yml");
const stayFixture = () => readFileSync(realStayPath, "utf8").replace(/^affiliateId:.*\n?/m, "");
let root = "";

// The real guide, with its links to other articles removed (the temporary test project has no other articles).
const cleanGuide = () => {
  return readFileSync(realGuide, "utf8")
    .replace(/relatedGuides:\n( {2}- .*\n)+/, "relatedGuides: []\n")
    .replace(/relatedProducts:\n( {2}- .*\n)+/, "relatedProducts: []\n")
    .replace(/^\{\{pick:.*\}\}\n?/gm, "")
    .replace(/\]\(aff:[a-z0-9-]+\)/g, "](https://example.com)");
};
const guideWith = (edit: (t: string) => string) => edit(cleanGuide());

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "paws-content-"));
  mkdirSync(join(root, "content/guides"), { recursive: true });
  mkdirSync(join(root, "content/stays"), { recursive: true });
  mkdirSync(join(root, "public"), { recursive: true });
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

const reset = () => {
  rmSync(join(root, "content"), { recursive: true, force: true });
  mkdirSync(join(root, "content/guides"), { recursive: true });
  mkdirSync(join(root, "content/stays"), { recursive: true });
};

describe("content build step", () => {
  it("includes an approved, published guide in production", () => {
    reset();
    writeFileSync(join(root, "content/guides/ok.md"), cleanGuide());
    expect(loadContent(root, false).guides.length).toBe(1);
  });

  it("leaves drafts and unapproved guides OUT of production builds, but lists unverified stays", () => {
    reset();
    writeFileSync(
      join(root, "content/guides/draft.md"),
      guideWith((t) => t.replace("status: published", "status: draft")),
    );
    writeFileSync(
      join(root, "content/guides/unapproved.md"),
      guideWith((t) => t.replace(/^approvedBy:.*\n/m, "").replace(/^approvedOn:.*\n/m, "")),
    );
    writeFileSync(join(root, "content/stays/unverified.yml"), stayFixture());
    const prod = loadContent(root, false);
    expect(prod.guides).toEqual([]);
    expect(prod.stays).toHaveLength(1);
    expect((prod.stays[0] as { status: string }).status).toBe("unverified");
    const preview = loadContent(root, true);
    expect(preview.guides.length).toBe(2);
    expect(preview.stays.length).toBe(1);
  });

  it("a guide whose research is not complete is not public even when approved", () => {
    reset();
    writeFileSync(
      join(root, "content/guides/x.md"),
      guideWith((t) => t.replace("researchComplete: true", "researchComplete: false")),
    );
    expect(loadContent(root, false).guides).toEqual([]);
  });

  it("stops with a plain message naming the file and field when content is wrong", () => {
    reset();
    writeFileSync(
      join(root, "content/guides/bad.md"),
      guideWith((t) => t.replace(/^seoTitle:.*$/m, "seoTitle: " + "x".repeat(80))),
    );
    expect(() => loadContent(root, false)).toThrow(/content\/guides\/bad\.md[\s\S]*seoTitle/);
  });

  it("rejects an uploaded hero image that is not in the uploads folder", () => {
    reset();
    writeFileSync(
      join(root, "content/guides/up.md"),
      guideWith((t) => t.replace(/^heroImage:.*$/m, "heroUpload: /uploads/missing.jpg")),
    );
    expect(() => loadContent(root, false)).toThrow(/missing\.jpg/);
  });

  it("rejects a malformed affiliate link and bad site settings", () => {
    reset();
    writeFileSync(
      join(root, "content/affiliates.yml"),
      "links:\n  - id: a\n    network: Amazon Associates\n    url: not-a-url\n",
    );
    expect(() => loadContent(root, false)).toThrow(/affiliates\.yml[\s\S]*web address/);
    reset();
    writeFileSync(join(root, "content/settings.yml"), 'ga4MeasurementId: "12345"\n');
    expect(() => loadContent(root, false)).toThrow(/settings\.yml[\s\S]*ga4MeasurementId/);
  });

  it("treats empty fields in a stay as 'not confirmed', never as 'no'", () => {
    reset();
    writeFileSync(
      join(root, "content/stays/s.yml"),
      "name: Test\nstatus: verified\ntype: cabin\nstate: georgia\ntown: blue-ridge\nsummary: s\ndescription: d\nimage: guide-ga-cabins\nlastVerified: 2026-11-16\n",
    );
    const s = loadContent(root, false).stays[0] as Record<string, unknown>;
    expect(s["largeDogsOk"]).toBeNull();
    expect(s["maxDogs"]).toBeNull();
    expect(s["petFee"]).toBeNull();
    expect(s["fencedYard"]).toBeNull();
  });

  // ---- Found by an independent review: each of these used to slip through ----
  it("refuses an article whose web address is already used by an existing article (this used to crash the live site)", () => {
    reset();
    mkdirSync(join(root, "src/content/guides"), { recursive: true });
    writeFileSync(join(root, "src/content/guides/existing-guide.ts"), "export const guide = {};\n");
    writeFileSync(join(root, "content/guides/existing-guide.md"), cleanGuide());
    expect(() => loadContent(root, false)).toThrow(/already exists/);
    rmSync(join(root, "src"), { recursive: true, force: true });
  });

  it("refuses a built-in photo name that does not exist (this used to crash the home page)", () => {
    reset();
    mkdirSync(join(root, "src/lib"), { recursive: true });
    writeFileSync(
      join(root, "src/lib/images.ts"),
      'export const images = {\n  "real-photo": { src: a, alt: "x" },\n} as const;\n',
    );
    writeFileSync(
      join(root, "content/guides/img.md"),
      guideWith((t) => t.replace(/^heroImage:.*$/m, "heroImage: not-a-photo")),
    );
    expect(() => loadContent(root, false)).toThrow(/not-a-photo[\s\S]*does not exist/);
    writeFileSync(
      join(root, "content/guides/img.md"),
      guideWith((t) => t.replace(/^heroImage:.*$/m, "heroImage: real-photo")),
    );
    expect(loadContent(root, false).guides.length).toBe(1);
    rmSync(join(root, "src"), { recursive: true, force: true });
  });

  it("refuses a related article that does not exist", () => {
    reset();
    writeFileSync(
      join(root, "content/guides/rel.md"),
      guideWith((t) => t.replace("relatedGuides: []", "relatedGuides:\n  - no-such-guide")),
    );
    expect(() => loadContent(root, false)).toThrow(/related article "no-such-guide"/);
  });

  it("a half-written DRAFT never blocks the build, but a broken PUBLISHED article does", () => {
    reset();
    writeFileSync(
      join(root, "content/guides/draft.md"),
      "---\ntitle: Just started\nstatus: draft\n---\nSome words\n",
    );
    writeFileSync(join(root, "content/guides/ok.md"), cleanGuide());
    expect(loadContent(root, false).guides.length).toBe(1);
    writeFileSync(
      join(root, "content/guides/broken.md"),
      guideWith((t) => t.replace(/^seoTitle:.*$/m, "seoTitle: " + "x".repeat(80))),
    );
    expect(() => loadContent(root, false)).toThrow(/broken\.md/);
  });

  it("does not ship private notes or unapproved affiliate links to visitors", () => {
    reset();
    writeFileSync(join(root, "content/guides/ok.md"), cleanGuide());
    writeFileSync(
      join(root, "content/affiliates.yml"),
      "links:\n  - id: a\n    network: Vrbo\n    url: https://example.com/a\n    approved: false\n    notes: SECRET-NOTE\n  - id: b\n    network: Vrbo\n    url: https://example.com/b\n    approved: true\n    notes: ANOTHER-NOTE\n",
    );
    const pub = JSON.stringify(loadContent(root, false));
    expect(pub).not.toContain("SECRET-NOTE");
    expect(pub).not.toContain("ANOTHER-NOTE");
    expect(pub).not.toContain("example.com/a");
    expect(pub).toContain("example.com/b");
    expect(pub).not.toContain('primaryKeyword":"how');
    expect(JSON.stringify(loadContent(root, true))).toContain("SECRET-NOTE");
  });

  it("an unfinished draft with an invalid file name is skipped (not a build failure), and the message suggests a valid name", () => {
    reset();
    writeFileSync(
      join(root, "content/guides/My Draft Title.md"),
      guideWith((t) => t.replace("status: published", "status: draft")),
    );
    const out = loadContent(root, false);
    expect(out.guides).toEqual([]);
    writeFileSync(
      join(root, "content/guides/My Published Title.md"),
      guideWith((t) => t),
    );
    expect(() => loadContent(root, false)).toThrow(/my-published-title\.md/);
  });

  it("rejects unsafe or sloppy values", () => {
    reset();
    const bad = (file: string, text: string, re: RegExp) => {
      writeFileSync(join(root, file), text);
      expect(() => loadContent(root, false), file).toThrow(re);
      rmSync(join(root, file));
    };
    bad(
      "content/affiliates.yml",
      "links:\n  - id: a\n    network: X\n    url: http://example.com\n",
      /https/,
    );
    bad(
      "content/affiliates.yml",
      "links:\n  - id: a\n    network: X\n    url: javascript:alert(1)\n",
      /web address|https/,
    );
    bad("content/settings.yml", 'siteUrl: "https://a.com?x=<b>"\n', /siteUrl/);
    bad(
      "content/guides/dates.md",
      guideWith((t) => t.replace(/^publishedOn:.*$/m, "publishedOn: 2026-13-45")),
      /real date/,
    );
    bad(
      "content/guides/trav.md",
      guideWith((t) => t.replace(/^heroImage:.*$/m, "heroUpload: /uploads/../../package.json")),
      /uploads/,
    );
    bad(
      "content/guides/Bad Name.md",
      guideWith((t) => t),
      /lowercase letters/,
    );
    bad(
      "content/stays/Bad Name.yml",
      "name: X\nstatus: verified\nlastVerified: 2026-11-16\ntype: cabin\nstate: georgia\ntown: a\nsummary: s\ndescription: d\nimage: guide-ga-cabins\n",
      /lowercase letters/,
    );
    bad(
      "content/stays/zero.yml",
      "name: X\nstatus: unverified\ntype: cabin\nstate: georgia\ntown: a\nsummary: s\ndescription: d\nimage: guide-ga-cabins\npetFee: charged\npetFeeAmount: 0\npetFeeBasis: stay\n",
      /above zero/,
    );
  });

  it("affiliate links in article text must exist in Affiliate links (a typo fails the build; an unfinished draft is skipped)", () => {
    reset();
    writeFileSync(
      join(root, "content/guides/aff.md"),
      guideWith((t) => t.replace(/^## /m, "Try the [thing](aff:not-there).\n\n## ")),
    );
    expect(() => loadContent(root, false)).toThrow(/affiliate link "not-there"/);
    writeFileSync(
      join(root, "content/affiliates.yml"),
      "links:\n  - id: not-there\n    network: Test\n    url: https://example.com/x\n    approved: false\n",
    );
    expect(loadContent(root, false).guides.length).toBe(1);
    rmSync(join(root, "content/affiliates.yml"));
    writeFileSync(
      join(root, "content/guides/aff.md"),
      guideWith((t) =>
        t
          .replace("status: published", "status: draft")
          .replace(/^## /m, "Try the [thing](aff:not-there).\n\n## "),
      ),
    );
    expect(loadContent(root, false).guides).toEqual([]);
  });

  it("an unfinished article's photo never blocks the build, but a published article still needs a valid one", () => {
    reset();
    mkdirSync(join(root, "src/lib"), { recursive: true });
    writeFileSync(
      join(root, "src/lib/images.ts"),
      'export const images = {\n  "real-photo": { src: a, alt: "x" },\n} as const;\n',
    );
    const noPhoto = guideWith((t) => t.replace(/^heroImage:.*\n/m, ""));
    writeFileSync(
      join(root, "content/guides/draft.md"),
      noPhoto.replace("status: published", "status: draft"),
    );
    expect(loadContent(root, false).guides).toEqual([]);
    writeFileSync(
      join(root, "content/guides/draft.md"),
      guideWith((t) =>
        t
          .replace("status: published", "status: draft")
          .replace(/^heroImage:.*$/m, "heroImage: not-a-photo"),
      ),
    );
    expect(loadContent(root, false).guides).toEqual([]);
    writeFileSync(
      join(root, "content/guides/draft.md"),
      guideWith((t) =>
        t
          .replace("status: published", "status: draft")
          .replace(/^heroImage:.*$/m, "heroUpload: /uploads/missing.jpg"),
      ),
    );
    expect(loadContent(root, false).guides).toEqual([]);
    writeFileSync(join(root, "content/guides/published.md"), noPhoto);
    expect(() => loadContent(root, false)).toThrow(/pick a built-in hero image/);
    rmSync(join(root, "src"), { recursive: true, force: true });
  });

  it("a stay needs no photo; a photo that is named but missing never blocks an unfinished stay, but still stops a verified one", () => {
    reset();
    mkdirSync(join(root, "src/lib"), { recursive: true });
    writeFileSync(
      join(root, "src/lib/images.ts"),
      'export const images = {\n  "real-photo": { src: a, alt: "x" },\n} as const;\n',
    );
    const draft = stayFixture().replace(/^image:.*\n/m, "");
    const verified = draft.replace(
      "status: unverified",
      "status: verified\nlastVerified: 2026-11-16",
    );
    writeFileSync(join(root, "content/stays/draft.yml"), draft);
    expect(loadContent(root, false).stays).toHaveLength(1);
    writeFileSync(
      join(root, "content/stays/draft.yml"),
      draft.replace(/^name:/m, "image: not-a-photo\nname:"),
    );
    expect(loadContent(root, false).stays).toEqual([]);
    writeFileSync(
      join(root, "content/stays/draft.yml"),
      draft.replace(/^name:/m, "imageUpload: /uploads/missing.jpg\nname:"),
    );
    expect(loadContent(root, false).stays).toEqual([]);
    reset();
    writeFileSync(join(root, "content/stays/verified.yml"), verified);
    expect(loadContent(root, false).stays).toHaveLength(1);
    writeFileSync(
      join(root, "content/stays/verified.yml"),
      verified.replace(/^name:/m, "image: not-a-photo\nname:"),
    );
    expect(() => loadContent(root, false)).toThrow(/not-a-photo[\s\S]*does not exist/);
    writeFileSync(
      join(root, "content/stays/verified.yml"),
      verified.replace(/^name:/m, "imageUpload: /uploads/missing.jpg\nname:"),
    );
    expect(() => loadContent(root, false)).toThrow(/missing\.jpg/);
    rmSync(join(root, "src"), { recursive: true, force: true });
  });

  it("a stay's booking link must exist in Affiliate links", () => {
    reset();
    writeFileSync(
      join(root, "content/stays/b.yml"),
      "name: B\nstatus: verified\ntype: cabin\nstate: georgia\ntown: a\nsummary: s\ndescription: d\nimage: guide-ga-cabins\nlastVerified: 2026-11-16\naffiliateId: nope\n",
    );
    expect(() => loadContent(root, false)).toThrow(/booking link "nope"/);
  });
});
