import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/site", () => ({ site: { ga4MeasurementId: "G-TEST1234" } }));

import { track, type EventName } from "@/passport/events";

const CONTRACT: EventName[] = [
  "intro_started",
  "intro_personalized",
  "intro_recommended",
  "intro_replaced",
  "intro_revealed",
  "intro_completed",
  "preview_viewed",
  "preview_bookmarked",
  "preview_unbookmarked",
  "collection_preview_viewed",
  "keepsake_created",
  "keepsake_downloaded",
  "keepsake_share_attempted",
  "purchase_cta_clicked",
  "checkout_started",
];

const calls: unknown[][] = [];
beforeEach(() => {
  calls.length = 0;
  window.gtag = (...a: unknown[]) => {
    calls.push(a);
  };
});
afterEach(() => {
  delete window.gtag;
});

describe("analytics allow-list", () => {
  it("accepts every contract event and prefixes it", () => {
    for (const n of CONTRACT) expect(track(n), n).toBe(true);
    expect(calls.map((c) => c[1])).toEqual(CONTRACT.map((n) => `pp_${n}`));
  });
  it("rejects names that are not on the list", () => {
    expect(track("dog_name_entered" as EventName)).toBe(false);
    expect(calls).toHaveLength(0);
  });
  it("sends slugs and numbers only: free text and bad keys are dropped", () => {
    track("purchase_cta_clicked", {
      where: "home-hero",
      "dog name": "Biscuit",
      note: "Biscuit loves the park",
      n: 3,
    });
    const params = calls[0]![2] as Record<string, unknown>;
    expect(params["where"]).toBe("home-hero");
    expect(params["n"]).toBe(3);
    expect(params).not.toHaveProperty("note");
    expect(params).not.toHaveProperty("dog name");
  });
});
