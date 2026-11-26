// Public entry for the photo filter mode: a full-bleed, phone-camera-style overlay that says what the adventure
// was, with a tiny brand mark. Pure drawing over a canvas context so tests can pass a fake.
// Privacy: everything happens on this device. The PNG is a fresh canvas encode, so no original photo metadata
// (EXIF, GPS) is carried into it. Nothing here uses the network or browser storage.
import type { Ctx } from "./render";
import type { PlacedPhoto } from "./photo";
import { ART_SIZES, type SizeId } from "./kit";
import { cleanText } from "./render";
import {
  EXPLAINER_MAX,
  prepareFilter,
  type FilterItem,
  type FilterSpec,
  type Slot,
} from "./filter-kit";
import { LOOKS } from "./filter-looks";
import { defaultLookFor, isFilterStyle, type FilterStyleId } from "./filter-styles";

export type { FilterSpec, FilterItem, Slot };

export interface FilterLayout {
  width: number;
  height: number;
  style: FilterStyleId;
  photo: Slot;
  items: FilterItem[];
}

export function filterSize(size: SizeId): { width: number; height: number } {
  const s = ART_SIZES[size] ?? ART_SIZES.square;
  return { width: s.width, height: s.height };
}

function styleOf(spec: FilterSpec): FilterStyleId {
  return isFilterStyle(spec.style) ? spec.style : defaultLookFor(spec.theme);
}

/** Where the photo goes for this look and size. The crop editor frames its viewport with this rectangle. */
export function filterPhotoSlot(spec: FilterSpec): Slot {
  const f = prepareFilter(spec);
  return LOOKS[styleOf(spec)].photo(f);
}

/**
 * The one explainer line: the adventure's own, or a short trimmed version of its objective (first clause, cut at a
 * word boundary, never ending mid-thought with dots).
 */
export function explainerFor(explainer: string | undefined, objective: string | undefined): string {
  const e = cleanText(explainer, EXPLAINER_MAX);
  if (e) return e;
  const o = cleanText(objective, 400);
  if (!o) return "";
  const first = (o.split(/[.;:!?]/)[0] ?? o).trim();
  if (first.length <= EXPLAINER_MAX) return first;
  const cut = first.slice(0, EXPLAINER_MAX + 1);
  const comma = cut.lastIndexOf(",");
  if (comma >= 24) return cut.slice(0, comma).trim();
  const sp = cut.lastIndexOf(" ");
  return cut.slice(0, sp > 0 ? sp : EXPLAINER_MAX).trim();
}

/** Draws one filter. Never throws on odd text: it is cleaned, wrapped and shrunk to fit. */
export function renderFilter(
  ctx: Ctx,
  spec: FilterSpec,
  photo?: PlacedPhoto | null | undefined,
): FilterLayout {
  const f = prepareFilter(spec);
  const style = styleOf(spec);
  const look = LOOKS[style];
  ctx.save();
  try {
    look.draw(ctx, f, photo);
  } finally {
    ctx.restore();
  }
  return { width: f.W, height: f.H, style, photo: look.photo(f), items: f.items };
}

/** Renders to a PNG blob in the browser. Re-encoding through a fresh canvas drops all source metadata. */
export async function makeFilterBlob(
  spec: FilterSpec,
  photo?: PlacedPhoto | null | undefined,
): Promise<Blob> {
  const { width: w, height: h } = filterSize(spec.size);
  if (typeof OffscreenCanvas !== "undefined") {
    const c = new OffscreenCanvas(w, h);
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available in this browser");
    renderFilter(ctx as unknown as Ctx, spec, photo);
    return c.convertToBlob({ type: "image/png" });
  }
  if (typeof document === "undefined") throw new Error("Canvas is not available here");
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser");
  renderFilter(ctx, spec, photo);
  return new Promise<Blob>((resolve, reject) =>
    c.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not make the image"))), "image/png"),
  );
}

/** Draws into a visible canvas for live preview (scaled by CSS, drawn at full export size). */
export function drawFilterPreview(
  canvas: HTMLCanvasElement,
  spec: FilterSpec,
  photo?: PlacedPhoto | null | undefined,
): boolean {
  const { width, height } = filterSize(spec.size);
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;
  ctx.clearRect(0, 0, width, height);
  renderFilter(ctx, spec, photo);
  return true;
}

/** The "stamp earned" mini badge text: the adventure's first specific stamp, title-cased from its slug. */
export function stampTitle(slugs: readonly string[] | undefined): string {
  const slug = (slugs ?? []).find((x) => x && x !== "first-adventure");
  if (!slug) return "";
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
