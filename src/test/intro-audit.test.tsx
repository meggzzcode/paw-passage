// Pre-launch audit of the free visitor experience against the REAL free library (content/adventures).
// See docs/INTRO-AUDIT.md for the checklist this proves.
// Representative profiles run through the same engine/starter path the quiz uses. Set INTRO_AUDIT_TABLE=1 to print the table.
import { cleanup, fireEvent, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderUi } from "./collections-fixtures";
import { FreeStarter } from "@/components/passport/FreeStarter";
import { _resetForTests, getSave, setOwner, setProfile } from "@/passport/local-store";
import { CTX_KEYS } from "@/passport/journal-context";
import { CTX_QUIZ_PRESETS, presetFor } from "@/passport/quiz";
import { freeLibrary } from "@/passport/content";
import { emptySave, type Save } from "@/passport/progress";
import {
  applyAnswers,
  stepsToAsk,
  starterFilters,
  DEFAULT_STEPS,
  type QuizAnswers,
} from "@/passport/quiz";
import { eligibleFreeCount, selectStarter } from "@/passport/starter";
import { eligibility } from "@/passport/engine";

const lib = freeLibrary();
const ALL = [...DEFAULT_STEPS, "works", "extra"] as const;

/** Builds a save by applying quiz answers through the real quiz mapping (same as the user answering every step). */
function saveFor(a: QuizAnswers): Save {
  const base = emptySave();
  const { dog, owner } = applyAnswers(a, ALL, base);
  const clean = (o: object) =>
    Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
  return {
    ...base,
    profile: { data: clean(dog), at: 1 },
    owner: { data: clean(owner), at: 1 },
  } as Save;
}

type Row = { name: string; answers: QuizAnswers };
const ROWS: Row[] = [
  { name: "unknown dog (all skipped)", answers: {} },
  { name: "active adult", answers: { lifeStages: ["adult"], energy: "lively" } },
  { name: "young puppy", answers: { lifeStages: ["puppy"] } },
  {
    name: "senior limited mobility",
    answers: { lifeStages: ["senior"], keepInMind: ["mobility"] },
  },
  { name: "puppy+senior mixed", answers: { lifeStages: ["puppy", "senior"] } },
  { name: "apartment resident (home)", answers: { where: "home" } },
  { name: "owner seated", answers: { walking: "seated" } },
  { name: "family with children", answers: { kids: true } },
  { name: "no additional spending", answers: { spend: "none" } },
  { name: "ten minutes (short)", answers: { time: "short" } },
  { name: "no car", answers: { car: "no" } },
  { name: "quiet / noise sensitive", answers: { keepInMind: ["noise"], quiet: true } },
  { name: "variable energy", answers: { energy: "variable" } },
  {
    name: "puppy+limited mobility+quiet",
    answers: { lifeStages: ["puppy"], keepInMind: ["mobility", "noise"], quiet: true },
  },
  {
    name: "senior+seated+no spend+short+home",
    answers: {
      lifeStages: ["senior"],
      walking: "seated",
      spend: "none",
      time: "short",
      where: "home",
      keepInMind: ["mobility"],
    },
  },
  {
    name: "mixed ages+variable+kids+no car",
    answers: {
      lifeStages: ["puppy", "adult", "senior"],
      energy: "variable",
      kids: true,
      car: "no",
    },
  },
  {
    name: "everything restrictive",
    answers: {
      lifeStages: ["puppy", "senior"],
      keepInMind: ["mobility", "noise", "crowds", "dogs", "food", "water"],
      walking: "seated",
      stepFree: true,
      car: "no",
      quiet: true,
      kids: true,
      where: "home",
      time: "short",
      spend: "none",
    },
  },
];

function run(r: Row) {
  const save = saveFor(r.answers);
  const pick = selectStarter(lib, save);
  const relaxed = selectStarter(lib, save, new Set(), { relax: true });
  return {
    name: r.name,
    eligible: eligibleFreeCount(lib, save),
    pick,
    relaxed,
    save,
  };
}

describe("free pool", () => {
  it("is the 16 public free adventures, all published and free", () => {
    // 14 + 2 family-suited, puppy-and-senior-safe adventures added 2026-11-26 (Discovery Club, Storybook Afternoon).
    expect(lib.length).toBe(16);
    expect(lib.every((a) => a.access === "free" && a.status === "published")).toBe(true);
  });
});

describe("representative profiles", () => {
  const results = ROWS.map(run);
  it("prints the table when asked", () => {
    if (process.env["INTRO_AUDIT_TABLE"])
      for (const x of results)
        process.stderr.write(
          "\n" +
            `${x.name} | eligible=${x.eligible} | ${x.pick.ok ? `${x.pick.adventure.id} ${x.pick.adventure.title}` : `NONE(${x.pick.reason})`} | relaxed=${x.relaxed.ok ? x.relaxed.adventure.id : "NONE"}`,
        );
    expect(results.length).toBe(ROWS.length);
  });

  it("every recommendation is from the free pool and passes hard eligibility", () => {
    for (const x of results)
      if (x.pick.ok) {
        const a = x.pick.adventure;
        expect(lib.map((l) => l.id)).toContain(a.id);
        expect(a.access).toBe("free");
        const v = eligibility(a, {
          dog: x.save.profile.data,
          owner: x.save.owner.data,
          unlocked: false,
        });
        // a pick may still need one concise confirmation (held), but is never ruled out
        expect(v.reasons).toEqual([]);
      }
  });

  it("relaxing optional preferences never relaxes mandatory safety rules", () => {
    for (const x of results)
      if (x.relaxed.ok) {
        const v = eligibility(x.relaxed.adventure, {
          dog: x.save.profile.data,
          owner: x.save.owner.data,
          unlocked: false,
        });
        expect(v.reasons).toEqual([]);
      }
  });

  it("the default quiz is eight steps and the maximum is ten", () => {
    expect(stepsToAsk(emptySave()).length).toBe(8);
    expect(stepsToAsk(emptySave(), { extras: ["works", "extra"] }).length).toBe(10);
  });
});

vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({ status: "free", premium: [], signedIn: false, csrf: "", message: null }),
}));
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => <div /> }));

describe("relaxing optional preferences", () => {
  it("drops where/time/spend and children joining; no-car and quiet stay", () => {
    const owner = {
      where: "nearby",
      time: "short",
      spend: "none",
      hasCar: "no",
      quiet: true,
      kids: true,
    } as const;
    expect(starterFilters(owner)).toMatchObject({ setting: "outdoor", minutes: 15, budget: 0 });
    expect(starterFilters(owner, { relax: true })).toEqual({
      transport: "none-or-walk",
      quiet: true,
    });
    expect(starterFilters(owner).household).toEqual(["family"]); // strict pass still narrows to family-suited
    expect(
      starterFilters({ where: "home", time: "short", spend: "none" }, { relax: true }),
    ).toEqual({});
  });

  it("a relaxed pick still prefers a family-suited adventure when one fits", () => {
    const save = saveFor({ lifeStages: ["adult"], where: "nearby", kids: true });
    const r = selectStarter(lib, save, new Set(), { relax: true });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.adventure.household).toContain("family");
      expect(r.why).toContain("Suited to families with children");
    }
  });

  it("mixed ages with children: two free family-suited adventures now fit strictly", () => {
    const save = saveFor({ lifeStages: ["puppy", "senior"], kids: true, energy: "variable" });
    const strict = selectStarter(lib, save);
    expect(strict.ok).toBe(true);
    if (strict.ok) expect(strict.adventure.household).toContain("family");
  });

  it("mixed ages with children and nearby outdoors: no free outdoor family fit strictly, widening finds a safe one", () => {
    const save = saveFor({
      lifeStages: ["puppy", "senior"],
      kids: true,
      energy: "variable",
      where: "nearby",
    });
    expect(selectStarter(lib, save).ok).toBe(false);
    const r = selectStarter(lib, save, new Set(), { relax: true });
    expect(r.ok).toBe(true);
    if (r.ok) {
      // hard eligibility was never relaxed
      const v = eligibility(r.adventure, {
        dog: save.profile.data,
        owner: save.owner.data,
        unlocked: false,
      });
      expect(v.eligible).toBe(true);
      expect(r.adventure.lifeStages).toEqual(expect.arrayContaining(["puppy", "senior"]));
    }
  });
});

describe("Journal context presets", () => {
  it("all ten keys have a preset, prefill empty answers and never overwrite saved ones", () => {
    expect(CTX_KEYS.length).toBe(10);
    for (const k of CTX_KEYS) {
      expect(CTX_QUIZ_PRESETS[k]).toBeDefined();
      const fresh = presetFor(k, emptySave());
      expect(Object.keys(fresh).length).toBeGreaterThan(0);
      const saved = saveFor({
        lifeStages: ["adult"],
        energy: "moderate",
        enjoy: ["food"],
        where: "anywhere",
        time: "longer",
        spend: "flexible",
        walking: "long-walk",
        kids: true,
        quiet: true,
      });
      expect(presetFor(k, saved)).toEqual({});
      expect(fresh.keepInMind).toBeUndefined(); // safety answers are never preset
    }
  });
});

describe("empty results in the page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    _resetForTests();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });
  const finish = () => {
    fireEvent.click(screen.getByRole("button", { name: "Find Our First Adventure" }));
    for (let i = 0; i < 12; i++) {
      const next = screen.queryByRole("button", { name: /^(Skip|Next)$/ });
      if (!next) break;
      fireEvent.click(next);
    }
    fireEvent.click(screen.getByRole("button", { name: /Find our adventure/ }));
  };

  it("puppy + senior + children + nearby outdoors: nothing strictly fits, widening is offered, says what was set aside and keeps safety", async () => {
    setProfile({ lifeStages: ["puppy", "senior"], energyVariable: true });
    setOwner({ kids: true, where: "nearby" });
    await renderUi(<FreeStarter />);
    finish();
    expect(
      await screen.findByRole("heading", { name: "Nothing free fits all of that" }),
    ).toBeInTheDocument();
    // not a sales pitch: one secondary mention of the full Passport
    expect(screen.getAllByRole("link", { name: "See the full Passport" })).toHaveLength(1);
    expect(screen.queryByText(/Want more little adventures/)).toBeNull();
    expect(getSave().starter).toBeUndefined();
    fireEvent.click(
      screen.getByRole("button", { name: "Widen where, time, spend and children joining" }),
    );
    expect(
      await screen.findByRole("article", { name: "Recommended adventure" }),
    ).toBeInTheDocument();
    // a family-suited adventure now fits, so children joining is NOT set aside; only where/time/spend were widened
    expect(screen.getByText(/We widened your where, time and spend answers/)).toBeInTheDocument();
    expect(screen.queryByText(/children-joining preference/)).toBeNull();
    expect(getSave().owner.data.kids).toBe(true); // the saved answer itself is untouched
    const a = lib.find((x) => x.id === getSave().starter?.id)!;
    expect(a.household).toContain("family");
    expect(a.lifeStages).toEqual(expect.arrayContaining(["puppy", "senior"]));
  });

  it("only optional answers rule everything out (adult + children + nearby outdoors): offers widening, keeps hard rules", async () => {
    setProfile({ lifeStage: "adult" });
    setOwner({ where: "nearby", kids: true });
    await renderUi(<FreeStarter />);
    finish();
    expect(
      await screen.findByRole("heading", { name: "Nothing free fits all of that" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Want more little adventures/)).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Widen where, time, spend and children joining" }),
    );
    expect(
      await screen.findByRole("article", { name: "Recommended adventure" }),
    ).toBeInTheDocument();
    const id = getSave().starter?.id;
    const a = lib.find((x) => x.id === id)!;
    expect(a.lifeStages).toContain("adult"); // hard rule kept
    expect(a.household).toContain("family"); // a family-suited adventure still ranks first when one fits
    expect(getSave().owner.data.where).toBe("nearby"); // the saved answer itself is untouched
  });
});

describe("the free flow stays free, static and offline", () => {
  const src = (f: string) => readFileSync(`src/components/passport/${f}`, "utf8");
  it("has no uploader, camera, canvas or editor in the free flow files", () => {
    for (const f of [
      "FreeStarter.tsx",
      "IntroQuiz.tsx",
      "KeepsakeUnlock.tsx",
      "RevealSurface.tsx",
      "PreviewMatch.tsx",
    ]) {
      const t = src(f);
      expect(t, f).not.toMatch(
        /type=["']file["']|getUserMedia|capture=|<canvas|PhotoEditor|createObjectURL/,
      );
    }
  });
  it("the quiz and starter modules make no network call and ask for no account, email or card", () => {
    for (const f of [
      "src/passport/quiz.ts",
      "src/passport/starter.ts",
      "src/components/passport/IntroQuiz.tsx",
    ]) {
      const t = readFileSync(f, "utf8");
      expect(t, f).not.toMatch(/\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket/);
    }
    for (const f of ["FreeStarter.tsx", "IntroQuiz.tsx"])
      expect(src(f), f).not.toMatch(/type=["']email["']|type=["']password["']|card number/i);
  });
});
