import { act, cleanup, screen } from "@testing-library/react";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderUi } from "./collections-fixtures";
import { _resetForTests, completeAdventure } from "@/passport/local-store";
import { Route } from "@/routes/our-story";
import { A1 } from "./collections-fixtures";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);

const Page = Route.options.component as () => React.ReactNode;

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

describe("/our-story is the public brand story", () => {
  it("shows the brand story, not the personal timeline, and no memories link without progress", async () => {
    await renderUi(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: "Our Story" })).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/Who publishes this/);
    expect(document.body.textContent).not.toMatch(/Your story starts with the first one/);
    expect(screen.queryByRole("link", { name: /memories in My Passport/ })).toBeNull();
  });

  it("links to the memories in My Passport once there is progress", async () => {
    act(() => {
      completeAdventure(A1.id, 1000);
    });
    await renderUi(<Page />);
    expect(screen.getByRole("link", { name: "See your memories in My Passport" })).toHaveAttribute(
      "href",
      expect.stringContaining("/passport"),
    );
  });

  it("stays noindex", () => {
    const head = Route.options.head!({} as never) as { meta?: Array<Record<string, string>> };
    expect(JSON.stringify(head.meta)).toMatch(/noindex/);
  });
});
