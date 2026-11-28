import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { offer } from "@/config/site";
import { LIBRARY_CLAIM_MIN } from "@/config/brand";
import { libraryLine } from "@/config/commercial";
import {
  fetchPremiumSummary,
  summaryText,
  unlockLine,
  SUMMARY_FALLBACK,
} from "@/lib/premium-summary";
import { PhotoFilterExamples } from "@/components/site/PhotoFilterExamples";
import { TrustBlock } from "@/components/passport/TrustBlock";
import { StampsAndMilestones } from "@/components/passport/PassportRewards";
import { tagChips } from "@/components/passport/labels";
import { adventures, collections as allCollections, stamps } from "@/passport/content";

vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ children }: { children: unknown }) => <a href="/x">{children as string}</a>,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("offer and premium summary", () => {
  it("has one price constant and honest pricing text", () => {
    expect(offer.price).toBe("$19.99");
    expect(offer.pricing).toBe("one-time purchase, no subscription");
    expect(readFileSync("docs/COWORK-HANDOFF.md", "utf8")).toMatch(
      /must (equal|match)[^.]*Gumroad/i,
    );
  });
  it("keeps no intro price or old price anywhere in the app source or docs", () => {
    const files = [
      "src/config/site.ts",
      "src/routes/index.tsx",
      "src/routes/unlock.tsx",
      "docs/COWORK-HANDOFF.md",
      "docs/DECISIONS.md",
      "docs/PRODUCT-SPEC.md",
    ];
    for (const f of files) expect(readFileSync(f, "utf8")).not.toMatch(/14\.99|introductory/i);
  });
  it("builds the live unlock line from the summary, with an honest fallback", () => {
    expect(
      unlockLine({
        count: 120,
        collections: [
          { slug: "a", count: 60 },
          { slug: "b", count: 60 },
        ],
      }),
    ).toMatch(
      new RegExp(
        `^Unlock 120 little adventures across ${allCollections.length} collections, for every kind of dog: puppies, seniors`,
      ),
    );
    expect(unlockLine(null)).toMatch(/^Unlock a much larger library/);
    expect(unlockLine(null)).not.toMatch(/\d/);
  });
  it("never prints a library number below the approved claim, whatever the summary says", () => {
    for (const count of [1, 17, 47, 99]) {
      const s = { count, collections: [] };
      const lines = [unlockLine(s), summaryText(s), libraryLine(count, 25)];
      for (const t of lines) {
        const nums = (t.match(/\d+/g) ?? []).map(Number).filter((n) => n !== 25);
        for (const n of nums) expect(n).toBeGreaterThanOrEqual(LIBRARY_CLAIM_MIN);
        expect(t).not.toMatch(new RegExp(`\\b${count}\\b`));
      }
      expect(unlockLine(s)).toMatch(/^Unlock 100\+ little adventures/);
    }
    const big = { count: 117, collections: [] };
    expect(unlockLine(big)).toMatch(/^Unlock 117 little adventures/);
    expect(libraryLine(117, 25)).toMatch(/^117 adventures/);
  });
  it("formats the count, and falls back honestly", () => {
    expect(summaryText(null)).toBe(SUMMARY_FALLBACK);
    expect(
      summaryText({
        count: 120,
        collections: [
          { slug: "a", count: 60 },
          { slug: "b", count: 60 },
        ],
      }),
    ).toBe(`120 premium adventures across ${allCollections.length} collections`);
  });
  it("returns null on any failure or a bad shape", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("x")));
    expect(await fetchPremiumSummary()).toBeNull();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    expect(await fetchPremiumSummary()).toBeNull();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ count: "9" }) }),
    );
    expect(await fetchPremiumSummary()).toBeNull();
  });
  it("reads a good summary", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ count: 5, collections: [{ slug: "x", count: 5 }] }),
      }),
    );
    expect(await fetchPremiumSummary()).toEqual({
      count: 5,
      collections: [{ slug: "x", count: 5 }],
    });
  });
});

describe("filter examples slot", () => {
  it("renders nothing when empty and images when given", () => {
    const { container, rerender } = render(<PhotoFilterExamples images={[]} />);
    expect(container.innerHTML).toBe("");
    rerender(<PhotoFilterExamples images={["/examples/a.jpg"]} />);
    expect(container.querySelectorAll("img")).toHaveLength(1);
  });
});

describe("trust block", () => {
  it("states where data lives in plain words", () => {
    render(<TrustBlock />);
    const t = document.body.textContent ?? "";
    for (const w of [
      "saved on your device",
      "Export a backup",
      "Photos never leave",
      "sync",
      "purchase code",
    ])
      expect(t).toContain(w);
  });
});

describe("stamps", () => {
  it("shows earned stamps first, then the stamps still to earn, all in full colour", () => {
    const { container } = render(
      <StampsAndMilestones
        earnedStamps={[stamps[0]!.slug]}
        earnedMilestones={[1]}
        collectionsComplete={0}
        entitled
      />,
    );
    expect(container.querySelectorAll('svg[data-art="stamp"][data-state="earned"]')).toHaveLength(
      1,
    );
    expect(container.querySelectorAll('svg[data-art="stamp"][data-state="next"]')).toHaveLength(1);
    expect(screen.getByText(/1 of 12 collected/)).toBeTruthy();
  });
  it("never patronises slow, senior or apartment dogs", () => {
    for (const s of stamps)
      expect(`${s.blurb} ${s.rule}`).not.toMatch(/push|limits|only the|hardcore|beat/i);
  });
});

describe("tag chips", () => {
  it("never exceeds four", async () => {
    await waitFor(() => expect(adventures.length).toBeGreaterThan(0));
    for (const a of adventures) expect(tagChips(a).length).toBeLessThanOrEqual(4);
  });
});
