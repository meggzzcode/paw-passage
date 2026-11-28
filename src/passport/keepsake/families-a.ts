// Families 1-5, photo-first: travel postcard, magazine cover, detective ID, trading card, certificate.
// The photograph is the artwork (full-bleed, or a collectible card that is nearly all photo). Everything else is a
// delicate, semi-transparent overlay in the margins: soft local scrims, small handwriting, hairline frames and vector
// ornaments. Adventure personality comes from theme entries (accent colours, motifs, frame style and words).
import { circle, cleanText, fitText, postmark, type Ctx } from "./render";
import {
  W,
  brand,
  fillRound,
  fontOf,
  para,
  paraHeight,
  placeholder,
  rays,
  rnd,
  type FamilyDef,
  type Prep,
  type Slot,
} from "./kit";
import { motif, roundRectPath, starPath } from "./ornaments";
import { drawPlacedPhoto, type PlacedPhoto } from "./photo";
import {
  Stack,
  handFont,
  lightLeak,
  mix,
  onDark,
  pool,
  rgba,
  scrimV,
  shadowed,
  tracked,
  vignette,
} from "./kit-photo-first-a";
import {
  badge,
  cornerBrackets,
  hairFrame,
  holoSheen,
  laurelRule,
  lensRing,
  postageStamp,
  rosette,
  softBarcode,
  sparkle,
  squiggle,
  stampRing,
} from "./ornaments-a";
import { hash } from "./kit";

type Photos = ReadonlyArray<PlacedPhoto | null | undefined>;
const TITLE_LIKE =
  /\b(champion|master|expert|explorer|captain|ranger|legend|star|hero|detective|agent|chef|ace|wizard|boss|queen|king|genius|pro)\b/i;
const word = (p: Prep, k: string, d = "") => p.t.words[k] ?? d;
const cased = (p: Prep, s: string) => (p.t.upper ? s.toUpperCase() : s);
const WHITE = "#ffffff";
const SOFT_WHITE = "rgba(255,255,255,0.92)";

const full = (p: Prep): Slot => ({ x: 0, y: 0, w: W, h: p.H });

/** Margins and edges of the area where essential text lives. The photo itself stays full-bleed. */
function zone(p: Prep) {
  const story = p.story;
  const sq = p.spec.size === "square";
  return {
    story,
    sq,
    mx: story ? 76 : 68,
    top: story ? 262 : sq ? 64 : 76,
    bottom: p.H - (story ? 352 : sq ? 66 : 88),
    /** Tallest the bottom text stack may get, so the dog keeps the photograph. */
    maxStack: Math.round(p.H * (story ? 0.4 : sq ? 0.5 : 0.44)),
  };
}

/** Date on the left, a small barcode (optional) and the quiet brand line on the right. */
function footerRow(
  ctx: Ctx,
  st: Stack,
  p: Prep,
  x: number,
  w: number,
  o: { code?: boolean; drop?: number } = {},
): void {
  st.add(
    42,
    (y) => {
      const base = y + 32;
      let right = x + w;
      brand(ctx, right, base, "right", "rgba(255,255,255,0.82)", 26);
      ctx.font = fontOf("serif", 400, true)(26);
      right -= ctx.measureText("pawsandpassage.com").width + 22;
      if (o.code) {
        softBarcode(ctx, right - 120, y + 2, 120, 38, hash(p.name + p.head), WHITE, 0.8);
        right -= 142;
      }
      if (p.date)
        tracked(ctx, p.date, x, base, {
          size: 34,
          key: "sans",
          weight: 600,
          color: SOFT_WHITE,
          maxW: Math.max(160, right - x),
          track: 3,
        });
    },
    { gap: 22 },
  );
}

/** The photo, full-bleed in its slot. Without one: a quiet theme ground with the adventure's motif in the upper half. */
function basePhoto(ctx: Ctx, p: Prep, photo: PlacedPhoto | null | undefined, s: Slot): void {
  if (photo && drawPlacedPhoto(ctx, photo, s.x, s.y, s.w, s.h)) return;
  const { t } = p;
  const c = t.palette;
  ctx.save();
  ctx.beginPath();
  ctx.rect(s.x, s.y, s.w, s.h);
  ctx.clip();
  const g = ctx.createLinearGradient(0, s.y, 0, s.y + s.h);
  g.addColorStop(0, c.bg2);
  g.addColorStop(1, mix(c.bg, "#000000", 0.55));
  ctx.fillStyle = g;
  ctx.fillRect(s.x, s.y, s.w, s.h);
  const cy = s.y + s.h * 0.34;
  rays(ctx, s.x + s.w / 2, cy, Math.hypot(s.w, s.h), 24, c.accent2, 0.12);
  for (let i = 0; i < 6; i++) {
    ctx.globalAlpha = 0.2;
    motif(
      ctx,
      i % 2 ? t.motif2 : "paw",
      s.x + (0.1 + rnd(i + 4) * 0.8) * s.w,
      s.y + (0.08 + rnd(i + 9) * 0.4) * s.h,
      s.w * 0.11,
      c.muted,
      c.muted,
    );
  }
  ctx.globalAlpha = 1;
  motif(ctx, t.motif, s.x + s.w / 2, cy, Math.min(s.w, s.h * 0.6) * 0.62, c.accent, c.accent2);
  ctx.restore();
}

/** Scrim sized to the text stack, so the type is readable on any photo without a visible panel. */
function stackScrim(ctx: Ctx, p: Prep, bottom: number, height: number, a = 0.62): void {
  const top = Math.max(p.H * 0.3, bottom - height - 300);
  scrimV(ctx, top, p.H, 0, a, W);
  pool(ctx, W / 2, bottom - height / 2, W * 0.75, height * 0.9 + 140, 0.18);
}

// ====================================================================== travel-postcard

export const travelPostcard: FamilyDef = {
  slots(p) {
    return [full(p)];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const z = zone(p);
    basePhoto(ctx, p, photos[0], slots[0] as Slot);
    vignette(ctx, W, H, 0.2);
    const acc = onDark(c.accent);
    const acc2 = onDark(c.accent2, 5);
    lightLeak(ctx, W, H, acc, 0.12, "tl");

    const x = z.mx;
    const w = W - 2 * z.mx;
    const st = new Stack();
    st.para(
      ctx,
      p.head,
      x,
      {
        w,
        lines: z.story ? 3 : 2,
        size: z.sq ? 74 : 90,
        min: 48,
        key: t.display,
        weight: 700,
        color: WHITE,
        lh: 1.05,
      },
      { gap: 10 },
    );
    st.hand(ctx, `Starring ${p.name}`, x, { w, lines: 1, size: 72, color: "#fff2dc" }, { gap: 4 });
    st.add(14, (y) => squiggle(ctx, x, x + 230, y + 8, acc2, 0.95), { gap: 18 });
    st.para(
      ctx,
      p.sub,
      x,
      { w, lines: 2, size: 38, min: 34, key: t.body, weight: 600, color: SOFT_WHITE, lh: 1.2 },
      { gap: 14, drop: 2 },
    );
    st.hand(
      ctx,
      p.memory,
      x,
      { w, lines: z.story ? 4 : 3, size: 50, color: SOFT_WHITE, lh: 1.08 },
      { gap: 16, drop: 1 },
    );
    footerRow(ctx, st, p, x, w);

    const h = st.height(z.maxStack);
    stackScrim(ctx, p, z.bottom, h);
    shadowed(ctx, () => st.draw(z.bottom, z.maxStack), 16, 0.5);

    // stamp and postmark, top right
    const sw = z.sq ? 118 : 134;
    const sh = Math.round(sw * 1.24);
    const sx = W - z.mx - sw + 8;
    const sy = z.story ? z.top : z.top - 22;
    postageStamp(ctx, sx, sy, sw, sh, 0.06, {
      paper: mix(c.card, "#ffffff", 0.35),
      ink: c.ink,
      accent: c.accent,
      accent2: c.accent2,
      motifId: t.motif,
      alpha: 0.9,
    });
    shadowed(
      ctx,
      () => postmark(ctx, sx - 16, sy + sh * 0.66, 50, word(p, "mark", "ON THE ROAD"), WHITE),
      8,
      0.5,
    );
    scrimV(ctx, 0, z.top + 130, 0.28, 0, W);
    // the greeting is a small letterspaced line in the top margin, not part of the text stack
    shadowed(
      ctx,
      () =>
        void tracked(
          ctx,
          word(p, "kicker", "ADVENTURE POSTCARD"),
          z.mx,
          z.top + (z.story ? 40 : 18),
          {
            size: 34,
            key: "sans",
            weight: 700,
            color: SOFT_WHITE,
            maxW: sx - z.mx - 70,
            track: 4,
          },
        ),
      12,
      0.55,
    );
    hairFrame(ctx, t, 26, 26, W - 52, H - 52, WHITE, acc);
  },
};

// ====================================================================== magazine-cover

export const magazineCover: FamilyDef = {
  slots(p) {
    return [full(p)];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const z = zone(p);
    const bold = t.frame === "bold" || t.display === "heavy";
    basePhoto(ctx, p, photos[0], slots[0] as Slot);
    vignette(ctx, W, H, 0.2);
    const acc = onDark(c.accent, 5);

    // masthead: small, left-aligned and kept inside the top 12% band, clear of the subject
    const mSize = z.story ? 68 : z.sq ? 52 : 58;
    const pad = z.story ? 84 : z.sq ? 30 : 40;
    const mBase = pad + Math.round(mSize * 0.85);
    scrimV(ctx, 0, mBase + 90, 0.42, 0, W);
    shadowed(
      ctx,
      () => {
        tracked(ctx, word(p, "masthead", "PAW & PASSAGE"), z.mx, mBase, {
          size: mSize,
          key: bold ? "heavy" : "serif",
          weight: bold ? 900 : 700,
          color: bold ? WHITE : acc,
          maxW: W - 2 * z.mx,
          track: bold ? 3 : 7,
          min: 40,
        });
        tracked(ctx, word(p, "tagline"), z.mx, mBase + 46, {
          size: 34,
          key: "sans",
          weight: 600,
          color: SOFT_WHITE,
          maxW: W - 2 * z.mx,
          track: 5,
        });
      },
      14,
      0.55,
    );

    const x = z.mx;
    const w = W - 2 * z.mx;
    const st = new Stack();
    st.add(
      42,
      (y) =>
        void tracked(ctx, word(p, "star", "COVER STAR"), x, y + 34, {
          size: 34,
          key: "sans",
          weight: 700,
          color: acc,
          maxW: w,
          track: 6,
        }),
      { gap: 8 },
    );
    st.para(
      ctx,
      cased(p, p.name),
      x,
      {
        w,
        lines: 1,
        size: z.sq ? 112 : 132,
        min: 60,
        key: t.display,
        weight: bold ? 900 : 700,
        color: WHITE,
        lh: 1,
      },
      { gap: 14 },
    );
    st.para(
      ctx,
      p.head,
      x,
      {
        w,
        lines: z.story ? 3 : 2,
        size: 52,
        min: 36,
        key: bold ? "condensed" : "serif",
        weight: 700,
        italic: !bold,
        color: acc,
        lh: 1.1,
      },
      { gap: 12 },
    );
    st.para(
      ctx,
      p.sub,
      x,
      { w, lines: 2, size: 38, min: 34, key: t.body, weight: 600, color: SOFT_WHITE, lh: 1.2 },
      { gap: 12, drop: 2 },
    );
    st.hand(
      ctx,
      p.memory ? `“${p.memory}”` : "",
      x,
      { w, lines: z.story ? 3 : 2, size: 48, color: SOFT_WHITE, lh: 1.08 },
      { gap: 14, drop: 1 },
    );
    footerRow(ctx, st, p, x, w, { code: true });
    const h = st.height(z.maxStack);
    stackScrim(ctx, p, z.bottom, h, 0.66);
    shadowed(ctx, () => st.draw(z.bottom, z.maxStack), 16, 0.5);
    hairFrame(ctx, t, 26, 26, W - 52, H - 52, acc, acc, 0.6);
  },
};

// ====================================================================== id-card (detective ID)

export const idCard: FamilyDef = {
  slots(p) {
    return [full(p)];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const z = zone(p);
    basePhoto(ctx, p, photos[0], slots[0] as Slot);
    vignette(ctx, W, H, 0.22);
    const acc = onDark(c.accent, 8.5);
    const acc2 = onDark(c.accent2, 4.5);

    const bx = 46;
    const by = z.story ? 262 : z.sq ? 52 : 60;
    const bw = W - 92;
    const bh = z.bottom + 22 - by;
    cornerBrackets(ctx, bx, by, bw, bh, 70, acc, 6, 0.92);

    const x = z.mx;
    const w = W - 2 * z.mx;
    const st = new Stack();
    st.add(
      42,
      (y) =>
        void tracked(ctx, cased(p, word(p, "org", "PAW & PASSAGE")), x, y + 34, {
          size: 34,
          key: "sans",
          weight: 700,
          color: acc,
          maxW: w,
          track: 4,
        }),
      { gap: 10, drop: 3 },
    );
    st.add(
      40,
      (y) =>
        void tracked(ctx, word(p, "name", "NAME"), x, y + 32, {
          size: 34,
          key: "sans",
          weight: 600,
          color: "rgba(255,255,255,0.8)",
          maxW: w,
          track: 6,
        }),
      { gap: 4 },
    );
    st.para(
      ctx,
      cased(p, p.name),
      x,
      {
        w,
        lines: 1,
        size: z.sq ? 100 : 118,
        min: 56,
        key: t.display,
        weight: 800,
        color: WHITE,
        lh: 1,
      },
      { gap: 12 },
    );
    st.add(
      40,
      (y) =>
        void tracked(ctx, word(p, "code", "CODENAME"), x, y + 32, {
          size: 34,
          key: "sans",
          weight: 600,
          color: "rgba(255,255,255,0.8)",
          maxW: w,
          track: 6,
        }),
      { gap: 4, drop: 4 },
    );
    st.hand(
      ctx,
      p.head,
      x,
      { w, lines: z.story ? 2 : 1, size: 78, color: acc, lh: 1.05 },
      { gap: 10 },
    );
    st.add(
      42,
      (y) => {
        if (!p.sub) return;
        tracked(ctx, `${word(p, "rank", "RANK")}: ${cased(p, p.sub)}`, x, y + 34, {
          size: 34,
          key: "sans",
          weight: 600,
          color: SOFT_WHITE,
          maxW: w,
          track: 3,
        });
      },
      { gap: 10, drop: 2 },
    );
    if (!p.sub) st.add(0, () => undefined, { gap: 0, drop: 0 });
    st.hand(
      ctx,
      p.memory,
      x,
      { w, lines: 2, size: 48, color: SOFT_WHITE, lh: 1.08 },
      { gap: 12, drop: 1 },
    );
    footerRow(ctx, st, p, x, w, { code: true });
    const h = st.height(z.maxStack);
    stackScrim(ctx, p, z.bottom, h, 0.66);
    shadowed(ctx, () => st.draw(z.bottom, z.maxStack), 16, 0.5);

    // top corners: tiny badge and magnifier lens
    const topY = by + 112;
    badge(ctx, bx + 112, topY, 64, { fill: acc, ink: inkFor(acc), motifId: t.motif, alpha: 0.92 });
    shadowed(ctx, () => lensRing(ctx, bx + bw - 120, topY, 54, WHITE, 0.62), 10, 0.45);
    if (t.variant === "passport") {
      const sy = z.bottom - h - 130;
      stampRing(ctx, W - z.mx - 100, sy, 84, WHITE, -0.22, 0.7);
      ctx.save();
      ctx.globalAlpha = 0.7;
      motif(ctx, t.motif, W - z.mx - 100, sy, 80, WHITE, WHITE);
      ctx.restore();
    } else if (t.variant === "tag") {
      ctx.save();
      ctx.strokeStyle = acc2;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 4;
      circle(ctx, bx + bw / 2, by - 4 + 38, 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx + bw / 2, by + 22);
      ctx.bezierCurveTo(bx + bw / 2 + 60, by - 40, bx + bw / 2 - 60, by - 40, bx + bw / 2, by + 22);
      ctx.stroke();
      ctx.restore();
    }
  },
};

function inkFor(bg: string): string {
  return mix(bg, "#000000", 0.78);
}

// ====================================================================== trading-card

function cardBox(p: Prep): Slot {
  // nearly the whole canvas: about 90% of the width and 84-86% of the height on Story
  const [cw, ch, y] =
    p.spec.size === "square"
      ? [900, 1010, 35]
      : p.spec.size === "portrait"
        ? [972, 1190, 80]
        : [972, 1590, 90];
  return { x: Math.round((W - cw) / 2), y, w: cw, h: ch };
}

const CARD_EDGE = 10;

export const tradingCard: FamilyDef = {
  slots(p) {
    const b = cardBox(p);
    return [
      { x: b.x + CARD_EDGE, y: b.y + CARD_EDGE, w: b.w - 2 * CARD_EDGE, h: b.h - 2 * CARD_EDGE },
    ];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const s = slots[0] as Slot;
    const b = cardBox(p);
    const acc = onDark(c.accent, 5);

    // ground: a light, clean pastel from the theme accent and vanilla, with a very gentle vignette
    const VANILLA = "#FFF8EF";
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, mix(c.accent, VANILLA, 0.8));
    g.addColorStop(1, mix(c.accent2, VANILLA, 0.86));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    vignette(ctx, W, H, 0.1);

    // card edge: a thin print border in the theme's own colour, with a soft drop shadow
    ctx.save();
    ctx.shadowColor = "rgba(60,40,20,0.3)";
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 12;
    fillRound(ctx, b.x, b.y, b.w, b.h, 44, mix(c.bg, "#ffffff", 0.3));
    ctx.restore();

    // photo fills the card
    ctx.save();
    roundRectPath(ctx, s.x, s.y, s.w, s.h, 32);
    ctx.clip();
    basePhoto(ctx, p, photos[0], s);
    scrimV(ctx, s.y, s.y + 300, 0.5, 0, W);
    ctx.restore();
    holoSheen(ctx, s.x, s.y, s.w, s.h, 32, [acc, "#ffffff", onDark(c.accent2, 4.5)], 0.14);
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    roundRectPath(ctx, s.x, s.y, s.w, s.h, 32);
    ctx.stroke();
    ctx.restore();

    const ix = s.x + 34;
    const iw = s.w - 68;
    const y0 = s.y + 30;
    shadowed(
      ctx,
      () => {
        tracked(ctx, word(p, "series", "ADVENTURE CARDS"), ix, y0 + 32, {
          size: 34,
          key: "sans",
          weight: 600,
          color: "rgba(255,255,255,0.88)",
          maxW: iw - 120,
          track: 4,
        });
        para(ctx, p.name, ix, y0 + 44, {
          w: iw - 120,
          lines: 1,
          size: 72,
          min: 40,
          key: t.display,
          weight: 700,
          color: WHITE,
          lh: 1,
        });
      },
      14,
      0.5,
    );
    badge(ctx, ix + iw - 46, y0 + 58, 46, {
      fill: acc,
      ink: inkFor(acc),
      motifId: t.motif,
      alpha: 0.9,
    });

    // bottom: soft scrim, then type pill, line and note
    const bottom = Math.min(s.y + s.h - 34, H - 312);
    const st = new Stack();
    st.add(
      58,
      (y) => {
        const label = `${word(p, "type", "EXPLORER")}  •  ${cased(p, p.head)}`;
        const fit = fitText(ctx, label, {
          maxWidth: iw - 56,
          maxLines: 1,
          size: 34,
          minSize: 34,
          font: fontOf("sans", 700),
        });
        ctx.font = fontOf("sans", 700)(fit.size);
        const tw = ctx.measureText(fit.lines[0] ?? "").width;
        const pw = Math.min(iw, tw + 56);
        fillRound(ctx, ix, y, pw, 58, 29, rgba(c.accent, 0.92));
        ctx.fillStyle = pickInk(c.accent);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(fit.lines[0] ?? "", ix + 28, y + 40);
      },
      { gap: 12 },
    );
    st.para(
      ctx,
      p.sub,
      ix,
      { w: iw, lines: 2, size: 46, min: 36, key: t.display, weight: 700, color: WHITE, lh: 1.1 },
      { gap: 8, drop: 2 },
    );
    st.hand(
      ctx,
      p.memory,
      ix,
      { w: iw, lines: 3, size: 46, color: SOFT_WHITE, lh: 1.08 },
      { gap: 10, drop: 1 },
    );
    st.add(
      40,
      (y) => {
        brand(ctx, ix + iw, y + 30, "right", "rgba(255,255,255,0.8)", 24);
        if (p.date)
          tracked(ctx, p.date, ix, y + 30, {
            size: 34,
            key: "sans",
            weight: 600,
            color: SOFT_WHITE,
            maxW: iw * 0.5,
            track: 3,
          });
      },
      { gap: 14 },
    );
    const maxH = Math.round(s.h * 0.21);
    const h = st.height(maxH);
    ctx.save();
    roundRectPath(ctx, s.x, s.y, s.w, s.h, 32);
    ctx.clip();
    scrimV(ctx, bottom - h - 260, s.y + s.h, 0, 0.74, W);
    ctx.restore();
    shadowed(ctx, () => st.draw(bottom, maxH), 14, 0.5);
    sparkle(ctx, s.x + s.w - 60, s.y + 150, 14, WHITE, 0.8);
    sparkle(ctx, s.x + s.w - 100, s.y + 190, 8, acc, 0.8);
    // shine for a hint of collectible foil
    void rnd;
  },
};

function pickInk(bg: string): string {
  // near-black or white, whichever reads better on the pill colour
  const dark = "#14181d";
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const n = h.length === 3 ? h.replace(/./g, (x) => x + x) : h;
    const v = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
    return 0.2126 * v[0]! + 0.7152 * v[1]! + 0.0722 * v[2]!;
  };
  return lum(bg) > 0.35 ? dark : WHITE;
}

// ====================================================================== certificate

export const certificate: FamilyDef = {
  slots(p) {
    return [full(p)];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const z = zone(p);
    basePhoto(ctx, p, photos[0], slots[0] as Slot);
    vignette(ctx, W, H, 0.2);
    const acc = onDark(c.accent, 5.5);
    const gold = onDark(c.accent2, 5);
    const cx = W / 2;
    const w = W - 2 * z.mx - 40;
    const k = z.sq ? 0.82 : 1;

    const st = new Stack();
    st.add(
      40,
      (y) =>
        void tracked(ctx, word(p, "top", "CERTIFICATE OF"), cx, y + 32, {
          size: 34,
          key: "sans",
          weight: 600,
          color: SOFT_WHITE,
          align: "center",
          maxW: w,
          track: 7,
        }),
      { gap: 6, drop: 3 },
    );
    st.para(
      ctx,
      word(p, "title", "ADVENTURE"),
      cx,
      {
        w,
        lines: 1,
        size: 76 * k,
        min: 46,
        key: t.display,
        weight: 700,
        color: WHITE,
        align: "center",
        lh: 1,
      },
      { gap: 8 },
    );
    st.add(30, (y) => laurelRule(ctx, cx, y + 14, 120, gold), { gap: 14, drop: 4 });
    st.hand(
      ctx,
      word(p, "intro", "This certifies that"),
      cx,
      { w, lines: 1, size: 54 * k, color: SOFT_WHITE, align: "center" },
      { gap: 0, drop: 2 },
    );
    st.hand(
      ctx,
      p.name,
      cx,
      { w, lines: 1, size: 112 * k, color: WHITE, align: "center", lh: 1, min: 48 },
      { gap: 6 },
    );
    const raw = cleanText(p.spec.headline, 60);
    if (raw) {
      // "has earned the title of" only for a title-like headline; otherwise "in recognition of"
      const phrase = TITLE_LIKE.test(raw) ? "has earned the title of" : "in recognition of";
      const start = 56 * k;
      let size = start;
      let lines = 2;
      for (; size >= 46; size -= 2) {
        ctx.font = fontOf(t.display, 600)(size);
        if (ctx.measureText(raw).width <= w) {
          lines = 1;
          break;
        }
      }
      if (lines === 2) size = Math.max(46, Math.round(start * 0.9));
      const o = {
        w,
        lines,
        size,
        min: 36,
        key: t.display,
        weight: 600,
        color: WHITE,
        align: "center" as const,
        lh: 1.1,
      };
      st.add(
        46 + paraHeight(ctx, raw, o),
        (y) => {
          ctx.font = fontOf("serif", 400, true)(38);
          ctx.fillStyle = SOFT_WHITE;
          ctx.textAlign = "center";
          ctx.textBaseline = "alphabetic";
          ctx.fillText(phrase, cx, y + 34);
          para(ctx, raw, cx, y + 46, o);
        },
        { gap: 10, drop: 5 },
      );
    }
    st.para(
      ctx,
      p.sub || word(p, "foot"),
      cx,
      {
        w,
        lines: 2,
        size: 38,
        min: 34,
        key: "serif",
        italic: true,
        color: SOFT_WHITE,
        align: "center",
        lh: 1.2,
      },
      { gap: 10, drop: 1 },
    );
    st.add(
      74,
      (y) => {
        if (p.date)
          tracked(ctx, p.date, cx, y + 32, {
            size: 34,
            key: "sans",
            weight: 600,
            color: SOFT_WHITE,
            align: "center",
            maxW: w,
            track: 4,
          });
        brand(ctx, cx, y + 68, "center", "rgba(255,255,255,0.8)", 26);
      },
      { gap: 20 },
    );
    // the stack stays in the bottom third so it never lands on the face; tight formats keep name, title, date
    const maxH = Math.round(H * (z.story ? 0.25 : z.sq ? 0.34 : 0.3));
    const h = st.height(maxH);
    stackScrim(ctx, p, z.bottom, h, 0.62);
    shadowed(ctx, () => st.draw(z.bottom + 12, maxH), 16, 0.5);

    // small award rosette in the top-left outer margin, clear of a typical head position
    rosette(ctx, z.mx + 20, z.top + 56, z.sq ? 44 : 52, {
      fill: c.accent,
      fill2: mix(c.accent, "#000000", 0.25),
      ink: pickInk(c.accent),
      motifId: t.motif,
    });
    hairFrame(ctx, t, 26, 26, W - 52, H - 52, WHITE, gold);
    for (const [x, y] of [
      [W - z.mx + 10, z.top + 10],
      [z.mx - 10, z.bottom + 20],
    ] as const)
      sparkle(ctx, x + 10, y, 16, gold, 0.85);
    void starPath;
    void placeholder;
    void handFont;
  },
};

export { starPath, placeholder };
