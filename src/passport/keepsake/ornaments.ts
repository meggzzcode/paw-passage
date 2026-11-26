// Illustrative motifs drawn with canvas paths only (no images, no fonts). Each fits a square of side s
// centred on (cx, cy). Used as ornaments, frame corners, and as the picture when no photo is chosen.
import { circle, drawPaw, type Ctx } from "./render";
import type { MotifId } from "./themes";

export function roundRectPath(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const k = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.lineTo(x + w - k, y);
  ctx.arc(x + w - k, y + k, k, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - k);
  ctx.arc(x + w - k, y + h - k, k, 0, Math.PI / 2);
  ctx.lineTo(x + k, y + h);
  ctx.arc(x + k, y + h - k, k, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + k);
  ctx.arc(x + k, y + k, k, Math.PI, Math.PI * 1.5);
  ctx.closePath();
}

export function starPath(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  points = 5,
  inner = 0.45,
): void {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / points;
    const rr = i % 2 ? r * inner : r;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function line(ctx: Ctx, x1: number, y1: number, x2: number, y2: number): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function tri(
  ctx: Ctx,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): void {
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.closePath();
  ctx.fill();
}

/** Draws a motif. `c` is the main colour, `c2` an optional contrast colour for details. */
export function motif(
  ctx: Ctx,
  id: MotifId,
  cx: number,
  cy: number,
  s: number,
  c: string,
  c2 = c,
): void {
  ctx.save();
  ctx.fillStyle = c;
  ctx.strokeStyle = c;
  ctx.lineWidth = Math.max(1.5, s * 0.035);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const h = s / 2;
  switch (id) {
    case "paw":
      drawPaw(ctx, cx, cy, s * 0.9, c);
      break;
    case "star":
      starPath(ctx, cx, cy, h);
      ctx.fill();
      break;
    case "bone": {
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 6);
      ctx.fillRect(-h * 0.8, -s * 0.09, s * 0.8, s * 0.18);
      for (const sx of [-1, 1])
        for (const sy of [-1, 1]) {
          circle(ctx, sx * h * 0.8, sy * s * 0.12, s * 0.13);
          ctx.fill();
        }
      break;
    }
    case "ball":
      circle(ctx, cx, cy, h * 0.92);
      ctx.fill();
      ctx.strokeStyle = c2;
      ctx.lineWidth = Math.max(2, s * 0.05);
      ctx.beginPath();
      ctx.arc(cx - h * 1.05, cy, h * 0.95, -0.7, 0.7);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + h * 1.05, cy, h * 0.95, Math.PI - 0.7, Math.PI + 0.7);
      ctx.stroke();
      break;
    case "tent":
      tri(ctx, cx - h, cy + h * 0.7, cx + h, cy + h * 0.7, cx, cy - h * 0.8);
      ctx.fillStyle = c2;
      tri(ctx, cx - h * 0.28, cy + h * 0.7, cx + h * 0.28, cy + h * 0.7, cx, cy - h * 0.1);
      ctx.strokeStyle = c;
      line(ctx, cx - h * 1.1, cy + h * 0.72, cx + h * 1.1, cy + h * 0.72);
      line(ctx, cx, cy - h * 0.8, cx, cy - h * 1.0);
      break;
    case "pine":
      for (let i = 0; i < 3; i++) {
        const top = cy - h + i * s * 0.22;
        const w = h * (0.45 + i * 0.28);
        tri(ctx, cx - w, top + s * 0.4, cx + w, top + s * 0.4, cx, top);
      }
      ctx.fillStyle = c2;
      ctx.fillRect(cx - s * 0.05, cy + h * 0.55, s * 0.1, h * 0.45);
      break;
    case "leaf":
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -h);
      ctx.quadraticCurveTo(h * 0.95, -h * 0.2, 0, h);
      ctx.quadraticCurveTo(-h * 0.95, -h * 0.2, 0, -h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = c2;
      ctx.lineWidth = Math.max(1.5, s * 0.03);
      line(ctx, 0, -h * 0.8, 0, h * 1.1);
      for (const k of [-0.3, 0.1, 0.45]) {
        line(ctx, 0, h * k, h * 0.38, h * (k - 0.25));
        line(ctx, 0, h * k, -h * 0.38, h * (k - 0.25));
      }
      ctx.restore();
      break;
    case "sun":
      circle(ctx, cx, cy, s * 0.22);
      ctx.fill();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r1 = s * (i % 2 ? 0.32 : 0.3);
        const r2 = s * (i % 2 ? 0.42 : 0.5);
        line(
          ctx,
          cx + Math.cos(a) * r1,
          cy + Math.sin(a) * r1,
          cx + Math.cos(a) * r2,
          cy + Math.sin(a) * r2,
        );
      }
      break;
    case "compass":
      circle(ctx, cx, cy, h * 0.9);
      ctx.stroke();
      circle(ctx, cx, cy, h * 0.78);
      ctx.stroke();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const r1 = h * (i % 4 ? 0.7 : 0.62);
        line(
          ctx,
          cx + Math.cos(a) * r1,
          cy + Math.sin(a) * r1,
          cx + Math.cos(a) * h * 0.78,
          cy + Math.sin(a) * h * 0.78,
        );
      }
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 5);
      ctx.fillStyle = c;
      tri(ctx, -h * 0.14, 0, h * 0.14, 0, 0, -h * 0.62);
      ctx.fillStyle = c2;
      tri(ctx, -h * 0.14, 0, h * 0.14, 0, 0, h * 0.62);
      ctx.restore();
      circle(ctx, cx, cy, h * 0.06);
      ctx.fillStyle = c;
      ctx.fill();
      break;
    case "magnifier":
      ctx.lineWidth = s * 0.07;
      circle(ctx, cx - s * 0.08, cy - s * 0.08, s * 0.28);
      ctx.stroke();
      ctx.lineWidth = s * 0.12;
      line(ctx, cx + s * 0.13, cy + s * 0.13, cx + h * 0.9, cy + h * 0.9);
      ctx.strokeStyle = c2;
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.arc(cx - s * 0.08, cy - s * 0.08, s * 0.2, Math.PI * 1.1, Math.PI * 1.45);
      ctx.stroke();
      break;
    case "cupcake": {
      // wrapper
      ctx.beginPath();
      ctx.moveTo(cx - h * 0.62, cy + h * 0.05);
      ctx.lineTo(cx + h * 0.62, cy + h * 0.05);
      ctx.lineTo(cx + h * 0.44, cy + h * 0.95);
      ctx.lineTo(cx - h * 0.44, cy + h * 0.95);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = c2;
      ctx.lineWidth = Math.max(1.5, s * 0.025);
      for (const k of [-0.3, 0, 0.3])
        line(ctx, cx + h * k, cy + h * 0.15, cx + h * k * 0.75, cy + h * 0.88);
      // frosting
      ctx.fillStyle = c2;
      circle(ctx, cx, cy - h * 0.05, h * 0.62);
      ctx.fill();
      circle(ctx, cx, cy - h * 0.45, h * 0.46);
      ctx.fill();
      circle(ctx, cx, cy - h * 0.78, h * 0.28);
      ctx.fill();
      ctx.fillStyle = c;
      circle(ctx, cx, cy - h * 1.02, h * 0.12);
      ctx.fill();
      break;
    }
    case "fossil": {
      // ammonite spiral
      ctx.lineWidth = s * 0.07;
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const t = i / 140;
        const a = t * Math.PI * 5.2;
        const r = h * (0.08 + t * 0.85);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = c2;
      ctx.lineWidth = Math.max(1.5, s * 0.025);
      for (let i = 1; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 + 0.3;
        line(
          ctx,
          cx + Math.cos(a) * h * 0.55,
          cy + Math.sin(a) * h * 0.55,
          cx + Math.cos(a) * h * 0.95,
          cy + Math.sin(a) * h * 0.95,
        );
      }
      break;
    }
    case "acacia":
      ctx.beginPath();
      ctx.ellipse(cx, cy - h * 0.25, h * 0.95, h * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx - h * 0.4, cy - h * 0.05, h * 0.5, h * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = c2;
      ctx.lineWidth = s * 0.07;
      ctx.beginPath();
      ctx.moveTo(cx, cy + h * 0.9);
      ctx.quadraticCurveTo(cx + h * 0.08, cy + h * 0.3, cx - h * 0.05, cy - h * 0.1);
      ctx.stroke();
      line(ctx, cx - h, cy + h * 0.92, cx + h, cy + h * 0.92);
      break;
    case "bunting": {
      ctx.lineWidth = Math.max(2, s * 0.03);
      ctx.beginPath();
      ctx.moveTo(cx - h, cy - h * 0.4);
      ctx.quadraticCurveTo(cx, cy + h * 0.2, cx + h, cy - h * 0.4);
      ctx.stroke();
      for (let i = 0; i < 5; i++) {
        const t = (i + 0.5) / 5;
        const x = cx - h + t * s;
        const y = cy - h * 0.4 + 4 * t * (1 - t) * h * 0.3;
        ctx.fillStyle = i % 2 ? c2 : c;
        tri(ctx, x - h * 0.17, y, x + h * 0.17, y, x, y + h * 0.5);
      }
      break;
    }
    case "snowflake":
      ctx.lineWidth = Math.max(2, s * 0.045);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const ex = cx + Math.cos(a) * h;
        const ey = cy + Math.sin(a) * h;
        line(ctx, cx, cy, ex, ey);
        for (const k of [0.45, 0.7]) {
          const bx = cx + Math.cos(a) * h * k;
          const by = cy + Math.sin(a) * h * k;
          for (const d of [-0.7, 0.7])
            line(ctx, bx, by, bx + Math.cos(a + d) * h * 0.25, by + Math.sin(a + d) * h * 0.25);
        }
      }
      break;
    case "wave":
      ctx.lineWidth = Math.max(2.5, s * 0.05);
      for (let r = 0; r < 3; r++) {
        ctx.strokeStyle = r === 1 ? c2 : c;
        ctx.beginPath();
        const y = cy - h * 0.4 + r * h * 0.5;
        ctx.moveTo(cx - h, y);
        for (let k = 0; k < 4; k++)
          ctx.quadraticCurveTo(
            cx - h + (k + 0.5) * (s / 4),
            y - h * 0.3,
            cx - h + (k + 1) * (s / 4),
            y,
          );
        ctx.stroke();
      }
      break;
    case "fingerprint":
      ctx.lineWidth = Math.max(2, s * 0.04);
      for (let i = 1; i <= 7; i++) {
        const r = h * (i / 7) * 0.95;
        ctx.beginPath();
        ctx.arc(
          cx,
          cy + h * 0.1,
          r,
          Math.PI * (1.08 + (i % 2) * 0.06),
          Math.PI * (1.92 - (i % 3) * 0.05),
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy + h * 0.1, r, Math.PI * 0.12, Math.PI * (0.35 + (i % 2) * 0.3));
        ctx.stroke();
      }
      break;
  }
  ctx.restore();
}

/** Ring of small motifs around a rounded-rectangle edge, used as a frame border. */
export function motifBorder(
  ctx: Ctx,
  id: MotifId,
  x: number,
  y: number,
  w: number,
  h: number,
  step: number,
  size: number,
  c: string,
  c2 = c,
): void {
  const nx = Math.max(2, Math.round(w / step));
  const ny = Math.max(2, Math.round(h / step));
  for (let i = 0; i <= nx; i++) {
    motif(ctx, id, x + (w * i) / nx, y, size, c, c2);
    motif(ctx, id, x + (w * i) / nx, y + h, size, c, c2);
  }
  for (let j = 1; j < ny; j++) {
    motif(ctx, id, x, y + (h * j) / ny, size, c, c2);
    motif(ctx, id, x + w, y + (h * j) / ny, size, c, c2);
  }
}
