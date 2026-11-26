// Shared drawing helpers for the keepsake families: text, frames, photo slots and illustrated placeholders.
import { FOOTER_TEXT, circle, drawBlock, fitText, type BlockStyle, type Ctx } from "./render";
import { drawPlacedPhoto, type PlacedPhoto } from "./photo";
import { FONTS, type FontKey, type KeepsakeFamily, type ThemeConfig } from "./themes";
import { motif, roundRectPath } from "./ornaments";

export type SizeId = "square" | "portrait" | "story";

export const ART_SIZES: Record<SizeId, { width: number; height: number; label: string }> = {
  square: { width: 1080, height: 1080, label: "Square" },
  portrait: { width: 1080, height: 1350, label: "Portrait" },
  story: { width: 1080, height: 1920, label: "Story" },
};

export interface ArtSpec {
  family: KeepsakeFamily;
  theme: string;
  headline: string;
  subhead?: string | undefined;
  dogName: string;
  date?: string | undefined;
  /** At most 140 characters are drawn. */
  memory?: string | undefined;
  size: SizeId;
}

export interface ArtAssets {
  /** Photos in slot order. Missing entries get the theme's illustration. */
  photos?: ReadonlyArray<PlacedPhoto | null | undefined> | undefined;
}

export interface Slot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const W = 1080;

export function heightOf(size: SizeId): number {
  return ART_SIZES[size].height;
}

// ---------------------------------------------------------------- text

export function fontOf(key: FontKey, weight: number | string = 400, italic = false) {
  return (s: number) => `${italic ? "italic " : ""}${weight} ${s}px ${FONTS[key]}`;
}

export interface TextOpts {
  w: number;
  lines: number;
  size: number;
  min?: number;
  key: FontKey;
  weight?: number | string;
  italic?: boolean;
  color: string;
  align?: CanvasTextAlign;
  lh?: number;
}

/** Shrinks the size until the widest single word fits the width, so words are never broken mid-way. */
export function wordSafeSize(ctx: Ctx, text: string, o: TextOpts): number {
  const min = o.min ?? Math.max(10, Math.round(o.size * 0.45));
  const font = fontOf(o.key, o.weight ?? 400, o.italic ?? false);
  const words = text.split(" ").filter(Boolean);
  let size = o.size;
  while (size > min) {
    ctx.font = font(size);
    if (words.every((w) => ctx.measureText(w).width <= o.w)) break;
    size -= 2;
  }
  return Math.max(min, size);
}

function style(o: TextOpts): BlockStyle {
  return {
    maxWidth: o.w,
    maxLines: o.lines,
    size: o.size,
    minSize: o.min ?? Math.max(10, Math.round(o.size * 0.45)),
    font: fontOf(o.key, o.weight ?? 400, o.italic ?? false),
    color: o.color,
    align: o.align ?? "left",
    lineHeight: o.lh ?? 1.2,
  };
}

/** Draws wrapped, shrunk-to-fit text with its top edge at y. Returns the y just below it. */
export function para(ctx: Ctx, text: string, x: number, y: number, o: TextOpts): number {
  if (!text) return y;
  return drawBlock(ctx, text, x, y, style({ ...o, size: wordSafeSize(ctx, text, o) }));
}

export function paraHeight(ctx: Ctx, text: string, o: TextOpts): number {
  if (!text) return 0;
  const s = style({ ...o, size: wordSafeSize(ctx, text, o) });
  const { size, lines } = fitText(ctx, text, s);
  return lines.length * size * (s.lineHeight ?? 1.25) + size * 0.2;
}

/** Draws text so its bottom edge sits at `bottom`. Returns its top edge. */
export function paraUp(ctx: Ctx, text: string, x: number, bottom: number, o: TextOpts): number {
  if (!text) return bottom;
  const h = paraHeight(ctx, text, o);
  para(ctx, text, x, bottom - h, o);
  return bottom - h;
}

/** Text drawn with an outline for legibility over photos. Single block, same fitting as para. */
export function paraOutlined(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  o: TextOpts,
  outline: string,
  outlineWidth: number,
): number {
  if (!text) return y;
  const s = style({ ...o, size: wordSafeSize(ctx, text, o) });
  const { size, lines } = fitText(ctx, text, s);
  const lh = size * (s.lineHeight ?? 1.25);
  ctx.font = s.font(size);
  ctx.textAlign = s.align;
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.strokeStyle = outline;
  ctx.lineWidth = outlineWidth;
  ctx.fillStyle = s.color;
  lines.forEach((l, i) => {
    ctx.strokeText(l, x, y + size + i * lh);
    ctx.fillText(l, x, y + size + i * lh);
  });
  return y + lines.length * lh + size * 0.2;
}

export function brand(
  ctx: Ctx,
  x: number,
  y: number,
  align: CanvasTextAlign,
  color: string,
  size = 24,
  key: FontKey = "serif",
): void {
  ctx.font = fontOf(key, 400, true)(size);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(FOOTER_TEXT, x, y);
}

export function hash(s: string): number {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  return h;
}

/** Deterministic 0..1 pseudo-random from an integer seed. */
export function rnd(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ---------------------------------------------------------------- shapes

export function fillRound(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
  stroke?: string,
  lw = 2,
): void {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

export function barcode(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  seed: string,
  color: string,
): void {
  ctx.fillStyle = color;
  let cx = x;
  let n = hash(seed) || 7;
  while (cx < x + w) {
    n = (Math.imul(n, 1103515245) + 12345) >>> 0;
    const bar = 2 + (n % 4);
    if (cx + bar > x + w) break;
    ctx.fillRect(cx, y, bar, h);
    cx += bar + 2 + ((n >> 8) % 4);
  }
}

export function perforation(
  ctx: Ctx,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 9]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

export function paperBackground(ctx: Ctx, t: ThemeConfig, w: number, h: number): void {
  ctx.fillStyle = t.palette.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(120,100,60,0.05)";
  for (let i = 0; i < 110; i++) ctx.fillRect((i * 7919) % w, (i * 104729) % h, 2 + (i % 4), 1);
}

/** Sunburst rays from a point; used for posters, cards and sunrise. */
export function rays(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  n: number,
  color: string,
  alpha = 1,
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  for (let i = 0; i < n; i += 2) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r);
    ctx.lineTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** Decorative border around the canvas (or any inset rectangle), chosen by the theme's frame style. */
export function frame(
  ctx: Ctx,
  t: ThemeConfig,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  color2: string,
): void {
  ctx.save();
  switch (t.frame) {
    case "double":
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, w, h);
      ctx.strokeStyle = color2;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 12, y + 12, w - 24, h - 24);
      break;
    case "ticks": {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([14, 8]);
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
      ctx.strokeStyle = color2;
      ctx.lineWidth = 5;
      const L = 46;
      for (const [cx, cy, dx, dy] of [
        [x, y, 1, 1],
        [x + w, y, -1, 1],
        [x, y + h, 1, -1],
        [x + w, y + h, -1, -1],
      ] as const) {
        ctx.beginPath();
        ctx.moveTo(cx + dx * L, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy * L);
        ctx.stroke();
      }
      break;
    }
    case "scallop": {
      ctx.fillStyle = color;
      const r = 13;
      const step = r * 2;
      for (let px = x + r; px < x + w; px += step) {
        circle(ctx, px, y, r);
        ctx.fill();
        circle(ctx, px, y + h, r);
        ctx.fill();
      }
      for (let py = y + r; py < y + h; py += step) {
        circle(ctx, x, py, r);
        ctx.fill();
        circle(ctx, x + w, py, r);
        ctx.fill();
      }
      break;
    }
    case "bold":
      ctx.strokeStyle = color;
      ctx.lineWidth = 16;
      ctx.strokeRect(x + 8, y + 8, w - 16, h - 16);
      ctx.strokeStyle = color2;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 26, y + 26, w - 52, h - 52);
      break;
    case "none":
      break;
  }
  ctx.restore();
}

// ---------------------------------------------------------------- photos

/** The theme's illustration, drawn when there is no photo: a big motif on a tinted ground. */
export function placeholder(ctx: Ctx, t: ThemeConfig, s: Slot, index = 0): void {
  const p = t.palette;
  ctx.save();
  ctx.beginPath();
  ctx.rect(s.x, s.y, s.w, s.h);
  ctx.clip();
  const g = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.h);
  g.addColorStop(0, p.bg2);
  g.addColorStop(1, isDark(p.bg2) ? p.bg : p.card);
  ctx.fillStyle = g;
  ctx.fillRect(s.x, s.y, s.w, s.h);
  const m = Math.min(s.w, s.h);
  rays(ctx, s.x + s.w / 2, s.y + s.h * 0.55, Math.hypot(s.w, s.h), 24, p.accent2, 0.1);
  for (let i = 0; i < 7; i++) {
    const px = s.x + (0.1 + rnd(i * 3 + index + 1) * 0.8) * s.w;
    const py = s.y + (0.1 + rnd(i * 5 + index + 9) * 0.8) * s.h;
    ctx.globalAlpha = 0.22;
    motif(ctx, i % 2 ? t.motif2 : "paw", px, py, m * 0.13, p.muted, p.muted);
  }
  ctx.globalAlpha = 1;
  const main = index % 2 ? t.motif2 : t.motif;
  motif(ctx, main, s.x + s.w / 2, s.y + s.h / 2, m * 0.56, p.accent, p.accent2);
  ctx.restore();
}

/** Draws the photo (or the illustration) into a slot. */
export function drawSlot(
  ctx: Ctx,
  t: ThemeConfig,
  s: Slot,
  photo: PlacedPhoto | null | undefined,
  index = 0,
): void {
  if (photo && drawPlacedPhoto(ctx, photo, s.x, s.y, s.w, s.h)) return;
  placeholder(ctx, t, s, index);
}

/** Print-style mat with a soft shadow, optionally tilted. Draw the photo inside the same save/restore. */
export function tilt(ctx: Ctx, s: Slot, rad: number): void {
  ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
  ctx.rotate(rad);
  ctx.translate(-(s.x + s.w / 2), -(s.y + s.h / 2));
}

export function mat(
  ctx: Ctx,
  s: Slot,
  fill: string,
  pad: number,
  padBottom = pad,
  shadow = "rgba(0,0,0,0.18)",
): void {
  ctx.fillStyle = shadow;
  ctx.fillRect(s.x - pad + 6, s.y - pad + 9, s.w + pad * 2, s.h + pad + padBottom);
  ctx.fillStyle = fill;
  ctx.fillRect(s.x - pad, s.y - pad, s.w + pad * 2, s.h + pad + padBottom);
}

export function clean(s: string | undefined): string {
  return s ?? "";
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

export function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** The most readable of the candidates on a given background. */
export function readable(bg: string, ...candidates: string[]): string {
  let best = candidates[0] ?? "#000000";
  let top = 0;
  for (const c of candidates) {
    const k = contrast(bg, c);
    if (k > top) {
      top = k;
      best = c;
    }
  }
  return best;
}

/** Strong text colour for a surface of this colour, drawn from the theme where possible. */
export function inkOn(bg: string, t: ThemeConfig): string {
  return readable(bg, t.palette.ink, t.palette.bg, "#14181d", "#ffffff");
}

/** Quieter text colour for a surface, still at least 4.5:1 where the theme allows it. */
export function softOn(bg: string, t: ThemeConfig): string {
  const m = t.palette.muted;
  return contrast(bg, m) >= 4.5 ? m : inkOn(bg, t);
}

export function isDark(hex: string): boolean {
  return luminance(hex) < 0.25;
}

// ---------------------------------------------------------------- family plumbing

/** Cleaned inputs plus the theme, handed to a family's layout and draw functions. */
export interface Prep {
  spec: ArtSpec;
  t: ThemeConfig;
  head: string;
  sub: string;
  name: string;
  date: string;
  memory: string;
  H: number;
  story: boolean;
  /** Top and bottom edges of the area where important text should stay (story keeps clear of app chrome). */
  safeTop: number;
  safeBottom: number;
}

export interface FamilyDef {
  /** Photo rectangles for this size, in photo order. Pure geometry, so the editor can use the same frames. */
  slots(p: Prep, count: number): Slot[];
  draw(
    ctx: Ctx,
    p: Prep,
    photos: ReadonlyArray<PlacedPhoto | null | undefined>,
    slots: Slot[],
  ): void;
}

/** How many text lines of this size fit between y and limit. */
export function linesFit(y: number, limit: number, size: number, lh = 1.3): number {
  return Math.max(1, Math.floor((limit - y) / (size * lh)));
}
