import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterContextProvider } from "@tanstack/react-router";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const calls: { fn: string; args: unknown[] }[] = [];
const once = new Set<string>();
vi.mock("@/lib/analytics", async (orig) => {
  const actual = await orig<typeof import("@/lib/analytics")>();
  return {
    ...actual,
    trackTool: (...args: unknown[]) => void calls.push({ fn: "trackTool", args }),
    trackToolOnce: (event: string, params: { tool: string; label?: string }) => {
      const key = `${event}:${params.tool}:${params.label ?? ""}`;
      if (once.has(key)) return false;
      once.add(key);
      calls.push({ fn: "trackToolOnce", args: [event, params] });
      return true;
    },
    trackProductClick: (...args: unknown[]) => void calls.push({ fn: "trackProductClick", args }),
  };
});

import { routeTree } from "@/routeTree.gen";
import { PackingPlanner } from "@/components/packing/PackingPlanner";
import { EVENT_VOCABULARY } from "@/lib/analytics";

const router = createRouter({
  routeTree,
  history: createMemoryHistory({ initialEntries: ["/tools/packing-list"] }),
  context: { queryClient: new QueryClient() } as never,
});
const mount = () =>
  render(
    <RouterContextProvider router={router}>
      <PackingPlanner />
    </RouterContextProvider>,
  );
const events = () => calls.map((c) => c.args[0] as string);
const item = (id: string) => document.getElementById(`item-${id}`)!;

beforeEach(() => {
  calls.length = 0;
  once.clear();
  localStorage.clear();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});
afterEach(() => cleanup());

describe("packing planner analytics", () => {
  it("sends only aggregate, predefined events and never what the visitor typed", async () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Build my packing list" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Add your own item" }), {
      target: { value: "Rex's heart medicine SECRET" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    fireEvent.click(within(item("bowl")).getByRole("checkbox", { name: /^Packed:/ }));
    fireEvent.click(within(item("bowl")).getByRole("checkbox", { name: /^Need to buy:/ }));
    fireEvent.click(screen.getByRole("button", { name: "Edit trip" }));
    fireEvent.click(screen.getByRole("button", { name: "Update my packing list" }));
    fireEvent.click(screen.getByRole("button", { name: "Copy my list" }));
    vi.spyOn(window, "print").mockImplementation(() => {});
    fireEvent.click(screen.getByRole("button", { name: "Print my list" }));
    await Promise.resolve();
    const names = events();
    expect(names).toEqual(
      expect.arrayContaining([
        "tool_start",
        "tool_complete",
        "packing_custom_added",
        "packing_item_packed",
        "packing_item_need_to_buy",
        "packing_recommendation_opened",
        "packing_trip_edited",
        "tool_copy",
        "tool_print",
      ]),
    );
    const all = JSON.stringify(calls);
    expect(all).not.toMatch(/Rex|SECRET|medicine/);
    for (const c of calls) {
      const params = c.args[1] as { tool: string; label?: string; count?: number } | undefined;
      if (c.fn !== "trackProductClick") expect(params?.tool).toBe("packing-builder");
      if (params?.label) expect(params.label).toMatch(/^[a-z0-9-]{1,40}$/);
    }
    // item events carry the content id, custom items only the word "custom"
    expect(calls.find((c) => c.args[0] === "packing_item_packed")!.args[1]).toMatchObject({
      label: "bowl",
    });
    expect(calls.find((c) => c.args[0] === "packing_custom_added")!.args[1]).toEqual({
      tool: "packing-builder",
    });
  });

  it("does not repeat events on re-render, and fires start and recommendation-opened once", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Build my packing list" }));
    const bowlBuy = () => within(item("bowl")).getByRole("checkbox", { name: /^Need to buy:/ });
    fireEvent.click(bowlBuy());
    fireEvent.click(bowlBuy());
    fireEvent.click(bowlBuy());
    expect(events().filter((e) => e === "tool_start")).toHaveLength(1);
    expect(events().filter((e) => e === "packing_recommendation_opened")).toHaveLength(1);
    expect(events().filter((e) => e === "packing_item_need_to_buy")).toHaveLength(2);
    const before = calls.length;
    fireEvent.click(within(item("leash")).getByRole("button", { name: /Why bring this\?/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Food and water/ }));
    expect(calls.length).toBe(before);
  });

  it("tracks a product link click with the existing product_click path", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Build my packing list" }));
    fireEvent.click(within(item("bowl")).getByRole("checkbox", { name: /^Need to buy:/ }));
    const cta = item("bowl").querySelector("a.gearcard-cta") as HTMLAnchorElement;
    cta.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(cta);
    const click = calls.find((c) => c.fn === "trackProductClick")!;
    expect(click.args[0]).toMatchObject({
      product: "kurgo-collaps-a-bowl",
      partner: "Amazon Associates",
    });
  });

  it("uses only events that exist in the vocabulary", () => {
    const src = ["PackingPlanner", "Shopping", "Checklist"]
      .map((f) => readFileSync(`src/components/packing/${f}.tsx`, "utf8"))
      .join("\n");
    const used = [...src.matchAll(/track(?:Tool|ToolOnce)\(\s*"([a-z_]+)"/g)].map((m) => m[1]!);
    expect(used.length).toBeGreaterThan(8);
    for (const name of used) expect(Object.keys(EVENT_VOCABULARY), name).toContain(name);
  });

  it("a failing analytics call never breaks the page", () => {
    window.gtag = () => {
      throw new Error("blocked");
    };
    try {
      mount();
      expect(() =>
        fireEvent.click(screen.getByRole("button", { name: "Build my packing list" })),
      ).not.toThrow();
    } finally {
      delete window.gtag;
    }
  });
});
