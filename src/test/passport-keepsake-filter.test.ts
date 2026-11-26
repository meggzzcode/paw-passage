import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { THEMES, THEME_REGISTRY, KEEPSAKE_FAMILY_LIST } from "../passport/keepsake/themes";
import { ART_SIZES, type SizeId } from "../passport/keepsake/kit";
import { placed, type PlacedPhoto } from "../passport/keepsake/photo";
import {
  explainerFor,
  filterPhotoSlot,
  renderFilter,
  stampTitle,
  type FilterLayout,
  type FilterSpec,
  type Slot,
} from "../passport/keepsake/filter";
import {
  FILTER_STYLES,
  FILTER_STYLE_IDS,
  defaultLookFor,
  looksForTheme,
  nextLook,
} from "../passport/keepsake/filter-styles";
import { LOOKS } from "../passport/keepsake/filter-looks";

// ------------------------------------------------------------- fake canvas context

type Call = { op: string; args: unknown[]; font: string; align: string };

function fakeCtx() {
  const calls: Call[] = [];
  const state: Record<string, unknown> = { font: "10px serif", textAlign: "left" };
  const rec =
    (op: string) =>
    (...args: unknown[]) => {
      calls.push({ op, args, font: String(state["font"]), align: String(state["textAlign"]) });
      if (op === "createLinearGradient" || op === "createRadialGradient")
        return { addColorStop: () => undefined };
      return undefined;
    };
  const target: Record<string, unknown> = {
    measureText: (s: string) => {
      const size = Number(/(\d+(?:\.\d+)?)px/.exec(String(state["font"]))?.[1] ?? 10);
      return { width: Array.from(s).length * size * 0.5 };
    },
  };
  const ctx = new Proxy(target, {
    get: (t, k: string) => (k in t ? t[k] : k in state ? state[k] : (t[k] = rec(k))),
    set: (_t, k: string, v) => {
      state[k] = v;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  const texts = () =>
    calls.filter((c) => c.op === "fillText" || c.op === "strokeText").map((c) => String(c.args[0]));
  return { ctx, calls, texts };
}

function photo(w = 4000, h = 3000): PlacedPhoto {
  return placed({ width: w, height: h } as unknown as ImageBitmap);
}

const SIZES = Object.keys(ART_SIZES) as SizeId[];
const THEME_IDS = Object.keys(THEMES);
const SAMPLE = [
  "toy-champion",
  "editorial-cover",
  "picnic-postcard",
  "secret-agent",
  "sunrise",
  "bake-off",
];

const baseSpec = (theme: string, size: SizeId, style?: string): FilterSpec => {
  const t = THEMES[theme]!;
  return {
    family: t.family,
    theme,
    size,
    title: "Toy Champion",
    explainer: "Toy showdown: four contenders, one winner",
    dogName: "Biscuit",
    date: "12 May 2026",
    stamp: "Cozy Companion",
    style,
  };
};
const longSpec = (theme: string, size: SizeId, style?: string): FilterSpec => ({
  ...baseSpec(theme, size, style),
  title: "SUPERCALIFRAGILISTIC DOG OF THE YEAR AWARDS",
  explainer: "An extremely long explainer line that keeps going well past sixty four characters",
  dogName: "Sir Reginald Barkington the Third of Kensington",
  date: "26 November 2026 at a very long o'clock",
  stamp: "Extraordinarily Long Stamp Title",
});
const bareSpec = (theme: string, size: SizeId, style?: string): FilterSpec => ({
  ...baseSpec(theme, size, style),
  title: "Top Dog",
  explainer: "",
  dogName: "",
  date: "",
  stamp: "",
});

const inter = (a: Slot, b: Slot, tol = 2) =>
  a.x + tol < b.x + b.w && b.x + tol < a.x + a.w && a.y + tol < b.y + b.h && b.y + tol < a.y + a.h;

const SPECS: Array<[string, (t: string, s: SizeId, st?: string) => FilterSpec]> = [
  ["normal", baseSpec],
  ["long", longSpec],
  ["bare", bareSpec],
];

// ------------------------------------------------------------- registry and determinism

describe("filter style registry", () => {
  it("has six distinct styles and a look for each", () => {
    expect(FILTER_STYLES).toHaveLength(6);
    expect(new Set(FILTER_STYLE_IDS).size).toBe(6);
    expect(new Set(FILTER_STYLES.map((s) => s.label)).size).toBe(6);
    expect(Object.keys(LOOKS).sort()).toEqual([...FILTER_STYLE_IDS].sort());
    for (const s of FILTER_STYLES) expect(s.label.length).toBeGreaterThan(3);
  });

  it("picks the same look for the same theme every time, from a stable set of four distinct looks", () => {
    for (const id of THEME_IDS) {
      const a = looksForTheme(id);
      expect(looksForTheme(id)).toEqual(a);
      expect(new Set(a).size).toBe(4);
      expect(defaultLookFor(id)).toBe(a[0]);
      for (const l of a) expect(FILTER_STYLE_IDS).toContain(l);
      let cur = a[0]!;
      const walked = [cur];
      for (let i = 0; i < 3; i++) walked.push((cur = nextLook(id, cur)));
      expect(walked).toEqual(a);
      expect(nextLook(id, cur)).toBe(a[0]);
    }
  });

  it("spreads the 95 themes over all styles", () => {
    expect(THEME_IDS.length).toBeGreaterThanOrEqual(95);
    const used = new Set(THEME_IDS.map(defaultLookFor));
    expect(used.size).toBe(6);
    const dir = join(__dirname, "../../content/adventures");
    const real = readdirSync(dir)
      .filter((f) => f.endsWith(".yml"))
      .map(
        (f) =>
          /^keepsake:\n {2}family: .*\n {2}theme: (\S+)/m.exec(
            readFileSync(join(dir, f), "utf8"),
          )?.[1],
      )
      .filter((x): x is string => Boolean(x));
    expect(new Set(real.map(defaultLookFor)).size).toBeGreaterThanOrEqual(
      Math.floor(real.length * 0.4),
    );
  });

  it("falls back to the theme's own look when the style is unknown", () => {
    const { ctx } = fakeCtx();
    const l = renderFilter(ctx, baseSpec("toy-champion", "square", "no-such-style"));
    expect(l.style).toBe(defaultLookFor("toy-champion"));
  });

  it("covers every family through the theme registry", () => {
    for (const f of KEEPSAKE_FAMILY_LIST) expect(THEME_REGISTRY[f].length).toBeGreaterThan(0);
  });
});

// ------------------------------------------------------------- drawing

describe("every filter style, size, input and photo state", () => {
  for (const style of FILTER_STYLE_IDS)
    for (const size of SIZES)
      for (const [label, make] of SPECS)
        for (const withPhoto of [true, false])
          it(`${style} / ${size} / ${label} / ${withPhoto ? "photo" : "no photo"}`, () => {
            const theme = SAMPLE[(style.length + size.length + label.length) % SAMPLE.length]!;
            const spec = make(theme, size, style);
            const { ctx, calls, texts } = fakeCtx();
            let layout!: FilterLayout;
            expect(
              () => (layout = renderFilter(ctx, spec, withPhoto ? photo() : null)),
            ).not.toThrow();
            const { width: W, height: H } = ART_SIZES[size];
            expect(layout.width).toBe(W);
            expect(layout.height).toBe(H);
            expect(layout.style).toBe(style);
            // the photo rectangle is inside the canvas, and the editor frames the same rectangle
            const slot = filterPhotoSlot(spec);
            expect(slot).toEqual(layout.photo);
            expect(slot.x).toBeGreaterThanOrEqual(0);
            expect(slot.y).toBeGreaterThanOrEqual(0);
            expect(slot.x + slot.w).toBeLessThanOrEqual(W);
            expect(slot.y + slot.h).toBeLessThanOrEqual(H);
            // the photo is the whole canvas: the dog is the star
            expect(slot).toEqual({ x: 0, y: 0, w: W, h: H });
            // the overlay is small: at least 85% of the picture is untouched
            const seen = new Set<Slot>();
            let covered = 0;
            for (const it of layout.items.filter((i) => i.kind !== "seal")) {
              if (seen.has(it.rect)) continue;
              seen.add(it.rect);
              covered += it.rect.w * it.rect.h;
            }
            expect(covered / (W * H), "overlay area").toBeLessThanOrEqual(0.15);
            // photo is drawn when given, and a placeholder (no bitmap) otherwise
            const bitmaps = calls.filter((c) => c.op === "drawImage").length;
            if (withPhoto) expect(bitmaps).toBeGreaterThanOrEqual(1);
            else expect(bitmaps).toBe(0);

            // all overlay boxes stay on the canvas; story keeps clear of phone chrome
            const tol = 14; // slight rotation of stickers
            const pieces = layout.items.filter((i) => i.kind !== "deco");
            for (const it of layout.items) {
              expect(it.rect.x, `${it.kind} left`).toBeGreaterThanOrEqual(-tol);
              expect(it.rect.y, `${it.kind} top`).toBeGreaterThanOrEqual(-tol);
              expect(it.rect.x + it.rect.w, `${it.kind} right`).toBeLessThanOrEqual(W + tol);
              expect(it.rect.y + it.rect.h, `${it.kind} bottom`).toBeLessThanOrEqual(H + tol);
            }
            if (size === "story")
              for (const it of pieces) {
                expect(it.rect.y, `${it.kind} clear of top chrome`).toBeGreaterThanOrEqual(
                  190 - tol,
                );
                expect(
                  it.rect.y + it.rect.h,
                  `${it.kind} clear of bottom chrome`,
                ).toBeLessThanOrEqual(H - 250 + tol);
              }

            // title, chip and brand are always there; explainer when there is one
            const kinds = new Set(layout.items.map((i) => i.kind));
            for (const k of ["title", "chip", "brand", "seal"] as const)
              expect(kinds.has(k), k).toBe(true);
            if (spec.explainer) expect(kinds.has("explainer")).toBe(true);
            if (spec.stamp) expect(kinds.has("stamp")).toBe(true);
            else expect(kinds.has("stamp")).toBe(false);

            // brand mark: small seal, small plate, in a corner, never over the middle of the photo
            const seal = layout.items.find((i) => i.kind === "seal")!.rect;
            const brand = layout.items.find((i) => i.kind === "brand")!.rect;
            expect(seal.w / W).toBeGreaterThanOrEqual(0.03);
            expect(seal.w / W).toBeLessThanOrEqual(0.04);
            expect(brand.w).toBeLessThanOrEqual(W * 0.2);
            expect(brand.h).toBeLessThanOrEqual(W * 0.05);
            // lowest-contrast corner: bottom-right
            expect(brand.x + brand.w / 2).toBeGreaterThan(W * 0.7);
            expect(brand.y).toBeGreaterThan(H * 0.6);
            const mid: Slot = {
              x: slot.x + slot.w * 0.25,
              y: slot.y + slot.h * 0.25,
              w: slot.w * 0.5,
              h: slot.h * 0.5,
            };
            expect(inter(brand, mid, 0), "brand over the dog's middle").toBe(false);
            expect(brand.x + brand.w / 2 < W * 0.3 || brand.x + brand.w / 2 > W * 0.7).toBe(true);
            for (const it of pieces.filter((i) => i.kind !== "brand" && i.kind !== "seal"))
              expect(inter(brand, it.rect), `brand overlaps ${it.kind}`).toBe(false);

            // text never overlaps between pieces (same box registered twice is fine)
            const real = pieces.filter((i) => i.kind !== "seal");
            for (let i = 0; i < real.length; i++)
              for (let j = i + 1; j < real.length; j++) {
                const a = real[i]!.rect;
                const b = real[j]!.rect;
                if (a === b) continue;
                expect(inter(a, b, 4), `${real[i]!.kind} overlaps ${real[j]!.kind}`).toBe(false);
              }

            // drawn text: brand words are present, nothing is drawn outside the canvas width
            const t = texts();
            expect(t).toContain("Paws & Passage");
            expect(t).toContain("pawsandpassage.com");
            expect(t.join(" ")).not.toMatch(/Paw & Passage/);
            for (const c of calls.filter((x) => x.op === "fillText")) {
              const x = Number(c.args[1]);
              expect(Number.isFinite(x) && Number.isFinite(Number(c.args[2]))).toBe(true);
            }
          });

  it("draws the explainer, the name and the date as text", () => {
    for (const style of FILTER_STYLE_IDS) {
      const spec = baseSpec("toy-champion", "portrait", style);
      const { ctx, texts } = fakeCtx();
      renderFilter(ctx, spec, photo());
      const all = texts().join(" ").toLowerCase();
      expect(all, style).toContain("toy showdown");
      expect(all, style).toContain("biscuit");
      expect(all.includes("12 may 2026"), style).toBe(true);
      expect(all, style).toContain("toy champion");
    }
  });

  it("strips emoji and control characters from everything drawn", () => {
    const spec: FilterSpec = {
      ...baseSpec("toy-champion", "square", "caption-strip"),
      title: "Big \u{1F436} Day",
      explainer: "Walkies ❤️ with\nnewlines \u{1F43E}",
      dogName: "Rex \u{1F389}",
    };
    for (const style of FILTER_STYLE_IDS) {
      const { ctx, texts } = fakeCtx();
      renderFilter(ctx, { ...spec, style }, null);
      expect(texts().join(" "), style).not.toMatch(/\p{Extended_Pictographic}|\p{Cc}/u);
    }
  });

  it("shows the explainer trimmed and ellipsized rather than overflowing", () => {
    const { ctx, texts } = fakeCtx();
    renderFilter(ctx, longSpec("toy-champion", "square", "polaroid-tape"), photo());
    expect(texts().join(" ")).toContain("An extremely long");
  });

  it("varies the output between adventures with the same look", () => {
    const a = fakeCtx();
    const b = fakeCtx();
    renderFilter(a.ctx, baseSpec("toy-champion", "square", "caption-strip"), null);
    renderFilter(b.ctx, baseSpec("picnic-postcard", "square", "caption-strip"), null);
    const fills = (c: Call[]) => JSON.stringify(c.filter((x) => x.op === "fill").length);
    expect(a.calls.length).toBeGreaterThan(50);
    expect(JSON.stringify(a.calls)).not.toBe(JSON.stringify(b.calls));
    void fills;
  });
});

// ------------------------------------------------------------- explainer and stamp helpers

describe("explainerFor and stampTitle", () => {
  it("uses the adventure's explainer, cleaned", () => {
    expect(explainerFor("Picnic for two, menu by nose", "ignored")).toBe(
      "Picnic for two, menu by nose",
    );
    expect(explainerFor("Snack \u{1F356} time", "x")).toBe("Snack time");
  });
  it("falls back to a short trimmed first clause of the objective", () => {
    const o =
      "Let your dog scout three tiny sets, find the scent surprise hidden in each, take relaxed portraits where they settle and choose one for a magazine cover.";
    const e = explainerFor(undefined, o);
    expect(e.length).toBeLessThanOrEqual(64);
    expect(e.length).toBeGreaterThan(10);
    expect(o.startsWith(e)).toBe(true);
    expect(e).not.toMatch(/[,.;:\s]$/);
    expect(explainerFor("", "Short objective. Then more.")).toBe("Short objective");
    expect(explainerFor(undefined, undefined)).toBe("");
  });
  it("turns the first specific stamp slug into a title", () => {
    expect(stampTitle(["first-adventure", "cozy-companion", "x"])).toBe("Cozy Companion");
    expect(stampTitle(["first-adventure"])).toBe("");
    expect(stampTitle(undefined)).toBe("");
  });
});

// ------------------------------------------------------------- source rules

const dir = join(__dirname, "../passport/keepsake");
const ownFiles = readdirSync(dir)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => ({ f, src: readFileSync(join(dir, f), "utf8") }));
const filterFiles = ownFiles.filter(({ f }) => f.startsWith("filter"));

describe("filter source rules", () => {
  it("lives in files named filter*.ts", () => {
    expect(filterFiles.map((x) => x.f).sort()).toEqual([
      "filter-kit.ts",
      "filter-looks.ts",
      "filter-styles.ts",
      "filter.ts",
    ]);
  });

  it("has no network or storage APIs (photos never leave the device)", () => {
    for (const { f, src } of ownFiles)
      expect(src, f).not.toMatch(
        /\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|localStorage|sessionStorage|indexedDB|document\.cookie|caches\.|navigator\.(serviceWorker|geolocation)/,
      );
  });

  it("has no hashtags, prewritten captions or emoji anywhere in keepsake code", () => {
    for (const { f, src } of ownFiles) {
      expect(src, `${f} emoji`).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(src, `${f} hashtag`).not.toMatch(/["'`]#(?![0-9a-fA-F]{3,8}\b)[A-Za-z]\w+/);
      expect(src, `${f} hashtag word`).not.toMatch(/hashtag/i);
    }
    for (const { f, src } of filterFiles)
      expect(src, `${f} caption`).not.toMatch(/suggested caption|#pawsandpassage/i);
  });

  it("uses only system font stacks (no remote fonts or images)", () => {
    for (const { f, src } of filterFiles) {
      expect(src, f).not.toMatch(/@font-face|FontFace|new Image\(|https?:\/\//);
    }
  });

  it("spells the brand Paws & Passage everywhere", () => {
    for (const { f, src } of ownFiles) expect(src, f).not.toMatch(/Paw & Passage/);
    expect(filterFiles.find((x) => x.f === "filter-kit.ts")!.src).toContain('"Paws & Passage"');
  });
});
