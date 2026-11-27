// Dev-only harness for scripts/demo/render-examples.mjs and render-contact-sheet.mjs. Exposes the REAL keepsake
// renderer (makeArtworkBlob + loadPhotoFile + applyPhotoEffect) to a headless browser. Not part of the site build.
import { makeArtworkBlob, type ArtSpec } from "@/passport/keepsake/artwork";
import { loadPhotoFile } from "@/passport/keepsake/photo";
import { placed, type PlacedPhoto } from "@/passport/keepsake/photo";
import { applyPhotoEffect } from "@/passport/keepsake/filter-effects";
import { ensureKeepsakeFonts } from "@/passport/keepsake/fonts";
import { THEME_REGISTRY } from "@/passport/keepsake/themes";

export interface PhotoIn {
  b64: string;
  mime: string;
  zoom?: number;
  panX?: number;
  panY?: number;
}

async function toBlob(b64: string, mime: string): Promise<Blob> {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

async function renderOne(spec: ArtSpec, photos: PhotoIn[], effect = "original"): Promise<string> {
  await ensureKeepsakeFonts();
  const placedPhotos: PlacedPhoto[] = [];
  for (const p of photos) {
    const src = await loadPhotoFile(await toBlob(p.b64, p.mime));
    const pl = { ...placed(src), zoom: p.zoom ?? 1, panX: p.panX ?? 0, panY: p.panY ?? 0 };
    placedPhotos.push(applyPhotoEffect(pl, effect));
  }
  const blob = await makeArtworkBlob(spec, { photos: placedPhotos });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000)
    s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

(window as unknown as Record<string, unknown>).renderOne = renderOne;
(window as unknown as Record<string, unknown>).themeRegistry = THEME_REGISTRY;
document.title = "ready";
