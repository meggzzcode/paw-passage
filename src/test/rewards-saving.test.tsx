// V9 W5: the 12 stamps and 8 milestones against the real content, automatic awards, no inflation, and "Save for later".
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";

const ent = vi.hoisted(() => ({
  state: { status: "entitled", premium: [] as unknown[], signedIn: true, csrf: "", message: null },
}));
vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ to, children, ...rest }: { to: string; children?: ReactNode }) => (
    <a href={to} {...(rest as object)}>
      {children}
    </a>
  ),
}));
vi.mock("@/passport/useEntitlement", () => ({ useEntitlement: () => ent.state }));
vi.mock("@/passport/events", async (orig) => ({
  ...(await orig<typeof import("@/passport/events")>()),
  track: () => true,
}));
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => <div /> }));

import { AdventureCard, MysteryCard } from "@/components/passport/AdventureCard";
import { AdventureRow } from "@/components/passport/collections-shared";
import { markRevealed, isSavedMystery } from "@/components/passport/RevealSurface";
import { achievements as achDefs, freeLibrary, stamps as stampDefs } from "@/passport/content";
import {
  _resetForTests,
  addToCustomCollection,
  completeAdventure,
  favorite,
  getSave,
  newCollection,
  repeatAdventure,
  saveForLater,
  setMemory,
  setStarter,
  revealStarter,
} from "@/passport/local-store";
import {
  ALL_MILESTONES,
  achievements,
  add,
  emptySave,
  members,
  newCollectionId,
  type Library,
  type Save,
} from "@/passport/progress";

const FREE = freeLibrary();
const lib = (): Library =>
  FREE.map((a) => ({ id: a.id, stamps: a.stamps, collections: a.collections }));
const fake = (n: number): Library =>
  Array.from({ length: n }, (_, i) => ({
    id: `adv-${String(i).padStart(6, "0").replace(/0/g, "a")}`.slice(0, 10),
    stamps: ["first-adventure"],
    collections: ["home"],
  }));
const withDone = (s: Save, ids: string[]): Save => ({
  ...s,
  done: ids.reduce((d, id, i) => add(d, id, 100 + i), s.done),
});
const memo = (s: Save, ids: string[], text = "A good day."): Save => ({
  ...s,
  memories: { ...s.memories, ...Object.fromEntries(ids.map((id) => [id, { text, at: 1 }])) },
});

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
  ent.state = { status: "entitled", premium: [], signedIn: true, csrf: "", message: null };
});
afterEach(cleanup);

describe("the real reward definitions", () => {
  it("12 stamps and 8 milestones with stable, unique ids", () => {
    expect(stampDefs).toHaveLength(12);
    expect(achDefs).toHaveLength(8);
    expect(new Set(stampDefs.map((s) => s.slug)).size).toBe(12);
    expect(achDefs.filter((a) => a.kind === "count").map((a) => a.threshold)).toEqual([
      ...ALL_MILESTONES,
    ]);
    expect(achDefs.filter((a) => a.kind === "collection-complete")).toHaveLength(1);
  });
});

describe("automatic stamps", () => {
  it("Memory Maker: a memory note on three different completed adventures", () => {
    const [a, b, c] = ["adv-aaaaa1", "adv-bbbbb2", "adv-ccccc3"];
    const L: Library = [a!, b!, c!].map((id) => ({ id, stamps: [], collections: [] }));
    let s = withDone(emptySave(), [a!, b!, c!]);
    expect(achievements(memo(s, [a!, b!]), L, {}).stamps).not.toContain("memory-maker");
    expect(achievements(memo(s, [a!, b!, c!]), L, {}).stamps).toContain("memory-maker");
    // blank notes, and notes on adventures that are not completed, do not count
    expect(achievements(memo(s, [a!, b!, c!], "   "), L, {}).stamps).not.toContain("memory-maker");
    s = withDone(emptySave(), [a!, b!]);
    expect(achievements(memo(s, [a!, b!, c!]), L, {}).stamps).not.toContain("memory-maker");
  });
  it("Memory Maker through the real save path (completion + memory notes)", () => {
    const ids = FREE.slice(0, 3).map((a) => a.id);
    for (const id of ids) completeAdventure(id);
    setMemory(ids[0]!, "one");
    setMemory(ids[1]!, "two");
    expect(achievements(getSave(), lib(), {}).stamps).not.toContain("memory-maker");
    setMemory(ids[2]!, "three");
    expect(achievements(getSave(), lib(), {}).stamps).toContain("memory-maker");
    // a repeat memory on one adventure is not a different adventure
    setMemory(ids[2]!, "");
    repeatAdventure(ids[0]!);
    expect(achievements(getSave(), lib(), {}).stamps).not.toContain("memory-maker");
  });
  it("Adventure Legend: every count milestone plus a Collection Complete, never earlier", () => {
    const L = fake(80);
    const ids = L.map((a) => a.id);
    const cols = { home: ids.slice(0, 3) };
    const s74 = withDone(emptySave(), ids.slice(0, 74));
    expect(achievements(s74, L, cols).stamps).not.toContain("adventure-legend");
    const s75 = withDone(emptySave(), ids.slice(0, 75));
    expect(achievements(s75, L, cols).stamps).toContain("adventure-legend");
    // 75 done but no collection finished: not yet
    expect(achievements(s75, L, { home: ids.slice(70, 80) }).stamps).not.toContain(
      "adventure-legend",
    );
    // a library too small to reach every milestone never awards it
    expect(
      achievements(withDone(emptySave(), ids.slice(0, 17)), fake(17), {}).stamps,
    ).not.toContain("adventure-legend");
  });
  it("stamps already named on a completed card are kept (nothing earned is removed)", () => {
    const L: Library = [
      { id: "adv-aaaaa1", stamps: ["memory-maker", "cozy-companion"], collections: [] },
    ];
    const e = achievements(withDone(emptySave(), ["adv-aaaaa1"]), L, {});
    expect(e.stamps).toEqual(["cozy-companion", "memory-maker"]);
  });
  it("is additive: every stamp the old rule gave is still given", () => {
    const L = lib();
    let s = emptySave();
    for (const a of FREE) {
      s = withDone(s, [a.id]);
      const old = new Set<string>();
      for (const x of L) if (members(s.done).includes(x.id)) x.stamps.forEach((t) => old.add(t));
      const now = new Set(achievements(s, L, {}).stamps);
      for (const t of old) expect(now.has(t)).toBe(true);
    }
  });
});

describe("what does and does not count", () => {
  it("browsing, revealing, saving, favoriting and collecting never complete anything", () => {
    const id = FREE[0]!.id;
    setStarter(id);
    revealStarter();
    markRevealed(id);
    saveForLater(id);
    favorite(id);
    newCollection({ id: newCollectionId(), kind: "handpicked", name: "Picks", ids: [id] });
    const cid = Object.keys(getSave().collections)[0]!;
    addToCustomCollection(cid, FREE[1]!.id);
    const e = achievements(getSave(), lib(), {});
    expect(e.count).toBe(0);
    expect(e.stamps).toEqual([]);
    expect(e.milestones).toEqual([]);
    expect(members(getSave().done)).toEqual([]);
  });
  it("a new unique adventure raises the count; repeating or re-completing does not", () => {
    const [x, y] = [FREE[0]!.id, FREE[1]!.id];
    completeAdventure(x);
    expect(achievements(getSave(), lib(), {}).count).toBe(1);
    completeAdventure(x);
    repeatAdventure(x);
    repeatAdventure(x);
    expect(achievements(getSave(), lib(), {}).count).toBe(1);
    expect(getSave().repeats[x]).toBe(2);
    completeAdventure(y);
    const e = achievements(getSave(), lib(), {});
    expect(e.count).toBe(2);
    expect(new Set(e.stamps).size).toBe(e.stamps.length);
  });
});

describe("Collection Complete", () => {
  const L = fake(6);
  const ids = L.map((a) => a.id);
  it("needs a curated collection of at least three, every one of them done", () => {
    const s = withDone(emptySave(), ids.slice(0, 3));
    expect(achievements(s, L, { a: ids.slice(0, 3) }).collectionsComplete).toEqual(["a"]);
    expect(achievements(s, L, { a: ids.slice(0, 2) }).collectionsComplete).toEqual([]);
    expect(achievements(s, L, { a: ids.slice(0, 4) }).collectionsComplete).toEqual([]);
  });
  it("custom collections never count (only the curated map is considered)", () => {
    let s = withDone(emptySave(), ids.slice(0, 3));
    s = {
      ...s,
      collections: {},
    };
    expect(achievements(s, L, {}).collectionsComplete).toEqual([]);
  });
});

describe("Save for later", () => {
  const A = FREE[0]!;
  it("a saved unrevealed mystery says where it went, is never done, and keeps its id", () => {
    render(<MysteryCard a={A} onReveal={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Save for later" }));
    expect(screen.getByRole("status").textContent).toMatch(/Our bucket list/);
    expect(screen.getByRole("status").textContent).toMatch(/Saved/);
    expect(screen.getByRole("button", { name: "Saved for later ✓" })).toBeTruthy();
    const s = getSave();
    expect(members(s.saved)).toEqual([A.id]);
    expect(members(s.done)).toEqual([]);
    expect(Object.keys(s.collections)).toEqual([]);
    expect(isSavedMystery(A.id)).toBe(true);
    // unsaving clears it
    fireEvent.click(screen.getByRole("button", { name: "Saved for later ✓" }));
    expect(isSavedMystery(A.id)).toBe(false);
    expect(members(getSave().saved)).toEqual([]);
  });
  it("in the Saved list an unrevealed mystery shows no title, then reveals the same adventure", () => {
    saveForLater(A.id);
    window.localStorage.setItem("pp.mystery-saved.v1", JSON.stringify([A.id]));
    render(
      <ul>
        <AdventureRow a={A} done={false} />
      </ul>,
    );
    expect(screen.queryByText(A.title)).toBeNull();
    expect(screen.getByText(/Mystery adventure, saved for later/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Reveal/ }));
    fireEvent.click(screen.getByRole("button", { name: /Scratch or tap to reveal/ }));
    expect(screen.getAllByText(A.title).length).toBeGreaterThan(0);
    expect(isSavedMystery(A.id)).toBe(false);
    expect(members(getSave().saved)).toEqual([A.id]); // same id, still saved
  });
  it("a revealed adventure's Save for later confirms, never completes, and never needs a collection", () => {
    render(<AdventureCard a={A} />);
    fireEvent.click(screen.getByRole("button", { name: "Save for later" }));
    expect(
      screen
        .getAllByRole("status")
        .map((e) => e.textContent)
        .join(" "),
    ).toMatch(/Collections under Saved/);
    expect(members(getSave().done)).toEqual([]);
    expect(Object.keys(getSave().collections)).toEqual([]);
    expect(screen.queryByTestId("completion")).toBeNull();
  });
  it("Create a keepsake is the obvious action once a paid adventure is completed", () => {
    render(<AdventureCard a={A} />);
    fireEvent.click(screen.getByRole("button", { name: "Complete adventure" }));
    const panel = screen.getByTestId("completion");
    expect(within(panel).getByRole("button", { name: "Create a keepsake" })).toBeTruthy();
  });
});
