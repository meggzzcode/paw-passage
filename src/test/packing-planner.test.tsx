import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterContextProvider } from "@tanstack/react-router";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { PackingPlanner } from "@/components/packing/PackingPlanner";
import { packingConfig as cfg } from "@/content/packing";
import { AMAZON_DISCLOSURE, getApprovedLink } from "@/content/affiliates";
import { getProduct } from "@/content/gear";
import { productLinkId } from "@/content/affiliate-usage";
import { LEGACY_KEY, STORAGE_KEY } from "@/lib/packing/storage";

const router = createRouter({
  routeTree,
  history: createMemoryHistory({ initialEntries: ["/tools/packing-list"] }),
  context: { queryClient: new QueryClient() } as never,
});
const ui = (props: Parameters<typeof PackingPlanner>[0] = {}) => (
  <RouterContextProvider router={router}>
    <PackingPlanner {...props} />
  </RouterContextProvider>
);
const mount = (props?: Parameters<typeof PackingPlanner>[0]) => render(ui(props));

const build = () => fireEvent.click(screen.getByRole("button", { name: "Build my packing list" }));
const item = (id: string) => document.getElementById(`item-${id}`)!;
const packedBox = (id: string) =>
  within(item(id)).getByRole("checkbox", { name: /^Packed:/ }) as HTMLInputElement;
const buyBox = (id: string) =>
  within(item(id)).getByRole("checkbox", { name: /^Need to buy:/ }) as HTMLInputElement;
const radioTag = (html: string, value: string) =>
  html.match(new RegExp(`<input[^>]*type="radio"[^>]*value="${value}"[^>]*>`))![0];
const progress = () => screen.getByTestId("pk-progress-text").textContent;

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});
afterEach(() => cleanup());

describe("packing planner: server render and setup", () => {
  it("renders the setup first, with no personal state or list in the HTML", () => {
    const html = renderToString(ui());
    expect(html).toContain("First, tell us about your trip.");
    expect(html).toContain("A few quick details make your list more useful.");
    expect(html).toContain("Build my packing list");
    expect(html).toContain("Anything else we should plan for?");
    expect(html).not.toMatch(/items packed|Things to pick up|Need to buy|Amazon Associate/);
    // Cabin is the stated default for direct visitors.
    expect(radioTag(html, "cabin")).toContain("checked");
    expect(radioTag(html, "road-trip")).not.toContain("checked");
  });

  it("applies a validated guide preset to the setup and renders the same on the server and the client", () => {
    const preset = { tripType: "road-trip", days: 5, dogs: 2 };
    const server = renderToString(ui({ preset }));
    expect(radioTag(server, "road-trip")).toContain("checked");
    expect(server).toContain('value="5"');
    expect(server).toContain("Set up from your link: Road trip, 5 days, 2 dogs.");
    mount({ preset });
    expect((screen.getByRole("radio", { name: /Road trip/ }) as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it("has labelled fieldsets, a labelled stepper with keyboard control, and implied conditions", () => {
    mount();
    expect(screen.getByRole("group", { name: "What kind of trip is it?" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Anything else we should plan for?" })).toBeTruthy();
    const days = screen.getByRole("spinbutton", {
      name: "How many days away?",
    }) as HTMLInputElement;
    expect(days.value).toBe("3");
    fireEvent.keyDown(days, { key: "ArrowUp" });
    expect(days.value).toBe("4");
    fireEvent.change(days, { target: { value: "99" } });
    fireEvent.blur(days);
    expect(days.value).toBe("30");
    expect(screen.getByRole("button", { name: "More days" })).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: /Road trip/ }));
    const driving = screen.getByRole("checkbox", { name: /We're driving/ }) as HTMLInputElement;
    expect(driving.checked).toBe(true);
    expect(driving.disabled).toBe(true);
    const dogs = screen.getByRole("spinbutton", {
      name: "How many dogs are coming?",
    }) as HTMLInputElement;
    fireEvent.change(dogs, { target: { value: "0" } });
    fireEvent.blur(dogs);
    expect(dogs.value).toBe("1");
  });
});

describe("packing planner: building and using the list", () => {
  it("builds a summary, moves focus to it, and counts progress over the active list", () => {
    mount();
    const dogs = screen.getByRole("spinbutton", { name: "How many dogs are coming?" });
    fireEvent.change(dogs, { target: { value: "2" } });
    fireEvent.blur(dogs);
    fireEvent.click(screen.getByRole("checkbox", { name: /Hiking or outdoors/ }));
    build();
    const heading = screen.getByRole("heading", { name: "Your cabin getaway packing list" });
    expect(document.activeElement).toBe(heading);
    expect(screen.getByText("3 days · 2 dogs · Hiking or outdoors")).toBeTruthy();
    expect(
      screen.getByText(
        "Here's what we'd plan to bring. Adjust anything that doesn't fit your trip.",
      ),
    ).toBeTruthy();
    expect(progress()).toMatch(/^0 of \d+ items packed$/);
    const bar = screen.getByRole("progressbar", { name: "Packing progress" });
    expect(bar.getAttribute("aria-valuenow")).toBe("0");
    fireEvent.click(packedBox("bowl"));
    expect(progress()).toMatch(/^1 of \d+ items packed$/);
    expect(bar.getAttribute("aria-valuenow")).toBe("1");
    expect(bar.getAttribute("aria-valuetext")).toMatch(/^1 of \d+ items packed$/);
    expect(within(item("bed")).getByText("2 beds")).toBeTruthy();
    expect(screen.queryByText("Things to pick up before you go")).toBeNull();
  });

  it("shows only categories that have items, in the promised order", () => {
    mount();
    build();
    const heads = [...document.querySelectorAll(".pk-cat-title")].map((e) => e.textContent);
    expect(heads).toEqual([
      "Food and water",
      "Leashes, ID and safety",
      "Sleep and comfort",
      "Outdoor adventures",
      "Health and medication",
      "Cabin and rental essentials",
      "Items you've added",
    ]);
  });

  it("keeps packed, need to buy, details and exclusion separate", () => {
    mount();
    build();
    const row = item("bowl");
    fireEvent.click(buyBox("bowl"));
    expect(packedBox("bowl").checked).toBe(false);
    expect(buyBox("bowl").checked).toBe(true);
    // expanding the explanation does not change either
    const why = within(row).getByRole("button", { name: /Why bring this\?/ });
    expect(why.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(why);
    expect(why.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById(why.getAttribute("aria-controls")!)).not.toHaveAttribute(
      "hidden",
    );
    expect(packedBox("bowl").checked).toBe(false);
    // interacting with the product link or the panel never ticks Packed
    const panel = row.querySelector("[data-shopping]")!;
    fireEvent.click(within(panel as HTMLElement).getAllByRole("link")[0]!);
    expect(packedBox("bowl").checked).toBe(false);
    // both set: both preserved, with an easy way to clear either
    fireEvent.click(packedBox("bowl"));
    expect(buyBox("bowl").checked).toBe(true);
    expect(within(row).getByText("Marked as packed and needing to be bought.")).toBeTruthy();
    fireEvent.click(within(row).getByRole("button", { name: 'Clear "Need to buy"' }));
    expect(buyBox("bowl").checked).toBe(false);
    expect(packedBox("bowl").checked).toBe(true);
  });

  it("removes with 'Remove from list', updates the denominator, and restores", () => {
    mount();
    build();
    const total = Number(/of (\d+)/.exec(progress()!)![1]);
    fireEvent.click(
      screen.getByRole("button", { name: "Remove from list: Washable throw for furniture" }),
    );
    expect(item("throw")).toBeNull();
    expect(progress()).toBe(`0 of ${total - 1} items packed`);
    expect(screen.getByTestId("pk-live").textContent).toMatch(
      /Washable throw for furniture removed/,
    );
    const removed = document.querySelector("[data-removed]") as HTMLElement;
    fireEvent.click(
      within(removed).getByRole("button", {
        name: "Add back to my list: Washable throw for furniture",
      }),
    );
    expect(item("throw")).not.toBeNull();
    expect(progress()).toBe(`0 of ${total} items packed`);
  });

  it("adds, edits and removes custom items without any product suggestion", () => {
    mount();
    build();
    const field = screen.getByRole("textbox", { name: "Add your own item" });
    fireEvent.change(field, { target: { value: "Reusable dog towel" } });
    fireEvent.change(screen.getAllByLabelText("Quantity (optional)")[0]!, {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    const row = document.querySelector('[data-custom="true"]') as HTMLElement;
    expect(row.textContent).toContain("Reusable dog towel");
    expect(row.textContent).toContain("2");
    const total = Number(/of (\d+)/.exec(progress()!)![1]);
    fireEvent.click(within(row).getByRole("checkbox", { name: "Packed: Reusable dog towel" }));
    expect(progress()).toBe(`1 of ${total} items packed`);
    fireEvent.click(within(row).getByRole("checkbox", { name: "Need to buy: Reusable dog towel" }));
    // a custom item gets a quiet note, never a product guessed from its name
    expect(row.querySelector("[data-shopping-state='none']")).toBeTruthy();
    expect(row.querySelector(".gearcard, a[href^='http']")).toBeNull();
    expect(screen.getByText("Things to pick up before you go")).toBeTruthy();
    fireEvent.click(within(row).getByRole("button", { name: "Edit Reusable dog towel" }));
    fireEvent.change(screen.getByLabelText("Item name"), { target: { value: "Blue towel" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(document.querySelector('[data-custom="true"]')!.textContent).toContain("Blue towel");
    fireEvent.click(screen.getByRole("button", { name: "Remove Blue towel" }));
    expect(document.querySelector('[data-custom="true"]')).toBeNull();
    expect(screen.queryByText("Things to pick up before you go")).toBeNull();
  });

  it("lets the visitor change a quantity and return to the suggestion", () => {
    mount();
    build();
    fireEvent.click(
      screen.getByRole("button", { name: "Change quantity for A familiar bed or blanket" }),
    );
    fireEvent.change(screen.getByLabelText("Quantity for A familiar bed or blanket"), {
      target: { value: "1 plus a blanket" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(within(item("bed")).getByText("1 plus a blanket")).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", { name: "Change quantity for A familiar bed or blanket" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Use the suggestion" }));
    expect(within(item("bed")).getByText("1 bed")).toBeTruthy();
  });

  it("collapses a category with an accessible disclosure", () => {
    mount();
    build();
    const toggle = screen.getByRole("button", { name: /^Food and water/ });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.getElementById(toggle.getAttribute("aria-controls")!)).toHaveAttribute(
      "hidden",
    );
  });

  it("offers optional ideas separately and never adds them by itself", () => {
    mount();
    build();
    expect(item("boots")).toBeNull();
    expect(item("pet-gate")).toBeNull();
    const ideas = document.querySelector("[data-ideas]") as HTMLElement;
    fireEvent.click(
      within(ideas).getByRole("button", { name: "Add to my list: Pet gate for a doorway" }),
    );
    expect(item("pet-gate")).not.toBeNull();
    expect(within(item("pet-gate")).getByText("Added by you")).toBeTruthy();
  });

  it("has no nested interactive controls inside a row's label", () => {
    mount();
    build();
    for (const label of document.querySelectorAll(".pk-item label"))
      expect(label.querySelectorAll("button, a, select, textarea").length).toBe(0);
  });
});

describe("packing planner: editing the trip", () => {
  it("keeps what the visitor did and flags newly relevant suggestions", () => {
    mount();
    build();
    fireEvent.click(packedBox("bowl"));
    fireEvent.change(screen.getByRole("textbox", { name: "Add your own item" }), {
      target: { value: "Squeaky toy" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit trip" }));
    expect(screen.getByRole("heading", { name: "Edit your trip." })).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox", { name: /Cold or snowy weather/ }));
    fireEvent.click(screen.getByRole("button", { name: "Update my packing list" }));
    expect(packedBox("bowl").checked).toBe(true);
    expect(document.querySelector('[data-custom="true"]')!.textContent).toContain("Squeaky toy");
    expect(within(item("warm-layer")).getByText("New")).toBeTruthy();
    expect(screen.getByTestId("pk-live").textContent).toMatch(/new suggestion/);
    expect(document.querySelectorAll('[data-item="warm-layer"]')).toHaveLength(1);
  });

  it("can be cancelled without changing anything", () => {
    mount();
    build();
    fireEvent.click(screen.getByRole("button", { name: "Edit trip" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("heading", { name: "Edit your trip." })).toBeNull();
    expect(screen.getByRole("heading", { name: "Your cabin getaway packing list" })).toBeTruthy();
  });
});

describe("packing planner: shopping", () => {
  it("shows no product anywhere until the visitor marks Need to buy", () => {
    mount();
    build();
    expect(document.querySelector("[data-shopping]")).toBeNull();
    expect(document.body.textContent).not.toContain(AMAZON_DISCLOSURE);
    expect(document.body.textContent).not.toContain("Things to pick up before you go");
    expect(document.querySelectorAll("a[href*='amazon']").length).toBe(0);
    expect(document.querySelector("img")).toBeNull();
  });

  it("opens a small panel with at most two options, a caution, the exact Amazon sentence and a matching button", () => {
    mount();
    build();
    fireEvent.click(buyBox("bowl"));
    const panel = document.querySelector("[data-shopping='bowl']") as HTMLElement;
    expect(panel).toBeTruthy();
    expect(
      within(panel).getByText(
        "Need a travel bowl? Here are a couple of researched options to consider.",
      ),
    ).toBeTruthy();
    const cards = panel.querySelectorAll("[data-rec]");
    expect(cards.length).toBe(2);
    expect(cards[0]!.getAttribute("data-role")).toBe("primary");
    expect(cards[1]!.getAttribute("data-role")).toBe("alternative");
    // one notice, above the cards, with Amazon's sentence exactly
    expect(panel.querySelectorAll(".pk-notice").length).toBe(1);
    expect(panel.querySelector(".pk-notice")!.textContent).toContain(AMAZON_DISCLOSURE);
    for (const c of cards) {
      expect(c.textContent).toMatch(/Check: /);
      expect(c.querySelectorAll(".gearcard-fact").length).toBeLessThanOrEqual(3);
      expect(c.textContent).not.toMatch(/\$\d|stars?|best seller|in stock/i);
    }
    // the button matches its destination, and its link comes from the affiliate list (never built here)
    const product = getProduct("kurgo-collaps-a-bowl")!;
    const link = getApprovedLink(productLinkId(product))!;
    const cta = cards[0]!.querySelector("a.gearcard-cta") as HTMLAnchorElement;
    expect(cta.textContent).toBe("View at Amazon");
    expect(cta.getAttribute("href")).toBe(link.url);
    expect(cta.getAttribute("rel")).toBe("sponsored nofollow noopener");
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(
      within(panel).getByRole("link", { name: /See more bowls, bottles and food storage gear/i }),
    ).toBeTruthy();
    // the checklist is still there
    expect(item("leash")).not.toBeNull();
  });

  it("gives items with no product no fake suggestion but still lists them to pick up", () => {
    mount();
    build();
    fireEvent.click(buyBox("food"));
    // not an empty panel, and not a product card: a discreet note
    const note = document.querySelector("[data-shopping='food']") as HTMLElement;
    expect(note.getAttribute("data-shopping-state")).toBe("none");
    expect(note.textContent).toContain("Added to your shopping list.");
    expect(note.textContent).toContain(
      "We don't have a matching product recommendation for this item yet.",
    );
    expect(item("food").querySelector(".gearcard")).toBeNull();
    const pick = screen
      .getByRole("heading", { name: "Things to pick up before you go" })
      .closest("section")!;
    expect(within(pick).getByText("Your dog's usual food")).toBeTruthy();
    expect(pick.querySelector("[data-pick-row='food']")!.textContent).toContain(
      "No recommendation yet.",
    );
    expect(pick.querySelector("[data-pick-row='food'] a[href^='http']")).toBeNull();
    expect(pick.textContent).not.toContain(AMAZON_DISCLOSURE);
  });

  it("builds the consolidated list with packed indicators, links back, a notice and the closing line", () => {
    mount();
    build();
    fireEvent.click(buyBox("bowl"));
    fireEvent.click(buyBox("bed"));
    fireEvent.click(packedBox("bed"));
    const pick = screen
      .getByRole("heading", { name: "Things to pick up before you go" })
      .closest("section")!;
    expect(pick.querySelectorAll("li.pk-pick-row").length).toBe(2);
    expect(
      within(pick).getByRole("link", { name: "Food and water bowls" }).getAttribute("href"),
    ).toBe("#item-bowl");
    expect(pick.querySelector("[data-pick-row='bed']")!.textContent).toContain("Packed");
    expect(pick.querySelector("[data-pick-row='bowl']")!.textContent).not.toContain("Packed");
    expect(pick.textContent).toContain(AMAZON_DISCLOSURE);
    expect(pick.textContent).toContain(
      "You may already have some of these. Only pick up what you actually need.",
    );
    expect(screen.getByTestId("pk-buy-count").textContent).toMatch(/^2 items to buy\./);
    expect(pick.querySelectorAll("a.pk-pick-cta")[0]!.textContent).toBe("View at Amazon");
    // clearing the last need-to-buy removes the whole section
    fireEvent.click(buyBox("bowl"));
    fireEvent.click(buyBox("bed"));
    expect(screen.queryByText("Things to pick up before you go")).toBeNull();
  });

  it("matches suggestions to the trip: a cold trip gets cold boots, a mild trip does not", () => {
    mount();
    fireEvent.click(screen.getByRole("checkbox", { name: /Cold or snowy weather/ }));
    build();
    fireEvent.click(
      within(document.querySelector("[data-ideas]") as HTMLElement).getByRole("button", {
        name: "Add to my list: Dog boots",
      }),
    );
    fireEvent.click(buyBox("boots"));
    const names = [...document.querySelectorAll("[data-shopping='boots'] .gearcard-name")].map(
      (e) => e.textContent,
    );
    expect(names[0]).toMatch(/Polar Trex/);
  });
});

describe("packing planner: saving, reloading and starting over", () => {
  it("restores the list after a reload with packed, buy, custom and excluded state", () => {
    const first = mount();
    build();
    fireEvent.click(packedBox("leash"));
    fireEvent.click(buyBox("bowl"));
    fireEvent.click(
      screen.getByRole("button", { name: "Remove from list: Washable throw for furniture" }),
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Add your own item" }), {
      target: { value: "Frisbee" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    first.unmount();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).v).toBe(2);
    mount();
    expect(screen.getByRole("heading", { name: "Your cabin getaway packing list" })).toBeTruthy();
    expect(packedBox("leash").checked).toBe(true);
    expect(buyBox("bowl").checked).toBe(true);
    expect(item("throw")).toBeNull();
    expect(document.querySelector('[data-custom="true"]')!.textContent).toContain("Frisbee");
    expect(screen.queryByText("First, tell us about your trip.")).toBeNull();
  });

  it("migrates the first version's pp.packing.v1 without discarding it", () => {
    const v1 = JSON.stringify({
      profile: { car: true, rental: true, senior: false, bolter: false, noFence: false },
      packed: ["bowl", "car-restraint"],
    });
    localStorage.setItem(LEGACY_KEY, v1);
    mount();
    expect(screen.getByRole("heading", { name: "Your cabin getaway packing list" })).toBeTruthy();
    expect(packedBox("bowl").checked).toBe(true);
    expect(packedBox("car-restraint").checked).toBe(true);
    expect(screen.getByTestId("pk-live").textContent).toMatch(/earlier list/);
    expect(localStorage.getItem(LEGACY_KEY)).toBe(v1);
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
  });

  it("recovers from malformed saved data with the setup screen", () => {
    localStorage.setItem(STORAGE_KEY, "{broken");
    mount();
    expect(screen.getByText("First, tell us about your trip.")).toBeTruthy();
    expect(screen.getByTestId("pk-live").textContent).toMatch(/could not be read/);
  });

  it("works for the visit when saving is blocked", () => {
    const real = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
    try {
      mount();
      build();
      fireEvent.click(packedBox("bowl"));
      expect(packedBox("bowl").checked).toBe(true);
      expect(document.body.textContent).toContain("blocking saving");
    } finally {
      Storage.prototype.setItem = real;
    }
  });

  it("asks before starting over, and keeps the list if the visitor says no", () => {
    mount();
    build();
    fireEvent.click(packedBox("bowl"));
    fireEvent.click(screen.getByRole("button", { name: "Start over" }));
    const dialog = screen.getByRole("alertdialog");
    expect(dialog.textContent).toMatch(/Start over\?/);
    fireEvent.click(within(dialog).getByRole("button", { name: "Keep my list" }));
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(packedBox("bowl").checked).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Start over" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, start over" }));
    expect(screen.getByText("First, tell us about your trip.")).toBeTruthy();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  });

  it("copies a plain-text list and says so politely", async () => {
    mount();
    build();
    fireEvent.click(packedBox("bowl"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy my list" }));
    });
    const text = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock
      .calls[0]![0] as string;
    expect(text).toContain("Your cabin getaway packing list");
    expect(text).toContain("[x] Food and water bowls (1 bowl set)");
    expect(text).not.toMatch(/amazon|affiliate/i);
    expect(screen.getByTestId("pk-live").textContent).toBe("Your list was copied.");
    expect(screen.getByTestId("pk-live").getAttribute("aria-live")).toBe("polite");
  });

  it("prints through the browser, hiding setup and shopping with the no-print class", () => {
    const spy = vi.spyOn(window, "print").mockImplementation(() => {});
    mount();
    build();
    fireEvent.click(buyBox("bowl"));
    fireEvent.click(screen.getByRole("button", { name: "Print my list" }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[data-shopping]")!.className).toContain("no-print");
    expect(
      screen.getByRole("heading", { name: "Take it with you" }).closest("section")!.className,
    ).toContain("no-print");
    spy.mockRestore();
  });
});

describe("packing planner: presets and saved lists", () => {
  it("asks which to keep when a saved list conflicts with a preset", () => {
    const first = mount();
    build();
    fireEvent.click(packedBox("bowl"));
    first.unmount();
    const handled = vi.fn();
    mount({ preset: { tripType: "cabin", days: 3, dogs: 2 }, onPresetHandled: handled });
    const banner = screen.getByRole("region", { name: "You have a saved list" });
    expect(banner.textContent).toContain("Cabin or vacation rental, 3 days, 2 dogs");
    // the saved list is intact and visible until the visitor decides
    expect(packedBox("bowl").checked).toBe(true);
    fireEvent.click(within(banner).getByRole("button", { name: "Start with this preset" }));
    expect(handled).toHaveBeenCalled();
    expect(
      (screen.getByRole("spinbutton", { name: "How many dogs are coming?" }) as HTMLInputElement)
        .value,
    ).toBe("2");
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Build my packing list" }));
    expect(screen.getByText("3 days · 2 dogs")).toBeTruthy();
    expect(packedBox("bowl").checked).toBe(false);
  });

  it("continues the saved list when asked, and does not ask when the preset matches", () => {
    const first = mount();
    build();
    fireEvent.click(packedBox("bowl"));
    first.unmount();
    mount({ preset: { tripType: "cabin", days: 3, dogs: 1 } });
    expect(screen.queryByRole("region", { name: "You have a saved list" })).toBeNull();
    cleanup();
    mount({ preset: { dogs: 4 } });
    fireEvent.click(screen.getByRole("button", { name: "Continue my saved list" }));
    expect(screen.queryByRole("region", { name: "You have a saved list" })).toBeNull();
    expect(packedBox("bowl").checked).toBe(true);
  });
});
