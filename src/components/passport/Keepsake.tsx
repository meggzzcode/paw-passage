import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Adventure } from "@/passport/schema";
import {
  ART_SIZES,
  drawPreview,
  makeArtworkBlob,
  photoLimits,
  photoSlots,
  type ArtSpec,
  type SizeId,
} from "@/passport/keepsake/artwork";
import { MEMORY_MAX, downloadBlob, shareBlob } from "@/passport/keepsake/render";
import {
  closePhoto,
  loadPhotoFile,
  photoErrorMessage,
  placed,
  type PlacedPhoto,
} from "@/passport/keepsake/photo";
import type { KeepsakeFamily } from "@/passport/keepsake/themes";
import { track } from "@/passport/events";
import { usePassport } from "@/passport/usePassport";
import { PhotoEditor } from "./PhotoEditor";

const SIZE_IDS: SizeId[] = ["square", "portrait", "story"];

function slotNames(family: KeepsakeFamily, count: number): string[] {
  if (family === "then-and-now") return ["Then photo", "Now photo"];
  if (family === "collage") return Array.from({ length: count }, (_, i) => `Photo ${i + 1}`);
  return ["Photo"];
}

function fileName(family: string, size: SizeId): string {
  return `paw-and-passage-${family}-${size}.png`;
}

/**
 * The whole keepsake flow: pick or take a photo (or use the illustrated option), frame it, add a name and
 * a short memory, preview, then download or share. Photos stay in memory on this device: they are never
 * uploaded or stored, and the exported PNG is a fresh canvas encode with no original metadata.
 */
export function Keepsake({
  adventure,
  dogName,
  memory,
}: {
  adventure: Adventure;
  dogName?: string | undefined;
  memory?: string | undefined;
}) {
  const { family, theme, headline, subhead } = adventure.keepsake;
  const limits = photoLimits(family);
  const [photos, setPhotos] = useState<(PlacedPhoto | null)[]>([]);
  const [active, setActive] = useState(0);
  const { profile } = usePassport();
  const [typedName, setName] = useState<string | null>(null);
  const name = typedName ?? dogName ?? profile.name ?? "";
  const [note, setNote] = useState((memory ?? "").slice(0, MEMORY_MAX));
  const [size, setSize] = useState<SizeId>("portrait");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const target = useRef(0);
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  const [date] = useState(() =>
    new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }),
  );

  // Free decoded pixels when the component goes away.
  useEffect(
    () => () => {
      for (const p of photosRef.current) closePhoto(p?.source);
    },
    [],
  );

  const filled = photos.filter(Boolean).length;
  const shown =
    family === "then-and-now" ? 2 : family === "collage" ? Math.min(limits.max, filled + 1) : 1;
  const names = slotNames(family, shown);

  const spec: ArtSpec = useMemo(
    () => ({
      family,
      theme,
      headline,
      subhead,
      dogName: name,
      date,
      memory: note,
      size,
    }),
    [family, theme, headline, subhead, name, date, note, size],
  );
  const ordered = useMemo(
    () => (family === "collage" ? photos.filter(Boolean) : photos.slice(0, limits.max)),
    [family, photos, limits.max],
  );

  // live preview
  useEffect(() => {
    const c = previewRef.current;
    if (!c) return;
    const raf = requestAnimationFrame(() => {
      try {
        drawPreview(c, spec, { photos: ordered });
      } catch {
        setStatus("Sorry, this browser couldn't draw the preview.");
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [spec, ordered]);

  const setSlot = useCallback(
    (i: number, next: PlacedPhoto | null) => {
      setPhotos((prev) => {
        const arr = prev.slice();
        const old = arr[i];
        if (old && old.source !== next?.source) closePhoto(old.source);
        if (family === "collage" && next === null) arr.splice(i, 1);
        else {
          while (arr.length <= i) arr.push(null);
          arr[i] = next;
        }
        return arr;
      });
    },
    [family],
  );

  const pick = (i: number, which: "camera" | "gallery") => {
    target.current = i;
    (which === "camera" ? cameraRef : galleryRef).current?.click();
  };

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const i = target.current;
    setStatus("Opening your photo…");
    try {
      const src = await loadPhotoFile(f);
      setSlot(family === "collage" ? Math.min(i, filled) : i, placed(src));
      setActive(family === "collage" ? Math.min(i, filled) : i);
      setStatus("Photo ready. Drag it to frame the picture.");
    } catch (err) {
      setStatus(photoErrorMessage(err));
    }
  }

  const activeIdx = Math.min(active, Math.max(0, shown - 1));
  const activePhoto = photos[activeIdx] ?? null;
  const editorAspect = useMemo(() => {
    const count = family === "collage" ? Math.max(1, filled) : 1;
    const s = photoSlots(spec, count)[
      family === "collage" ? Math.min(activeIdx, count - 1) : activeIdx
    ];
    return s ? s.w / s.h : 1;
  }, [spec, family, filled, activeIdx]);

  async function build(): Promise<Blob | null> {
    setBusy(true);
    try {
      const b = await makeArtworkBlob(spec, { photos: ordered });
      track("keepsake_created", { adventure: adventure.id });
      return b;
    } catch {
      setStatus("Sorry, this browser couldn't make the image. Try another browser.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function onDownload() {
    const b = await build();
    if (!b) return;
    downloadBlob(b, fileName(family, size));
    setStatus("Saved to your device. Look in your downloads or photos.");
  }

  async function onShare() {
    const b = await build();
    if (!b) return;
    track("share_clicked", { kind: "keepsake" });
    const r = await shareBlob(b, fileName(family, size), "");
    if (r === "shared") {
      track("share_completed", { kind: "keepsake" });
      setStatus("Sent to your device's share sheet.");
    } else if (r === "cancelled") setStatus("Sharing cancelled. Nothing was sent.");
    else {
      downloadBlob(b, fileName(family, size));
      setStatus(
        "This browser can't share images directly, so the picture was saved to your device instead. Nothing was posted anywhere.",
      );
    }
  }

  function makeAnother() {
    for (const p of photosRef.current) closePhoto(p?.source);
    setPhotos([]);
    setActive(0);
    setStatus("Ready for a new photo.");
  }

  return (
    <div className="kp">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="kp-file"
        tabIndex={-1}
        aria-hidden="true"
        onChange={onFile}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="kp-file"
        tabIndex={-1}
        aria-hidden="true"
        onChange={onFile}
      />

      <section className="kp-step" aria-labelledby="kp-h-photo">
        <h3 id="kp-h-photo" className="kp-h">
          1. Photo
        </h3>
        <p className="pa-fine">
          Take a new photo, choose one you have, or skip it and use the illustrated version.
        </p>
        <ul className="kp-slots">
          {names.map((n, i) => {
            const has = Boolean(photos[i]);
            return (
              <li key={n} className="kp-slot">
                <strong>{n}</strong>
                <span className="pa-fine">{has ? "Added" : "Illustrated for now"}</span>
                <div className="kp-row">
                  <button
                    type="button"
                    className="pp-btn pp-btn-secondary"
                    onClick={() => pick(i, "camera")}
                  >
                    Take a photo
                  </button>
                  <button
                    type="button"
                    className="pp-btn pp-btn-secondary"
                    onClick={() => pick(i, "gallery")}
                  >
                    Choose from photos
                  </button>
                  {has && (
                    <>
                      <button
                        type="button"
                        className="pp-btn pp-btn-ghost"
                        onClick={() => setActive(i)}
                      >
                        Adjust
                      </button>
                      <button
                        type="button"
                        className="pp-btn pp-btn-ghost"
                        onClick={() => setSlot(i, null)}
                      >
                        No photo
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {activePhoto && (
        <section className="kp-step" aria-labelledby="kp-h-crop">
          <h3 id="kp-h-crop" className="kp-h">
            2. Frame it
          </h3>
          <PhotoEditor
            photo={activePhoto}
            aspect={editorAspect}
            label={names[activeIdx] ?? "Photo"}
            onChange={(next) => setSlot(activeIdx, next)}
          />
        </section>
      )}

      <section className="kp-step" aria-labelledby="kp-h-words">
        <h3 id="kp-h-words" className="kp-h">
          {activePhoto ? "3" : "2"}. Names and words
        </h3>
        <label className="pa-field">
          <span>Dog's name</span>
          <input
            type="text"
            value={name}
            maxLength={60}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="pa-field">
          <span>A short memory (optional)</span>
          <textarea
            rows={3}
            maxLength={MEMORY_MAX}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <span className="pa-fine" aria-live="polite">
            {note.length} of {MEMORY_MAX}
          </span>
        </label>
      </section>

      <section className="kp-step" aria-labelledby="kp-h-out">
        <h3 id="kp-h-out" className="kp-h">
          {activePhoto ? "4" : "3"}. Preview and save
        </h3>
        <fieldset className="kp-sizes">
          <legend>Shape</legend>
          {SIZE_IDS.map((s) => (
            <label key={s} className={`kp-size${size === s ? " kp-size-on" : ""}`}>
              <input
                type="radio"
                name="kp-size"
                value={s}
                checked={size === s}
                onChange={() => setSize(s)}
              />
              <span>
                {ART_SIZES[s].label}
                <small>
                  {ART_SIZES[s].width} &times; {ART_SIZES[s].height}
                </small>
              </span>
            </label>
          ))}
        </fieldset>
        <canvas
          ref={previewRef}
          className="kp-preview"
          style={{ aspectRatio: `${ART_SIZES[size].width} / ${ART_SIZES[size].height}` }}
          role="img"
          aria-label={`Preview of the ${headline} keepsake for ${name || "your dog"}`}
        />
        <div className="kp-row">
          <button
            type="button"
            className="pp-btn pp-btn-primary"
            disabled={busy}
            onClick={onDownload}
          >
            {busy ? "Making…" : "Download PNG"}
          </button>
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            disabled={busy}
            onClick={onShare}
          >
            Share
          </button>
          <button type="button" className="pp-btn pp-btn-ghost" onClick={makeAnother}>
            Make another with a new photo
          </button>
        </div>
        <p role="status" className="pa-fine kp-status">
          {status}
        </p>
        <p className="pa-fine">
          Your photos and the images you download stay on this device. They are not uploaded and do
          not sync to your other devices.
        </p>
      </section>
    </div>
  );
}
