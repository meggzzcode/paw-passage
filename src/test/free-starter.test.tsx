import { act, cleanup, fireEvent, screen, within } from "@testing-library/react";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adv, renderUi } from "./collections-fixtures";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import { _resetForTests, completeAdventure, getSave, setProfile } from "@/passport/local-store";
import { chooseStarter, emptySave, merge, migrate, validateSave } from "@/passport/progress";
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
  ];
  return { ...m.contentMock, adventures: lib, freeLibrary: () => lib };
});

const withProfile = (data: Record<string, unknown>) => {
  const s = emptySave();
  return { ...s, profile: { data, at: 1 } } as ReturnType<typeof emptySave>;
};

beforeEach(() => {
  ent.status = "free";
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

describe("free Discover: one tailored adventure", () => {
  const show = () => renderUi(<DiscoverPage mode="made" onMode={() => undefined} />);

  it("shows the survey, then 'Your first adventure', with no network call", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await show();
    expect(
      screen.getByText("Tell us about your dog. Get one adventure picked for them, free."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("article")).toBeNull();
    const stage = screen.getByRole("group", { name: "Life stage" });
    fireEvent.click(within(stage).getByRole("button", { name: "Puppy" }));
    fireEvent.click(screen.getByRole("button", { name: "Pick our adventure" }));
    expect(
      await screen.findByRole("heading", { name: "Your first adventure" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(getSave().starter?.id).toBe(PUPPY.id);
    expect(getSave().profile.data.lifeStage).toBe("puppy");
    expect(screen.getByText(/Want more little adventures with your dog\?/)).toBeInTheDocument();
    expect(screen.getByText(/Unlock a much larger library/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("keeps the same pick on a later visit, and 'Not sure' stays unknown", async () => {
    const first = await show();
    const people = screen.getByRole("group", { name: /unfamiliar people/i });
    fireEvent.click(within(people).getByRole("button", { name: "Not sure" }));
    fireEvent.click(screen.getByRole("button", { name: "Pick our adventure" }));
    await screen.findByRole("heading", { name: "Your first adventure" });
    const id = getSave().starter?.id;
    expect(getSave().profile.data.people).toBe("unknown");
    first.unmount();
    _resetForTests(); // a fresh page load reads the saved copy
    await show();
    expect(screen.getByRole("heading", { name: "Your first adventure" })).toBeInTheDocument();
    expect(getSave().starter?.id).toBe(id);
    expect(screen.queryByRole("button", { name: "Pick our adventure" })).toBeNull();
  });

  it("lets you re-answer until you collect it, then not", async () => {
    await show();
    fireEvent.click(screen.getByRole("button", { name: "Pick our adventure" }));
    await screen.findByRole("heading", { name: "Your first adventure" });
    expect(getSave().starter?.id).toBe(CALM.id); // gentle default
    fireEvent.click(screen.getByRole("button", { name: "Re-answer the survey" }));
    fireEvent.click(
      within(screen.getByRole("group", { name: "Life stage" })).getByRole("button", {
        name: "Puppy",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Update my pick" }));
    await screen.findByRole("heading", { name: "Your first adventure" });
    expect(getSave().starter?.id).toBe(PUPPY.id);
    act(() => completeAdventure(PUPPY.id));
    expect(screen.queryByRole("button", { name: "Re-answer the survey" })).toBeNull();
    expect(screen.getByText(/re-read it and keep your keepsake/i)).toBeInTheDocument();
    expect(getSave().starter?.id).toBe(PUPPY.id);
  });

  it("says plainly when nothing is eligible, and shows the pitch", async () => {
    await show();
    fireEvent.click(
      within(screen.getByRole("group", { name: "Life stage" })).getByRole("button", {
        name: "Senior",
      }),
    ); // neither fixture adventure is meant for a senior
    fireEvent.click(screen.getByRole("button", { name: "Pick our adventure" }));
    expect(
      await screen.findByRole("heading", { name: "No free adventure fits yet" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/never suggest something your answers rule out/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See the full Passport" })).toBeInTheDocument();
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

  it("the old slogan never returns in source, docs or public files", () => {
    const OLD = /collect\s+adventures,?\s+not\s+just\s+things/i;
    const skip = new Set(["node_modules", ".git", "dist", ".output"]);
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        if (skip.has(name)) continue;
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p);
        else if (
          /\.(tsx?|md|ya?ml|json|html|css|txt)$/.test(name) &&
          !p.endsWith("free-starter.test.tsx")
        )
          if (OLD.test(readFileSync(p, "utf8"))) hits.push(p);
      }
    };
    for (const d of ["src", "docs", "public", "content", "README.md"]) {
      try {
        if (statSync(d).isDirectory()) walk(d);
        else if (OLD.test(readFileSync(d, "utf8"))) hits.push(d);
      } catch {
        /* optional */
      }
    }
    expect(hits).toEqual([]);
  });
});
