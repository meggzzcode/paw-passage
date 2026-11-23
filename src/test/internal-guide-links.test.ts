import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { allGuides, isPublic } from "@/content/guides";
import { dogTypes } from "@/content/dog-types";

const root = resolve(__dirname, "../..");
const publicSlugs = new Set(allGuides.filter(isPublic).map((g) => g.slug));
const published = allGuides.filter(isPublic);

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
        expect(publicSlugs.has(slug), `${g.slug} links to /guides/${slug}`).toBe(true);
      }
    }
  });

  it("published guide markdown and ts sources only link to public guides", () => {
    for (const g of published) {
      for (const file of [`content/guides/${g.slug}.md`, `src/content/guides/${g.slug}.ts`]) {
        let text: string;
        try {
          text = readFileSync(resolve(root, file), "utf8");
        } catch {
          continue;
        }
        for (const slug of guideLinks(text)) {
          expect(publicSlugs.has(slug), `${file} links to /guides/${slug}`).toBe(true);
        }
      }
    }
  });

  it("relatedGuides entries of published guides are public", () => {
    for (const g of published) {
      for (const r of g.relatedGuides) {
        expect(publicSlugs.has(r), `${g.slug} relatedGuides: ${r}`).toBe(true);
      }
    }
  });

  it("dog-type pages only point at public guides", () => {
    for (const d of dogTypes) {
      for (const s of d.guideSlugs) {
        expect(publicSlugs.has(s), `dog type ${d.slug}: ${s}`).toBe(true);
      }
      for (const f of d.facts ?? []) {
        for (const slug of guideLinks(`](${f.to})`)) {
          expect(publicSlugs.has(slug), `dog type ${d.slug} fact: ${slug}`).toBe(true);
        }
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
