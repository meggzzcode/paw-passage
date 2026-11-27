// Photo-first overlay engine shared by the keepsake families.
//
// The photograph is the artwork: it is drawn full-bleed and everything else is a delicate,
// transparent layer on top — a hairline frame, small motifs near the edges, a handwritten
// caption and a quiet date. Nothing in here paints a large opaque panel across the picture.
// Text picks its colour from the pixels actually underneath it, so a dark photo and a light
// photo both stay readable, and captions stay inside the safe area so they are not covered by
// a social app's own interface.
//
// Privacy: pure drawing over a canvas context. Nothing here reads or writes a server.
import { circle, type Ctx } from "./render";
import {
  W,
  para,
  paraHeight,
  paraOutlined,
  placeholder,
  rnd,
  type Prep,
  type Slot,
  type TextOpts,
} from "./kit";
import { drawPlacedPhoto, type PlacedPhoto } from "./photo";
import { motif, roundRectPath } from "./ornaments";
import type { FontKey, MotifId } from "./themes";

export type Tone = "light" | "dark";

/** hex -> rgba() so a decoration can be drawn transparently over a photograph. */
export function withAlpha(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, "0");
  const r = parseInt(n.slice(0, 2), 16) || 0;
  const g = parseInt(n.slice(2, 4), 16) || 0;
  const b = parseInt(n.slice(4, 6), 16) || 0;
  const k = Number.isFinite(a) ? Math.max(0, Math.min(1, a)) : 0;
  return `rgba(${r},${g},${b},${k})`;
}

/**
 * Whether the picture under a rectangle is light or dark, so the caption drawn there can pick
 * a readable colour. Falls back to the theme's own ground when pixels cannot be read (a headless
 * test canvas, a context that forbids reads): the layout never depends on it.
 */
export function toneAt(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  fallback: Tone = "light",
): Tone {
  try {
    const sx = Math.max(0, Math.round(x));
    const sy = Math.max(0, Math.round(y));
    const sw = Math.max(1, Math.min(Math.round(w), W - sx));
    const sh = Math.max(1, Math.round(h));
    const img = ctx.getImageData(sx, sy, sw, sh);
    const px = img?.data;
    if (!px || px.length < 4) return fallback;
    let sum = 0;
    let n = 0;
    // every 16th pixel is plenty to tell a bright picture from a dark one
    for (let i = 0; i + 2 < px.length; i += 64) {
      sum += 0.2126 * (px[i] ?? 0) + 0.7152 * (px[i + 1] ?? 0) + 0.0722 * (px[i + 2] ?? 0);
      n++;
    }
    if (n === 0) return fallback;
    return sum / n / 255 > 0.55 ? "light" : "dark";
  } catch {
    return fallback;
  }
}

/** Colours for text and hairlines drawn over a picture of this tone. */
export interface OverlayInk {
  /** Caption and headline colour. */
  main: string;
  /** Quieter line (date, teaser). */
  soft: string;
  /** Outline behind text so it reads on a busy picture. */
  outline: string;
  /** Hairline frame and rules. */
  hair: string;
  /** Small badge / motif accent. */
  accent: string;
}

export function inkFor(tone: Tone, p: Prep): OverlayInk {
  const c = p.t.palette;
  if (tone === "light")
    return {
      main: c.ink,
      soft: c.muted,
      outline: withAlpha(c.card, 0.8),
      hair: withAlpha(c.ink, 0.35),
      accent: c.accent,
    };
  return {
    main: "#fffaf0",
    soft: withAlpha("#fffaf0", 0.78),
    outline: withAlpha("#241c18", 0.5),
    hair: withAlpha("#fffaf0", 0.5),
    accent: withAlpha("#fffaf0", 0.92),
  };
}

// ---------------------------------------------------------------- the photograph

/** The picture, edge to edge. When there is no photo, a soft ground with a small motif. */
export function fullBleed(
  ctx: Ctx,
  p: Prep,
  photo: PlacedPhoto | null | undefined,
  index = 0,
): void {
  const s: Slot = { x: 0, y: 0, w: W, h: p.H };
  if (photo && drawPlacedPhoto(ctx, photo, s.x, s.y, s.w, s.h)) return;
  placeholder(ctx, p.t, s, index);
}

/** A soft gradient from nothing to `color` at this opacity, to keep a caption readable. */
export function softFade(
  ctx: Ctx,
  top: number,
  bottom: number,
  color: string,
  alpha: number,
  up = false,
): void {
  if (bottom <= top) return;
  ctx.save();
  const g = ctx.createLinearGradient(0, top, 0, bottom);
  g.addColorStop(0, withAlpha(color, up ? alpha : 0));
  g.addColorStop(1, withAlpha(color, up ? 0 : alpha));
  ctx.fillStyle = g;
  ctx.fillRect(0, top, W, bottom - top);
  ctx.restore();
}

// ---------------------------------------------------------------- decoration

/** A single thin line inset from the edge. Deliberately quiet: it holds the picture, it does not frame it. */
export function hairlineFrame(ctx: Ctx, p: Prep, color: string, inset = 26, lw = 2): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  roundRectPath(ctx, inset, inset, W - inset * 2, p.H - inset * 2, 10);
  ctx.stroke();
  ctx.restore();
}

/**
 * Small motifs scattered in the border band, never across the middle where the dog is.
 * Deterministic, so the same keepsake always draws the same way.
 */
export function edgeDoodles(
  ctx: Ctx,
  p: Prep,
  count: number,
  color: string,
  color2: string,
  seed = 1,
  alpha = 0.5,
  band = 96,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < count; i++) {
    const s = seed + i * 7;
    const side = i % 4;
    const along = 0.12 + rnd(s) * 0.76;
    const off = 34 + rnd(s + 3) * band;
    const cx = side === 0 ? along * W : side === 1 ? W - off : side === 2 ? along * W : off;
    const cy = side === 0 ? off : side === 1 ? along * p.H : side === 2 ? p.H - off : along * p.H;
    const size = 24 + rnd(s + 5) * 26;
    const id: MotifId = i % 2 ? p.t.motif2 : p.t.motif;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rnd(s + 9) - 0.5) * 0.5);
    motif(ctx, id, 0, 0, size, color, color2);
    ctx.restore();
  }
  ctx.restore();
}

/** A tiny themed badge: the theme's motif inside a thin ring, drawn at a corner. */
export function cornerBadge(
  ctx: Ctx,
  p: Prep,
  x: number,
  y: number,
  size: number,
  color: string,
  color2: string,
  id?: MotifId,
  ring = true,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.06);
  if (ring) {
    ctx.strokeStyle = color2;
    ctx.lineWidth = 2;
    circle(ctx, 0, 0, size * 0.78);
    ctx.stroke();
  }
  motif(ctx, id ?? p.t.motif, 0, 0, size, color, color2);
  ctx.restore();
}

// ---------------------------------------------------------------- type

export interface CaptionOpts {
  w: number;
  lines?: number;
  size?: number;
  min?: number;
  color: string;
  outline: string;
  align?: CanvasTextAlign;
  key?: FontKey;
  weight?: number | string;
  italic?: boolean;
  lh?: number;
}

/**
 * A caption drawn straight onto the picture: no panel behind it. The thin outline is what keeps
 * it readable on a busy photograph, so the decoration stays transparent.
 */
export function caption(ctx: Ctx, text: string, x: number, y: number, o: CaptionOpts): number {
  if (!text) return y;
  const size = o.size ?? 44;
  return paraOutlined(
    ctx,
    text,
    x,
    y,
    {
      w: o.w,
      lines: o.lines ?? 2,
      size,
      min: o.min ?? Math.round(size * 0.5),
      key: o.key ?? "hand",
      weight: o.weight ?? 500,
      italic: o.italic ?? false,
      color: o.color,
      align: o.align ?? "left",
      lh: o.lh ?? 1.18,
    },
    o.outline,
    Math.max(4, Math.round(size * 0.16)),
  );
}

/** A quiet date line with a short rule: the "taken on" detail, kept small. */
export function dateStamp(
  ctx: Ctx,
  p: Prep,
  x: number,
  y: number,
  o: { color: string; rule: string; align?: CanvasTextAlign; w?: number; size?: number },
): number {
  if (!p.date) return y;
  const size = o.size ?? (p.story ? 26 : 22);
  const w = o.w ?? 340;
  const bottom = para(ctx, p.date, x, y, {
    w,
    lines: 1,
    size,
    min: 14,
    key: "body",
    color: o.color,
    align: o.align ?? "left",
  });
  ctx.save();
  ctx.strokeStyle = o.rule;
  ctx.lineWidth = 2;
  const rx = o.align === "right" ? x - 60 : x;
  ctx.beginPath();
  ctx.moveTo(rx, bottom + 2);
  ctx.lineTo(rx + 52, bottom + 2);
  ctx.stroke();
  ctx.restore();
  return bottom;
}

/** Where a caption block may sit: inside the safe area, above the bottom edge. */
export function captionFloor(p: Prep): number {
  return p.H - p.safeBottom;
}

export function captionCeil(p: Prep): number {
  return p.safeTop;
}

/** One line of a bottom-anchored caption: measured first, so the whole stack sits above the floor. */
export interface Block {
  text: string;
  w: number;
  lines: number;
  size: number;
  key: FontKey;
  color: string;
  min?: number;
  weight?: number | string;
  italic?: boolean;
  align?: CanvasTextAlign;
  lh?: number;
  /** Space added under this block. */
  gap?: number;
  /** When set, the line is drawn straight onto the picture with this outline instead of a panel. */
  outline?: string;
}

function blockOpts(b: Block): TextOpts {
  const o: TextOpts = {
    w: b.w,
    lines: b.lines,
    size: b.size,
    key: b.key,
    color: b.color,
  };
  if (b.min !== undefined) o.min = b.min;
  if (b.weight !== undefined) o.weight = b.weight;
  if (b.italic !== undefined) o.italic = b.italic;
  if (b.align !== undefined) o.align = b.align;
  if (b.lh !== undefined) o.lh = b.lh;
  return o;
}

/**
 * Draws a stack of caption lines bottom-anchored at `floor`, so nothing runs under the safe
 * edge however many lines the words need. Returns the y just above the stack.
 */
export function stackUp(ctx: Ctx, blocks: Block[], x: number, floor: number): number {
  const live = blocks.filter((b) => b.text);
  let total = 0;
  for (const b of live) total += paraHeight(ctx, b.text, blockOpts(b)) + (b.gap ?? 0);
  let y = floor - total;
  for (const b of live) {
    const o = blockOpts(b);
    y =
      (b.outline !== undefined
        ? paraOutlined(ctx, b.text, x, y, o, b.outline, Math.max(4, Math.round(b.size * 0.16)))
        : para(ctx, b.text, x, y, o)) + (b.gap ?? 0);
  }
  return y;
}
