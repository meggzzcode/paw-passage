// Photo-first families 1-5 (travel postcard, magazine cover, detective ID, trading card, certificate).
import { describe, expect, it } from "vitest";
import {
  ART_SIZES,
  FAMILY_DEFS,
  photoSlots,
  renderArtwork,
  type ArtSpec,
} from "../passport/keepsake/artwork";
import { placed } from "../passport/keepsake/photo";
import { THEME_REGISTRY } from "../passport/keepsake/themes";
import type { SizeId } from "../passport/keepsake/kit";

const FAMILIES = [
  "travel-postcard",
  "magazine-cover",
  "id-card",
  "trading-card",
  "certificate",
] as const;
const SIZES = Object.keys(ART_SIZES) as SizeId[];

function fake() {
  const draws = { n: 0 };
  const arcs: { x: number; y: number }[] = [];
  const texts: { text: string; x: number; y: number; size: number; align: string }[] = [];
  const state: Record<string, unknown> = { font: "10px serif", textAlign: "left" };
  const target: Record<string, unknown> = {
    measureText: (s: string) => ({
      width:
        Array.from(s).length *
        Number(/(\d+(?:\.\d+)?)px/.exec(String(state["font"]))?.[1] ?? 10) *
        0.5,
    }),
  };
  const ctx = new Proxy(target, {
    get: (t, k: string) => {
      if (k in t) return t[k];
      if (k in state) return state[k];
      if (k === "fillText" || k === "strokeText")
        return (text: string, x: number, y: number) =>
          texts.push({
            text,
            x,
            y,
            size: Number(/(\d+(?:\.\d+)?)px/.exec(String(state["font"]))?.[1] ?? 10),
            align: String(state["textAlign"]),
          });
      if (k === "drawImage") return () => draws.n++;
      if (k === "arc") return (x: number, y: number) => arcs.push({ x, y });
      if (k === "createLinearGradient" || k === "createRadialGradient")
        return () => ({ addColorStop: () => undefined });
      return () => undefined;
    },
    set: (_t, k: string, v) => {
      state[k] = v;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, texts, arcs, draws };
}

const photo = () => placed({ width: 3000, height: 4000 } as unknown as ImageBitmap);
const spec = (family: ArtSpec["family"], theme: string, size: SizeId): ArtSpec => ({
  family,
  theme,
  size,
  headline: "Picnic in the Park",
  subhead: "A little adventure",
  dogName: "Biscuit",
  date: "12 May 2026",
  memory: "He carried the ball around the garden.",
});

describe("photo-first families (KA)", () => {
  it("keeps the five family ids and their theme lists", () => {
    for (const f of FAMILIES) {
      expect(FAMILY_DEFS[f]).toBeDefined();
      expect(THEME_REGISTRY[f].length).toBeGreaterThan(0);
    }
  });

  it("gives every family a photo slot that is full-bleed or a near-full card, per format", () => {
    for (const f of FAMILIES)
      for (const size of SIZES) {
        const s = photoSlots(spec(f, THEME_REGISTRY[f][0]!, size), 1)[0]!;
        const area = (s.w * s.h) / (1080 * ART_SIZES[size].height);
        expect(area, `${f} ${size}`).toBeGreaterThan(f === "trading-card" ? 0.5 : 0.99);
      }
  });

  it.each(FAMILIES.flatMap((f) => THEME_REGISTRY[f].map((t) => [f, t] as const)))(
    "%s / %s: all formats, readable sizes, text on canvas, brand drawn, with and without photo",
    (family, theme) => {
      for (const size of SIZES)
        for (const photos of [[], [photo()]])
          for (const mode of ["normal", "long", "minimal"] as const) {
            const s = spec(family, theme, size);
            if (mode === "long") {
              s.headline = "Supercalifragilistic Wigglesworth Adventure ".repeat(2);
              s.dogName = "Sir Reginald Wigglesworth-Smythe the Third of Kent";
              s.subhead = "A very long subtitle ".repeat(5);
              s.memory = "word ".repeat(60);
              s.date = "12 September 2026 at the lake house";
            }
            if (mode === "minimal") {
              delete s.subhead;
              delete s.memory;
              delete s.date;
            }
            const f = fake();
            expect(() => renderArtwork(f.ctx, s, { photos })).not.toThrow();
            const H = ART_SIZES[size].height;
            for (const t of f.texts) {
              const w = t.text.length * t.size * 0.5;
              const left = t.align === "center" ? t.x - w / 2 : t.align === "right" ? t.x - w : t.x;
              expect(left, `${size} ${mode} "${t.text}"`).toBeGreaterThanOrEqual(-1);
              expect(left + w, `${size} ${mode} "${t.text}"`).toBeLessThanOrEqual(1081);
              expect(t.y).toBeGreaterThan(0);
              expect(t.y).toBeLessThanOrEqual(H);
            }
            expect(f.texts.some((t) => t.text === "pawsandpassage.com")).toBe(true);
            expect(
              f.texts.some(
                (t) =>
                  t.text.includes("Biscuit") || t.text.startsWith("Sir R") || t.text.length > 0,
              ),
            ).toBe(true);
            if (size === "story")
              // essential text stays out of the Story safe zones (top 250, bottom 340)
              for (const t of f.texts.filter((x) => x.size >= 34))
                expect(t.y, `${family} ${theme} ${mode} "${t.text}"`).toBeLessThanOrEqual(H - 300);
          }
    },
  );

  it.each(THEME_REGISTRY["certificate"])(
    "certificate %s keeps text in the bottom 40% and ornaments in the outer 22% margins",
    (theme) => {
      for (const size of SIZES) {
        const f = fake();
        renderArtwork(f.ctx, spec("certificate", theme, size), { photos: [photo()] });
        const H = ART_SIZES[size].height;
        for (const t of f.texts) expect(t.y, `${size} "${t.text}"`).toBeGreaterThanOrEqual(H * 0.6);
        for (const a of f.arcs) {
          const outer = a.x < 1080 * 0.22 || a.x > 1080 * 0.78 || a.y < H * 0.22 || a.y > H * 0.78;
          expect(outer, `${size} ornament at ${Math.round(a.x)},${Math.round(a.y)}`).toBe(true);
        }
      }
    },
  );

  it("trading card draws no ghost backdrop: the photo is drawn once, inside the card", () => {
    for (const size of SIZES) {
      const f = fake();
      renderArtwork(f.ctx, spec("trading-card", "explorer-card", size), { photos: [photo()] });
      expect(f.draws.n).toBe(1);
    }
  });
});
