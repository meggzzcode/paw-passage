import { describe, expect, it } from "vitest";
import { packItems, recommended, defaultProfile, packingText } from "@/lib/packing";
import { getProduct } from "@/content/gear";

const reasonOf = (p: Parameters<typeof recommended>[0], id: string) =>
  recommended(p).find((r) => r.item.id === id)?.reason ?? null;

describe("packing builder", () => {
  it("every product id points to a real gear product", () => {
    for (const item of packItems)
      for (const id of item.productIds) expect(getProduct(id), `${item.id}: ${id}`).toBeTruthy();
  });
  it("recommends a car restraint only when driving", () => {
    expect(reasonOf(defaultProfile, "car-restraint")).toBeTruthy();
    expect(reasonOf({ ...defaultProfile, car: false }, "car-restraint")).toBeNull();
  });
  it("recommends a tracker and a pen for dogs that bolt", () => {
    expect(reasonOf(defaultProfile, "gps")).toBeNull();
    expect(reasonOf({ ...defaultProfile, bolter: true }, "gps")).toBeTruthy();
    expect(reasonOf({ ...defaultProfile, noFence: true }, "fence")).toBeTruthy();
  });
  it("prints a packed and unpacked list", () => {
    const t = packingText(["bowl"]);
    expect(t).toContain("[x] Collapsible bowl");
    expect(t).toContain("[ ] First aid kit");
  });
});
