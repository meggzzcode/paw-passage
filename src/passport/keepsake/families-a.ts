// Families 1-5: travel postcard, magazine cover, ID card, trading card, certificate.
import { circle, drawPaw, perforatedRect, postmark, type Ctx } from "./render";
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
  paraHeight,
  paraOutlined,
  paraUp,
  pattern,
  placeholder,
  rays,
  rnd,
  softOn,
  tilt,
  type FamilyDef,
  type Prep,
  type Slot,
} from "./kit";
import { motif, roundRectPath, starPath } from "./ornaments";
import type { PlacedPhoto } from "./photo";

type Photos = ReadonlyArray<PlacedPhoto | null | undefined>;
const word = (p: Prep, k: string, d = "") => p.t.words[k] ?? d;
const cased = (p: Prep, s: string) => (p.t.upper ? s.toUpperCase() : s);

// ====================================================================== travel-postcard

export const travelPostcard: FamilyDef = {
  slots(p) {
    if (p.spec.size === "square") return [{ x: 70, y: 100, w: 520, h: 780 }];
    if (p.story) return [{ x: 90, y: 230, w: 900, h: 860 }];
    return [{ x: 90, y: 110, w: 900, h: 620 }];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const s = slots[0] as Slot;
    const side = p.spec.size === "square";
    paperBackground(ctx, t, W, H);
    // a tint band so the three postcard themes differ beyond colour
    ctx.fillStyle = c.bg2;
    ctx.globalAlpha = 0.45;
    ctx.fillRect(0, side ? H - 150 : H - 260, W, side ? 150 : 260);
    ctx.globalAlpha = 1;
    frame(ctx, t, 28, 28, W - 56, H - 56, c.ink, c.accent2);

    ctx.save();
    tilt(ctx, s, -0.012);
    mat(ctx, s, c.card, 14);
    drawSlot(ctx, t, s, photos[0], 0);
    ctx.restore();

    // stamp and postmark
    const sx = side ? 830 : s.x + s.w - 150;
    const sy = side ? 95 : s.y - 46;
    ctx.save();
    ctx.translate(sx + 85, sy + 105);
    ctx.rotate(0.05);
    ctx.translate(-(sx + 85), -(sy + 105));
    perforatedRect(ctx, sx, sy, 170, 210, 7, c.bg);
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(sx + 16, sy + 16, 138, 178);
    motif(ctx, t.motif, sx + 85, sy + 96, 92, c.accent, c.accent2);
    para(ctx, word(p, "stamp", "ADVENTURE"), sx + 85, sy + 158, {
      w: 120,
      lines: 1,
      size: 20,
      min: 10,
      key: "serif",
      weight: 700,
      color: c.accent,
      align: "center",
    });
    ctx.restore();
    postmark(
      ctx,
      side ? sx - 52 : sx - 120,
      sy + 150,
      66,
      p.date || word(p, "mark", "ON THE ROAD"),
      c.ink,
    );

    const x = side ? 630 : s.x;
    const w = side ? 380 : s.w;
    let y = side ? 340 : s.y + s.h + 56;
    const k = p.story ? 1.4 : 1;
    y = para(ctx, word(p, "kicker", "ADVENTURE POSTCARD"), x, y, {
      w,
      lines: 1,
      size: 24 * k,
      key: "sans",
      weight: 700,
      color: c.accent,
    });
    ctx.strokeStyle = c.accent2;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 2);
    ctx.lineTo(x + 120, y + 2);
    ctx.stroke();
    y += 22;
    y = para(ctx, p.head, x, y, {
      w,
      lines: side ? 3 : 2,
      size: (side ? 56 : 72) * k,
      key: t.display,
      weight: 700,
      color: c.ink,
      lh: 1.1,
    });
    y = para(ctx, `Starring ${p.name}`, x, y + 10, {
      w,
      lines: 1,
      size: 38 * k,
      key: "serif",
      italic: true,
      color: c.accent,
    });
    if (p.date)
      y = para(ctx, p.date, x, y, {
        w,
        lines: 1,
        size: 26 * k,
        key: t.body,
        color: softOn(c.bg, t),
      });
    if (p.sub)
      y = para(ctx, p.sub, x, y + 6, {
        w,
        lines: 2,
        size: 28 * k,
        key: t.body,
        weight: 700,
        color: c.ink,
      });
    const limit = H - p.safeBottom - 50;
    if (p.memory) {
      const size = 30 * k;
      para(ctx, p.memory, x, y + 22, {
        w,
        lines: Math.min(5, linesFit(y + 22, limit, size, 1.32)),
        size,
        key: "serif",
        italic: true,
        color: c.ink,
        lh: 1.32,
      });
    }
    brand(ctx, x + w, H - p.safeBottom + 8, "right", softOn(c.bg, t), 24);
  },
};

// ====================================================================== magazine-cover

export const magazineCover: FamilyDef = {
  slots(p) {
    return [{ x: 0, y: 0, w: W, h: p.H }];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const s = slots[0] as Slot;
    const bold = t.frame === "bold";
    const hasPhoto = Boolean(photos[0]);
    if (hasPhoto) drawSlot(ctx, t, s, photos[0], 0);
    else {
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);
      rays(ctx, W / 2, H * 0.5, H, 28, c.bg2, 0.22);
      motif(ctx, t.motif, W / 2, H * 0.47, 640, c.accent, c.accent2);
      for (let i = 0; i < 10; i++)
        motif(
          ctx,
          t.motif2,
          80 + rnd(i + 3) * 920,
          330 + rnd(i + 11) * (H - 700),
          46 + rnd(i) * 40,
          c.accent2,
          c.accent,
        );
    }
    // scrims keep the type readable over any photo
    const top = ctx.createLinearGradient(0, 0, 0, 520);
    top.addColorStop(0, "rgba(0,0,0,0.6)");
    top.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, W, 520);
    const bh = Math.round(H * 0.58);
    const bot = ctx.createLinearGradient(0, H - bh, 0, H);
    bot.addColorStop(0, "rgba(0,0,0,0)");
    bot.addColorStop(0.55, "rgba(0,0,0,0.6)");
    bot.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = bot;
    ctx.fillRect(0, H - bh, W, bh);

    if (!bold && t.frame !== "none") frame(ctx, t, 26, 26, W - 52, H - 52, c.accent, c.accent);
    const mTop = p.story ? 170 : 50;
    const dateTxt = p.date;
    if (bold) {
      // solid masthead band, loud and flat
      const bandH = p.story ? 230 : 190;
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, mTop - 20, W, bandH);
      ctx.fillStyle = c.accent;
      ctx.fillRect(0, mTop - 20 + bandH, W, 52);
      for (const [x, y] of [
        [70, mTop + 40],
        [W - 70, mTop + 40],
      ] as const)
        motif(ctx, t.motif2, x, y, 60, c.accent, c.accent2);
      para(ctx, word(p, "masthead", "PAW & PASSAGE"), W / 2, mTop - 4, {
        w: 800,
        lines: 1,
        size: 170,
        key: t.display,
        weight: 900,
        color: c.accent,
        align: "center",
        lh: 1,
      });
      para(ctx, word(p, "tagline"), 40, mTop - 20 + bandH + 8, {
        w: 600,
        lines: 1,
        size: 28,
        key: "condensed",
        weight: 700,
        color: inkOn(c.accent, t),
      });
      para(ctx, dateTxt, W - 40, mTop - 20 + bandH + 8, {
        w: 360,
        lines: 1,
        size: 28,
        key: "condensed",
        weight: 700,
        color: inkOn(c.accent, t),
        align: "right",
      });
    } else {
      const mx = W / 2;
      para(ctx, word(p, "masthead", "PAW & PASSAGE"), mx, mTop, {
        w: 920,
        lines: 1,
        size: 120,
        key: "serif",
        weight: 700,
        color: c.accent,
        align: "center",
        lh: 1,
      });
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      for (const y of [mTop + 140, mTop + 148]) {
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(W - 60, y);
        ctx.stroke();
      }
      para(ctx, word(p, "tagline"), 60, mTop + 160, {
        w: 640,
        lines: 1,
        size: 22,
        key: "sans",
        weight: 700,
        color: c.ink,
      });
      para(ctx, dateTxt, W - 60, mTop + 160, {
        w: 320,
        lines: 1,
        size: 22,
        key: "sans",
        weight: 700,
        color: c.ink,
        align: "right",
      });
    }

    // cover lines, stacked up from the bottom edge
    const bottom = H - p.safeBottom + (p.story ? 0 : 10);
    const bw = 190;
    const by = bottom - 118;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(W - 60 - bw, by, bw, 118);
    barcode(ctx, W - 60 - bw + 16, by + 12, bw - 32, 62, p.name + p.head, "#111111");
    para(ctx, "pawsandpassage.com", W - 60 - bw / 2, by + 82, {
      w: bw - 20,
      lines: 1,
      size: 18,
      key: "sans",
      weight: 700,
      color: "#111111",
      align: "center",
    });
    // cover star
    const starW = 660;
    const nameTop = paraUp(ctx, p.name, 70, bottom, {
      w: starW,
      lines: 1,
      size: 58,
      key: t.display,
      weight: 900,
      color: c.ink === "#101820" || bold ? "#ffffff" : c.ink,
      lh: 1,
    });
    const labelTop = paraUp(ctx, word(p, "star", "COVER STAR"), 70, nameTop - 2, {
      w: starW,
      lines: 1,
      size: 24,
      key: "sans",
      weight: 700,
      color: c.accent,
    });
    let y = labelTop - 26;
    if (p.memory)
      y = paraUp(ctx, `“${p.memory}”`, 70, y, {
        w: 940,
        lines: p.story ? 3 : 2,
        size: 30,
        key: "serif",
        italic: true,
        color: "#ffffff",
        lh: 1.25,
      });
    y -= 12;
    if (p.sub)
      y = paraUp(ctx, p.sub, 70, y, {
        w: 940,
        lines: 2,
        size: 44,
        key: bold ? "condensed" : "serif",
        weight: 700,
        italic: !bold,
        color: c.accent,
        lh: 1.1,
      });
    y -= 8;
    const hs = p.story ? 190 : p.spec.size === "portrait" ? 160 : 128;
    const lines = p.story ? 3 : 2;
    const text = p.head;
    if (bold) {
      const o = {
        w: 940,
        lines,
        size: hs,
        key: t.display,
        weight: 900,
        color: "#ffffff",
        lh: 0.98,
      } as const;
      paraOutlined(ctx, text, 70, y - paraHeight(ctx, text, o), o, "rgba(0,0,0,0.85)", 10);
    } else {
      paraUp(ctx, text, 70, y, {
        w: 940,
        lines,
        size: hs * 0.82,
        key: "serif",
        weight: 700,
        color: "#ffffff",
        lh: 1.02,
      });
    }
  },
};

// ====================================================================== id-card

export const idCard: FamilyDef = {
  slots(p) {
    if (p.spec.size === "square") return [{ x: 105, y: 290, w: 300, h: 400 }];
    const cy = p.story ? 250 : 90;
    return [{ x: 230, y: cy + 140, w: 620, h: p.story ? 660 : 460 }];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const s = slots[0] as Slot;
    const horizontal = p.spec.size === "square";
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    // faint grid and watermark motif
    ctx.strokeStyle = c.bg2;
    ctx.lineWidth = 2;
    for (let x = 0; x < W; x += 54) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 54) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.save();
    ctx.globalAlpha = 0.18;
    motif(ctx, t.motif, W * 0.82, H * 0.16, 520, c.accent, c.accent2);
    ctx.restore();

    const cardInk = inkOn(c.card, t);
    const cardSoft = softOn(c.card, t);
    const card: Slot = horizontal
      ? { x: 60, y: 150, w: 960, h: 790 }
      : {
          x: 120,
          y: p.story ? 250 : 90,
          w: 840,
          h: H - (p.story ? 250 : 90) - (p.story ? 290 : 90),
        };
    const passport = t.variant === "passport";
    const tagCard = t.variant === "tag";
    if (!passport) {
      // lanyard strap (a thin string for a parcel tag)
      const sw = tagCard ? 10 : 76;
      ctx.fillStyle = tagCard ? c.accent2 : c.accent;
      ctx.fillRect(card.x + card.w / 2 - sw / 2, 0, sw, card.y + 30);
      if (!tagCard) {
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(card.x + card.w / 2 + 20, 0, 18, card.y + 30);
      }
    }
    // card with shadow
    fillRound(ctx, card.x + 10, card.y + 14, card.w, card.h, 34, "rgba(0,0,0,0.35)");
    fillRound(ctx, card.x, card.y, card.w, card.h, 34, c.card, c.accent, 5);
    if (passport) {
      ctx.save();
      ctx.globalAlpha = 0.13;
      motif(
        ctx,
        t.motif,
        card.x + card.w / 2,
        card.y + card.h * 0.55,
        Math.min(card.w, card.h) * 0.8,
        c.accent,
        c.accent2,
      );
      ctx.restore();
    }
    // header band
    ctx.save();
    roundRectPath(ctx, card.x, card.y, card.w, card.h, 34);
    ctx.clip();
    ctx.fillStyle = c.accent;
    ctx.fillRect(card.x, card.y, card.w, 112);
    ctx.fillStyle = c.accent2;
    ctx.fillRect(card.x, card.y + 112, card.w, 8);
    ctx.restore();
    const onAcc = inkOn(c.accent, t);
    if (tagCard) {
      circle(ctx, card.x + card.w / 2, card.y + 26, 13);
      ctx.fillStyle = c.bg;
      ctx.fill();
    } else if (!passport) fillRound(ctx, card.x + card.w / 2 - 70, card.y + 18, 140, 22, 11, c.bg);
    para(ctx, cased(p, word(p, "org", "PAW & PASSAGE")), card.x + card.w / 2, card.y + 52, {
      w: card.w - 120,
      lines: 1,
      size: 28,
      key: "sans",
      weight: 700,
      color: onAcc,
      align: "center",
    });
    para(ctx, word(p, "title", "OFFICIAL ID"), card.x + card.w / 2, card.y + 52 + 40, {
      w: card.w - 120,
      lines: 1,
      size: 20,
      key: "sans",
      color: onAcc,
      align: "center",
    });

    // photo with corner brackets
    ctx.save();
    drawSlot(ctx, t, s, photos[0], 0);
    ctx.restore();
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 6;
    const L = 40;
    for (const [x, y, dx, dy] of [
      [s.x, s.y, 1, 1],
      [s.x + s.w, s.y, -1, 1],
      [s.x, s.y + s.h, 1, -1],
      [s.x + s.w, s.y + s.h, -1, -1],
    ] as const) {
      ctx.beginPath();
      ctx.moveTo(x + dx * L, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * L);
      ctx.stroke();
    }

    const fk = horizontal ? 1 : p.story ? 1.3 : 1;
    const field = (
      label: string,
      value: string,
      x: number,
      y: number,
      w: number,
      size0: number,
    ) => {
      const size = size0 * fk;
      para(ctx, label, x, y, {
        w,
        lines: 1,
        size: 20 * fk,
        key: "sans",
        weight: 700,
        color: cardSoft,
      });
      return para(ctx, value, x, y + 22 * fk, {
        w,
        lines: 1,
        size,
        key: t.display,
        weight: 700,
        color: cardInk,
        lh: 1.1,
      });
    };
    if (horizontal) {
      const x = card.x + 390;
      const w = card.w - 390 - 40;
      let y = card.y + 150;
      y = field(word(p, "name", "NAME"), cased(p, p.name), x, y, w, 64) + 16;
      y = field(word(p, "code", "CODENAME"), cased(p, p.head), x, y, w, 46) + 16;
      if (p.sub) y = field(word(p, "rank", "RANK"), cased(p, p.sub), x, y, w, 34) + 16;
      if (p.date) y = field(word(p, "date", "DATE"), p.date, x, y, w, 30) + 10;
      if (p.memory) {
        para(ctx, word(p, "note", "NOTE"), x, y, {
          w,
          lines: 1,
          size: 20,
          key: "sans",
          weight: 700,
          color: cardSoft,
        });
        para(ctx, p.memory, x, y + 22, {
          w,
          lines: linesFit(y + 22, card.y + card.h - 150, 24, 1.25),
          size: 24,
          key: "serif",
          italic: true,
          color: cardInk,
        });
      }
      barcode(ctx, card.x + 40, card.y + card.h - 120, card.w - 80, 50, p.name + p.head, cardInk);
      brand(ctx, card.x + card.w / 2, card.y + card.h - 28, "center", cardSoft, 24, "sans");
    } else {
      const x = card.x + 60;
      const w = card.w - 120;
      let y = s.y + s.h + 36;
      y = field(word(p, "name", "NAME"), cased(p, p.name), x, y, w, 66) + 14;
      y = field(word(p, "code", "CODENAME"), cased(p, p.head), x, y, w, 46) + 14;
      if (p.sub && p.date) {
        const half = (w - 30) / 2;
        const y1 = field(word(p, "rank", "RANK"), cased(p, p.sub), x, y, half, 32);
        const y2 = field(word(p, "date", "DATE"), p.date, x + half + 30, y, half, 32);
        y = Math.max(y1, y2) + 10;
      } else if (p.sub) y = field(word(p, "rank", "RANK"), cased(p, p.sub), x, y, w, 32) + 10;
      else if (p.date) y = field(word(p, "date", "DATE"), p.date, x, y, w, 32) + 10;
      const limit = card.y + card.h - 150;
      if (p.memory && y + 80 < limit) {
        para(ctx, word(p, "note", "NOTE"), x, y, {
          w,
          lines: 1,
          size: 20,
          key: "sans",
          weight: 700,
          color: cardSoft,
        });
        para(ctx, p.memory, x, y + 22, {
          w,
          lines: Math.min(4, linesFit(y + 22, limit, 26, 1.25)),
          size: 26,
          key: "serif",
          italic: true,
          color: cardInk,
        });
      }
      barcode(ctx, x, card.y + card.h - 124, w, 50, p.name + p.head, cardInk);
      brand(ctx, card.x + card.w / 2, card.y + card.h - 28, "center", cardSoft, 24, "sans");
    }
  },
};

// ====================================================================== trading-card

function cardBox(p: Prep): Slot {
  const ch = p.spec.size === "square" ? 960 : p.spec.size === "portrait" ? 1200 : 1316;
  const cw = Math.round(ch * (5 / 7));
  return { x: (W - cw) / 2, y: (p.H - ch) / 2, w: cw, h: ch };
}

export const tradingCard: FamilyDef = {
  slots(p) {
    const b = cardBox(p);
    const pad = Math.round(b.w * 0.045);
    return [
      { x: b.x + pad + 14, y: b.y + pad + 108, w: b.w - 2 * pad - 28, h: Math.round(b.h * 0.4) },
    ];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const s = slots[0] as Slot;
    const b = cardBox(p);
    const pad = Math.round(b.w * 0.045);
    ctx.fillStyle = c.ink;
    ctx.fillRect(0, 0, W, H);
    if (t.pattern) pattern(ctx, t.pattern, W, H, c.bg, 0.3);
    else rays(ctx, W / 2, H / 2, Math.hypot(W, H), 36, c.bg, 0.22);
    for (let i = 0; i < 14; i++) {
      ctx.globalAlpha = 0.2;
      motif(
        ctx,
        i % 2 ? t.motif2 : t.motif,
        rnd(i + 2) * W,
        rnd(i + 30) * H,
        60 + rnd(i) * 50,
        c.bg2,
        c.bg2,
      );
    }
    ctx.globalAlpha = 1;
    // card body: thick coloured border, cream inner panel
    fillRound(ctx, b.x + 12, b.y + 16, b.w, b.h, 40, "rgba(0,0,0,0.45)");
    fillRound(ctx, b.x, b.y, b.w, b.h, 40, c.bg);
    fillRound(ctx, b.x + pad, b.y + pad, b.w - 2 * pad, b.h - 2 * pad, 24, c.card, c.accent, 4);
    const inkC = inkOn(c.card, t);
    const softC = softOn(c.card, t);
    const ix = b.x + pad + 14;
    const iw = b.w - 2 * pad - 28;
    // name bar
    const nameH = 84;
    const ny = b.y + pad + 12;
    para(ctx, p.name, ix, ny + 4, {
      w: iw - 90,
      lines: 1,
      size: 58,
      key: t.display,
      weight: 700,
      color: inkC,
      lh: 1,
    });
    para(ctx, word(p, "series", "ADVENTURE CARDS"), ix, ny + 62, {
      w: iw - 90,
      lines: 1,
      size: 18,
      key: "sans",
      weight: 700,
      color: softC,
    });
    circle(ctx, ix + iw - 36, ny + nameH / 2 - 4, 36);
    ctx.fillStyle = c.accent;
    ctx.fill();
    motif(ctx, t.motif, ix + iw - 36, ny + nameH / 2 - 4, 44, inkOn(c.accent, t), c.accent2);
    // photo window
    ctx.fillStyle = c.accent;
    ctx.fillRect(s.x - 8, s.y - 8, s.w + 16, s.h + 16);
    drawSlot(ctx, t, s, photos[0], 0);
    ctx.strokeStyle = c.accent2;
    ctx.lineWidth = 3;
    ctx.strokeRect(s.x - 8, s.y - 8, s.w + 16, s.h + 16);
    // type ribbon
    const ty = s.y + s.h + 22;
    fillRound(ctx, ix, ty, iw, 52, 26, c.accent);
    para(ctx, `${word(p, "type", "EXPLORER")}  •  ${cased(p, p.head)}`, ix + iw / 2, ty + 9, {
      w: iw - 40,
      lines: 1,
      size: 30,
      key: "sans",
      weight: 700,
      color: inkOn(c.accent, t),
      align: "center",
    });
    // flavour box
    const fy = ty + 70;
    const fh = b.y + b.h - pad - 70 - fy;
    fillRound(ctx, ix, fy, iw, fh, 14, c.bg2, c.accent2, 2);
    const fInk = inkOn(c.bg2, t);
    let y = fy + 14;
    const fz = Math.max(1, b.h / 1100);
    if (p.sub)
      y = para(ctx, p.sub, ix + 18, y, {
        w: iw - 36,
        lines: 2,
        size: 32 * fz,
        key: t.body,
        weight: 700,
        color: fInk,
        lh: 1.15,
      });
    if (p.memory) {
      const size = 27 * fz;
      para(ctx, p.memory, ix + 18, y + 4, {
        w: iw - 36,
        lines: Math.min(5, linesFit(y + 4, fy + fh - 10, size, 1.25)),
        size,
        key: "serif",
        italic: true,
        color: fInk,
        lh: 1.25,
      });
    }
    // footer row
    const fyb = b.y + b.h - pad - 52;
    if (p.date)
      para(ctx, p.date, ix + 4, fyb, {
        w: iw * 0.5,
        lines: 1,
        size: 22,
        key: "sans",
        weight: 700,
        color: softC,
      });
    brand(ctx, ix + iw - 4, fyb + 22, "right", softC, 22);
  },
};

// ====================================================================== certificate

export const certificate: FamilyDef = {
  slots(p) {
    const d = p.spec.size === "square" ? 190 : p.story ? 300 : 250;
    const y = p.spec.size === "square" ? 262 : p.story ? 470 : 340;
    return [{ x: (W - d) / 2, y, w: d, h: d }];
  },
  draw(ctx, p, photos, slots) {
    const { t, H } = p;
    const c = t.palette;
    const s = slots[0] as Slot;
    const k = p.spec.size === "square" ? 0.8 : p.story ? 1.3 : 1;
    const cx = W / 2;
    paperBackground(ctx, t, W, H);
    ctx.fillStyle = c.bg2;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(48, 48, W - 96, 110);
    ctx.fillRect(48, H - 158, W - 96, 110);
    ctx.globalAlpha = 1;
    frame(ctx, t, 40, 40, W - 80, H - 80, c.ink, c.accent2);
    for (const [x, y] of [
      [62, 62],
      [W - 62, 62],
      [62, H - 62],
      [W - 62, H - 62],
    ] as const) {
      circle(ctx, x, y, 22);
      ctx.fillStyle = c.bg;
      ctx.fill();
      ctx.strokeStyle = c.accent2;
      ctx.lineWidth = 2;
      ctx.stroke();
      motif(ctx, t.motif2, x, y, 24, c.accent2, c.accent);
    }
    const top = p.story ? 210 : p.spec.size === "square" ? 100 : 130;
    let y = para(ctx, word(p, "top", "CERTIFICATE OF"), cx, top, {
      w: 800,
      lines: 1,
      size: 30 * k,
      key: "sans",
      weight: 700,
      color: c.accent,
      align: "center",
    });
    y = para(ctx, word(p, "title", "ADVENTURE"), cx, y + 2, {
      w: 860,
      lines: 1,
      size: 92 * k,
      key: t.display,
      weight: 700,
      color: c.ink,
      align: "center",
      lh: 1,
    });
    // medallion with laurel
    const mcx = s.x + s.w / 2;
    const mcy = s.y + s.h / 2;
    ctx.save();
    ctx.strokeStyle = c.accent2;
    ctx.lineWidth = 6;
    circle(ctx, mcx, mcy, s.w / 2 + 12);
    ctx.stroke();
    for (const side of [-1, 1])
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * (0.62 + i * 0.085);
        const lx = mcx + side * Math.cos(a) * (s.w / 2 + 34) * -1;
        const ly = mcy + Math.sin(a) * (s.w / 2 + 34);
        motif(ctx, "leaf", lx, ly, 26, c.accent2, c.accent2);
      }
    ctx.beginPath();
    ctx.arc(mcx, mcy, s.w / 2, 0, Math.PI * 2);
    ctx.clip();
    drawSlot(ctx, t, s, photos[0], 0);
    ctx.restore();
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 3;
    circle(ctx, mcx, mcy, s.w / 2);
    ctx.stroke();

    y = s.y + s.h + 54 * k;
    y = para(ctx, word(p, "intro", "This certifies that"), cx, y, {
      w: 800,
      lines: 1,
      size: 30 * k,
      key: "serif",
      italic: true,
      color: softOn(c.bg, t),
      align: "center",
    });
    y = para(ctx, p.name, cx, y + 6, {
      w: 860,
      lines: 1,
      size: 110 * k,
      key: t.display,
      weight: 700,
      color: c.accent,
      align: "center",
      lh: 1,
    });
    ctx.strokeStyle = c.accent2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 300, y + 4);
    ctx.lineTo(cx + 300, y + 4);
    ctx.stroke();
    y = para(ctx, word(p, "verb", "has earned"), cx, y + 22, {
      w: 800,
      lines: 1,
      size: 30 * k,
      key: "serif",
      italic: true,
      color: softOn(c.bg, t),
      align: "center",
    });
    const footY = H - (p.story ? 340 : p.spec.size === "square" ? 250 : 290);
    y = para(ctx, p.head, cx, y + 10, {
      w: 820,
      lines: 2,
      size: 64 * k,
      key: t.display,
      weight: 700,
      color: c.ink,
      align: "center",
      lh: 1.1,
    });
    const sub = p.sub || word(p, "foot");
    if (sub)
      y = para(ctx, sub, cx, y + 6, {
        w: 780,
        lines: 2,
        size: 28 * k,
        key: "serif",
        italic: true,
        color: softOn(c.bg, t),
        align: "center",
      });
    if (p.memory && y + 70 < footY)
      para(ctx, `“${p.memory}”`, cx, y + 8, {
        w: 780,
        lines: Math.min(2, linesFit(y + 8, footY, 26, 1.25)),
        size: 26,
        key: "serif",
        italic: true,
        color: c.ink,
        align: "center",
      });
    // seal and signature lines
    const sy = H - (p.story ? 250 : 175);
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const rr = (i % 2 ? 78 : 71) * (k > 1 ? 1 : 0.95);
      const x = cx + Math.cos(a) * rr;
      const yy = sy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = inkOn(c.accent, t);
    ctx.lineWidth = 2;
    circle(ctx, cx, sy, 56);
    ctx.stroke();
    motif(ctx, t.motif, cx, sy - 2, 64, inkOn(c.accent, t), inkOn(c.accent, t));
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(130, sy + 40);
    ctx.lineTo(380, sy + 40);
    ctx.moveTo(W - 380, sy + 40);
    ctx.lineTo(W - 130, sy + 40);
    ctx.stroke();
    para(ctx, p.date || "Date", 255, sy + 48, {
      w: 240,
      lines: 1,
      size: 22,
      key: "serif",
      color: softOn(c.bg, t),
      align: "center",
    });
    para(ctx, "Paw & Passage", W - 255, sy + 48, {
      w: 240,
      lines: 1,
      size: 22,
      key: "serif",
      color: softOn(c.bg, t),
      align: "center",
    });
    brand(ctx, cx, sy + 110, "center", softOn(c.bg, t), 22);
  },
};

export { starPath, placeholder };
