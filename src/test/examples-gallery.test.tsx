// The public keepsake gallery: honest labels, fixed-ratio boxes, lazy images, a credits disclosure, no screenshots.
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PhotoFilterExamples } from "@/components/site/PhotoFilterExamples";
import { HOME_EXAMPLES, PURCHASE_EXAMPLES } from "@/components/site/keepsake-examples";

describe("keepsake gallery", () => {
  it("labels each pair 'Your photo' and 'Your little keepsake' with lazy fixed-ratio images", () => {
    const { container } = render(<PhotoFilterExamples images={HOME_EXAMPLES} />);
    const items = container.querySelectorAll(".kx-item");
    expect(items).toHaveLength(HOME_EXAMPLES.length);
    for (const it of items) {
      expect(it.textContent).toContain("Your photo");
      expect(it.textContent).toContain("Your little keepsake");
    }
    for (const img of container.querySelectorAll("img")) {
      expect(img.getAttribute("loading")).toBe("lazy");
      expect(img.getAttribute("alt")!.length).toBeGreaterThan(20);
      expect(Number(img.getAttribute("width"))).toBeGreaterThan(0);
      expect(Number(img.getAttribute("height"))).toBeGreaterThan(0);
    }
    for (const box of container.querySelectorAll<HTMLElement>(".kx-after .kx-box"))
      expect(box.style.aspectRatio).toMatch(/\d+ \/ \d+/);
  });

  it("shows no interface screenshot and credits every photographer in a disclosure", () => {
    const { container } = render(<PhotoFilterExamples images={PURCHASE_EXAMPLES} compact />);
    expect(container.innerHTML).not.toMatch(/\/demo\//);
    const credits = container.querySelector("details.kx-credits");
    expect(credits).toBeTruthy();
    expect(credits!.textContent).toContain("CC0, via Wikimedia Commons");
    for (const e of PURCHASE_EXAMPLES) expect(credits!.textContent).toContain(e.credit!.author);
  });
});
