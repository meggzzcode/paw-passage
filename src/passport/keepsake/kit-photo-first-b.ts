// Shared helpers for the photo-first families in families-b.ts: full-bleed photo with a soft finish, local
// scrims, delicate text with a soft shadow, handwriting accents and a quiet keyline. Pure canvas code, no
// network, no images. Nothing here changes an exported signature used by another family.
import { circle, fitText, wrapText, FOOTER_TEXT, type Ctx } from "./render";
import { drawPlacedPhoto, type PlacedPhoto } from "./photo";
import { W, luminance, rnd, type Prep, type Slot } from "./kit";
import { FONT_HAND, fontSpec } from "./fonts";
import type { ThemeConfig } from "./themes";
import { motif } from "./ornaments";
import { brackets, keyline, sparkle } from "./ornaments-b";

/** Handwriting accent (Caveat), display (Bricolage Grotesque) and body (Figtree), all from the shared fonts file. */
export const HAND = FONT_HAND;
export const handFont = (s: number) => fontSpec("hand", 600, s);
export const sansFont = (s: number) => fontSpec("body", 600, s);
export const sansBold = (s: number) => fontSpec("body", 700, s);
export const serifFont = (s: number) => fontSpec("display", 700, s);
export const displayFont = (w: number) => (s: number) => fontSpec("display", w, s);
export const noteSans = (s: number) => fontSpec("body", 500, s);

export const PAPER_WHITE = "#fffdf8";

// ---------------------------------------------------------------- colour

function parse(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, "0");
  return [
    parseInt(n.slice(0, 2), 16) || 0,
    parseInt(n.slice(2, 4), 16) || 0,
    parseInt(n.slice(4, 6), 16) || 0,
  ];
}

export function rgba(hex: string, a: number): string {
  const [r, g, b] = parse(hex);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
}

/** Linear blend of two hex colours, k = share of b. */
export function mix(a: string, b: string, k: number): string {
  const x = parse(a);
  const y = parse(b);
  const c = (i: 0 | 1 | 2) => Math.round(x[i] + (y[i] - x[i]) * k);
  return `#${[c(0), c(1), c(2)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** The theme's deep tone: its darkest colour pulled toward black, used for scrims and shadows. */
export function deepOf(t: ThemeConfig): string {
  const p = t.palette;
  const base = luminance(p.bg) < luminance(p.ink) ? p.bg : p.ink;
  return mix(base, "#0d0907", 0.55);
}

export interface Tint {
  /** Main ornament colour: the accent if it is bright enough to show on a photo, else a lighter sibling. */
  a: string;
  /** Second ornament colour. */
  b: string;
  deep: string;
}

export function tintOf(t: ThemeConfig): Tint {
  const p = t.palette;
  const bright = [p.accent, p.accent2, p.card].find((c) => luminance(c) >= 0.2) ?? PAPER_WHITE;
  const second = [p.accent2, p.accent, p.card].find((c) => c !== bright && luminance(c) >= 0.2);
  // lifted toward white so details glow on a photo instead of sinking into it
  return {
    a: mix(bright, PAPER_WHITE, 0.38),
    b: mix(second ?? PAPER_WHITE, PAPER_WHITE, 0.3),
    deep: deepOf(t),
  };
}

// ---------------------------------------------------------------- geometry

export interface Zone {
  left: number;
  right: number;
  /** Essential text stays at or below this y (Story keeps clear of the app chrome above). */
  top: number;
  /** Essential text stays at or above this y. */
  bottom: number;
}

export function zoneOf(p: Prep): Zone {
  return {
    left: 76,
    right: W - 76,
    top: p.story ? 250 : 64,
    bottom: p.H - (p.story ? 340 : 66),
  };
}

export function fullSlot(p: Prep): Slot {
  return { x: 0, y: 0, w: W, h: p.H };
}

// ---------------------------------------------------------------- photo

/** A quiet stand-in when there is no photo: a deep gradient with a faint, large theme symbol. */
export function softPlaceholder(ctx: Ctx, t: ThemeConfig, s: Slot, index = 0): void {
  const k = tintOf(t);
  ctx.save();
  ctx.beginPath();
  ctx.rect(s.x, s.y, s.w, s.h);
  ctx.clip();
  const g = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.h);
  g.addColorStop(0, mix(t.palette.accent2, k.deep, 0.5));
  g.addColorStop(1, mix(t.palette.accent, k.deep, 0.72));
  ctx.fillStyle = g;
  ctx.fillRect(s.x, s.y, s.w, s.h);
  const m = Math.min(s.w, s.h);
  ctx.globalAlpha = 0.14;
  for (let i = 0; i < 6; i++) {
    const px = s.x + (0.12 + rnd(i * 3 + index + 1) * 0.76) * s.w;
    const py = s.y + (0.1 + rnd(i * 5 + index + 9) * 0.8) * s.h;
    motif(ctx, i % 2 ? t.motif2 : "paw", px, py, m * 0.14, PAPER_WHITE, PAPER_WHITE);
  }
  ctx.globalAlpha = 0.3;
  motif(ctx, index % 2 ? t.motif2 : t.motif, s.x + s.w / 2, s.y + s.h * 0.44, m * 0.52, k.a, k.b);
  ctx.restore();
}

/** Draws the photo (or the quiet stand-in) into a rectangle. */
export function paintPhoto(
  ctx: Ctx,
  t: ThemeConfig,
  s: Slot,
  photo: PlacedPhoto | null | undefined,
  index = 0,
): void {
  if (photo && drawPlacedPhoto(ctx, photo, s.x, s.y, s.w, s.h)) return;
  softPlaceholder(ctx, t, s, index);
}

/** Soft edge darkening with a faint warm lift, so any photo feels finished without changing its colour. */
export function finish(ctx: Ctx, s: Slot, deep: string, strength = 0.2, glow?: string): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(s.x, s.y, s.w, s.h);
  ctx.clip();
  const cx = s.x + s.w / 2;
  const cy = s.y + s.h / 2;
  const r = Math.hypot(s.w, s.h) / 2;
  const g = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r);
  g.addColorStop(0, rgba(deep, 0));
  g.addColorStop(1, rgba(deep, strength));
  ctx.fillStyle = g;
  ctx.fillRect(s.x, s.y, s.w, s.h);
  if (glow) {
    const gl = ctx.createRadialGradient(
      s.x + s.w,
      s.y,
      0,
      s.x + s.w,
      s.y,
      Math.max(s.w, s.h) * 0.7,
    );
    gl.addColorStop(0, rgba(glow, 0.3));
    gl.addColorStop(1, rgba(glow, 0));
    ctx.fillStyle = gl;
    ctx.fillRect(s.x, s.y, s.w, s.h);
  }
  ctx.restore();
}

/** A soft local scrim that fades in from one edge of a box. `from` is the edge where it is strongest. */
export function scrim(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  from: "bottom" | "top",
  color: string,
  alpha: number,
): void {
  if (h <= 0) return;
  const g =
    from === "bottom"
      ? ctx.createLinearGradient(0, y, 0, y + h)
      : ctx.createLinearGradient(0, y + h, 0, y);
  g.addColorStop(0, rgba(color, 0));
  g.addColorStop(0.3, rgba(color, alpha * 0.45));
  g.addColorStop(0.65, rgba(color, alpha * 0.85));
  g.addColorStop(1, rgba(color, alpha));
  ctx.save();
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

/**
 * Average brightness (0 to 1) of a horizontal band of the placed photo, read from a tiny scaled copy so it is
 * cheap. Undefined when there is no photo or no readable canvas (then callers assume a middling photo).
 */
export function bandLuma(
  photo: PlacedPhoto | null | undefined,
  slot: Slot,
  y0: number,
  y1: number,
): number | undefined {
  if (!photo) return undefined;
  try {
    const sc = 1 / 16;
    const w = Math.max(8, Math.round(slot.w * sc));
    const h = Math.max(8, Math.round(slot.h * sc));
    let cv: OffscreenCanvas | HTMLCanvasElement;
    if (typeof OffscreenCanvas !== "undefined") cv = new OffscreenCanvas(w, h);
    else if (
      typeof document !== "undefined" &&
      !(typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent))
    ) {
      cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
    } else return undefined;
    const c = cv.getContext("2d") as CanvasRenderingContext2D | null;
    if (!c || typeof c.getImageData !== "function") return undefined;
    if (!drawPlacedPhoto(c, photo, 0, 0, w, h)) return undefined;
    const r0 = Math.min(h - 1, Math.max(0, Math.floor((y0 - slot.y) * sc)));
    const r1 = Math.min(h, Math.max(r0 + 1, Math.ceil((y1 - slot.y) * sc)));
    const d = c.getImageData(0, r0, w, r1 - r0).data;
    let sum = 0;
    let n = 0;
    for (let i = 0; i + 3 < d.length; i += 4) {
      sum += 0.2126 * (d[i] ?? 0) + 0.7152 * (d[i + 1] ?? 0) + 0.0722 * (d[i + 2] ?? 0);
      n++;
    }
    return n ? sum / n / 255 : undefined;
  } catch {
    return undefined;
  }
}

/** Scrim opacity for text over a photo band of this brightness: 0.35 (dark photo) to 0.6 (bright photo). */
export function haloAlpha(luma: number | undefined): number {
  if (luma === undefined) return 0.48;
  return 0.35 + 0.25 * Math.max(0, Math.min(1, (luma - 0.22) / 0.4));
}

/**
 * A soft, feathered patch of the theme's deep tone behind a block of text, as dark as the photo needs.
 * No hard edge: it is a blurred shadow of a rectangle.
 */
export function textHalo(
  ctx: Ctx,
  photo: PlacedPhoto | null | undefined,
  slot: Slot,
  x: number,
  y: number,
  w: number,
  h: number,
  deep: string,
): void {
  const a = haloAlpha(bandLuma(photo, slot, y, y + h));
  const OFF = 4000;
  ctx.save();
  ctx.beginPath();
  ctx.rect(slot.x, slot.y, slot.w, slot.h);
  ctx.clip();
  ctx.shadowColor = rgba(deep, a);
  ctx.shadowBlur = 90;
  ctx.shadowOffsetX = OFF;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = "#000";
  ctx.fillRect(x - OFF, y, w, h);
  ctx.restore();
}

// ---------------------------------------------------------------- text

export interface TextStyle {
  w: number;
  lines: number;
  size: number;
  min?: number;
  font: (size: number) => string;
  color: string;
  align?: CanvasTextAlign;
  lh?: number;
  /** Lines allowed once the text has shrunk to its minimum size (shrink first, then wrap, then ellipsize). */
  wrap?: number;
  /** Soft shadow blur in px (text over a photo). */
  shadow?: number;
  /** Rotation in radians about the text's anchor point. */
  rot?: number;
}

export interface Laid {
  size: number;
  lines: string[];
  lh: number;
  height: number;
  truncated: boolean;
}

/**
 * Fits text: first shrink toward the minimum size so it stays on `lines` lines; at the minimum, wrap onto
 * up to `wrap` lines; only then ellipsize, at a word boundary. Words are never broken unless one alone is
 * wider than the box.
 */
export function layout(ctx: Ctx, text: string, o: TextStyle): Laid {
  const min = o.min ?? Math.round(o.size * 0.6);
  const maxLines = Math.max(o.lines, o.wrap ?? o.lines);
  const words = text.split(" ").filter(Boolean);
  const build = (size: number, lines: string[], truncated: boolean): Laid => {
    const lh = size * (o.lh ?? 1.2);
    return { size, lines, lh, height: lines.length * lh, truncated };
  };
  for (let size = o.size; size >= min; size -= 2) {
    ctx.font = o.font(size);
    if (words.some((w) => ctx.measureText(w).width > o.w)) continue;
    const lines = wrapText(ctx, text, o.w);
    if (lines.length <= o.lines) return build(size, lines, false);
  }
  ctx.font = o.font(min);
  const lines = wrapText(ctx, text, o.w);
  if (lines.length <= maxLines) return build(min, lines, false);
  const kept = lines.slice(0, maxLines);
  const rest = [kept[maxLines - 1] ?? "", ...lines.slice(maxLines)].join(" ").split(" ");
  let take = rest.length;
  const fits = (n: number) => ctx.measureText(rest.slice(0, n).join(" ") + "\u2026").width <= o.w;
  while (take > 1 && !fits(take)) take--;
  let last = rest.slice(0, take).join(" ");
  if (!fits(take)) {
    let chars = Array.from(last);
    while (chars.length > 1 && ctx.measureText(chars.join("") + "\u2026").width > o.w)
      chars = chars.slice(0, -1);
    last = chars.join("");
  }
  kept[maxLines - 1] = last + "\u2026";
  return build(min, kept, true);
}

/** Draws text with its top edge at `top`. Returns the y just below it. */
export function draw(ctx: Ctx, text: string, x: number, top: number, o: TextStyle): number {
  if (!text) return top;
  const L = layout(ctx, text, o);
  ctx.save();
  if (o.rot) {
    ctx.translate(x, top);
    ctx.rotate(o.rot);
    ctx.translate(-x, -top);
  }
  ctx.font = o.font(L.size);
  ctx.fillStyle = o.color;
  ctx.textAlign = o.align ?? "left";
  ctx.textBaseline = "alphabetic";
  const paint = () =>
    L.lines.forEach((line, i) => {
      ctx.fillText(line, x, top + i * L.lh + (L.lh + L.size * 0.72) / 2);
    });
  if (o.shadow) {
    // a thin tight shadow keeps the letter edges crisp, a wide soft one lifts the line off the photo
    ctx.shadowColor = "rgba(12,8,6,0.55)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    paint();
    ctx.shadowColor = "rgba(12,8,6,0.62)";
    ctx.shadowBlur = o.shadow;
    ctx.shadowOffsetY = Math.max(1, Math.round(o.shadow / 5));
  }
  paint();
  ctx.restore();
  return top + L.height;
}

/** Height this text would take. */
export function heightOf(ctx: Ctx, text: string, o: TextStyle): number {
  return text ? layout(ctx, text, o).height : 0;
}

/** Draws text so its bottom edge sits at `bottom`. Returns its top edge. */
export function drawUp(ctx: Ctx, text: string, x: number, bottom: number, o: TextStyle): number {
  if (!text) return bottom;
  const h = heightOf(ctx, text, o);
  draw(ctx, text, x, bottom - h, o);
  return bottom - h;
}

/**
 * A note in handwriting when it fits the lines at a readable size (44px or more); otherwise a calm italic
 * serif at 34px or more, so a long note is never cut short just to stay handwritten.
 */
export function noteStyle(
  ctx: Ctx,
  text: string,
  w: number,
  lines: number,
  color: string,
  align: CanvasTextAlign,
  handSize = 50,
): TextStyle {
  const hand: TextStyle = {
    w,
    lines,
    size: handSize,
    min: 44,
    font: handFont,
    color,
    align,
    lh: 1.04,
    shadow: 12,
  };
  if (!layout(ctx, text, hand).truncated) return hand;
  return {
    w,
    lines: lines + 1,
    size: 36,
    min: 34,
    font: noteSans,
    color,
    align,
    lh: 1.22,
    shadow: 12,
  };
}

/** Sentence case for the small handwritten label made from a theme's printed kicker. */
export function sentence(s: string): string {
  const t = s.trim().toLowerCase();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
}

export function brandMark(
  ctx: Ctx,
  x: number,
  y: number,
  align: CanvasTextAlign,
  color = "rgba(255,253,248,0.82)",
): void {
  ctx.save();
  ctx.shadowColor = "rgba(12,8,6,0.55)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 1;
  ctx.font = fontSpec("display", 400, 26, true);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(FOOTER_TEXT, x, y);
  ctx.restore();
}

/** "Name  ·  date", or just the name. */
export function whoLine(name: string, date: string): string {
  return date ? `${name}  ·  ${date}` : name;
}

// ---------------------------------------------------------------- framing

/**
 * A restrained keyline on the photo, in the theme's own frame vocabulary: a fine line, a double line,
 * dotted stitching or corner brackets. Never a thick border, never opaque.
 */
export function edgeFrame(
  ctx: Ctx,
  t: ThemeConfig,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  alpha = 0.6,
): void {
  switch (t.frame) {
    case "none":
      return;
    case "ticks":
      brackets(ctx, x, y, w, h, 46, color, alpha + 0.15, 3);
      return;
    case "double":
      keyline(ctx, x, y, w, h, 6, color, alpha, 2);
      keyline(ctx, x + 12, y + 12, w - 24, h - 24, 3, color, alpha * 0.7, 1.2);
      return;
    case "stitch":
      keyline(ctx, x, y, w, h, 18, color, alpha + 0.1, 3, [12, 9]);
      return;
    case "scallop": {
      ctx.save();
      ctx.globalAlpha = alpha + 0.1;
      ctx.fillStyle = color;
      const step = 26;
      for (let px = x + step; px < x + w - 10; px += step) {
        circle(ctx, px, y, 3.4);
        ctx.fill();
        circle(ctx, px, y + h, 3.4);
        ctx.fill();
      }
      for (let py = y + step; py < y + h - 10; py += step) {
        circle(ctx, x, py, 3.4);
        ctx.fill();
        circle(ctx, x + w, py, 3.4);
        ctx.fill();
      }
      ctx.restore();
      return;
    }
    case "bold":
      keyline(ctx, x, y, w, h, 4, color, alpha + 0.2, 4);
      return;
    default:
      keyline(ctx, x, y, w, h, 14, color, alpha, 2);
  }
}

/** A motif drawn tilted about its centre. */
export function tiltedMotif(
  ctx: Ctx,
  t: ThemeConfig,
  which: "motif" | "motif2",
  x: number,
  y: number,
  s: number,
  rot: number,
  c1: string,
  c2: string,
  alpha = 0.85,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(rot);
  motif(ctx, which === "motif" ? t.motif : t.motif2, 0, 0, s, c1, c2);
  ctx.restore();
}

/** A hairline with a small sparkle in the middle, a quiet divider for centred captions. */
export function sparkleRule(
  ctx: Ctx,
  cx: number,
  y: number,
  half: number,
  color: string,
  alpha = 0.85,
): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.8;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - half, y);
  ctx.lineTo(cx - 26, y);
  ctx.moveTo(cx + 26, y);
  ctx.lineTo(cx + half, y);
  ctx.stroke();
  ctx.restore();
  sparkle(ctx, cx, y, 13, color, alpha);
}
