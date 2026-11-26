import { describe, expect, it } from "vitest";
import { productNameOnly, productTitle } from "@/lib/product-display";
import { pageHead } from "@/lib/seo";

describe("shared product card and title fixes", () => {
  it("never repeats a brand whose first word already starts the product name", () => {
    expect(
      productTitle({ brand: "MidWest Homes for Pets", name: "MidWest Exercise Pen with Door" }),
    ).toBe("MidWest Exercise Pen with Door");
    expect(productTitle({ brand: "KONG", name: "KONG Classic" })).toBe("KONG Classic");
    expect(productTitle({ brand: "Kurgo", name: "Rover Hammock" })).toBe("Kurgo Rover Hammock");
  });
  it("adds the brand suffix to a page title only when the result stays within 60 characters", () => {
    const meta = (t: string) =>
      pageHead({ title: t, description: "d", path: "/x" }).meta as { title?: string }[];
    const short = meta("Short title")[0]?.title ?? "";
    expect(short).toContain("Paw & Passage");
    const long = meta("A fairly long page title that would overflow the limit")[0]?.title ?? "";
    expect(long.length).toBeLessThanOrEqual(60);
    expect(long).not.toContain("Paw & Passage");
  });
  it("shows the name without the brand when the card has a brand line", () => {
    expect(productNameOnly({ brand: "Pet Parents", name: "Pet Parents Pawtect Pads" })).toBe(
      "Pawtect Pads",
    );
    expect(
      productNameOnly({ brand: "MidWest Homes for Pets", name: "MidWest Exercise Pen with Door" }),
    ).toBe("Exercise Pen with Door");
    expect(productNameOnly({ brand: "Kurgo", name: "Rover Hammock" })).toBe("Rover Hammock");
  });
});
