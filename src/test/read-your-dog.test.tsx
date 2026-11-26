import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { A1, A2, renderUi } from "./collections-fixtures";
import { AdventureCard, MysteryCard } from "@/components/passport/AdventureCard";
import { ReadYourDog, STANDING_LINE, WALK_AWAY_LINE } from "@/components/passport/ReadYourDog";
import { StoryTimeline } from "@/components/passport/StoryTimeline";
import { FavoriteCollections } from "@/components/passport/CollectionsFavorites";
import { CollectionEditor } from "@/components/passport/CollectionEditor";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import { _resetForTests, completeAdventure, favorite, newCollection } from "@/passport/local-store";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => <div /> }));

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

const STANDING =
  "General information from public guidance. Not veterinary advice. Ask your vet about your dog.";
const WALK = "Your dog can walk away at any time. Ending early is a good ending.";

describe("Read your dog card", () => {
  it("uses the exact lines", () => {
    expect(STANDING_LINE).toBe(STANDING);
    expect(WALK_AWAY_LINE).toBe(WALK);
  });

  it("shows the standing and walk-away lines without opening anything, and lists the signs", () => {
    render(<ReadYourDog />);
    expect(screen.getByText(STANDING)).toBeVisible();
    expect(screen.getByText(WALK)).toBeVisible();
    const box = screen.getByRole("region", { name: "Read your dog" });
    expect(box.querySelector("summary")?.textContent).toBe("Read your dog");
    for (const w of [
      "Relaxed",
      "Unsure",
      "Needs space now",
      "lip licking",
      "yawning",
      "tucked tail",
      "freezing",
      "growling",
      "hiding",
    ])
      expect(box.textContent?.toLowerCase()).toContain(w.toLowerCase());
  });

  it("has no medical claims", () => {
    render(<ReadYourDog />);
    const t = screen.getByRole("region", { name: "Read your dog" }).textContent ?? "";
    expect(t).not.toMatch(
      /diagnos|cure|treat(s|ment)|disease|pain|anxiety disorder|medication|calms|prevents/i,
    );
  });

  it("is on a revealed card even when the details are closed, but not on a mystery card", () => {
    const { unmount } = render(<AdventureCard a={A1} />);
    expect(screen.getByText(STANDING)).toBeVisible();
    expect(screen.queryByText(A1.instructions[0]!)).toBeNull();
    unmount();
    render(<MysteryCard a={A1} onReveal={() => undefined} />);
    expect(screen.queryByText(STANDING)).toBeNull();
  });

  it("is on revealed cards in Collections and Favorites", async () => {
    newCollection({ id: "col-abcd1234", kind: "handpicked", name: "Two", ids: [A1.id, A2.id] });
    const v = await renderUi(<CollectionEditor id="col-abcd1234" />);
    fireEvent.click(screen.getByRole("button", { name: "Reveal a random one" }));
    const card = await screen.findByRole("article");
    expect(within(card).getByText(STANDING)).toBeVisible();
    v.unmount();
    act(() => favorite(A1.id));
    await renderUi(<FavoriteCollections />);
    fireEvent.click(screen.getByRole("button", { name: "Surprise me from my favorites" }));
    expect((await screen.findAllByText(STANDING)).length).toBeGreaterThan(0);
  });

  it("is on adventure cards in Discover", async () => {
    await renderUi(<DiscoverPage mode="browse" onMode={() => undefined} />);
    expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
    expect(screen.getAllByText(STANDING).length).toBe(screen.getAllByRole("article").length);
  });

  it("is on entries in Our Story", async () => {
    act(() => completeAdventure(A1.id, 1000));
    await renderUi(<StoryTimeline />);
    expect(screen.getByText(STANDING)).toBeVisible();
    expect(screen.getByText(WALK)).toBeVisible();
  });

  it("is accessible and motion-safe in the stylesheet", () => {
    const css = readFileSync("src/design/adventure.css", "utf8");
    expect(css).toMatch(/\.pa-ryd summary\s*\{[^}]*min-height:\s*44px/);
    expect(css).toMatch(/prefers-reduced-motion[^{]*\{\s*\.pa-ryd/);
    expect(css).not.toMatch(/\.pa-ryd[^{]*:hover/);
  });
});
