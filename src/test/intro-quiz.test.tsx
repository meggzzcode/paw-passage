import { cleanup, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adv, renderUi } from "./collections-fixtures";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import { FreeStarter } from "@/components/passport/FreeStarter";
import { activityConfirm, eligibility } from "@/passport/engine";
import { _resetForTests, getSave, setOwner, setProfile } from "@/passport/local-store";
import { dogWho, hasManyDogs, parseDogNames, type DogProfile } from "@/passport/profile";
import { emptySave, migrate, validateSave } from "@/passport/progress";
import {
  DEFAULT_STEPS,
  MAX_STEPS,
  PERSONAL_STEPS,
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
  window.sessionStorage.clear();
  window.history.replaceState(null, "");
  window.localStorage.clear();
  _resetForTests();
});
afterEach(() => cleanup());

const counter = () => screen.getByText(/^Question \d+ of \d+$/).textContent;
const next = () => fireEvent.click(screen.getByRole("button", { name: /^(Skip|Next)$/ }));
const pickChip = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const heading = () => screen.getByRole("heading", { level: 2 }).textContent;
/** From the first question: skip the three single-choice screens, then find the adventure. */
const finish = () => {
  for (let i = 0; i < 3; i++) next();
  fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
};

describe("step count and the honest counter", () => {
  it("the default path is four screens; the optional refinements add none", () => {
    expect(DEFAULT_STEPS).toEqual(["life", "energy", "mood", "keep"]);
    expect(stepsToAsk(emptySave()).length).toBe(4);
    expect(PERSONAL_STEPS.length).toBeGreaterThan(0);
    expect(MAX_STEPS).toBe(10);
  });

  it("shows 'Question n of 4' with a matching progress bar, and N shrinks when answers are already saved", async () => {
    await renderUi(<FreeStarter />);
    expect(counter()).toBe("Question 1 of 4");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "4");
    next();
    expect(counter()).toBe("Question 2 of 4");
  });

  it("skips questions a saved profile already answers", async () => {
    setProfile({ lifeStage: "adult" });
    setOwner({ where: "home" });
    await renderUi(<FreeStarter />);
    expect(counter()).toBe("Question 1 of 2");
    expect(screen.queryByRole("group", { name: /sidekick/i })).toBeNull();
    expect(screen.getByRole("group", { name: /vibe/i })).toBeInTheDocument();
  });
});

describe("single-choice screens move on by themselves", () => {
  it("auto-advances on tap with one heading and a labelled group (nothing is read twice)", async () => {
    await renderUi(<FreeStarter />);
    expect(heading()).toBe("Who is your little sidekick?");
    const group = screen.getByRole("group", { name: "Who is your little sidekick?" });
    expect(group.querySelector("legend")).toBeNull();
    expect(group).toHaveAttribute("aria-labelledby", screen.getByRole("heading", { level: 2 }).id);
    fireEvent.click(within(group).getByRole("button", { name: "Senior" }));
    expect(counter()).toBe("Question 2 of 4");
    expect(heading()).toBe("What's their usual vibe?");
    pickChip("Lively");
    expect(heading()).toBe("What are we in the mood for?");
    pickChip("A little outdoor adventure");
    expect(heading()).toBe("Anything we should keep in mind?");
    // the last screen is multi-select: nothing moves on until the explicit button
    pickChip("Noise");
    pickChip("Crowds");
    expect(heading()).toBe("Anything we should keep in mind?");
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    expect(getSave().profile.data).toMatchObject({
      lifeStage: "senior",
      energy: "lively",
      noiseSensitive: "yes",
      crowds: "nervous",
    });
    expect(getSave().owner.data.where).toBe("nearby");
  });

  it("moves focus to the question heading on every move, without trapping", async () => {
    await renderUi(<FreeStarter />);
    pickChip("Adult");
    expect(document.activeElement).toBe(screen.getByRole("heading", { level: 2 }));
    expect(document.activeElement).toHaveAttribute("tabindex", "-1");
  });

  it("offers a visible Back on every later screen, and a 44px-friendly chip class", async () => {
    await renderUi(<FreeStarter />);
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
    pickChip("Adult");
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("the mixed answer is one conservative shared profile covering every age", async () => {
    await renderUi(<FreeStarter />);
    pickChip("A mix of ages");
    expect(screen.getByText("Question 2 of 4")).toBeInTheDocument();
    finishRest();
    await screen.findByRole("heading", { level: 1, name: /adventure/i });
    expect(getSave().profile.data.lifeStages).toEqual(["puppy", "adult", "senior"]);
  });
  const finishRest = () => {
    next();
    next();
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
  };
});

describe("Back and reload inside the quiz", () => {
  it("the Back button steps back inside the quiz, keeping the answer", async () => {
    await renderUi(<FreeStarter />);
    pickChip("Senior");
    expect(counter()).toBe("Question 2 of 4");
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    await waitFor(() => expect(counter()).toBe("Question 1 of 4"));
    expect(screen.getByRole("button", { name: "Senior" })).toHaveAttribute("aria-pressed", "true");
  });

  it("the browser's Back steps back a question (history state), staying on the page", async () => {
    await renderUi(<FreeStarter />);
    pickChip("Adult");
    pickChip("Lively");
    expect(counter()).toBe("Question 3 of 4");
    window.history.back();
    await waitFor(() => expect(counter()).toBe("Question 2 of 4"));
    window.history.back();
    await waitFor(() => expect(counter()).toBe("Question 1 of 4"));
    expect(screen.getByRole("button", { name: "Adult" })).toHaveAttribute("aria-pressed", "true");
  });

  it("a reload mid-quiz resumes the same question with the answers kept", async () => {
    const first = await renderUi(<FreeStarter />);
    pickChip("Senior");
    pickChip("Gentle");
    expect(counter()).toBe("Question 3 of 4");
    first.unmount(); // a reload: the page state is gone, the history entry and session storage remain
    _resetForTests();
    await renderUi(<FreeStarter />);
    expect(counter()).toBe("Question 3 of 4");
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    await waitFor(() => expect(counter()).toBe("Question 2 of 4"));
    expect(screen.getByRole("button", { name: "Gentle" })).toHaveAttribute("aria-pressed", "true");
  });

  it("a fresh visit does not resume an old, finished quiz", async () => {
    window.sessionStorage.setItem(
      "pp.quiz.draft.v1",
      JSON.stringify({ draft: { energy: "lively" }, open: false, mode: "first" }),
    );
    await renderUi(<FreeStarter />);
    expect(counter()).toBe("Question 1 of 4");
    expect(screen.queryByRole("button", { name: "Lively" })).toBeNull();
  });
});

describe("the optional refinements sit behind one control and add no screens", () => {
  it("'Make it more personal (optional)' opens names, time, budget, transport, walking and interests", async () => {
    await renderUi(<FreeStarter />);
    pickChip("Adult");
    next();
    next();
    expect(screen.queryByLabelText("Your dog's name, or names")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Make it more personal (optional)" }));
    fireEvent.change(screen.getByLabelText("Your dog's name, or names"), {
      target: { value: "Luna and Milo" },
    });
    pickChip("Short (about 15 min)");
    pickChip("Nothing");
    pickChip("No car");
    pickChip("Step-free routes only");
    pickChip("Sniffing");
    expect(counter()).toBe("Question 4 of 4");
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    expect(getSave().profile.data.name).toBe("Luna and Milo");
    expect(getSave().owner.data).toMatchObject({
      time: "short",
      spend: "none",
      hasCar: "no",
      stepFree: true,
    });
    expect(getSave().profile.data.enjoy).toEqual(["sniffing"]);
  });

  it("left closed, nothing optional is written (skipped means unknown)", async () => {
    await renderUi(<FreeStarter />);
    finish();
    await screen.findByRole("article", { name: "Recommended adventure" });
    const o = getSave().owner.data;
    expect(o.time).toBeUndefined();
    expect(o.spend).toBeUndefined();
    expect(o.hasCar).toBeUndefined();
    expect(getSave().profile.data.name).toBeUndefined();
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

  it("the safety fields stay distinct: each option writes only its own field", () => {
    const one = (k: "mobility" | "food" | "noise" | "crowds" | "dogs" | "exercise") =>
      applyAnswers({ keepInMind: [k] }, ["keep"], emptySave()).dog;
    expect(one("noise")).toEqual({ keepInMind: ["noise"], noiseSensitive: "yes" });
    expect(one("crowds")).toEqual({ keepInMind: ["crowds"], crowds: "nervous" });
    expect(one("dogs")).toEqual({ keepInMind: ["dogs"], dogs: "nervous" });
    expect(one("food")).toEqual({ keepInMind: ["food"], foodActivities: "no" });
    expect(one("mobility")).toEqual({ keepInMind: ["mobility"], limitedMobility: true });
    expect(one("exercise")).toEqual({ keepInMind: ["exercise"], limitedMobility: true });
  });

  it("'not sure' stays unknown, never safe; 'nothing in particular' confirms only the options shown and never overrides a cautious answer", () => {
    const unsure = applyAnswers({ keepInMind: ["unsure"] }, ["keep"], emptySave()).dog;
    expect(unsure).toEqual({ keepInMind: ["unsure"] });
    const none = applyAnswers({ keepInMind: ["none"] }, ["keep"], emptySave()).dog;
    expect(none).toMatchObject({
      noiseSensitive: "no",
      crowds: "comfortable",
      dogs: "comfortable",
    });
    expect(none.people).toBeUndefined(); // not asked on this screen: stays unknown
    expect(none.water).toBeUndefined();
    const careful = applyAnswers(
      { keepInMind: ["none"] },
      ["keep"],
      withData({ noiseSensitive: "yes", dogs: "nervous" }),
    ).dog;
    expect(careful.noiseSensitive).toBeUndefined(); // not rewritten: the saved cautious value stands
    expect(careful.dogs).toBeUndefined();
    expect(careful.crowds).toBe("comfortable");
  });

  it("an activity that depends on an unknown field still asks (held), whatever 'not sure' says", () => {
    const dog = applyAnswers({ keepInMind: ["unsure"] }, ["keep"], emptySave()).dog;
    const busy = adv("adv-bz2222", "Busy", { otherDogs: true });
    expect(activityConfirm(busy, dog as DogProfile)?.field).toBe("dogs");
  });

  it("children joining is an owner preference on the same screen; mood maps onto where and enjoy", () => {
    expect(applyAnswers({ kids: true }, ["keep"], emptySave()).owner.kids).toBe(true);
    expect(applyAnswers({ mood: "cozy" }, ["mood"], emptySave()).owner.where).toBe("home");
    expect(applyAnswers({ mood: "outdoor" }, ["mood"], emptySave()).owner.where).toBe("nearby");
    const play = applyAnswers({ mood: "playful" }, ["mood"], emptySave());
    expect(play.owner.where).toBe("anywhere");
    expect(play.dog.enjoy).toEqual(["games"]);
    expect(applyAnswers({ mood: "surprise" }, ["mood"], emptySave()).dog.enjoy).toBeUndefined();
    expect(applyAnswers({}, ["mood"], emptySave()).owner.where).toBeUndefined(); // skipped = unknown
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
    finish();
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
    finish();
    expect(await screen.findByText(/first adventure for Luna and Milo/)).toBeInTheDocument();
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
    next(); // life stage; energy is saved, so the mood screen is next, with the preset pre-selected
    const mood = screen.getByRole("group", { name: /mood/i });
    expect(within(mood).getByRole("button", { name: "Cozy at home" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(getSave().profile.data.energy).toBe("moderate");
  });

  it("works through the Discover page too", async () => {
    await renderUi(<DiscoverPage mode="made" onMode={() => undefined} ctx="at-home" />);
    expect(
      screen.getByRole("heading", { name: "Who is your little sidekick?" }),
    ).toBeInTheDocument();
  });
});

describe("keepsake creation is paid", () => {
  it("has no keepsake pitch before the quiz, no uploader anywhere in the free flow, and the explainer once afterwards", async () => {
    const { container } = await renderUi(<FreeStarter />);
    expect(screen.queryByText(/part of the full Passport/i)).toBeNull();
    expect(screen.queryByLabelText("About personalized keepsakes")).toBeNull();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    finish();
    await screen.findByRole("article", { name: "Recommended adventure" });
    expect(screen.queryByLabelText("About personalized keepsakes")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Scratch or tap to reveal." }));
    await screen.findByText("How it goes");
    fireEvent.click(screen.getByRole("button", { name: "We did it" }));
    await screen.findByRole("heading", { name: "Your first stamp" });
    // one static example and one plain line, with no separate keepsake explainer to open
    expect(screen.queryByLabelText("About personalized keepsakes")).toBeNull();
    expect(screen.getByText(/included in the full Passport/i)).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });

  it("makes no network call during the quiz", async () => {
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    await renderUi(<FreeStarter />);
    finish();
    await screen.findByRole("article", { name: "Recommended adventure" });
    expect(f).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
