// Self-hosted keepsake fonts (declared in src/styles.css, files in public/fonts): Bricolage Grotesque is the
// display face, Figtree the body face and Caveat the handwriting. No new fonts and no network beyond those files.
// Canvas text only uses a web font once it is loaded, so every draw path awaits ensureKeepsakeFonts() first.

export const FONT_DISPLAY =
  '"Bricolage Grotesque", "Avenir Next", "Helvetica Neue", Arial, sans-serif';
export const FONT_BODY = 'Figtree, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif';
export const FONT_HAND = '"Caveat", "Bradley Hand", "Segoe Script", "Comic Sans MS", cursive';

export type FontKind = "display" | "body" | "hand";

const STACKS: Record<FontKind, string> = {
  display: FONT_DISPLAY,
  body: FONT_BODY,
  hand: FONT_HAND,
};
/** Weight ranges that styles.css declares for each face; anything else would be synthesized by the browser. */
const RANGES: Record<FontKind, [number, number]> = {
  display: [200, 800],
  body: [400, 700],
  hand: [500, 600],
};

/** A valid canvas font string, e.g. `700 48px "Bricolage Grotesque", ...`. Weight is clamped to the loaded range. */
export function fontSpec(
  kind: FontKind,
  weight: number | string,
  px: number,
  italic = false,
): string {
  const [lo, hi] = RANGES[kind];
  const n = typeof weight === "number" ? weight : Number.parseInt(weight, 10);
  const w = Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n / 100) * 100)) : lo;
  const size = Number.isFinite(px) && px > 0 ? Math.round(px * 100) / 100 : 16;
  return `${italic ? "italic " : ""}${w} ${size}px ${STACKS[kind]}`;
}

const SAMPLE = "AaBbGgQqRrWw 0123456789 .,'&-";
const FACES: [string, number[]][] = [
  ["Bricolage Grotesque", [400, 600, 700, 800]],
  ["Figtree", [400, 500, 600, 700]],
  ["Caveat", [500, 600]],
];
export const FONT_TIMEOUT_MS = 3000;

let cached: Promise<void> | null = null;

function loadAll(): Promise<void> {
  const fonts = document.fonts;
  const jobs: Promise<unknown>[] = [];
  for (const [family, weights] of FACES)
    for (const w of weights)
      jobs.push(fonts.load(`${w} 48px "${family}"`, SAMPLE).catch(() => undefined));
  return Promise.all(jobs).then(() => fonts.ready.then(() => undefined));
}

/**
 * Loads the keepsake faces and resolves when they are ready, or after a short timeout so a failure falls back
 * to the stacks instead of blocking. Safe without a document (SSR, workers). Cached once everything loaded;
 * after a timeout the next call tries again.
 */
export function ensureKeepsakeFonts(): Promise<void> {
  if (
    typeof document === "undefined" ||
    !document.fonts ||
    typeof document.fonts.load !== "function"
  )
    return Promise.resolve();
  if (cached) return cached;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<boolean>((res) => {
    timer = setTimeout(() => res(false), FONT_TIMEOUT_MS);
  });
  const p: Promise<void> = Promise.race([
    loadAll().then(
      () => true,
      () => false,
    ),
    timeout,
  ]).then((ok) => {
    if (timer) clearTimeout(timer);
    if (!ok && cached === p) cached = null;
  });
  cached = p;
  return p;
}

/** Test helper: forget the cached result. */
export function resetKeepsakeFontsForTests(): void {
  cached = null;
}
