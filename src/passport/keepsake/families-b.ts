// Families 6-10: seasonal frame, event ticket, then-and-now, collage, poster.
import { circle, perforatedRect, type Ctx } from "./render";
import {
  W,
  barcode,
  brand,
  drawSlot,
  fillRound,
  frame,
  inkOn,
  linesFit,
  mat,
  paperBackground,
  para,
  paraUp,
  pattern,
  perforation,
  rays,
  rnd,
  softOn,
  tilt,
  type FamilyDef,
  type Prep,
  type Slot,
} from "./kit";
import { motif, motifBorder, roundRectPath, starPath } from "./ornaments";

const word = (p: Prep, k: string, d = "") => p.t.words[k] ?? d;
const cased = (p: Prep, s: string) => (p.t.upper ? s.toUpperCase() : s);

// ====================================================================== seasonal-frame

export const seasonalFrame: FamilyDef = {
  slots(p) {
    if (p.spec.size === "square") return [{ x: 100, y: 90, w: 880, h: 640 }];
    if (p.story) return [{ x: 100, y: 240, w: 880, h: 1180 }];
    return [{ x: 100, y: 100, w: 880, h: 880 }];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const s = slots[0] as Slot;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, c.bg);
    g.addColorStop(1, c.bg2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    if (t.motif === "sun") rays(ctx, W / 2, s.y + s.h / 2, H, 32, c.accent2, 0.35);
    for (let i = 0; i < 22; i++) {
      ctx.globalAlpha = 0.5;
      motif(
        ctx,
        i % 3 ? t.motif : t.motif2,
        rnd(i + 5) * W,
        rnd(i + 50) * H,
        50 + rnd(i) * 60,
        c.accent2,
        c.accent,
      );
    }
    ctx.globalAlpha = 1;
    frame(ctx, t, 24, 24, W - 48, H - 48, c.accent, c.accent2);
    // photo window with a mat and a border of motifs
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(s.x - 8 + 8, s.y - 8 + 10, s.w + 16, s.h + 16);
    ctx.fillStyle = c.card;
    ctx.fillRect(s.x - 18, s.y - 18, s.w + 36, s.h + 36);
    drawSlot(ctx, t, s, photos[0], 0);
    motifBorder(ctx, t.motif, s.x - 18, s.y - 18, s.w + 36, s.h + 36, 140, 58, c.accent, c.accent2);
    // ribbon across the lower edge of the photo
    const rh = p.story ? 150 : 130;
    const ry = s.y + s.h - rh * 0.4;
    const rx = s.x - 40;
    const rw = s.w + 80;
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(rx + 6, ry + 8, rw, rh);
    ctx.fillStyle = c.accent;
    ctx.fillRect(rx, ry, rw, rh);
    ctx.fillStyle = c.accent2;
    for (const side of [-1, 1]) {
      const ex = side < 0 ? rx : rx + rw;
      ctx.beginPath();
      ctx.moveTo(ex, ry + rh * 0.7);
      ctx.lineTo(ex + side * 46, ry + rh * 0.7);
      ctx.lineTo(ex + side * 46 - side * 24, ry + rh * 0.7 + 40);
      ctx.lineTo(ex, ry + rh * 0.7 + 40);
      ctx.closePath();
      ctx.fill();
    }
    const onAcc = inkOn(c.accent, t);
    para(ctx, cased(p, p.head), rx + rw / 2, ry + 18, {
      w: rw - 90,
      lines: 2,
      size: 68,
      key: t.display,
      weight: 700,
      color: onAcc,
      align: "center",
      lh: 1.05,
    });
    // caption area on a calm panel so the words stay readable on any season colour
    let y = ry + rh + 56;
    ctx.fillStyle = c.bg;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(40, ry + rh + 6, W - 80, H - 40 - (ry + rh + 6));
    ctx.globalAlpha = 1;
    const onBg = inkOn(c.bg, t);
    const soft = softOn(c.bg, t);
    if (p.sub)
      y = para(ctx, p.sub, W / 2, y, {
        w: 820,
        lines: 1,
        size: 34,
        key: "serif",
        italic: true,
        color: onBg,
        align: "center",
      });
    const who = p.date ? `${p.name}  •  ${p.date}` : p.name;
    y = para(ctx, who, W / 2, y + 4, {
      w: 860,
      lines: 1,
      size: 38,
      key: t.body,
      weight: 700,
      color: onBg,
      align: "center",
    });
    const limit = H - p.safeBottom - 20;
    if (p.memory && y + 36 < limit)
      para(ctx, p.memory, W / 2, y + 8, {
        w: 780,
        lines: Math.min(3, linesFit(y + 8, limit, 28, 1.25)),
        size: 28,
        key: "serif",
        italic: true,
        color: soft,
        align: "center",
      });
    brand(ctx, W / 2, H - p.safeBottom + 14, "center", soft, 24);
  },
};

// ====================================================================== event-ticket

function ticketBox(p: Prep): Slot {
  if (p.spec.size === "square") return { x: 60, y: 140, w: 960, h: 800 };
  const ty = p.story ? 200 : 70;
  return { x: 90, y: ty, w: 900, h: p.H - ty - (p.story ? 250 : 70) };
}

export const eventTicket: FamilyDef = {
  slots(p) {
    const T = ticketBox(p);
    if (p.spec.size === "square") return [{ x: T.x + 36, y: T.y + 150, w: 310, h: 470 }];
    const stubY = T.y + T.h - 250;
    return [
      { x: T.x + 40, y: T.y + 150, w: T.w - 80, h: stubY - (T.y + 150) - (p.story ? 430 : 400) },
    ];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const s = slots[0] as Slot;
    const T = ticketBox(p);
    const horizontal = p.spec.size === "square";
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    pattern(ctx, t.pattern ?? "diag", W, H, c.bg2, t.pattern === "stripes" ? 0.7 : 0.55);
    if (["filmstrip", "marquee", "stripes", "rope"].includes(t.frame))
      frame(ctx, t, 26, 26, W - 52, H - 52, c.accent, c.accent2);
    if (t.variant === "pass") {
      ctx.fillStyle = c.accent;
      ctx.fillRect(W / 2 - 40, 0, 80, T.y + 24);
    }
    for (let i = 0; i < 8; i++)
      motif(
        ctx,
        i % 2 ? t.motif : t.motif2,
        i % 2 ? 40 + rnd(i) * 50 : W - 40 - rnd(i) * 50,
        120 + (i * (H - 240)) / 8,
        70,
        c.accent2,
        c.accent,
      );

    const stubW = 230;
    const stubH = 250;
    const bodyR = horizontal ? T.x + T.w - stubW : T.x + T.w;
    const bodyB = horizontal ? T.y + T.h : T.y + T.h - stubH;
    // ticket shape: one rounded card; perforation and notches mark the stub
    fillRound(ctx, T.x + 10, T.y + 14, T.w, T.h, 26, "rgba(0,0,0,0.35)");
    fillRound(ctx, T.x, T.y, T.w, T.h, 26, c.card);
    if (t.frame === "stitch") {
      ctx.save();
      ctx.strokeStyle = c.accent2;
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 9]);
      roundRectPath(ctx, T.x + 12, T.y + 12, T.w - 24, T.h - 24, 18);
      ctx.stroke();
      ctx.restore();
    }
    const ink = inkOn(c.card, t);
    const soft = softOn(c.card, t);
    ctx.save();
    roundRectPath(ctx, T.x, T.y, T.w, T.h, 26);
    ctx.clip();
    ctx.fillStyle = c.accent;
    ctx.fillRect(T.x, T.y, horizontal ? bodyR - T.x : T.w, 118);
    ctx.fillStyle = c.accent2;
    ctx.fillRect(T.x, T.y + 118, horizontal ? bodyR - T.x : T.w, 10);
    ctx.restore();
    const onAcc = inkOn(c.accent, t);
    const bw = (horizontal ? bodyR - T.x : T.w) - 60;
    const bcx = T.x + (horizontal ? bodyR - T.x : T.w) / 2;
    para(ctx, word(p, "admit", "ADMIT ONE"), bcx, T.y + 14, {
      w: bw,
      lines: 1,
      size: 64,
      key: t.display,
      weight: 900,
      color: onAcc,
      align: "center",
      lh: 1,
    });
    para(ctx, word(p, "event"), bcx, T.y + 88, {
      w: bw,
      lines: 1,
      size: 22,
      key: "condensed",
      weight: 700,
      color: onAcc,
      align: "center",
    });
    if (horizontal) perforation(ctx, bodyR, T.y + 20, bodyR, T.y + T.h - 20, soft);
    else perforation(ctx, T.x + 24, bodyB, T.x + T.w - 24, bodyB, soft);
    // notches
    ctx.fillStyle = c.bg;
    const nr = 26;
    if (horizontal) {
      circle(ctx, bodyR, T.y, nr);
      ctx.fill();
      circle(ctx, bodyR, T.y + T.h, nr);
      ctx.fill();
    } else {
      circle(ctx, T.x, bodyB, nr);
      ctx.fill();
      circle(ctx, T.x + T.w, bodyB, nr);
      ctx.fill();
    }
    // photo
    ctx.fillStyle = c.accent;
    ctx.fillRect(s.x - 6, s.y - 6, s.w + 12, s.h + 12);
    drawSlot(ctx, t, s, photos[0], 0);
    // fields
    const fx = horizontal ? s.x + s.w + 36 : T.x + 40;
    const fw = horizontal ? bodyR - fx - 30 : T.w - 80;
    let y = horizontal ? s.y - 4 : s.y + s.h + 28;
    const label = (txt: string, yy: number) =>
      para(ctx, txt, fx, yy, {
        w: fw,
        lines: 1,
        size: 20,
        key: "condensed",
        weight: 700,
        color: soft,
      });
    label("ADMIT", y);
    y = para(ctx, cased(p, p.name), fx, y + 22, {
      w: fw,
      lines: 1,
      size: horizontal ? 50 : 62,
      key: t.display,
      weight: 900,
      color: ink,
      lh: 1.05,
    });
    y += 6;
    label("ADVENTURE", y);
    y = para(ctx, cased(p, p.head), fx, y + 22, {
      w: fw,
      lines: horizontal ? 3 : 2,
      size: horizontal ? 44 : 54,
      key: t.display,
      weight: 700,
      color: ink,
      lh: 1.08,
    });
    if (p.sub) {
      y += 4;
      y = para(ctx, p.sub, fx, y, {
        w: fw,
        lines: 2,
        size: 26,
        key: t.body,
        weight: 700,
        color: ink,
      });
    }
    if (p.date) {
      y += 4;
      label(word(p, "date", "DATE"), y);
      y = para(ctx, p.date, fx, y + 22, {
        w: fw,
        lines: 1,
        size: 32,
        key: t.body,
        weight: 700,
        color: ink,
      });
    }
    const limit = (horizontal ? bodyB : bodyB) - 28;
    if (p.memory && y + 32 < limit)
      para(ctx, p.memory, fx, y + 8, {
        w: fw,
        lines: Math.min(3, linesFit(y + 8, limit, 26, 1.25)),
        size: 26,
        key: "serif",
        italic: true,
        color: ink,
      });
    // stub
    const sx = horizontal ? bodyR + 30 : T.x + 50;
    const sw = horizontal ? stubW - 60 : T.w - 100;
    const sy = horizontal ? T.y + 40 : bodyB + 36;
    if (horizontal) {
      para(ctx, "ADMIT ONE", sx + sw / 2, sy, {
        w: sw,
        lines: 1,
        size: 34,
        key: t.display,
        weight: 900,
        color: ink,
        align: "center",
      });
      barcode(ctx, sx, sy + 70, sw, 300, p.name + p.head, ink);
      brand(ctx, sx + sw / 2, T.y + T.h - 40, "center", soft, 18, "sans");
    } else {
      barcode(ctx, sx, sy, sw, 110, p.name + p.head, ink);
      brand(ctx, T.x + T.w / 2, sy + 160, "center", soft, 24, "sans");
    }
  },
};

// ====================================================================== then-and-now

export const thenAndNow: FamilyDef = {
  slots(p) {
    if (p.spec.size === "square")
      return [
        { x: 80, y: 250, w: 420, h: 520 },
        { x: 580, y: 250, w: 420, h: 520 },
      ];
    if (p.story)
      return [
        { x: 120, y: 450, w: 840, h: 500 },
        { x: 120, y: 1060, w: 840, h: 500 },
      ];
    return [
      { x: 120, y: 290, w: 840, h: 370 },
      { x: 120, y: 770, w: 840, h: 370 },
    ];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    paperBackground(ctx, t, W, H);
    frame(ctx, t, 28, 28, W - 56, H - 56, c.ink, c.accent2);
    const top = p.story ? 200 : 70;
    let y = para(ctx, word(p, "kicker", "THEN & NOW"), W / 2, top, {
      w: 800,
      lines: 1,
      size: 26,
      key: "sans",
      weight: 700,
      color: c.accent,
      align: "center",
    });
    y = para(ctx, p.head, W / 2, y + 2, {
      w: 900,
      lines: 2,
      size: p.spec.size === "square" ? 66 : 78,
      key: t.display,
      weight: 700,
      color: c.ink,
      align: "center",
      lh: 1.08,
    });
    void y;
    slots.forEach((s, i) => {
      ctx.save();
      tilt(ctx, s, i ? 0.01 : -0.01);
      mat(ctx, s, c.card, 14);
      drawSlot(ctx, t, s, photos[i], i);
      const label = i ? word(p, "now", "NOW") : word(p, "then", "THEN");
      const col = i ? c.accent : c.accent2;
      fillRound(ctx, s.x - 26, s.y - 36, 170, 62, 10, col);
      para(ctx, label, s.x + 59, s.y - 30, {
        w: 140,
        lines: 1,
        size: 36,
        key: t.display,
        weight: 900,
        color: inkOn(col, t),
        align: "center",
        lh: 1,
      });
      ctx.restore();
    });
    // arrow between the two photos
    const a = slots[0] as Slot;
    const b = slots[1] as Slot;
    const side = p.spec.size === "square";
    const mx = side ? (a.x + a.w + b.x) / 2 : W / 2;
    const my = side ? a.y + a.h / 2 : (a.y + a.h + b.y) / 2;
    circle(ctx, mx, my, 38);
    ctx.fillStyle = c.accent;
    ctx.fill();
    ctx.strokeStyle = inkOn(c.accent, t);
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    if (side) {
      ctx.moveTo(mx - 16, my);
      ctx.lineTo(mx + 14, my);
      ctx.moveTo(mx + 2, my - 12);
      ctx.lineTo(mx + 14, my);
      ctx.lineTo(mx + 2, my + 12);
    } else {
      ctx.moveTo(mx, my - 16);
      ctx.lineTo(mx, my + 14);
      ctx.moveTo(mx - 12, my + 2);
      ctx.lineTo(mx, my + 14);
      ctx.lineTo(mx + 12, my + 2);
    }
    ctx.stroke();
    // footer
    const fy = b.y + b.h + 38;
    const limit = H - p.safeBottom - 24;
    const who = p.date ? `${p.name}  •  ${p.date}` : p.name;
    let y2 = para(ctx, who, W / 2, fy, {
      w: 860,
      lines: 1,
      size: 36,
      key: t.body,
      weight: 700,
      color: c.ink,
      align: "center",
    });
    if (p.sub)
      y2 = para(ctx, p.sub, W / 2, y2, {
        w: 860,
        lines: 1,
        size: 28,
        key: "serif",
        italic: true,
        color: c.accent,
        align: "center",
      });
    if (p.memory && y2 + 30 < limit)
      para(ctx, p.memory, W / 2, y2 + 2, {
        w: 820,
        lines: Math.min(2, linesFit(y2 + 2, limit, 26, 1.25)),
        size: 26,
        key: "serif",
        italic: true,
        color: softOn(c.bg, t),
        align: "center",
      });
    brand(ctx, W / 2, H - p.safeBottom + 20, "center", softOn(c.bg, t), 22);
  },
};

// ====================================================================== collage

function collageTiles(p: Prep, n: number): Slot[] {
  const sq = p.spec.size === "square";
  const area: Slot = sq
    ? { x: 70, y: 240, w: 940, h: 600 }
    : p.story
      ? { x: 70, y: 430, w: 940, h: 1090 }
      : { x: 70, y: 300, w: 940, h: 800 };
  const g = 36;
  const half = (v: number) => (v - g) / 2;
  let tiles: Slot[];
  if (n <= 1) tiles = [area];
  else if (n === 2)
    tiles = sq
      ? [
          { x: area.x, y: area.y, w: half(area.w), h: area.h },
          { x: area.x + half(area.w) + g, y: area.y, w: half(area.w), h: area.h },
        ]
      : [
          { x: area.x, y: area.y, w: area.w, h: half(area.h) },
          { x: area.x, y: area.y + half(area.h) + g, w: area.w, h: half(area.h) },
        ];
  else if (n === 3)
    tiles = sq
      ? [
          { x: area.x, y: area.y, w: area.w * 0.55, h: area.h },
          { x: area.x + area.w * 0.55 + g, y: area.y, w: area.w * 0.45 - g, h: half(area.h) },
          {
            x: area.x + area.w * 0.55 + g,
            y: area.y + half(area.h) + g,
            w: area.w * 0.45 - g,
            h: half(area.h),
          },
        ]
      : [
          { x: area.x, y: area.y, w: area.w, h: area.h * 0.55 },
          { x: area.x, y: area.y + area.h * 0.55 + g, w: half(area.w), h: area.h * 0.45 - g },
          {
            x: area.x + half(area.w) + g,
            y: area.y + area.h * 0.55 + g,
            w: half(area.w),
            h: area.h * 0.45 - g,
          },
        ];
  else
    tiles = [0, 1, 2, 3].map((i) => ({
      x: area.x + (i % 2) * (half(area.w) + g),
      y: area.y + Math.floor(i / 2) * (half(area.h) + g),
      w: half(area.w),
      h: half(area.h),
    }));
  return tiles;
}

export const collage: FamilyDef = {
  slots(p, count) {
    const n = p.t.variant === "quad" ? 4 : count <= 0 ? 3 : Math.min(4, count);
    return collageTiles(p, n).map((t) => ({
      x: t.x + 14,
      y: t.y + 14,
      w: t.w - 28,
      h: t.h - 14 - 56,
    }));
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    paperBackground(ctx, t, W, H);
    ctx.fillStyle = c.bg2;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 14; i++) {
      circle(ctx, rnd(i + 1) * W, rnd(i + 40) * H, 70 + rnd(i) * 120);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const v = t.variant ?? "";
    if (t.frame !== "none") frame(ctx, t, 28, 28, W - 56, H - 56, c.ink, c.accent2);
    if (v === "map" && slots.length > 1) {
      ctx.save();
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.setLineDash([2, 18]);
      ctx.beginPath();
      slots.forEach((s, i) => {
        const px = s.x + s.w / 2;
        const py = s.y + s.h / 2;
        if (i) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      });
      ctx.stroke();
      ctx.restore();
    }
    const top = p.story ? 190 : 70;
    let y = para(ctx, word(p, "kicker", "FAVORITE MOMENTS"), W / 2, top, {
      w: 800,
      lines: 1,
      size: 26,
      key: "sans",
      weight: 700,
      color: c.accent,
      align: "center",
    });
    y = para(ctx, p.head, W / 2, y + 2, {
      w: 920,
      lines: 2,
      size: p.spec.size === "square" ? 60 : 84,
      key: t.display,
      weight: 700,
      color: c.ink,
      align: "center",
      lh: 1.05,
    });
    void y;
    const rots = [-0.022, 0.018, 0.02, -0.016];
    slots.forEach((s, i) => {
      ctx.save();
      tilt(ctx, s, rots[i % 4] ?? 0);
      if (v === "stamps") perforatedRect(ctx, s.x - 14, s.y - 14, s.w + 28, s.h + 70, 9, c.bg);
      else mat(ctx, s, c.card, 14, 56);
      if (v === "swatch") {
        ctx.fillStyle = [c.accent, c.accent2, c.ink, c.bg2][i % 4] as string;
        ctx.fillRect(s.x, s.y + s.h + 8, s.w, 34);
      }
      drawSlot(ctx, t, s, photos[i], i);
      if (v === "quad") {
        ctx.fillStyle = ["#7fc97f", "#f2d14a", "#e08a2e", "#8ec5ef"][i % 4] as string;
        ctx.globalAlpha = 0.24;
        ctx.fillRect(s.x, s.y, s.w, s.h);
        ctx.globalAlpha = 1;
        para(
          ctx,
          ["SPRING", "SUMMER", "AUTUMN", "WINTER"][i % 4] as string,
          s.x + 12,
          s.y + s.h + 12,
          {
            w: s.w - 60,
            lines: 1,
            size: 26,
            key: "sans",
            weight: 700,
            color: softOn(c.card, t),
          },
        );
      }
      if (v === "map") motif(ctx, "pin", s.x + s.w - 6, s.y - 6, 62, c.accent, c.card);
      else if (v !== "swatch" && v !== "quad")
        // tiny motif where a polaroid caption would be
        motif(
          ctx,
          i % 2 ? t.motif2 : t.motif,
          s.x + s.w - 24,
          s.y + s.h + 32,
          30,
          c.accent2,
          c.accent,
        );
      ctx.restore();
    });
    const last = slots.reduce((m, s) => Math.max(m, s.y + s.h), 0);
    const fy = Math.min(last + 80, H - p.safeBottom - 100);
    const who = p.date ? `${p.name}  •  ${p.date}` : p.name;
    let y2 = para(ctx, who, W / 2, fy, {
      w: 860,
      lines: 1,
      size: 36,
      key: t.body,
      weight: 700,
      color: c.ink,
      align: "center",
    });
    const limit = H - p.safeBottom + 6;
    if (p.sub)
      y2 = para(ctx, p.sub, W / 2, y2, {
        w: 860,
        lines: 1,
        size: 28,
        key: "serif",
        italic: true,
        color: c.accent,
        align: "center",
      });
    if (p.memory && y2 + 30 < limit)
      para(ctx, p.memory, W / 2, y2, {
        w: 820,
        lines: Math.min(2, linesFit(y2, limit, 26, 1.25)),
        size: 26,
        key: "serif",
        italic: true,
        color: softOn(c.bg, t),
        align: "center",
      });
    brand(ctx, W / 2, H - p.safeBottom + 34, "center", softOn(c.bg, t), 22);
  },
};

// ====================================================================== poster

export const poster: FamilyDef = {
  slots(p) {
    const bold = p.t.frame === "bold" && p.t.variant !== "framed";
    if (bold) {
      if (p.spec.size === "square") return [{ x: 80, y: 430, w: 410, h: 410 }];
      if (p.story) return [{ x: 190, y: 770, w: 700, h: 700 }];
      return [{ x: 280, y: 480, w: 520, h: 520 }];
    }
    if (p.spec.size === "square") return [{ x: 70, y: 360, w: 520, h: 500 }];
    if (p.story) return [{ x: 110, y: 640, w: 860, h: 700 }];
    return [{ x: 110, y: 400, w: 860, h: 500 }];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const s = slots[0] as Slot;
    const bold = t.frame === "bold" && t.variant !== "framed";
    const sq = p.spec.size === "square";
    const top = p.story ? 190 : 60;
    if (bold) {
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);
      pattern(ctx, t.pattern ?? "rays", W, H, c.bg2, 1, s.x + s.w / 2, s.y + s.h / 2);
      // kicker band
      ctx.fillStyle = c.accent;
      ctx.fillRect(0, top, W, 66);
      para(ctx, word(p, "kicker", "POSTER"), W / 2, top + 12, {
        w: 960,
        lines: 1,
        size: 36,
        key: "heavy",
        weight: 900,
        color: inkOn(c.accent, t),
        align: "center",
        lh: 1,
      });
      const hy = top + 90;
      para(ctx, cased(p, p.head), W / 2, hy, {
        w: 940,
        lines: sq ? 2 : 3,
        size: sq ? 96 : p.story ? 150 : 130,
        key: t.display,
        weight: 900,
        color: c.ink,
        align: "center",
        lh: 0.98,
      });
      // scalloped plate around the photo
      const cx = s.x + s.w / 2;
      const cy = s.y + s.h / 2;
      const r = s.w / 2;
      ctx.fillStyle = c.accent2;
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        circle(ctx, cx + Math.cos(a) * (r + 18), cy + Math.sin(a) * (r + 18), 22);
        ctx.fill();
      }
      circle(ctx, cx, cy, r + 14);
      ctx.fillStyle = c.card;
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      drawSlot(ctx, t, s, photos[0], 0);
      ctx.restore();
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 6;
      circle(ctx, cx, cy, r);
      ctx.stroke();
      // motif sticker and rosette
      motif(ctx, t.motif, s.x + s.w - 10, s.y + 40, sq ? 170 : 230, c.accent, c.accent2);
      const rx = s.x + 40;
      const ry = s.y + s.h - 40;
      const rr = sq ? 84 : 112;
      starPath(ctx, rx, ry, rr, 16, 0.82);
      ctx.fillStyle = c.accent;
      ctx.fill();
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(-0.2);
      para(ctx, word(p, "seal", "BEST IN SHOW"), 0, -rr * 0.36, {
        w: rr * 1.35,
        lines: 2,
        size: rr * 0.3,
        key: "heavy",
        weight: 900,
        color: inkOn(c.accent, t),
        align: "center",
        lh: 1.05,
      });
      ctx.restore();
      // fields
      const fx = sq ? s.x + s.w + 90 : 70;
      const fw = sq ? W - fx - 70 : 940;
      let y = sq ? s.y + 10 : s.y + s.h + 56;
      if (t.pattern === "stripes" || t.pattern === "dots") {
        // a calm card behind the words so a busy backdrop never fights the text
        ctx.save();
        ctx.globalAlpha = 0.9;
        const px = sq ? fx - 24 : 50;
        const py = sq ? s.y - 10 : y - 22;
        fillRound(
          ctx,
          px,
          py,
          sq ? W - px - 50 : W - 100,
          (sq ? H - p.safeBottom - 20 : H - p.safeBottom + 50) - py,
          26,
          c.card,
        );
        ctx.restore();
      }
      const al: CanvasTextAlign = sq ? "left" : "center";
      const x = sq ? fx : W / 2;
      if (!sq) {
        y = para(ctx, p.name, x, y - 6, {
          w: fw,
          lines: 1,
          size: p.story ? 84 : 72,
          key: t.display,
          weight: 900,
          color: c.ink,
          align: al,
          lh: 1,
        });
        const line2 = [p.date ? `${word(p, "field2", "ON")} ${p.date}` : "", p.sub]
          .filter(Boolean)
          .join("  \u2022  ");
        y = para(ctx, line2, x, y + 4, {
          w: fw,
          lines: 1,
          size: 32,
          key: t.body,
          weight: 700,
          color: c.ink,
          align: al,
        });
      } else {
        y = para(ctx, word(p, "field1", "BY"), x, y, {
          w: fw,
          lines: 1,
          size: 26,
          key: "heavy",
          weight: 900,
          color: c.accent,
          align: al,
        });
        y = para(ctx, p.name, x, y, {
          w: fw,
          lines: 1,
          size: sq ? 66 : 78,
          key: t.display,
          weight: 900,
          color: c.ink,
          align: al,
          lh: 1,
        });
        if (p.date) {
          y = para(ctx, word(p, "field2", "ON"), x, y + 6, {
            w: fw,
            lines: 1,
            size: 24,
            key: "heavy",
            weight: 900,
            color: c.accent,
            align: al,
          });
          y = para(ctx, p.date, x, y, {
            w: fw,
            lines: 1,
            size: 36,
            key: t.body,
            weight: 700,
            color: c.ink,
            align: al,
          });
        }
        if (p.sub)
          y = para(ctx, p.sub, x, y + 6, {
            w: fw,
            lines: 2,
            size: 30,
            key: t.body,
            weight: 700,
            color: c.ink,
            align: al,
          });
      }
      const limit = H - p.safeBottom - 30;
      if (p.memory && y + 30 < limit)
        para(ctx, p.memory, x, y + 8, {
          w: fw,
          lines: Math.min(sq ? 6 : 2, linesFit(y + 8, limit, 28, 1.25)),
          size: 28,
          key: "serif",
          italic: true,
          color: c.ink,
          align: al,
        });
      brand(
        ctx,
        sq ? W - 70 : W / 2,
        H - p.safeBottom + 30,
        sq ? "right" : "center",
        inkOn(c.bg, t),
        24,
      );
    } else {
      // field report on graph paper (or a framed print for the "framed" variant)
      const report = t.variant !== "framed";
      paperBackground(ctx, t, W, H);
      ctx.strokeStyle = c.bg2;
      ctx.lineWidth = 1.5;
      if (report) {
        for (let x = 0; x <= W; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        for (let y = 0; y <= H; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
      }
      ctx.save();
      ctx.globalAlpha = 0.16;
      motif(ctx, t.motif, W - 230, H - p.safeBottom - 120, 480, c.accent, c.accent2);
      ctx.restore();
      frame(ctx, t, 30, 30, W - 60, H - 60, c.ink, c.accent);
      const kw = 330;
      fillRound(ctx, 70, top + 8, kw, 52, 4, c.ink);
      para(ctx, word(p, "kicker", "FIELD REPORT"), 70 + kw / 2, top + 14, {
        w: kw - 30,
        lines: 1,
        size: 30,
        key: "condensed",
        weight: 700,
        color: c.bg,
        align: "center",
      });
      para(ctx, cased(p, p.head), 70, top + 80, {
        w: 940,
        lines: 2,
        size: sq ? 72 : p.story ? 120 : 100,
        key: t.display,
        weight: 700,
        color: c.ink,
        lh: 1,
      });
      // specimen photo with ruler ticks
      mat(ctx, s, c.card, 12);
      drawSlot(ctx, t, s, photos[0], 0);
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 2;
      if (t.variant === "ground") {
        ctx.fillStyle = c.accent;
        for (let gx = s.x; gx < s.x + s.w; gx += 22) {
          const gh = 14 + ((gx * 7) % 5) * 5;
          ctx.beginPath();
          ctx.moveTo(gx, s.y + s.h + 12);
          ctx.lineTo(gx + 5, s.y + s.h + 12 - gh);
          ctx.lineTo(gx + 11, s.y + s.h + 12);
          ctx.closePath();
          ctx.fill();
        }
      }
      for (let i = 0; report && i <= 20; i++) {
        const tx = s.x + (s.w * i) / 20;
        ctx.beginPath();
        ctx.moveTo(tx, s.y - 12);
        ctx.lineTo(tx, s.y - (i % 5 ? 20 : 32));
        ctx.stroke();
      }
      for (let i = 0; report && i <= 20; i++) {
        const ty = s.y + (s.h * i) / 20;
        ctx.beginPath();
        ctx.moveTo(s.x - 12, ty);
        ctx.lineTo(s.x - (i % 5 ? 20 : 32), ty);
        ctx.stroke();
      }
      if (report)
        para(ctx, "FIG. 1", s.x, s.y + s.h + 18, {
          w: 200,
          lines: 1,
          size: 24,
          key: "condensed",
          weight: 700,
          color: softOn(c.bg, t),
        });
      // fields table
      const fx = sq ? s.x + s.w + 60 : 70;
      const fw = sq ? W - fx - 70 : 940;
      let y = sq ? s.y + 10 : s.y + s.h + 66;
      const row = (label: string, value: string, size: number, lines = 1) => {
        ctx.strokeStyle = c.ink;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fx, y);
        ctx.lineTo(fx + fw, y);
        ctx.stroke();
        para(ctx, label, fx, y + 6, {
          w: fw,
          lines: 1,
          size: 20,
          key: "condensed",
          weight: 700,
          color: c.accent,
        });
        y =
          para(ctx, value, fx, y + 30, {
            w: fw,
            lines,
            size,
            key: "serif",
            weight: 700,
            color: c.ink,
            lh: 1.1,
          }) + 6;
      };
      row(word(p, "field1", "BY"), cased(p, p.name), sq ? 54 : 60);
      if (p.date) row(word(p, "field2", "ON"), p.date, 34);
      if (p.sub) row("FINDING", p.sub, 30, 2);
      const limit = H - p.safeBottom - 30;
      if (p.memory && y + 70 < limit) {
        row("NOTES", "", 4);
        para(ctx, p.memory, fx, y - 6, {
          w: fw,
          lines: Math.min(sq ? 6 : 3, linesFit(y - 6, limit, 28, 1.25)),
          size: 28,
          key: "serif",
          italic: true,
          color: c.ink,
        });
      }
      // stamp (a motif sticker on framed prints)
      if (!report)
        motif(ctx, t.motif, s.x + s.w - 14, s.y + 24, sq ? 150 : 190, c.accent, c.accent2);
      const sx = sq ? s.x + s.w - 20 : s.x + s.w - 70;
      const sy = s.y + s.h - 40;
      if (report) {
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(-0.28);
        ctx.strokeStyle = c.accent;
        ctx.fillStyle = c.accent;
        ctx.lineWidth = 7;
        ctx.globalAlpha = 0.85;
        roundRectPath(ctx, -150, -52, 300, 104, 10);
        ctx.stroke();
        ctx.lineWidth = 2;
        roundRectPath(ctx, -140, -42, 280, 84, 6);
        ctx.stroke();
        para(ctx, word(p, "seal", "FOUND"), 0, -26, {
          w: 250,
          lines: 1,
          size: 40,
          key: "condensed",
          weight: 900,
          color: c.accent,
          align: "center",
          lh: 1,
        });
        ctx.restore();
      }
      brand(ctx, sq ? W - 70 : W - 70, H - p.safeBottom + 30, "right", softOn(c.bg, t), 24);
    }
  },
};

export { paraUp, barcode };
