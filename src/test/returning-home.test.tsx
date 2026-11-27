import type React from "react";
import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderUi } from "./collections-fixtures";
import { _resetForTests } from "@/passport/local-store";
import { ACCOUNT_FLAG } from "@/passport/premium-client";
import { Route } from "@/routes/index";

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

const Home = Route.options.component as () => React.ReactNode;

beforeEach(() => {
  ent.status = "free";
  window.localStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

const priceOrPitch = /\$\d|Get the (full )?Passport|Restore access|first adventure|free adventure/i;

describe("home page by access state", () => {
  it("anonymous: the sales page (hero, price, purchase link, restore access is in the header)", async () => {
    await renderUi(<Home />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/little adventures/i);
    expect(
      screen.getAllByRole("link", { name: /Find our first adventure/ }).length,
    ).toBeGreaterThan(0);
    expect(document.body.textContent).toMatch(/\$19\.99/);
    expect(screen.getAllByRole("link", { name: /Get the Passport/ }).length).toBeGreaterThan(0);
  });

  it("entitled: a short welcome, Find today's adventure, quiet links, and no price, purchase, free pitch or restore", async () => {
    window.localStorage.setItem(ACCOUNT_FLAG, "1");
    ent.status = "entitled";
    await renderUi(<Home />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("What shall we do today?");
    expect(screen.getByRole("link", { name: "Find today's adventure" })).toHaveAttribute(
      "href",
      "/discover",
    );
    expect(screen.getByRole("link", { name: "Collections" })).toHaveAttribute(
      "href",
      "/collections",
    );
    expect(screen.getByRole("link", { name: "Saved" })).toHaveAttribute(
      "href",
      expect.stringContaining("tab=favorites"),
    );
    expect(screen.getByRole("link", { name: "My Passport" })).toHaveAttribute("href", "/passport");
    expect(document.body.textContent).not.toMatch(priceOrPitch);
    expect(screen.queryByRole("link", { name: /unlock|restore/i })).toBeNull();
    expect(document.querySelector('a[href="/unlock"]')).toBeNull();
  });

  it("loading (flag set, answer pending): neutral skeleton, neither page", async () => {
    window.localStorage.setItem(ACCOUNT_FLAG, "1");
    ent.status = "checking";
    await renderUi(<Home />);
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(document.body.textContent).not.toMatch(/\$\d|Get the Passport/);
  });

  it("offline with the flag: still no purchase pitch", async () => {
    window.localStorage.setItem(ACCOUNT_FLAG, "1");
    ent.status = "offline";
    await renderUi(<Home />);
    expect(document.body.textContent).not.toMatch(priceOrPitch);
  });

  it("hides the visitor page from the first frame for a returning browser (data-acct) and leaves it alone otherwise", async () => {
    const { readFileSync } = await import("node:fs");
    const css = readFileSync("src/design/collections-v8.css", "utf8");
    expect(css).toMatch(/html\[data-acct\] \.pp-home-visitor\s*\{\s*visibility: hidden/);
  });
});
