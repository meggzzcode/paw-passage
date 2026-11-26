// Photo intake for keepsakes. Everything stays in memory on this device.
// Nothing here writes to browser storage, talks to a server, or logs file names or metadata.

export type PhotoSource = ImageBitmap | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas;

export const MAX_PHOTO_BYTES = 20 * 1024 * 1024;
export const MAX_PHOTO_EDGE = 2400;

export type PhotoErrorCode = "too-large" | "not-image" | "unreadable";

export class PhotoError extends Error {
  readonly code: PhotoErrorCode;
  constructor(code: PhotoErrorCode) {
    super(code);
    this.name = "PhotoError";
    this.code = code;
  }
}

/** Plain-words message for each failure, safe to show on screen. */
export function photoErrorMessage(e: unknown): string {
  const code = e instanceof PhotoError ? e.code : "unreadable";
  if (code === "too-large") return "That photo is larger than 20 MB. Please pick a smaller one.";
  if (code === "not-image") return "That file doesn't look like a photo. Please pick an image.";
  return "That photo couldn't be read. Try another one, or use the illustrated option.";
}

export function sourceSize(p: PhotoSource): { w: number; h: number } {
  const a = p as { naturalWidth?: number; naturalHeight?: number; width: number; height: number };
  return { w: a.naturalWidth || a.width || 0, h: a.naturalHeight || a.height || 0 };
}

/** Frees the decoded pixels of a photo. Safe to call on anything. */
export function closePhoto(p: PhotoSource | null | undefined): void {
  const c = (p as { close?: () => void } | null | undefined)?.close;
  if (typeof c === "function") {
    try {
      c.call(p);
    } catch {
      /* already closed */
    }
  }
}

/** Size after limiting the long edge. Never enlarges. */
export function downscaledSize(w: number, h: number, maxEdge = MAX_PHOTO_EDGE) {
  const long = Math.max(w, h);
  if (!(long > maxEdge)) return { w, h, scaled: false };
  const k = maxEdge / long;
  return { w: Math.max(1, Math.round(w * k)), h: Math.max(1, Math.round(h * k)), scaled: true };
}

async function decode(file: Blob): Promise<PhotoSource> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      try {
        // Some browsers reject the options object; plain decode still honours orientation there.
        return await createImageBitmap(file);
      } catch {
        /* fall through to the image element */
      }
    }
  }
  if (typeof document === "undefined") throw new PhotoError("unreadable");
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new PhotoError("unreadable"));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function downscale(src: PhotoSource): Promise<PhotoSource> {
  const { w, h } = sourceSize(src);
  const t = downscaledSize(w, h);
  if (!t.scaled) return src;
  let canvas: HTMLCanvasElement | OffscreenCanvas;
  if (typeof OffscreenCanvas !== "undefined") canvas = new OffscreenCanvas(t.w, t.h);
  else if (typeof document !== "undefined") {
    canvas = document.createElement("canvas");
    canvas.width = t.w;
    canvas.height = t.h;
  } else return src;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
  if (!ctx) return src;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, t.w, t.h);
  if (typeof createImageBitmap === "function") {
    try {
      const small = await createImageBitmap(canvas);
      closePhoto(src);
      return small;
    } catch {
      /* use the canvas itself */
    }
  }
  closePhoto(src);
  return canvas;
}

/**
 * Decodes a photo the person picked, upright, and no larger than 2400px on the long edge.
 * Rejects files over 20 MB or that are not images. The temporary object URL (fallback path) is revoked at once.
 */
export async function loadPhotoFile(file: Blob): Promise<PhotoSource> {
  if (file.size > MAX_PHOTO_BYTES) throw new PhotoError("too-large");
  if (file.type && !file.type.startsWith("image/")) throw new PhotoError("not-image");
  let decoded: PhotoSource;
  try {
    decoded = await decode(file);
  } catch (e) {
    throw e instanceof PhotoError ? e : new PhotoError("unreadable");
  }
  const { w, h } = sourceSize(decoded);
  if (!(w > 0 && h > 0)) {
    closePhoto(decoded);
    throw new PhotoError("unreadable");
  }
  return downscale(decoded);
}

// ------------------------------------------------------------- placement

export type Rotation = 0 | 1 | 2 | 3;

/** A photo plus how the person framed it. pan is -1..1 across the spare room, zoom is 1..4. */
export interface PlacedPhoto {
  source: PhotoSource;
  zoom: number;
  panX: number;
  panY: number;
  rotation: Rotation;
}

export const ZOOM_MIN = 1;
export const ZOOM_MAX = 4;

export function placed(source: PhotoSource): PlacedPhoto {
  return { source, zoom: 1, panX: 0, panY: 0, rotation: 0 };
}

const clamp = (v: number, lo: number, hi: number) =>
  Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : lo;

export function clampPlacement(p: PlacedPhoto): PlacedPhoto {
  return {
    ...p,
    zoom: clamp(p.zoom, ZOOM_MIN, ZOOM_MAX),
    panX: clamp(p.panX, -1, 1),
    panY: clamp(p.panY, -1, 1),
    rotation: (((Math.round(p.rotation) % 4) + 4) % 4) as Rotation,
  };
}

/**
 * Draws the photo covering the rectangle, honouring zoom, pan and 90-degree turns.
 * The editor and every template use this one function so the preview matches the export.
 */
export function drawPlacedPhoto(
  ctx: CanvasRenderingContext2D,
  photo: PlacedPhoto,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  const p = clampPlacement(photo);
  const { w: sw, h: sh } = sourceSize(p.source);
  if (!(sw > 0 && sh > 0 && w > 0 && h > 0)) return false;
  const odd = p.rotation % 2 === 1;
  const ew = odd ? sh : sw;
  const eh = odd ? sw : sh;
  const scale = Math.max(w / ew, h / eh) * p.zoom;
  const slackX = Math.max(0, ew * scale - w) / 2;
  const slackY = Math.max(0, eh * scale - h) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.translate(x + w / 2 - p.panX * slackX, y + h / 2 - p.panY * slackY);
  ctx.rotate((p.rotation * Math.PI) / 2);
  ctx.scale(scale, scale);
  ctx.drawImage(p.source, -sw / 2, -sh / 2);
  ctx.restore();
  return true;
}

/** Spare room (in frame pixels) the photo has to move left/right and up/down at its current zoom. */
export function slackFor(photo: PlacedPhoto, w: number, h: number): { x: number; y: number } {
  const p = clampPlacement(photo);
  const { w: sw, h: sh } = sourceSize(p.source);
  if (!(sw > 0 && sh > 0 && w > 0 && h > 0)) return { x: 0, y: 0 };
  const odd = p.rotation % 2 === 1;
  const ew = odd ? sh : sw;
  const eh = odd ? sw : sh;
  const scale = Math.max(w / ew, h / eh) * p.zoom;
  return { x: Math.max(0, ew * scale - w) / 2, y: Math.max(0, eh * scale - h) / 2 };
}

/** Dragging the picture by (dx, dy) frame pixels moves the picture with the finger. */
export function panByDrag(
  photo: PlacedPhoto,
  dx: number,
  dy: number,
  w: number,
  h: number,
): PlacedPhoto {
  const s = slackFor(photo, w, h);
  return clampPlacement({
    ...photo,
    panX: s.x > 0 ? photo.panX - dx / s.x : 0,
    panY: s.y > 0 ? photo.panY - dy / s.y : 0,
  });
}

export function rotateQuarter(photo: PlacedPhoto): PlacedPhoto {
  return clampPlacement({
    ...photo,
    rotation: ((photo.rotation + 1) % 4) as Rotation,
    panX: 0,
    panY: 0,
  });
}

export function resetPlacement(photo: PlacedPhoto): PlacedPhoto {
  return { ...photo, zoom: 1, panX: 0, panY: 0, rotation: 0 };
}
