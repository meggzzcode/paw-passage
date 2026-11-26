// Keepsake renderer. Pure drawing functions over a CanvasRenderingContext2D so tests can pass a fake.
// Privacy: everything happens on the device. Nothing in this folder talks to a server.

export type KeepsakeTemplate = "postcard" | "certificate" | "milestone-card";

export interface KeepsakeSpec {
  template: KeepsakeTemplate;
  dogName: string;
  /** Adventure title, certificate achievement, or milestone title. */
  title: string;
  date?: string;
  /** Postcard memory (cut to 140 characters). Milestone cards show it small, if given. */
  memory?: string;
  /** Milestone card only: "square" (1080x1080, default) or "story" (1080x1920). */
  variant?: "square" | "story";
  /** Certificate only. */
  certificateKind?: "explorer" | "toy-champion";
  /** Milestone card only. */
  stampCount?: number;
  stampSlugs?: string[];
}

import { loadPhotoFile, sourceSize, type PhotoSource } from "./photo";
export { loadPhotoFile };
export type { PhotoSource };
export interface KeepsakeAssets {
  photo?: PhotoSource | null | undefined;
}

export const FOOTER_TEXT = "pawsandpassage.com";
export const MEMORY_MAX = 140;

export const SERIF = 'Georgia, "Times New Roman", serif';
const PAPER = "#f6efe0";
const INK = "#2b3a4a";
const RED = "#b4412f";
const GOLD = "#a9822c";
const MUTED = "#6b6559";

export function keepsakeSize(spec: Pick<KeepsakeSpec, "template" | "variant">): {
  width: number;
  height: number;
} {
  if (spec.template === "postcard") return { width: 1500, height: 1000 };
  if (spec.template === "certificate") return { width: 1080, height: 1350 };
  return { width: 1080, height: spec.variant === "story" ? 1920 : 1080 };
}

/** Removes emoji, control characters and odd spacing so a font without them never draws boxes. */
export function cleanText(input: unknown, maxChars = 400): string {
  if (typeof input !== "string") return "";
  const t = input
    .replace(
      /\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Modifier}|\u200d|\ufe0f/gu,
      "",
    )
    .replace(/\p{Cc}+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  return Array.from(t).slice(0, maxChars).join("");
}

export type Ctx = CanvasRenderingContext2D;

function width(ctx: Ctx, s: string): number {
  return ctx.measureText(s).width;
}

/** Greedy word wrap; a single word wider than the line is broken by characters. */
export function wrapText(ctx: Ctx, text: string, maxWidth: number): string[] {
  const words = text.split(" ").filter(Boolean);
  const lines: string[] = [];
  let line = "";
  const push = () => {
    if (line) lines.push(line);
    line = "";
  };
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (width(ctx, trial) <= maxWidth) {
      line = trial;
      continue;
    }
    push();
    if (width(ctx, word) <= maxWidth) {
      line = word;
      continue;
    }
    let chunk = "";
    for (const ch of Array.from(word)) {
      if (width(ctx, chunk + ch) > maxWidth && chunk) {
        lines.push(chunk);
        chunk = ch;
      } else chunk += ch;
    }
    line = chunk;
  }
  push();
  return lines;
}

function ellipsize(ctx: Ctx, s: string, maxWidth: number): string {
  let chars = Array.from(s);
  while (chars.length > 0 && width(ctx, chars.join("") + "…") > maxWidth)
    chars = chars.slice(0, -1);
  return chars.join("") + "…";
}

export interface FitOptions {
  maxWidth: number;
  maxLines: number;
  size: number;
  minSize: number;
  font: (size: number) => string;
}

/** Shrinks the font until the text fits in maxLines; at the minimum size it truncates with an ellipsis. */
export function fitText(ctx: Ctx, text: string, o: FitOptions): { size: number; lines: string[] } {
  let size = o.size;
  for (;;) {
    ctx.font = o.font(size);
    const lines = wrapText(ctx, text, o.maxWidth);
    if (lines.length <= o.maxLines) return { size, lines };
    if (size <= o.minSize) {
      const kept = lines.slice(0, o.maxLines);
      kept[o.maxLines - 1] = ellipsize(
        ctx,
        kept[o.maxLines - 1] + " " + lines.slice(o.maxLines).join(" "),
        o.maxWidth,
      );
      return { size, lines: kept };
    }
    size = Math.max(o.minSize, size - 2);
  }
}

export interface BlockStyle extends Omit<FitOptions, "font"> {
  font: (size: number) => string;
  color: string;
  align: CanvasTextAlign;
  lineHeight?: number;
}

/** Draws fitted, wrapped text starting at y (top). Returns the y just below the block. */
export function drawBlock(ctx: Ctx, text: string, x: number, y: number, s: BlockStyle): number {
  const { size, lines } = fitText(ctx, text, s);
  const lh = size * (s.lineHeight ?? 1.25);
  ctx.font = s.font(size);
  ctx.fillStyle = s.color;
  ctx.textAlign = s.align;
  ctx.textBaseline = "alphabetic";
  lines.forEach((l, i) => ctx.fillText(l, x, y + size + i * lh));
  return y + lines.length * lh + size * 0.2;
}

function footer(ctx: Ctx, w: number, h: number, color = MUTED): void {
  ctx.font = `italic 400 22px ${SERIF}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(FOOTER_TEXT, w / 2, h - 78);
}

function paper(ctx: Ctx, w: number, h: number): void {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  // faint fibre flecks, deterministic so renders are repeatable
  ctx.fillStyle = "rgba(120,100,60,0.05)";
  for (let i = 0; i < 90; i++) {
    const x = (i * 7919) % w;
    const y = (i * 104729) % h;
    ctx.fillRect(x, y, 2 + (i % 4), 1);
  }
}

export function circle(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

export function drawPaw(ctx: Ctx, cx: number, cy: number, s: number, color: string): void {
  ctx.fillStyle = color;
  circle(ctx, cx, cy + s * 0.28, s * 0.36);
  ctx.fill();
  const toes: Array<[number, number, number]> = [
    [-0.55, -0.12, 0.15],
    [-0.2, -0.5, 0.17],
    [0.2, -0.5, 0.17],
    [0.55, -0.12, 0.15],
  ];
  for (const [dx, dy, r] of toes) {
    circle(ctx, cx + dx * s * 0.8, cy + dy * s * 0.8, r * s);
    ctx.fill();
  }
}

/** Perforated paper rectangle: white card with paper-coloured holes along the edge. */
export function perforatedRect(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  bg: string,
): void {
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = bg;
  const nx = Math.max(2, Math.round(w / (r * 2.6)));
  const ny = Math.max(2, Math.round(h / (r * 2.6)));
  for (let i = 0; i <= nx; i++) {
    const px = x + (w * i) / nx;
    circle(ctx, px, y, r);
    ctx.fill();
    circle(ctx, px, y + h, r);
    ctx.fill();
  }
  for (let j = 0; j <= ny; j++) {
    const py = y + (h * j) / ny;
    circle(ctx, x, py, r);
    ctx.fill();
    circle(ctx, x + w, py, r);
    ctx.fill();
  }
}

export function postmark(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  label: string,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.78;
  circle(ctx, cx, cy, r);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  circle(ctx, cx, cy, r - 9);
  ctx.stroke();
  ctx.font = `700 ${Math.round(r * 0.26)}px ${SERIF}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const { lines } = fitText(ctx, label, {
    maxWidth: r * 1.35,
    maxLines: 1,
    size: Math.round(r * 0.26),
    minSize: 9,
    font: (s) => `700 ${s}px ${SERIF}`,
  });
  ctx.fillText(lines[0] ?? "", cx, cy + r * 0.1);
  ctx.font = `700 ${Math.round(r * 0.17)}px ${SERIF}`;
  ctx.fillText("PAW & PASSAGE", cx, cy - r * 0.35 + 4);
  // wavy cancellation bars leaving the ring
  ctx.lineWidth = 3;
  for (let k = 0; k < 4; k++) {
    const y = cy - r * 0.6 + k * r * 0.4;
    ctx.beginPath();
    ctx.moveTo(cx + r + 6, y);
    for (let s = 1; s <= 6; s++)
      ctx.quadraticCurveTo(cx + r + 6 + s * 18 - 9, y + (s % 2 ? -7 : 7), cx + r + 6 + s * 18, y);
    ctx.stroke();
  }
  ctx.restore();
}

function imgSize(p: PhotoSource): { w: number; h: number } {
  return sourceSize(p);
}

/** Source rectangle that fills dst with no distortion (cover fit), centred. */
export function coverRect(sw: number, sh: number, dw: number, dh: number) {
  const scale = Math.max(dw / sw, dh / sh);
  const cw = dw / scale;
  const ch = dh / scale;
  return { sx: (sw - cw) / 2, sy: (sh - ch) / 2, sw: cw, sh: ch };
}

function drawPhotoCover(
  ctx: Ctx,
  photo: PhotoSource,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  const { w: sw, h: sh } = imgSize(photo);
  if (!(sw > 0 && sh > 0)) return false;
  const c = coverRect(sw, sh, w, h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(photo, c.sx, c.sy, c.sw, c.sh, x, y, w, h);
  ctx.restore();
  return true;
}

function dogOrDefault(spec: KeepsakeSpec): string {
  return cleanText(spec.dogName, 60) || "Your Dog";
}

// ---------------------------------------------------------------- postcard

function renderPostcard(ctx: Ctx, spec: KeepsakeSpec, assets: KeepsakeAssets): void {
  const W = 1500;
  const H = 1000;
  paper(ctx, W, H);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.lineWidth = 1;
  ctx.strokeRect(38, 38, W - 76, H - 76);

  // photo, framed like a print
  const px = 80;
  const py = 90;
  const pw = 700;
  const ph = 760;
  ctx.save();
  ctx.translate(px + pw / 2, py + ph / 2);
  ctx.rotate(-0.012);
  ctx.translate(-(px + pw / 2), -(py + ph / 2));
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(px + 6, py + 8, pw + 24, ph + 24);
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(px - 12, py - 12, pw + 24, ph + 24);
  const drawn = assets.photo ? drawPhotoCover(ctx, assets.photo, px, py, pw, ph) : false;
  if (!drawn) {
    ctx.fillStyle = "#e8dcc2";
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.strokeRect(px + 20, py + 20, pw - 40, ph - 40);
    ctx.setLineDash([]);
    drawPaw(ctx, px + pw / 2, py + ph / 2 - 20, 150, "rgba(107,101,89,0.45)");
    ctx.font = `italic 400 28px ${SERIF}`;
    ctx.fillStyle = MUTED;
    ctx.textAlign = "center";
    ctx.fillText("A photo of the adventure goes here", px + pw / 2, py + ph / 2 + 150);
  }
  ctx.restore();

  // stamp corner + postmark
  perforatedRect(ctx, 1245, 70, 190, 230, 7, PAPER);
  ctx.strokeStyle = RED;
  ctx.lineWidth = 2;
  ctx.strokeRect(1262, 87, 156, 196);
  drawPaw(ctx, 1340, 175, 80, RED);
  ctx.font = `700 18px ${SERIF}`;
  ctx.fillStyle = RED;
  ctx.textAlign = "center";
  ctx.fillText("ADVENTURE", 1340, 262);
  postmark(ctx, 1170, 215, 62, cleanText(spec.date, 24) || "ON THE ROAD", INK);

  // text column
  const tx = 860;
  const tw = 580;
  ctx.font = `700 22px ${SERIF}`;
  ctx.fillStyle = RED;
  ctx.textAlign = "left";
  ctx.fillText("ADVENTURE POSTCARD", tx, 345);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tx, 362);
  ctx.lineTo(tx + 120, 362);
  ctx.stroke();

  let y = 385;
  y = drawBlock(ctx, cleanText(spec.title, 120) || "A Little Adventure", tx, y, {
    maxWidth: tw,
    maxLines: 2,
    size: 54,
    minSize: 26,
    font: (s) => `700 ${s}px ${SERIF}`,
    color: INK,
    align: "left",
    lineHeight: 1.15,
  });
  y = drawBlock(ctx, `Starring ${dogOrDefault(spec)}`, tx, y + 8, {
    maxWidth: tw,
    maxLines: 1,
    size: 34,
    minSize: 16,
    font: (s) => `italic 400 ${s}px ${SERIF}`,
    color: RED,
    align: "left",
  });
  const date = cleanText(spec.date, 40);
  if (date)
    y = drawBlock(ctx, date, tx, y, {
      maxWidth: tw,
      maxLines: 1,
      size: 24,
      minSize: 14,
      font: (s) => `400 ${s}px ${SERIF}`,
      color: MUTED,
      align: "left",
    });
  const memory = cleanText(spec.memory, MEMORY_MAX);
  if (memory) {
    const memTop = y + 26;
    drawBlock(ctx, memory, tx, memTop, {
      maxWidth: tw,
      maxLines: 4,
      size: 30,
      minSize: 18,
      font: (s) => `italic 400 ${s}px ${SERIF}`,
      color: INK,
      align: "left",
      lineHeight: 1.32,
    });
  }
  // ruled address lines
  ctx.strokeStyle = "rgba(43,58,74,0.35)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    ctx.moveTo(tx, 856 + i * 36);
    ctx.lineTo(tx + tw, 856 + i * 36);
    ctx.stroke();
  }
  ctx.font = `italic 400 20px ${SERIF}`;
  ctx.fillStyle = MUTED;
  ctx.textAlign = "left";
  ctx.fillText("Collected on the Adventure Passport", tx, 842);
  ctx.font = `italic 400 22px ${SERIF}`;
  ctx.textAlign = "right";
  ctx.fillText(FOOTER_TEXT, 1440, 944);
}

// -------------------------------------------------------------- certificate

function seal(ctx: Ctx, cx: number, cy: number, r: number): void {
  ctx.fillStyle = RED;
  ctx.beginPath();
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const rr = i % 2 ? r : r * 0.92;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#f6efe0";
  ctx.lineWidth = 2;
  circle(ctx, cx, cy, r * 0.72);
  ctx.stroke();
  drawPaw(ctx, cx, cy - 2, r * 0.8, "#f6efe0");
}

function renderCertificate(ctx: Ctx, spec: KeepsakeSpec): void {
  const W = 1080;
  const H = 1350;
  const cx = W / 2;
  paper(ctx, W, H);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.strokeRect(62, 62, W - 124, H - 124);
  for (const [x = 0, y = 0] of [
    [62, 62],
    [W - 62, 62],
    [62, H - 62],
    [W - 62, H - 62],
  ]) {
    ctx.fillStyle = PAPER;
    circle(ctx, x, y, 18);
    ctx.fill();
    ctx.strokeStyle = GOLD;
    circle(ctx, x, y, 18);
    ctx.stroke();
    drawPaw(ctx, x, y, 14, GOLD);
  }
  const toy = spec.certificateKind === "toy-champion";
  let y = 170;
  y = drawBlock(ctx, "CERTIFICATE OF", cx, y, {
    maxWidth: 800,
    maxLines: 1,
    size: 30,
    minSize: 18,
    font: (s) => `700 ${s}px ${SERIF}`,
    color: RED,
    align: "center",
  });
  y = drawBlock(ctx, toy ? "TOY CHAMPION" : "ADVENTURE", cx, y + 4, {
    maxWidth: 800,
    maxLines: 1,
    size: 84,
    minSize: 30,
    font: (s) => `700 ${s}px ${SERIF}`,
    color: INK,
    align: "center",
  });
  y = drawBlock(ctx, "This certifies that", cx, y + 80, {
    maxWidth: 800,
    maxLines: 1,
    size: 30,
    minSize: 18,
    font: (s) => `italic 400 ${s}px ${SERIF}`,
    color: MUTED,
    align: "center",
  });
  y = drawBlock(ctx, dogOrDefault(spec), cx, y + 20, {
    maxWidth: 840,
    maxLines: 1,
    size: 120,
    minSize: 24,
    font: (s) => `700 ${s}px ${SERIF}`,
    color: RED,
    align: "center",
  });
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 300, y + 8);
  ctx.lineTo(cx + 300, y + 8);
  ctx.stroke();
  y = drawBlock(ctx, toy ? "has earned the title of" : "has officially completed", cx, y + 70, {
    maxWidth: 800,
    maxLines: 1,
    size: 30,
    minSize: 18,
    font: (s) => `italic 400 ${s}px ${SERIF}`,
    color: MUTED,
    align: "center",
  });
  y = drawBlock(
    ctx,
    cleanText(spec.title, 120) || (toy ? "Toy Champion" : "Explorer"),
    cx,
    y + 24,
    {
      maxWidth: 800,
      maxLines: 3,
      size: 64,
      minSize: 26,
      font: (s) => `700 ${s}px ${SERIF}`,
      color: INK,
      align: "center",
      lineHeight: 1.2,
    },
  );
  drawBlock(
    ctx,
    toy
      ? "A champion at play, on the Adventure Passport."
      : "An official explorer of the Adventure Passport.",
    cx,
    y + 24,
    {
      maxWidth: 760,
      maxLines: 2,
      size: 28,
      minSize: 16,
      font: (s) => `italic 400 ${s}px ${SERIF}`,
      color: MUTED,
      align: "center",
    },
  );
  seal(ctx, cx, 1000, 80);
  const date = cleanText(spec.date, 40);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(150, 1060);
  ctx.lineTo(380, 1060);
  ctx.moveTo(W - 380, 1060);
  ctx.lineTo(W - 150, 1060);
  ctx.stroke();
  ctx.font = `400 22px ${SERIF}`;
  ctx.fillStyle = MUTED;
  ctx.textAlign = "center";
  ctx.fillText(date || "Date", 265, 1092);
  ctx.fillText("Paws & Passage", W - 265, 1092);
  footer(ctx, W, H);
}

// ----------------------------------------------------------- milestone card

const INKS = ["#b4412f", "#2f5d62", "#5b4a8a", "#a9822c", "#3b6b3a", "#2b3a4a"];
function inkFor(slug: string, i: number): string {
  let h = i;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return INKS[h % INKS.length] ?? "#2b3a4a";
}

function miniStamp(ctx: Ctx, x: number, y: number, size: number, slug: string, i: number): void {
  const ink = inkFor(slug, i);
  perforatedRect(ctx, x, y, size, size, size * 0.05, PAPER);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8);
  drawPaw(ctx, x + size / 2, y + size * 0.46, size * 0.42, ink);
  const label = cleanText(slug.replace(/-/g, " "), 24).toUpperCase();
  const fit = fitText(ctx, label, {
    maxWidth: size * 0.78,
    maxLines: 1,
    size: Math.round(size * 0.1),
    minSize: 7,
    font: (s) => `700 ${s}px ${SERIF}`,
  });
  ctx.font = `700 ${fit.size}px ${SERIF}`;
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.fillText(fit.lines[0] ?? "", x + size / 2, y + size * 0.84);
}

function renderMilestone(ctx: Ctx, spec: KeepsakeSpec): void {
  const { width: W, height: H } = keepsakeSize(spec);
  const story = spec.variant === "story";
  const cx = W / 2;
  paper(ctx, W, H);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.strokeRect(36, 36, W - 72, H - 72);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.strokeRect(54, 54, W - 108, H - 108);

  const count = Math.max(
    0,
    Math.floor(Number(spec.stampCount ?? spec.stampSlugs?.length ?? 0)) || 0,
  );
  let y = story ? 170 : 110;
  y = drawBlock(ctx, "ADVENTURE PASSPORT", cx, y, {
    maxWidth: 800,
    maxLines: 1,
    size: 30,
    minSize: 16,
    font: (s) => `700 ${s}px ${SERIF}`,
    color: RED,
    align: "center",
  });
  y = drawBlock(ctx, String(count), cx, y + (story ? 40 : 0), {
    maxWidth: 700,
    maxLines: 1,
    size: story ? 300 : 210,
    minSize: 60,
    font: (s) => `700 ${s}px ${SERIF}`,
    color: INK,
    align: "center",
    lineHeight: 1.0,
  });
  y = drawBlock(ctx, count === 1 ? "stamp collected" : "stamps collected", cx, y, {
    maxWidth: 800,
    maxLines: 1,
    size: 40,
    minSize: 18,
    font: (s) => `italic 400 ${s}px ${SERIF}`,
    color: MUTED,
    align: "center",
  });
  y = drawBlock(ctx, cleanText(spec.title, 100) || "Milestone reached", cx, y + 20, {
    maxWidth: 840,
    maxLines: 2,
    size: 52,
    minSize: 24,
    font: (s) => `700 ${s}px ${SERIF}`,
    color: INK,
    align: "center",
    lineHeight: 1.15,
  });
  y = drawBlock(ctx, `Earned by ${dogOrDefault(spec)}`, cx, y + 6, {
    maxWidth: 840,
    maxLines: 1,
    size: 44,
    minSize: 18,
    font: (s) => `700 ${s}px ${SERIF}`,
    color: RED,
    align: "center",
  });
  const date = cleanText(spec.date, 40);
  if (date)
    y = drawBlock(ctx, date, cx, y, {
      maxWidth: 800,
      maxLines: 1,
      size: 26,
      minSize: 14,
      font: (s) => `400 ${s}px ${SERIF}`,
      color: MUTED,
      align: "center",
    });
  const memory = cleanText(spec.memory, MEMORY_MAX);
  if (memory)
    y = drawBlock(ctx, memory, cx, y + 14, {
      maxWidth: 800,
      maxLines: 3,
      size: 28,
      minSize: 16,
      font: (s) => `italic 400 ${s}px ${SERIF}`,
      color: INK,
      align: "center",
      lineHeight: 1.35,
    });

  // stamp row(s)
  const slugs = (spec.stampSlugs ?? [])
    .filter((s) => typeof s === "string")
    .slice(0, story ? 12 : 6);
  const size = story ? 220 : 128;
  const gap = story ? 32 : 18;
  const perRow = story ? 3 : 6;
  if (slugs.length) {
    const rows = Math.ceil(slugs.length / perRow);
    const bottomLimit = H - 110;
    const startY = Math.min(y + 70, bottomLimit - rows * (size + gap));
    slugs.forEach((slug, i) => {
      const row = Math.floor(i / perRow);
      const inRow = Math.min(perRow, slugs.length - row * perRow);
      const rowW = inRow * size + (inRow - 1) * gap;
      const x = cx - rowW / 2 + (i % perRow) * (size + gap);
      miniStamp(ctx, x, startY + row * (size + gap), size, slug, i);
    });
  }
  footer(ctx, W, H);
}

// ------------------------------------------------------------------ public

/** Draws one keepsake. Never throws on odd text: it is cleaned, wrapped and shrunk to fit. */
export function renderKeepsake(ctx: Ctx, spec: KeepsakeSpec, assets: KeepsakeAssets = {}): void {
  ctx.save();
  try {
    if (spec.template === "postcard") renderPostcard(ctx, spec, assets);
    else if (spec.template === "certificate") renderCertificate(ctx, spec);
    else renderMilestone(ctx, spec);
  } finally {
    ctx.restore();
  }
}

/** Renders to a PNG blob entirely in the browser. The photo, if any, is only drawn, never sent anywhere. */
export async function makeKeepsakeBlob(
  spec: KeepsakeSpec,
  photo?: PhotoSource | null,
): Promise<Blob> {
  const { width: w, height: h } = keepsakeSize(spec);
  if (typeof OffscreenCanvas !== "undefined") {
    const c = new OffscreenCanvas(w, h);
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available in this browser");
    renderKeepsake(ctx as unknown as Ctx, spec, { photo });
    return c.convertToBlob({ type: "image/png" });
  }
  if (typeof document === "undefined") throw new Error("Canvas is not available here");
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser");
  renderKeepsake(ctx, spec, { photo });
  return new Promise<Blob>((resolve, reject) =>
    c.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not make the image"))), "image/png"),
  );
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Opens the phone's share sheet with the image attached when the browser supports file sharing.
 * Returns "shared", "cancelled", or "download" (the caller should then call downloadBlob).
 */
export async function shareBlob(
  blob: Blob,
  filename: string,
  text: string,
): Promise<"shared" | "cancelled" | "download"> {
  try {
    const nav = typeof navigator === "undefined" ? undefined : navigator;
    if (!nav || typeof nav.share !== "function" || typeof nav.canShare !== "function")
      return "download";
    const file = new File([blob], filename, { type: blob.type || "image/png" });
    if (!nav.canShare({ files: [file] })) return "download";
    await nav.share(text ? { files: [file], text } : { files: [file] });
    return "shared";
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return "cancelled";
    return "download";
  }
}
