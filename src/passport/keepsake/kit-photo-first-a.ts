// Photo-first helpers for the families in families-a.ts: handwriting, tracked labels, soft scrims,
// a bottom-up text stack that drops optional lines when the photo needs the room, and colour helpers
// that keep type readable over any photo. Pure canvas drawing, no network, no images.
import { FONT_HAND } from "./fonts";
import { drawBlock, fitText, type Ctx } from "./render";
import { contrast, fontOf, para, paraHeight, type TextOpts } from "./kit";
import type { FontKey } from "./themes";

// ---------------------------------------------------------------- handwriting

/** Caveat is self-hosted (styles.css); the fallbacks are the common script faces on phones. */
export const HAND_STACK = FONT_HAND;
export const handFont = (size: number, weight: number = 600) => `${weight} ${size}px ${HAND_STACK}`;
/** Handwriting never goes below this size on a 1080 wide piece. */
export const HAND_MIN = 44;
/** Smallest size of any readable line of type. */
export const TEXT_MIN = 34;

// Fonts are awaited by ensureKeepsakeFonts() in every draw path (fonts.ts).

export interface HandOpts {
  w: number;
  lines: number;
  size: number;
  color: string;
  align?: CanvasTextAlign;
  lh?: number;
  min?: number;
}

function handFit(ctx: Ctx, text: string, o: HandOpts) {
  return fitText(ctx, text, {
    maxWidth: o.w,
    maxLines: o.lines,
    size: o.size,
    minSize: Math.min(o.size, Math.max(HAND_MIN, o.min ?? HAND_MIN)),
    font: handFont,
  });
}

export function handHeight(ctx: Ctx, text: string, o: HandOpts): number {
  if (!text) return 0;
  const { size, lines } = handFit(ctx, text, o);
  return lines.length * size * (o.lh ?? 1.12) + size * 0.2;
}

/** Wrapped handwriting with its top edge at y. Returns the y below it. */
export function hand(ctx: Ctx, text: string, x: number, y: number, o: HandOpts): number {
  if (!text) return y;
  return drawBlock(ctx, text, x, y, {
    maxWidth: o.w,
    maxLines: o.lines,
    size: o.size,
    minSize: Math.min(o.size, Math.max(HAND_MIN, o.min ?? HAND_MIN)),
    font: handFont,
    color: o.color,
    align: o.align ?? "left",
    lineHeight: o.lh ?? 1.12,
  });
}

// ---------------------------------------------------------------- tracked (letter-spaced) labels

/** Single line of letter-spaced text; shrinks the tracking, then the size, then trims, so it always fits. */
export function tracked(
  ctx: Ctx,
  text: string,
  x: number,
  baseline: number,
  o: {
    size: number;
    key: FontKey;
    weight?: number | string;
    color: string;
    align?: CanvasTextAlign;
    maxW: number;
    track?: number;
    min?: number;
  },
): number {
  if (!text) return 0;
  const font = fontOf(o.key, o.weight ?? 700);
  const align = o.align ?? "left";
  let size = o.size;
  let track = o.track ?? 4;
  let chars = Array.from(text);
  const measure = () => {
    ctx.font = font(size);
    let total = 0;
    for (const c of chars) total += ctx.measureText(c).width + track;
    return total - track;
  };
  const min = o.min ?? TEXT_MIN;
  while (measure() > o.maxW && track > 0) track = Math.max(0, track - 1);
  while (measure() > o.maxW && size > min) size -= 2;
  while (measure() > o.maxW && chars.length > 1) chars = chars.slice(0, -1);
  const total = measure();
  let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
  ctx.fillStyle = o.color;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = font(size);
  for (const c of chars) {
    ctx.fillText(c, cx, baseline);
    cx += ctx.measureText(c).width + track;
  }
  return total;
}

// ---------------------------------------------------------------- colour

function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, "0");
  return [
    parseInt(n.slice(0, 2), 16) || 0,
    parseInt(n.slice(2, 4), 16) || 0,
    parseInt(n.slice(4, 6), 16) || 0,
  ];
}

export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const f = (u: number, v: number) => Math.round(u + (v - u) * t);
  const hx = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hx(f(r1, r2))}${hx(f(g1, g2))}${hx(f(b1, b2))}`;
}

export function rgba(hex: string, a: number): string {
  const [r, g, b] = rgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/** The colour lightened until it reads on a darkened photo (at least `min`:1 against near-black). */
export function onDark(hex: string, min = 7): string {
  for (let i = 0; i <= 10; i++) {
    const c = mix(hex, "#ffffff", i * 0.09);
    if (contrast(c, "#0c0c0e") >= min) return c;
  }
  return "#ffffff";
}

// ---------------------------------------------------------------- scrims and light

/** Vertical soft darkening between two y values; alpha eases in and out so there is no visible edge. */
export function scrimV(
  ctx: Ctx,
  y0: number,
  y1: number,
  a0: number,
  a1: number,
  w: number,
  rgbTriple = "0,0,0",
): void {
  if (y1 === y0) return;
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  const mid = (a0 + a1) / 2;
  g.addColorStop(0, `rgba(${rgbTriple},${a0})`);
  g.addColorStop(0.5, `rgba(${rgbTriple},${(mid * 1.08).toFixed(3)})`);
  g.addColorStop(1, `rgba(${rgbTriple},${a1})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, Math.min(y0, y1), w, Math.abs(y1 - y0));
}

/** A soft elliptical pool of shade or light, for text or a corner. */
export function pool(
  ctx: Ctx,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  alpha: number,
  rgbTriple = "0,0,0",
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, `rgba(${rgbTriple},${alpha})`);
  g.addColorStop(0.55, `rgba(${rgbTriple},${(alpha * 0.55).toFixed(3)})`);
  g.addColorStop(1, `rgba(${rgbTriple},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
  ctx.restore();
}

/** Gentle edge darkening that holds the photo together. */
export function vignette(ctx: Ctx, w: number, h: number, alpha = 0.22): void {
  const g = ctx.createRadialGradient(
    w / 2,
    h * 0.46,
    Math.min(w, h) * 0.45,
    w / 2,
    h / 2,
    h * 0.78,
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${alpha})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** A faint film-style colour glow bleeding in from a corner. */
export function lightLeak(
  ctx: Ctx,
  w: number,
  h: number,
  color: string,
  alpha: number,
  corner: "tl" | "tr" | "bl" | "br" = "tl",
): void {
  const x = corner === "tl" || corner === "bl" ? 0 : w;
  const y = corner === "tl" || corner === "tr" ? 0 : h;
  const r = Math.min(w, h) * 0.95;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, alpha));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** Runs `fn` with a soft shadow on, so type and ornaments stay readable on a busy photo. */
export function shadowed(ctx: Ctx, fn: () => void, blur = 16, alpha = 0.5, dy = 2): void {
  ctx.save();
  ctx.shadowColor = `rgba(0,0,0,${alpha})`;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = dy;
  fn();
  ctx.restore();
}

// ---------------------------------------------------------------- bottom-up text stack

interface StackItem {
  h: number;
  gap: number;
  /** Lower numbers are dropped first when the photo needs the room. */
  drop: number;
  draw: (y: number) => void;
}

/**
 * Text blocks laid out upward from a bottom edge. Optional items are dropped (lowest `drop` first) until the
 * whole stack fits in `maxH`, so the subject keeps the photograph.
 */
export class Stack {
  private items: StackItem[] = [];

  add(h: number, draw: (y: number) => void, o: { gap?: number; drop?: number } = {}): this {
    this.items.push({ h, draw, gap: o.gap ?? 14, drop: o.drop ?? 99 });
    return this;
  }

  /** Adds a kit paragraph (top-anchored text) as one item. */
  para(
    ctx: Ctx,
    text: string,
    x: number,
    o: TextOpts,
    s: { gap?: number; drop?: number } = {},
  ): this {
    if (!text) return this;
    const h = paraHeight(ctx, text, o);
    return this.add(h, (y) => void para(ctx, text, x, y, o), s);
  }

  /** Adds wrapped handwriting as one item. */
  hand(
    ctx: Ctx,
    text: string,
    x: number,
    o: HandOpts,
    s: { gap?: number; drop?: number } = {},
  ): this {
    if (!text) return this;
    const h = handHeight(ctx, text, o);
    return this.add(h, (y) => void hand(ctx, text, x, y, o), s);
  }

  private kept(maxH: number): StackItem[] {
    let list = [...this.items];
    const total = (l: StackItem[]) => l.reduce((a, i, n) => a + i.h + (n ? i.gap : 0), 0);
    while (total(list) > maxH && list.some((i) => i.drop < 99)) {
      const victim = list.reduce((a, b) => (b.drop < a.drop ? b : a));
      list = list.filter((i) => i !== victim);
    }
    return list;
  }

  /** Height the stack will use once optional items are dropped to fit maxH. */
  height(maxH = Infinity): number {
    return this.kept(maxH).reduce((a, i, n) => a + i.h + (n ? i.gap : 0), 0);
  }

  /** Draws upward from `bottom` and returns the top edge. Items are listed top to bottom. */
  draw(bottom: number, maxH = Infinity): number {
    const list = this.kept(maxH);
    let y = bottom;
    for (let n = list.length - 1; n >= 0; n--) {
      const it = list[n] as StackItem;
      y -= it.h;
      it.draw(y);
      y -= it.gap;
    }
    return y + (list.length ? (list[0] as StackItem).gap : 0);
  }
}
