import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { allGuides, isPublic } from "@/content/guides";
import { sitemapEntries } from "@/lib/sitemap-entries";

const root = resolve(__dirname, "../..");
const RETIRED = "vacation-rentals-with-no-dog-weight-limit";
const SURVIVOR = "vacation-rentals-that-welcome-large-dogs";

describe("no-dog-weight-limit guide merged into the large-dog guide", () => {
  it("the retired guide is gone and the survivor is public", () => {
    expect(allGuides.some((g) => g.slug === RETIRED)).toBe(false);
    expect(allGuides.filter(isPublic).some((g) => g.slug === SURVIVOR)).toBe(true);
  });

  it("the sitemap lists the survivor and not the retired URL", () => {
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths).toContain(`/guides/${SURVIVOR}`);
    expect(paths).not.toContain(`/guides/${RETIRED}`);
  });

  it("netlify.toml has a permanent forced 301 to the survivor", () => {
    const toml = readFileSync(resolve(root, "netlify.toml"), "utf8");
    const block = toml
      .split("[[redirects]]")
      .find((b) => b.includes(`from = "/guides/${RETIRED}"`));
    expect(block).toBeDefined();
    expect(block).toContain(`to = "/guides/${SURVIVOR}"`);
    expect(block).toContain("status = 301");
  });

  it("the app route throws a 301 to the survivor", async () => {
    const { Route } = await import("@/routes/guides.vacation-rentals-with-no-dog-weight-limit");
    let thrown: unknown;
    try {
      await (Route.options.beforeLoad as () => unknown)();
    } catch (e) {
      thrown = e;
    }
    const r = thrown as { options?: { statusCode?: number; href?: string } };
    expect(r.options?.statusCode).toBe(301);
    expect(r.options?.href).toBe(`/guides/${SURVIVOR}`);
  });

  it("the survivor covers both intents in its title, answer and keywords", () => {
    const g = allGuides.find((x) => x.slug === SURVIVOR)!;
    expect(g.title.toLowerCase()).toContain("large dog");
    expect(g.title.toLowerCase()).toContain("no weight limit");
    expect(g.dek.split(/\s+/).length).toBeGreaterThanOrEqual(20);
    expect(g.dek.split(/\s+/).length).toBeLessThanOrEqual(28);
    expect(g.research?.relatedKeywords.join(" ")).toContain("no dog weight limit");
    expect(g.relatedGuides).not.toContain(RETIRED);
    expect(g.body).not.toContain(`/guides/${RETIRED}`);
  });
});
