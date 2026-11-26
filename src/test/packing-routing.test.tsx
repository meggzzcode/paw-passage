import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { Route } from "@/routes/tools.packing-list";
import { Route as guideRoute } from "@/routes/guides.$slug";
import { packingConfig as cfg } from "@/content/packing";
import { allGuides, isPublic, loadGuide } from "@/content/guides";
import { Markdown } from "@/components/site/Markdown";
import { moduleCopy, plannerModuleHtml } from "@/lib/packing/guide-module";
import { parsePresetSearch } from "@/lib/packing/preset";
import { sitemapEntries } from "@/lib/sitemap-entries";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const head = (route: any, ctx: Record<string, unknown> = {}) => route.options.head(ctx);
const meta = (h: { meta: Record<string, string>[] }, key: string) =>
  h.meta.find((m) => m["name"] === key || m["property"] === key)?.["content"] ?? "";

const validate = Route.options.validateSearch as unknown as (
  s: Record<string, unknown>,
) => Record<string, unknown>;

describe("packing planner route, metadata and indexing", () => {
  it("keeps the URL, a self canonical, the promised title and a description about the planner", () => {
    const h = head(Route);
    expect(h.meta[0].title).toBe("Road Trip Packing List for Dogs | Paw & Passage");
    expect(h.meta[0].title.length).toBeLessThanOrEqual(60);
    const d = meta(h, "description");
    expect(d).toMatch(/personalized/i);
    expect(d).toMatch(/customize/i);
    expect(d).toMatch(/check/i);
    expect(d).toMatch(/print/i);
    expect(d.length).toBeLessThanOrEqual(155);
    expect(h.links).toEqual([
      { rel: "canonical", href: expect.stringMatching(/\/tools\/packing-list$/) },
    ]);
    expect(meta(h, "robots")).toBe("");
    expect(meta(h, "og:title")).toBe(h.meta[0].title);
  });

  it("canonical stays the same with a preset, and presets create no new route or sitemap entry", () => {
    const search = validate({
      trip: "cabin",
      days: "3",
      dogs: "2",
      junk: "1",
    });
    expect(search).toEqual({ trip: "cabin", days: 3, dogs: 2 });
    const h = head(Route, { match: { search } });
    expect(h.links[0].href).toMatch(/\/tools\/packing-list$/);
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths.filter((p) => p.includes("packing-list"))).toEqual(
      ["/tools/packing-list", "/guides/dog-friendly-cabin-packing-list"].filter((p) =>
        paths.includes(p),
      ),
    );
    const routeFiles = readdirSync("src/routes").filter((f) => /packing/.test(f));
    expect(routeFiles).toEqual(["tools.packing-list.tsx"]);
  });

  it("validates and clamps URL parameters and ignores everything unknown", () => {
    const v = validate;
    expect(v({ days: "0" })).toEqual({ days: 1 });
    expect(v({ days: "31", dogs: "6" })).toEqual({ days: 30, dogs: 5 });
    expect(v({ trip: "<script>", days: "x" })).toEqual({});
    expect(v({ trip: "road-trip" })).toEqual({ trip: "road-trip" });
    expect(parsePresetSearch({ trip: "camping-hiking", dogs: 2 }, cfg)).toEqual({
      trip: "camping-hiking",
      dogs: 2,
    });
  });

  it("server-renders the page with the intro and setup, no list and no personal state", async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ["/tools/packing-list?trip=road-trip&days=5&dogs=2"],
      }),
      context: { queryClient: new QueryClient() } as never,
    });
    await router.load();
    const { RouterProvider } = await import("@tanstack/react-router");
    const html = renderToString(<RouterProvider router={router} />);
    expect(html).toContain("Road trip adventures");
    expect(html).toContain("Pack for your next road trip adventure.");
    expect(html).toContain(
      "Tell us a little about your trip. We&#x27;ll help you build a packing list for your dog, without the stuff you don&#x27;t need.",
    );
    expect(html).toContain("Your list saves on this device. No signup required.");
    expect(html).toContain("First, tell us about your trip.");
    expect(html).toContain("Set up from your link: Road trip, 5 days, 2 dogs.");
    expect(html).not.toMatch(/items packed|Things to pick up|Amazon Associate/);
    expect(html.match(/<h1/g)?.length).toBe(1);
  });
});

describe("guide integration", () => {
  it("renders the module in the cabin guide right after the short intro, with the exact copy and a plain GET form", async () => {
    const g = (await loadGuide("dog-friendly-cabin-packing-list"))!;
    expect(isPublic(g)).toBe(true);
    const intro = g.body.indexOf("Start with the essentials below");
    const mod = g.body.indexOf("{{planner:cabin}}");
    const firstH2 = g.body.indexOf("\n## ");
    expect(intro).toBeGreaterThan(-1);
    expect(mod).toBeGreaterThan(intro);
    expect(mod).toBeLessThan(firstH2);
    const html = renderToString(<Markdown source={g.body} />);
    expect(html).toContain("Make this list yours");
    expect(html).toContain(
      "Heading to a cabin with your dog? Build a packing list for your stay, your plans, and the number of dogs coming.",
    );
    expect(html).toContain("Build my cabin packing list");
    expect(html).toMatch(/<form method="get" action="\/tools\/packing-list">/);
    expect(html).toContain('<input type="hidden" name="trip" value="cabin">');
    expect(html).toContain('name="days"');
    expect(html).toContain('name="dogs"');
    expect((html.match(/data-planner-module=/g) ?? []).length).toBe(1);
  });

  it("keeps the guide's metadata, canonical and indexing", async () => {
    const g = (await loadGuide("dog-friendly-cabin-packing-list"))!;
    const h = head(guideRoute, { loaderData: { guide: g }, params: { slug: g.slug } });
    expect(meta(h, "robots")).toBe("");
    expect(h.links[0].href).toMatch(/\/guides\/dog-friendly-cabin-packing-list$/);
    expect(g.seoTitle).toBe("Dog Cabin Packing List: What to Bring");
    expect(g.sources.length).toBeGreaterThan(3);
  });

  it("works as a shared directive for any trip type, and ignores unknown ones", () => {
    expect(moduleCopy("road-trip", cfg)!.cta).toBe("Build my road trip packing list");
    expect(plannerModuleHtml("road-trip", cfg)).toContain('value="road-trip"');
    expect(plannerModuleHtml("moon-base", cfg)).toBe("");
    const html = renderToString(<Markdown source={"Intro.\n\n{{planner:road-trip}}\n\nAfter."} />);
    expect(html).toContain("Heading out on a road trip with your dog?");
    expect(renderToString(<Markdown source={"{{planner:moon-base}}\n"} />)).not.toContain(
      "pk-guide",
    );
  });

  it("links the planner only where it serves intent, and not on every article", () => {
    const withLink = allGuides.filter(
      (g) =>
        /\/tools\/packing-list/.test(g.body) || (g.relatedTools ?? []).includes("packing-list"),
    );
    expect(withLink.length).toBeGreaterThan(0);
    expect(withLink.length).toBeLessThan(allGuides.length);
    expect(withLink.map((g) => g.slug)).toContain("dog-friendly-cabin-packing-list");
    expect(readFileSync("src/components/gear/GearHomeSections.tsx", "utf8")).toContain(
      "/tools/packing-list",
    );
  });

  it("never links the calculators the owner removed", () => {
    const files = [
      "src/components/packing/PackingPlanner.tsx",
      "src/components/packing/Shopping.tsx",
      "src/components/packing/Checklist.tsx",
      "src/routes/tools.packing-list.tsx",
      "content/packing.yml",
    ];
    for (const f of files)
      expect(readFileSync(f, "utf8")).not.toMatch(/fee-calculator|pet-cost|cost check|stay-fee/i);
  });
});
