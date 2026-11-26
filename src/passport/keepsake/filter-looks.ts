// The photo filter looks. Six small, calm overlays that leave the dog photo almost untouched: one compact badge or
// strip with the adventure name, one short explainer line and a tiny name and date stamp, plus a very small
// Paws & Passage mark in the bottom-right corner. The adventure's theme palette tints them lightly.
import { circle, type Ctx } from "./render";
import { roundRectPath } from "./ornaments";
import { type PlacedPhoto } from "./photo";
import {
  FULL,
  alpha,
  brandMark,
  drawFilterPhoto,
  fHeavy,
  fMono,
  fRound,
  fRoundReg,
  fScript,
  label,
  labelUp,
  stampBadge,
  type FilterPrep,
  type Row,
  type Slot,
} from "./filter-kit";

export type FilterStyleId =
  | "caption-strip"
  | "corner-polaroid"
  | "camcorder-rec"
  | "ticket-corner"
  | "soft-badge"
  | "field-note";

export interface LookDef {
  /** Photo rectangle for this size, in canvas pixels. Always the whole canvas: the dog is the star. */
  photo(f: FilterPrep): Slot;
  draw(ctx: Ctx, f: FilterPrep, photo: PlacedPhoto | null | undefined): void;
}

function tilt(f: FilterPrep, v: number): number {
  return f.flip ? -v : v;
}

/** "Biscuit - 12 May 2026" as one small line, falling back to the name alone. */
function stampLine(f: FilterPrep): string {
  return f.date ? `${f.name}  ·  ${f.date}` : f.name;
}

/** Brand in the bottom-right corner, with the optional stamp badge sitting just above it. */
function corner(ctx: Ctx, f: FilterPrep, tone: "light" | "dark" = "light"): void {
  const br = brandMark(ctx, f, f.W - f.m, f.bottom - 48, "right", tone);
  stampBadge(ctx, f, f.W - f.m, 0, "right", { bottom: br.y - 8, maxW: 240 });
}

function row(
  text: string,
  font: Row["font"],
  size: number,
  color: string,
  lines = 1,
  min?: number,
): Row {
  return { text, font, size, color, lines, min: min ?? Math.max(12, Math.round(size * 0.6)) };
}

// ---------------------------------------------------------------- 1. caption strip

const captionStrip: LookDef = {
  photo: FULL,
  draw(ctx, f, photo) {
    const { p } = f;
    drawFilterPhoto(ctx, f, photo, FULL(f));
    labelUp(
      ctx,
      f,
      {
        kind: "title",
        alsoKinds: ["explainer", "chip"],
        shape: "round",
        fill: "rgba(24,20,32,0.6)",
        shadow: false,
        rows: [
          row(f.title, fRound, 30, "#ffffff", 1, 18),
          row(f.explainer, fRoundReg, 24, "rgba(255,255,255,0.94)", 2, 16),
          row(stampLine(f), fMono, 17, p.pa, 1, 11),
        ],
        x: f.m,
        y: 0,
        maxW: 600,
        textAlign: "left",
        padX: 22,
        padY: 14,
        deco: (c, w, h) => {
          c.fillStyle = p.a;
          roundRectPath(c, -w / 2 + 9, -h / 2 + 16, 5, h - 32, 2.5);
          c.fill();
        },
      },
      f.bottom,
    );
    corner(ctx, f);
  },
};

// ---------------------------------------------------------------- 2. small polaroid-style corner label

const cornerPolaroid: LookDef = {
  photo: FULL,
  draw(ctx, f, photo) {
    const { p } = f;
    drawFilterPhoto(ctx, f, photo, FULL(f));
    labelUp(
      ctx,
      f,
      {
        kind: "title",
        alsoKinds: ["explainer", "chip"],
        shape: "paper",
        fill: "#fffdf8",
        rows: [
          row(f.title, fScript, 34, p.aInk, 1, 20),
          row(f.explainer, fRoundReg, 22, p.ink, 2, 15),
          row(stampLine(f), fMono, 16, alpha(p.ink, 0.75), 1, 11),
        ],
        x: f.m,
        y: 0,
        maxW: 420,
        textAlign: "left",
        padX: 22,
        padY: 16,
        rot: tilt(f, -0.025),
      },
      f.bottom - 4,
    );
    corner(ctx, f);
  },
};

// ---------------------------------------------------------------- 3. camcorder REC date stamp

const camcorderRec: LookDef = {
  photo: FULL,
  draw(ctx, f, photo) {
    drawFilterPhoto(ctx, f, photo, FULL(f));
    const shade = "rgba(0,0,0,0.7)";
    label(ctx, f, {
      kind: "deco",
      shape: "pill",
      fill: "rgba(0,0,0,0.42)",
      shadow: false,
      rows: [{ ...row("rec", fMono, 24, "#ffffff", 1, 16), upper: true }],
      x: f.m,
      y: f.top,
      maxW: 140,
      lead: 26,
      padX: 14,
      padY: 5,
      leadDraw: (c, cx, cy) => {
        circle(c, cx, cy, 8);
        c.fillStyle = "#ff3b3b";
        c.fill();
      },
    });
    label(ctx, f, {
      kind: "chip",
      shape: "none",
      textOutline: shade,
      textAlign: "left",
      rows: [{ ...row(stampLine(f), fMono, 22, "#ffb347", 1, 13), upper: true }],
      x: f.m + 4,
      y: f.top + 50,
      maxW: 560,
      padX: 0,
      padY: 0,
    });
    labelUp(
      ctx,
      f,
      {
        kind: "explainer",
        shape: "none",
        textOutline: shade,
        textAlign: "left",
        rows: [row(f.explainer, fRound, 26, "#ffffff", 2, 16)],
        x: f.m + 4,
        y: 0,
        maxW: 620,
        padX: 0,
        padY: 0,
      },
      f.bottom - 4,
    );
    // title sits just above the explainer line
    const ex = f.items.find((i) => i.kind === "explainer");
    labelUp(
      ctx,
      f,
      {
        kind: "title",
        shape: "none",
        textOutline: shade,
        textAlign: "left",
        rows: [{ ...row(f.title, fHeavy, 34, "#ffffff", 1, 18), upper: true }],
        x: f.m + 4,
        y: 0,
        maxW: 620,
        padX: 0,
        padY: 0,
      },
      (ex ? ex.rect.y : f.bottom) - 8,
    );
    corner(ctx, f, "dark");
  },
};

// ---------------------------------------------------------------- 4. tiny ticket stub in the corner

const ticketCorner: LookDef = {
  photo: FULL,
  draw(ctx, f, photo) {
    const { p } = f;
    drawFilterPhoto(ctx, f, photo, FULL(f));
    const tw = 520;
    const th = 128;
    const stub = 150;
    const tx = f.m;
    const ty = f.bottom - th - 4;
    label(ctx, f, {
      kind: "deco",
      shape: "ticket",
      fill: "#fffdf8",
      rows: [],
      x: tx,
      y: ty,
      maxW: tw,
      wide: true,
      padY: th / 2 - 8,
      deco: (c, w, h) => {
        c.save();
        c.strokeStyle = alpha(p.a, 0.8);
        c.lineWidth = 2;
        c.setLineDash([6, 6]);
        c.beginPath();
        c.moveTo(w / 2 - stub, -h / 2 + 10);
        c.lineTo(w / 2 - stub, h / 2 - 10);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = p.a;
        c.fillRect(-w / 2 + 20, -h / 2 + 12, 44, 5);
        c.restore();
      },
    });
    const lw = tw - stub - 46;
    label(ctx, f, {
      kind: "title",
      shape: "none",
      textAlign: "left",
      rows: [{ ...row(f.title, fHeavy, 26, p.aInk, 1, 15) }],
      x: tx + 26,
      y: ty + 26,
      maxW: lw,
      padX: 0,
      padY: 0,
    });
    label(ctx, f, {
      kind: "explainer",
      shape: "none",
      textAlign: "left",
      rows: [row(f.explainer, fRoundReg, 20, p.ink, 2, 14)],
      x: tx + 26,
      y: ty + 64,
      maxW: lw,
      padX: 0,
      padY: 0,
    });
    label(ctx, f, {
      kind: "chip",
      shape: "none",
      rows: [
        { ...row("admit one", fMono, 12, p.aInk, 1, 10), upper: true },
        row(f.name, fRound, 22, p.ink, 2, 13),
        ...(f.date ? [row(f.date, fMono, 14, alpha(p.ink, 0.8), 2, 10)] : []),
      ],
      x: tx + tw - stub / 2,
      y: ty + 22,
      maxW: stub - 24,
      align: "center",
      padX: 0,
      padY: 0,
    });
    corner(ctx, f);
  },
};

// ---------------------------------------------------------------- 5. soft rounded badge (top-left)

const softBadge: LookDef = {
  photo: FULL,
  draw(ctx, f, photo) {
    const { p } = f;
    drawFilterPhoto(ctx, f, photo, FULL(f));
    const t = label(ctx, f, {
      kind: "title",
      shape: "pill",
      fill: p.a,
      outline: "#ffffff",
      outlineW: 3,
      shadow: false,
      rows: [row(f.title, fRound, 30, p.onA, 1, 17)],
      x: f.m,
      y: f.top,
      maxW: 560,
      padX: 24,
      padY: 10,
    });
    const e = label(ctx, f, {
      kind: "explainer",
      shape: "pill",
      fill: "rgba(255,255,255,0.84)",
      shadow: false,
      rows: [row(f.explainer, fRoundReg, 24, p.deep, 2, 16)],
      x: f.m + 6,
      y: t.y + t.h + 8,
      maxW: 600,
      padX: 20,
      padY: 8,
    });
    label(ctx, f, {
      kind: "chip",
      shape: "pill",
      fill: alpha(p.deep, 0.55),
      shadow: false,
      rows: [row(stampLine(f), fMono, 17, "#ffffff", 1, 11)],
      x: f.m + 6,
      y: e.y + e.h + 8,
      maxW: 460,
      padX: 16,
      padY: 6,
    });
    corner(ctx, f);
  },
};

// ---------------------------------------------------------------- 6. small field note (top-right)

const fieldNote: LookDef = {
  photo: FULL,
  draw(ctx, f, photo) {
    const { p } = f;
    drawFilterPhoto(ctx, f, photo, FULL(f));
    label(ctx, f, {
      kind: "title",
      alsoKinds: ["explainer", "chip"],
      shape: "paper",
      fill: "#fffaf0",
      rows: [
        row(f.title, fScript, 36, p.aInk, 2, 20),
        row(f.explainer, fScript, 27, p.ink, 2, 18),
        row(stampLine(f), fMono, 16, alpha(p.ink, 0.7), 1, 11),
      ],
      x: f.W - f.m,
      y: f.top,
      maxW: 420,
      align: "right",
      textAlign: "left",
      padX: 22,
      padY: 15,
      rot: tilt(f, 0.025),
      deco: (c, w, h) => {
        c.fillStyle = alpha(p.b, 0.85);
        c.fillRect(-w / 2 + 14, -h / 2 + 8, w - 28, 4);
      },
    });
    corner(ctx, f);
  },
};

export const LOOKS: Record<FilterStyleId, LookDef> = {
  "caption-strip": captionStrip,
  "corner-polaroid": cornerPolaroid,
  "camcorder-rec": camcorderRec,
  "ticket-corner": ticketCorner,
  "soft-badge": softBadge,
  "field-note": fieldNote,
};
