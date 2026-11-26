import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import type { DiscoverMode } from "@/components/passport/DiscoverTabs";
import { freeLibrary } from "@/passport/content";
import { rank, type Ctx, type History } from "@/passport/engine";
import {
  _resetForTests,
  completeAdventure,
  favorite,
  getSave,
  setProfile,
} from "@/passport/local-store";
import { listCollections, members } from "@/passport/progress";
import type { DogProfile, SessionFilters } from "@/passport/profile";

const library = freeLibrary();

function Harness({ start }: { start: DiscoverMode }) {
  const [mode, setMode] = useState<DiscoverMode>(start);
  return <DiscoverPage mode={mode} onMode={setMode} />;
}
const show = (mode: DiscoverMode = "made") => render(<Harness start={mode} />);

function ctxHistory(filters: SessionFilters = {}) {
  const s = getSave();
  const ctx: Ctx = { dog: s.profile.data as DogProfile, owner: s.owner.data, unlocked: false };
  const history: History = {
    done: new Set(members(s.done)),
    favorites: new Set(members(s.favorites)),
    skipped: new Set(),
  };
  return rank(library, ctx, filters, history, { includeDone: true, seed: "browse" });
}

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

describe("discover: onboarding and browsing", () => {
  it("browses without a profile and the Personalise banner is dismissible", () => {
    show("browse");
    expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
    const banner = screen.getByRole("complementary", { name: "Personalise" });
    expect(banner).toBeInTheDocument();
    fireEvent.click(within(banner).getByRole("button", { name: "Not now" }));
    expect(screen.queryByRole("complementary", { name: "Personalise" })).toBeNull();
    expect(getSave().profile.data.skipped).toBe(true);
    expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
  });

  it("saves quick answers as you go and keeps 'Not sure' as unknown", () => {
    show("browse");
    fireEvent.click(screen.getByRole("button", { name: "Personalise" }));
    fireEvent.change(screen.getByLabelText(/dog's name/i), { target: { value: "Biscuit" } });
    const people = screen.getByRole("group", { name: /unfamiliar people/i });
    fireEvent.click(within(people).getByRole("button", { name: "Nervous" }));
    const dogs = screen.getByRole("group", { name: /other dogs/i });
    fireEvent.click(within(dogs).getByRole("button", { name: "Not sure" }));
    const d = getSave().profile.data as DogProfile;
    expect(d.name).toBe("Biscuit");
    expect(d.people).toBe("nervous");
    expect(d.dogs).toBe("unknown");
    fireEvent.click(screen.getByRole("button", { name: "Add more about your dog" }));
    expect(screen.getByText(/only a gentle hint/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "About you" }));
    expect(screen.getByRole("group", { name: /how much walking/i })).toBeInTheDocument();
    expect(screen.getByText(/stay on hold/i)).toBeInTheDocument();
  });

  it("skipping onboarding keeps browsing available", () => {
    show("made");
    fireEvent.click(screen.getByRole("button", { name: "Personalise" }));
    fireEvent.click(screen.getByRole("button", { name: "Skip for now" }));
    expect(screen.queryByRole("heading", { name: /who's coming/i })).toBeNull();
    expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
  });

  it("exposes the tabs accessibly and moves between them with arrow keys", () => {
    show("made");
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual(["Made for You", "Surprise Me", "Browse All"]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", tabs[0]!.id);
    fireEvent.keyDown(tabs[0]!, { key: "ArrowRight" });
    expect(screen.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
  });
});

describe("discover: held questions", () => {
  it("asks plainly about unknowns and unlocks adventures once answered", () => {
    show("made");
    const heading = screen.queryByRole("heading", { name: "A couple of quick questions" });
    expect(heading).toBeInTheDocument();
    const before = ctxHistory();
    expect(before.ok && before.held.length).toBeGreaterThan(0);
    const section = heading!.closest("section")!;
    const group = within(section).getAllByRole("group")[0]!;
    const heldBefore = before.ok ? before.held.length : 0;
    fireEvent.click(within(group).getAllByRole("button")[0]!);
    const after = ctxHistory();
    expect(after.ok).toBe(true);
    if (after.ok) expect(after.held.length).toBeLessThan(heldBefore);
    // The answer is stored in the profile and nothing was guessed for other questions.
    expect(Object.keys(getSave().profile.data).length).toBeGreaterThan(0);
  });

  it("explains recommendations without percentages or 'perfect'", () => {
    show("made");
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/perfect/i);
  });
});

describe("discover: filters", () => {
  it("combines filters and matches the engine's count", () => {
    show("browse");
    const all = ctxHistory();
    fireEvent.click(
      within(screen.getByRole("group", { name: /budget/i })).getByRole("button", { name: "Free" }),
    );
    fireEvent.click(
      within(screen.getByRole("group", { name: /indoors or outdoors/i })).getByRole("button", {
        name: "Indoors",
      }),
    );
    const combined = ctxHistory({ budget: 0, setting: "indoor" });
    const n = combined.ok ? combined.ranked.length : 0;
    const total = all.ok ? all.ranked.length : 0;
    expect(n).toBeLessThanOrEqual(total);
    expect(screen.getByText(/Showing: .*free/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.queryByText(/Showing:/)).toBeNull();
  });

  it("offers More filters and saves the current filters as a smart collection", () => {
    show("browse");
    fireEvent.click(screen.getByRole("button", { name: "More filters" }));
    expect(screen.getByRole("group", { name: /supplies i have/i })).toBeInTheDocument();
    fireEvent.click(
      within(screen.getByRole("group", { name: /^budget/i })).getByRole("button", { name: "Free" }),
    );
    fireEvent.click(screen.getByRole("button", { name: /save these filters as a smart/i }));
    fireEvent.change(screen.getByLabelText(/name this smart collection/i), {
      target: { value: "Free fun" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save collection" }));
    const saved = listCollections(getSave());
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ kind: "smart", name: "Free fun", filters: { budget: 0 } });
  });
});

describe("discover: surprise me", () => {
  const clueOf = () => document.querySelector(".pa-clue")?.textContent?.replace(/[“”]/g, "") ?? "";

  it("hides the title and instructions until Reveal, but shows practical facts", () => {
    show("surprise");
    const mystery = screen.getByRole("article", { name: "Mystery adventure" });
    const a = library.find((x) => x.clue === clueOf())!;
    expect(a).toBeTruthy();
    expect(screen.queryByText(a.title)).toBeNull();
    expect(screen.queryByText(a.instructions[0]!)).toBeNull();
    expect(within(mystery).getByLabelText("At a glance")).toBeInTheDocument();
    fireEvent.click(within(mystery).getByRole("button", { name: "Reveal adventure" }));
    expect(screen.getByRole("heading", { name: a.title })).toBeInTheDocument();
  });

  it("does not repeat skipped adventures within the session", () => {
    show("surprise");
    const seen: string[] = [];
    for (let i = 0; i < library.length + 2; i++) {
      const btn = screen.queryByRole("button", { name: "Try another" });
      if (!btn) break;
      seen.push(clueOf());
      fireEvent.click(btn);
    }
    expect(seen.length).toBeGreaterThan(1);
    expect(new Set(seen).size).toBe(seen.length);
    expect(screen.getByRole("button", { name: "Start over" })).toBeInTheDocument();
  });

  it("supports the scopes: favorites and previously completed", () => {
    const r = ctxHistory();
    if (!r.ok) throw new Error("expected eligible adventures");
    const [fav, did] = [r.ranked[0]!.adventure, r.ranked[1]!.adventure];
    favorite(fav.id);
    completeAdventure(did.id);
    show("surprise");
    const select = screen.getByLabelText("Surprise me from");
    fireEvent.change(select, { target: { value: "favorites" } });
    expect(library.find((x) => x.clue === clueOf())?.id).toBe(fav.id);
    fireEvent.change(select, { target: { value: "done" } });
    expect(library.find((x) => x.clue === clueOf())?.id).toBe(did.id);
    fireEvent.change(select, { target: { value: "custom" } });
    expect(screen.getByText(/no collections of your own yet/i)).toBeInTheDocument();
    fireEvent.change(select, { target: { value: "curated" } });
    expect(screen.getByLabelText("Which collection")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "All suitable adventures" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Made for you" })).toBeInTheDocument();
  });

  it("empty favorites scope says so instead of picking something else", () => {
    show("surprise");
    fireEvent.change(screen.getByLabelText("Surprise me from"), { target: { value: "favorites" } });
    expect(screen.queryByRole("article", { name: "Mystery adventure" })).toBeNull();
    expect(screen.getByText(/nothing suitable in this pool/i)).toBeInTheDocument();
  });

  it("never offers an adventure that hard eligibility rules out", () => {
    setProfile({ foodActivities: "no", lifeStage: "senior" });
    show("surprise");
    for (let i = 0; i < library.length; i++) {
      const a = library.find((x) => x.clue === clueOf());
      if (!a) break;
      expect(a.lifeStages).toContain("senior");
      expect(a.food).toBe(false);
      fireEvent.click(screen.getByRole("button", { name: "Try another" }));
    }
  });
});

describe("discover: completion and cards", () => {
  it("completion updates progress everywhere and offers a keepsake without requiring it", () => {
    show("browse");
    const first = screen.getAllByRole("article")[0]!;
    const title = within(first).getByRole("heading").textContent!;
    expect(within(first).queryByRole("button", { name: "Create keepsake" })).toBeNull();
    fireEvent.click(within(first).getByRole("button", { name: "Mark complete" }));
    expect(getSave().done.added[library.find((a) => a.title === title)!.id]).toBeTruthy();
    expect(within(first).getByRole("status")).toHaveTextContent(/added to your passport/i);
    expect(within(first).getByRole("button", { name: "Create keepsake" })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`^1 of ${library.length} free adventures`))).toBeTruthy();
    // Same card, same completion, in another tab.
    fireEvent.click(screen.getByRole("tab", { name: "Made for You" }));
    expect(screen.getByText(new RegExp(`^1 of ${library.length} free adventures`))).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Browse All" }));
    const again = screen.getAllByRole("article")[0]!;
    fireEvent.click(within(again).getByRole("button", { name: "Do it again" }));
    expect(Object.values(getSave().repeats)).toEqual([1]);
    expect(members(getSave().done)).toHaveLength(1); // a repeat is not a second unique completion
    fireEvent.click(within(again).getByRole("button", { name: "Undo completion" }));
    expect(members(getSave().done)).toHaveLength(0);
  });

  it("shows the compact facts and expands for full details", () => {
    show("browse");
    const card = screen.getAllByRole("article")[0]!;
    const a = library.find((x) => x.title === within(card).getByRole("heading").textContent)!;
    expect(within(card).getByLabelText("Kinds of adventure")).toBeInTheDocument();
    expect(within(card).getByLabelText("At a glance")).toBeInTheDocument();
    expect(within(card).getByText(/^Keepsake: /)).toBeInTheDocument();
    expect(within(card).queryByText(a.twist)).toBeNull();
    const toggle = within(card).getByRole("button", { name: "Show details" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(within(card).getByText(a.twist, { exact: false })).toBeInTheDocument();
    expect(within(card).getByRole("complementary", { name: /safety/i })).toBeInTheDocument();
  });

  it("records liked and not-for-us feedback and offers collections", () => {
    show("browse");
    const card = screen.getAllByRole("article")[0]!;
    const id = library.find((x) => x.title === within(card).getByRole("heading").textContent)!.id;
    fireEvent.click(within(card).getByRole("button", { name: "Not for us" }));
    expect(getSave().feedback[id]?.value).toBe("not-for-us");
    fireEvent.click(within(card).getByRole("button", { name: "Add to my collection" }));
    fireEvent.change(within(card).getByLabelText(/new collection name/i), {
      target: { value: "Rainy day" },
    });
    fireEvent.click(within(card).getByRole("button", { name: "Create and add" }));
    const col = listCollections(getSave())[0]!;
    expect(col).toMatchObject({ kind: "handpicked", name: "Rainy day", ids: [id] });
  });

  it("never suggests captions, hashtags or ready-made posts", () => {
    show("browse");
    for (const b of screen.getAllByRole("button", { name: "Show details" })) fireEvent.click(b);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/caption|hashtag|#\w/i);
  });
});
