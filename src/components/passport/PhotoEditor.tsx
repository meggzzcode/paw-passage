import { useCallback, useEffect, useRef } from "react";
import {
  ZOOM_MAX,
  ZOOM_MIN,
  clampPlacement,
  drawPlacedPhoto,
  panByDrag,
  resetPlacement,
  rotateQuarter,
  type PlacedPhoto,
} from "@/passport/keepsake/photo";

const VIEW_W = 640;

/**
 * Crop and reposition one photo inside the frame the artwork will use for it.
 * Drag to move, pinch or use the slider to zoom, arrow keys move, +/- zoom. The viewport is drawn with the
 * same function as the finished artwork, so what you frame is what you get.
 */
export function PhotoEditor({
  photo,
  aspect,
  label,
  onChange,
}: {
  photo: PlacedPhoto;
  /** Frame width divided by height. */
  aspect: number;
  label: string;
  onChange: (next: PlacedPhoto) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);
  const photoRef = useRef(photo);
  useEffect(() => {
    photoRef.current = photo;
  }, [photo]);
  const vw = VIEW_W;
  const vh = Math.round(VIEW_W / Math.max(0.2, Math.min(5, aspect)));

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, vw, vh);
    drawPlacedPhoto(ctx, photo, 0, 0, vw, vh);
  }, [photo, vw, vh]);

  const scaleOf = useCallback(() => {
    const r = canvasRef.current?.getBoundingClientRect();
    return r && r.width > 0 ? vw / r.width : 1;
  }, [vw]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()] as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: photoRef.current.zoom };
    }
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()] as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current.dist > 0)
        onChange(
          clampPlacement({
            ...photoRef.current,
            zoom: pinch.current.zoom * (d / pinch.current.dist),
          }),
        );
      return;
    }
    const k = scaleOf();
    onChange(
      panByDrag(photoRef.current, (e.clientX - prev.x) * k, (e.clientY - prev.y) * k, vw, vh),
    );
  };
  const onPointerEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  const onKey = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const step = e.shiftKey ? 0.3 : 0.1;
    const p = photoRef.current;
    let next: PlacedPhoto | null = null;
    if (e.key === "ArrowLeft") next = { ...p, panX: p.panX - step };
    else if (e.key === "ArrowRight") next = { ...p, panX: p.panX + step };
    else if (e.key === "ArrowUp") next = { ...p, panY: p.panY - step };
    else if (e.key === "ArrowDown") next = { ...p, panY: p.panY + step };
    else if (e.key === "+" || e.key === "=") next = { ...p, zoom: p.zoom + 0.1 };
    else if (e.key === "-" || e.key === "_") next = { ...p, zoom: p.zoom - 0.1 };
    if (next) {
      e.preventDefault();
      onChange(clampPlacement(next));
    }
  };

  const id = useRef(`pe-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <div className="kp-editor">
      <canvas
        ref={canvasRef}
        width={vw}
        height={vh}
        className="kp-viewport"
        style={{ aspectRatio: `${vw} / ${vh}`, touchAction: "none" }}
        tabIndex={0}
        role="img"
        aria-label={`${label}: crop area. Drag to move the photo. Arrow keys move it, plus and minus zoom.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKey}
      />
      <div className="kp-controls">
        <label htmlFor={`${id}-zoom`}>Zoom</label>
        <input
          id={`${id}-zoom`}
          type="range"
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={0.01}
          value={photo.zoom}
          onChange={(e) => onChange(clampPlacement({ ...photo, zoom: Number(e.target.value) }))}
        />
        <label htmlFor={`${id}-x`}>Move left or right</label>
        <input
          id={`${id}-x`}
          type="range"
          min={-1}
          max={1}
          step={0.01}
          value={photo.panX}
          onChange={(e) => onChange(clampPlacement({ ...photo, panX: Number(e.target.value) }))}
        />
        <label htmlFor={`${id}-y`}>Move up or down</label>
        <input
          id={`${id}-y`}
          type="range"
          min={-1}
          max={1}
          step={0.01}
          value={photo.panY}
          onChange={(e) => onChange(clampPlacement({ ...photo, panY: Number(e.target.value) }))}
        />
        <div className="kp-row">
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            onClick={() => onChange(rotateQuarter(photo))}
          >
            Rotate 90&deg;
          </button>
          <button
            type="button"
            className="pp-btn pp-btn-ghost"
            onClick={() => onChange(resetPlacement(photo))}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
