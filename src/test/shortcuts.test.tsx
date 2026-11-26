import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { Shortcuts } from "@/components/passport/Shortcuts";
import { freeLibrary } from "@/passport/content";
import { rank, type Ctx, type History } from "@/passport/engine";
import { _resetForTests, setProfile } from "@/passport/local-store";
import { SHORTCUTS, previewMatches, refineAdventures, shortcutBySlug } from "@/passport/shortcuts";
import type { PreviewItem } from "@/lib/previews";

const ent = vi.hoisted(() => ({ status: "free" as "free" | "entitled" }));
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({
    status: ent.status,
    premium: [],
    signedIn: false,
    csrf: "",
    message: null,
  }),
}));

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ pathname: "/discover" }),
  Link: ({ children, to, className }: { children: unknown; to: string; className?: string }) => (
    <a href={to} className={className}>
      {children as never}
    </a>
  ),
}));

const item = (o: Partial<PreviewItem>): PreviewItem => ({
  id: "adv-aaaaaa",
  title: "A mystery",
  teaser: "A little something.",
  category: "Play and games",
  minutesMin: 10,
  minutesMax: 20,
  costMin: 0,
  costMax: 0,
  setting: "indoor",
  effort: "gentle",
  needs: { car: false, booking: false, food: false, water: false },
  lifeStages: ["puppy", "adult", "senior"],
  keepsake: { family: "poster", theme: "ink" },
  role: "everyday",
  collections: [],
  access: "premium",
  ...o,
});
const previews = vi.hoisted(() => ({ items: [] as unknown[] }));
vi.mock("@/lib/usePreviews", () => ({
  usePreviews: () => ({
    status: "ready",
    data: { items: previews.items, total: 99, collections: 20 },
  }),
}));

const library = freeLibrary();
const ctx: Ctx = { dog: {}, owner: {}, unlocked: false };
const history: History = { done: new Set(), favorites: new Set(), skipped: new Set() };

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
  ent.status = "free";
  previews.items = [];
});
afterEach(cleanup);

describe("shortcut presets", () => {
  it("lists the ten requested shortcuts", () => {
    expect(SHORTCUTS.map((s) => s.label)).toEqual([
      "We have 10 minutes",
      "Rainy-day adventures",
      "No additional spending",
      "Weekend adventures",
      "Doggy dates",
      "Family adventures",
      "Gentle experiences",
      "Playful experiences",
      "Creative activities",
      "Surprise us",
    ]);
  });

  it("are presets of the existing filters", () => {
    expect(shortcutBySlug("ten-minutes")?.filters).toEqual({ minutes: 10, quick: true });
    expect(shortcutBySlug("rainy-day")?.filters).toEqual({ setting: "indoor", weather: "rain" });
    expect(shortcutBySlug("no-spend")?.filters).toEqual({ budget: 0 });
    expect(shortcutBySlug("doggy-dates")?.filters).toEqual({ collection: "doggy-date-club" });
    expect(shortcutBySlug("family")?.filters).toEqual({ household: ["family"] });
    expect(shortcutBySlug("gentle")?.filters).toEqual({ energy: ["gentle"], quiet: true });
    expect(shortcutBySlug("playful")?.filters).toEqual({ types: ["play-and-games"] });
    expect(shortcutBySlug("creative")?.filters).toEqual({ types: ["creative-projects"] });
    expect(shortcutBySlug("surprise")?.surprise).toBe(true);
  });

  it("only ever return adventures that match the preset", () => {
    for (const s of SHORTCUTS.filter((x) => !x.surprise)) {
      const r = rank(library, ctx, s.filters, history, { seed: "t" });
      if (!r.ok) continue;
      for (const x of refineAdventures(s, r.ranked)) {
        if (s.slug === "no-spend") expect(x.adventure.costMax).toBe(0);
        if (s.slug === "weekend") expect(x.adventure.minutesMax).toBeGreaterThanOrEqual(60);
        if (s.slug === "ten-minutes") expect(x.adventure.minutesMin).toBeLessThanOrEqual(10);
        if (s.slug === "rainy-day") expect(x.adventure.avoidWeather).not.toContain("rain");
        if (s.slug === "gentle") expect(x.adventure.energy).toBe("gentle");
      }
    }
  });

  it("apply hard suitability first: a senior dog never gets a puppy-only adventure", () => {
    const r = rank(library, { ...ctx, dog: { lifeStage: "senior" } }, {}, history, { seed: "t" });
    if (r.ok) for (const x of r.ranked) expect(x.adventure.lifeStages).toContain("senior");
  });

  it("filter previews with the same fields the previews page uses", () => {
    const items = [
      item({ id: "adv-a", setting: "indoor" }),
      item({ id: "adv-b", setting: "outdoor", costMax: 5 }),
      item({ id: "adv-c", minutesMin: 5, minutesMax: 10, effort: "lively" }),
    ];
    const ids = (slug: string) =>
      previewMatches(shortcutBySlug(slug)!, items)
        .map((i) => i.id)
        .sort();
    expect(ids("rainy-day")).toEqual(["adv-a", "adv-c"]);
    expect(ids("no-spend")).toEqual(["adv-a", "adv-c"]);
    expect(ids("ten-minutes")).toEqual(["adv-c"]);
    expect(ids("gentle")).toEqual(["adv-a", "adv-b"]);
    expect(ids("family")).toEqual([]);
  });
});

describe("shortcut tiles", () => {
  it("free visitors: a preview-backed tile shows public previews only", () => {
    previews.items = [item({ id: "adv-zzzzzz", title: "Public Teaser Title" })];
    render(<Shortcuts />);
    fireEvent.click(screen.getByRole("button", { name: /Rainy-day adventures/ }));
    const region = screen.getByRole("region", { name: "Rainy-day adventures" });
    expect(within(region).getByText("Public Teaser Title")).toBeInTheDocument();
    expect(within(region).getByText(/1 of the 1 selected previews match/)).toBeInTheDocument();
    // no premium action or full-card content
    expect(within(region).queryByText(/Reveal|instructions/i)).toBeNull();
  });

  it("free visitors: Surprise us and Family go to the free intro quiz, not premium content", () => {
    render(<Shortcuts />);
    for (const name of [/Surprise us/, /Family adventures/]) {
      fireEvent.click(screen.getByRole("button", { name }));
      const link = screen.getByRole("link", { name: "Find our first adventure" });
      expect(link.getAttribute("href")).toBe("/discover");
      expect(screen.queryByRole("article")).toBeNull();
      fireEvent.click(screen.getByRole("button", { name }));
    }
  });

  it("entitled: shows an honest count from the engine and the matching adventures", () => {
    ent.status = "entitled";
    setProfile({ name: "Pip" });
    render(<Shortcuts />);
    fireEvent.click(screen.getByRole("button", { name: /No additional spending/ }));
    const s = shortcutBySlug("no-spend")!;
    const r = rank(
      library,
      { dog: { name: "Pip" }, owner: {}, unlocked: true },
      s.filters,
      history,
      {
        seed: "t",
      },
    );
    const n = r.ok ? refineAdventures(s, r.ranked).length : 0;
    expect(n).toBeGreaterThan(0);
    const region = screen.getByRole("region", { name: "No additional spending" });
    expect(within(region).getByText(/that suit Pip/).textContent).toContain(`${n} `);
  });

  it("entitled: Surprise us shows a mystery card first (the shared reveal surface)", () => {
    ent.status = "entitled";
    render(<Shortcuts />);
    fireEvent.click(screen.getByRole("button", { name: /Surprise us/ }));
    expect(screen.getByRole("article", { name: "Mystery adventure" })).toBeInTheDocument();
    expect(screen.getByText("Scratch or tap to reveal.")).toBeInTheDocument();
  });
});
