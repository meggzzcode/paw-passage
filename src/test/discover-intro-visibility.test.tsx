import type React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import { freeLibrary } from "@/passport/content";
import { _resetForTests, revealStarter, setStarter } from "@/passport/local-store";
import { ACCOUNT_FLAG } from "@/passport/premium-client";

vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ to, children, ...rest }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({ status: "free", premium: [], signedIn: false, csrf: "", message: null }),
}));

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

const intro = () => screen.queryByTestId("discover-intro");
const page = () => render(<DiscoverPage mode="made" onMode={() => {}} />);

describe("the public /discover explainer", () => {
  it("stays for an anonymous visitor who has not revealed anything", () => {
    page();
    expect(intro()).not.toBeNull();
  });
  it("is gone once the visitor revealed their free adventure", async () => {
    page();
    expect(intro()).not.toBeNull();
    act(() => {
      setStarter(freeLibrary()[0]!.id);
      revealStarter();
    });
    expect(intro()).toBeNull();
  });
  it("is not rendered for a browser that holds an account flag", () => {
    window.localStorage.setItem(ACCOUNT_FLAG, "1");
    page();
    expect(intro()).toBeNull();
  });
});
