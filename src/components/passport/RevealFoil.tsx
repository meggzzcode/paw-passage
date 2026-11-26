// Decorative "foil" layer for the mystery reveal (Lovable's scratch look). It only paints a gradient and erases it under the
// pointer: it never loads, reads, exports or uploads an image or any pixel data, and it is aria-hidden. See RevealSurface.
import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * Purely visual scratch layer: a gradient "foil" canvas that the pointer erases while you drag. It is aria-hidden and
 * ignores the pointer (the button owns every event), so keyboard, tap, drag-distance reveal and the live region behave
 * exactly as before. Skipped under reduced motion, and when canvas is unavailable (older browsers, tests).
 */
export function RevealFoil({
  drag,
}: {
  drag: MutableRefObject<{ x: number; y: number; dist: number } | null>;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || typeof window === "undefined") return;
    if (/jsdom/i.test(navigator.userAgent)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = cv.getContext("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) return;
    const c = ctx;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = w * dpr;
    cv.height = h * dpr;
    c.scale(dpr, dpr);
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#f7e38a");
    g.addColorStop(0.55, "#f5b8c0");
    g.addColorStop(1, "#bfdcf2");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.fillStyle = "rgba(255,255,255,0.75)";
    for (let i = 0; i < 26; i++) {
      c.beginPath();
      c.arc(((i * 53) % 97) * (w / 97), ((i * 37) % 89) * (h / 89), 2, 0, 6.3);
      c.fill();
    }
    c.globalCompositeOperation = "destination-out";
    let last: { x: number; y: number } | null = null;
    const move = (e: PointerEvent) => {
      if (!drag.current) {
        last = null;
        return;
      }
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      c.lineWidth = 36;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(last?.x ?? x, last?.y ?? y);
      c.lineTo(x, y);
      c.stroke();
      last = { x, y };
    };
    const up = () => {
      last = null;
    };
    const btn = cv.parentElement;
    btn?.addEventListener("pointermove", move);
    btn?.addEventListener("pointerup", up);
    return () => {
      btn?.removeEventListener("pointermove", move);
      btn?.removeEventListener("pointerup", up);
    };
  }, [drag]);
  return <canvas ref={ref} className="pa-scratch-foil" aria-hidden="true" />;
}
