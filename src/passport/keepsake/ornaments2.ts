// More motifs, drawn with canvas paths only. Dispatched from motif() in ornaments.ts.
import { circle, drawPaw, type Ctx } from "./render";
import { starPath } from "./ornaments";
import type { MotifId } from "./themes";

function ln(ctx: Ctx, x1: number, y1: number, x2: number, y2: number): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
function poly(ctx: Ctx, pts: Array<[number, number]>, fill = true): void {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  if (fill) ctx.fill();
  else ctx.stroke();
}
function ell(ctx: Ctx, x: number, y: number, rx: number, ry: number, rot = 0): void {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fill();
}

export function motifMore(
  ctx: Ctx,
  id: MotifId,
  cx: number,
  cy: number,
  s: number,
  c: string,
  c2: string,
): void {
  const h = s / 2;
  switch (id) {
    case "icecream":
      ctx.fillStyle = c2;
      poly(ctx, [
        [cx - h * 0.46, cy],
        [cx + h * 0.46, cy],
        [cx, cy + h * 1.0],
      ]);
      ctx.strokeStyle = c;
      ctx.lineWidth = Math.max(1.5, s * 0.02);
      ln(ctx, cx - h * 0.3, cy + h * 0.1, cx + h * 0.12, cy + h * 0.8);
      ln(ctx, cx + h * 0.3, cy + h * 0.1, cx - h * 0.12, cy + h * 0.8);
      ctx.fillStyle = c;
      circle(ctx, cx, cy - h * 0.08, h * 0.52);
      ctx.fill();
      circle(ctx, cx - h * 0.02, cy - h * 0.62, h * 0.38);
      ctx.fill();
      ctx.fillStyle = c2;
      circle(ctx, cx + h * 0.02, cy - h * 0.98, h * 0.1);
      ctx.fill();
      break;
    case "whisk":
      ctx.lineWidth = Math.max(2, s * 0.04);
      ln(ctx, cx, cy + h, cx, cy + h * 0.2);
      for (const k of [0.5, 0.3, 0.1]) {
        ctx.beginPath();
        ctx.ellipse(cx, cy - h * 0.35, h * k * 1.5, h * 0.62, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = c2;
      ctx.fillRect(cx - h * 0.1, cy + h * 0.2, h * 0.2, h * 0.5);
      break;
    case "constellation": {
      const pts: Array<[number, number]> = [
        [-0.8, 0.5],
        [-0.4, -0.2],
        [0.05, 0.15],
        [0.45, -0.55],
        [0.85, -0.1],
      ];
      ctx.lineWidth = Math.max(1.5, s * 0.02);
      ctx.beginPath();
      pts.forEach(([x, y], i) =>
        i ? ctx.lineTo(cx + x * h, cy + y * h) : ctx.moveTo(cx + x * h, cy + y * h),
      );
      ctx.stroke();
      ctx.fillStyle = c2;
      pts.forEach(([x, y], i) => {
        starPath(ctx, cx + x * h, cy + y * h, h * (i % 2 ? 0.14 : 0.2), 4, 0.4);
        ctx.fill();
      });
      break;
    }
    case "pin":
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.25, h * 0.55, Math.PI * 0.82, Math.PI * 2.18);
      ctx.lineTo(cx, cy + h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = c2;
      circle(ctx, cx, cy - h * 0.25, h * 0.22);
      ctx.fill();
      break;
    case "anchor":
      ctx.lineWidth = Math.max(2, s * 0.06);
      circle(ctx, cx, cy - h * 0.72, h * 0.16);
      ctx.stroke();
      ln(ctx, cx, cy - h * 0.55, cx, cy + h * 0.85);
      ln(ctx, cx - h * 0.35, cy - h * 0.3, cx + h * 0.35, cy - h * 0.3);
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.15, h * 0.72, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
      break;
    case "wheel":
      ctx.lineWidth = Math.max(2, s * 0.05);
      circle(ctx, cx, cy, h * 0.58);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ln(ctx, cx, cy, cx + Math.cos(a) * h * 0.95, cy + Math.sin(a) * h * 0.95);
        circle(ctx, cx + Math.cos(a) * h * 0.95, cy + Math.sin(a) * h * 0.95, h * 0.07);
        ctx.fill();
      }
      ctx.fillStyle = c2;
      circle(ctx, cx, cy, h * 0.2);
      ctx.fill();
      break;
    case "reel":
      circle(ctx, cx, cy, h * 0.95);
      ctx.fill();
      ctx.fillStyle = c2;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        circle(ctx, cx + Math.cos(a) * h * 0.55, cy + Math.sin(a) * h * 0.55, h * 0.2);
        ctx.fill();
      }
      circle(ctx, cx, cy, h * 0.12);
      ctx.fill();
      break;
    case "brush":
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-h * 0.06, -h * 0.2, h * 0.12, h * 1.1);
      ctx.fillStyle = c2;
      ctx.fillRect(-h * 0.12, -h * 0.42, h * 0.24, h * 0.24);
      ctx.beginPath();
      ctx.moveTo(-h * 0.12, -h * 0.42);
      ctx.quadraticCurveTo(0, -h * 1.05, h * 0.12, -h * 0.42);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = c2;
      circle(ctx, cx - h * 0.6, cy + h * 0.55, h * 0.18);
      ctx.fill();
      circle(ctx, cx - h * 0.3, cy + h * 0.8, h * 0.09);
      ctx.fill();
      break;
    case "cloche":
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.35, h * 0.8, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(cx - h * 0.98, cy + h * 0.35, h * 1.96, h * 0.12);
      ctx.fillStyle = c2;
      circle(ctx, cx, cy - h * 0.55, h * 0.1);
      ctx.fill();
      break;
    case "key":
      ctx.lineWidth = Math.max(2.5, s * 0.07);
      circle(ctx, cx - h * 0.5, cy - h * 0.1, h * 0.3);
      ctx.stroke();
      ln(ctx, cx - h * 0.2, cy - h * 0.1, cx + h * 0.9, cy - h * 0.1);
      ln(ctx, cx + h * 0.55, cy - h * 0.1, cx + h * 0.55, cy + h * 0.3);
      ln(ctx, cx + h * 0.8, cy - h * 0.1, cx + h * 0.8, cy + h * 0.2);
      break;
    case "mountain":
      poly(ctx, [
        [cx - h, cy + h * 0.7],
        [cx - h * 0.2, cy - h * 0.7],
        [cx + h * 0.5, cy + h * 0.7],
      ]);
      poly(ctx, [
        [cx + h * 0.05, cy + h * 0.7],
        [cx + h * 0.6, cy - h * 0.2],
        [cx + h * 1.05, cy + h * 0.7],
      ]);
      ctx.fillStyle = c2;
      poly(ctx, [
        [cx - h * 0.2, cy - h * 0.7],
        [cx - h * 0.42, cy - h * 0.3],
        [cx - h * 0.2, cy - h * 0.4],
        [cx, cy - h * 0.28],
      ]);
      break;
    case "fern":
      ctx.lineWidth = Math.max(2, s * 0.035);
      ctx.beginPath();
      ctx.moveTo(cx - h * 0.3, cy + h);
      ctx.quadraticCurveTo(cx + h * 0.2, cy, cx + h * 0.1, cy - h);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const t = i / 8;
        const x = cx - h * 0.3 + h * 0.4 * t * 1.0 + Math.sin(t * 3) * 0;
        const y = cy + h * 0.9 - t * h * 1.8;
        const w = h * (0.5 - t * 0.35);
        ell(ctx, x - w * 0.6, y, w * 0.6, h * 0.08, -0.5);
        ell(ctx, x + w * 0.6 + h * 0.1, y, w * 0.6, h * 0.08, 0.5);
      }
      break;
    case "lantern":
      ctx.lineWidth = Math.max(2, s * 0.04);
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.7, h * 0.3, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.fillRect(cx - h * 0.4, cy - h * 0.55, h * 0.8, h * 0.16);
      ctx.fillRect(cx - h * 0.4, cy + h * 0.6, h * 0.8, h * 0.16);
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = c2;
      ctx.fillRect(cx - h * 0.3, cy - h * 0.4, h * 0.6, h * 1.0);
      ctx.restore();
      ln(ctx, cx - h * 0.4, cy - h * 0.4, cx - h * 0.4, cy + h * 0.6);
      ln(ctx, cx + h * 0.4, cy - h * 0.4, cx + h * 0.4, cy + h * 0.6);
      break;
    case "heart":
      ctx.beginPath();
      ctx.moveTo(cx, cy + h * 0.85);
      ctx.bezierCurveTo(cx - h * 1.3, cy - h * 0.1, cx - h * 0.6, cy - h * 0.95, cx, cy - h * 0.35);
      ctx.bezierCurveTo(cx + h * 0.6, cy - h * 0.95, cx + h * 1.3, cy - h * 0.1, cx, cy + h * 0.85);
      ctx.fill();
      break;
    case "house":
      poly(ctx, [
        [cx - h * 0.95, cy - h * 0.05],
        [cx, cy - h * 0.9],
        [cx + h * 0.95, cy - h * 0.05],
      ]);
      ctx.fillRect(cx - h * 0.7, cy - h * 0.05, h * 1.4, h * 0.85);
      ctx.fillStyle = c2;
      ctx.fillRect(cx - h * 0.16, cy + h * 0.25, h * 0.32, h * 0.55);
      break;
    case "wheat":
      ctx.lineWidth = Math.max(2, s * 0.035);
      ln(ctx, cx, cy + h, cx, cy - h * 0.6);
      for (let i = 0; i < 4; i++) {
        const y = cy - h * 0.7 + i * h * 0.34;
        ell(ctx, cx - h * 0.2, y, h * 0.1, h * 0.22, 0.5);
        ell(ctx, cx + h * 0.2, y, h * 0.1, h * 0.22, -0.5);
      }
      ell(ctx, cx, cy - h * 0.92, h * 0.1, h * 0.22);
      break;
    case "apple":
      circle(ctx, cx - h * 0.25, cy + h * 0.1, h * 0.58);
      ctx.fill();
      circle(ctx, cx + h * 0.25, cy + h * 0.1, h * 0.58);
      ctx.fill();
      ctx.strokeStyle = c2;
      ctx.lineWidth = Math.max(2, s * 0.05);
      ln(ctx, cx, cy - h * 0.4, cx + h * 0.1, cy - h * 0.85);
      ctx.fillStyle = c2;
      ell(ctx, cx + h * 0.4, cy - h * 0.7, h * 0.3, h * 0.13, -0.4);
      break;
    case "pumpkin":
      for (const k of [-0.5, 0.5, 0]) ell(ctx, cx + k * h * 0.7, cy + h * 0.1, h * 0.46, h * 0.7);
      ctx.fillStyle = c2;
      ctx.fillRect(cx - h * 0.08, cy - h * 0.8, h * 0.16, h * 0.3);
      break;
    case "parasol": {
      const n = 6;
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = i % 2 ? c2 : c;
        ctx.beginPath();
        ctx.moveTo(cx, cy - h * 0.85);
        ctx.arc(
          cx,
          cy - h * 0.1,
          h * 0.95,
          Math.PI + (i / n) * Math.PI,
          Math.PI + ((i + 1) / n) * Math.PI,
        );
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = c;
      ctx.lineWidth = Math.max(2, s * 0.05);
      ln(ctx, cx, cy - h * 0.1, cx, cy + h * 0.95);
      break;
    }
    case "envelope":
      ctx.lineWidth = Math.max(2, s * 0.04);
      ctx.fillRect(cx - h * 0.95, cy - h * 0.6, h * 1.9, h * 1.2);
      ctx.strokeStyle = c2;
      ctx.beginPath();
      ctx.moveTo(cx - h * 0.95, cy - h * 0.6);
      ctx.lineTo(cx, cy + h * 0.1);
      ctx.lineTo(cx + h * 0.95, cy - h * 0.6);
      ctx.stroke();
      break;
    case "suitcase":
      ctx.lineWidth = Math.max(2.5, s * 0.05);
      ctx.beginPath();
      ctx.moveTo(cx - h * 0.3, cy - h * 0.35);
      ctx.lineTo(cx - h * 0.3, cy - h * 0.7);
      ctx.lineTo(cx + h * 0.3, cy - h * 0.7);
      ctx.lineTo(cx + h * 0.3, cy - h * 0.35);
      ctx.stroke();
      ctx.fillRect(cx - h * 0.9, cy - h * 0.35, h * 1.8, h * 1.15);
      ctx.fillStyle = c2;
      ctx.fillRect(cx - h * 0.5, cy - h * 0.35, h * 0.1, h * 1.15);
      ctx.fillRect(cx + h * 0.4, cy - h * 0.35, h * 0.1, h * 1.15);
      break;
    case "soundwave":
      ctx.lineWidth = Math.max(3, s * 0.07);
      [0.25, 0.55, 0.9, 0.45, 0.75, 0.35, 0.6].forEach((k, i) => {
        const x = cx - h * 0.84 + i * h * 0.28;
        ln(ctx, x, cy - h * k, x, cy + h * k);
      });
      break;
    case "medal":
      ctx.fillStyle = c2;
      poly(ctx, [
        [cx - h * 0.5, cy - h],
        [cx - h * 0.1, cy - h],
        [cx + h * 0.3, cy - h * 0.1],
        [cx - h * 0.1, cy - h * 0.1],
      ]);
      poly(ctx, [
        [cx + h * 0.5, cy - h],
        [cx + h * 0.1, cy - h],
        [cx - h * 0.3, cy - h * 0.1],
        [cx + h * 0.1, cy - h * 0.1],
      ]);
      ctx.fillStyle = c;
      circle(ctx, cx, cy + h * 0.32, h * 0.62);
      ctx.fill();
      ctx.fillStyle = c2;
      starPath(ctx, cx, cy + h * 0.32, h * 0.4);
      ctx.fill();
      break;
    case "laurel":
      for (const side of [-1, 1])
        for (let i = 0; i < 7; i++) {
          const a = Math.PI * (0.15 + i * 0.1);
          ell(
            ctx,
            cx + side * Math.cos(a) * h * 0.8,
            cy + Math.sin(a) * h * 0.8 - h * 0.1,
            h * 0.2,
            h * 0.08,
            side * (a - Math.PI / 2),
          );
        }
      starPath(ctx, cx, cy - h * 0.05, h * 0.3);
      ctx.fillStyle = c2;
      ctx.fill();
      break;
    case "camera":
      ctx.fillRect(cx - h * 0.95, cy - h * 0.5, h * 1.9, h * 1.2);
      ctx.fillRect(cx - h * 0.35, cy - h * 0.72, h * 0.7, h * 0.24);
      ctx.fillStyle = c2;
      circle(ctx, cx, cy + h * 0.1, h * 0.42);
      ctx.fill();
      ctx.fillStyle = c;
      circle(ctx, cx, cy + h * 0.1, h * 0.22);
      ctx.fill();
      break;
    case "tag":
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 5);
      poly(ctx, [
        [-h * 0.5, -h * 0.55],
        [h * 0.5, -h * 0.55],
        [h * 0.5, h * 0.7],
        [-h * 0.5, h * 0.7],
        [-h * 0.5, -h * 0.25],
      ]);
      ctx.fillStyle = c2;
      circle(ctx, 0, -h * 0.35, h * 0.1);
      ctx.fill();
      ctx.restore();
      break;
    case "mortarboard":
      poly(ctx, [
        [cx, cy - h * 0.6],
        [cx + h, cy - h * 0.15],
        [cx, cy + h * 0.3],
        [cx - h, cy - h * 0.15],
      ]);
      ctx.beginPath();
      ctx.moveTo(cx - h * 0.5, cy + h * 0.05);
      ctx.lineTo(cx - h * 0.5, cy + h * 0.5);
      ctx.quadraticCurveTo(cx, cy + h * 0.8, cx + h * 0.5, cy + h * 0.5);
      ctx.lineTo(cx + h * 0.5, cy + h * 0.05);
      ctx.fill();
      ctx.strokeStyle = c2;
      ctx.lineWidth = Math.max(2, s * 0.04);
      ln(ctx, cx + h * 0.85, cy - h * 0.05, cx + h * 0.85, cy + h * 0.6);
      break;
    case "book":
      ctx.beginPath();
      ctx.moveTo(cx, cy - h * 0.55);
      ctx.quadraticCurveTo(cx - h * 0.5, cy - h * 0.8, cx - h, cy - h * 0.55);
      ctx.lineTo(cx - h, cy + h * 0.65);
      ctx.quadraticCurveTo(cx - h * 0.5, cy + h * 0.4, cx, cy + h * 0.65);
      ctx.quadraticCurveTo(cx + h * 0.5, cy + h * 0.4, cx + h, cy + h * 0.65);
      ctx.lineTo(cx + h, cy - h * 0.55);
      ctx.quadraticCurveTo(cx + h * 0.5, cy - h * 0.8, cx, cy - h * 0.55);
      ctx.fill();
      ctx.strokeStyle = c2;
      ctx.lineWidth = Math.max(1.5, s * 0.03);
      ln(ctx, cx, cy - h * 0.5, cx, cy + h * 0.6);
      break;
    case "tree":
      circle(ctx, cx, cy - h * 0.25, h * 0.65);
      ctx.fill();
      circle(ctx, cx - h * 0.4, cy, h * 0.4);
      ctx.fill();
      circle(ctx, cx + h * 0.4, cy, h * 0.4);
      ctx.fill();
      ctx.fillStyle = c2;
      ctx.fillRect(cx - h * 0.08, cy + h * 0.2, h * 0.16, h * 0.75);
      break;
    case "spray":
      ctx.fillRect(cx - h * 0.3, cy - h * 0.2, h * 0.6, h * 1.1);
      ctx.fillStyle = c2;
      ctx.fillRect(cx - h * 0.2, cy - h * 0.5, h * 0.4, h * 0.3);
      for (const [x, y] of [
        [0.4, -0.7],
        [0.65, -0.5],
        [0.8, -0.8],
        [0.9, -0.3],
      ] as const) {
        circle(ctx, cx + x * h, cy + y * h, h * 0.07);
        ctx.fill();
      }
      break;
    case "bench":
      ctx.lineWidth = Math.max(2.5, s * 0.07);
      ln(ctx, cx - h * 0.9, cy + h * 0.1, cx + h * 0.9, cy + h * 0.1);
      ln(ctx, cx - h * 0.9, cy - h * 0.3, cx + h * 0.9, cy - h * 0.3);
      ln(ctx, cx - h * 0.9, cy - h * 0.7, cx + h * 0.9, cy - h * 0.7);
      ln(ctx, cx - h * 0.7, cy - h * 0.7, cx - h * 0.7, cy + h * 0.8);
      ln(ctx, cx + h * 0.7, cy - h * 0.7, cx + h * 0.7, cy + h * 0.8);
      break;
    case "question":
      ctx.lineWidth = Math.max(3, s * 0.1);
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.3, h * 0.45, Math.PI * 1.05, Math.PI * 2.45);
      ctx.quadraticCurveTo(cx + h * 0.3, cy + h * 0.1, cx, cy + h * 0.3);
      ctx.lineTo(cx, cy + h * 0.45);
      ctx.stroke();
      circle(ctx, cx, cy + h * 0.8, h * 0.1);
      ctx.fill();
      break;
    case "globe":
      ctx.lineWidth = Math.max(2, s * 0.045);
      circle(ctx, cx, cy, h * 0.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, h * 0.4, h * 0.9, 0, 0, Math.PI * 2);
      ctx.stroke();
      ln(ctx, cx - h * 0.9, cy, cx + h * 0.9, cy);
      ln(ctx, cx - h * 0.78, cy - h * 0.45, cx + h * 0.78, cy - h * 0.45);
      ln(ctx, cx - h * 0.78, cy + h * 0.45, cx + h * 0.78, cy + h * 0.45);
      break;
    case "ring":
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = i % 2 ? c2 : c;
        ctx.lineWidth = h * 0.32;
        ctx.beginPath();
        ctx.arc(cx, cy, h * 0.7, (i * Math.PI) / 2, ((i + 1) * Math.PI) / 2);
        ctx.stroke();
      }
      break;
    case "reeds":
      ctx.lineWidth = Math.max(2, s * 0.04);
      for (const [dx, hh] of [
        [-0.5, 0.7],
        [0, 1],
        [0.5, 0.8],
      ] as const) {
        ln(ctx, cx + dx * h, cy + h, cx + dx * h * 1.1, cy - hh * h * 0.6);
        ctx.fillStyle = c2;
        ell(ctx, cx + dx * h * 1.1, cy - hh * h * 0.75, h * 0.1, h * 0.28);
      }
      break;
    case "shell":
      ctx.beginPath();
      ctx.moveTo(cx, cy + h * 0.8);
      ctx.arc(cx, cy + h * 0.1, h * 0.95, Math.PI * 1.1, Math.PI * 1.9);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = c2;
      ctx.lineWidth = Math.max(1.5, s * 0.025);
      for (let i = 0; i < 6; i++) {
        const a = Math.PI * (1.2 + i * 0.12);
        ln(
          ctx,
          cx,
          cy + h * 0.75,
          cx + Math.cos(a) * h * 0.9,
          cy + h * 0.1 + Math.sin(a) * h * 0.9,
        );
      }
      break;
    case "signpost":
      ctx.fillRect(cx - h * 0.06, cy - h * 0.8, h * 0.12, h * 1.7);
      poly(ctx, [
        [cx - h * 0.8, cy - h * 0.7],
        [cx + h * 0.5, cy - h * 0.7],
        [cx + h * 0.85, cy - h * 0.5],
        [cx + h * 0.5, cy - h * 0.3],
        [cx - h * 0.8, cy - h * 0.3],
      ]);
      ctx.fillStyle = c2;
      poly(ctx, [
        [cx + h * 0.8, cy],
        [cx - h * 0.5, cy],
        [cx - h * 0.85, cy + h * 0.2],
        [cx - h * 0.5, cy + h * 0.4],
        [cx + h * 0.8, cy + h * 0.4],
      ]);
      break;
    case "flame":
      ctx.beginPath();
      ctx.moveTo(cx, cy - h);
      ctx.bezierCurveTo(cx + h * 0.9, cy - h * 0.2, cx + h * 0.8, cy + h * 0.9, cx, cy + h * 0.9);
      ctx.bezierCurveTo(cx - h * 0.8, cy + h * 0.9, cx - h * 0.9, cy - h * 0.1, cx, cy - h);
      ctx.fill();
      ctx.fillStyle = c2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - h * 0.1);
      ctx.bezierCurveTo(cx + h * 0.4, cy + h * 0.3, cx + h * 0.3, cy + h * 0.8, cx, cy + h * 0.8);
      ctx.bezierCurveTo(cx - h * 0.3, cy + h * 0.8, cx - h * 0.4, cy + h * 0.3, cx, cy - h * 0.1);
      ctx.fill();
      break;
    case "daisy":
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ell(ctx, cx + Math.cos(a) * h * 0.55, cy + Math.sin(a) * h * 0.55, h * 0.3, h * 0.14, a);
      }
      ctx.fillStyle = c2;
      circle(ctx, cx, cy, h * 0.25);
      ctx.fill();
      break;
    case "pawtrail":
      for (let i = 0; i < 3; i++)
        drawPaw(
          ctx,
          cx - h * 0.6 + i * h * 0.6,
          cy + h * 0.5 - i * h * 0.5,
          s * 0.34,
          i % 2 ? c2 : c,
        );
      break;
    case "bridge":
      ctx.lineWidth = Math.max(2.5, s * 0.06);
      ln(ctx, cx - h, cy + h * 0.1, cx + h, cy + h * 0.1);
      for (const k of [-0.5, 0.5]) {
        ctx.beginPath();
        ctx.arc(cx + k * h, cy + h * 0.1, h * 0.5, 0, Math.PI);
        ctx.stroke();
      }
      ln(ctx, cx - h * 0.9, cy - h * 0.2, cx + h * 0.9, cy - h * 0.2);
      for (let i = -3; i <= 3; i++)
        ln(ctx, cx + i * h * 0.28, cy - h * 0.2, cx + i * h * 0.28, cy + h * 0.1);
      break;
    case "cup":
      ctx.beginPath();
      ctx.moveTo(cx - h * 0.6, cy - h * 0.2);
      ctx.lineTo(cx + h * 0.6, cy - h * 0.2);
      ctx.quadraticCurveTo(cx + h * 0.6, cy + h * 0.7, cx, cy + h * 0.7);
      ctx.quadraticCurveTo(cx - h * 0.6, cy + h * 0.7, cx - h * 0.6, cy - h * 0.2);
      ctx.fill();
      ctx.lineWidth = Math.max(2, s * 0.06);
      ctx.beginPath();
      ctx.arc(cx + h * 0.68, cy + h * 0.1, h * 0.25, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = c2;
      ctx.beginPath();
      ctx.ellipse(cx, cy + h * 0.85, h * 0.95, h * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = c2;
      ctx.beginPath();
      ctx.moveTo(cx - h * 0.2, cy - h * 0.45);
      ctx.quadraticCurveTo(cx - h * 0.05, cy - h * 0.7, cx - h * 0.2, cy - h * 0.95);
      ctx.stroke();
      break;
    case "moon":
      ctx.beginPath();
      ctx.arc(cx, cy, h * 0.85, Math.PI * 0.35, Math.PI * 1.65, true);
      ctx.arc(cx + h * 0.45, cy, h * 0.72, Math.PI * 1.55, Math.PI * 0.45, false);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = c2;
      starPath(ctx, cx + h * 0.65, cy - h * 0.5, h * 0.2, 4, 0.4);
      ctx.fill();
      starPath(ctx, cx + h * 0.35, cy + h * 0.55, h * 0.13, 4, 0.4);
      ctx.fill();
      break;
    case "bubbles":
      ctx.lineWidth = Math.max(2, s * 0.04);
      for (const [x, y, r] of [
        [-0.35, 0.2, 0.55],
        [0.45, -0.3, 0.38],
        [0.35, 0.6, 0.2],
        [-0.6, -0.6, 0.18],
      ] as const) {
        circle(ctx, cx + x * h, cy + y * h, r * h);
        ctx.stroke();
        ctx.fillStyle = c2;
        circle(ctx, cx + (x - r * 0.35) * h, cy + (y - r * 0.35) * h, r * h * 0.16);
        ctx.fill();
      }
      break;
    case "mask":
      ctx.beginPath();
      ctx.moveTo(cx - h * 0.8, cy - h * 0.6);
      ctx.quadraticCurveTo(cx, cy - h * 0.85, cx + h * 0.8, cy - h * 0.6);
      ctx.quadraticCurveTo(cx + h * 0.9, cy + h * 0.6, cx, cy + h * 0.95);
      ctx.quadraticCurveTo(cx - h * 0.9, cy + h * 0.6, cx - h * 0.8, cy - h * 0.6);
      ctx.fill();
      ctx.fillStyle = c2;
      ell(ctx, cx - h * 0.33, cy - h * 0.15, h * 0.2, h * 0.1, 0.3);
      ell(ctx, cx + h * 0.33, cy - h * 0.15, h * 0.2, h * 0.1, -0.3);
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.35, h * 0.3, 0.1, Math.PI - 0.1);
      ctx.fill();
      break;
    case "door":
      ctx.fillRect(cx - h * 0.55, cy - h * 0.9, h * 1.1, h * 1.8);
      ctx.fillStyle = c2;
      ctx.fillRect(cx - h * 0.4, cy - h * 0.75, h * 0.8, h * 0.7);
      circle(ctx, cx + h * 0.3, cy + h * 0.25, h * 0.08);
      ctx.fill();
      ctx.fillRect(cx - h * 0.2, cy + h * 0.1, h * 0.4, h * 0.12);
      break;
    default:
      break;
  }
}
