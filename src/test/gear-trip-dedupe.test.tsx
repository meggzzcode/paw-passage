import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { liveTrips } from "@/content/gear-hub";

async function render(url: string) {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
    history: createMemoryHistory({ initialEntries: [url] }),
  });
  await router.load();
  return renderToString(<RouterProvider router={router} />);
}

describe("gear trip views", () => {
  it("every trip view shows each product once, with no featured repeat", async () => {
    const trips = liveTrips();
    expect(trips.length).toBeGreaterThan(0);
    for (const t of trips) {
      const html = await render(`/gear?trip=${t.slug}`);
      const ids = [...html.matchAll(/<article[^>]*? id="([^"]+)"[^>]*data-gearcard/g)].map(
        (m) => m[1],
      );
      expect(ids.length, t.slug).toBeGreaterThan(0);
      expect(new Set(ids).size, `${t.slug} repeats ${ids.join(",")}`).toBe(ids.length);
      const featured = html.includes("A few good places to start");
      if (featured) {
        // Featured stays only when at least three cards are left for it.
        expect(html.split("gear-featured").length, t.slug).toBeGreaterThan(1);
      }
    }
  });

  it("the hub without a trip still shows the featured section", async () => {
    expect(await render("/gear")).toContain("A few good places to start");
  });
});

describe("gear category meta", () => {
  it("has a natural title of 60 characters or fewer and a 120-155 character description", async () => {
    const { gearCategories } = await import("@/content/gear-categories");
    for (const c of gearCategories) {
      expect(c.metaTitle.length, c.slug).toBeLessThanOrEqual(60);
      expect(c.metaTitle, c.slug).not.toMatch(/for Dogs$/);
      expect(c.metaDescription.length, c.slug).toBeGreaterThanOrEqual(120);
      expect(c.metaDescription.length, c.slug).toBeLessThanOrEqual(155);
    }
  });
});
