// Light vector ornaments for the photo-first keepsakes (seasonal frame, ticket, then-and-now, collage,
// poster). Everything is drawn with canvas paths, no images or fonts. Each helper saves and restores the
// context, draws at a low opacity and stays small, so it can sit in a margin or corner of a photograph.
import { circle, type Ctx } from "./render";
import { roundRectPath, starPath } from "./ornaments";

/** A four-point sparkle with concave sides. */
export function sparkle(ctx: Ctx, x: number, y: number, r: number, color: string, alpha = 1): void {
  const k = r * 0.2;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + k, y - k, x + r, y);
  ctx.quadraticCurveTo(x + k, y + k, x, y + r);
  ctx.quadraticCurveTo(x - k, y + k, x - r, y);
  ctx.quadraticCurveTo(x - k, y - k, x, y - r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** A fine rounded keyline, optionally dashed (stitching). */
export function keyline(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
  alpha: number,
  lw = 2,
  dash: number[] = [],
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.setLineDash(dash);
  roundRectPath(ctx, x, y, w, h, r);
  ctx.stroke();
  ctx.restore();
}

/** Four short corner brackets, like a camera viewfinder. */
export function brackets(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  len: number,
  color: string,
  alpha: number,
  lw = 3,
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

/** A hand-drawn looking underline that dips and lifts once. */
export function swash(
  ctx: Ctx,
  x1: number,
  x2: number,
  y: number,
  color: string,
  alpha = 0.9,
  lw = 4,
): void {
  const m = (x1 + x2) / 2;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y + 3);
  ctx.bezierCurveTo(x1 + (m - x1) * 0.5, y - 5, m - (m - x1) * 0.2, y + 7, m, y + 1);
  ctx.bezierCurveTo(m + (x2 - m) * 0.4, y - 5, x2 - (x2 - m) * 0.3, y + 4, x2, y - 2);
  ctx.stroke();
  ctx.restore();
}

/** A strip of translucent washi tape with notched ends, rotated about its centre. */
export function washiTape(
  ctx: Ctx,
  cx: number,
  cy: number,
  w: number,
  h: number,
  rot: number,
  color: string,
  alpha = 0.72,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  const n = h / 5;
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(w / 2, -h / 2);
  for (let i = 0; i < 5; i++) ctx.lineTo(w / 2 - (i % 2 ? 0 : 5), -h / 2 + n * (i + 0.5));
  ctx.lineTo(w / 2, h / 2);
  ctx.lineTo(-w / 2, h / 2);
  for (let i = 4; i >= 0; i--) ctx.lineTo(-w / 2 + (i % 2 ? 0 : 5), -h / 2 + n * (i + 0.5));
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = alpha * 0.35;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  for (let x = -w / 2 + 12; x < w / 2 - 6; x += 18) {
    ctx.beginPath();
    ctx.moveTo(x, -h / 2 + 2);
    ctx.lineTo(x + 8, h / 2 - 2);
    ctx.stroke();
  }
  ctx.restore();
}

/** A sagging string of small pennant flags between two points on the same line. */
export function bunting(
  ctx: Ctx,
  x1: number,
  x2: number,
  y: number,
  sag: number,
  n: number,
  colors: string[],
  alpha = 0.9,
  flag = 46,
): void {
  const pt = (t: number): [number, number] => [x1 + (x2 - x1) * t, y + 4 * sag * t * (1 - t)];
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = colors[0] ?? "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 24; i++) {
    const [px, py] = pt(i / 24);
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  }
  ctx.stroke();
  for (let i = 0; i < n; i++) {
    const [px, py] = pt((i + 0.5) / n);
    ctx.fillStyle = colors[i % colors.length] ?? "#ffffff";
    ctx.beginPath();
    ctx.moveTo(px - flag * 0.5, py);
    ctx.lineTo(px + flag * 0.5, py);
    ctx.lineTo(px, py + flag * 1.05);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** A row of small glowing bulbs along a straight line (cinema marquee, fairground). */
export function bulbs(
  ctx: Ctx,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  n: number,
  r: number,
  color: string,
  alpha = 0.85,
): void {
  ctx.save();
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1);
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    ctx.globalAlpha = alpha * 0.28;
    ctx.fillStyle = color;
    circle(ctx, x, y, r * 2);
    ctx.fill();
    ctx.globalAlpha = alpha;
    circle(ctx, x, y, r);
    ctx.fill();
    ctx.globalAlpha = alpha * 0.9;
    ctx.fillStyle = "#ffffff";
    circle(ctx, x - r * 0.25, y - r * 0.25, r * 0.4);
    ctx.fill();
  }
  ctx.restore();
}

/** Film sprocket holes running down one edge. */
export function sprockets(
  ctx: Ctx,
  x: number,
  y1: number,
  y2: number,
  w: number,
  h: number,
  step: number,
  color: string,
  alpha = 0.6,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let y = y1; y + h <= y2; y += step) {
    roundRectPath(ctx, x, y, w, h, 4);
    ctx.fill();
  }
  ctx.restore();
}

/** Tick marks like a ruler along a straight edge; every fifth is longer. */
export function ruler(
  ctx: Ctx,
  x: number,
  y: number,
  len: number,
  vertical: boolean,
  step: number,
  color: string,
  alpha = 0.7,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0, d = 0; d <= len; i++, d += step) {
    const l = i % 5 ? 12 : 24;
    if (vertical) {
      ctx.moveTo(x, y + d);
      ctx.lineTo(x + l, y + d);
    } else {
      ctx.moveTo(x + d, y);
      ctx.lineTo(x + d, y + l);
    }
  }
  ctx.stroke();
  ctx.restore();
}

/** Outline of a ticket: a rounded card with a half-circle notch at top and bottom of the stub line. */
export function ticketPath(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  stubX: number,
  notch: number,
): void {
  const sx = x + stubX;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(sx - notch, y);
  ctx.arc(sx, y, notch, Math.PI, 0, true);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  ctx.lineTo(sx + notch, y + h);
  ctx.arc(sx, y + h, notch, 0, Math.PI, true);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  ctx.closePath();
}

/** A scalloped rosette seal (no text), with a thin inner ring. */
export function rosette(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  fill: string,
  ring: string,
  points = 22,
): void {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2;
    const rr = i % 2 ? r * 0.9 : r;
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr;
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = ring;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 2;
  circle(ctx, cx, cy, r * 0.74);
  ctx.stroke();
  ctx.restore();
}

/** A rubber-stamp frame: two nested rounded rectangles, tilted, drawn in one colour. */
export function stampFrame(
  ctx: Ctx,
  cx: number,
  cy: number,
  w: number,
  h: number,
  rot: number,
  color: string,
  alpha = 0.88,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  roundRectPath(ctx, -w / 2, -h / 2, w, h, 10);
  ctx.stroke();
  ctx.lineWidth = 1.8;
  roundRectPath(ctx, -w / 2 + 9, -h / 2 + 9, w - 18, h - 18, 5);
  ctx.stroke();
  ctx.restore();
}

/** A round badge holding a small arrow (right or down). */
export function arrowBadge(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  down: boolean,
  fill: string,
  ink: string,
): void {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  circle(ctx, cx + 2, cy + 4, r);
  ctx.fill();
  ctx.fillStyle = fill;
  circle(ctx, cx, cy, r);
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(4, r * 0.14);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const a = r * 0.42;
  ctx.beginPath();
  if (down) {
    ctx.moveTo(cx, cy - a);
    ctx.lineTo(cx, cy + a);
    ctx.moveTo(cx - a * 0.7, cy + a * 0.3);
    ctx.lineTo(cx, cy + a);
    ctx.lineTo(cx + a * 0.7, cy + a * 0.3);
  } else {
    ctx.moveTo(cx - a, cy);
    ctx.lineTo(cx + a, cy);
    ctx.moveTo(cx + a * 0.3, cy - a * 0.7);
    ctx.lineTo(cx + a, cy);
    ctx.lineTo(cx + a * 0.3, cy + a * 0.7);
  }
  ctx.stroke();
  ctx.restore();
}

/** A tiny scatter of sparkles and dots, deterministic from the seed, kept inside the given box. */
export function twinkles(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  n: number,
  seed: number,
  color: string,
  alpha = 0.8,
): void {
  const r = (i: number) => {
    const v = Math.sin((i + seed) * 12.9898 + 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  for (let i = 0; i < n; i++) {
    const px = x + r(i * 3 + 1) * w;
    const py = y + r(i * 3 + 2) * h;
    const s = 6 + r(i * 3 + 3) * 16;
    if (i % 3 === 0) sparkle(ctx, px, py, s * 1.3, color, alpha);
    else {
      ctx.save();
      ctx.globalAlpha = alpha * 0.8;
      ctx.fillStyle = color;
      circle(ctx, px, py, s * 0.28);
      ctx.fill();
      ctx.restore();
    }
  }
}

/** A small filled star badge outline (for tiny celebratory details). */
export function starMark(
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
  starPath(ctx, cx, cy, r, 5, 0.5);
  ctx.fill();
  ctx.restore();
}
