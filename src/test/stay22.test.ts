import { describe, expect, it } from "vitest";
import { stay22Src } from "@/lib/stay22";

describe("stay22 embed", () => {
  it("builds nothing without an account id", () => {
    expect(stay22Src({ aid: "", address: "Blue Ridge, Georgia" })).toBeNull();
    expect(stay22Src({ aid: "  ", address: "Blue Ridge, Georgia" })).toBeNull();
  });
  it("rejects an id with odd characters", () => {
    expect(stay22Src({ aid: "a b&c=d", address: "x" })).toBeNull();
  });
  it("needs a place", () => {
    expect(stay22Src({ aid: "myid" })).toBeNull();
  });
  it("builds the documented embed url with an encoded address", () => {
    const u = new URL(stay22Src({ aid: "myid", address: "Blue Ridge, Georgia", campaign: "stays directory" })!);
    expect(u.origin + u.pathname).toBe("https://www.stay22.com/embed/gm");
    expect(u.searchParams.get("aid")).toBe("myid");
    expect(u.searchParams.get("address")).toBe("Blue Ridge, Georgia");
    expect(u.searchParams.get("campaign")).toBe("stays-directory");
  });
  it("prefers lat and lng over an address", () => {
    const u = new URL(stay22Src({ aid: "myid", address: "x", lat: 34.8, lng: -84.3 })!);
    expect(u.searchParams.get("lat")).toBe("34.8");
    expect(u.searchParams.has("address")).toBe(false);
  });
});
