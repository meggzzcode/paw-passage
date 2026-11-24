import { describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { routeTree } from "@/routeTree.gen";
import { products, type Product } from "@/content/gear";
import { gearCategories, legacyCategorySlugs } from "@/content/gear-categories";
import { buildCategoryView, MAX_CATEGORY_GUIDES } from "@/content/gear-category-view";
import { categoryIsLive } from "@/content/gear-hub";
import { Route as category } from "@/routes/gear.$category";

const SAFETY = ["car-safety", "ramps-and-steps", "pens-and-gates"];

async function render(path: string) {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await router.load();
  return { html: renderToString(<RouterProvider router={router} />), router };
}

const live = gearCategories.filter((c) => categoryIsLive(c.slug));

describe("category view", () => {
  it("splits primary and secondary products by first category and lists only active ones", () => {
    for (const c of live) {
      const v = buildCategoryView(c.slug)!;
      expect(v.primary.length, c.slug).toBeGreaterThan(0);
      for (const p of v.primary) expect(p.categories?.[0]).toBe(c.slug);
      for (const p of v.secondary) {
        expect(p.categories?.[0]).not.toBe(c.slug);
        expect(p.categories).toContain(c.slug);
      }
      for (const p of [...v.primary, ...v.secondary]) expect(p.active).not.toBe(false);
      expect(v.guides.length).toBeLessThanOrEqual(MAX_CATEGORY_GUIDES);
    }
  });
  it("returns nothing for unknown categories and categories with no active products", () => {
    expect(buildCategoryView("nope")).toBeUndefined();
    const inactive: Product[] = products.map((p) => ({ ...p, active: false }));
    expect(buildCategoryView("car-safety", inactive)).toBeUndefined();
  });
  it("marks exactly the safety-critical categories and gives each a short plain note", () => {
    for (const c of gearCategories) {
      expect(!!c.safetyNote, c.slug).toBe(SAFETY.includes(c.slug));
      if (c.safetyNote) expect(c.safetyNote.split(/(?<=\.)\s+/).length).toBeLessThanOrEqual(3);
    }
  });
});

describe("category page markup", () => {
  it("renders every live category with H1, one affiliate notice, products before how-to-choose", async () => {
    for (const c of live) {
      const { html } = await render(`/gear/${c.slug}`);
      expect(html, c.slug).toMatch(new RegExp(`<h1[^>]*>${c.name.replace(/&/g, "&amp;")}</h1>`));
      expect(html.match(/This page has affiliate links/g)?.length ?? 0, c.slug).toBeLessThanOrEqual(
        1,
      );
      expect(html, c.slug).not.toMatch(/Affiliate link ·|Also fits here|Check the current price/);
      const first = html.indexOf("data-gearcard=");
      const how = html.indexOf('id="how-to-choose"');
      expect(first, c.slug).toBeGreaterThan(-1);
      expect(how, c.slug).toBeGreaterThan(-1);
      const note = html.indexOf("Know before you choose");
      if (SAFETY.includes(c.slug)) {
        expect(note, c.slug).toBeGreaterThan(-1);
        expect(note, c.slug).toBeLessThan(first);
      } else {
        expect(note, c.slug).toBe(-1);
      }
      expect(first, c.slug).toBeLessThan(how);
    }
  });
  it("lists secondary products as compact rows under 'Also useful for this category'", async () => {
    const withSecondary = live.find((c) => buildCategoryView(c.slug)!.secondary.length > 0);
    expect(withSecondary, "some category has a cross-listed product").toBeTruthy();
    const v = buildCategoryView(withSecondary!.slug)!;
    const { html } = await render(`/gear/${withSecondary!.slug}`);
    const at = html.indexOf("Also useful for this category");
    expect(at).toBeGreaterThan(-1);
    const rest = html.slice(at);
    expect(rest.match(/data-gearcard="compact"/g)?.length).toBe(v.secondary.length);
    expect(html.slice(0, at)).not.toContain('data-gearcard="compact"');
    expect(html.indexOf('id="how-to-choose"')).toBeGreaterThan(at);
  });
  it("puts a #<product-id> anchor on exactly one element per product, primary and secondary", async () => {
    for (const c of live) {
      const v = buildCategoryView(c.slug)!;
      const { html } = await render(`/gear/${c.slug}`);
      for (const p of [...v.primary, ...v.secondary])
        expect(html.match(new RegExp(`\\sid="${p.id}"`, "g"))?.length, `${c.slug}#${p.id}`).toBe(1);
    }
  });
  it("shows at most three related guides and one methodology link", async () => {
    for (const c of live) {
      const { html } = await render(`/gear/${c.slug}`);
      const sec = html.match(/id="related-guides"[\s\S]*?<\/section>/)?.[0] ?? "";
      expect((sec.match(/<li/g) ?? []).length, c.slug).toBeLessThanOrEqual(3);
      const pick =
        html.match(/<section[^>]*>(?:(?!<\/section>)[\s\S])*How we pick[\s\S]*?<\/section>/)?.[0] ??
        "";
      expect(pick.match(/href="\/methodology"/g)?.length, c.slug).toBe(1);
    }
  });
});

describe("category routes", () => {
  it("redirects every legacy slug permanently to its new category", () => {
    const route = category.options as unknown as {
      beforeLoad: (a: { params: { category: string } }) => void;
    };
    for (const [old, next] of Object.entries(legacyCategorySlugs)) {
      let thrown: unknown;
      try {
        route.beforeLoad({ params: { category: old } });
      } catch (e) {
        thrown = e;
      }
      const r = thrown as { options?: { href?: string; statusCode?: number } };
      expect(r.options?.href, old).toBe(`/gear/${next}`);
      expect(r.options?.statusCode, old).toBe(301);
    }
  });
  it("does not redirect real categories", () => {
    const route = category.options as unknown as {
      beforeLoad: (a: { params: { category: string } }) => void;
    };
    for (const c of gearCategories)
      expect(() => route.beforeLoad({ params: { category: c.slug } })).not.toThrow();
  });
  it("404s unknown and empty categories and noindexes non-live ones", () => {
    const opts = category.options as unknown as {
      loader: (a: unknown) => unknown;
      head: (a: unknown) => { meta: Record<string, string>[] };
    };
    expect(() => opts.loader({ params: { category: "nope" } })).toThrow();
    for (const c of gearCategories) {
      const h = opts.head({ loaderData: { slug: c.slug }, params: { category: c.slug } });
      const robots = h.meta.find((m) => m["name"] === "robots")?.["content"];
      expect(!!robots?.includes("noindex"), c.slug).toBe(!categoryIsLive(c.slug));
    }
    const missing = opts.head({ loaderData: undefined, params: { category: "nope" } });
    expect(JSON.stringify(missing.meta)).toContain("noindex");
  });
});

describe("hash targeting", () => {
  it("opens the targeted card's details, scrolls it into view and survives a missing target", async () => {
    const { createRoot } = await import("react-dom/client");
    const { act } = await import("react");
    const { GearHashTarget } = await import("@/components/gear/GearHashTarget");
    document.body.innerHTML =
      '<ul><li id="p-one"><article><details><summary>d</summary>x</details></article></li><li id="p-two"><details></details></li></ul><div id="root"></div>';
    const scroll = vi.fn();
    Element.prototype.scrollIntoView = scroll;
    window.location.hash = "#p-one";
    const root = createRoot(document.getElementById("root")!);
    await act(async () => root.render(<GearHashTarget />));
    expect((document.querySelector("#p-one details") as HTMLDetailsElement).open).toBe(true);
    expect((document.querySelector("#p-two details") as HTMLDetailsElement).open).toBe(false);
    expect(scroll).toHaveBeenCalled();
    await act(async () => {
      window.location.hash = "#p-two";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect((document.querySelector("#p-two details") as HTMLDetailsElement).open).toBe(true);
    const before = scroll.mock.calls.length;
    await act(async () => {
      window.location.hash = "#missing";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(scroll.mock.calls.length).toBe(before);
    await act(async () => root.unmount());
    window.location.hash = "";
  });
});
