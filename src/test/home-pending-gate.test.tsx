// A returning customer must never see the sales home, even for a frame: the visitor home stays hidden (CSS) until it is
// confirmed (free) or has left the DOM (returning home swapped in). Measured once with the real server: 20 ms of a visible sales page.
import { readFileSync } from "node:fs";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const nav = vi.hoisted(() => ({ mode: "loading" as string }));
vi.mock("@/components/shell/useNavMode", () => ({ useNavMode: () => ({ mode: nav.mode }) }));
import { HomePendingGate, HOME_PENDING_ATTR } from "@/components/shell/HomePendingGate";

const root = document.documentElement;
beforeEach(() => {
  root.setAttribute(HOME_PENDING_ATTR, "1");
  document.body.innerHTML = "";
});
afterEach(() => {
  cleanup();
  root.removeAttribute(HOME_PENDING_ATTR);
});

describe("CSS and inline script contract", () => {
  it("hides the visitor home from the first frame by its own attribute, set only for a flagged browser", () => {
    const css = readFileSync("src/design/collections-v8.css", "utf8");
    expect(css).toMatch(/html\[data-home-pending\] \.pp-home-visitor/);
    expect(css).toMatch(/html\[data-acct\] \.pp-home-visitor/);
    const rule = css.slice(css.indexOf("html[data-acct] .pp-home-visitor"));
    expect(rule.slice(0, rule.indexOf("}"))).toMatch(/visibility:\s*hidden/);
    const page = readFileSync("src/routes/__root.tsx", "utf8");
    const script = page.slice(page.indexOf("try{if(window.localStorage.getItem('pp.acct.v1'))"));
    const body = script.slice(0, script.indexOf("catch(e)"));
    expect(body).toContain("data-home-pending");
    expect(body).toContain("data-acct");
    // both attributes sit inside the flag condition, so a free visitor is never hidden
    expect(body.indexOf("data-home-pending")).toBeGreaterThan(body.indexOf("{"));
  });
});

describe("HomePendingGate", () => {
  const pending = () => root.hasAttribute(HOME_PENDING_ATTR);
  it("keeps the page pending while access is being checked", async () => {
    nav.mode = "loading";
    render(<HomePendingGate />);
    expect(pending()).toBe(true);
  });
  it("clears at once when the visitor is confirmed", async () => {
    nav.mode = "free";
    render(<HomePendingGate />);
    expect(pending()).toBe(false);
  });
  it("for a customer: stays pending while the visitor home is still in the page, clears when it is gone", async () => {
    document.body.innerHTML = '<div class="pp-home-visitor">sales</div>';
    nav.mode = "paid";
    render(<HomePendingGate />);
    expect(pending()).toBe(true);
    await act(async () => {
      document.body.innerHTML = "<div>returning</div>";
      await Promise.resolve();
    });
    expect(pending()).toBe(false);
  });
  it("on a page with no visitor home it clears at once", () => {
    nav.mode = "paid";
    render(<HomePendingGate />);
    expect(pending()).toBe(false);
  });
});

describe("tap targets found by the real-browser pass", () => {
  it("quiet link buttons are at least 44px wide as well as tall, and collection title links get a 44px touch area", () => {
    const adv = readFileSync("src/design/adventure.css", "utf8");
    const linkbtn = adv.slice(adv.indexOf(".pa-linkbtn {"));
    expect(linkbtn.slice(0, linkbtn.indexOf("}"))).toMatch(/min-width:\s*44px/);
    const co = readFileSync("src/design/collections-v8.css", "utf8");
    const rule = co.slice(co.indexOf(".co-crow-title a,"));
    expect(rule.slice(0, rule.indexOf("}"))).toMatch(/\.pa-title a[\s\S]*padding-block:\s*0\.7rem/);
  });
});
