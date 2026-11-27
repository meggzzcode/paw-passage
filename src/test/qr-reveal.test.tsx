// In-place reveal: the mystery card turns into the canonical adventure on the same page, no navigation, no extra reveal.
import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderUi } from "./collections-fixtures";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import { _resetForTests, getSave } from "@/passport/local-store";

vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({ status: "free", premium: [], signedIn: false, csrf: "", message: null }),
}));
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => <div /> }));
vi.mock("@/passport/content", async () => {
  const m = await import("./collections-fixtures");
  const lib = [
    m.adv("adv-cal111", "Calm Couch Game", { lifeStages: ["puppy", "adult"] }),
    m.adv("adv-pup333", "Puppy Sniff Trail", { lifeStages: ["puppy"], energy: "moderate" }),
    m.adv("adv-any666", "Any Age Game", { lifeStages: ["adult"] }),
  ];
  return { ...m.contentMock, adventures: lib, freeLibrary: () => lib };
});

const REVEAL = { name: "Scratch or tap to reveal." };
const show = () => renderUi(<DiscoverPage mode="made" onMode={() => undefined} />);
const toMystery = async () => {
  for (let i = 0; i < 12; i++) {
    const next = screen.queryByRole("button", { name: /^(Skip|Next)$/ });
    if (!next) break;
    fireEvent.click(next);
  }
  fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
  await screen.findByRole("article", { name: "Recommended adventure" });
};

beforeEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState(null, "");
  window.localStorage.clear();
  document.getElementById("pp-announcer")?.remove();
  _resetForTests();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("in-place reveal", () => {
  it("swaps the mystery for the adventure on the same URL: no navigation, no new history entry, no second button", async () => {
    await show();
    await toMystery();
    const url = window.location.href;
    const len = window.history.length;
    const push = vi.spyOn(window.history, "pushState");
    const assign = vi.fn();
    vi.stubGlobal("open", assign);
    expect(screen.getAllByRole("button", REVEAL)).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", REVEAL));
    expect(await screen.findByText("How it goes")).toBeInTheDocument();
    expect(window.location.href).toBe(url);
    expect(window.history.length).toBe(len);
    expect(push).not.toHaveBeenCalled();
    expect(assign).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", REVEAL)).toBeNull();
    expect(screen.queryByRole("article", { name: "Recommended adventure" })).toBeNull();
    // one adventure card, the canonical one, and its heading has focus
    expect(document.querySelectorAll(".pd-card")).toHaveLength(1);
    expect(document.activeElement).toBe(document.querySelector(".pd-card h2"));
  });

  it("announces 'Adventure revealed.' politely", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      await show();
      await toMystery();
      fireEvent.click(screen.getByRole("button", REVEAL));
      await vi.advanceTimersByTimeAsync(100);
      const live = document.getElementById("pp-announcer");
      expect(live?.getAttribute("aria-live")).toBe("polite");
      expect(live?.textContent).toBe("Adventure revealed.");
    } finally {
      vi.useRealTimers();
    }
  });

  it("keyboard (Enter/Space on the button = click) and pointer scratch give the same adventure", async () => {
    await show();
    await toMystery();
    const id = getSave().starter?.id;
    const btn = screen.getByRole("button", REVEAL);
    // scratch: drag far enough across the surface
    const ptr = (type: string, x: number, y: number) =>
      act(() => {
        btn.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: x, clientY: y }));
      });
    ptr("pointerdown", 0, 0);
    ptr("pointermove", 60, 0);
    ptr("pointermove", 120, 40);
    expect(await screen.findByText("How it goes")).toBeInTheDocument();
    expect(getSave().starter?.id).toBe(id);
    expect(getSave().starter?.revealedAt).toBeTypeOf("number");
  });

  it("repeated taps and double-clicks reveal exactly once and never roll another adventure", async () => {
    await show();
    await toMystery();
    const id = getSave().starter?.id;
    const btn = screen.getByRole("button", REVEAL);
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.doubleClick(btn);
    const at = getSave().starter?.revealedAt;
    expect(getSave().starter?.id).toBe(id);
    expect(await screen.findByText("How it goes")).toBeInTheDocument();
    expect(document.querySelectorAll(".pd-card")).toHaveLength(1);
    expect(getSave().starter?.revealedAt).toBe(at);
  });

  it("refresh before reveal shows the same mystery; refresh after reveal shows the same adventure without stealing focus", async () => {
    const first = await show();
    await toMystery();
    const id = getSave().starter?.id;
    first.unmount();
    _resetForTests();
    const second = await show();
    await screen.findByRole("article", { name: "Recommended adventure" });
    expect(getSave().starter?.id).toBe(id);
    fireEvent.click(screen.getByRole("button", REVEAL));
    const title = (await screen.findByText("How it goes")) && document.querySelector(".pd-card h2");
    const text = title?.textContent;
    second.unmount();
    _resetForTests();
    (document.activeElement as HTMLElement | null)?.blur();
    await show();
    expect(await screen.findByText("How it goes")).toBeInTheDocument();
    expect(document.querySelector(".pd-card h2")?.textContent).toBe(text);
    expect(getSave().starter?.id).toBe(id);
    expect(document.activeElement).not.toBe(document.querySelector(".pd-card h2"));
  });

  it("browser Back and Forward after the reveal never re-offer a reveal or another adventure", async () => {
    await show();
    await toMystery();
    const id = getSave().starter?.id;
    fireEvent.click(screen.getByRole("button", REVEAL));
    await screen.findByText("How it goes");
    expect((window.history.state as { ppRevealed?: boolean } | null)?.ppRevealed).toBe(true);
    for (const state of [{ ppQuiz: 3 }, { ppQuiz: 0 }, null, { ppQuiz: 3 }]) {
      window.history.replaceState(state, "");
      window.dispatchEvent(new PopStateEvent("popstate", { state }));
    }
    expect(screen.getByText("How it goes")).toBeInTheDocument();
    expect(screen.queryByRole("button", REVEAL)).toBeNull();
    expect(screen.queryByRole("button", { name: "Show me another" })).toBeNull();
    expect(getSave().starter?.id).toBe(id);
  });

  it("rerolling is only possible before the reveal", async () => {
    await show();
    await toMystery();
    fireEvent.click(screen.getByRole("button", { name: "Show me another" }));
    fireEvent.click(screen.getByRole("button", REVEAL));
    await screen.findByText("How it goes");
    expect(screen.queryByRole("button", { name: "Show me another" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Try another" })).toBeNull();
  });

  it("reduced motion: the card is swapped with no animation class dependence (CSS turns it off) and focus still moves", async () => {
    vi.stubGlobal("matchMedia", (q: string) => ({
      matches: /reduce/.test(q),
      media: q,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      onchange: null,
      dispatchEvent: () => false,
    }));
    await show();
    await toMystery();
    fireEvent.click(screen.getByRole("button", REVEAL));
    await screen.findByText("How it goes");
    expect(document.activeElement).toBe(document.querySelector(".pd-card h2"));
  });
});

describe("quiz structure", () => {
  it("shows one heading per question, an honest progress bar, Back, 4 questions, and a text-visible selected state", async () => {
    await show();
    expect(document.querySelectorAll(".pd-quiz h2")).toHaveLength(1);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("1");
    expect(bar.getAttribute("aria-valuemax")).toBe("4");
    const adult = screen.getByRole("button", { name: "Adult" });
    fireEvent.click(adult);
    expect(screen.getByText("Question 2 of 4")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    // every answer tile is a real toggle button: its selected state is exposed as aria-pressed, plus a visible check (CSS)
    expect(screen.getAllByRole("button", { pressed: false }).length).toBeGreaterThan(0);
  });
});
