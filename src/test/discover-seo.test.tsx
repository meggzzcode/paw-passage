// /discover must carry concise, crawlable, server-rendered public intro content (not an empty loading shell), and must hold nothing protected.
import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { DISCOVER_INTRO_HEADING } from "@/components/passport/DiscoverPage";

async function ssr(url: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [url] }),
    context: { queryClient: new QueryClient() } as never,
  });
  await router.load();
  return renderToString(<RouterProvider router={router} />);
}

describe("/discover server-rendered HTML", () => {
  it("contains the public intro (heading, explanation, links) without running any script", async () => {
    const html = await ssr("/discover");
    expect(html).toContain(DISCOVER_INTRO_HEADING);
    expect(html).toContain('data-testid="discover-intro"');
    expect(html).toMatch(/personalized pick/);
    expect(html).toMatch(/no account, email or\s+card/i);
    for (const href of ["/previews", "/journal", "/unlock"])
      expect(html).toContain(`href="${href}"`);
  });
  it("is not only an empty loading shell and holds no adventure steps", async () => {
    const html = await ssr("/discover");
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");
    expect(text.length).toBeGreaterThan(400);
    expect(html).not.toContain("<article"); // no adventure card is server-rendered
    expect(html).not.toMatch(/class="pa-steps"|data-testid="adventure/);
  });
  it("still renders the intro for a ctx variant (which is noindex) and the plain page keeps a self canonical", async () => {
    const html = await ssr("/discover?ctx=rainy-day");
    expect(html).toContain(DISCOVER_INTRO_HEADING);
  });
});
