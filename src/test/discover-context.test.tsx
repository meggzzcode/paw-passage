// Today's contextual choices on paid Discover: rules, hard-suitability-first, no silent relaxing, temporary state.
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { adventureSchema, type Adventure } from "../passport/schema";
import type { Ctx, History } from "../passport/engine";
import {
  EMPTY_TODAY,
  PLACE_OPTIONS,
  PREF_OPTIONS,
  alternatives,
  analyticsPlace,
  ctxToToday,
  findToday,
  readToday,
  surpriseLabel,
  surpriseToday,
  visiblePlaces,
  visiblePrefs,
  writeToday,
  type PlaceOption,
  type PrefKey,
  type PrefOption,
  type TodayState,
} from "../passport/context";
import { CTX_KEYS } from "../passport/journal-context";
import { DiscoverToday } from "@/components/passport/DiscoverToday";
import { _resetForTests, getSave, setProfile } from "@/passport/local-store";

vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ to, children }: { to: string; children?: unknown }) => (
    <a href={to}>{children as never}</a>
  ),
}));

// Synthetic fixtures only (never real premium text).
const base = {
  schema: 2,
  title: "Fixture adventure",
  clue: "A synthetic clue.",
  reveal: "A synthetic intro.",
  objective: "A synthetic objective.",
  instructions: ["Step one.", "Step two.", "Step three."],
  twist: "A synthetic twist.",
  completion: "When done.",
  memoryPrompt: "What happened?",
  minutesMin: 10,
  minutesMax: 20,
  costMin: 0,
  costMax: 0,
  prep: "none",
  transport: "none",
  setting: "indoor",
  homes: ["apartment", "house-no-yard", "house-with-yard"],
  space: "none",
  places: ["home"],
  lifeStages: ["puppy", "adult", "senior"],
  energy: "gentle",
  dogMobility: "low",
  ownerMobility: "seated",
  stepFree: true,
  crowd: "none",
  strangers: false,
  otherDogs: false,
  noise: "quiet",
  food: false,
  water: "none",
  safety: ["Stop if your dog loses interest."],
  activityTypes: ["play-and-games"],
  collections: ["home"],
  keepsake: { family: "certificate", theme: "fixture", headline: "FIXTURE" },
  access: "free",
  status: "published",
};
let n = 0;
const mk = (o: Record<string, unknown> = {}): Adventure =>
  adventureSchema.parse({
    ...base,
    id: `adv-c${String(++n).padStart(5, "0")}`,
    title: `Fixture ${n}`,
    ...o,
  });

// Known answers so unknowns do not hold the food and car fixtures back (unknown is never safe).
const ctx = (dog: Ctx["dog"] = {}, owner: Ctx["owner"] = {}): Ctx => ({
  dog: { foodActivities: "yes", carTravel: "yes", ...dog },
  owner: { hasCar: "yes", ...owner },
  unlocked: true,
});
const hist = (done: string[] = []): History => ({
  done: new Set(done),
  favorites: new Set(),
  skipped: new Set(),
});
// Real rule tables, except the "park" allow-list names real library ids, so the fixture park card is allowed instead.
const parkCard = mk({
  title: "Park stroll",
  setting: "outdoor",
  places: ["city"],
  transport: "walkable",
  activityTypes: ["outdoor-exploration"],
  energy: "moderate",
  dogMobility: "moderate",
  noise: "some",
  ownerMobility: "short-walk",
  minutesMax: 40,
});
const library = [
  mk({ title: "Cozy puzzle", activityTypes: ["problem-solving"], food: false }),
  mk({ title: "Cozy puzzle 2", activityTypes: ["problem-solving"] }),
  mk({ title: "Cozy puzzle 3", activityTypes: ["problem-solving"] }),
  mk({
    title: "Cozy treat game",
    activityTypes: ["food-and-treats"],
    food: true,
    costMin: 5,
    costMax: 5,
    supplies: ["a", "b", "c", "d", "e"],
    requires: ["treats"],
  }),
  mk({ title: "Cozy play", activityTypes: ["play-and-games"] }),
  mk({ title: "Cozy play 2", activityTypes: ["play-and-games"] }),
  mk({ title: "Cozy play 3", activityTypes: ["play-and-games"] }),
  mk({ title: "Calm nap", activityTypes: ["relaxation"], energy: "gentle" }),
  parkCard,
  mk({
    title: "Weekend drive",
    setting: "outdoor",
    places: ["mountains"],
    transport: "car",
    requires: ["car"],
    activityTypes: ["travel"],
    energy: "moderate",
    dogMobility: "moderate",
    ownerMobility: "short-walk",
    minutesMax: 120,
    costMax: 30,
  }),
];
const places: PlaceOption[] = PLACE_OPTIONS.map((p) =>
  p.key === "park" ? { ...p, rule: { allowIds: [parkCard.id] } } : p,
);
const prefs: PrefOption[] = PREF_OPTIONS;
const T = (place: TodayState["place"], ...p: PrefKey[]): TodayState => ({
  place,
  prefs: p,
  filters: {},
});
const run = (s: TodayState, lib = library, c: Ctx = ctx(), h = hist()) =>
  findToday(lib, c, h, s, { seed: "a", places, prefs });
const names = (r: ReturnType<typeof findToday>) =>
  r.ok ? r.ranked.map((x) => x.adventure.title).sort() : [];

describe("today's choices: engine rules", () => {
  it("anywhere and no place leave the pool alone", () => {
    expect(names(run(EMPTY_TODAY)).length).toBeGreaterThan(5);
    expect(names(run(T("anywhere")))).toEqual(names(run(EMPTY_TODAY)));
  });

  it("at home keeps adventures that need no travel and happen at home", () => {
    const r = names(run(T("home")));
    expect(r).toContain("Cozy play");
    expect(r).toContain("Cozy treat game");
    expect(r).not.toContain("Park stroll");
    expect(r).not.toContain("Weekend drive");
  });

  it("at home + no treats drops food and requires-treats adventures", () => {
    const r = names(run(T("home", "no-treats")));
    expect(r).toContain("Cozy play");
    expect(r).not.toContain("Cozy treat game");
  });

  it("at home + brain games", () => {
    expect(names(run(T("home", "brain")))).toEqual([
      "Cozy puzzle",
      "Cozy puzzle 2",
      "Cozy puzzle 3",
    ]);
  });

  it("brain + play are alternatives of one kind; other chips combine", () => {
    const both = names(run(T(null, "brain", "play")));
    expect(both).toContain("Cozy puzzle");
    expect(both).toContain("Cozy play");
    expect(names(run(T(null, "brain", "no-spend")))).toContain("Cozy puzzle");
    expect(names(run(T(null, "play", "no-treats", "no-spend")))).not.toContain("Cozy puzzle");
  });

  it("park, walk, getaway, no spending, quick and quiet behave", () => {
    expect(names(run(T("park")))).toEqual(["Park stroll"]);
    expect(names(run(T("walk")))).toEqual(["Park stroll"]);
    expect(names(run(T("getaway")))).toEqual(["Weekend drive"]);
    expect(names(run(T(null, "no-spend")))).not.toContain("Cozy treat game");
    const quick = names(run(T(null, "quick")));
    expect(quick).not.toContain("Weekend drive");
    expect(quick).not.toContain("Cozy treat game"); // more than four supplies
    expect(names(run(T(null, "quiet")))).toEqual(["Calm nap"]);
  });

  it("quiet moments needs gentle, quiet, no crowd or strangers, and the relaxation kind", () => {
    const lib = [
      ...library,
      mk({ title: "Calm 1", activityTypes: ["relaxation"] }),
      mk({ title: "Calm 2", activityTypes: ["relaxation"] }),
      mk({ title: "Calm 3", activityTypes: ["relaxation"], noise: "some" }),
    ];
    expect(names(run(T(null, "quiet"), lib))).toEqual(["Calm 1", "Calm 2", "Calm nap"]);
  });

  it("hard suitability runs before today's choices: a food restriction is never relaxed", () => {
    const dog = { foodActivities: "no" as const };
    for (const s of [T("home"), T("home", "brain"), EMPTY_TODAY])
      expect(names(run(s, library, ctx(dog)))).not.toContain("Cozy treat game");
  });

  it("puppy, senior, mixed ages, limited mobility, noise-sensitive stay safe", () => {
    const old = mk({ title: "Not for puppies", lifeStages: ["adult", "senior"] });
    const lib = [...library, old];
    const t = (dog: Ctx["dog"], s = EMPTY_TODAY) => names(run(s, lib, ctx(dog)));
    expect(t({ lifeStage: "puppy" })).not.toContain("Not for puppies");
    expect(t({ lifeStages: ["puppy", "senior"] }, T("home"))).not.toContain("Not for puppies");
    expect(t({ limitedMobility: true }, T("getaway"))).toEqual([]);
    expect(t({ noiseSensitive: "yes" }, T("walk"))).toEqual([]);
    expect(t({ lifeStage: "senior" }, T(null, "quick"))).not.toContain("Weekend drive");
  });

  it("owner effort and transport still apply (a seated owner never gets a walk)", () => {
    expect(names(run(T("walk"), library, ctx({}, { mobility: "seated" })))).toEqual([]);
    expect(names(run(T("getaway"), library, ctx({}, { hasCar: "no" })))).toEqual([]);
  });

  it("conflicting choices give a friendly none, never a silent relaxation", () => {
    const r = run(T("getaway", "quiet"));
    expect(r).toEqual({ ok: false, reason: "too-narrow" });
  });

  it("alternatives drop ONE named choice of today's, at most two", () => {
    const s = T("getaway", "play");
    const alts = alternatives(library, ctx(), hist(), s, { places, prefs });
    expect(alts.length).toBeLessThanOrEqual(2);
    expect(alts.length).toBeGreaterThan(0);
    for (const a of alts) expect(["place", "play"]).toContain(a.choice.id);
    for (const a of alts) expect(a.count).toBeGreaterThan(0);
  });

  it("repeats are offered only (and flagged) when nothing new fits", () => {
    const lib = [mk({ title: "Only one", places: ["home"] })];
    const r = run(EMPTY_TODAY, lib, ctx(), hist([lib[0]!.id]));
    expect(r.ok && r.repeats).toBe(true);
  });

  it("surprise uses today's choices", () => {
    const pick = (s: TodayState) =>
      surpriseToday(library, ctx(), hist(), s, { seed: "x", places, prefs });
    expect(pick(T("home", "brain"))?.title).toMatch(/^Cozy puzzle/);
    expect(pick(T("getaway", "brain"))).toBeNull();
  });

  it("surprise wording is contextual", () => {
    expect(surpriseLabel(T("home"), places, prefs)).toBe("Surprise us at home");
    expect(surpriseLabel(T("park"), places, prefs)).toBe("Surprise us outdoors");
    expect(surpriseLabel(T(null, "quiet"), places, prefs)).toBe("Surprise us with something quiet");
    expect(surpriseLabel(EMPTY_TODAY, places, prefs)).toBe("Surprise us!");
  });

  it("labels the library cannot back are hidden (needs three matching cards); coffee is not offered", () => {
    expect(visiblePlaces(library, places).map((p) => p.key)).toEqual(["home", "anywhere"]);
    expect(PLACE_OPTIONS.some((p) => (p.key as string) === "coffee")).toBe(false);
    expect(visiblePrefs([library[0]!], prefs)).toEqual([]);
    expect(visiblePrefs(library, prefs).map((p) => p.key)).toContain("brain");
  });
});

describe("today's choices: temporary state and ctx links", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    _resetForTests();
  });
  it("stores in session only", () => {
    const s: TodayState = { place: "home", prefs: ["no-spend"], filters: { minutes: 30 } };
    writeToday(s);
    expect(readToday()).toEqual(s);
    expect(window.localStorage.length).toBe(0);
    writeToday(EMPTY_TODAY);
    expect(readToday()).toEqual(EMPTY_TODAY);
  });
  it("every Journal ctx key maps to a valid state", () => {
    for (const k of CTX_KEYS) {
      const s = ctxToToday(k);
      expect(s.place === null || PLACE_OPTIONS.some((p) => p.key === s.place)).toBe(true);
    }
    expect(ctxToToday("at-home").place).toBe("home");
    expect(ctxToToday("rainy-day").place).toBe("home");
    expect(ctxToToday("weekend").place).toBe("getaway");
    expect(ctxToToday("doggy-date").place).toBe("walk");
    // "No spend" lands on the chip, not on a second overlapping filter
    expect(ctxToToday("no-spend")).toEqual({ place: null, prefs: ["no-spend"], filters: {} });
    expect(ctxToToday("at-home").prefs).toContain("no-spend");
    // a mapped place that is switched off falls back to no tile
    expect(
      ctxToToday(
        "weekend",
        PLACE_OPTIONS.map((p) => ({ ...p, enabled: false })),
      ).place,
    ).toBeNull();
  });
  it("analytics carries only an aggregate category", () => {
    expect(analyticsPlace({ place: "home", prefs: [], filters: { budget: 0 } })).toBe("home");
    expect(analyticsPlace(EMPTY_TODAY)).toBe("none");
  });
});

describe("DiscoverToday UI (free test library)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    _resetForTests();
  });
  afterEach(cleanup);
  function Ui({ initial = EMPTY_TODAY }: { initial?: TodayState }) {
    const [s, setS] = useState(initial);
    return <DiscoverToday state={s} onChange={setS} onSeeMore={() => {}} />;
  }
  it("shows single-choice tiles and optional chips; one tile is selected at a time", () => {
    render(<Ui />);
    const where = screen.getByRole("group", { name: "Where are we today?" });
    const tiles = within(where).getAllByRole("button");
    expect(tiles.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("group", { name: "Something that fits our day." })).toBeTruthy();
    fireEvent.click(within(where).getByRole("button", { name: /At home/ }));
    fireEvent.click(within(where).getByRole("button", { name: /Anywhere/ }));
    const pressed = tiles.filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed).toHaveLength(1);
    expect(pressed[0]!.textContent).toMatch(/Anywhere/);
  });
  it("never writes the saved profile", () => {
    setProfile({ name: "Biscuit" });
    const before = JSON.stringify(getSave().profile.data);
    render(<Ui />);
    fireEvent.click(screen.getByRole("button", { name: /At home/ }));
    fireEvent.click(screen.getByRole("button", { name: /No spending/ }));
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    expect(JSON.stringify(getSave().profile.data)).toBe(before);
  });
  it("shows a friendly no-match with alternatives and a reset, and no purchase push", () => {
    render(<Ui initial={{ place: "getaway", prefs: ["no-spend", "quiet"], filters: {} }} />);
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    const box = screen.getByTestId("today-nomatch");
    expect(box.textContent).toContain(
      "We couldn't find a little adventure that fits all of today's choices.",
    );
    expect(box.textContent).not.toMatch(/buy|unlock|passport|\$/i);
    expect(within(box).getAllByRole("button").length).toBeLessThanOrEqual(3);
    fireEvent.click(within(box).getByRole("button", { name: "Reset today's choices" }));
    expect(screen.queryByTestId("today-nomatch")).toBeNull();
  });
  it("Surprise us wording follows the tile", () => {
    render(<Ui />);
    expect(screen.getByRole("button", { name: "Surprise us!" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /At home/ }));
    expect(screen.getByRole("button", { name: "Surprise us at home" })).toBeTruthy();
  });
});
