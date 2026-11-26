import { act, cleanup, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adv, renderUi } from "./collections-fixtures";
import { Suggestions } from "@/components/passport/Suggestions";
import {
  _resetForTests,
  completeAdventure,
  getSave,
  newCollection,
  setProfile,
} from "@/passport/local-store";
import { members } from "@/passport/progress";
import type { Adventure } from "@/passport/schema";
import type { Ctx, History } from "@/passport/engine";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => null }));

const APRIL = new Date(2026, 3, 10); // spring in the north, autumn in the south

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function show(library: Adventure[], opts: { unlocked?: boolean; today?: Date } = {}) {
  const save = getSave();
  const dog = save.profile.data;
  const ctx: Ctx = { dog, owner: save.owner.data, unlocked: opts.unlocked ?? false };
  const history: History = {
    done: new Set(members(save.done)),
    favorites: new Set(members(save.favorites)),
    skipped: new Set(),
  };
  return renderUi(
    <Suggestions
      library={library}
      ctx={ctx}
      history={history}
      save={save}
      dog={dog}
      today={opts.today ?? APRIL}
    />,
  );
}

const SPRING = { seasons: ["spring" as const] };
const FREE1 = adv("adv-fff111", "Free Spring Sniff", SPRING);
const PREM1 = adv("adv-ppp111", "Premium Spring Trail", { ...SPRING, access: "premium" });

const today = () => screen.getByRole("region", { name: "For you today" });

describe("For you today", () => {
  it("free library: suggests a free adventure and shows one honest line, no counts", async () => {
    await show([FREE1]);
    expect(within(today()).getByText(/much larger library/)).toBeInTheDocument();
    fireEvent.click(within(today()).getByRole("button", { name: "Reveal adventure" }));
    expect(within(today()).getByText("Free Spring Sniff")).toBeInTheDocument();
    expect(today().textContent).not.toMatch(/\d+ (more )?adventures/);
  });

  it("entitled library: suggests from the combined library and drops the upgrade line", async () => {
    await show([PREM1], { unlocked: true });
    expect(within(today()).queryByText(/much larger library/)).toBeNull();
    fireEvent.click(within(today()).getByRole("button", { name: "Reveal adventure" }));
    expect(within(today()).getByText("Premium Spring Trail")).toBeInTheDocument();
  });

  it("never suggests a premium adventure to someone who is not unlocked", async () => {
    await show([PREM1], { unlocked: false });
    expect(within(today()).queryByRole("button", { name: "Reveal adventure" })).toBeNull();
    expect(within(today()).getByRole("status")).toBeInTheDocument();
  });

  it("never offers completed, held or ineligible adventures, and never repeats", async () => {
    setProfile({ lifeStage: "adult" });
    completeAdventure("adv-done11", 10);
    const lib = [
      adv("adv-good11", "Good One", SPRING),
      adv("adv-good22", "Good Two", SPRING),
      adv("adv-done11", "Already Done", SPRING),
      adv("adv-held11", "Held For Size", { ...SPRING, sizes: ["small"] }),
      adv("adv-nope11", "Senior Only", { ...SPRING, lifeStages: ["senior"] }),
    ];
    await show(lib);
    const seen: string[] = [];
    for (let i = 0; i < 6; i++) {
      const reveal = within(today()).queryByRole("button", { name: "Reveal adventure" });
      if (!reveal) break;
      fireEvent.click(reveal);
      const title = ["Good One", "Good Two"].find((t) => within(today()).queryByText(t));
      expect(title).toBeDefined();
      seen.push(title!);
      for (const bad of ["Already Done", "Held For Size", "Senior Only"])
        expect(within(today()).queryByText(bad)).toBeNull();
      fireEvent.click(within(today()).getByRole("button", { name: "Try another" }));
    }
    expect(seen.sort()).toEqual(["Good One", "Good Two"]);
    expect(within(today()).getByText("That is everything for now.")).toBeInTheDocument();
    fireEvent.click(within(today()).getByRole("button", { name: "Start over" }));
    expect(within(today()).getByRole("button", { name: "Reveal adventure" })).toBeInTheDocument();
  });

  it("quick chips narrow the pick through the engine and are pressed-state buttons", async () => {
    const lib = [adv("adv-long11", "Long Outing", { ...SPRING, minutesMin: 50, minutesMax: 60 })];
    await show(lib);
    expect(within(today()).getByRole("button", { name: "Reveal adventure" })).toBeInTheDocument();
    const ten = within(today()).getByRole("button", { name: "About 10 minutes" });
    fireEvent.click(ten);
    expect(ten).toHaveAttribute("aria-pressed", "true");
    expect(within(today()).queryByRole("button", { name: "Reveal adventure" })).toBeNull();
  });

  it("derives the season from the date and lets the owner choose the hemisphere", async () => {
    const lib = [adv("adv-aut111", "Autumn Only", { seasons: ["autumn"] })];
    await show(lib);
    expect(within(today()).queryByRole("button", { name: "Reveal adventure" })).toBeNull();
    fireEvent.change(within(today()).getByLabelText("Where I live, for the season"), {
      target: { value: "south" },
    });
    expect(within(today()).getByRole("button", { name: "Reveal adventure" })).toBeInTheDocument();
  });
});

describe("This season shelf", () => {
  it("lists tagged adventures, not any-season ones", async () => {
    await show([FREE1, adv("adv-any111", "Any Season Game")]);
    const shelf = screen.getByRole("region", { name: "This season" });
    expect(within(shelf).getAllByText("Free Spring Sniff").length).toBeGreaterThan(0);
    expect(within(shelf).queryAllByText("Any Season Game")).toHaveLength(0);
  });
  it("says so honestly when nothing is tagged", async () => {
    await show([adv("adv-any111", "Any Season Game")]);
    expect(
      within(screen.getByRole("region", { name: "This season" })).getByText(
        /No adventures tagged for spring/,
      ),
    ).toBeInTheDocument();
  });
  it("entitled shelf includes premium ones", async () => {
    await show([FREE1, PREM1], { unlocked: true });
    const shelf = screen.getByRole("region", { name: "This season" });
    expect(within(shelf).getAllByText("Premium Spring Trail").length).toBeGreaterThan(0);
  });
});

describe("Occasion and calendar", () => {
  const CELEBRATE = adv("adv-cel111", "Party Walk", { collections: ["holidays-and-celebrations"] });
  const STORY = adv("adv-sto111", "Story Walk", { collections: ["our-story"] });

  it("shows an Occasion card inside the window, using celebration adventures", async () => {
    setProfile({ name: "Juno", birthday: "2020-04-15" });
    await show([FREE1, CELEBRATE]);
    const occ = screen.getByRole("region", { name: "Occasion" });
    expect(within(occ).getByText(/Juno's birthday is in 5 days/)).toBeInTheDocument();
    fireEvent.click(within(occ).getByRole("button", { name: "Reveal adventure" }));
    expect(within(occ).getByText("Party Walk")).toBeInTheDocument();
  });
  it("uses our-story for an adoption anniversary and is absent outside the window", async () => {
    setProfile({ name: "Juno", adoptionDate: "2021-04-08" });
    await show([CELEBRATE, STORY]);
    const occ = screen.getByRole("region", { name: "Occasion" });
    expect(within(occ).getByText(/adoption anniversary was 2 days ago/)).toBeInTheDocument();
    fireEvent.click(within(occ).getByRole("button", { name: "Reveal adventure" }));
    expect(within(occ).getByText("Story Walk")).toBeInTheDocument();
    cleanup();
    setProfile({ adoptionDate: "2021-07-08" });
    await show([CELEBRATE, STORY]);
    expect(screen.queryByRole("region", { name: "Occasion" })).toBeNull();
  });

  it("free users see a teaser and no download button", async () => {
    setProfile({ name: "Juno", birthday: "2020-09-01" });
    await show([FREE1]);
    const cal = screen.getByRole("region", { name: "Calendar reminders" });
    expect(
      within(cal).getByText(/The full Passport can make a yearly calendar reminder/),
    ).toBeInTheDocument();
    expect(within(cal).queryByRole("button")).toBeNull();
  });

  it("entitled users download a local .ics with only the name and dates", async () => {
    setProfile({
      name: "Juno",
      breed: "Beagle",
      restrictions: "private vet note",
      birthday: "2020-09-01",
      adoptionDate: "2021-01-05",
    });
    const blobs: Blob[] = [];
    const create = vi.fn((b: Blob) => (blobs.push(b), "blob:x"));
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: vi.fn() });
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    await show([FREE1], { unlocked: true });
    const cal = screen.getByRole("region", { name: "Calendar reminders" });
    await act(async () => {
      fireEvent.click(within(cal).getByRole("button", { name: "Add to my calendar" }));
    });
    expect(create).toHaveBeenCalledTimes(1);
    const text = await new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.readAsText(blobs[0]!);
    });
    expect(blobs[0]!.type).toContain("text/calendar");
    expect(text).toContain("SUMMARY:Juno: adventure day?");
    expect(text).toContain("DTSTART;VALUE=DATE:20260901");
    expect(text).toContain("DTSTART;VALUE=DATE:20270105");
    expect(text).not.toMatch(/Beagle|private vet note/);
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

describe("Smart collection picks", () => {
  it("offers a pick from a saved smart collection, only from suitable new adventures", async () => {
    setProfile({ lifeStage: "adult" });
    completeAdventure("adv-done11", 10);
    newCollection({
      id: "col-smart001",
      kind: "smart",
      name: "Quick Wins",
      filters: { minutes: 10 },
    });
    const lib = [
      adv("adv-done11", "Already Done"),
      adv("adv-quick1", "Quick Thing", { minutesMin: 5, minutesMax: 5 }),
      adv("adv-slow11", "Slow Thing", { minutesMin: 45, minutesMax: 45 }),
      adv("adv-sen111", "Senior Quick", { lifeStages: ["senior"], minutesMin: 5, minutesMax: 5 }),
    ];
    await show(lib);
    const sec = screen.getByRole("region", { name: "From your collection Quick Wins" });
    fireEvent.click(within(sec).getByRole("button", { name: "Reveal adventure" }));
    expect(within(sec).getByText("Quick Thing")).toBeInTheDocument();
    fireEvent.click(within(sec).getByRole("button", { name: "Try another" }));
    expect(within(sec).queryByRole("button", { name: "Reveal adventure" })).toBeNull();
    expect(within(sec).getByText("That is everything for now.")).toBeInTheDocument();
  });
  it("shows nothing for visitors without smart collections", async () => {
    await show([FREE1]);
    expect(screen.queryByRole("region", { name: /From your collection/ })).toBeNull();
  });
});

describe("free tier privacy and wording", () => {
  it("makes no network calls and never uses percentages or 'perfect for'", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const beacon = vi.fn();
    Object.assign(navigator, { sendBeacon: beacon });
    setProfile({ name: "Juno", birthday: "2020-04-15" });
    const { container } = await show([
      FREE1,
      adv("adv-cel111", "Party Walk", { collections: ["holidays-and-celebrations"] }),
    ]);
    for (const b of screen.getAllByRole("button", { name: "Reveal adventure" })) fireEvent.click(b);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(beacon).not.toHaveBeenCalled();
    expect(container.textContent).not.toMatch(/%|perfect for/i);
    vi.unstubAllGlobals();
  });
  it("labels its regions, groups and controls", async () => {
    await show([FREE1]);
    for (const name of ["For you today", "This season"])
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Time I have" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Where" })).toBeInTheDocument();
    expect(screen.getByLabelText("Where I live, for the season")).toBeInTheDocument();
  });
});
