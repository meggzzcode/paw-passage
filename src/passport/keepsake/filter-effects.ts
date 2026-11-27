// Photo effects for keepsakes: six natural, flattering colour treatments done with plain canvas pixel maths, on this
// device only. No WebGL, no libraries, no network. The effect is baked into a fresh canvas copy of the photo, so every
// keepsake family draws it exactly like the original (zoom, pan and turns keep working) and nothing from the original
// file (EXIF, GPS) is carried into the output.
// Every look is a gentle curve plus tint, saturation, an optional light vignette and an optional fine grain, so the dog
// stays recognisable. Output is deterministic: the grain comes from a fixed noise table, never a random call.
import { sourceSize, type PhotoSource, type PlacedPhoto } from "./photo";

export type PhotoEffectId =
  "original" | "golden-hour" | "soft-film" | "light-airy" | "subtle-vintage" | "black-white";

export interface PhotoEffectInfo {
  id: PhotoEffectId;
  label: string;
  hint: string;
}

/** The six looks, in the order the picker shows them. */
export const PHOTO_EFFECTS: readonly PhotoEffectInfo[] = [
  { id: "original", label: "Original", hint: "Your photo, untouched" },
  { id: "golden-hour", label: "Golden hour", hint: "Warm, soft highlights" },
  { id: "soft-film", label: "Soft film", hint: "Gentle grain, lifted blacks" },
  { id: "light-airy", label: "Light and airy", hint: "Bright and soft" },
  { id: "subtle-vintage", label: "Subtle vintage", hint: "Warm fade, light vignette" },
  { id: "black-white", label: "Black and white", hint: "Rich with soft contrast" },
];

export const PHOTO_EFFECT_IDS: readonly PhotoEffectId[] = PHOTO_EFFECTS.map((e) => e.id);
export const DEFAULT_EFFECT: PhotoEffectId = "original";

export function isPhotoEffect(v: unknown): v is PhotoEffectId {
  return typeof v === "string" && (PHOTO_EFFECT_IDS as readonly string[]).includes(v);
}

export function photoEffectLabel(id: PhotoEffectId): string {
  return PHOTO_EFFECTS.find((e) => e.id === id)?.label ?? "Original";
}

/** Older or looser names map to the closest look, so a saved or default choice keeps working. */
const LEGACY: Record<string, PhotoEffectId> = {
  none: "original",
  normal: "original",
  natural: "original",
  warm: "golden-hour",
  golden: "golden-hour",
  sunset: "golden-hour",
  film: "soft-film",
  soft: "soft-film",
  faded: "soft-film",
  airy: "light-airy",
  bright: "light-airy",
  light: "light-airy",
  vintage: "subtle-vintage",
  retro: "subtle-vintage",
  sepia: "subtle-vintage",
  bw: "black-white",
  mono: "black-white",
  grayscale: "black-white",
  greyscale: "black-white",
  noir: "black-white",
};

export function normalizeEffectId(v: unknown): PhotoEffectId {
  if (isPhotoEffect(v)) return v;
  if (typeof v === "string") {
    const key = v
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-");
    if (isPhotoEffect(key)) return key;
    const hit = LEGACY[key] ?? LEGACY[key.replace(/-/g, "")];
    if (hit) return hit;
  }
  return DEFAULT_EFFECT;
}

// ------------------------------------------------------------------ the recipes

interface Recipe {
  /** Brightness curve exponent: below 1 brightens the midtones. */
  gamma: number;
  /** Contrast around the middle, 1 = none. */
  contrast: number;
  /** Raised black point and lowered white point, 0..255: lifted blacks and a soft highlight shoulder. */
  black: number;
  white: number;
  /** Colour added in the shadows and in the highlights (r, g, b, in 0..255 steps). */
  shadowTint: readonly [number, number, number];
  highTint: readonly [number, number, number];
  /** Per-channel gain for an overall warmth or coolness. */
  gain: readonly [number, number, number];
  saturation: number;
  /** 0..1 edge darkening, applied with a very soft falloff. */
  vignette: number;
  /** Grain amplitude in 8-bit steps. */
  grain: number;
  mono: boolean;
}

const RECIPES: Record<Exclude<PhotoEffectId, "original">, Recipe> = {
  "golden-hour": {
    gamma: 0.97,
    contrast: 0.94,
    black: 4,
    white: 250,
    shadowTint: [5, 1, -4],
    highTint: [11, 5, -9],
    gain: [1.045, 1.012, 0.9],
    saturation: 1.1,
    vignette: 0,
    grain: 0,
    mono: false,
  },
  "soft-film": {
    gamma: 1.04,
    contrast: 0.82,
    black: 22,
    white: 238,
    shadowTint: [-2, 4, 7],
    highTint: [5, 2, -3],
    gain: [1.01, 1, 0.985],
    saturation: 0.88,
    vignette: 0,
    grain: 8,
    mono: false,
  },
  "light-airy": {
    gamma: 0.68,
    contrast: 0.8,
    black: 14,
    white: 255,
    shadowTint: [3, 3, 4],
    highTint: [0, 0, 0],
    gain: [1, 1.005, 1.015],
    saturation: 0.8,
    vignette: 0,
    grain: 0,
    mono: false,
  },
  "subtle-vintage": {
    gamma: 1.06,
    contrast: 0.88,
    black: 28,
    white: 240,
    shadowTint: [8, 3, -4],
    highTint: [8, 4, -12],
    gain: [1.03, 1.0, 0.88],
    saturation: 0.74,
    vignette: 0.3,
    grain: 3,
    mono: false,
  },
  "black-white": {
    gamma: 1,
    contrast: 1.16,
    black: 7,
    white: 249,
    shadowTint: [0, 0, 0],
    highTint: [0, 0, 0],
    gain: [1, 1, 1],
    saturation: 0,
    vignette: 0.08,
    grain: 2,
    mono: true,
  },
};

/** Gentle S-curve around the middle: contrast < 1 flattens, > 1 adds punch, without clipping. */
function curve(x: number, r: Recipe): number {
  let v = Math.pow(x, r.gamma);
  if (r.contrast <= 1) v = 0.5 + (v - 0.5) * r.contrast;
  else v -= ((r.contrast - 1) * Math.sin(2 * Math.PI * v)) / (2 * Math.PI);
  return Math.max(0, Math.min(1, v));
}

function buildLuts(r: Recipe): Uint8ClampedArray[] {
  const luts: Uint8ClampedArray[] = [];
  for (let c = 0; c < 3; c++) {
    const lut = new Uint8ClampedArray(256);
    for (let i = 0; i < 256; i++) {
      const x = i / 255;
      let v = curve(x, r) * (r.white - r.black) + r.black;
      v += (r.shadowTint[c] as number) * (1 - x) * (1 - x) + (r.highTint[c] as number) * x * x;
      v *= r.gain[c] as number;
      lut[i] = Math.round(v);
    }
    luts.push(lut);
  }
  return luts;
}

const LUT_CACHE = new Map<string, Uint8ClampedArray[]>();
function lutsFor(id: Exclude<PhotoEffectId, "original">): Uint8ClampedArray[] {
  let l = LUT_CACHE.get(id);
  if (!l) {
    l = buildLuts(RECIPES[id]);
    LUT_CACHE.set(id, l);
  }
  return l;
}

/** A fixed 256x256 table of small signed values (a tiny xorshift, seeded once): the same grain every time. */
let NOISE: Int8Array | null = null;
function noise(): Int8Array {
  if (NOISE) return NOISE;
  const n = new Int8Array(256 * 256);
  let s = 0x9e3779b1;
  for (let i = 0; i < n.length; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    // sum of two uniforms: softer, more film-like than flat noise
    const a = ((s >>> 8) & 255) - 127.5;
    const b = ((s >>> 16) & 255) - 127.5;
    n[i] = Math.round((a + b) / 4);
  }
  NOISE = n;
  return n;
}

/**
 * Grades RGBA pixels in place. One pass: per-channel table, saturation about the luma, soft vignette, fine grain.
 * `grainScale` makes the grain size follow the shown size (the photo is usually shown smaller than its pixels).
 */
export function gradePixels(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  id: PhotoEffectId,
  grainScale = 1,
): void {
  if (id === "original" || w <= 0 || h <= 0) return;
  const r = RECIPES[id];
  const [lr, lg, lb] = lutsFor(id) as [Uint8ClampedArray, Uint8ClampedArray, Uint8ClampedArray];
  const sat = r.saturation;
  const vig = r.vignette;
  const amp = r.grain * grainScale;
  const tab = noise();
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  const inv = 1 / (cx * cx + cy * cy || 1);
  // grain cell: on large photos, repeat each noise value over a few pixels so it survives down-scaling
  const cell = Math.max(1, Math.round(Math.max(w, h) / 1100));
  const useGrain = amp > 0.01;
  for (let y = 0; y < h; y++) {
    const dy = y - cy;
    const row = y * w * 4;
    const gy = ((y / cell) | 0) & 255;
    for (let x = 0; x < w; x++) {
      const i = row + x * 4;
      let rr = lr[data[i] as number] as number;
      let gg = lg[data[i + 1] as number] as number;
      let bb = lb[data[i + 2] as number] as number;
      const luma = 0.299 * rr + 0.587 * gg + 0.114 * bb;
      if (r.mono) {
        rr = gg = bb = luma;
      } else if (sat !== 1) {
        rr = luma + (rr - luma) * sat;
        gg = luma + (gg - luma) * sat;
        bb = luma + (bb - luma) * sat;
      }
      let k = 1;
      if (vig > 0) {
        const dx = x - cx;
        const d = (dx * dx + dy * dy) * inv; // 0 centre .. 1 corner
        // nothing in the middle half of the frame, easing in towards the corners
        const t = d > 0.3 ? (d - 0.3) / 0.7 : 0;
        k = 1 - vig * t * t * (3 - 2 * t);
      }
      let n = 0;
      if (useGrain) {
        const gx = ((x / cell) | 0) & 255;
        // grain is strongest in the midtones and fades in deep shadows and bright highlights
        const m = 1 - Math.abs(luma - 128) / 150;
        n = ((tab[(gy << 8) | gx] as number) / 64) * amp * (m > 0 ? m : 0);
      }
      data[i] = (rr + n) * k;
      data[i + 1] = (gg + n) * k;
      data[i + 2] = (bb + n) * k;
    }
  }
}

// ------------------------------------------------------------------ applying to a photo

type Canvas2 = HTMLCanvasElement | OffscreenCanvas;

function makeCanvas(w: number, h: number): Canvas2 | null {
  if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(w, h);
  if (typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }
  return null;
}

/**
 * A graded copy of the photo as a fresh canvas (so no source metadata), or the photo itself for "original" or when
 * the browser cannot do it. Never throws: a failure leaves the photo as it was.
 */
export function gradeSource(source: PhotoSource, id: PhotoEffectId): PhotoSource {
  if (id === "original") return source;
  const { w, h } = sourceSize(source);
  if (!(w > 0 && h > 0)) return source;
  try {
    const c = makeCanvas(w, h);
    const ctx = c?.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D | null;
    if (!c || !ctx) return source;
    ctx.drawImage(source, 0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h);
    gradePixels(img.data, w, h, id);
    ctx.putImageData(img, 0, 0);
    return c;
  } catch {
    return source;
  }
}

const CACHE = new WeakMap<object, Map<PhotoEffectId, PhotoSource>>();

/**
 * The placed photo with the effect baked in. The graded pixels are cached per source, so moving or zooming the photo
 * never regrades it, and switching back to a look already made is instant.
 */
export function applyPhotoEffect(photo: PlacedPhoto, effect: unknown): PlacedPhoto {
  const id = normalizeEffectId(effect);
  if (id === "original") return photo;
  const src = photo.source as unknown as object;
  let m = CACHE.get(src);
  if (!m) {
    m = new Map();
    CACHE.set(src, m);
  }
  let graded = m.get(id);
  if (!graded) {
    graded = gradeSource(photo.source, id);
    m.set(id, graded);
  }
  return graded === photo.source ? photo : { ...photo, source: graded };
}

/** A small graded copy for the picker thumbnails (long edge about `edge` px). Null if canvas is unavailable. */
export function effectThumb(source: PhotoSource, id: PhotoEffectId, edge = 96): Canvas2 | null {
  const { w, h } = sourceSize(source);
  if (!(w > 0 && h > 0)) return null;
  const k = Math.min(1, edge / Math.max(w, h));
  const tw = Math.max(1, Math.round(w * k));
  const th = Math.max(1, Math.round(h * k));
  try {
    const c = makeCanvas(tw, th);
    const ctx = c?.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D | null;
    if (!c || !ctx) return null;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, tw, th);
    if (id !== "original") {
      const img = ctx.getImageData(0, 0, tw, th);
      // thumbnails are tiny, so keep the grain from vanishing: scale it up to match what the full image shows
      gradePixels(img.data, tw, th, id, 1);
      ctx.putImageData(img, 0, 0);
    }
    return c;
  } catch {
    return null;
  }
}
