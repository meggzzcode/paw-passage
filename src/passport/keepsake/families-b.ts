// Families 6-10, photo-first: seasonal frame, event ticket, then-and-now, collage, poster.
// The photograph is the picture (full-bleed, or in a tight grid). Everything else is a light overlay: a soft
// local scrim, delicate type, a little handwriting and a few vector details kept to margins and corners.
// Adventure personality comes from the theme (accent, symbols, short wording), never from a per-adventure canvas.
import { circle, type Ctx } from "./render";
import { W, barcode, inkOn, readable, softOn, type FamilyDef, type Prep, type Slot } from "./kit";
import {
  brandMark,
  displayFont,
  draw,
  drawUp,
  edgeFrame,
  finish,
  fullSlot,
  handFont,
  heightOf,
  mix,
  noteStyle,
  paintPhoto,
  rgba,
  sansBold,
  sansFont,
  scrim,
  sentence,
  sparkleRule,
  tiltedMotif,
  tintOf,
  whoLine,
  zoneOf,
  PAPER_WHITE,
  type TextStyle,
  type Tint,
} from "./kit-photo-first-b";
import {
  arrowBadge,
  bulbs,
  bunting,
  keyline,
  rosette,
  ruler,
  sparkle,
  sprockets,
  stampFrame,
  swash,
  ticketPath,
  twinkles,
} from "./ornaments-b";
import { motif } from "./ornaments";
import type { ThemeConfig } from "./themes";

const word = (p: Prep, k: string, d = "") => p.t.words[k] ?? d;
const cased = (p: Prep, s: string) => (p.t.upper ? s.toUpperCase() : s);
const WHITE = PAPER_WHITE;
const SOFT = "rgba(255,253,248,0.9)";

/** One line of a bottom-anchored caption stack. */
interface Row {
  text: string;
  style: TextStyle;
  /** Space above this row. */
  gap?: number;
}

/** Draws rows bottom-up so the last row ends at `bottom`. Returns the top of the stack. */
function stackUp(ctx: Ctx, rows: Row[], x: number, bottom: number): number {
  let y = bottom;
  for (let i = rows.length - 1; i >= 0; i--) {
    const r = rows[i] as Row;
    if (!r.text) continue;
    y = drawUp(ctx, r.text, x, y, r.style) - (r.gap ?? 0);
  }
  return y;
}

function stackHeight(ctx: Ctx, rows: Row[]): number {
  let h = 0;
  for (const r of rows) if (r.text) h += heightOf(ctx, r.text, r.style) + (r.gap ?? 0);
  return h;
}

/** Brand mark baseline: inside the Story safe area, near the foot of the other formats. */
function brandY(p: Prep): number {
  return p.story ? zoneOf(p).bottom : p.H - 40;
}

const MOTIF_GREEN = ["leaf", "fern", "daisy", "tree", "wheat", "pumpkin", "apple", "reeds"];
const MOTIF_NIGHT = ["constellation", "moon", "star"];

// ====================================================================== seasonal-frame

function seasonDecor(ctx: Ctx, t: ThemeConfig, k: Tint, p: Prep): void {
  const z = zoneOf(p);
  const top = p.story ? 262 : 122;
  tiltedMotif(ctx, t, "motif", 118, top, 96, -0.28, k.a, k.b, 0.9);
  tiltedMotif(ctx, t, "motif2", W - 112, top, 70, 0.32, k.b, k.a, 0.82);
  if (t.motif === "snowflake") {
    ctx.save();
    ctx.fillStyle = WHITE;
    for (let i = 0; i < 34; i++) {
      const edge = i % 3;
      const r = (n: number) => {
        const v = Math.sin((i + n) * 91.3 + 7.7) * 43758.5453;
        return v - Math.floor(v);
      };
      const x =
        edge === 0 ? 20 + r(1) * 120 : edge === 1 ? W - 140 + r(2) * 120 : 40 + r(3) * (W - 80);
      const y = edge === 2 ? 20 + r(4) * 220 : 40 + r(5) * (p.H - 120);
      ctx.globalAlpha = 0.35 + r(6) * 0.4;
      circle(ctx, x, y, 3 + r(7) * 6);
      ctx.fill();
    }
    ctx.restore();
  } else if (MOTIF_NIGHT.includes(t.motif) || MOTIF_NIGHT.includes(t.motif2)) {
    twinkles(ctx, 40, p.story ? 262 : 40, W - 80, 230, 11, 3, k.a, 0.85);
    twinkles(ctx, 30, 300, 80, p.H - 700, 4, 11, WHITE, 0.6);
    twinkles(ctx, W - 110, 300, 80, p.H - 700, 4, 17, WHITE, 0.6);
  } else if (MOTIF_GREEN.includes(t.motif)) {
    for (let i = 0; i < 4; i++) {
      const y = (p.story ? 520 : 300) + i * ((p.H - (p.story ? 1100 : 760)) / 3);
      tiltedMotif(ctx, t, "motif", 52, y, 44, -0.5 + i * 0.25, k.a, k.b, 0.55);
      tiltedMotif(ctx, t, "motif", W - 52, y + 70, 44, 0.5 - i * 0.25, k.a, k.b, 0.55);
    }
  } else {
    twinkles(ctx, 40, p.story ? 262 : 40, W - 80, 200, 5, 5, k.a, 0.7);
  }
}

export const seasonalFrame: FamilyDef = {
  slots(p) {
    return [fullSlot(p)];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const k = tintOf(t);
    const s = slots[0] as Slot;
    const z = zoneOf(p);
    const sq = p.spec.size === "square";
    paintPhoto(ctx, t, s, photos[0], 0);
    finish(ctx, s, k.deep, 0.24, ["sun", "lantern"].includes(t.motif) ? k.a : undefined);
    const w = 800;
    const cx = W / 2;
    const handText = sq && p.sub ? p.sub : sentence(word(p, "kicker"));
    const rows: Row[] = [
      {
        text: handText,
        style: {
          w,
          lines: 1,
          size: sq ? 54 : 60,
          min: 44,
          font: handFont,
          color: WHITE,
          align: "center",
          shadow: 14,
        },
      },
      {
        text: p.head,
        style: {
          w: 900,
          lines: 2,
          size: p.story ? 78 : sq ? 60 : 68,
          min: 40,
          font: displayFont(700),
          color: WHITE,
          align: "center",
          lh: 1.06,
          shadow: 18,
        },
      },
      {
        text: !sq ? p.sub : "",
        gap: 6,
        style: {
          w,
          lines: 1,
          size: 36,
          min: 34,
          font: sansFont,
          color: SOFT,
          align: "center",
          shadow: 14,
        },
      },
      {
        text: whoLine(p.name, p.date),
        gap: 8,
        style: {
          w: 900,
          lines: 1,
          size: 38,
          min: 34,
          font: sansBold,
          color: WHITE,
          align: "center",
          shadow: 14,
        },
      },
      {
        text: p.memory,
        gap: 14,
        style: noteStyle(ctx, p.memory, 820, p.story ? 3 : 2, WHITE, "center", 50),
      },
    ];
    const by = brandY(p);
    const bottom = by - 44;
    const ruleH = 34;
    const h = stackHeight(ctx, rows) + ruleH;
    scrim(
      ctx,
      0,
      Math.max(0, bottom - h - 170),
      W,
      H - Math.max(0, bottom - h - 170),
      "bottom",
      k.deep,
      0.7,
    );
    scrim(ctx, 0, 0, W, 300, "top", k.deep, 0.3);
    seasonDecor(ctx, t, k, p);
    edgeFrame(ctx, t, 34, 34, W - 68, H - 68, k.a, 0.5);
    // top-down in the same order, with the rule between the title block and the name line
    const first = rows.slice(0, 3);
    const last = rows.slice(3);
    const lastTop = stackUp(ctx, last, cx, bottom);
    sparkleRule(ctx, cx, lastTop - 20, 130, k.a, 0.9);
    stackUp(ctx, first, cx, lastTop - ruleH);
    brandMark(ctx, cx, by, "center");
  },
};

// ====================================================================== event-ticket

function ticketSize(p: Prep): { w: number; h: number } {
  return p.spec.size === "square" ? { w: 540, h: 188 } : { w: 580, h: 196 };
}

function awning(ctx: Ctx, t: ThemeConfig): void {
  const n = 12;
  const sw = W / n;
  ctx.save();
  ctx.globalAlpha = 0.92;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = i % 2 ? t.palette.card : t.palette.accent;
    ctx.fillRect(i * sw, 0, sw + 1, 40);
    ctx.beginPath();
    ctx.arc(i * sw + sw / 2, 40, sw / 2, 0, Math.PI);
    ctx.fill();
  }
  ctx.restore();
}

function ticketDecor(ctx: Ctx, t: ThemeConfig, k: Tint, p: Prep): void {
  const H = p.H;
  if (t.frame === "filmstrip") {
    sprockets(ctx, 20, 50, H - 50, 20, 28, 56, WHITE, 0.5);
    sprockets(ctx, W - 40, 50, H - 50, 20, 28, 56, WHITE, 0.5);
  } else if (t.frame === "marquee") {
    bulbs(ctx, 70, 40, W - 70, 40, 17, 8, k.b, 0.9);
    bulbs(ctx, 70, H - 40, W - 70, H - 40, 17, 8, k.a, 0.9);
  } else if (t.pattern === "stripes" && t.frame === "none") {
    awning(ctx, t);
  } else if (t.pattern === "dots") {
    twinkles(ctx, 40, 40, W - 80, 160, 7, 9, k.b, 0.8);
  }
  if (t.frame !== "filmstrip" && t.frame !== "marquee" && t.frame !== "none")
    edgeFrame(ctx, t, 32, 32, W - 64, H - 64, k.a, 0.5);
  const top = p.story ? 268 : 120;
  tiltedMotif(ctx, t, "motif", W - 110, top, 76, 0.3, k.a, k.b, 0.85);
  if (t.variant === "pass") {
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = k.a;
    ctx.fillRect(W / 2 - 22, 0, 44, p.story ? 190 : 120);
    ctx.fillStyle = k.deep;
    circle(ctx, W / 2, p.story ? 190 : 120, 13);
    ctx.fill();
    ctx.restore();
  }
}

export const eventTicket: FamilyDef = {
  slots(p) {
    return [fullSlot(p)];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const k = tintOf(t);
    const s = slots[0] as Slot;
    const z = zoneOf(p);
    const sq = p.spec.size === "square";
    paintPhoto(ctx, t, s, photos[0], 0);
    finish(ctx, s, k.deep, 0.22);

    const tk = ticketSize(p);
    const by = brandY(p);
    const tx = 52;
    const ty = by - 34 - tk.h;
    const stubX = tk.w - 172;

    // handwriting above the ticket
    const noteW = 760;
    const rows: Row[] = [
      {
        // priority: ticket, then the note, then the handwritten subhead (only when nothing else competes)
        text: p.story && !p.memory ? p.sub : "",
        style: {
          w: noteW,
          lines: 1,
          size: 58,
          min: 44,
          font: handFont,
          color: k.a,
          align: "left",
          shadow: 14,
        },
      },
      {
        text: p.memory,
        gap: 6,
        style: noteStyle(ctx, p.memory, noteW, 2, WHITE, "left", 46),
      },
    ];
    const noteBottom = ty - 26;
    const noteH = stackHeight(ctx, rows);
    const sTop = Math.max(0, Math.min(noteBottom - noteH, ty) - 120);
    scrim(ctx, 0, sTop, W, H - sTop, "bottom", k.deep, 0.5);
    scrim(ctx, 0, 0, W, 240, "top", k.deep, 0.2);
    ticketDecor(ctx, t, k, p);
    stackUp(ctx, rows, tx + 4, noteBottom);

    // the ticket: a small paper stub with a tinted tear-off end
    ctx.save();
    ctx.translate(tx + tk.w / 2, ty + tk.h / 2);
    ctx.rotate(-0.032);
    ctx.translate(-(tx + tk.w / 2), -(ty + tk.h / 2));
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ticketPath(ctx, tx + 6, ty + 10, tk.w, tk.h, 20, stubX, 22);
    ctx.fill();
    ctx.fillStyle = c.card;
    ticketPath(ctx, tx, ty, tk.w, tk.h, 20, stubX, 22);
    ctx.fill();
    ctx.save();
    ticketPath(ctx, tx, ty, tk.w, tk.h, 20, stubX, 22);
    ctx.clip();
    ctx.fillStyle = c.accent;
    ctx.fillRect(tx + stubX, ty, tk.w - stubX, tk.h);
    ctx.fillStyle = c.accent2;
    ctx.fillRect(tx, ty, 12, tk.h);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = rgba(c.card, 0.9);
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 9]);
    ctx.beginPath();
    ctx.moveTo(tx + stubX, ty + 30);
    ctx.lineTo(tx + stubX, ty + tk.h - 30);
    ctx.stroke();
    ctx.restore();

    const ink = inkOn(c.card, t);
    const mute = readable(c.card, c.accent, c.ink, softOn(c.card, t));
    const mx = tx + 32;
    const mw = stubX - 52;
    let y = ty + 16;
    y = draw(ctx, word(p, "event", "ADMIT ONE"), mx, y, {
      w: mw,
      lines: 1,
      size: 26,
      min: 22,
      font: sansBold,
      color: mute,
    });
    y = draw(ctx, cased(p, p.name), mx, y - 2, {
      w: mw,
      lines: 1,
      size: sq ? 54 : 58,
      min: 34,
      font: displayFont(800),
      color: ink,
      lh: 1.08,
    });
    y = draw(ctx, p.head, mx, y, {
      w: mw,
      lines: 1,
      size: 34,
      min: 30,
      font: sansFont,
      color: ink,
    });
    if (p.date)
      draw(ctx, `${word(p, "date", "DATE")}  ·  ${p.date}`, mx, y + 2, {
        w: mw,
        lines: 1,
        size: 28,
        min: 24,
        font: sansBold,
        color: mute,
      });
    // the tear-off end
    const sx = tx + stubX + 22;
    const sw = tk.w - stubX - 44;
    const onAcc = inkOn(c.accent, t);
    draw(ctx, word(p, "admit", "ADMIT ONE").replace(/-/g, " "), sx + sw / 2, ty + 26, {
      w: sw,
      lines: 3,
      size: 26,
      min: 18,
      font: displayFont(800),
      color: onAcc,
      align: "center",
      lh: 1.08,
    });
    barcode(ctx, sx + 6, ty + tk.h - 62, sw - 12, 36, p.name + p.head, onAcc);
    ctx.restore();

    brandMark(ctx, W - 56, by, "right");
  },
};

// ====================================================================== then-and-now

const STRIP = { story: 136, portrait: 126, square: 130 } as const;

export const thenAndNow: FamilyDef = {
  slots(p) {
    if (p.spec.size === "square") {
      const h = 1080 - STRIP.square;
      return [
        { x: 0, y: 0, w: 534, h },
        { x: 546, y: 0, w: 534, h },
      ];
    }
    const strip = p.story ? STRIP.story : STRIP.portrait;
    const each = Math.floor((p.H - strip) / 2);
    return [
      { x: 0, y: 0, w: W, h: each },
      { x: 0, y: each + strip, w: W, h: each },
    ];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const k = tintOf(t);
    const a = slots[0] as Slot;
    const b = slots[1] as Slot;
    const sq = p.spec.size === "square";
    const z = zoneOf(p);
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    paintPhoto(ctx, t, a, photos[0], 0);
    paintPhoto(ctx, t, b, photos[1], 1);
    finish(ctx, a, k.deep, 0.18);
    finish(ctx, b, k.deep, 0.18);

    // the caption strip: paper, with the title and the dog's name
    const sy = sq ? a.h : a.h;
    const sh = sq ? STRIP.square : p.story ? STRIP.story : STRIP.portrait;
    const ink = inkOn(c.bg, t);
    const cx = W / 2;
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = c.accent2;
    if (sq) ctx.fillRect(a.w, 0, 12, a.h);
    ctx.restore();
    const headStyle: TextStyle = {
      w: 940,
      lines: 1,
      size: p.story ? 48 : 46,
      min: 34,
      font: displayFont(700),
      color: ink,
      align: "center",
    };
    const whoStyle: TextStyle = {
      w: 900,
      lines: 1,
      size: 34,
      min: 34,
      font: sansBold,
      color: readable(c.bg, c.accent, softOn(c.bg, t), ink),
      align: "center",
    };
    const hh = heightOf(ctx, p.head, headStyle) + heightOf(ctx, whoLine(p.name, p.date), whoStyle);
    const top = sy + Math.max(10, (sh - hh) / 2);
    const mid = draw(ctx, p.head, cx, top, headStyle);
    draw(ctx, whoLine(p.name, p.date), cx, mid + 2, whoStyle);

    // labels: small handwriting with a swash, one on each photograph
    const label = (text: string, x: number, bottom: number, from: "bottom" | "top", s: Slot) => {
      scrim(ctx, s.x, from === "bottom" ? bottom - 200 : s.y, s.w, 200, from, k.deep, 0.4);
      const tw = 140 + text.length * 26;
      draw(ctx, text, x, bottom - 86, {
        w: 420,
        lines: 1,
        size: 80,
        min: 60,
        font: handFont,
        color: WHITE,
        shadow: 16,
        rot: -0.03,
      });
      swash(ctx, x + 2, x + Math.min(tw, 260), bottom - 4, k.a, 0.95, 5);
    };
    const thenWord = sentence(word(p, "then", "then"));
    const nowWord = sentence(word(p, "now", "now"));
    if (sq) {
      const topLabel = (text: string, sl: Slot) => {
        scrim(ctx, sl.x, sl.y, sl.w, 200, "top", k.deep, 0.4);
        draw(ctx, text, sl.x + 40, sl.y + 26, {
          w: 420,
          lines: 1,
          size: 80,
          min: 60,
          font: handFont,
          color: WHITE,
          shadow: 16,
          rot: -0.03,
        });
        swash(
          ctx,
          sl.x + 42,
          sl.x + 40 + Math.min(260, 120 + text.length * 22),
          sl.y + 112,
          k.a,
          0.95,
          5,
        );
      };
      topLabel(thenWord, a);
      topLabel(nowWord, b);
      arrowBadge(ctx, a.w + 6, a.h / 2, 32, false, c.accent, inkOn(c.accent, t));
    } else {
      label(thenWord, z.left, a.h - 26, "bottom", a);
      // the "now" label hangs just under the strip, so its baseline mirrors the first
      const ny = b.y + 120;
      scrim(ctx, b.x, b.y, b.w, 210, "top", k.deep, 0.4);
      draw(ctx, nowWord, z.left, ny - 86, {
        w: 420,
        lines: 1,
        size: 80,
        min: 60,
        font: handFont,
        color: WHITE,
        shadow: 16,
        rot: -0.03,
      });
      swash(ctx, z.left + 2, z.left + 150, ny - 4, k.a, 0.95, 5);
    }

    // a note across the foot of the second photograph
    const noteRows: Row[] = [
      {
        text: p.sub,
        style: { w: 880, lines: 1, size: 54, min: 44, font: handFont, color: SOFT, shadow: 14 },
      },
      {
        text: p.memory,
        gap: 4,
        style: noteStyle(ctx, p.memory, 880, p.story ? 3 : 2, WHITE, "left", 48),
      },
    ];
    const by = sq ? H - sh - 28 : brandY(p) - 40;
    if (p.sub || p.memory) {
      const nh = stackHeight(ctx, noteRows);
      const from = by - nh - 130;
      scrim(ctx, b.x, from, b.w, b.y + b.h - from, "bottom", k.deep, 0.62);
      const noteX = sq ? b.x + 30 : z.left;
      if (sq) {
        noteRows.forEach((r) => (r.style.w = 480));
      }
      stackUp(ctx, noteRows, noteX, by);
    }
    brandMark(
      ctx,
      W - 40,
      sq ? H - 30 - (sh - 150) : p.story ? z.bottom : H - 34,
      "right",
      softOn(c.bg, t),
    );
  },
};

// ====================================================================== collage

const SEASONS = [
  { name: "spring", motif: "leaf" as const, color: "#8fd18f" },
  { name: "summer", motif: "sun" as const, color: "#f6d45a" },
  { name: "autumn", motif: "pumpkin" as const, color: "#f0a04a" },
  { name: "winter", motif: "snowflake" as const, color: "#bfe3ff" },
];

function gutterOf(p: Prep): number {
  return p.t.variant === "quad" || p.t.frame === "bold" ? 14 : 10;
}

/** Rough line count of the handwritten note, so the caption strip can be sized from the text alone. */
function noteLines(m: string): number {
  return m ? (m.length <= 48 ? 1 : m.length <= 96 ? 2 : 3) : 0;
}

/** Height of the slim paper caption strip that sits between the photographs (collages of two or more). */
function captionHeight(p: Prep): number {
  const n = noteLines(p.memory);
  return (p.story ? 160 : 146) + (p.sub ? 50 : 0) + (n ? n * 50 + 10 : 0);
}

interface Grid {
  tiles: Slot[];
  /** Paper strip for the caption; null for a single full-bleed photograph (the caption overlays it). */
  strip: { y: number; h: number } | null;
}

function grid(p: Prep, n: number): Grid {
  const H = p.H;
  const g = gutterOf(p);
  const sq = p.spec.size === "square";
  const half = (v: number) => (v - g) / 2;
  if (n <= 1) return { tiles: [{ x: 0, y: 0, w: W, h: H }], strip: null };
  const cap = captionHeight(p);
  if (sq) {
    const ah = H - cap;
    const strip = { y: ah, h: cap };
    if (n === 2)
      return {
        strip,
        tiles: [
          { x: 0, y: 0, w: half(W), h: ah },
          { x: half(W) + g, y: 0, w: half(W), h: ah },
        ],
      };
    if (n === 3) {
      const lw = Math.round(W * 0.6);
      const rw = W - lw - g;
      return {
        strip,
        tiles: [
          { x: 0, y: 0, w: lw, h: ah },
          { x: lw + g, y: 0, w: rw, h: half(ah) },
          { x: lw + g, y: half(ah) + g, w: rw, h: half(ah) },
        ],
      };
    }
    return {
      strip,
      tiles: [0, 1, 2, 3].map((i) => ({
        x: (i % 2) * (half(W) + g),
        y: Math.floor(i / 2) * (half(ah) + g),
        w: half(W),
        h: half(ah),
      })),
    };
  }
  // tall formats: the strip sits between two rows, so the caption stays in the middle of the piece
  const avail = H - cap;
  if (n === 2) {
    const r = Math.floor(avail / 2);
    return {
      strip: { y: r, h: cap },
      tiles: [
        { x: 0, y: 0, w: W, h: r },
        { x: 0, y: r + cap, w: W, h: avail - r },
      ],
    };
  }
  const r1 = n === 3 ? Math.round(avail * (p.story ? 0.5 : 0.54)) : Math.floor(avail / 2);
  const r2 = avail - r1;
  const strip = { y: r1, h: cap };
  const top: Slot[] =
    n === 3
      ? [{ x: 0, y: 0, w: W, h: r1 }]
      : [
          { x: 0, y: 0, w: half(W), h: r1 },
          { x: half(W) + g, y: 0, w: half(W), h: r1 },
        ];
  const bottom: Slot[] = [
    { x: 0, y: r1 + cap, w: half(W), h: r2 },
    { x: half(W) + g, y: r1 + cap, w: half(W), h: r2 },
  ];
  return { strip, tiles: [...top, ...bottom] };
}

export const collage: FamilyDef = {
  slots(p, count) {
    const n = p.t.variant === "quad" ? 4 : count <= 0 ? 3 : Math.min(4, count);
    const inset = p.t.variant === "stamps" ? 16 : 0;
    return grid(p, n).tiles.map((s) => ({
      x: s.x + inset,
      y: s.y + inset,
      w: s.w - inset * 2,
      h: s.h - inset * 2,
    }));
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const k = tintOf(t);
    const v = t.variant ?? "";
    const z = zoneOf(p);
    const cx = W / 2;
    // ground shows only in the thin gutters
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    if (v === "" && t.frame === "bold") {
      ctx.fillStyle = rgba(c.ink, 0.1);
      for (let y = 8; y < H; y += 22)
        for (let x = (y / 22) % 2 ? 19 : 8; x < W; x += 22) {
          circle(ctx, x, y, 3.2);
          ctx.fill();
        }
    }
    slots.forEach((s, i) => {
      if (v === "stamps") {
        // a small paper stamp edge: white margin with punched holes
        const px = s.x - 16;
        const py = s.y - 16;
        const pw = s.w + 32;
        const ph = s.h + 32;
        ctx.fillStyle = "#fffdf7";
        ctx.fillRect(px, py, pw, ph);
        ctx.fillStyle = c.bg;
        for (let x = px + 12; x < px + pw; x += 26) {
          circle(ctx, x, py, 7);
          ctx.fill();
          circle(ctx, x, py + ph, 7);
          ctx.fill();
        }
        for (let y = py + 12; y < py + ph; y += 26) {
          circle(ctx, px, y, 7);
          ctx.fill();
          circle(ctx, px + pw, y, 7);
          ctx.fill();
        }
      }
      paintPhoto(ctx, t, s, photos[i], i);
      finish(ctx, s, k.deep, 0.14);
    });

    const first = slots[0] as Slot;
    // per-variant details, kept to the corners of the tiles
    if (v === "map") {
      ctx.save();
      ctx.strokeStyle = WHITE;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.setLineDash([2, 16]);
      ctx.beginPath();
      slots.forEach((s, i) => {
        const px = s.x + 50;
        const py = s.y + 64;
        if (i) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      });
      ctx.stroke();
      ctx.restore();
      slots.forEach((s) => motif(ctx, "pin", s.x + 50, s.y + 54, 62, k.a, WHITE));
    } else if (v === "swatch") {
      slots.forEach((s, i) => {
        [c.accent, c.accent2, mix(c.ink, c.bg, 0.2)].forEach((col, j) => {
          ctx.save();
          ctx.fillStyle = WHITE;
          circle(ctx, s.x + 40 + j * 34, s.y + 40 + (i === 0 && p.story ? 0 : 0), 15);
          ctx.fill();
          ctx.fillStyle = col;
          circle(ctx, s.x + 40 + j * 34, s.y + 40, 12);
          ctx.fill();
          ctx.restore();
        });
      });
    } else if (v === "quad") {
      slots.forEach((s, i) => {
        const se = SEASONS[i % 4] as (typeof SEASONS)[number];
        scrim(ctx, s.x, s.y, s.w, 170, "top", k.deep, 0.34);
        motif(ctx, se.motif, s.x + 62, s.y + 62, 54, se.color, WHITE);
        draw(ctx, se.name, s.x + 104, s.y + 28, {
          w: s.w - 130,
          lines: 1,
          size: 56,
          min: 44,
          font: handFont,
          color: WHITE,
          shadow: 12,
        });
      });
    } else if (v === "comic" || (v === "" && t.frame === "bold")) {
      ctx.save();
      ctx.translate(first.x + 40, first.y + 40);
      ctx.rotate(-0.025);
      const lw = Math.min(first.w - 120, 440);
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, lw, 64);
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, lw, 64);
      draw(ctx, word(p, "kicker", "THE ADVENTURE ISSUE"), 18, 8, {
        w: lw - 36,
        lines: 1,
        size: 34,
        min: 28,
        font: displayFont(800),
        color: c.ink,
      });
      ctx.restore();
    } else if (v === "stamps") {
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = WHITE;
      ctx.lineWidth = 3;
      const last = slots[slots.length - 1] as Slot;
      circle(ctx, last.x + last.w - 70, last.y + 70, 40);
      ctx.stroke();
      circle(ctx, last.x + last.w - 70, last.y + 70, 32);
      ctx.stroke();
      ctx.restore();
      sparkle(ctx, first.x + 56, first.y + 56, 16, WHITE, 0.9);
    } else if (t.frame === "double") {
      edgeFrame(ctx, t, 28, 28, W - 56, H - 56, k.a, 0.65);
    } else {
      // default: a few twinkles in the outer top-right corner; the kicker lives in the caption, never on a face
      twinkles(ctx, W - 150, 34, 110, 90, 3, 8, WHITE, 0.8);
    }

    // caption: on the paper strip between the photographs, or over a soft scrim for a single photograph
    const by = brandY(p);
    const G = grid(p, slots.length);
    const headSt: TextStyle = {
      w: 940,
      lines: 1,
      size: p.story ? 56 : 52,
      min: 36,
      font: displayFont(700),
      color: inkOn(c.bg, t),
      align: "center",
    };
    const whoSt: TextStyle = {
      w: 900,
      lines: 1,
      size: 36,
      min: 34,
      font: sansBold,
      color: readable(c.bg, c.accent, softOn(c.bg, t), c.ink),
      align: "center",
    };
    if (G.strip) {
      const noteSt = noteStyle(ctx, p.memory, 900, noteLines(p.memory) + 1, c.ink, "center", 46);
      const rows: Row[] = [
        { text: p.head, style: headSt },
        { text: whoLine(p.name, p.date), gap: 2, style: whoSt },
        {
          text: p.sub,
          gap: 4,
          style: {
            w: 900,
            lines: 1,
            size: 50,
            min: 44,
            font: handFont,
            color: readable(c.bg, c.accent, c.ink),
            align: "center",
          },
        },
        { text: p.memory, gap: 4, style: { ...noteSt, shadow: 0 } },
      ];
      const h = stackHeight(ctx, rows);
      const bottom = G.strip.y + G.strip.h - Math.max(10, (G.strip.h - h) / 2);
      stackUp(ctx, rows, cx, bottom);
      const last = slots[slots.length - 1] as Slot;
      brandMark(
        ctx,
        last.x + last.w - 26,
        Math.min(last.y + last.h - 22, p.story ? z.bottom : H - 22),
        "right",
      );
    } else {
      const bottom = by - 40;
      const rows: Row[] = [
        {
          text:
            v === "" && t.frame !== "bold" && t.frame !== "double"
              ? sentence(word(p, "kicker", "Favorite moments"))
              : "",
          style: {
            w: 700,
            lines: 1,
            size: 54,
            min: 44,
            font: handFont,
            color: k.a,
            align: "center",
            shadow: 14,
          },
        },
        {
          text: p.head,
          style: {
            ...headSt,
            color: WHITE,
            size: p.story ? 72 : 62,
            lines: 2,
            lh: 1.06,
            shadow: 18,
          },
        },
        {
          text: whoLine(p.name, p.date),
          gap: 6,
          style: { ...whoSt, color: WHITE, size: 38, shadow: 14 },
        },
        { text: p.sub, gap: 4, style: { ...whoSt, color: SOFT, shadow: 14 } },
        { text: p.memory, gap: 12, style: noteStyle(ctx, p.memory, 820, 2, WHITE, "center", 48) },
      ];
      const h = stackHeight(ctx, rows);
      scrim(ctx, 0, bottom - h - 150, W, H - (bottom - h - 150), "bottom", k.deep, 0.74);
      stackUp(ctx, rows, cx, bottom);
      brandMark(ctx, cx, by, "center");
    }
  },
};

// ====================================================================== poster

type PosterKind = "bold" | "report" | "framed";

function kindOf(t: ThemeConfig): PosterKind {
  if (t.variant === "framed") return "framed";
  if (t.frame === "bold") return "bold";
  return "report";
}

export const poster: FamilyDef = {
  slots(p) {
    return [fullSlot(p)];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const k = tintOf(t);
    const s = slots[0] as Slot;
    const z = zoneOf(p);
    const kind = kindOf(t);
    const sq = p.spec.size === "square";
    const left = kind === "report";
    paintPhoto(ctx, t, s, photos[0], 0);
    finish(ctx, s, k.deep, 0.22);

    const x = left ? z.left : W / 2;
    const align: CanvasTextAlign = left ? "left" : "center";
    const by = brandY(p);
    const bottom = by - 42;
    const line2 = [p.date ? `${word(p, "field2", "ON")} ${p.date}` : "", p.sub]
      .filter(Boolean)
      .join("  ·  ");
    const rows: Row[] = [
      {
        // framed prints keep their handwritten note in the caption, never over the photograph
        text: kind === "framed" ? sentence(word(p, "seal", "on show")) : "",
        style: {
          w: 700,
          lines: 1,
          size: 56,
          min: 44,
          font: handFont,
          color: k.a,
          align,
          shadow: 14,
        },
      },
      {
        text: word(p, "kicker", "POSTER"),
        style: {
          w: 900,
          lines: 1,
          size: 34,
          min: 30,
          font: sansBold,
          color: k.a,
          align,
          shadow: 14,
        },
      },
      {
        text: p.head,
        gap: 2,
        style: {
          w: 920,
          lines: 2,
          size: p.story ? 88 : sq ? 66 : 76,
          min: 42,
          font: displayFont(800),
          color: WHITE,
          align,
          lh: 1.02,
          shadow: 20,
        },
      },
      {
        text: `${word(p, "field1", "BY")}  ${cased(p, p.name)}`,
        gap: 8,
        style: {
          w: 920,
          lines: 1,
          size: 44,
          min: 34,
          font: displayFont(700),
          color: WHITE,
          align,
          shadow: 14,
        },
      },
      {
        text: line2,
        gap: 2,
        style: {
          w: 920,
          lines: 1,
          size: 34,
          min: 34,
          font: sansFont,
          color: SOFT,
          align,
          shadow: 14,
        },
      },
      {
        text: p.memory,
        gap: 12,
        style: noteStyle(ctx, p.memory, 860, 2, WHITE, align, 48),
      },
    ];
    const h = stackHeight(ctx, rows);
    scrim(ctx, 0, bottom - h - 170, W, H - (bottom - h - 170), "bottom", k.deep, 0.72);
    scrim(ctx, 0, 0, W, 280, "top", k.deep, 0.26);

    const topY = p.story ? 268 : 110;
    const hasBunting = t.motif === "bunting" || t.motif2 === "bunting";
    if (kind === "bold") {
      if (hasBunting) bunting(ctx, 40, W - 40, 22, 26, 9, [c.accent, c.accent2, c.card], 0.92, 42);
      tiltedMotif(ctx, t, "motif", 108, topY + 20, 84, -0.25, k.a, k.b, 0.9);
      const rr = 80;
      const rx = W - rr - 28;
      const ry = topY + rr * 0.9;
      rosette(ctx, rx, ry, rr, c.accent, inkOn(c.accent, t));
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(-0.16);
      draw(ctx, word(p, "seal", "BEST IN SHOW"), 0, -34, {
        w: rr * 1.35,
        lines: 2,
        size: 24,
        min: 20,
        font: displayFont(800),
        color: inkOn(c.accent, t),
        align: "center",
        lh: 1.05,
      });
      ctx.restore();
      edgeFrame(ctx, t, 30, 30, W - 60, H - 60, k.a, 0.45);
    } else if (kind === "report") {
      ruler(ctx, 34, topY, H - topY - 160, true, 28, WHITE, 0.6);
      ruler(ctx, 80, 34, W - 160, false, 28, WHITE, 0.6);
      stampFrame(ctx, W - 135, topY + 52, 240, 104, 0.07, WHITE, 0.8);
      ctx.save();
      ctx.translate(W - 135, topY + 52);
      ctx.rotate(0.07);
      draw(ctx, word(p, "seal", "FOUND"), 0, -32, {
        w: 200,
        lines: 2,
        size: 30,
        min: 22,
        font: displayFont(800),
        color: WHITE,
        align: "center",
        lh: 1,
      });
      ctx.restore();
    } else {
      edgeFrame(ctx, t, 36, 36, W - 72, H - 72, WHITE, 0.55);
      keyline(ctx, 54, 54, W - 108, H - 108, 4, k.a, 0.45, 1.5);
      tiltedMotif(ctx, t, "motif", 118, topY + 30, 76, -0.2, k.a, k.b, 0.85);
    }
    stackUp(ctx, rows, x, bottom);
    brandMark(ctx, left ? z.left : W / 2, by, left ? "left" : "center");
  },
};
