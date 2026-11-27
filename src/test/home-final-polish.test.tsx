import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ to, children, ...rest }: { to: string; children: ReactNode }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("@tanstack/react-router", async (orig) => ({
  ...(await orig<typeof import("@tanstack/react-router")>()),
  Link: ({ to, children, className }: { to: string; children: ReactNode; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));
vi.mock("@/components/shell/useNavMode", () => ({ useNavMode: () => ({ mode: "free" }) }));
vi.mock("@/lib/usePreviews", () => ({
  usePreviews: () => ({ status: "unavailable", data: null }),
}));
vi.mock("@/lib/premium-summary", async (orig) => ({
  ...(await orig<typeof import("@/lib/premium-summary")>()),
  usePremiumSummary: () => null,
}));

import { Route } from "@/routes/index";
import { BRAND } from "@/config/brand";

afterEach(cleanup);
const Home = Route.options.component as () => ReactNode;

describe("anonymous home page, final structure", () => {
  it("has the seven approved sections in order, one h1, and the free-first CTA", () => {
    const { container } = render(<Home />);
    const ids = [...container.querySelectorAll("section[aria-labelledby]")].map((s) =>
      s.getAttribute("aria-labelledby"),
    );
    expect(ids).toEqual(["home-h1", "steps-h", "variety-h", "keepsake-h", "invite-h", "faq-h"]);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const primary = screen.getAllByRole("link", { name: BRAND.hero.primaryCtaFree });
    expect(primary[0]!.getAttribute("href")).toBe("/discover");
    expect(container.textContent).toContain("One payment of $19.99. Yours to keep.");
    expect(container.textContent).toContain("No subscription. No renewals.");
    expect(container.textContent).toContain(BRAND.freeOption);
    expect(container.textContent).toContain("The full Adventure Passport — $19.99 once.");
  });
  it("renders no tester section while there are no approved notes", () => {
    render(<Home />);
    expect(screen.queryByTestId("early-testers")).toBeNull();
    expect(document.body.textContent).not.toMatch(/early testers/i);
  });
  it("uses none of the retired plan language", () => {
    render(<Home />);
    expect(document.body.textContent).not.toMatch(
      /free plan|premium plan|membership|\btier\b|monthly access|subscribe/i,
    );
  });
});
