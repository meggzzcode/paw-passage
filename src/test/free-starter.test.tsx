import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adv, renderUi } from "./collections-fixtures";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import { _resetForTests, getSave, setProfile } from "@/passport/local-store";
import {
  chooseStarter,
  emptySave,
  merge,
  migrate,
  revealStarter,
  validateSave,
} from "@/passport/progress";
import { savedStarter, selectStarter } from "@/passport/starter";
import { GENTLE_START_NOTE } from "@/passport/engine";
import { offer } from "@/config/site";

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
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => <div /> }));

// A tiny synthetic free pool (the real content is written elsewhere and must not make these tests depend on it).
const CALM = adv("adv-cal111", "Calm Couch Game", { lifeStages: ["puppy", "adult"] }); // gentle, quiet
const ANY = adv("adv-any666", "Any Age Game");
const BUSY = adv("adv-bus222", "Busy Park Meetup", {
  energy: "lively",
  strangers: true,
  otherDogs: true,
  setting: "outdoor",
  places: ["city"],
  minutesMax: 90,
  ownerMobility: "long-walk",
  stepFree: false,
  noise: "some",
});
const PUPPY = adv("adv-pup333", "Puppy Sniff Trail", { lifeStages: ["puppy"], energy: "moderate" });
const SMALL_ONLY = adv("adv-sml444", "Tiny Dog Parade", { sizes: ["small"] });
const PREMIUM = adv("adv-prm555", "Premium Thing", { access: "premium" });
const POOL = [CALM, BUSY, PUPPY, SMALL_ONLY, PREMIUM];

vi.mock("@/passport/content", async () => {
  const m = await import("./collections-fixtures");
  const lib = [
    m.adv("adv-cal111", "Calm Couch Game", { lifeStages: ["puppy", "adult"] }),
    m.adv("adv-pup333", "Puppy Sniff Trail", { lifeStages: ["puppy"], energy: "moderate" }),
    m.adv("adv-any666", "Any Age Game", { lifeStages: ["adult"] }),
  ];
  return { ...m.contentMock, adventures: lib, freeLibrary: () => lib };
});

const withProfile = (data: Record<string, unknown>) => {
  const s = emptySave();
  return { ...s, profile: { data, at: 1 } } as ReturnType<typeof emptySave>;
};

beforeEach(() => {
  ent.status = "free";
  window.sessionStorage.clear();
  window.history.replaceState(null, "");
  window.localStorage.clear();
  _resetForTests();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("selectStarter (the engine pick)", () => {
  it("defaults to the gentle adventure when the profile is unknown", () => {
    const r = selectStarter([BUSY, CALM], emptySave());
    expect(r.ok && r.adventure.id).toBe(CALM.id);
    expect(r.ok && r.why).toContain(GENTLE_START_NOTE);
  });

  it("applies hard eligibility first: nervous around dogs and a senior rule out the wrong ones", () => {
    const nervous = selectStarter([BUSY], withProfile({ dogs: "nervous" }));
    expect(nervous.ok).toBe(false);
    const senior = selectStarter([PUPPY], withProfile({ lifeStage: "senior" }));
    expect(senior.ok).toBe(false);
    const r = selectStarter([PUPPY, ANY], withProfile({ lifeStage: "senior" }));
    expect(r.ok && r.adventure.id).toBe(ANY.id);
  });

  it("never treats an unknown answer as safe: a size-restricted adventure stays held", () => {
    expect(selectStarter([SMALL_ONLY], emptySave()).ok).toBe(false);
    const r = selectStarter([SMALL_ONLY], withProfile({ size: "small" }));
    expect(r.ok && r.adventure.id).toBe(SMALL_ONLY.id);
  });

  it("only picks from the free pool", () => {
    expect(selectStarter([PREMIUM], emptySave())).toEqual({ ok: false, reason: "none-eligible" });
    const r = selectStarter(POOL, emptySave());
    expect(r.ok && r.adventure.access).toBe("free");
  });

  it("keeps a saved starter only while it is usable", () => {
    const s = chooseStarter(withProfile({ lifeStage: "puppy" }), PUPPY.id, 5);
    expect(savedStarter([PUPPY], s)?.id).toBe(PUPPY.id);
    const grown = { ...s, profile: { data: { lifeStage: "senior" }, at: 9 } };
    expect(savedStarter([PUPPY], grown as typeof s)).toBeUndefined();
    expect(savedStarter([CALM], s)).toBeUndefined(); // not in the pool
  });
});

describe("starter in the local save", () => {
  it("is additive: an old save without it is still valid, and a good one round-trips", () => {
    const old = emptySave();
    expect(validateSave(old)).toBeNull();
    expect(migrate(JSON.parse(JSON.stringify(old)))).toEqual(old);
    const s = chooseStarter(old, "adv-cal111", 10);
    expect(s.starter).toEqual({ id: "adv-cal111", at: 10 });
    expect(migrate(JSON.parse(JSON.stringify(s)))).toEqual(s);
  });

  it("rejects a malformed starter", () => {
    for (const bad of [
      { id: "nope", at: 1 },
      { id: "adv-cal111" },
      { id: "adv-cal111", at: 1, x: 1 },
      "adv-cal111",
    ])
      expect(validateSave({ ...emptySave(), starter: bad })).toBe("bad starter");
  });

  it("can change until it is completed, then stays as the keepsake", () => {
    let s = chooseStarter(emptySave(), CALM.id, 1);
    s = chooseStarter(s, PUPPY.id, 2);
    expect(s.starter?.id).toBe(PUPPY.id);
    expect(chooseStarter(s, PUPPY.id, 3)).toBe(s);
    const done = { ...s, done: { added: { [PUPPY.id]: 5 }, removed: {} } };
    expect(chooseStarter(done, CALM.id, 6)).toBe(done);
    expect(chooseStarter(done, null, 6)).toBe(done);
    expect(chooseStarter(s, null, 6).starter).toBeUndefined();
  });

  it("merges to the later pick, and keeps one side when only one has it", () => {
    const a = chooseStarter(emptySave(), CALM.id, 1);
    const b = chooseStarter(emptySave(), PUPPY.id, 2);
    expect(merge(a, b).starter?.id).toBe(PUPPY.id);
    expect(merge(b, a).starter?.id).toBe(PUPPY.id);
    expect(merge(a, emptySave()).starter?.id).toBe(CALM.id);
    expect(merge(emptySave(), emptySave()).starter).toBeUndefined();
  });
});

describe("reveal state in the local save", () => {
  it("is additive, validated, and survives a merge in either direction", () => {
    const picked = chooseStarter(emptySave(), CALM.id, 10);
    const shown = revealStarter(picked, 20);
    expect(shown.starter).toEqual({ id: CALM.id, at: 10, revealedAt: 20 });
    expect(validateSave(shown)).toBeNull();
    expect(migrate(JSON.parse(JSON.stringify(shown)))).toEqual(shown);
    expect(revealStarter(shown, 30)).toBe(shown);
    expect(revealStarter(emptySave(), 1).starter).toBeUndefined();
    expect(validateSave({ ...emptySave(), starter: { id: CALM.id, at: 1, revealedAt: "x" } })).toBe(
      "bad starter",
    );
    expect(merge(shown, picked).starter?.revealedAt).toBe(20);
    expect(merge(picked, shown).starter?.revealedAt).toBe(20);
  });

  it("a revealed adventure can no longer be swapped", () => {
    const shown = revealStarter(chooseStarter(emptySave(), CALM.id, 10), 20);
    expect(chooseStarter(shown, PUPPY.id, 30)).toBe(shown);
    expect(chooseStarter(shown, null, 30)).toBe(shown);
  });
});

describe("free Discover: the introductory flow", () => {
  const show = () => renderUi(<DiscoverPage mode="made" onMode={() => undefined} />);
  /** Skips (or advances) every remaining question, then finds the adventure. */
  const finishQuiz = () => {
    for (let i = 0; i < 12; i++) {
      const next = screen.queryByRole("button", { name: /^(Skip|Next)$/ });
      if (!next) break;
      fireEvent.click(next);
    }
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
  };
  const start = () => finishQuiz();
  const shownTitle = () => getSave().starter?.id;

  it("opens straight on the first question (no welcome screen, no explainer, no keepsake pitch), with no network call", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await show();
    expect(
      screen.getByRole("heading", { name: "Who is your little sidekick?" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 4")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Find Our First Adventure" })).toBeNull();
    expect(screen.queryByText(/How it works/)).toBeNull();
    expect(screen.queryByLabelText("About personalized keepsakes")).toBeNull();
    const stage = screen.getByRole("group", { name: "Who is your little sidekick?" });
    fireEvent.click(within(stage).getByRole("button", { name: "Puppy" })); // auto-advances
    expect(screen.getByText("Question 2 of 4")).toBeInTheDocument();
    finishQuiz();
    expect(
      await screen.findByRole("article", { name: "Recommended adventure" }),
    ).toBeInTheDocument();
    expect(getSave().profile.data.lifeStage).toBe("puppy");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows practical info only before the reveal: no title, steps or twist", async () => {
    await show();
    start();
    const card = await screen.findByRole("article", { name: "Recommended adventure" });
    expect(
      screen.getByRole("heading", { name: "A little adventure awaits..." }),
    ).toBeInTheDocument();
    const t = within(card).getByLabelText("At a glance");
    expect(t.textContent).toMatch(/min/);
    expect(t.textContent).toMatch(/Free/);
    expect(t.textContent).toMatch(/Indoors/);
    expect(t.textContent).toMatch(/effort|Dog:/);
    expect(within(card).queryByRole("heading")).toBeNull();
    expect(screen.queryByText("How it goes")).toBeNull();
    expect(screen.queryByText("Continue")).toBeNull(); // an instruction line
    expect(screen.queryByText("A twist")).toBeNull();
    expect(getSave().starter?.revealedAt).toBeUndefined();
    // one card, one primary gesture, one secondary, one quiet link; no acceptance screen or product explainer
    expect(screen.getByRole("button", { name: "Scratch or tap to reveal." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show me another" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit preferences" })).toBeInTheDocument();
  });

  it("skipped questions stay unknown", async () => {
    await show();
    start();
    await screen.findByRole("article", { name: "Recommended adventure" });
    const d = getSave().profile.data;
    expect(d.lifeStage).toBeUndefined();
    expect(d.people).toBeUndefined();
    expect(d.noiseSensitive).toBeUndefined();
    expect(getSave().owner.data.where).toBeUndefined();
  });

  it("'Show me another' never repeats one and never consumes the only match", async () => {
    await show();
    start();
    await screen.findByRole("article", { name: "Recommended adventure" });
    const seen = [shownTitle()];
    for (let i = 0; i < 2; i++) {
      fireEvent.click(screen.getByRole("button", { name: "Show me another" }));
      seen.push(shownTitle());
    }
    expect(new Set(seen).size).toBe(3);
    // the last remaining fit: the button is gone, a friendly line says so, and the pick is kept
    expect(screen.queryByRole("button", { name: "Show me another" })).toBeNull();
    expect(screen.getByText(/the little adventure that suits you best today/)).toBeInTheDocument();
    expect(screen.queryByText(/That was every free fit/)).toBeNull();
    expect(getSave().starter?.id).toBe(seen[2]);
    expect(screen.getByRole("button", { name: "Scratch or tap to reveal." })).toBeInTheDocument();
  });

  it("reveals on tap, locks the intro adventure in, and returns straight to it", async () => {
    const first = await show();
    start();
    await screen.findByRole("article", { name: "Recommended adventure" });
    const id = shownTitle();
    fireEvent.click(screen.getByRole("button", { name: "Scratch or tap to reveal." }));
    expect(await screen.findByText("How it goes")).toBeInTheDocument();
    const h = screen.getByRole("heading", { name: "Your first adventure" });
    expect(h).toBeInTheDocument();
    expect(document.activeElement).toBe(h); // focus lands on the revealed content
    expect(getSave().starter?.revealedAt).toBeTypeOf("number");
    expect(screen.queryByRole("button", { name: "Show me another" })).toBeNull();
    first.unmount();
    _resetForTests(); // a fresh page load reads the saved copy
    setProfile({ lifeStage: "senior" }); // answers changed: it is still ours to read
    await show();
    expect(screen.getByText("How it goes")).toBeInTheDocument();
    expect(getSave().starter?.id).toBe(id);
    expect(screen.queryByText(/Question \d of/)).toBeNull(); // no quiz repeat
    // a quiet way to edit preferences; re-taking never grants another reveal
    fireEvent.click(screen.getByRole("button", { name: "Edit preferences" }));
    expect(
      screen.getByRole("heading", { name: "Who is your little sidekick?" }),
    ).toBeInTheDocument();
    for (let i = 0; i < 3; i++)
      fireEvent.click(screen.getByRole("button", { name: /^(Skip|Next)$/ }));
    fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));
    expect(screen.getByText("How it goes")).toBeInTheDocument(); // still the same, already revealed
    expect(getSave().starter?.id).toBe(id);
  });

  it("completion shows the intro stamp and a tasteful unlock, with no network call", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await show();
    start();
    await screen.findByRole("article", { name: "Recommended adventure" });
    fireEvent.click(screen.getByRole("button", { name: "Scratch or tap to reveal." }));
    await screen.findByText("How it goes");
    expect(screen.queryByText(/Want more little adventures/)).toBeNull(); // not before completing
    fireEvent.click(screen.getByRole("button", { name: "Collect it" }));
    expect(await screen.findByRole("heading", { name: "Your first stamp" })).toBeInTheDocument();
    expect(screen.getByText(/Want more little adventures with your dog\?/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See the full Passport" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse previews" })).toHaveAttribute(
      "href",
      "/previews",
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows the keepsake explainer at most once after completion, and only when the visitor opens the keepsake style", async () => {
    await show();
    start();
    await screen.findByRole("article", { name: "Recommended adventure" });
    fireEvent.click(screen.getByRole("button", { name: "Scratch or tap to reveal." }));
    await screen.findByText("How it goes");
    fireEvent.click(screen.getByRole("button", { name: "Collect it" }));
    await screen.findByRole("heading", { name: "Your first stamp" });
    expect(screen.queryAllByLabelText("About personalized keepsakes")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "See the keepsake style" }));
    expect(screen.getAllByLabelText("About personalized keepsakes")).toHaveLength(1);
  });

  it("when nothing free suits the dog, says so warmly (no jargon) and offers editing, previews and the Passport", async () => {
    await show();
    fireEvent.click(
      within(screen.getByRole("group", { name: "Who is your little sidekick?" })).getByRole(
        "button",
        {
          name: "Senior",
        },
      ),
    ); // none of the fixture adventures is meant for a senior
    finishQuiz();
    expect(
      await screen.findByRole("heading", {
        name: "We haven't found a free adventure for you just yet",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/never loosen them/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/No free adventure fits yet|Widen where|Nothing free fits all/),
    ).toBeNull();
    expect(screen.getByRole("link", { name: "see the full Passport" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "browse previews" })).toHaveAttribute(
      "href",
      "/previews",
    );
    expect(getSave().starter).toBeUndefined();
    expect(screen.queryByRole("article")).toBeNull();
  });
});

describe("entitled visitors keep the full Discover", () => {
  it("shows the tabs, not the survey", async () => {
    ent.status = "entitled";
    await renderUi(<DiscoverPage mode="browse" onMode={() => undefined} />);
    expect(screen.getByRole("tab", { name: /browse/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pick our adventure" })).toBeNull();
  });
});

describe("price and slogan guards", () => {
  it("the price is $19.99 one-time", () => {
    expect(offer.price).toBe("$19.99");
    expect(offer.pricing).toBe("one-time purchase, no subscription");
  });

  it("retired lines never return, and the approved slogan is written only in src/config/brand.ts", () => {
    // Owner directive 2026-11-26: "Collect adventures, not just things." is APPROVED again (My Passport headline). It is
    // single-sourced in brand.ts; other retired variants stay banned. See src/test/brand-copy.test.ts for the full list.
    const RETIRED =
      /life\s+is\s+better\s+with\s+a\s+little\s+adventure|deserves\s+a\s+little\s+wonder\.\s*A\s+lifetime/i;
    const APPROVED = /collect\s+adventures,?\s+not\s+just\s+things/i;
    const skip = new Set(["node_modules", ".git", "dist", ".output"]);
    const retiredHits: string[] = [];
    const strayApproved: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        if (skip.has(name)) continue;
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(tsx?|md|ya?ml|json|html|css|txt)$/.test(name) && !/\.test\.tsx?$/.test(name)) {
          const t = readFileSync(p, "utf8");
          if (RETIRED.test(t)) retiredHits.push(p);
          if (APPROVED.test(t) && !p.endsWith("src/config/brand.ts") && !p.startsWith("docs"))
            strayApproved.push(p);
        }
      }
    };
    for (const d of ["src", "docs", "public", "content", "README.md"]) {
      try {
        if (statSync(d).isDirectory()) walk(d);
        else {
          const t = readFileSync(d, "utf8");
          if (RETIRED.test(t)) retiredHits.push(d);
        }
      } catch {
        /* optional */
      }
    }
    expect(retiredHits).toEqual([]);
    expect(strayApproved).toEqual([]);
  });
});
