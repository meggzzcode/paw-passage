// Delicate vector ornaments for the photo-first keepsakes: postage stamp, award rosette, detective badge, lens ring,
// viewfinder corners, hairline frames, laurel rules, sparkles and holographic sheen. All canvas paths, no images,
// each drawn small and semi-transparent so they live in the margins and never cover the dog's face.
import { circle, type Ctx } from "./render";
import { motif, roundRectPath, starPath } from "./ornaments";
import { rgba } from "./kit-photo-first-a";
import type { MotifId, ThemeConfig } from "./themes";

// ---------------------------------------------------------------- frames

/** A restrained border inset from the canvas edge; the theme's frame style only changes its character. */
export function hairFrame(
  ctx: Ctx,
  t: ThemeConfig,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  accent: string,
  alpha = 0.78,
): void {
  if (t.frame === "none") return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  switch (t.frame) {
    case "double":
    case "marquee":
      ctx.strokeRect(x, y, w, h);
      ctx.globalAlpha = alpha * 0.7;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);
      break;
    case "ticks": {
      ctx.lineWidth = 3;
      const L = 54;
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
    case "scallop":
    case "lace": {
      // a perforated edge: a row of small dots, like the edge of a stamp sheet
      ctx.fillStyle = color;
      const step = t.frame === "lace" ? 22 : 26;
      const r = 3;
      for (let px = x; px <= x + w; px += step) {
        circle(ctx, px, y, r);
        ctx.fill();
        circle(ctx, px, y + h, r);
        ctx.fill();
      }
      for (let py = y + step; py < y + h; py += step) {
        circle(ctx, x, py, r);
        ctx.fill();
        circle(ctx, x + w, py, r);
        ctx.fill();
      }
      break;
    }
    case "stripes": {
      // airmail dashes in the theme's two colours
      ctx.lineWidth = 7;
      ctx.setLineDash([30, 30]);
      ctx.strokeStyle = color;
      ctx.strokeRect(x, y, w, h);
      ctx.lineDashOffset = -30;
      ctx.strokeStyle = accent;
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
      break;
    }
    case "stitch":
    case "rope":
      ctx.setLineDash(t.frame === "rope" ? [4, 6] : [16, 10]);
      ctx.lineWidth = t.frame === "rope" ? 4 : 2.5;
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
      break;
    case "filmstrip": {
      ctx.fillStyle = color;
      for (let px = x + 8; px < x + w - 20; px += 44) {
        ctx.fillRect(px, y - 10, 20, 12);
        ctx.fillRect(px, y + h - 2, 20, 12);
      }
      ctx.strokeRect(x, y, w, h);
      break;
    }
    default:
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);
  }
  ctx.restore();
}

/** Four viewfinder corner brackets. */
export function cornerBrackets(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  len: number,
  color: string,
  lw = 5,
  alpha = 0.9,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  for (const [cx, cy, dx, dy] of [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * len, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * len);
    ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- travel

/** A small semi-transparent postage stamp with the theme's motif, tilted a touch. */
export function postageStamp(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  rot: number,
  o: {
    paper: string;
    ink: string;
    accent: string;
    accent2: string;
    motifId: MotifId;
    alpha?: number;
  },
): void {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rot);
  ctx.translate(-w / 2, -h / 2);
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 5;
  ctx.globalAlpha = o.alpha ?? 0.92;
  ctx.fillStyle = o.paper;
  ctx.fillRect(0, 0, w, h);
  ctx.shadowColor = "transparent";
  // perforation: paper-coloured bites cut out of the edge are drawn as dark half circles at low alpha
  ctx.globalCompositeOperation = "destination-out";
  const r = 6;
  const nx = Math.round(w / 20);
  const ny = Math.round(h / 20);
  for (let i = 0; i <= nx; i++) {
    for (const py of [0, h]) {
      circle(ctx, (w * i) / nx, py, r);
      ctx.fill();
    }
  }
  for (let j = 0; j <= ny; j++) {
    for (const px of [0, w]) {
      circle(ctx, px, (h * j) / ny, r);
      ctx.fill();
    }
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.strokeStyle = o.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, w - 28, h - 28);
  motif(ctx, o.motifId, w / 2, h / 2, Math.min(w, h) * 0.52, o.accent, o.accent2);
  ctx.restore();
}

/** A dashed route arc with a small pin at the end, drawn in a margin. */
export function routeArc(
  ctx: Ctx,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  alpha = 0.7,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.setLineDash([4, 12]);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo((x1 + x2) / 2, Math.min(y1, y2) - 70, x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

// ---------------------------------------------------------------- awards

/** A small award rosette: scalloped disc, inner ring, motif and two ribbon tails. */
export function rosette(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  o: { fill: string; fill2: string; ink: string; motifId: MotifId; alpha?: number },
): void {
  ctx.save();
  ctx.globalAlpha = o.alpha ?? 0.95;
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 4;
  // tails
  ctx.fillStyle = o.fill2;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + s * r * 0.15, cy + r * 0.5);
    ctx.lineTo(cx + s * r * 0.75, cy + r * 1.9);
    ctx.lineTo(cx + s * r * 0.42, cy + r * 1.68);
    ctx.lineTo(cx + s * r * 0.08, cy + r * 1.95);
    ctx.closePath();
    ctx.fill();
  }
  // scalloped disc
  ctx.fillStyle = o.fill;
  ctx.beginPath();
  const n = 22;
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const rr = i % 2 ? r * 0.9 : r;
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = o.ink;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 2.5;
  circle(ctx, cx, cy, r * 0.7);
  ctx.stroke();
  ctx.globalAlpha = 1;
  motif(ctx, o.motifId, cx, cy, r * 0.82, o.ink, o.ink);
  ctx.restore();
}

/** Thin rule with a small star in the middle and leaves at the ends. */
export function laurelRule(ctx: Ctx, cx: number, y: number, halfW: number, color: string): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + s * 34, y);
    ctx.lineTo(cx + s * halfW, y);
    ctx.stroke();
    // a little sprig of leaves at the outer end
    for (let i = 0; i < 3; i++) {
      const lx = cx + s * (halfW + 14 + i * 16);
      ctx.save();
      ctx.translate(lx, y + (i % 2 ? 7 : -7));
      ctx.rotate(s * (i % 2 ? 0.7 : -0.7));
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  starPath(ctx, cx, y, 13, 5, 0.45);
  ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- detective

/** A magnifying-glass ring with its handle, drawn as a thin translucent outline. */
export function lensRing(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  color: string,
  alpha = 0.6,
  handleAngle = Math.PI * 0.25,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  circle(ctx, cx, cy, r);
  ctx.stroke();
  const hx = cx + Math.cos(handleAngle) * r;
  const hy = cy + Math.sin(handleAngle) * r;
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.lineTo(
    cx + Math.cos(handleAngle) * (r + r * 0.7),
    cy + Math.sin(handleAngle) * (r + r * 0.7),
  );
  ctx.stroke();
  // a little glint
  ctx.lineWidth = 5;
  ctx.globalAlpha = alpha * 0.85;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.72, Math.PI * 1.1, Math.PI * 1.42);
  ctx.stroke();
  ctx.restore();
}

/** A tiny badge: scalloped round shield, inner ring and the theme's motif. */
export function badge(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  o: { fill: string; ink: string; motifId: MotifId; alpha?: number },
): void {
  ctx.save();
  ctx.globalAlpha = o.alpha ?? 0.94;
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = o.fill;
  ctx.beginPath();
  const n = 16;
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.93 : r;
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = o.ink;
  ctx.lineWidth = 2.5;
  circle(ctx, cx, cy, r * 0.74);
  ctx.stroke();
  ctx.globalAlpha = 1;
  motif(ctx, o.motifId, cx, cy, r * 0.92, o.ink, o.ink);
  ctx.restore();
}

/** A circular rubber stamp ring, used as a visa or approval mark. */
export function stampRing(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  color: string,
  rot = -0.2,
  alpha = 0.8,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  circle(ctx, 0, 0, r);
  ctx.stroke();
  ctx.lineWidth = 2;
  circle(ctx, 0, 0, r - 12);
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- small touches

/** A four-point sparkle. */
export function sparkle(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  color: string,
  alpha = 0.9,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const rr = i % 2 ? r * 0.22 : r;
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** A hand-drawn wavy underline from x1 to x2. */
export function squiggle(
  ctx: Ctx,
  x1: number,
  x2: number,
  y: number,
  color: string,
  alpha = 0.9,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y);
  const step = 26;
  for (let x = x1; x < x2; x += step) {
    ctx.quadraticCurveTo(x + step / 4, y - 7, x + step / 2, y);
    ctx.quadraticCurveTo(x + (step * 3) / 4, y + 7, Math.min(x + step, x2), y);
  }
  ctx.stroke();
  ctx.restore();
}

/** Thin white bars like a barcode, drawn without a box so it sits lightly on the photo. */
export function softBarcode(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number,
  color: string,
  alpha = 0.85,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  let cx = x;
  let n = seed || 7;
  while (cx < x + w) {
    n = (Math.imul(n, 1103515245) + 12345) >>> 0;
    const bar = 2 + (n % 4);
    if (cx + bar > x + w) break;
    ctx.fillRect(cx, y, bar, h);
    cx += bar + 2 + ((n >> 8) % 3);
  }
  ctx.restore();
}

/** A faint diagonal holographic sheen across a rounded rectangle, tinted by the theme. */
export function holoSheen(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  tints: [string, string, string],
  alpha = 0.16,
): void {
  ctx.save();
  roundRectPath(ctx, x, y, w, h, r);
  ctx.clip();
  const g = ctx.createLinearGradient(x, y + h * 0.15, x + w, y + h * 0.85);
  g.addColorStop(0, rgba(tints[0], 0));
  g.addColorStop(0.3, rgba(tints[0], alpha));
  g.addColorStop(0.5, rgba(tints[1], alpha * 1.15));
  g.addColorStop(0.7, rgba(tints[2], alpha));
  g.addColorStop(1, rgba(tints[2], 0));
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  // one soft diagonal glint
  const g2 = ctx.createLinearGradient(x + w * 0.1, y, x + w * 0.5, y + h * 0.5);
  g2.addColorStop(0, "rgba(255,255,255,0)");
  g2.addColorStop(0.5, "rgba(255,255,255,0.12)");
  g2.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}
