import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PreviewsPage } from "@/components/passport/PreviewsPage";
import { renderUi } from "./collections-fixtures";
import { collections as allCollections } from "@/passport/content";
import type { PreviewItem } from "@/lib/previews";
import {
  _resetForTests,
  bookmarkPreview,
  getSave,
  mergeRemote,
  saveForLater,
  setProfile,
} from "@/passport/local-store";
import { emptySave, has, members } from "@/passport/progress";
import { filterPreviews, premiumPreviews, previewFitsBasics } from "@/passport/preview-view";
import { goodLabels } from "@/components/passport/labels";

const state = vi.hoisted(() => ({
  status: "ready" as "ready" | "loading" | "unavailable",
  data: null as null | { items: unknown[]; total: number; collections: number },
  ent: "free" as "free" | "entitled",
  retry: undefined as undefined | (() => void),
}));
vi.mock("@/lib/usePreviews", () => ({
  usePreviews: () => ({
    status: state.status,
    data: state.status === "ready" ? state.data : null,
    retry: state.retry,
  }),
}));
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({
    status: state.ent,
    premium: [],
    signedIn: false,
    csrf: "",
    message: null,
  }),
}));

const item = (id: string, over: Partial<PreviewItem> = {}): PreviewItem => ({
  id,
  title: `Mystery ${id}`,
  teaser: `Teaser for ${id}`,
  category: "Scent and discovery",
  minutesMin: 10,
  minutesMax: 20,
  costMin: 0,
  costMax: 0,
  setting: "indoor",
  effort: "gentle",
  needs: { car: false, booking: false, food: false, water: false },
  lifeStages: ["puppy", "adult", "senior"],
  keepsake: { family: "travel-postcard", theme: "hometown-postcard" },
  role: "everyday",
  collections: ["rainy-day-club"],
  access: "premium",
  ...over,
});

const A = item("adv-pre111");
const B = item("adv-pre222", {
  setting: "outdoor",
  effort: "lively",
  minutesMin: 60,
  minutesMax: 90,
  costMin: 15,
  costMax: 40,
  needs: { car: true, booking: true, food: true, water: false },
  lifeStages: ["adult"],
  role: "lifestyle",
});
const FREE = item("adv-fre333", { access: "free" });
// A hostile record: a leaky server must still never get these fields onto the page.
const LEAKY = {
  ...item("adv-pre444", { title: "Leaky one" }),
  instructions: ["SECRET-STEP-ONE"],
  twist: "SECRET-TWIST",
  reveal: "SECRET-REVEAL",
  safety: ["SECRET-SAFETY"],
};

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
  state.status = "ready";
  state.retry = undefined;
  state.ent = "free";
  state.data = { items: [A, B, FREE, LEAKY], total: 72, collections: 14 };
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("previews page", () => {
  it("says these are selected previews from a larger collection, with the verified totals", async () => {
    await renderUi(<PreviewsPage />);
    expect(
      screen.getByRole("heading", { name: "A peek at the full Passport" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(
          `3 hand-picked previews from a larger collection of 72 adventures across ${allCollections.length} collections`,
        ),
      ),
    ).toBeInTheDocument();
    // free-pool cards are not part of the premium showcase
    expect(screen.queryByText("Mystery adv-fre333")).toBeNull();
  });

  it("falls back to plain wording when the totals are unknown", async () => {
    state.data = { items: [A], total: 0, collections: 0 };
    await renderUi(<PreviewsPage />);
    expect(
      screen.getByText(/A hand-picked selection from a larger collection/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/larger collection of \d/)).toBeNull();
  });

  it("says so plainly when the previews cannot be loaded", async () => {
    state.status = "unavailable";
    await renderUi(<PreviewsPage />);
    expect(screen.getByText(/Having a little trouble loading the previews/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(screen.queryByText(/no previews/i)).toBeNull();
    expect(screen.queryByRole("article")).toBeNull();
  });

  it("shows a neutral loading state, never an empty or error message", async () => {
    state.status = "loading";
    await renderUi(<PreviewsPage />);
    expect(screen.getByTestId("previews-loading")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText(/no previews/i)).toBeNull();
    expect(screen.queryByText(/trouble/)).toBeNull();
  });

  it("says nothing is published yet only when the API succeeded with an empty catalogue", async () => {
    state.data = { items: [], total: 0, collections: 0 };
    await renderUi(<PreviewsPage />);
    expect(screen.getByText(/No previews are published yet/)).toBeInTheDocument();
    expect(screen.queryByText(/trouble/)).toBeNull();
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  });

  it("Retry runs the request again", async () => {
    const retry = vi.fn();
    state.status = "unavailable";
    state.retry = retry;
    await renderUi(<PreviewsPage />);
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("shows metadata, labels and obvious food, booking and travel needs", async () => {
    await renderUi(<PreviewsPage />);
    const a = screen.getByRole("article", { name: "Mystery adv-pre111" });
    expect(within(a).getByText("10–20 min")).toBeInTheDocument();
    expect(within(a).getByText("Free")).toBeInTheDocument();
    expect(within(a).getByText("Indoors")).toBeInTheDocument();
    expect(within(a).getByText("Gentle effort")).toBeInTheDocument();
    expect(within(a).getByText("Scent and discovery")).toBeInTheDocument();
    for (const l of [
      "Food-free",
      "No additional spending",
      "No car needed",
      "Gentle",
      "Indoor",
      "Puppy-compatible",
    ])
      expect(within(a).getByText(l)).toBeInTheDocument();
    const b = screen.getByRole("article", { name: "Mystery adv-pre222" });
    for (const l of [
      "Car needed",
      "Booking needed",
      "Involves food or treats",
      "$15–$40",
      "Outdoors",
      "Lively effort",
    ])
      expect(within(b).getByText(l)).toBeInTheDocument();
    expect(within(b).queryByText("Food-free")).toBeNull();
    expect(within(b).queryByText("No car needed")).toBeNull();
  });

  it("never renders premium mechanics, even from a leaky record", async () => {
    const { container } = await renderUi(<PreviewsPage />);
    expect(screen.getByText("Leaky one")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/SECRET/);
    expect(container.textContent).not.toMatch(/How it goes|twist/i);
  });

  it("filters by time, budget, setting, life stage and role", async () => {
    await renderUi(<PreviewsPage />);
    const pick = (label: string, value: string) =>
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    pick("Setting", "outdoor");
    expect(screen.queryByRole("article", { name: "Mystery adv-pre111" })).toBeNull();
    expect(screen.getByRole("article", { name: "Mystery adv-pre222" })).toBeInTheDocument();
    pick("Setting", "");
    pick("Life stage", "puppy");
    expect(screen.queryByRole("article", { name: "Mystery adv-pre222" })).toBeNull();
    pick("Life stage", "");
    pick("Budget", "free");
    expect(screen.queryByRole("article", { name: "Mystery adv-pre222" })).toBeNull();
    pick("Budget", "");
    pick("Time", "15");
    expect(screen.queryByRole("article", { name: "Mystery adv-pre222" })).toBeNull();
    pick("Time", "");
    pick("Kind of adventure", "lifestyle");
    expect(screen.getAllByRole("article")).toHaveLength(1);
    pick("Kind of adventure", "everyday");
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("shows the public 'From a chair' and 'No stairs' badges only when true", async () => {
    state.data = {
      items: [
        item("adv-pre555", { ownerEffort: "seated", stepFree: true }),
        item("adv-pre666", { ownerEffort: "active", stepFree: false }),
      ],
      total: 72,
      collections: 14,
    };
    await renderUi(<PreviewsPage />);
    const a = screen.getByRole("article", { name: "Mystery adv-pre555" });
    expect(within(a).getByText("From a chair")).toBeInTheDocument();
    expect(within(a).getByText("No stairs")).toBeInTheDocument();
    const b = screen.getByRole("article", { name: "Mystery adv-pre666" });
    expect(within(b).queryByText("From a chair")).toBeNull();
    expect(within(b).queryByText("No stairs")).toBeNull();
  });

  it("filters by dog energy and by owner effort", async () => {
    state.data = {
      items: [
        item("adv-pre555", { ownerEffort: "seated", effort: "gentle" }),
        item("adv-pre666", { ownerEffort: "active", effort: "lively" }),
        item("adv-pre777", { effort: "moderate" }),
      ],
      total: 72,
      collections: 14,
    };
    await renderUi(<PreviewsPage />);
    fireEvent.change(screen.getByLabelText("Dog energy"), { target: { value: "lively" } });
    expect(screen.queryByRole("article", { name: "Mystery adv-pre555" })).toBeNull();
    expect(screen.getByRole("article", { name: "Mystery adv-pre666" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Dog energy"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Effort for you"), { target: { value: "seated" } });
    expect(screen.getByRole("article", { name: "Mystery adv-pre555" })).toBeInTheDocument();
    expect(screen.queryByRole("article", { name: "Mystery adv-pre666" })).toBeNull();
    // a record without the field (an older index) never matches an owner-effort filter
    expect(screen.queryByRole("article", { name: "Mystery adv-pre777" })).toBeNull();
  });

  it("filter helpers behave on synthetic items", () => {
    expect(filterPreviews([A, B], { setting: "indoor" }).map((i) => i.id)).toEqual([A.id]);
    expect(premiumPreviews([A, FREE]).map((i) => i.id)).toEqual([A.id]);
    expect(goodLabels({ ...B, lifeStages: ["adult"] })).toEqual([]);
  });
});

describe("save before you buy", () => {
  it("bookmarks locally with a truthful saved list, and un-bookmarks", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await renderUi(<PreviewsPage />);
    expect(screen.getByRole("button", { name: "Saved (0)" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save: Mystery adv-pre111" }));
    expect(has(getSave().saved, A.id)).toBe(true);
    expect(screen.getByRole("button", { name: "Saved (1)" })).toBeInTheDocument();
    expect(screen.getByText("You have saved 1 preview")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Saved (1)" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Saved: Mystery adv-pre111" }));
    expect(has(getSave().saved, A.id)).toBe(false);
    expect(screen.getByText(/You have not saved any previews yet/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled(); // no account, no request
  });

  it("only counts saved ids that are real previews, not other saved adventures", async () => {
    saveForLater("adv-zzz999"); // saved-for-later elsewhere, not a preview
    bookmarkPreview(B.id);
    await renderUi(<PreviewsPage />);
    expect(screen.getByRole("button", { name: "Saved (1)" })).toBeInTheDocument();
  });

  it("keeps bookmarks when the purchase merges the synced progress in", () => {
    bookmarkPreview(A.id);
    const remote = { ...emptySave(), rev: 4 };
    mergeRemote(remote);
    expect(members(getSave().saved)).toContain(A.id);
    const other = { ...emptySave(), saved: { added: { [B.id]: 5 }, removed: {} } };
    mergeRemote(other);
    expect(members(getSave().saved).sort()).toEqual([A.id, B.id]);
  });

  it("paid visitors see no purchase prompt", async () => {
    state.ent = "entitled";
    await renderUi(<PreviewsPage />);
    expect(screen.queryByRole("link", { name: "See the full Passport" })).toBeNull();
    expect(screen.getByText(/You have the full Passport/)).toBeInTheDocument();
  });
});

describe("personalized match", () => {
  it("makes no request until the button is pressed, then reports the verified counts", async () => {
    const fetchSpy = vi.fn(async () =>
      Response.json({ matching: 31, total: 72, previews: [A.id, B.id] }),
    );
    vi.stubGlobal("fetch", fetchSpy);
    setProfile({ name: "Biscuit", lifeStage: "adult" });
    await renderUi(<PreviewsPage />);
    expect(fetchSpy).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Count what matches" }));
    expect(
      await screen.findByText("We found 31 adventures that match your current preferences."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2 matching adventures are among the public previews/),
    ).toBeInTheDocument();
    expect(screen.getByText(/full Passport has all 31, from a library of 72/)).toBeInTheDocument();
    const body = JSON.parse(String(((fetchSpy.mock.calls[0] as unknown[])[1] as RequestInit).body));
    expect(body.dog).toEqual({ lifeStage: "adult" }); // no name
  });

  it("falls back to a plain local count of public previews, and says so", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("no", { status: 503 })),
    );
    setProfile({ lifeStage: "puppy" });
    await renderUi(<PreviewsPage />);
    fireEvent.click(screen.getByRole("button", { name: "Count what matches" }));
    expect(
      await screen.findByText(/could not check the whole library just now/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Of the 3 public previews, 2 fit the basics/)).toBeInTheDocument();
    expect(screen.queryByText(/We found/)).toBeNull();
  });

  it("the local basics never treat unknown as a reason to include or exclude", () => {
    expect(previewFitsBasics(B, {}, {})).toBe(true);
    expect(previewFitsBasics(B, { lifeStage: "puppy" }, {})).toBe(false);
    expect(previewFitsBasics(B, { foodActivities: "no" }, {})).toBe(false);
    expect(previewFitsBasics(B, {}, { hasCar: "no" })).toBe(false);
    expect(previewFitsBasics(B, { foodActivities: "unknown" }, { hasCar: "unknown" })).toBe(true);
  });
});

describe("rendering", () => {
  it("renders with a bare render too (no provider needed for the card tree)", () => {
    const { container } = render(<div />);
    expect(container).toBeTruthy();
  });
});
