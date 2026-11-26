// Public entry for the ten-family keepsake artwork. Pure drawing over a canvas context so tests can pass a fake.
// Privacy: everything happens on this device. The PNG is a fresh canvas encode, so no original photo
// metadata (EXIF, GPS) is carried into it.
import { MEMORY_MAX, cleanText, type Ctx } from "./render";
import {
  ART_SIZES,
  W,
  type ArtAssets,
  type ArtSpec,
  type FamilyDef,
  type Prep,
  type SizeId,
  type Slot,
} from "./kit";
import { certificate, idCard, magazineCover, tradingCard, travelPostcard } from "./families-a";
import { collage, eventTicket, poster, seasonalFrame, thenAndNow } from "./families-b";
import { PHOTO_COUNT, themeFor, type KeepsakeFamily } from "./themes";

export { ART_SIZES };
export type { ArtAssets, ArtSpec, SizeId, Slot };

export const FAMILY_DEFS: Record<KeepsakeFamily, FamilyDef> = {
  "travel-postcard": travelPostcard,
  "magazine-cover": magazineCover,
  "id-card": idCard,
  "trading-card": tradingCard,
  certificate,
  "seasonal-frame": seasonalFrame,
  "event-ticket": eventTicket,
  "then-and-now": thenAndNow,
  collage,
  poster,
};

export function artworkSize(size: SizeId): { width: number; height: number } {
  const s = ART_SIZES[size] ?? ART_SIZES.square;
  return { width: s.width, height: s.height };
}

export function prepare(spec: ArtSpec): Prep {
  const t = themeFor(spec.family, spec.theme);
  const size: SizeId = spec.size in ART_SIZES ? spec.size : "square";
  const H = ART_SIZES[size].height;
  const story = size === "story";
  const head = cleanText(spec.headline, 60) || cleanText(t.label, 60);
  return {
    spec: { ...spec, size },
    t,
    head: t.upper ? head.toUpperCase() : head,
    sub: cleanText(spec.subhead, 80),
    name: cleanText(spec.dogName, 60) || "Your Dog",
    date: cleanText(spec.date, 40),
    memory: cleanText(spec.memory, MEMORY_MAX),
    H,
    story,
    safeTop: story ? 190 : 60,
    safeBottom: story ? 250 : 70,
  };
}

/** Where photos go for this family and size. The crop editor frames its viewport with the same rectangles. */
export function photoSlots(spec: ArtSpec, count = 1): Slot[] {
  const p = prepare(spec);
  return FAMILY_DEFS[spec.family].slots(p, count);
}

/** How many photo slots the person can fill for a family. */
export function photoLimits(family: KeepsakeFamily): { min: number; max: number } {
  return PHOTO_COUNT[family];
}

/** Draws one keepsake. Never throws on odd text: it is cleaned, wrapped and shrunk to fit. */
export function renderArtwork(ctx: Ctx, spec: ArtSpec, assets: ArtAssets = {}): void {
  const p = prepare(spec);
  const photos = (assets.photos ?? []).slice(0, PHOTO_COUNT[spec.family].max);
  const count = photos.filter(Boolean).length;
  const def = FAMILY_DEFS[spec.family];
  const slots = def.slots(p, count);
  ctx.save();
  try {
    def.draw(ctx, p, photos, slots);
  } finally {
    ctx.restore();
  }
}

/** Renders to a PNG blob in the browser. Re-encoding through a fresh canvas drops all source metadata. */
export async function makeArtworkBlob(spec: ArtSpec, assets: ArtAssets = {}): Promise<Blob> {
  const { width: w, height: h } = artworkSize(spec.size);
  if (typeof OffscreenCanvas !== "undefined") {
    const c = new OffscreenCanvas(w, h);
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available in this browser");
    renderArtwork(ctx as unknown as Ctx, spec, assets);
    return c.convertToBlob({ type: "image/png" });
  }
  if (typeof document === "undefined") throw new Error("Canvas is not available here");
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser");
  renderArtwork(ctx, spec, assets);
  return new Promise<Blob>((resolve, reject) =>
    c.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not make the image"))), "image/png"),
  );
}

/** Draws into a visible canvas element for live preview (scaled by CSS, drawn at full export size). */
export function drawPreview(canvas: HTMLCanvasElement, spec: ArtSpec, assets: ArtAssets): boolean {
  const { width, height } = artworkSize(spec.size);
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;
  ctx.clearRect(0, 0, width, height);
  renderArtwork(ctx, spec, assets);
  return true;
}

export { W };
