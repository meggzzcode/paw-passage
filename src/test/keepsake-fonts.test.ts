// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  FONT_BODY,
  FONT_DISPLAY,
  FONT_HAND,
  ensureKeepsakeFonts,
  fontSpec,
  resetKeepsakeFontsForTests,
} from "@/passport/keepsake/fonts";
import { FONTS } from "@/passport/keepsake/themes";
import { SERIF } from "@/passport/keepsake/render";
import { HAND_STACK } from "@/passport/keepsake/kit-photo-first-a";

type FontsLike = { load: (s: string, t?: string) => Promise<unknown[]>; ready: Promise<unknown> };
function setFonts(f: FontsLike | undefined) {
  Object.defineProperty(document, "fonts", { value: f, configurable: true });
}

afterEach(() => {
  resetKeepsakeFontsForTests();
  setFonts(undefined);
  vi.useRealTimers();
});

describe("keepsake fonts", () => {
  it("stacks name the self-hosted faces first with system fallbacks", () => {
    expect(FONT_DISPLAY.startsWith('"Bricolage Grotesque"')).toBe(true);
    expect(FONT_BODY.startsWith("Figtree")).toBe(true);
    expect(FONT_HAND.startsWith('"Caveat"')).toBe(true);
    expect(FONTS.serif).toBe(FONT_DISPLAY);
    expect(FONTS.sans).toBe(FONT_BODY);
    expect(SERIF).toBe(FONT_DISPLAY);
    expect(HAND_STACK).toBe(FONT_HAND);
  });

  it("fontSpec builds valid canvas font strings and clamps weights to the loaded range", () => {
    expect(fontSpec("display", 700, 48)).toBe(`700 48px ${FONT_DISPLAY}`);
    expect(fontSpec("body", "400", 34, true)).toBe(`italic 400 34px ${FONT_BODY}`);
    expect(fontSpec("hand", 700, 44)).toBe(`600 44px ${FONT_HAND}`);
    expect(fontSpec("body", 900, 20)).toContain("700 20px");
    expect(fontSpec("display", 700, Number.NaN)).toContain("16px");
  });

  it("resolves without a document.fonts API", async () => {
    await expect(ensureKeepsakeFonts()).resolves.toBeUndefined();
  });

  it("loads every face once and caches the result", async () => {
    const load = vi.fn().mockResolvedValue([]);
    setFonts({ load, ready: Promise.resolve() });
    await ensureKeepsakeFonts();
    const n = load.mock.calls.length;
    const families = load.mock.calls.map((c) => String(c[0]));
    expect(families.some((s) => s.includes("Bricolage Grotesque"))).toBe(true);
    expect(families.some((s) => s.includes("Figtree"))).toBe(true);
    expect(families.some((s) => s.includes("Caveat"))).toBe(true);
    await ensureKeepsakeFonts();
    expect(load.mock.calls.length).toBe(n);
  });

  it("does not block forever when a font never loads, and retries next time", async () => {
    vi.useFakeTimers();
    const load = vi.fn(() => new Promise<unknown[]>(() => undefined));
    setFonts({ load, ready: new Promise(() => undefined) });
    const p = ensureKeepsakeFonts();
    await vi.advanceTimersByTimeAsync(3100);
    await expect(p).resolves.toBeUndefined();
    const before = load.mock.calls.length;
    void ensureKeepsakeFonts();
    expect(load.mock.calls.length).toBeGreaterThan(before);
  });

  it("survives load rejections", async () => {
    setFonts({ load: () => Promise.reject(new Error("x")), ready: Promise.resolve() });
    await expect(ensureKeepsakeFonts()).resolves.toBeUndefined();
  });
});
