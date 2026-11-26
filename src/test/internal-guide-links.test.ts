import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { allGuides, isPublic } from "@/content/guides";

const root = resolve(__dirname, "../..");
const publicSlugs = new Set(allGuides.filter(isPublic).map((g) => g.slug));
const published = allGuides.filter(isPublic);

const linkable = (slug: string) => publicSlugs.has(slug);

function guideLinks(text: string): string[] {
  return [...text.matchAll(/\]\(\/guides\/([a-z0-9-]+)\)/g)].map((m) => m[1] ?? "");
}

describe("internal guide links point at public guides", () => {
  it("has public guides to check", () => {
    expect(publicSlugs.size).toBeGreaterThan(0);
  });

  it("published guide bodies only link to public guides", () => {
    for (const g of published) {
      const body = JSON.stringify(g);
      for (const slug of guideLinks(body.replace(/\\n/g, "\n"))) {
        expect(linkable(slug), `${g.slug} links to /guides/${slug}`).toBe(true);
      }
    }
  });

  it("published guide markdown only links to public guides", () => {
    for (const g of published) {
      for (const file of [`content/guides/${g.slug}.md`]) {
        let text: string;
        try {
          text = readFileSync(resolve(root, file), "utf8");
        } catch {
          continue;
        }
        for (const slug of guideLinks(text)) {
          expect(linkable(slug), `${file} links to /guides/${slug}`).toBe(true);
        }
      }
    }
  });

  it("relatedGuides entries of published guides are public", () => {
    for (const g of published) {
      for (const r of g.relatedGuides) {
        expect(linkable(r), `${g.slug} relatedGuides: ${r}`).toBe(true);
      }
    }
  });

  it("products.yml relatedGuides are public", () => {
    const yml = readFileSync(resolve(root, "content/products.yml"), "utf8");
    for (const m of yml.matchAll(/relatedGuides:\n((?: {6}- .*\n)+)/g)) {
      for (const line of (m[1] ?? "").trim().split("\n")) {
        const slug = line.replace(/^\s*-\s*/, "").trim();
        expect(publicSlugs.has(slug), `products.yml relatedGuides: ${slug}`).toBe(true);
      }
    }
  });
});

describe("retired site sections are not linked from guides", () => {
  it("no published guide links to a retired page", () => {
    for (const g of published) {
      const text = readFileSync(resolve(root, `content/guides/${g.slug}.md`), "utf8");
      expect(text, g.slug).not.toMatch(
        /\]\(\/(stays|destinations|dogs|dog-rules|data|list-your-property)(\/|\))|\]\(\/tools\/(checklist|cost-calculator|host-questions|pet-cost-check|will-my-dog-be-accepted)\)/,
      );
    }
  });

  it("every guide is publishable: no drafts are kept in the repository", () => {
    expect(allGuides.filter((g) => !isPublic(g)).map((g) => g.slug)).toEqual([]);
  });
});
