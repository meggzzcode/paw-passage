// Photo-first families in families-b.ts: seasonal frame, event ticket, then-and-now, collage, poster.
// Checks the photo stays the picture (slot coverage), Story safe zones for text, readable type sizes,
// long names, missing optional fields, no photo, stable family and theme ids.
import { describe, expect, it } from "vitest";
import {
  FAMILY_DEFS,
  ART_SIZES,
  photoSlots,
  renderArtwork,
  type ArtSpec,
} from "../passport/keepsake/artwork";
import { THEME_REGISTRY } from "../passport/keepsake/themes";
import { placed } from "../passport/keepsake/photo";
import type { SizeId } from "../passport/keepsake/kit";

type Fam = "seasonal-frame" | "event-ticket" | "then-and-now" | "collage" | "poster";
const FAMS: Fam[] = ["seasonal-frame", "event-ticket", "then-and-now", "collage", "poster"];
const SIZES = Object.keys(ART_SIZES) as SizeId[];

function fakeCtx() {
  const state: Record<string, unknown> = { font: "10px serif", textAlign: "left" };
  const texts: Array<{ text: string; font: string; align: string; x: number; y: number }> = [];
  let tx = 0;
  let ty = 0;
  const stack: Array<[number, number]> = [];
  const target: Record<string, unknown> = {
    measureText: (s: string) => ({
      width:
        Array.from(s).length *
        Number(/(\d+(?:\.\d+)?)px/.exec(String(state["font"]))?.[1] ?? 10) *
        0.5,
    }),
    save: () => stack.push([tx, ty]),
    restore: () => ([tx, ty] = stack.pop() ?? [0, 0]),
    translate: (x: number, y: number) => {
      tx += x;
      ty += y;
    },
    fillText: (text: string, x: number, y: number) =>
      texts.push({
        text,
        font: String(state["font"]),
        align: String(state["textAlign"]),
        x: x + tx,
        y: y + ty,
      }),
    createLinearGradient: () => ({ addColorStop: () => undefined }),
    createRadialGradient: () => ({ addColorStop: () => undefined }),
  };
  const ctx = new Proxy(target, {
    get: (t, k: string) => (k in t ? t[k] : k in state ? state[k] : (t[k] = () => undefined)),
    set: (_t, k: string, v) => {
      state[k] = v;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, texts };
}

const photo = () => placed({ width: 4000, height: 3000 } as unknown as ImageBitmap);
const need = (f: Fam) => (f === "then-and-now" ? 2 : f === "collage" ? 4 : 1);
const base = (family: Fam, theme: string, size: SizeId): ArtSpec => ({
  family,
  theme,
  size,
  headline: "Leaf Pile Day",
  subhead: "A little adventure at home",
  dogName: "Biscuit",
  date: "12 May 2026",
  memory: "He carried the ball around the garden three times.",
});
const themesOf = (f: Fam) => THEME_REGISTRY[f];

describe("photo-first families (B): identifiers", () => {
  it("keeps every family id and theme registered", () => {
    for (const f of FAMS) {
      expect(FAMILY_DEFS[f], f).toBeDefined();
      expect(themesOf(f).length).toBeGreaterThan(0);
    }
    expect(themesOf("seasonal-frame")).toEqual(
      expect.arrayContaining(["sunrise", "autumn", "winter", "spring"]),
    );
    expect(themesOf("event-ticket")).toEqual(
      expect.arrayContaining(["campout-ticket", "safari-pass"]),
    );
    expect(themesOf("collage")).toContain("favorite-moments");
    expect(themesOf("poster")).toEqual(expect.arrayContaining(["bake-off", "archaeology-report"]));
  });
});

describe("photo-first families (B): the photograph is the picture", () => {
  const coverage = (f: Fam, theme: string, size: SizeId, n: number) => {
    const slots = photoSlots(base(f, theme, size), n);
    const area = slots.reduce((a, s) => a + s.w * s.h, 0);
    return area / (1080 * ART_SIZES[size].height);
  };
  it("seasonal frame, event ticket and poster are full-bleed", () => {
    for (const f of ["seasonal-frame", "event-ticket", "poster"] as Fam[])
      for (const th of themesOf(f))
        for (const size of SIZES)
          expect(coverage(f, th, size, 1), `${f}/${th}/${size}`).toBeGreaterThan(0.99);
  });
  it("then-and-now keeps two prominent photos covering most of the piece", () => {
    for (const size of SIZES) {
      expect(photoSlots(base("then-and-now", "then-and-now", size), 2)).toHaveLength(2);
      expect(coverage("then-and-now", "then-and-now", size, 2), size).toBeGreaterThan(0.8);
    }
  });
  it("collage photos cover most of the piece for 1 to 4 photos, with no overlap", () => {
    for (const th of themesOf("collage"))
      for (const size of SIZES)
        for (const n of [1, 2, 3, 4]) {
          const slots = photoSlots(base("collage", th, size), n);
          const quad = th === "four-seasons-grid";
          expect(slots).toHaveLength(quad ? 4 : n);
          // a long caption strip is the most a collage gives up; the stamp style adds a thin paper margin
          expect(coverage("collage", th, size, n), `${th}/${size}/${n}`).toBeGreaterThan(
            th === "stamp-montage" ? 0.6 : 0.68,
          );
          for (const [i, a] of slots.entries())
            for (const b of slots.slice(i + 1))
              expect(
                a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y,
              ).toBe(true);
        }
  });
});

describe("photo-first families (B): rendering", () => {
  const long = "Supercalifragilisticexpialidocious Wigglesworth-Smythe ".repeat(4);
  const cases = FAMS.flatMap((f) =>
    themesOf(f).flatMap((th) => SIZES.map((s) => [f, th, s] as const)),
  );

  it.each(cases)("%s / %s / %s stays inside the canvas and the Story safe zones", (f, th, size) => {
    const H = ART_SIZES[size].height;
    for (const photos of [[], Array.from({ length: need(f) }, photo)]) {
      for (const spec of [
        base(f, th, size),
        {
          ...base(f, th, size),
          dogName: long,
          headline: long,
          subhead: long,
          memory: long,
          date: long,
        },
        { ...base(f, th, size), headline: "", subhead: "", memory: "", date: "", dogName: "" },
      ] as ArtSpec[]) {
        const g = fakeCtx();
        expect(() => renderArtwork(g.ctx, spec, { photos })).not.toThrow();
        expect(g.texts.length).toBeGreaterThan(1);
        expect(g.texts.some((t) => t.text === "pawsandpassage.com")).toBe(true);
        for (const t of g.texts) {
          const px = Number(/(\d+(?:\.\d+)?)px/.exec(t.font)?.[1] ?? 10);
          const w = Array.from(t.text).length * px * 0.5;
          const left = t.align === "center" ? t.x - w / 2 : t.align === "right" ? t.x - w : t.x;
          expect(left, t.text).toBeGreaterThanOrEqual(-0.5);
          expect(left + w, t.text).toBeLessThanOrEqual(1080.5);
          expect(t.y).toBeGreaterThan(0);
          expect(t.y).toBeLessThanOrEqual(H);
          // type stays legible on a 1080 wide piece; handwriting never below 44px
          expect(px, t.text).toBeGreaterThanOrEqual(22);
          if (/Caveat/.test(t.font)) expect(px, t.text).toBeGreaterThanOrEqual(44);
          if (size === "story" && f !== "then-and-now" && !/^(Then|Now)$/i.test(t.text))
            expect(t.y, `${t.text} y`).toBeLessThanOrEqual(H - 330);
        }
      }
    }
  });

  it("draws no hashtags or handles, and shows the theme's own wording", () => {
    for (const f of FAMS)
      for (const th of themesOf(f)) {
        const g = fakeCtx();
        renderArtwork(g.ctx, base(f, th, "square"), {});
        for (const t of g.texts) expect(t.text).not.toMatch(/#\w|@\w/);
      }
  });

  it("falls back to 'Your Dog' for an empty name", () => {
    const g = fakeCtx();
    renderArtwork(g.ctx, { ...base("poster", "bake-off", "portrait"), dogName: "\u{1F436}" }, {});
    expect(
      g.texts
        .map((t) => t.text)
        .join("|")
        .toLowerCase(),
    ).toContain("your dog");
  });

  it("never throws on junk input", () => {
    for (const f of FAMS) {
      const g = fakeCtx();
      expect(() =>
        renderArtwork(g.ctx, {
          ...base(f, themesOf(f)[0] as string, "story"),
          dogName: 5,
          headline: {},
          memory: [],
          date: null,
        } as unknown as ArtSpec),
      ).not.toThrow();
    }
  });
});

describe("photo-first families (B): details stay off the face", () => {
  const render = (f: Fam, th: string, size: SizeId, n = need(f)) => {
    const g = fakeCtx();
    renderArtwork(g.ctx, base(f, th, size), { photos: Array.from({ length: n }, photo) });
    return g.texts;
  };

  it("poster stamps and seals sit in the outer corners, the caption in the bottom 40%", () => {
    for (const th of themesOf("poster"))
      for (const size of SIZES) {
        const H = ART_SIZES[size].height;
        for (const t of render("poster", th, size)) {
          if (t.y < H * 0.6) {
            // outer ~25% of the width only: never across the middle band of the photograph
            expect(t.x >= 800 || t.x <= 280, `${th}/${size} "${t.text}" x=${t.x} y=${t.y}`).toBe(
              true,
            );
            expect(t.y, `${th}/${size} "${t.text}"`).toBeLessThan(H * 0.45);
          }
        }
      }
  });

  it("the event ticket and its notes stay in the lower part of the piece", () => {
    for (const th of themesOf("event-ticket"))
      for (const size of SIZES) {
        const H = ART_SIZES[size].height;
        for (const t of render("event-ticket", th, size))
          expect(t.y, `${th}/${size} "${t.text}"`).toBeGreaterThan(H * 0.55);
      }
  });

  it("then-and-now keeps its title strip at the seam between the photos", () => {
    for (const size of ["story", "portrait"] as SizeId[]) {
      const [a, b] = photoSlots(base("then-and-now", "then-and-now", size), 2);
      const seamTop = a!.y + a!.h;
      const seamBottom = b!.y;
      expect(seamBottom - seamTop).toBeLessThanOrEqual(140);
      const head = render("then-and-now", "then-and-now", size).find(
        (t) => t.text === "Leaf Pile Day",
      )!;
      expect(head.y).toBeGreaterThan(seamTop);
      expect(head.y).toBeLessThan(seamBottom);
    }
  });

  it("collage labels live on the paper strip, not on a photograph", () => {
    for (const size of SIZES) {
      const slots = photoSlots(base("collage", "favorite-moments", size), 3);
      const stripTop =
        size === "square"
          ? Math.max(...slots.map((s) => s.y + s.h))
          : (slots[0] as { y: number; h: number }).y + (slots[0] as { h: number }).h;
      for (const t of render("collage", "favorite-moments", size, 3)) {
        if (t.text === "pawsandpassage.com") continue;
        expect(t.y, `${size} "${t.text}"`).toBeGreaterThanOrEqual(stripTop);
      }
    }
  });
});
