import type { Palette } from "./themes";

/**
 * Everyday Magic swatches. Every keepsake palette is snapped onto these so the artwork matches the site
 * while each theme keeps its own light/dark structure.
 */
export const EVERYDAY_SWATCHES = [
  "#fffdf7", // card
  "#fbf3df", // vanilla paper
  "#f3e6c8", // warm paper
  "#f6dc8a", // butter light
  "#f2c94c", // butter
  "#f4c9c4", // blush
  "#e86a5f", // coral
  "#c8343f", // cherry
  "#8f2530", // deep cherry
  "#cfe0c9", // sage light
  "#9bb39a", // sage
  "#4f8a4b", // leaf
  "#2f5a3a", // deep leaf
  "#d7e6f2", // powder light
  "#a9c7de", // powder blue
  "#4f7da1", // denim
  "#b07a52", // biscuit
  "#7a4a32", // cocoa
  "#6b6559", // muted
  "#43352e", // warm ink
  "#2b211c", // deep ink
] as const;

function rgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m || !m[1]) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function dist(a: [number, number, number], b: [number, number, number]): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  const rm = (a[0] + b[0]) / 2;
  return (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db;
}

function lum(c: [number, number, number]): number {
  const f = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
}

function contrast(a: string, b: string): number {
  const x = rgb(a);
  const y = rgb(b);
  if (!x || !y) return 21;
  const l1 = lum(x);
  const l2 = lum(y);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Swatches ordered nearest first; non-hex values (gradients, rgba) pass through alone. */
function ranked(hex: string): string[] {
  const c = rgb(hex);
  if (!c) return [hex];
  return [...EVERYDAY_SWATCHES].sort((a, b) => dist(c, rgb(a)!) - dist(c, rgb(b)!));
}

/** Nearest swatch that keeps at least the original contrast against `ground` (capped at `need`). */
function snapAgainst(hex: string, ground: string, need: number, avoid?: string): string {
  const want = Math.min(need, contrast(hex, ground) || need);
  const list = ranked(hex);
  return list.find((s) => s !== avoid && contrast(s, ground) >= want) ?? list[0]!;
}

export function snapColor(hex: string): string {
  return ranked(hex)[0]!;
}

/**
 * Snaps a palette onto the swatches. Text colours keep the readability the original palette had
 * against its background; `taken` lists bg|accent pairs already used by sibling themes so each stays distinct.
 */
export function toEveryday(p: Palette, taken: Set<string> = new Set()): Palette {
  const need = Math.min(3, contrast(p.accent, p.bg));
  let bg = snapColor(p.bg);
  let accent = snapAgainst(p.accent, bg, 3);
  search: for (const g of ranked(p.bg).slice(0, 4)) {
    for (const s of ranked(p.accent)) {
      if (taken.has(`${g}|${s}`) || contrast(s, g) < need) continue;
      if (g === bg && s === accent) break search;
      if (!taken.has(`${bg}|${accent}`)) break search;
      bg = g;
      accent = s;
      break search;
    }
  }
  taken.add(`${bg}|${accent}`);
  return {
    bg,
    bg2: snapColor(p.bg2),
    ink: snapAgainst(p.ink, bg, 4.5),
    accent,
    accent2: snapColor(p.accent2),
    muted: snapAgainst(p.muted, bg, 4.5),
    onAccent: snapAgainst(p.onAccent, accent, 4.5),
    card: snapColor(p.card),
  };
}
