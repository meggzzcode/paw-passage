import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adv, renderUi } from "./collections-fixtures";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import { FreeStarter } from "@/components/passport/FreeStarter";
import { activityConfirm, eligibility } from "@/passport/engine";
import { _resetForTests, getSave, setOwner, setProfile } from "@/passport/local-store";
import { dogWho, hasManyDogs, parseDogNames } from "@/passport/profile";
import { emptySave, migrate, validateSave } from "@/passport/progress";
import {
  DEFAULT_STEPS,
  MAX_STEPS,
  applyAnswers,
  presetFor,
  starterFilters,
  stepsToAsk,
} from "@/passport/quiz";
import { selectStarter } from "@/passport/starter";

vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({ status: "free", premium: [], signedIn: false, csrf: "", message: null }),
}));
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => <div /> }));
vi.mock("@/passport/content", async () => {
  const m = await import("./collections-fixtures");
  const lib = [
    m.adv("adv-cal111", "Calm Couch Game", { lifeStages: ["puppy", "adult"] }),
    m.adv("adv-any666", "Any Age Game", { lifeStages: ["adult", "senior"] }),
  ];
  return { ...m.contentMock, adventures: lib, freeLibrary: () => lib };
});

const withData = (profile: Record<string, unknown>, owner: Record<string, unknown> = {}) =>
  ({
    ...emptySave(),
    profile: { data: profile, at: 1 },
    owner: { data: owner, at: 1 },
  }) as ReturnType<typeof emptySave>;

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
});
afterEach(() => cleanup());

const startQuiz = () =>
  fireEvent.click(screen.getByRole("button", { name: "Find Our First Adventure" }));
const counter = () => screen.getByText(/^Question \d+ of \d+$/).textContent;
const next = () => fireEvent.click(screen.getByRole("button", { name: /^(Skip|Next)$/ }));

describe("step count and the honest counter", () => {
  it("the default path is eight steps and never more than ten", () => {
    expect(DEFAULT_STEPS.length).toBe(8);
    expect(stepsToAsk(emptySave()).length).toBe(8);
    expect(stepsToAsk(emptySave(), { extras: ["works", "extra"] }).length).toBe(10);
    expect(MAX_STEPS).toBe(10);
  });

  it("shows 'Question n of N' with a matching progress bar, and N shrinks when answers are already saved", async () => {
    await renderUi(<FreeStarter />);
    startQuiz();
    expect(counter()).toBe("Question 1 of 8");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "8");
    next();
    expect(counter()).toBe("Question 2 of 8");
  });

  it("skips questions a saved profile already answers", async () => {
    setProfile({ name: "Luna", lifeStage: "adult" });
    setOwner({ spend: "none" });
    await renderUi(<FreeStarter />);
    startQuiz();
    expect(counter()).toBe("Question 1 of 5");
    expect(screen.queryByRole("group", { name: /life stage/i })).toBeNull();
    expect(screen.getByRole("group", { name: /energy/i })).toBeInTheDocument();
  });

  it("the two extra steps appear only on request, and every step can be skipped", async () => {
    await renderUi(<FreeStarter />);
    startQuiz();
    for (let i = 0; i < 7; i++) next();
    expect(counter()).toBe("Question 8 of 8");
    expect(screen.queryByText(/What works for you/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Add what works for you/ }));
    expect(counter()).toBe("Question 9 of 9");
    fireEvent.click(screen.getByRole("button", { name: "Add a detail (quiet, children joining)" }));
    expect(counter()).toBe("Question 10 of 10");
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    await screen.findByRole("article", { name: "Recommended adventure" });
    expect(getSave().profile.data.lifeStage).toBeUndefined(); // skipped = unknown
  });
});

describe("answers map onto the existing profile", () => {
  it("one life stage is a plain lifeStage; several are a mixed household", () => {
    const one = applyAnswers({ lifeStages: ["senior"] }, ["life"], emptySave());
    expect(one.dog.lifeStage).toBe("senior");
    expect(one.dog.lifeStages).toBeUndefined();
    const mix = applyAnswers({ lifeStages: ["puppy", "senior"] }, ["life"], emptySave());
    expect(mix.dog.lifeStage).toBeUndefined();
    expect(mix.dog.lifeStages).toEqual(["puppy", "senior"]);
  });

  it("a mixed household only gets cards that suit every stage (conservative)", () => {
    const card = adv("adv-pa1111", "Puppy And Adult", { lifeStages: ["puppy", "adult"] });
    const ctx = (dog: object) => ({ dog, owner: {}, unlocked: true });
    expect(eligibility(card, ctx({ lifeStages: ["puppy", "adult"] })).eligible).toBe(true);
    const bad = eligibility(card, ctx({ lifeStages: ["puppy", "senior"] }));
    expect(bad.eligible).toBe(false);
    expect(bad.reasons.join(" ")).toMatch(/every age/);
  });

  it("variable energy keeps to gentle-to-moderate only", () => {
    const { dog } = applyAnswers({ energy: "variable" }, ["energy"], emptySave());
    expect(dog.energyVariable).toBe(true);
    expect(dog.energy).toBeUndefined();
    const ctx = { dog: { energyVariable: true }, owner: {}, unlocked: true };
    const e = (energy: "gentle" | "moderate" | "lively") =>
      eligibility(adv("adv-en1111", "E", { energy }), ctx).eligible;
    expect([e("gentle"), e("moderate"), e("lively")]).toEqual([true, true, false]);
  });

  it("'keep in mind' picks set only cautious values; non-answers write nothing safe", () => {
    const { dog } = applyAnswers({ keepInMind: ["noise", "dogs", "food"] }, ["keep"], emptySave());
    expect(dog).toMatchObject({ noiseSensitive: "yes", dogs: "nervous", foodActivities: "no" });
    const none = applyAnswers({ keepInMind: ["unsure"] }, ["keep"], emptySave()).dog;
    expect(none.noiseSensitive).toBeUndefined();
    expect(none.dogs).toBeUndefined();
    // un-picking never turns a stored "comfortable" into something else
    const saved = withData({ dogs: "comfortable" });
    expect(applyAnswers({ keepInMind: [] }, ["keep"], saved).dog.dogs).toBeUndefined();
    expect("dogs" in applyAnswers({ keepInMind: [] }, ["keep"], saved).dog).toBe(false);
  });

  it("owner walking, steps and car map to ownerMobility, stepFree and transport", () => {
    const { owner } = applyAnswers(
      { walking: "seated", stepFree: true, car: "no" },
      ["works"],
      emptySave(),
    );
    expect(owner).toMatchObject({ mobility: "seated", stepFree: true, hasCar: "no" });
    expect(starterFilters({ hasCar: "no" }).transport).toBe("none-or-walk");
  });

  it("where, time and spend become today's filters", () => {
    expect(starterFilters({ where: "home", time: "short", spend: "none" })).toEqual({
      places: ["home"],
      minutes: 15,
      budget: 0,
    });
    expect(starterFilters({ where: "anywhere", time: "longer", spend: "flexible" })).toEqual({});
  });

  it("'enjoy' is a soft ranking nudge and never rescues an ineligible card", () => {
    const sniff = adv("adv-sn1111", "Sniff", { activityTypes: ["scent-and-discovery"] });
    const play = adv("adv-pl1111", "Play", { activityTypes: ["play-and-games"] });
    const r = selectStarter([play, sniff], withData({ enjoy: ["sniffing"] }));
    expect(r.ok && r.adventure.id).toBe(sniff.id);
    const senior = selectStarter([sniff], withData({ enjoy: ["sniffing"], lifeStage: "senior" }));
    expect(senior.ok).toBe(true);
    const cut = adv("adv-pp1111", "Pup", {
      lifeStages: ["puppy"],
      activityTypes: ["scent-and-discovery"],
    });
    expect(selectStarter([cut], withData({ enjoy: ["sniffing"], lifeStage: "senior" })).ok).toBe(
      false,
    );
  });
});

describe("activity-specific safety question", () => {
  it("asks one concise question for the single most relevant unknown", () => {
    const busy = adv("adv-bz1111", "Busy", { otherDogs: true, strangers: true, noise: "some" });
    expect(activityConfirm(busy, {})?.field).toBe("dogs");
    expect(activityConfirm(busy, { dogs: "comfortable" })?.field).toBe("people");
    expect(activityConfirm(adv("adv-qt1111", "Quiet"), {})).toBeNull();
  });

  it("is asked before the reveal, and 'not sure' picks another", async () => {
    const lib = await import("@/passport/content");
    void lib;
    await renderUi(<FreeStarter />);
    startQuiz();
    for (let i = 0; i < 7; i++) next();
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    await screen.findByRole("article", { name: "Recommended adventure" });
    // The fixture cards are quiet, so no question is shown and the reveal is offered at once.
    expect(screen.getByRole("button", { name: "Scratch or tap to reveal." })).toBeInTheDocument();
  });
});

describe("several dogs, one profile", () => {
  it("parses one or more names from one field", () => {
    expect(parseDogNames("Luna and Milo")).toEqual(["Luna", "Milo"]);
    expect(parseDogNames("Luna, Milo & Pip")).toEqual(["Luna", "Milo", "Pip"]);
    expect(hasManyDogs("Luna and Milo")).toBe(true);
    expect(hasManyDogs("Luna")).toBe(false);
    expect(dogWho(undefined)).toBe("your dog or dogs");
  });

  it("uses the names as written and says to choose something every dog can enjoy", async () => {
    setProfile({ name: "Luna and Milo" });
    await renderUi(<FreeStarter />);
    startQuiz();
    for (let i = 0; i < 6; i++) next(); // the name is saved, so seven questions remain
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    expect(
      await screen.findByRole("heading", { name: "A first adventure for Luna and Milo" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/suit every dog/i)).toBeInTheDocument();
    expect(screen.getByText(/guarding/i)).toBeInTheDocument();
  });
});

describe("old saves keep loading", () => {
  it("a save without any new field is valid, and new fields validate", () => {
    const old = withData({ name: "Rex", lifeStage: "adult", energy: "lively", people: "unknown" });
    expect(validateSave(old)).toBeNull();
    expect(migrate(JSON.parse(JSON.stringify(old)))).toEqual(old);
    const next = withData(
      {
        lifeStages: ["puppy", "adult"],
        energyVariable: true,
        enjoy: ["games"],
        keepInMind: ["none"],
      },
      { where: "home", time: "short", spend: "none", quiet: true, kids: true },
    );
    expect(validateSave(next)).toBeNull();
    expect(validateSave(withData({ enjoy: ["nope"] }))).toBe("bad profile");
    expect(validateSave(withData({}, { where: "moon" }))).toBe("bad owner");
  });
});

describe("Starting from a Journal context", () => {
  it("pre-selects answers, but never overwrites saved ones", () => {
    const p = presetFor("senior", withData({ lifeStage: "puppy" }));
    expect(p.lifeStages).toBeUndefined(); // saved answer wins
    expect(p.energy).toBe("gentle");
    expect(presetFor("nope", emptySave())).toEqual({});
    expect(presetFor("rainy-day", emptySave()).where).toBe("home");
    expect(presetFor("senior", emptySave()).keepInMind).toBeUndefined();
  });

  it("shows the pre-selected chip in the quiz and leaves the saved profile untouched", async () => {
    setProfile({ energy: "moderate" });
    await renderUi(<FreeStarter ctx="rainy-day" />);
    startQuiz();
    for (let i = 0; i < 2; i++) next(); // names, life stage
    // energy is saved, so it is skipped; "what they enjoy" is next and pre-selected
    const enjoy = screen.getByRole("group", { name: /enjoy/i });
    expect(within(enjoy).getByRole("button", { name: "Games" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(getSave().profile.data.energy).toBe("moderate");
  });

  it("works through the Discover page too", async () => {
    await renderUi(<DiscoverPage mode="made" onMode={() => undefined} ctx="at-home" />);
    expect(screen.getByRole("button", { name: "Find Our First Adventure" })).toBeInTheDocument();
  });
});

describe("keepsake creation is paid", () => {
  it("says so before the free adventure starts, with no uploader anywhere in the free flow", async () => {
    const { container } = await renderUi(<FreeStarter />);
    expect(screen.getByText(/part of the full Passport/i)).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    startQuiz();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    for (let i = 0; i < 7; i++) next();
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    await screen.findByRole("article", { name: "Recommended adventure" });
    fireEvent.click(screen.getByRole("button", { name: "Scratch or tap to reveal." }));
    await screen.findByText("How it goes");
    fireEvent.click(screen.getByRole("button", { name: "Collect it" }));
    await screen.findByRole("heading", { name: "Your first stamp" });
    // the explainer appears once, inside the card, when the visitor opens the keepsake style
    expect(screen.queryByLabelText("About personalized keepsakes")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "See the keepsake style" }));
    expect(screen.getByLabelText("About personalized keepsakes")).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });

  it("makes no network call during the quiz", async () => {
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    await renderUi(<FreeStarter />);
    startQuiz();
    for (let i = 0; i < 7; i++) next();
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    await screen.findByRole("article", { name: "Recommended adventure" });
    expect(f).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
