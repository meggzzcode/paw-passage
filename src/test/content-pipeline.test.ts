import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadContent } from "../../plugins/content";

// These tests protect the promise a buyer relies on: saving something in the CMS never makes it public
// by accident, and a mistake in a content file stops the build with a clear message instead of publishing.
const realGuide = join(process.cwd(), "content/guides/how-vacation-rental-pet-fees-work.md");
const realStay = join(process.cwd(), "content/stays/sample-ridge-cabin.yml");
let root = "";

const guideWith = (edit: (t: string) => string) => {
  const fs = require("node:fs") as typeof import("node:fs");
  return edit(fs.readFileSync(realGuide, "utf8"));
};

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
    cpSync(realGuide, join(root, "content/guides/ok.md"));
    expect(loadContent(root, false).guides.length).toBe(1);
  });

  it("leaves drafts, unapproved guides and sample stays OUT of production builds entirely", () => {
    reset();
    writeFileSync(join(root, "content/guides/draft.md"), guideWith((t) => t.replace("status: published", "status: draft")));
    writeFileSync(join(root, "content/guides/unapproved.md"), guideWith((t) => t.replace(/^approvedBy:.*\n/m, "").replace(/^approvedOn:.*\n/m, "")));
    cpSync(realStay, join(root, "content/stays/sample.yml"));
    const prod = loadContent(root, false);
    expect(prod.guides).toEqual([]);
    expect(prod.stays).toEqual([]);
    const preview = loadContent(root, true);
    expect(preview.guides.length).toBe(2);
    expect(preview.stays.length).toBe(1);
  });

  it("a guide whose research is not complete is not public even when approved", () => {
    reset();
    writeFileSync(join(root, "content/guides/x.md"), guideWith((t) => t.replace("researchComplete: true", "researchComplete: false")));
    expect(loadContent(root, false).guides).toEqual([]);
  });

  it("stops with a plain message naming the file and field when content is wrong", () => {
    reset();
    writeFileSync(join(root, "content/guides/bad.md"), guideWith((t) => t.replace(/^seoTitle:.*$/m, "seoTitle: " + "x".repeat(80))));
    expect(() => loadContent(root, false)).toThrow(/content\/guides\/bad\.md[\s\S]*seoTitle/);
  });

  it("rejects an uploaded hero image that is not in the uploads folder", () => {
    reset();
    writeFileSync(join(root, "content/guides/up.md"), guideWith((t) => t.replace(/^heroImage:.*$/m, "heroUpload: /uploads/missing.jpg")));
    expect(() => loadContent(root, false)).toThrow(/missing\.jpg/);
  });

  it("rejects a malformed affiliate link and bad site settings", () => {
    reset();
    writeFileSync(join(root, "content/affiliates.yml"), "links:\n  - id: a\n    network: Amazon Associates\n    url: not-a-url\n");
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
});
