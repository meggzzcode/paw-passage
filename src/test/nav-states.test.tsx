import { cleanup, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderUi } from "./collections-fixtures";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { _resetForTests, revealStarter, setStarter } from "@/passport/local-store";
import { act } from "@testing-library/react";
import { ACCOUNT_FLAG } from "@/passport/premium-client";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);

const ent = vi.hoisted(() => ({ status: "free" as string }));
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({
    status: ent.status,
    premium: [],
    signedIn: ent.status === "entitled",
    csrf: "",
    message: null,
  }),
}));

beforeEach(() => {
  ent.status = "free";
  window.localStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

const nav = () => screen.getByRole("navigation", { name: "Main" });
const labels = () =>
  within(nav())
    .queryAllByRole("link")
    .map((l) => l.textContent);
const header = () => document.querySelector("header")!;

describe("navigation by access state", () => {
  it("free: Home, Explore Adventures, Journal, Our Story, with Get the Passport and a quieter Restore access", async () => {
    await renderUi(<SiteHeader />);
    expect(labels()).toEqual(["Home", "Explore Adventures", "Journal", "Our Story"]);
    expect(within(header()).getByRole("link", { name: "Get the Passport" })).toBeInTheDocument();
    expect(within(header()).getByRole("link", { name: "Restore access" })).toBeInTheDocument();
  });

  it("free with an intro adventure started: adds My First Adventure", async () => {
    act(() => {
      setStarter("adv-aaa222");
      revealStarter();
    });
    await renderUi(<SiteHeader />);
    expect(labels()).toContain("My First Adventure");
    expect(screen.getByRole("link", { name: "My First Adventure" })).toHaveAttribute(
      "href",
      "/discover",
    );
  });

  it("paid: Discover, Collections, My Passport; no purchase action anywhere in the header or footer", async () => {
    ent.status = "entitled";
    await renderUi(
      <>
        <SiteHeader />
        <SiteFooter />
      </>,
    );
    expect(labels()).toEqual(["Discover", "Collections", "My Passport"]);
    expect(screen.queryByRole("link", { name: "Get the Passport" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Restore access" })).toBeNull();
    expect(screen.getByRole("button", { name: /More/ })).toBeInTheDocument();
  });

  it("loading (account flag, answer pending): a neutral skeleton, no free or paid links", async () => {
    window.localStorage.setItem(ACCOUNT_FLAG, "1");
    ent.status = "checking";
    await renderUi(<SiteHeader />);
    expect(nav()).toHaveAttribute("aria-busy", "true");
    expect(labels()).toEqual([]);
    expect(screen.queryByRole("link", { name: "Get the Passport" })).toBeNull();
  });

  it("error (flag set, could not reach the site): no purchase action, a retry", async () => {
    window.localStorage.setItem(ACCOUNT_FLAG, "1");
    ent.status = "offline";
    await renderUi(<SiteHeader />);
    expect(screen.queryByRole("link", { name: "Get the Passport" })).toBeNull();
    expect(screen.getByRole("button", { name: "Retry access check" })).toBeInTheDocument();
  });
});
