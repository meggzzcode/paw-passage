import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/site", () => ({ site: { ga4MeasurementId: "G-TEST1234" } }));

import { readFileSync, readdirSync } from "node:fs";
import { track, resetHandoffDedupe, type EventName } from "@/passport/events";

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
  "purchase_cta_clicked",
  "checkout_handoff",
];

const calls: unknown[][] = [];
beforeEach(() => {
  calls.length = 0;
  resetHandoffDedupe();
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
  it("pp_checkout_handoff is deduplicated within 2 seconds (one click, one event)", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(10_000);
      expect(track("checkout_handoff")).toBe(true);
      expect(track("checkout_handoff")).toBe(false);
      vi.setSystemTime(11_999);
      expect(track("checkout_handoff")).toBe(false);
      vi.setSystemTime(12_100);
      expect(track("checkout_handoff")).toBe(true);
      expect(calls.map((c) => c[1])).toEqual(["pp_checkout_handoff", "pp_checkout_handoff"]);
    } finally {
      vi.useRealTimers();
    }
  });
  it("the old name and the unused definitions are gone", () => {
    const src = readFileSync("src/passport/events.ts", "utf8");
    for (const n of [
      "checkout_started",
      "affiliate_clicked",
      "keepsake_share_attempted",
      "notification_delivery_accepted",
      "notification_opened",
    ])
      expect(src).not.toContain(`"${n}"`);
    expect(track("checkout_started" as EventName)).toBe(false);
  });
  it("every defined event has an emitter (a track or flow or trackPwa call site)", () => {
    const src = readFileSync("src/passport/events.ts", "utf8");
    const names = [...src.matchAll(/^ {2}\| "([a-z_]+)"$/gm)].map((m) => m[1]!);
    expect(names.length).toBeGreaterThan(30);
    const files: string[] = [];
    const walk = (d: string) => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const f = `${d}/${e.name}`;
        if (e.isDirectory()) walk(f);
        else if (
          /\.tsx?$/.test(e.name) &&
          !f.includes("src/test/") &&
          !f.endsWith("passport/events.ts")
        )
          files.push(f);
      }
    };
    walk("src");
    const all = files.map((f) => readFileSync(f, "utf8")).join("\n");
    for (const n of names) expect(all, n).toContain(`"${n}"`);
  });
});
