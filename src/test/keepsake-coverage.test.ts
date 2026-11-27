// Keepsake coverage: every published adventure resolves to a real family + theme, nothing relies on the generic fallback,
// and every family renders in all three output formats with long names and missing optional fields.
// Part (a) uses the free cards in this repository and always runs. Part (b) is an OWNER-MACHINE check: it reads the
// KEEPSAKE FIELDS ONLY of the real premium package (family, theme, headline lengths) and is skipped, visibly, without
// PREMIUM_DIR (docs/PREMIUM-INTEGRATION-TESTS.md). No premium text is read into any assertion message.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { adventures } from "../passport/content";
import { KEEPSAKE_FAMILIES } from "../passport/schema";
import { FAMILY_DEFS, ART_SIZES, renderArtwork, type ArtSpec } from "../passport/keepsake/artwork";
import { renderFilter } from "../passport/keepsake/filter";
import { LOOKS } from "../passport/keepsake/filter-looks";
import { looksForTheme } from "../passport/keepsake/filter-styles";
import { placed } from "../passport/keepsake/photo";
import { MOTIFS, THEMES, THEME_REGISTRY, themeFor } from "../passport/keepsake/themes";
import type { SizeId } from "../passport/keepsake/kit";

const PREMIUM_DIR = process.env["PREMIUM_DIR"]?.trim() || "";
const HAS_PREMIUM = Boolean(PREMIUM_DIR) && existsSync(PREMIUM_DIR);

interface Mapping {
  id: string;
  family: string;
  theme: string;
  headline?: string | undefined;
  subhead?: string | undefined;
  explainer?: string | undefined;
}

const FAMILIES = new Set<string>(KEEPSAKE_FAMILIES);
const SIZES = Object.keys(ART_SIZES) as SizeId[];
const MOTIF_SET = new Set<string>(MOTIFS);

/** Everything that can go wrong with one mapping, as short codes (never card text). */
function problems(m: Mapping): string[] {
  const out: string[] = [];
  if (!FAMILIES.has(m.family)) out.push("unknown-family");
  const t = THEMES[m.theme];
  if (!t) out.push("unknown-theme");
  else {
    if (t.family !== m.family) out.push("theme-belongs-to-other-family");
    // The generic fallback is themeFor() returning the family's first theme for a name it does not know.
    if (themeFor(m.family as ArtSpec["family"], m.theme).id !== m.theme && FAMILIES.has(m.family))
      out.push("would-use-fallback");
    if (!MOTIF_SET.has(t.motif) || !MOTIF_SET.has(t.motif2)) out.push("unknown-motif");
    if (!FAMILY_DEFS[t.family]) out.push("no-renderer");
    const looks = looksForTheme(t.id);
    if (looks.length !== 4 || looks.some((l) => !LOOKS[l])) out.push("bad-photo-look");
  }
  if (!m.headline || m.headline.length > 40) out.push("headline-missing-or-over-40");
  if (m.subhead !== undefined && (!m.subhead || m.subhead.length > 60)) out.push("subhead-bad");
  if (m.explainer !== undefined && (!m.explainer || m.explainer.length > 64))
    out.push("explainer-bad");
  return out;
}

const freeCards = adventures.filter((a) => a.access === "free");
const freeMappings: Mapping[] = freeCards.map((a) => ({ id: a.id, ...a.keepsake }));

function premiumMappings(): Mapping[] {
  return readdirSync(PREMIUM_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => {
      const j = JSON.parse(readFileSync(join(PREMIUM_DIR, f), "utf8")) as {
        id: string;
        status?: string;
        keepsake?: Partial<Mapping>;
      };
      const k = j.keepsake ?? {};
      return {
        id: j.id,
        family: String(k.family),
        theme: String(k.theme),
        headline: k.headline,
        subhead: k.subhead,
        explainer: k.explainer,
      };
    });
}

// ------------------------------------------------------------- fake canvas (same idea as the keepsake art tests)
function fakeCtx() {
  const texts: { text: string; left: number; right: number; y: number }[] = [];
  const state: Record<string, unknown> = { font: "10px serif", textAlign: "left" };
  let tx = 0;
  let ty = 0;
  const stack: Array<[number, number]> = [];
  const width = (s: string) =>
    Array.from(s).length * Number(/(\d+(?:\.\d+)?)px/.exec(String(state["font"]))?.[1] ?? 10) * 0.5;
  const rec =
    (op: string) =>
    (...args: unknown[]) => {
      if (op === "save") stack.push([tx, ty]);
      if (op === "restore") [tx, ty] = stack.pop() ?? [0, 0];
      if (op === "translate") {
        tx += Number(args[0]);
        ty += Number(args[1]);
      }
      if (op === "fillText" || op === "strokeText") {
        const text = String(args[0]);
        const w = width(text);
        const x = Number(args[1]) + tx;
        const a = String(state["textAlign"]);
        const left = a === "center" ? x - w / 2 : a === "right" ? x - w : x;
        texts.push({ text, left, right: left + w, y: Number(args[2]) + ty });
      }
      if (op === "createLinearGradient" || op === "createRadialGradient")
        return { addColorStop: () => undefined };
      return undefined;
    };
  const target: Record<string, unknown> = { measureText: (s: string) => ({ width: width(s) }) };
  const ctx = new Proxy(target, {
    get: (t, k: string) => (k in t ? t[k] : k in state ? state[k] : (t[k] = rec(k))),
    set: (_t, k: string, v) => {
      state[k] = v;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, texts };
}

const photo = () => placed({ width: 4000, height: 3000 } as unknown as ImageBitmap);
const LONG = "Supercalifragilisticexpialidocious Wigglesworth-Smythe ".repeat(4);

function expectInside(texts: ReturnType<typeof fakeCtx>["texts"], H: number, label: string) {
  expect(texts.length, label).toBeGreaterThan(1);
  for (const t of texts) {
    expect(t.left, `${label} left`).toBeGreaterThanOrEqual(-0.5);
    expect(t.right, `${label} right`).toBeLessThanOrEqual(1080.5);
    expect(t.y, `${label} y`).toBeGreaterThan(0);
    expect(t.y, `${label} y`).toBeLessThanOrEqual(H + 0.5);
  }
}

// ------------------------------------------------------------- (a) free cards, always on
describe("keepsake mapping: free cards in this repository", () => {
  it("finds the free cards", () => {
    expect(freeCards.length).toBeGreaterThanOrEqual(13);
    expect(new Set(freeCards.map((a) => a.id)).size).toBe(freeCards.length);
  });

  it.each(freeMappings.map((m) => [m.id, m] as const))(
    "%s has a valid family and theme, no fallback, nothing missing",
    (_id, m) => {
      expect(problems(m)).toEqual([]);
    },
  );

  it("keepsake themes are code-drawn: the renderer references no image file that could be missing", () => {
    const dir = join(process.cwd(), "src/passport/keepsake");
    for (const f of readdirSync(dir).filter((x) => x.endsWith(".ts"))) {
      const src = readFileSync(join(dir, f), "utf8");
      expect(src, f).not.toMatch(/["'`][^"'`\n]*\.(png|jpe?g|webp|svg|gif)["'`]/i);
      expect(src, f).not.toMatch(/\burl\(/);
    }
  });

  it("every registered theme names a family that has a renderer and a first (default) theme", () => {
    for (const f of KEEPSAKE_FAMILIES) {
      expect(FAMILY_DEFS[f], f).toBeTruthy();
      expect(THEME_REGISTRY[f].length, f).toBeGreaterThan(0);
    }
  });
});

// ------------------------------------------------------------- (b) all 117, owner machine only
describe("keepsake mapping: the whole library (OWNER-MACHINE)", () => {
  it.skipIf(!HAS_PREMIUM)(
    "OWNER-MACHINE (skipped: PREMIUM_DIR not set): all 117 cards resolve to a supported family and theme with no fallback",
    () => {
      const premium = premiumMappings();
      const all = [...freeMappings, ...premium];
      expect(new Set(all.map((m) => m.id)).size).toBe(all.length);
      expect(premium.length).toBeGreaterThanOrEqual(100);
      const bad = all.map((m) => [m.id, problems(m)] as const).filter(([, p]) => p.length > 0);
      expect(bad).toEqual([]);
      // a premium theme may be shared, but every card uses a theme of its own family
      for (const m of all) expect(THEMES[m.theme]?.family, m.id).toBe(m.family);
    },
  );

  it.skipIf(!HAS_PREMIUM)(
    "OWNER-MACHINE (skipped: PREMIUM_DIR not set): every mapped theme renders at all three formats",
    () => {
      const seen = new Set<string>();
      for (const m of [...freeMappings, ...premiumMappings()]) {
        const key = `${m.family}/${m.theme}`;
        if (seen.has(key)) continue;
        seen.add(key);
        for (const size of SIZES) {
          const f = fakeCtx();
          renderArtwork(f.ctx, {
            family: m.family as ArtSpec["family"],
            theme: m.theme,
            headline: m.headline ?? "",
            dogName: "Biscuit",
            size,
          });
          expectInside(f.texts, ART_SIZES[size].height, `${key} ${size}`);
        }
      }
      expect(seen.size).toBeGreaterThan(100);
    },
  );
});

// ------------------------------------------------------------- (c) every family renders, all formats
describe("every keepsake family renders in all three formats", () => {
  // each family's default theme plus every theme the free cards use
  const pairs = new Map<string, { family: ArtSpec["family"]; theme: string }>();
  for (const f of KEEPSAKE_FAMILIES) {
    const theme = THEME_REGISTRY[f][0] as string;
    pairs.set(`${f}/${theme}`, { family: f, theme });
  }
  for (const m of freeMappings)
    pairs.set(`${m.family}/${m.theme}`, { family: m.family as ArtSpec["family"], theme: m.theme });

  const cases = [...pairs.entries()].flatMap(([key, p]) => SIZES.map((s) => [key, p, s] as const));

  it("covers all ten families", () => {
    expect(new Set([...pairs.values()].map((p) => p.family)).size).toBe(KEEPSAKE_FAMILIES.length);
    expect(SIZES.map((s) => `${ART_SIZES[s].width}x${ART_SIZES[s].height}`).sort()).toEqual([
      "1080x1080",
      "1080x1350",
      "1080x1920",
    ]);
  });

  it.each(cases)(
    "%s artwork at %s: long names and missing optional fields stay inside",
    (key, p, size) => {
      const need = p.family === "then-and-now" ? 2 : p.family === "collage" ? 4 : 1;
      const H = ART_SIZES[size].height;
      const variants: Array<[string, Partial<ArtSpec>, boolean]> = [
        [
          "long text",
          { dogName: LONG, headline: LONG, subhead: LONG, memory: LONG, date: LONG },
          true,
        ],
        ["required only, no photo", { dogName: "Biscuit", headline: "Toy Champion" }, false],
        ["no name, no headline", { dogName: "", headline: "" }, false],
      ];
      for (const [label, over, withPhotos] of variants) {
        const f = fakeCtx();
        const photos = withPhotos ? Array.from({ length: need }, () => photo()) : [];
        expect(() =>
          renderArtwork(f.ctx, { family: p.family, theme: p.theme, size, ...over } as ArtSpec, {
            photos,
          }),
        ).not.toThrow();
        expectInside(f.texts, H, `${key} ${size} ${label}`);
      }
    },
  );

  it.each(cases)(
    "%s photo overlay at %s: long text and missing optional fields stay inside",
    (key, p, size) => {
      const H = ART_SIZES[size].height;
      const variants = [
        { title: LONG, explainer: LONG, dogName: LONG, date: LONG, stamp: LONG },
        { title: "Toy Champion", explainer: "", dogName: "Biscuit" },
        { title: "", explainer: "", dogName: "" },
      ];
      for (const [i, v] of variants.entries()) {
        const f = fakeCtx();
        expect(() =>
          renderFilter(f.ctx, { family: p.family, theme: p.theme, size, ...v }, photo()),
        ).not.toThrow();
        expectInside(f.texts, H, `${key} ${size} overlay ${i}`);
      }
    },
  );

  it("every adventure's photo-overlay look set is four distinct, registered looks", () => {
    for (const t of Object.values(THEMES)) {
      const looks = looksForTheme(t.id);
      expect(new Set(looks).size, t.id).toBe(4);
      for (const l of looks) expect(LOOKS[l], `${t.id}/${l}`).toBeTruthy();
    }
  });
});

// ------------------------------------------------------------- (d) + (e) existing guarantees stay covered
describe("existing keepsake guarantees are still covered", () => {
  const read = (f: string) => readFileSync(join(process.cwd(), "src/test", f), "utf8");

  it("(d) free visitors cannot reach the paid editor: gating tests exist", () => {
    const g = read("keepsake-gating.test.tsx");
    expect(g).toContain("free visitor: no uploader, no canvas, no editor import call");
    expect(g).toContain("offline or revoked sessions never mount the editor");
    expect(g).toContain("checking state loads nothing");
  });

  it("(e) generated output carries no input metadata: art tests exist and the filter encodes only through a canvas", () => {
    const a = read("passport-keepsake-art.test.ts");
    expect(a).toContain(
      "makeArtworkBlob output has no eXIf/text chunks and no EXIF or GPS markers",
    );
    expect(a).toContain("never copies the original file bytes");
    const src = readFileSync(join(process.cwd(), "src/passport/keepsake/filter.ts"), "utf8");
    expect(src).toMatch(/convertToBlob\(\{ type: "image\/png" \}\)/);
    expect(src).toMatch(/toBlob\(/);
    expect(src).not.toMatch(/arrayBuffer|FileReader|new Blob\(/);
  });
});
