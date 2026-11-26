import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { A1, A2, renderUi } from "./collections-fixtures";
import { AdventureCard, MysteryCard } from "@/components/passport/AdventureCard";
import { StoryTimeline } from "@/components/passport/StoryTimeline";
import { FavoriteCollections } from "@/components/passport/CollectionsFavorites";
import { CollectionEditor } from "@/components/passport/CollectionEditor";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import { _resetForTests, completeAdventure, favorite, newCollection } from "@/passport/local-store";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);

const ent = vi.hoisted(() => ({ status: "entitled" as "entitled" | "free" }));
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({
    status: ent.status,
    premium: [],
    signedIn: false,
    csrf: "",
    message: null,
  }),
}));
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => <div /> }));

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

const LINE = /veterinary advice|walk away any time/i;

describe("Safety copy on cards", () => {
  it("shows the safety lines on the page and keeps only the signs in ONE disclosure", () => {
    const { container } = render(<AdventureCard a={A1} />);
    const all = container.querySelectorAll("details.pa-gtk");
    expect(all).toHaveLength(1);
    const box = all[0] as HTMLDetailsElement;
    expect(box.open).toBe(false);
    expect(box.querySelector("summary")?.textContent).toBe("Signs your dog needs a break");
    // Suitability and safety are always visible, outside any fold.
    const list = container.querySelector('ul[aria-label^="Safety and preparation"]')!;
    expect(list.closest("details")).toBeNull();
    for (const line of A1.safety) expect(list.textContent).toContain(line);
    for (const w of [
      "Relaxed",
      "Unsure",
      "Needs space",
      "lip licking",
      "yawning",
      "tucked tail",
      "freezing",
      "growling",
      "hiding",
    ])
      expect(box.textContent?.toLowerCase()).toContain(w.toLowerCase());
    expect(box.textContent).toContain("Read your dog");
    expect(container.querySelectorAll(".pa-safety")).toHaveLength(0);
  });

  it("shows no standing disclaimer line on the card", () => {
    render(<AdventureCard a={A1} />);
    expect(screen.queryByText(LINE)).toBeNull();
    expect(document.body.textContent).not.toMatch(LINE);
    expect(document.body.textContent).not.toMatch(/Ending early is a good ending/);
  });

  it("has no medical claims", () => {
    const { container } = render(<AdventureCard a={A1} />);
    const t = container.querySelector(".pa-ryd")?.textContent ?? "";
    expect(t).not.toMatch(
      /diagnos|cure|treat(s|ment)|disease|pain|anxiety disorder|medication|calms|prevents/i,
    );
  });

  it("shows no safety block on a mystery card", () => {
    const { container } = render(<MysteryCard a={A1} onReveal={() => undefined} />);
    expect(screen.queryByText(LINE)).toBeNull();
    expect(container.querySelector(".pa-gtk")).toBeNull();
  });

  it("is on revealed cards in Collections and Favorites", async () => {
    newCollection({ id: "col-abcd1234", kind: "handpicked", name: "Two", ids: [A1.id, A2.id] });
    const v = await renderUi(<CollectionEditor id="col-abcd1234" />);
    fireEvent.click(screen.getByRole("button", { name: "Reveal a random one" }));
    const card = await screen.findByRole("article");
    expect(within(card).queryByText(LINE)).toBeNull();
    expect(card.querySelector("details.pa-gtk")).not.toBeNull();
    v.unmount();
    act(() => favorite(A1.id));
    await renderUi(<FavoriteCollections />);
    fireEvent.click(screen.getByRole("button", { name: "Surprise me from my favorites" }));
    expect((await screen.findAllByRole("article")).length).toBeGreaterThan(0);
    expect(screen.queryByText(LINE)).toBeNull();
  });

  it("is on adventure cards in Discover", async () => {
    await renderUi(<DiscoverPage mode="browse" onMode={() => undefined} />);
    expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
    expect(screen.queryByText(LINE)).toBeNull();
  });

  it("is on entries in Our Story", async () => {
    act(() => completeAdventure(A1.id, 1000));
    await renderUi(<StoryTimeline />);
    expect(screen.queryByText(LINE)).toBeNull();
  });

  it("is accessible and motion-safe in the stylesheet", () => {
    const css = readFileSync("src/design/adventure.css", "utf8");
    expect(css).toMatch(/\.pa-gtk summary\s*\{[^}]*min-height:\s*44px/);
    expect(css).toMatch(/prefers-reduced-motion[^{]*\{\s*\.pa-fold/);
    expect(css).not.toMatch(/\.pa-(gtk|fold|ryd)[^{]*:hover/);
  });
});
