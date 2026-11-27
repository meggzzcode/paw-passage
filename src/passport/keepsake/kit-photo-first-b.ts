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
  g.addColorStop(0.45, rgba(color, alpha * 0.4));
  g.addColorStop(1, rgba(color, alpha));
  ctx.save();
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
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

/** Fits text in a width and line count: shrinks to the minimum without breaking words, then ellipsizes. */
export function layout(ctx: Ctx, text: string, o: TextStyle): Laid {
  const min = o.min ?? Math.round(o.size * 0.6);
  let size = o.size;
  const words = text.split(" ").filter(Boolean);
  while (size > min) {
    ctx.font = o.font(size);
    if (words.every((w) => ctx.measureText(w).width <= o.w)) break;
    size -= 2;
  }
  size = Math.max(min, size);
  const r = fitText(ctx, text, {
    maxWidth: o.w,
    maxLines: o.lines,
    size,
    minSize: min,
    font: o.font,
  });
  ctx.font = o.font(r.size);
  const truncated = wrapText(ctx, text, o.w).length > r.lines.length;
  const lh = r.size * (o.lh ?? 1.2);
  return { size: r.size, lines: r.lines, lh, height: r.lines.length * lh, truncated };
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
  if (o.shadow) {
    ctx.shadowColor = "rgba(12,8,6,0.62)";
    ctx.shadowBlur = o.shadow;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = Math.max(1, Math.round(o.shadow / 5));
  }
  ctx.font = o.font(L.size);
  ctx.fillStyle = o.color;
  ctx.textAlign = o.align ?? "left";
  ctx.textBaseline = "alphabetic";
  L.lines.forEach((line, i) => {
    ctx.fillText(line, x, top + i * L.lh + (L.lh + L.size * 0.72) / 2);
  });
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
