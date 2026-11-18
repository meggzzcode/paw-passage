import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

vi.mock("@/config/site", () => ({ site: { ga4MeasurementId: "G-TEST1234" } }));

import {
  EVENT_VOCABULARY,
  stripUrl,
  trackAccommodationReferral,
  trackHubCardClick,
  trackOutboundClick,
  trackOutbound,
  trackProductClick,
  trackTool,
} from "@/lib/analytics";

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
  it("strips query strings and fragments from outbound addresses", () => {
    expect(stripUrl("https://example.com/a/b?email=me@x.com&q=secret#frag")).toBe(
      "example.com/a/b",
    );
    expect(stripUrl("not a url")).toBe("");
  });
  it("outbound click sends host and path only", () => {
    trackOutboundClick({ url: "https://maker.example/p?utm=1&name=Rex", page: "/guides/a" });
    expect(calls[0]?.[1]).toBe("outbound_click");
    expect(JSON.stringify(calls[0])).not.toContain("Rex");
  });
  it("every emitted event name and parameter is in the vocabulary", () => {
    trackOutbound({ stay: "s", partner: "Vrbo", url: "https://v", page: "/p" });
    trackProductClick({ product: "p", partner: "maker website", url: "https://v", page: "/p" });
    trackHubCardClick({ hub: "gear", card: "car", page: "/gear" });
    trackOutboundClick({ url: "https://v/x", page: "/p" });
    trackAccommodationReferral({ partner: "Stay22", url: "https://v/x", page: "/p" });
    trackTool("tool_start", { tool: "packing" });
    expect(calls).toHaveLength(6);
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
    expect(trackHubCardClick({ hub: "g", card: "c", page: "/" })).toBe(false);
  });
  it("docs/ANALYTICS-SETUP.md lists every event in the vocabulary", () => {
    const doc = readFileSync(join(process.cwd(), "docs/ANALYTICS-SETUP.md"), "utf8");
    for (const name of Object.keys(EVENT_VOCABULARY)) expect(doc, name).toContain("`" + name + "`");
  });
});
