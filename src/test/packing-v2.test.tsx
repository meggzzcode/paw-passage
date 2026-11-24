import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterContextProvider } from "@tanstack/react-router";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { PackingPlanner } from "@/components/packing/PackingPlanner";
import { AMAZON_DISCLOSURE } from "@/content/affiliates";
import { STORAGE_KEY } from "@/lib/packing/storage";

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
const build = () => fireEvent.click(screen.getByRole("button", { name: "Build my packing list" }));
const item = (id: string) => document.getElementById(`item-${id}`)!;
const packedBox = (id: string) =>
  within(item(id)).getByRole("checkbox", { name: /^Packed:/ }) as HTMLInputElement;
const buyBox = (id: string) =>
  within(item(id)).getByRole("checkbox", { name: /^Need to buy:/ }) as HTMLInputElement;
const progress = () => screen.getByTestId("pk-progress-text").textContent;
const live = () => screen.getByTestId("pk-live").textContent;
const extras = () => document.querySelector("[data-ideas]") as HTMLElement | null;
const pickHeading = () =>
  screen.queryByRole("heading", { name: "Things to pick up before you go" });

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("item controls", () => {
  it("'Why bring this?' is a disclosure button; 'Remove from list' is separate and has an accessible name", () => {
    mount();
    build();
    const row = item("bowl");
    const why = within(row).getByRole("button", { name: "Why bring this?" });
    expect(why.getAttribute("aria-expanded")).toBe("false");
    expect(why.querySelector("svg")).toBeTruthy();
    const panelId = why.getAttribute("aria-controls")!;
    expect(document.getElementById(panelId)).toHaveAttribute("hidden");
    fireEvent.click(why);
    expect(why.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById(panelId)).not.toHaveAttribute("hidden");
    const remove = within(row).getByRole("button", {
      name: "Remove from list: Food and water bowls",
    });
    expect(remove.textContent).toBe("Remove from list");
    expect(remove.querySelector("svg")).toBeTruthy();
    expect(remove.className).not.toBe(why.className);
    // the old wording is gone
    expect(row.textContent).not.toMatch(/Why this is included|Not bringing this/);
  });
});

describe("removing and undoing", () => {
  it("shows a polite message and a keyboard-reachable Undo; Undo restores the item with its state; progress follows", () => {
    mount();
    build();
    fireEvent.click(packedBox("throw"));
    const total = Number(/of (\d+)/.exec(progress()!)![1]);
    expect(progress()).toBe(`1 of ${total} items packed`);
    fireEvent.click(
      screen.getByRole("button", { name: "Remove from list: Washable throw for furniture" }),
    );
    // removing is not packing: nothing else changed, the item left the denominator
    expect(item("throw")).toBeNull();
    expect(progress()).toBe(`0 of ${total - 1} items packed`);
    expect(screen.getByTestId("pk-live").getAttribute("aria-live")).toBe("polite");
    expect(live()).toMatch(/Washable throw for furniture removed from your list/);
    const undo = screen.getByRole("button", { name: "Undo" });
    expect(undo.tagName).toBe("BUTTON");
    expect(undo.getAttribute("tabindex")).not.toBe("-1");
    expect(document.activeElement).toBe(undo);
    fireEvent.click(undo);
    expect(item("throw")).not.toBeNull();
    expect(packedBox("throw").checked).toBe(true);
    expect(progress()).toBe(`1 of ${total} items packed`);
    expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();
    expect(live()).toMatch(/back on your list/);
  });

  it("removing does not change Packed or Need to buy on other rows, and the removed section keeps working", () => {
    mount();
    build();
    fireEvent.click(buyBox("bed"));
    fireEvent.click(
      screen.getByRole("button", { name: "Remove from list: Washable throw for furniture" }),
    );
    expect(buyBox("bed").checked).toBe(true);
    expect(packedBox("bed").checked).toBe(false);
    const removed = document.querySelector("[data-removed]") as HTMLElement;
    expect(within(removed).getByText("Removed from your list (1)")).toBeTruthy();
    fireEvent.click(
      within(removed).getByRole("button", { name: /Add back to my list: Washable throw/ }),
    );
    expect(item("throw")).not.toBeNull();
  });

  it("the Undo bar goes away on the next action and after a few seconds", () => {
    vi.useFakeTimers();
    mount();
    build();
    fireEvent.click(
      screen.getByRole("button", { name: "Remove from list: Washable throw for furniture" }),
    );
    expect(screen.queryByRole("button", { name: "Undo" })).not.toBeNull();
    fireEvent.click(packedBox("bowl"));
    expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Remove from list: Waste bags" }));
    expect(screen.queryByRole("button", { name: "Undo" })).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(11000);
    });
    expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();
    // still removed, and still restorable from the removed section
    expect(item("waste-bags")).toBeNull();
    expect(document.querySelector("[data-removed]")).toBeTruthy();
  });

  it("undoes the removal of the visitor's own item at its old position", () => {
    mount();
    build();
    for (const name of ["Frisbee", "Squeaky toy"]) {
      fireEvent.change(screen.getByRole("textbox", { name: "Add your own item" }), {
        target: { value: name },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    }
    fireEvent.click(screen.getByRole("button", { name: "Remove Frisbee" }));
    expect(document.querySelectorAll('[data-custom="true"]')).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    const names = [...document.querySelectorAll('[data-custom="true"] .pk-name')].map(
      (e) => e.textContent,
    );
    expect(names).toEqual(["Frisbee", "Squeaky toy"]);
  });
});

describe("Need to buy answers every time", () => {
  it("state 1: researched products as Gear cards, with the disclosure and an accurate CTA", () => {
    mount();
    build();
    fireEvent.click(buyBox("bowl"));
    const panel = item("bowl").querySelector("[data-shopping]") as HTMLElement;
    expect(panel.getAttribute("data-shopping-state")).toBe("products");
    const cards = panel.querySelectorAll("article.gearcard");
    expect(cards.length).toBeGreaterThanOrEqual(1);
    expect(cards.length).toBeLessThanOrEqual(2);
    expect(panel.textContent).toContain(AMAZON_DISCLOSURE);
    expect(panel.querySelector("a.gearcard-cta")!.textContent).toContain("View at Amazon");
    expect(live()).toMatch(/added to your shopping list/);
  });

  it("state 2: a light category pointer with a real Gear category route", () => {
    mount();
    build();
    fireEvent.click(buyBox("water"));
    const panel = item("water").querySelector("[data-shopping]") as HTMLElement;
    expect(panel.getAttribute("data-shopping-state")).toBe("category");
    expect(panel.textContent).toContain("Looking for a travel water bowl or bottle?");
    expect(panel.textContent).toContain(
      "We don't have a specific pick for this yet, but you can explore related travel gear.",
    );
    expect(panel.querySelector(".gearcard")).toBeNull();
    const link = within(panel).getByRole("link", { name: /^Explore .* gear$/ });
    expect(link.getAttribute("href")).toBe("/gear/feeding-and-hydration");
    expect(link.textContent).toBe("Explore bowls, bottles and food storage gear");
    // a Gear category link is not an affiliate link: no commercial notice
    expect(panel.textContent).not.toContain(AMAZON_DISCLOSURE);
    // the pick-up list says there is no specific pick yet and links to the category
    const row = document.querySelector("[data-pick-row='water']") as HTMLElement;
    expect(row.textContent).toContain("No specific pick yet.");
    expect(row.querySelector("a[href='/gear/feeding-and-hydration']")).toBeTruthy();
  });

  it("state 3: a discreet note, not a card, and nothing promotional in the pick-up list", () => {
    mount();
    build();
    fireEvent.click(buyBox("treats"));
    const note = item("treats").querySelector("[data-shopping]") as HTMLElement;
    expect(note.getAttribute("data-shopping-state")).toBe("none");
    expect(note.textContent).toBe(
      "Added to your shopping list.We don't have a matching product recommendation for this item yet.",
    );
    expect(note.querySelector("a, button, article")).toBeNull();
    const pick = pickHeading()!.closest("section")!;
    expect(pick.textContent).not.toContain(AMAZON_DISCLOSURE);
    expect(pick.textContent).toContain("No recommendation yet.");
  });

  it("state 4: the visitor's own item can be marked to buy, is never matched to a product, and appears in the list", () => {
    mount();
    build();
    fireEvent.change(screen.getByRole("textbox", { name: "Add your own item" }), {
      target: { value: "Dog bowl" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    const row = document.querySelector('[data-custom="true"]') as HTMLElement;
    fireEvent.click(within(row).getByRole("checkbox", { name: "Need to buy: Dog bowl" }));
    expect(row.querySelector("[data-shopping-state='none']")).toBeTruthy();
    expect(row.querySelector(".gearcard, a")).toBeNull();
    const pick = pickHeading()!.closest("section")!;
    expect(within(pick).getByText("Dog bowl")).toBeTruthy();
    expect(pick.textContent).not.toContain(AMAZON_DISCLOSURE);
  });

  it("never renders an empty panel: every item that can be bought gets a non-empty answer", () => {
    mount();
    build();
    const boxes = [
      ...document.querySelectorAll<HTMLInputElement>(".pk-item input[aria-label^='Need to buy']"),
    ];
    expect(boxes.length).toBeGreaterThan(10);
    for (const b of boxes) fireEvent.click(b);
    for (const li of document.querySelectorAll(".pk-item")) {
      const panel = li.querySelector("[data-shopping]");
      expect(panel, li.id).toBeTruthy();
      expect(panel!.textContent!.trim().length, li.id).toBeGreaterThan(20);
    }
    // one disclosure sentence in the pick-up list, however many commercial links there are
    const pick = pickHeading()!.closest("section")!;
    expect(pick.textContent!.split(AMAZON_DISCLOSURE).length - 1).toBe(1);
  });

  it("an empty shopping list shows nothing promotional", () => {
    mount();
    build();
    expect(pickHeading()).toBeNull();
    expect(document.querySelector(".pk-notice")).toBeNull();
  });
});

describe("A few extras worth considering", () => {
  it("sits after the checklist and before 'Things to pick up before you go'", () => {
    mount();
    build();
    fireEvent.click(buyBox("bowl"));
    const ex = extras()!;
    expect(
      within(ex).getByRole("heading", { name: "A few extras worth considering" }),
    ).toBeTruthy();
    expect(ex.textContent).toContain("Depending on your plans, these might make the trip easier.");
    const checklist = document.querySelector(".pk-checklist")!;
    const pick = pickHeading()!.closest("section")!;
    expect(checklist.compareDocumentPosition(ex) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(ex.compareDocumentPosition(pick) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("shows a few relevant ideas with a name, one sentence and an Add button, visible without opening anything", () => {
    mount();
    build();
    const ex = extras()!;
    expect(ex.closest("details")).toBeNull();
    const rows = ex.querySelectorAll("li.pk-extra");
    expect(rows.length).toBeGreaterThanOrEqual(2);
    expect(rows.length).toBeLessThanOrEqual(4);
    for (const r of rows) {
      expect(r.querySelector(".pk-extra-ico svg")).toBeTruthy();
      expect(r.querySelector(".pk-extra-name")!.textContent).toBeTruthy();
      expect(r.querySelector(".pk-extra-what")!.textContent).toMatch(/\.$/);
      expect(r.querySelector("button")!.textContent).toBe("Add to my list");
    }
    // no snow gear on a cabin trip without cold weather, no GPS, no ramp
    expect(ex.textContent).not.toMatch(/boots|GPS|Ramp/i);
  });

  it("'Add to my list' adds the packing item, keeps state, and does not mark Need to buy or open a product card", () => {
    mount();
    build();
    fireEvent.click(packedBox("bowl"));
    const total = Number(/of (\d+)/.exec(progress()!)![1]);
    fireEvent.click(
      within(extras()!).getByRole("button", { name: "Add to my list: Pet gate for a doorway" }),
    );
    const row = item("pet-gate");
    expect(row).not.toBeNull();
    expect(buyBox("pet-gate").checked).toBe(false);
    expect(row.querySelector("[data-shopping], .gearcard")).toBeNull();
    expect(progress()).toBe(`1 of ${total + 1} items packed`);
    expect(packedBox("bowl").checked).toBe(true);
    expect(extras()?.querySelector("[data-extra='pet-gate']") ?? null).toBeNull();
    expect(pickHeading()).toBeNull();
    // removable later, and Undo works for it too
    fireEvent.click(
      within(row).getByRole("button", { name: "Remove from list: Pet gate for a doorway" }),
    );
    expect(item("pet-gate")).toBeNull();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).items["pet-gate"]).toMatchObject({
      added: true,
      excluded: true,
    });
  });

  it("'See more packing ideas' reveals the rest in place, with no page change", () => {
    mount();
    // a road trip with cold weather and hiking has more than four extras
    fireEvent.click(screen.getByRole("radio", { name: /Road trip/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Hiking or outdoors/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Cold or snowy weather/ }));
    build();
    const ex = extras()!;
    const before = ex.querySelectorAll("li.pk-extra").length;
    expect(before).toBe(4);
    const more = within(ex).getByRole("button", { name: "See more packing ideas" });
    expect(more.getAttribute("aria-expanded")).toBe("false");
    const path = window.location.pathname;
    fireEvent.click(more);
    expect(more.getAttribute("aria-expanded")).toBe("true");
    expect(ex.querySelectorAll("li.pk-extra").length).toBeGreaterThan(before);
    expect(window.location.pathname).toBe(path);
    expect(within(ex).getByRole("button", { name: "Show fewer ideas" })).toBeTruthy();
  });

  it("a beach trip offers a life jacket and no snow boots", () => {
    mount();
    fireEvent.click(screen.getByRole("radio", { name: /Beach or lake/ }));
    build();
    const ex = extras()!;
    expect(ex.querySelector("[data-extra='life-jacket']")).toBeTruthy();
    const more = within(ex).queryByRole("button", { name: "See more packing ideas" });
    if (more) fireEvent.click(more);
    expect(ex.querySelector("[data-extra='boots']")).toBeNull();
    expect(ex.textContent).not.toMatch(/snow/i);
  });

  it("an older dog does not put a ramp on the list; it is only offered, on a driving trip", () => {
    mount();
    fireEvent.click(screen.getByRole("radio", { name: /Road trip/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Older dog/ }));
    build();
    expect(item("ramp")).toBeNull();
    const more = within(extras()!).queryByRole("button", { name: "See more packing ideas" });
    if (more) fireEvent.click(more);
    expect(extras()!.querySelector("[data-extra='ramp']")).toBeTruthy();
  });

  it("opens the Gear collection for the trip: link targets, per trip type", () => {
    const expected: Record<string, string | null> = {
      "Cabin or vacation rental": "/gear?trip=cabin-stay#trip-collection",
      "Road trip": "/gear?trip=road-trip#trip-collection",
      "Beach or lake getaway": "/gear?trip=beach-and-lake#trip-collection",
      "Camping or hiking trip": "/gear?trip=hiking#trip-collection",
      "Other getaway": "/gear",
    };
    for (const [label, href] of Object.entries(expected)) {
      cleanup();
      localStorage.clear();
      mount();
      fireEvent.click(screen.getByRole("radio", { name: new RegExp(label) }));
      build();
      const link = within(extras()!).getByRole("link", { name: "Explore more travel gear" });
      expect(link.getAttribute("href"), label).toBe(href);
    }
  });
});

describe("the list persists for Back from Gear", () => {
  it("everything the visitor did is in localStorage before they follow the Gear link", () => {
    mount();
    build();
    fireEvent.click(packedBox("bowl"));
    fireEvent.click(buyBox("water"));
    fireEvent.click(
      within(extras()!).getByRole("button", { name: "Add to my list: Pet gate for a doorway" }),
    );
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.items.bowl.packed).toBe(true);
    expect(saved.items.water.buy).toBe(true);
    expect(saved.items["pet-gate"].added).toBe(true);
    cleanup();
    mount();
    expect(packedBox("bowl").checked).toBe(true);
    expect(buyBox("water").checked).toBe(true);
    expect(item("pet-gate")).not.toBeNull();
  });
});
