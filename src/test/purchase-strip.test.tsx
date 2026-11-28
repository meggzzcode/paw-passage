import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { PurchaseStrip } from "@/components/site/PurchaseStrip";
import { LIBRARY_CLAIM_MIN } from "@/config/brand";
import { libraryLine } from "@/config/commercial";
import { unlockLine } from "@/lib/premium-summary";
import { readFileSync } from "node:fs";

vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ children }: { children: unknown }) => <a href="/x">{children as string}</a>,
}));

afterEach(cleanup);

describe("purchase strip and offer button", () => {
  it("shows three keepsakes, stamps and badges with Full Passport ribbons, all decorative", () => {
    const { container, getByTestId } = render(<PurchaseStrip />);
    expect(container.querySelectorAll("[data-testid=ps-keepsake]")).toHaveLength(3);
    expect(container.querySelectorAll(".ps-art svg").length).toBeGreaterThanOrEqual(3);
    expect(container.innerHTML).toMatch(/Full Passport/);
    for (const ul of container.querySelectorAll("ul.ps-row"))
      expect(ul.getAttribute("aria-hidden")).toBe("true");
    expect(getByTestId("purchase-strip")).toBeTruthy();
  });
  it("the inactive checkout button is aria-disabled and not styled as the primary button", () => {
    const src = readFileSync("src/routes/unlock.tsx", "utf8");
    expect(src).toMatch(
      /className="pp-btn pp-btn-soon"[\s\S]{0,80}disabled[\s\S]{0,40}aria-disabled="true"/,
    );
    expect(src).toMatch(/Checkout opens soon/);
  });
  it("public counts never fall below the claim, and may show 117", () => {
    for (const count of [0, 17, 47, 117]) {
      const lines = [unlockLine(count ? { count, collections: [] } : null), libraryLine(count, 25)];
      for (const t of lines) {
        for (const n of (t.match(/\d+/g) ?? []).map(Number).filter((x) => x !== 25))
          expect(n).toBeGreaterThanOrEqual(LIBRARY_CLAIM_MIN);
      }
    }
    expect(unlockLine({ count: 117, collections: [] })).toMatch(/117 little adventures/);
  });
});
