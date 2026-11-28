// Shared drawing kit for the photo filter looks: colour helpers, hand-drawn shapes (sparkles, hearts, paws),
// sticker plates, tape, text-in-a-plate fitting and the tiny Paws & Passage mark.
// Pure drawing over a canvas context. Nothing here touches the network or browser storage.
import { fontSpec } from "./fonts";
import { cleanText, circle, drawPaw, fitText, type Ctx } from "./render";
import { ART_SIZES, hash, isDark, readable, rnd, type Slot, type SizeId } from "./kit";
import { drawPlacedPhoto, type PlacedPhoto } from "./photo";
import { roundRectPath, starPath } from "./ornaments";
import { themeFor, type KeepsakeFamily, type ThemeConfig } from "./themes";

export type { Slot };

// ---------------------------------------------------------------- fonts (self-hosted faces via fonts.ts)

export type FontFn = (size: number) => string;
export const fScript: FontFn = (s) => fontSpec("hand", 600, s);
export const fRound: FontFn = (s) => fontSpec("display", 700, s);
export const fRoundReg: FontFn = (s) => fontSpec("body", 600, s);
// The camcorder / ticket overlay: small, bold, tracked caps in the body face (callers set `upper`).
export const fMono: FontFn = (s) => fontSpec("body", 700, s);
export const fHeavy: FontFn = (s) => fontSpec("display", 800, s);

// ---------------------------------------------------------------- colour

function rgbOf(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, "0");
  return [
    parseInt(n.slice(0, 2), 16) || 0,
    parseInt(n.slice(2, 4), 16) || 0,
    parseInt(n.slice(4, 6), 16) || 0,
  ];
}

export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = rgbOf(a);
  const [r2, g2, b2] = rgbOf(b);
  const k = (x: number, y: number) =>
    Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${k(r1, r2)}${k(g1, g2)}${k(b1, b2)}`;
}

export function alpha(hex: string, a: number): string {
  const [r, g, b] = rgbOf(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/** Pushes a theme colour toward a bright, phone-filter version of itself while keeping its hue. */
export function vivid(hex: string): string {
  const [r, g, b] = rgbOf(hex).map((v) => v / 255) as [number, number, number];
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  let h = 0;
  if (d > 0.0001) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  } else h = 340; // greys become a friendly pink
  const l0 = (mx + mn) / 2;
  const s0 = d < 0.0001 ? 0 : d / (1 - Math.abs(2 * l0 - 1));
  const sat = Math.min(0.92, Math.max(0.62, s0 * 1.15));
  const l = Math.min(0.6, Math.max(0.46, l0));
  const c = (1 - Math.abs(2 * l - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r1)}${to(g1)}${to(b1)}`;
}

export interface FilterPalette {
  /** Accents darkened enough to read as text on paper. */
  aInk: string;
  /** Main and second accent, possibly swapped per adventure so neighbours do not look alike. */
  a: string;
  b: string;
  ink: string;
  /** Near-white paper and a warm cream. */
  paper: string;
  cream: string;
  /** Soft pastel tints of the two accents. */
  pa: string;
  pb: string;
  /** Strong dark for ink-stamps and bars. */
  deep: string;
  onA: string;
  onB: string;
}

// ---------------------------------------------------------------- prepared inputs

export interface FilterItem {
  kind: "title" | "explainer" | "chip" | "stamp" | "brand" | "seal" | "deco";
  rect: Slot;
}

export interface FilterSpec {
  family: KeepsakeFamily;
  theme: string;
  title: string;
  explainer: string;
  dogName: string;
  date?: string | undefined;
  /** Optional "stamp earned" mini badge, e.g. "Cozy Companion". */
  stamp?: string | undefined;
  size: SizeId;
  /** Which look; derived from the theme when omitted. */
  style?: string | undefined;
}

export interface FilterPrep {
  W: number;
  H: number;
  size: SizeId;
  story: boolean;
  t: ThemeConfig;
  p: FilterPalette;
  seed: number;
  flip: boolean;
  title: string;
  explainer: string;
  name: string;
  date: string;
  stamp: string;
  /** Overlay content stays between these y values (story keeps clear of phone chrome). */
  top: number;
  bottom: number;
  /** Side margin for overlays. */
  m: number;
  items: FilterItem[];
}

export const FILTER_W = 1080;
export const TITLE_MAX = 40;
export const EXPLAINER_MAX = 64;

export function prepareFilter(spec: FilterSpec): FilterPrep {
  const size: SizeId = spec.size in ART_SIZES ? spec.size : "square";
  const H = ART_SIZES[size].height;
  const story = size === "story";
  const t = themeFor(spec.family, spec.theme);
  const seed = hash(t.id);
  const swap = ((seed >>> 3) & 1) === 1;
  const A = vivid(swap ? t.palette.accent2 : t.palette.accent);
  const B = vivid(swap ? t.palette.accent : t.palette.accent2);
  const ink = isDark(t.palette.ink) ? t.palette.ink : "#22202b";
  const p: FilterPalette = {
    aInk: mix(A, "#000000", 0.38),
    a: A,
    b: B,
    ink,
    paper: mix(t.palette.card, "#ffffff", 0.7),
    cream: mix(t.palette.bg, "#fff8ea", 0.65),
    pa: mix(A, "#ffffff", 0.72),
    pb: mix(B, "#ffffff", 0.72),
    deep: isDark(ink) ? ink : mix(ink, "#000000", 0.6),
    onA: readable(A, "#ffffff", "#1d1b24"),
    onB: readable(B, "#ffffff", "#1d1b24"),
  };
  const title =
    cleanText(spec.title, TITLE_MAX) || cleanText(t.label, TITLE_MAX) || "Our adventure";
  return {
    W: FILTER_W,
    H,
    size,
    story,
    t,
    p,
    seed,
    flip: (seed & 1) === 1,
    title,
    explainer: cleanText(spec.explainer, EXPLAINER_MAX),
    name: cleanText(spec.dogName, 40) || "Your Dog",
    date: cleanText(spec.date, 32),
    stamp: cleanText(spec.stamp, 28),
    top: story ? 190 : 48,
    bottom: H - (story ? 250 : 48),
    m: 44,
    items: [],
  };
}

export function note(f: FilterPrep, kind: FilterItem["kind"], rect: Slot): Slot {
  f.items.push({ kind, rect });
  return rect;
}

// ---------------------------------------------------------------- shapes drawn with paths

/** Four-point sparkle with curved sides. */
export function sparkle(ctx: Ctx, cx: number, cy: number, r: number, fill: string): void {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + r * 0.12, cy - r * 0.12, cx + r, cy);
  ctx.quadraticCurveTo(cx + r * 0.12, cy + r * 0.12, cx, cy + r);
  ctx.quadraticCurveTo(cx - r * 0.12, cy + r * 0.12, cx - r, cy);
  ctx.quadraticCurveTo(cx - r * 0.12, cy - r * 0.12, cx, cy - r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function heart(ctx: Ctx, cx: number, cy: number, s: number, fill: string): void {
  const w = s;
  ctx.beginPath();
  ctx.moveTo(cx, cy + w * 0.9);
  ctx.bezierCurveTo(cx - w * 1.5, cy - w * 0.1, cx - w * 0.7, cy - w * 1.1, cx, cy - w * 0.35);
  ctx.bezierCurveTo(cx + w * 0.7, cy - w * 1.1, cx + w * 1.5, cy - w * 0.1, cx, cy + w * 0.9);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function star(ctx: Ctx, cx: number, cy: number, r: number, fill: string): void {
  starPath(ctx, cx, cy, r, 5, 0.46);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function paw(ctx: Ctx, cx: number, cy: number, s: number, fill: string): void {
  drawPaw(ctx, cx, cy, s, fill);
}

/** Sparkles, hearts, stars and paws scattered over a region, deterministic for a seed. */
export function confetti(
  ctx: Ctx,
  area: Slot,
  seed: number,
  count: number,
  colors: string[],
  size: number,
  avoid?: Slot,
): void {
  for (let i = 0; i < count; i++) {
    const x = area.x + rnd(seed + i * 7 + 1) * area.w;
    const y = area.y + rnd(seed + i * 13 + 5) * area.h;
    if (avoid && x > avoid.x && x < avoid.x + avoid.w && y > avoid.y && y < avoid.y + avoid.h)
      continue;
    const c = colors[i % colors.length] ?? "#ffffff";
    const r = size * (0.55 + rnd(seed + i * 3 + 2) * 0.7);
    const kind = i % 4;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rnd(seed + i) - 0.5) * 0.9);
    if (kind === 0) sparkle(ctx, 0, 0, r * 1.2, c);
    else if (kind === 1) heart(ctx, 0, 0, r * 0.7, c);
    else if (kind === 2) star(ctx, 0, 0, r * 0.8, c);
    else paw(ctx, 0, 0, r * 1.1, c);
    ctx.restore();
  }
}

/** A wobbly hand-drawn underline. */
export function squiggle(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  color: string,
  lw = 5,
  amp = 5,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  const n = Math.max(2, Math.round(w / 26));
  for (let i = 0; i < n; i++) {
    const x0 = x + (w * i) / n;
    const x1 = x + (w * (i + 1)) / n;
    ctx.quadraticCurveTo((x0 + x1) / 2, y + (i % 2 ? amp : -amp) * 1.6, x1, y);
  }
  ctx.stroke();
  ctx.restore();
}

/** Translucent washi tape with torn ends, centred on (cx, cy). */
export function tape(
  ctx: Ctx,
  cx: number,
  cy: number,
  w: number,
  h: number,
  rot: number,
  color: string,
  stripe?: string,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.globalAlpha = 0.86;
  ctx.fillStyle = color;
  ctx.beginPath();
  const z = 5;
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(w / 2, -h / 2);
  for (let i = 0; i <= h; i += z * 2) {
    ctx.lineTo(w / 2 + (i % (z * 4) ? 4 : 0), -h / 2 + i);
  }
  ctx.lineTo(w / 2, h / 2);
  ctx.lineTo(-w / 2, h / 2);
  for (let i = h; i >= 0; i -= z * 2) {
    ctx.lineTo(-w / 2 - (i % (z * 4) ? 4 : 0), -h / 2 + i);
  }
  ctx.closePath();
  ctx.fill();
  if (stripe) {
    ctx.fillStyle = stripe;
    ctx.globalAlpha = 0.45;
    for (let x = -w / 2 + 10; x < w / 2 - 6; x += 22) ctx.fillRect(x, -h / 2, 8, h);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- plates (sticker shapes)

export type Shape =
  "none" | "pill" | "round" | "rect" | "burst" | "bubble" | "ticket" | "tag" | "cloud" | "paper";

function burstPath(ctx: Ctx, rx: number, ry: number, n = 16): void {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = (i * Math.PI) / n;
    const k = i % 2 ? 0.84 : 1;
    const x = Math.cos(a) * rx * k;
    const y = Math.sin(a) * ry * k;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function cloudPath(ctx: Ctx, w: number, h: number): void {
  const r = Math.min(h / 2, 34);
  ctx.beginPath();
  const n = Math.max(4, Math.round(w / (r * 1.6)));
  const step = (w - r * 2) / n;
  // bumpy top and bottom edges as little arcs
  ctx.moveTo(-w / 2 + r, -h / 2);
  for (let i = 0; i < n; i++)
    ctx.arc(-w / 2 + r + step * (i + 0.5), -h / 2, step / 2, Math.PI, 0, false);
  ctx.arc(w / 2 - r, 0, h / 2, -Math.PI / 2, Math.PI / 2, false);
  for (let i = n - 1; i >= 0; i--)
    ctx.arc(-w / 2 + r + step * (i + 0.5), h / 2, step / 2, 0, Math.PI, false);
  ctx.arc(-w / 2 + r, 0, h / 2, Math.PI / 2, (Math.PI * 3) / 2, false);
  ctx.closePath();
}

function platePath(ctx: Ctx, shape: Shape, w: number, h: number): void {
  const x = -w / 2;
  const y = -h / 2;
  if (shape === "pill") roundRectPath(ctx, x, y, w, h, h / 2);
  else if (shape === "round") roundRectPath(ctx, x, y, w, h, Math.min(34, h / 2));
  else if (shape === "rect" || shape === "paper") roundRectPath(ctx, x, y, w, h, 6);
  else if (shape === "burst") burstPath(ctx, w / 2, h / 2, Math.max(10, Math.round(w / 40)));
  else if (shape === "cloud") cloudPath(ctx, w, h);
  else if (shape === "bubble") roundRectPath(ctx, x, y, w, h, Math.min(40, h / 2));
  else if (shape === "ticket" || shape === "tag") {
    const n = shape === "ticket" ? 18 : 0;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    if (n) {
      ctx.lineTo(x + w, y + h / 2 - n);
      ctx.arc(x + w, y + h / 2, n, -Math.PI / 2, Math.PI / 2, true);
    }
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    if (n) {
      ctx.lineTo(x, y + h / 2 + n);
      ctx.arc(x, y + h / 2, n, Math.PI / 2, -Math.PI / 2, true);
    }
    ctx.closePath();
  } else ctx.rect(x, y, w, h);
}

export interface PlateStyle {
  shape: Shape;
  fill?: string | undefined;
  /** Die-cut sticker outline colour and thickness. */
  outline?: string | undefined;
  outlineW?: number | undefined;
  /** Thin inner border. */
  border?: string | undefined;
  shadow?: boolean | undefined;
}

/** Draws a plate centred on the origin. */
export function drawPlate(ctx: Ctx, w: number, h: number, s: PlateStyle): void {
  if (s.shape === "none") return;
  ctx.save();
  platePath(ctx, s.shape, w, h);
  if (s.shadow !== false) {
    ctx.shadowColor = "rgba(20,16,30,0.28)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
  }
  if (s.outline) {
    ctx.lineJoin = "round";
    ctx.lineWidth = (s.outlineW ?? 8) * 2;
    ctx.strokeStyle = s.outline;
    ctx.stroke();
  }
  ctx.fillStyle = s.fill ?? "#ffffff";
  ctx.fill();
  ctx.restore();
  if (s.border) {
    ctx.save();
    platePath(ctx, s.shape, w - 10, h - 10);
    ctx.strokeStyle = s.border;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([9, 7]);
    ctx.stroke();
    ctx.restore();
  }
}

// ---------------------------------------------------------------- labels: fitted text in a plate

export interface Row {
  text: string;
  font: FontFn;
  size: number;
  min?: number;
  color: string;
  /** Wrap this row over up to this many lines (default 1). */
  lines?: number;
  lh?: number;
  upper?: boolean;
}

export interface LabelOpts extends PlateStyle {
  kind: FilterItem["kind"];
  rows: Row[];
  x: number;
  y: number;
  maxW: number;
  align?: "left" | "center" | "right";
  textAlign?: "left" | "center" | undefined;
  padX?: number;
  padY?: number;
  rot?: number;
  /** Fill the whole maxW rather than hugging the text. */
  wide?: boolean;
  /** Text stroke for plateless text over a photo. */
  textOutline?: string | undefined;
  /** Extra room on the left and a drawing for it (centre, in plate-local coordinates). */
  lead?: number;
  leadDraw?: (ctx: Ctx, cx: number, cy: number) => void;
  /** Bubble tail: horizontal offset of its tip from the plate centre, and its height. */
  tailDX?: number;
  tailH?: number;
  /** Draw nothing, only measure. */
  measureOnly?: boolean;
  /** Extra decoration in plate-local coordinates, drawn after the plate and before the text. */
  deco?: (ctx: Ctx, w: number, h: number) => void;
  /** Register the same box under more kinds (a combined title and explainer card). */
  alsoKinds?: FilterItem["kind"][];
}

interface Laid {
  text: string;
  size: number;
  font: string;
  color: string;
  lh: number;
}

function widest(ctx: Ctx, laid: Laid[]): number {
  let w = 0;
  for (const l of laid) {
    ctx.font = l.font;
    w = Math.max(w, ctx.measureText(l.text).width);
  }
  return w;
}

function layRow(ctx: Ctx, r: Row, maxW: number): Laid[] {
  const raw = r.upper ? r.text.toUpperCase() : r.text;
  if (!raw) return [];
  const min = r.min ?? Math.max(12, Math.round(r.size * 0.55));
  // Shrink until the longest word fits so words are never broken mid-way.
  const words = raw.split(" ").filter(Boolean);
  let size = r.size;
  while (size > min) {
    ctx.font = r.font(size);
    if (words.every((w) => ctx.measureText(w).width <= maxW)) break;
    size -= 2;
  }
  const fit = fitText(ctx, raw, {
    maxWidth: maxW,
    maxLines: r.lines ?? 1,
    size,
    minSize: min,
    font: r.font,
  });
  const lh = fit.size * (r.lh ?? 1.18);
  return fit.lines.map((text) => ({
    text,
    size: fit.size,
    font: r.font(fit.size),
    color: r.color,
    lh,
  }));
}

function bboxOf(cx: number, cy: number, w: number, h: number, rot: number): Slot {
  const c = Math.abs(Math.cos(rot));
  const s = Math.abs(Math.sin(rot));
  const bw = w * c + h * s;
  const bh = w * s + h * c;
  return { x: cx - bw / 2, y: cy - bh / 2, w: bw, h: bh };
}

/** Lays text into a plate, draws it, registers it on the prep and returns its (rotated) bounding box. */
export function label(ctx: Ctx, f: FilterPrep, o: LabelOpts): Slot {
  const shape = o.shape;
  const burst = shape === "burst";
  const padX = (o.padX ?? 22) * (burst ? 1.4 : 1);
  const padY = (o.padY ?? 14) * (burst ? 1.8 : 1);
  // text sits in a rectangle inside the spiky ellipse, so the plate is wider and taller than the text
  const bx = burst ? 1.42 : 1;
  const by = burst ? 1.5 : 1;
  const lead = o.lead ?? 0;
  const innerMax = Math.max(40, (o.maxW - padX * 2 - lead) / bx);
  const laid = o.rows.flatMap((r) => layRow(ctx, r, innerMax));
  const textW = widest(ctx, laid);
  const textH = laid.reduce((a, l) => a + l.lh, 0);
  const w = Math.min(o.maxW, o.wide ? o.maxW : textW * bx + padX * 2 + lead);
  const body = textH * by + padY * 2 + (laid[0] ? laid[0].size * 0.12 : 0);
  const h = Math.max(body, shape === "pill" ? 52 : 40);
  const tail = shape === "bubble" ? (o.tailH ?? 0) : 0;
  const align = o.align ?? "left";
  const left = align === "left" ? o.x : align === "right" ? o.x - w : o.x - w / 2;
  const cx = left + w / 2;
  const cy = o.y + h / 2;
  const rot = o.rot ?? 0;
  const box = bboxOf(cx, cy, w, h, rot);
  if (tail) box.h += tail;
  if (!o.measureOnly) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    if (shape === "bubble" && tail > 0) {
      // tail first so the plate covers its root
      const tx = o.tailDX ?? 0;
      const root = Math.max(-w / 2 + 50, Math.min(w / 2 - 50, tx * 0.6));
      ctx.save();
      ctx.shadowColor = "rgba(20,16,30,0.28)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 5;
      ctx.beginPath();
      ctx.moveTo(root - 26, h / 2 - 6);
      ctx.quadraticCurveTo(root + 4, h / 2 + tail * 0.6, tx, h / 2 + tail);
      ctx.quadraticCurveTo(root + 8, h / 2 + tail * 0.3, root + 30, h / 2 - 6);
      ctx.closePath();
      if (o.outline) {
        ctx.lineWidth = (o.outlineW ?? 8) * 2;
        ctx.strokeStyle = o.outline;
        ctx.lineJoin = "round";
        ctx.stroke();
      }
      ctx.fillStyle = o.fill ?? "#ffffff";
      ctx.fill();
      ctx.restore();
    }
    drawPlate(ctx, w, h, o);
    if (o.deco) o.deco(ctx, w, h);
    if (shape === "bubble" && tail > 0) {
      // cover the tail root with plain fill so the join is seamless
      const tx = o.tailDX ?? 0;
      const root = Math.max(-w / 2 + 50, Math.min(w / 2 - 50, tx * 0.6));
      ctx.fillStyle = o.fill ?? "#ffffff";
      ctx.fillRect(root - 22, h / 2 - 12, 48, 14);
    }
    if (o.leadDraw) o.leadDraw(ctx, -w / 2 + padX + lead / 2, 0);
    ctx.textBaseline = "alphabetic";
    const centred = (o.textAlign ?? "center") === "center";
    const textLeft = -w / 2 + padX + lead;
    const textCx = textLeft + (w - padX * 2 - lead) / 2;
    ctx.textAlign = centred ? "center" : "left";
    let yy = -textH / 2;
    for (const l of laid) {
      ctx.font = l.font;
      const baseline = yy + l.lh / 2 + l.size * 0.34;
      const tx = centred ? textCx : textLeft;
      if (o.textOutline) {
        ctx.lineJoin = "round";
        ctx.lineWidth = Math.max(4, l.size * 0.22);
        ctx.strokeStyle = o.textOutline;
        ctx.strokeText(l.text, tx, baseline);
      }
      ctx.fillStyle = l.color;
      ctx.fillText(l.text, tx, baseline);
      yy += l.lh;
    }
    ctx.restore();
    for (const k of o.alsoKinds ?? []) note(f, k, box);
    note(f, o.kind, box);
  }
  return box;
}

/** Draws a label so that its bottom edge (including a bubble tail) sits at `bottom`. */
export function labelUp(ctx: Ctx, f: FilterPrep, o: LabelOpts, bottom: number): Slot {
  const m = label(ctx, f, { ...o, measureOnly: true });
  return label(ctx, f, { ...o, y: bottom - m.h });
}

// ---------------------------------------------------------------- the Paws & Passage mark

export const BRAND_NAME = "Paws & Passage";
export const BRAND_URL = "pawsandpassage.com";

export function sealSize(f: FilterPrep): number {
  return Math.round(f.W * 0.037);
}

/** A round paw-stamp seal. Drawn at the origin of the current transform. */
export function pawSeal(ctx: Ctx, cx: number, cy: number, d: number, f: FilterPrep): void {
  const r = d / 2;
  ctx.save();
  circle(ctx, cx, cy, r);
  ctx.fillStyle = f.p.a;
  ctx.fill();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = alpha(f.p.onA, 0.85);
  ctx.lineWidth = 2;
  circle(ctx, cx, cy, r - 5);
  ctx.stroke();
  ctx.setLineDash([]);
  paw(ctx, cx, cy - r * 0.04, r * 0.82, f.p.onA);
  ctx.restore();
}

/**
 * The only brand on the picture: a small paw-stamp seal (about 3.7 percent of the width) with the name and a tiny
 * address beside it, on a soft low-contrast plate. Anchored by its left or right edge.
 */
export function brandMark(
  ctx: Ctx,
  f: FilterPrep,
  x: number,
  y: number,
  align: "left" | "right",
  tone: "light" | "dark" = "light",
): Slot {
  const d = sealSize(f);
  const nameSize = 15;
  const urlSize = 12;
  ctx.font = fRound(nameSize);
  const w1 = ctx.measureText(BRAND_NAME).width;
  ctx.font = fRoundReg(urlSize);
  const w2 = ctx.measureText(BRAND_URL).width;
  const textW = Math.max(w1, w2);
  const padL = 5;
  const gap = 7;
  const padR = 12;
  const w = padL + d + gap + textW + padR;
  const h = d + 8;
  const left = align === "left" ? x : x - w;
  const bg = tone === "light" ? "rgba(255,255,255,0.66)" : "rgba(28,24,36,0.5)";
  const fg = tone === "light" ? alpha(f.p.deep, 0.9) : "#ffffff";
  ctx.save();
  roundRectPath(ctx, left, y, w, h, h / 2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.restore();
  pawSeal(ctx, left + padL + d / 2, y + h / 2, d, f);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = fRound(nameSize);
  ctx.fillStyle = fg;
  ctx.fillText(BRAND_NAME, left + padL + d + gap, y + h / 2 - 1);
  ctx.font = fRoundReg(urlSize);
  ctx.fillStyle = tone === "light" ? alpha(f.p.deep, 0.7) : "rgba(255,255,255,0.8)";
  ctx.fillText(BRAND_URL, left + padL + d + gap, y + h / 2 + urlSize);
  note(f, "seal", { x: left + padL, y: y + (h - d) / 2, w: d, h: d });
  return note(f, "brand", { x: left, y, w, h });
}

/** The optional "stamp earned" mini badge: one small pill. Null when the adventure has no stamp. */
export function stampBadge(
  ctx: Ctx,
  f: FilterPrep,
  x: number,
  y: number,
  align: "left" | "right" | "center",
  opts: { maxW?: number; bottom?: number } = {},
): Slot | null {
  if (!f.stamp) return null;
  const o: LabelOpts = {
    kind: "stamp",
    shape: "pill",
    fill: alpha(f.p.deep, 0.62),
    shadow: false,
    rows: [{ text: f.stamp, font: fRoundReg, size: 18, min: 12, color: "#ffffff" }],
    x,
    y,
    maxW: opts.maxW ?? 240,
    align,
    padX: 12,
    padY: 6,
    lead: 22,
    leadDraw: (c, cx, cy) => star(c, cx, cy, 9, f.p.pa),
  };
  return opts.bottom !== undefined ? labelUp(ctx, f, o, opts.bottom) : label(ctx, f, o);
}

// ---------------------------------------------------------------- the photo and its placeholder

/** A cute dog face on a pastel sunburst, used when there is no photo yet. */
export function drawFilterPlaceholder(ctx: Ctx, f: FilterPrep, r: Slot): void {
  const { p } = f;
  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.w, r.h);
  ctx.clip();
  const g = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
  g.addColorStop(0, p.pa);
  g.addColorStop(1, p.pb);
  ctx.fillStyle = g;
  ctx.fillRect(r.x, r.y, r.w, r.h);
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h * 0.5;
  const m = Math.min(r.w, r.h);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  const n = 18;
  for (let i = 0; i < n; i += 2) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a0) * m * 1.6, cy + Math.sin(a0) * m * 1.6);
    ctx.lineTo(cx + Math.cos(a1) * m * 1.6, cy + Math.sin(a1) * m * 1.6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  confetti(ctx, r, f.seed % 997, 16, ["#ffffff", p.a, p.b, mix(p.a, "#ffffff", 0.4)], m * 0.04, {
    x: cx - m * 0.3,
    y: cy - m * 0.3,
    w: m * 0.6,
    h: m * 0.6,
  });
  const s = m * 0.27;
  // ears
  ctx.fillStyle = "#b9824f";
  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.translate(cx + dir * s * 0.92, cy - s * 0.55);
    ctx.rotate(dir * 0.35);
    ctx.beginPath();
    ctx.ellipse(0, s * 0.35, s * 0.34, s * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // bandana
  ctx.fillStyle = p.a;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.85, cy + s * 0.65);
  ctx.lineTo(cx + s * 0.85, cy + s * 0.65);
  ctx.lineTo(cx, cy + s * 1.55);
  ctx.closePath();
  ctx.fill();
  // head
  circle(ctx, cx, cy, s);
  ctx.fillStyle = "#f4d4a6";
  ctx.fill();
  // muzzle
  ctx.beginPath();
  ctx.ellipse(cx, cy + s * 0.32, s * 0.5, s * 0.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#fff3de";
  ctx.fill();
  // cheeks, eyes, nose, tongue
  ctx.fillStyle = "rgba(255,120,140,0.35)";
  for (const dir of [-1, 1]) {
    circle(ctx, cx + dir * s * 0.62, cy + s * 0.28, s * 0.14);
    ctx.fill();
  }
  ctx.fillStyle = "#2a2230";
  for (const dir of [-1, 1]) {
    circle(ctx, cx + dir * s * 0.36, cy - s * 0.12, s * 0.12);
    ctx.fill();
    circle(ctx, cx + dir * s * 0.33, cy - s * 0.16, s * 0.04);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.fillStyle = "#2a2230";
  }
  ctx.beginPath();
  ctx.ellipse(cx, cy + s * 0.14, s * 0.16, s * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ff8fa3";
  ctx.beginPath();
  ctx.ellipse(cx, cy + s * 0.7, s * 0.14, s * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2a2230";
  ctx.lineWidth = Math.max(3, s * 0.035);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.24);
  ctx.lineTo(cx, cy + s * 0.46);
  ctx.moveTo(cx - s * 0.22, cy + s * 0.5);
  ctx.quadraticCurveTo(cx - s * 0.04, cy + s * 0.58, cx, cy + s * 0.46);
  ctx.quadraticCurveTo(cx + s * 0.04, cy + s * 0.58, cx + s * 0.22, cy + s * 0.5);
  ctx.stroke();
  ctx.restore();
}

/** Draws the person's photo cover-fit in a rectangle, or the placeholder illustration. */
export function drawFilterPhoto(
  ctx: Ctx,
  f: FilterPrep,
  photo: PlacedPhoto | null | undefined,
  r: Slot,
): void {
  if (photo && drawPlacedPhoto(ctx, photo, r.x, r.y, r.w, r.h)) return;
  drawFilterPlaceholder(ctx, f, r);
}

// ---------------------------------------------------------------- tiny helpers for looks

export function rectsOverlap(a: Slot, b: Slot): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

export const FULL = (f: FilterPrep): Slot => ({ x: 0, y: 0, w: f.W, h: f.H });

export function frameBorder(ctx: Ctx, w: number, h: number, thick: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, thick);
  ctx.fillRect(0, h - thick, w, thick);
  ctx.fillRect(0, thick, thick, h - thick * 2);
  ctx.fillRect(w - thick, thick, thick, h - thick * 2);
}

/** Letters along an arc (used by the visa stamp). Angles in radians, text centred on `mid`. */
export function arcText(
  ctx: Ctx,
  text: string,
  cx: number,
  cy: number,
  r: number,
  mid: number,
  inward = false,
): void {
  const chars = Array.from(text);
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0);
  let a = mid - (inward ? -1 : 1) * (total / r / 2);
  ctx.textAlign = "center";
  chars.forEach((c, i) => {
    const w = widths[i] ?? 0;
    const step = w / r;
    const ang = a + (inward ? -1 : 1) * (step / 2);
    ctx.save();
    ctx.translate(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
    ctx.rotate(ang + (inward ? -Math.PI / 2 : Math.PI / 2));
    ctx.fillText(c, 0, 0);
    ctx.restore();
    a += (inward ? -1 : 1) * step;
  });
}
