import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { products } from "@/content/gear";
import { isMonetized } from "@/content/affiliate-usage";

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ pathname: "/guides/x" }),
  Link: ({ children }: { children: unknown }) => <a>{children as never}</a>,
}));

describe("gear blocks do not repeat pick cards", () => {
  it("RelatedProducts skips products already picked in the body and hides when none are left", async () => {
    const { RelatedProducts } = await import("@/components/site/RelatedProducts");
    const earning = products.filter((p) => isMonetized(p)).slice(0, 4);
    if (earning.length < 2) return;
    const ids = earning.map((p) => p.id);
    const all = renderToStaticMarkup(<RelatedProducts productIds={ids} />);
    expect(all).toContain("related-products");
    const some = renderToStaticMarkup(<RelatedProducts productIds={ids} excludeIds={[ids[0]!]} />);
    expect(some.split("<li").length).toBeLessThan(all.split("<li").length);
    const none = renderToStaticMarkup(<RelatedProducts productIds={ids} excludeIds={ids} />);
    expect(none).toBe("");
  });
});
