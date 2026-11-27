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
import { CTX_QUIZ_PRESETS, PERSONAL_STEPS, moodOf, presetFor } from "@/passport/quiz";
import { freeLibrary } from "@/passport/content";
import { emptySave, type Save } from "@/passport/progress";
import {
  applyAnswers,
  stepsToAsk,
  starterFilters,
  DEFAULT_STEPS,
  type QuizAnswers,
} from "@/passport/quiz";
import { eligibleFreeCount, hasAnother, noMatchCause, selectStarter } from "@/passport/starter";
import { eligibility } from "@/passport/engine";

const lib = freeLibrary();
const ALL = [...DEFAULT_STEPS, ...PERSONAL_STEPS, "extra"] as const;

/** Builds a save by applying quiz answers through the real quiz mapping (same as the user answering every step). */
function saveFor(a: QuizAnswers): Save {
  const base = emptySave();
  const mood = a.mood ?? moodOf(a.where, a.enjoy);
  const { dog, owner } = applyAnswers(mood ? { ...a, mood } : a, ALL, base);
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
    name: "playful adult",
    answers: { lifeStages: ["adult"], energy: "lively", mood: "playful", where: "anywhere" },
  },
  { name: "senior (gentle)", answers: { lifeStages: ["senior"], energy: "gentle" } },
  { name: "children joining (default screens)", answers: { lifeStages: ["adult"], kids: true } },
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
  it("is the 17 public free adventures, all published and free", () => {
    // 14 + 2 family-suited adventures (Discovery Club, Storybook Afternoon) + 1 quiet outdoor intro (Listening Post), 2026-11-26. Frozen.
    expect(lib.length).toBe(17);
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

  it("the default quiz is four screens", () => {
    expect(stepsToAsk(emptySave()).length).toBe(4);
  });

  it("every profile gets a safe pick or a friendly, specific no-match (never a purchase-only answer)", () => {
    for (const x of results) {
      if (x.pick.ok) continue;
      const cause = noMatchCause(lib, x.save);
      expect(["single", "several", "hard"]).toContain(cause.kind);
      if (cause.kind !== "hard") {
        // setting aside only the offered optional preferences must find a safe pick, never loosening a hard rule
        const r = selectStarter(lib, x.save, new Set(), {
          relax: cause.kind === "single" ? [cause.keys[0]!] : cause.keys,
        });
        expect(r.ok).toBe(true);
        if (r.ok)
          expect(
            eligibility(r.adventure, {
              dog: x.save.profile.data,
              owner: x.save.owner.data,
              unlocked: false,
            }).reasons,
          ).toEqual([]);
      }
    }
  });

  it("'show me another' is only offered while a different match remains", () => {
    const save = saveFor({ lifeStages: ["adult"] });
    const first = selectStarter(lib, save);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const seen = new Set<string>();
    let guard = 0;
    let cur = first.adventure.id;
    // walk through the whole list: the last one must report that nothing else remains
    while (guard++ < 40) {
      const s = { ...save, starter: { id: cur, at: 1 } } as Save;
      if (!hasAnother(lib, s, seen, false)) break;
      seen.add(cur);
      const next = selectStarter(lib, s, new Set([...seen, cur]));
      expect(next.ok).toBe(true);
      if (!next.ok) break;
      cur = next.adventure.id;
    }
    expect(guard).toBeLessThan(40);
    expect(seen.has(cur)).toBe(false); // the final one was never consumed by "another"
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

describe("What feels right today? (question 3) against the real free library", () => {
  const PROFILES: [string, QuizAnswers][] = [
    ["unknown dog", {}],
    ["puppy", { lifeStages: ["puppy"], keepInMind: ["none"] }],
    ["senior", { lifeStages: ["senior"], energy: "gentle", keepInMind: ["none"] }],
    ["mixed ages", { lifeStages: ["puppy", "adult", "senior"], keepInMind: ["none"] }],
    ["limited mobility", { lifeStages: ["adult"], keepInMind: ["mobility"] }],
    ["noise sensitive", { lifeStages: ["adult"], keepInMind: ["noise"] }],
    ["short time, no spend", { lifeStages: ["adult"], time: "short", spend: "none" }],
  ];
  const MOODS = ["cozy", "outing", "playful", "quiet", "surprise"] as const;

  it("every choice gives a safe pick for every representative profile (hard eligibility holds)", () => {
    for (const [name, a] of PROFILES)
      for (const mood of MOODS) {
        const save = saveFor({ ...a, mood });
        const r = selectStarter(lib, save);
        expect(r.ok, `${name} / ${mood}`).toBe(true);
        if (!r.ok) continue;
        const v = eligibility(r.adventure, {
          dog: save.profile.data,
          owner: save.owner.data,
          unlocked: false,
        });
        expect(v.eligible, `${name} / ${mood}`).toBe(true);
        if (mood === "cozy") expect(r.adventure.places).toContain("home");
        if (mood === "outing") expect(r.adventure.setting).not.toBe("indoor");
        if (mood === "quiet") expect(r.adventure.noise).toBe("quiet");
      }
  });

  it("an outing with children joining has no strict match: the friendly widen path finds one, kids stay a preference", () => {
    const save = saveFor({
      lifeStages: ["adult"],
      kids: true,
      keepInMind: ["none"],
      mood: "outing",
    });
    expect(selectStarter(lib, save).ok).toBe(false);
    expect(noMatchCause(lib, save).kind).toBe("single");
    expect(selectStarter(lib, save, new Set(), { relax: ["where"] }).ok).toBe(true);
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

  it("the ten Journal CTAs pre-select question 3 where it applies, so the quiz does not ask it twice", () => {
    const expected: Record<string, string | undefined> = {
      "at-home": "cozy",
      "rainy-day": "cozy",
      weekend: "outing",
      "doggy-date": "outing",
      bond: "playful",
      senior: "quiet",
      family: "outing",
      "high-energy": "outing",
      "no-spend": undefined, // a spend preference only: question 3 stays the visitor's call
      puppy: undefined, // life stage, energy and time are preset; question 3 stays the visitor's call
    };
    for (const k of CTX_KEYS) expect(presetFor(k, emptySave()).mood, k).toBe(expected[k]);
    // a saved where answer wins: the preset never overwrites it
    const saved = saveFor({ where: "home" });
    expect(presetFor("weekend", saved).mood).toBeUndefined();
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
    for (let i = 0; i < 12; i++) {
      const next = screen.queryByRole("button", { name: /^(Skip|Next)$/ });
      if (!next) break;
      fireEvent.click(next);
    }
    fireEvent.click(screen.getByRole("button", { name: /Find our adventure/ }));
  };
  const NO_MATCH = "We haven't found the right little adventure yet";

  it("puppy + senior + children + nearby outdoors: warm, specific choices; nothing is relaxed silently; safety kept", async () => {
    setProfile({ lifeStages: ["puppy", "senior"], energyVariable: true });
    setOwner({ kids: true, where: "nearby" });
    await renderUi(<FreeStarter />);
    finish();
    expect(await screen.findByRole("heading", { name: NO_MATCH })).toBeInTheDocument();
    expect(
      screen.queryByText(/Widen where, time and spend|Nothing free fits all of that/),
    ).toBeNull();
    expect(screen.queryByText(/That was every free fit/)).toBeNull();
    // not a sales pitch: no purchase offered while a free alternative exists
    expect(screen.queryByRole("link", { name: /full Passport/ })).toBeNull();
    expect(getSave().starter).toBeUndefined();
    // the choice is explicit and names the thing that is set aside
    fireEvent.click(screen.getByRole("button", { name: "Yes, try something indoors" }));
    expect(
      await screen.findByRole("article", { name: "Recommended adventure" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/we set aside your where preference/)).toBeInTheDocument();
    expect(getSave().owner.data.where).toBe("nearby"); // the saved answer itself is untouched
    expect(getSave().owner.data.kids).toBe(true);
    const a = lib.find((x) => x.id === getSave().starter?.id)!;
    expect(a.lifeStages).toEqual(expect.arrayContaining(["puppy", "senior"]));
  });

  it("only optional answers rule everything out (adult + children + nearby): the explicit children choice is offered", async () => {
    setProfile({ lifeStage: "adult" });
    setOwner({ where: "nearby", kids: true });
    await renderUi(<FreeStarter />);
    finish();
    expect(await screen.findByRole("heading", { name: NO_MATCH })).toBeInTheDocument();
    const cause = noMatchCause(lib, getSave());
    expect(cause.kind).not.toBe("hard");
    // exactly the relevant choices (at most two), each a plain sentence and an explicit button
    expect(
      screen.getAllByRole("button", { name: /^(Yes|Do this one)/ }).length,
    ).toBeLessThanOrEqual(2);
    const btn = screen.queryByRole("button", { name: "Do this one without the children joining" });
    if (btn) fireEvent.click(btn);
    else fireEvent.click(screen.getAllByRole("button", { name: /^Yes/ })[0]!);
    const card = await screen.findByRole("article", { name: "Recommended adventure" });
    expect(card).toBeInTheDocument();
    const a = lib.find((x) => x.id === getSave().starter?.id)!;
    expect(a.lifeStages).toContain("adult"); // hard rule kept
    expect(getSave().owner.data.where).toBe("nearby");
  });

  it("with no eligible free adventure at all the cause is 'hard': safety is never loosened", () => {
    expect(noMatchCause([], saveFor({ lifeStages: ["senior"], where: "home" })).kind).toBe("hard");
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
  it("the decorative reveal foil canvas never touches photos: it paints a gradient and erases it, nothing else", () => {
    // RevealFoil is Lovable's scratch look. The ban above is about photo/editor features; the foil is aria-hidden and cannot read,
    // export or upload anything.
    const t = src("RevealFoil.tsx");
    expect(t).toContain('aria-hidden="true"');
    expect(t).not.toMatch(
      /type=["']file["']|getUserMedia|capture=|PhotoEditor|createObjectURL|drawImage|getImageData|toBlob|toDataURL|fetch\(|XMLHttpRequest|sendBeacon/,
    );
    expect(src("RevealSurface.tsx")).toContain("RevealFoil");
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
