import { describe, expect, it } from "vitest";
import { createRootRoute, createRoute, createRouter, createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { Route as MethodologyRoute } from "@/routes/methodology";
import { Route as CorrectionsRoute } from "@/routes/corrections";

const BRANDS = /vrbo|expedia|airbnb|hotels\.com|homeaway/i;

describe.each([
  ["/methodology", MethodologyRoute, "Product review methodology"],
  ["/corrections", CorrectionsRoute, "Corrections and updates"],
] as const)("%s page", (path, route, h1) => {
  it("renders its H1 and has no brand name in its meta", async () => {
    const root = createRootRoute();
    const page = createRoute({ getParentRoute: () => root, path, component: route.options.component as () => React.ReactNode });
    const router = createRouter({ routeTree: root.addChildren([page]), history: createMemoryHistory({ initialEntries: [path] }) });
    await router.load();
    const html = renderToString(<RouterProvider router={router} />);
    expect(html).toMatch(new RegExp(`<h1[^>]*>${h1}</h1>`));
    const head = JSON.stringify(route.options.head?.({} as never));
    expect(head).not.toMatch(BRANDS);
  });
});
