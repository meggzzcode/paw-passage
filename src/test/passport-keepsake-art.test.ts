import { describe, expect, it, vi } from "vitest";
import { deflateSync } from "node:zlib";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { KEEPSAKE_FAMILIES } from "../passport/schema";
import {
  FONTS,
  KEEPSAKE_FAMILY_LIST,
  THEMES,
  MOTIFS,
  THEME_REGISTRY,
  themeFor,
} from "../passport/keepsake/themes";
import {
  ART_SIZES,
  makeArtworkBlob,
  photoSlots,
  renderArtwork,
  type ArtSpec,
  type SizeId,
} from "../passport/keepsake/artwork";
import { FONT_HAND } from "../passport/keepsake/fonts";
import { SERIF, downloadBlob, shareBlob } from "../passport/keepsake/render";
import {
  MAX_PHOTO_BYTES,
  PhotoError,
  clampPlacement,
  downscaledSize,
  drawPlacedPhoto,
  loadPhotoFile,
  panByDrag,
  placed,
  rotateQuarter,
  type PlacedPhoto,
} from "../passport/keepsake/photo";
import { luminance, contrast } from "../passport/keepsake/kit";

// ------------------------------------------------------------- fake canvas context

type Call = { op: string; args: unknown[]; font: string; align: string };

function fakeCtx() {
  const calls: Call[] = [];
  const fonts = new Set<string>();
  const state: Record<string, unknown> = { font: "10px serif", textAlign: "left" };
  let tx = 0;
  let ty = 0;
  const stack: Array<[number, number]> = [];
  const rec =
    (op: string) =>
    (...args: unknown[]) => {
      if (op === "save") stack.push([tx, ty]);
      if (op === "restore") [tx, ty] = stack.pop() ?? [0, 0];
      if (op === "translate") {
        tx += Number(args[0]);
        ty += Number(args[1]);
      }
      const a =
        op === "fillText" || op === "strokeText"
          ? [args[0], Number(args[1]) + tx, Number(args[2]) + ty]
          : args;
      calls.push({ op, args: a, font: String(state["font"]), align: String(state["textAlign"]) });
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
      if (k === "font") fonts.add(String(v));
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  const texts = () =>
    calls
      .filter((c) => c.op === "fillText" || c.op === "strokeText")
      .map((c) => {
        const size = Number(/(\d+(?:\.\d+)?)px/.exec(c.font)?.[1] ?? 10);
        const text = String(c.args[0]);
        const w = Array.from(text).length * size * 0.5;
        const x = Number(c.args[1]);
        const left = c.align === "center" ? x - w / 2 : c.align === "right" ? x - w : x;
        return { text, left, right: left + w, y: Number(c.args[2]), size };
      });
  return { ctx, calls, texts, fonts };
}

function photo(w = 4000, h = 3000): PlacedPhoto {
  return placed({ width: w, height: h } as unknown as ImageBitmap);
}

const baseSpec = (family: ArtSpec["family"], theme: string, size: SizeId): ArtSpec => ({
  family,
  theme,
  size,
  headline: "Toy Champion Showdown",
  subhead: "A little adventure at home",
  dogName: "Biscuit",
  date: "12 May 2026",
  memory: "He carried the ball around the garden three times.",
});

const ALL = Object.values(THEMES);
const SIZES = Object.keys(ART_SIZES) as SizeId[];

// ------------------------------------------------------------- registry

describe("theme registry", () => {
  it("covers exactly the families in the schema", () => {
    expect([...KEEPSAKE_FAMILY_LIST]).toEqual([...KEEPSAKE_FAMILIES]);
    expect(Object.keys(THEME_REGISTRY).sort()).toEqual([...KEEPSAKE_FAMILIES].sort());
  });

  it("contains at least the contract themes", () => {
    const min: Record<string, string[]> = {
      "travel-postcard": ["picnic-postcard", "hometown-postcard", "day-trip"],
      "magazine-cover": ["toy-champion", "editorial-cover", "birthday-cover"],
      "id-card": ["secret-agent"],
      "trading-card": ["explorer-card"],
      certificate: ["toy-champion-certificate", "explorer"],
      "seasonal-frame": ["sunrise", "autumn"],
      "event-ticket": ["campout-ticket", "safari-pass"],
      "then-and-now": ["then-and-now"],
      collage: ["favorite-moments"],
      poster: ["bake-off", "archaeology-report"],
    };
    for (const [family, themes] of Object.entries(min))
      for (const t of themes)
        expect(THEME_REGISTRY[family as keyof typeof THEME_REGISTRY], `${family}/${t}`).toContain(
          t,
        );
  });

  it("gives every theme its family, a motif pair and readable palette text", () => {
    for (const t of ALL) {
      expect(THEME_REGISTRY[t.family]).toContain(t.id);
      expect(
        contrast(t.palette.card, t.palette.bg) + contrast(t.palette.card, t.palette.ink),
      ).toBeGreaterThan(1);
      expect(luminance(t.palette.bg)).toBeGreaterThanOrEqual(0);
    }
  });

  it("offers a wide set of distinct themes in every family", () => {
    expect(ALL.length).toBeGreaterThanOrEqual(117);
    const min: Record<string, number> = {
      "travel-postcard": 30,
      "magazine-cover": 10,
      "id-card": 11,
      "trading-card": 14,
      certificate: 11,
      "seasonal-frame": 13,
      "event-ticket": 10,
      "then-and-now": 1,
      collage: 7,
      poster: 10,
    };
    for (const [f, n] of Object.entries(min))
      expect(THEME_REGISTRY[f as keyof typeof THEME_REGISTRY].length, f).toBeGreaterThanOrEqual(n);
    const ids = ALL.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only known motifs, frames and variants, and never copies another theme's look", () => {
    const frames = [
      "double",
      "ticks",
      "scallop",
      "bold",
      "none",
      "stripes",
      "filmstrip",
      "rope",
      "marquee",
      "lace",
      "stitch",
    ];
    const looks = new Set<string>();
    for (const t of ALL) {
      expect(MOTIFS, t.id).toContain(t.motif);
      expect(MOTIFS, t.id).toContain(t.motif2);
      expect(frames, t.id).toContain(t.frame);
      const look = [t.family, t.palette.bg, t.palette.accent, t.motif, t.motif2].join("|");
      expect(looks.has(look), `${t.id} duplicates another theme's look`).toBe(false);
      looks.add(look);
    }
  });

  it("keeps text readable on the ground the family prints it on", () => {
    const onPaper = ["travel-postcard", "certificate", "then-and-now", "collage", "poster"];
    const bad: string[] = [];
    for (const t of ALL) {
      const p = t.palette;
      if (!onPaper.includes(t.family)) continue;
      if (contrast(p.bg, p.ink) < 4.5) bad.push(`${t.id} ink ${contrast(p.bg, p.ink).toFixed(2)}`);
      if (contrast(p.bg, p.accent) < 3)
        bad.push(`${t.id} accent ${contrast(p.bg, p.accent).toFixed(2)}`);
      if (t.family !== "poster" && contrast(p.bg, p.muted) < 4.5)
        bad.push(`${t.id} muted ${contrast(p.bg, p.muted).toFixed(2)}`);
    }
    expect(bad).toEqual([]);
  });

  it("falls back to the family's first theme for an unknown or mismatched theme", () => {
    expect(themeFor("poster", "no-such-theme").id).toBe(THEME_REGISTRY.poster[0]);
    expect(themeFor("poster", "secret-agent").family).toBe("poster");
  });

  it("makes themes within a family look different, not just retitled", () => {
    for (const family of KEEPSAKE_FAMILY_LIST) {
      const list = THEME_REGISTRY[family].map((id) => THEMES[id]!);
      for (let i = 1; i < list.length; i++) {
        const a = list[0]!;
        const b = list[i]!;
        expect(a.palette.bg !== b.palette.bg || a.palette.accent !== b.palette.accent).toBe(true);
        expect(a.motif !== b.motif || a.frame !== b.frame || a.display !== b.display).toBe(true);
      }
    }
  });
});

// ------------------------------------------------------------- drawing

describe("artwork drawing", () => {
  const long = "Supercalifragilisticexpialidocious Wigglesworth-Smythe ".repeat(5);

  it.each(ALL.flatMap((t) => SIZES.map((s) => [t.id, t.family, s] as const)))(
    "%s (%s) at %s draws inside the canvas, with and without photos",
    (theme, family, size) => {
      const H = ART_SIZES[size].height;
      const need = family === "then-and-now" ? 2 : family === "collage" ? 4 : 1;
      for (const photos of [[], Array.from({ length: need }, () => photo())]) {
        for (const text of ["x", long]) {
          const f = fakeCtx();
          const spec = {
            ...baseSpec(family, theme, size),
            dogName: text === "x" ? "Biscuit" : text,
            headline: text === "x" ? "Toy Champion Showdown" : text,
            subhead: text === "x" ? "A little adventure" : text,
            memory: text === "x" ? "He won by a nose." : text,
            date: text === "x" ? "12 May 2026" : text,
          };
          expect(() => renderArtwork(f.ctx, spec, { photos })).not.toThrow();
          const all = f.texts();
          expect(all.length).toBeGreaterThan(2);
          for (const t of all) {
            expect(t.left, `${theme} ${size} "${t.text.slice(0, 18)}"`).toBeGreaterThanOrEqual(
              -0.5,
            );
            expect(t.right, `${theme} ${size} "${t.text.slice(0, 18)}"`).toBeLessThanOrEqual(
              1080.5,
            );
            expect(t.y).toBeGreaterThan(0);
            expect(t.y).toBeLessThanOrEqual(H);
          }
          // the branding sits inside every piece of artwork, small
          expect(all.some((t) => t.text === "pawsandpassage.com")).toBe(true);
          expect(all.find((t) => t.text === "pawsandpassage.com")!.size).toBeLessThanOrEqual(30);
        }
      }
    },
  );

  it("uses only system serif and sans font stacks", () => {
    const allowed = [...Object.values(FONTS), SERIF, FONT_HAND];
    for (const t of ALL) {
      const f = fakeCtx();
      renderArtwork(f.ctx, baseSpec(t.family, t.id, "portrait"), {});
      for (const font of f.fonts)
        expect(allowed.some((a) => font.endsWith(a)) || font === "10px serif", font).toBe(true);
    }
  });

  it("never throws on junk input", () => {
    const junk = [
      { dogName: undefined, headline: undefined },
      { dogName: 5, headline: {}, memory: [], date: null },
      { dogName: "\u{1F436}\u{1F43E}", headline: "\u{1F43E}" },
    ] as unknown as Partial<ArtSpec>[];
    for (const j of junk)
      for (const t of ALL) {
        const { ctx } = fakeCtx();
        expect(() =>
          renderArtwork(ctx, { ...baseSpec(t.family, t.id, "story"), ...j } as ArtSpec),
        ).not.toThrow();
      }
    const { ctx, texts } = fakeCtx();
    renderArtwork(ctx, {
      ...baseSpec("certificate", "explorer", "square"),
      dogName: "\u{1F436}  ",
    });
    expect(texts().map((t) => t.text)).toContain("Your Dog");
  });

  it("draws the headline, dog name and memory (cut to 140 characters)", () => {
    const f = fakeCtx();
    renderArtwork(f.ctx, {
      ...baseSpec("travel-postcard", "picnic-postcard", "portrait"),
      memory: "word ".repeat(100),
    });
    const lines = f.texts().map((t) => t.text);
    expect(lines.join("\n")).toContain("Biscuit");
    const mem = lines.filter((l) => l.startsWith("word"));
    expect(mem.join(" ").replace(/\s/g, "").length).toBeLessThanOrEqual(112);
  });

  it("draws no captions or hashtags", () => {
    for (const t of ALL) {
      const f = fakeCtx();
      renderArtwork(f.ctx, baseSpec(t.family, t.id, "square"), {});
      for (const x of f.texts()) expect(x.text).not.toMatch(/#\w|@\w/);
    }
  });

  it("lays out natively for each size: slot rectangles stay on the canvas and differ by size", () => {
    for (const t of ALL) {
      const rects = SIZES.map((s) => photoSlots(baseSpec(t.family, t.id, s), 4));
      SIZES.forEach((s, i) => {
        for (const r of rects[i]!) {
          expect(r.x).toBeGreaterThanOrEqual(0);
          expect(r.y).toBeGreaterThanOrEqual(0);
          expect(r.x + r.w).toBeLessThanOrEqual(1080);
          expect(r.y + r.h).toBeLessThanOrEqual(ART_SIZES[s].height);
        }
      });
      expect(JSON.stringify(rects[0])).not.toBe(JSON.stringify(rects[2]));
    }
  });

  it("gives then-and-now two slots and collage up to four", () => {
    expect(photoSlots(baseSpec("then-and-now", "then-and-now", "square"), 1)).toHaveLength(2);
    for (const n of [1, 2, 3, 4])
      expect(photoSlots(baseSpec("collage", "favorite-moments", "portrait"), n)).toHaveLength(n);
    expect(photoSlots(baseSpec("collage", "favorite-moments", "portrait"), 9)).toHaveLength(4);
  });

  it("draws a photo through the placement transform, not distorted", () => {
    const f = fakeCtx();
    const p = rotateQuarter({ ...photo(4000, 3000), zoom: 2 });
    expect(drawPlacedPhoto(f.ctx, p, 0, 0, 500, 500)).toBe(true);
    expect(f.calls.some((c) => c.op === "drawImage")).toBe(true);
    const sc = f.calls.find((c) => c.op === "scale")!.args as number[];
    expect(sc[0]).toBeCloseTo(sc[1]!, 8);
    expect(
      drawPlacedPhoto(
        f.ctx,
        placed({ width: 0, height: 0 } as unknown as ImageBitmap),
        0,
        0,
        10,
        10,
      ),
    ).toBe(false);
  });
});

// ------------------------------------------------------------- photo helpers

describe("photo placement", () => {
  it("clamps zoom, pan and rotation", () => {
    const p = clampPlacement({
      ...photo(),
      zoom: 99,
      panX: -9,
      panY: Number.NaN,
      rotation: 7 as never,
    });
    expect(p.zoom).toBe(4);
    expect(p.panX).toBe(-1);
    expect(p.panY).toBe(-1);
    expect(p.rotation).toBe(3);
  });
  it("pans only when there is spare room", () => {
    const sq = placed({ width: 1000, height: 1000 } as unknown as ImageBitmap);
    expect(panByDrag(sq, 50, 50, 500, 500).panX).toBe(0);
    const zoomed = { ...sq, zoom: 2 };
    expect(panByDrag(zoomed, -125, 0, 500, 500).panX).toBeGreaterThan(0);
  });
  it("downscales long edges to 2400 and never enlarges", () => {
    expect(downscaledSize(6000, 4000)).toEqual({ w: 2400, h: 1600, scaled: true });
    expect(downscaledSize(1000, 800).scaled).toBe(false);
  });
});

describe("loadPhotoFile", () => {
  it("rejects files over the size limit and non-images without decoding", async () => {
    const big = { size: MAX_PHOTO_BYTES + 1, type: "image/jpeg" } as unknown as Blob;
    await expect(loadPhotoFile(big)).rejects.toMatchObject({ code: "too-large" });
    await expect(loadPhotoFile(new Blob(["x"], { type: "text/plain" }))).rejects.toBeInstanceOf(
      PhotoError,
    );
  });
  it("asks for upright decoding and downscales big images", async () => {
    const seen: unknown[] = [];
    const closed = vi.fn();
    vi.stubGlobal("createImageBitmap", async (src: unknown, opts?: unknown) => {
      seen.push(opts);
      if (src instanceof Blob) return { width: 6000, height: 3000, close: closed };
      return { width: 2400, height: 1200, close: vi.fn() };
    });
    class OC {
      constructor(
        public width: number,
        public height: number,
      ) {}
      getContext() {
        return { drawImage: () => undefined, imageSmoothingQuality: "" };
      }
    }
    vi.stubGlobal("OffscreenCanvas", OC);
    try {
      const out = await loadPhotoFile(new Blob(["x"], { type: "image/jpeg" }));
      expect(seen[0]).toEqual({ imageOrientation: "from-image" });
      expect((out as { width: number }).width).toBe(2400);
      expect(closed).toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

// ------------------------------------------------------------- privacy: EXIF/GPS never reach the PNG

const JPEG_B64 = readFileSync(join(__dirname, "fixtures", "keepsake-tiny.jpg.b64"), "utf8").trim();

function jpegWithExif(): Uint8Array {
  const base = Uint8Array.from(Buffer.from(JPEG_B64, "base64"));
  const enc = new TextEncoder();
  const tiff = new Uint8Array([
    0x4d, 0x4d, 0x00, 0x2a, 0, 0, 0, 8, 0, 1, 0x88, 0x25, 0, 4, 0, 0, 0, 1, 0, 0, 0, 26, 0, 0, 0, 0,
  ]);
  const gps = enc.encode("GPSLatitudeRef N GPSLongitudeRef W 51.5072 -0.1276 Camera Make Model");
  const body = new Uint8Array([...enc.encode("Exif\0\0"), ...tiff, ...gps]);
  const len = body.length + 2;
  const app1 = new Uint8Array([0xff, 0xe1, len >> 8, len & 255, ...body]);
  return new Uint8Array([...base.slice(0, 2), ...app1, ...base.slice(2)]);
}

function crc32(buf: Uint8Array): number {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}
function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  out.set(new TextEncoder().encode(type), 4);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}
/** A minimal PNG encoder for the fake canvas: IHDR, IDAT, IEND only, like a browser's canvas encode. */
function encodePng(w: number, h: number): Uint8Array {
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, w);
  dv.setUint32(4, h);
  ihdr.set([8, 2, 0, 0, 0], 8);
  const raw = new Uint8Array((w * 3 + 1) * h);
  const parts = [
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", new Uint8Array(deflateSync(raw))),
    chunk("IEND", new Uint8Array(0)),
  ];
  return Uint8Array.from(parts.flatMap((p) => [...p]));
}
export function pngChunkTypes(b: Uint8Array): string[] {
  const out: string[] = [];
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let i = 8;
  while (i + 8 <= b.length) {
    out.push(String.fromCharCode(b[i + 4]!, b[i + 5]!, b[i + 6]!, b[i + 7]!));
    i += 12 + dv.getUint32(i);
  }
  return out;
}
function blobBytes(b: Blob): Promise<Uint8Array> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(new Uint8Array(r.result as ArrayBuffer));
    r.onerror = () => rej(r.error);
    r.readAsArrayBuffer(b);
  });
}
const hasAscii = (b: Uint8Array, s: string) => Buffer.from(b).includes(Buffer.from(s, "latin1"));

describe("exported PNG carries no photo metadata", () => {
  it("the test fixture really is a JPEG with an EXIF APP1 segment and GPS markers", () => {
    const j = jpegWithExif();
    expect(j[0]).toBe(0xff);
    expect(j[1]).toBe(0xd8);
    expect(hasAscii(j, "Exif")).toBe(true);
    expect(hasAscii(j, "GPSLatitudeRef")).toBe(true);
    expect(j[2]).toBe(0xff);
    expect(j[3]).toBe(0xe1);
  });

  it("makeArtworkBlob output has no eXIf/text chunks and no EXIF or GPS markers", async () => {
    const jpeg = jpegWithExif();
    const file = new Blob([jpeg as BlobPart], { type: "image/jpeg" });
    let received: Blob | null = null;
    vi.stubGlobal("createImageBitmap", async (src: Blob) => {
      received = src;
      return { width: 8, height: 8, close: () => undefined };
    });
    // A canvas whose encode step is a plain pixel-to-PNG writer, as in a browser: only pixels go in.
    class OC {
      constructor(
        public width: number,
        public height: number,
      ) {}
      getContext() {
        return fakeCtx().ctx;
      }
      async convertToBlob() {
        return new Blob([encodePng(8, 8) as BlobPart], { type: "image/png" });
      }
    }
    vi.stubGlobal("OffscreenCanvas", OC);
    try {
      const src = await loadPhotoFile(file);
      expect(received).toBe(file);
      const blob = await makeArtworkBlob(baseSpec("magazine-cover", "toy-champion", "square"), {
        photos: [placed(src)],
      });
      const bytes = await blobBytes(blob);
      const types = pngChunkTypes(bytes);
      expect(types).toEqual(["IHDR", "IDAT", "IEND"]);
      for (const bad of ["eXIf", "tEXt", "iTXt", "zTXt"]) expect(types).not.toContain(bad);
      for (const m of ["Exif", "GPS", "JFIF", "XMP", "Make", "Model", "51.5072"])
        expect(hasAscii(bytes, m), m).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("the keepsake code encodes only through a canvas and never copies the original file bytes", () => {
    const dir = join(__dirname, "..", "passport", "keepsake");
    for (const f of readdirSync(dir).filter((n) => n.endsWith(".ts"))) {
      const src = readFileSync(join(dir, f), "utf8")
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "");
      expect(src, f).not.toMatch(/arrayBuffer\(|FileReader|readAsDataURL|readAsArrayBuffer|exif/i);
    }
    const art = readFileSync(join(dir, "artwork.ts"), "utf8");
    expect(art).toMatch(/convertToBlob\(\{ type: "image\/png" \}\)/);
    expect(art).toMatch(/toBlob\(/);
  });
});

// ------------------------------------------------------------- share / download fallbacks

describe("download and share", () => {
  it("downloadBlob creates an object URL and revokes it", async () => {
    const create = vi.fn(() => "blob:x");
    const revoke = vi.fn();
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    downloadBlob(new Blob(["x"]), "a.png");
    await new Promise((r) => setTimeout(r, 5));
    expect(create).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalledWith("blob:x");
  });

  it("shares the file without any prewritten text", async () => {
    const share = vi.fn(async () => undefined);
    const nav = navigator as unknown as Record<string, unknown>;
    nav["canShare"] = () => true;
    nav["share"] = share;
    try {
      expect(await shareBlob(new Blob(["x"], { type: "image/png" }), "a.png", "")).toBe("shared");
      const arg = (share.mock.calls[0] as unknown[])[0] as Record<string, unknown>;
      expect(Object.keys(arg)).toEqual(["files"]);
    } finally {
      delete nav["canShare"];
      delete nav["share"];
    }
  });

  it("falls back to download when files cannot be shared", async () => {
    const nav = navigator as unknown as Record<string, unknown>;
    nav["canShare"] = () => false;
    nav["share"] = async () => undefined;
    try {
      expect(await shareBlob(new Blob(["x"]), "a.png", "")).toBe("download");
    } finally {
      delete nav["canShare"];
      delete nav["share"];
    }
  });
});

// ------------------------------------------------------------- privacy grep

describe("keepsake privacy", () => {
  const root = join(__dirname, "..");
  const files = [
    ...readdirSync(join(root, "passport", "keepsake"))
      .filter((f) => /\.(ts|tsx)$/.test(f))
      .map((f) => join(root, "passport", "keepsake", f)),
    ...readdirSync(join(root, "components", "passport"))
      .filter((f) => /^(Keepsake.*|PhotoEditor)\.tsx$/.test(f))
      .map((f) => join(root, "components", "passport", f)),
  ];
  it("finds the keepsake files", () => {
    expect(files.length).toBeGreaterThanOrEqual(8);
  });
  it("uses no network API, storage API, logging or URL literal", () => {
    const bad =
      /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|localStorage|sessionStorage|indexedDB|caches|openDatabase|console)\b|document\.cookie|https?:\/\//;
    for (const f of files) {
      const src = readFileSync(f, "utf8")
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "");
      expect(src, f).not.toMatch(bad);
    }
  });
  it("revokes every object URL it creates", () => {
    let c = 0;
    let r = 0;
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      c += (src.match(/createObjectURL/g) ?? []).length;
      r += (src.match(/revokeObjectURL/g) ?? []).length;
    }
    expect(c).toBeGreaterThan(0);
    expect(r).toBeGreaterThanOrEqual(c);
  });
  it("tells people the files stay on the device and do not sync", () => {
    const src = readFileSync(join(root, "components", "passport", "Keepsake.tsx"), "utf8");
    expect(src).toMatch(/stay on this device/);
    expect(src.replace(/\s+/g, " ")).toMatch(/do not sync/);
    expect(src).not.toMatch(/Instagram|Facebook|TikTok|hashtag/i);
  });
});
