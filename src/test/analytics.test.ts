import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/site", () => ({ site: { ga4MeasurementId: "G-TEST1234" } }));

import { EVENT_VOCABULARY, trackProductClick, trackTool } from "@/lib/analytics";

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

describe("analytics events", () => {
  it("every emitted event name and parameter is in the vocabulary", () => {
    trackProductClick({ product: "p", partner: "maker website", url: "https://v", page: "/p" });
    trackTool("tool_start", { tool: "packing" });
    expect(calls).toHaveLength(2);
    for (const c of calls) {
      const name = c[1] as keyof typeof EVENT_VOCABULARY;
      const params = Object.keys(c[2] as object).filter((k) => k !== "transport_type");
      expect(EVENT_VOCABULARY[name], String(name)).toBeDefined();
      for (const p of params)
        expect(EVENT_VOCABULARY[name] as readonly string[], `${name}.${p}`).toContain(p);
    }
  });
  it("sends nothing when gtag is missing", () => {
    delete window.gtag;
    expect(trackProductClick({ product: "p", partner: "m", url: "https://v", page: "/p" })).toBe(
      false,
    );
  });
});
