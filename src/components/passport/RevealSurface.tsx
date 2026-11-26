// The one reveal gesture for a mystery adventure: a single surface you can scratch (drag across it) or simply tap.
// Keyboard users press Enter or Space on it. There is no second button, mode or pop-up. A reveal is announced politely.
import { useRef, useState } from "react";

export const REVEAL_LABEL = "Scratch or tap to reveal.";
const KEY = "pp.revealed.v1";
const SCRATCH_PX = 90;

function read(): string[] {
  try {
    const v: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
/** Adventures this browser has already revealed. Asking again would be a needless extra step. */
export const wasRevealed = (id: string): boolean =>
  typeof window !== "undefined" && read().includes(id);
export function markRevealed(id: string) {
  try {
    const all = read();
    if (!all.includes(id))
      window.localStorage.setItem(KEY, JSON.stringify([...all, id].slice(-300)));
  } catch {
    /* blocked storage: the card simply asks again next visit */
  }
}

/** One persistent polite live region, so the announcement survives the card being swapped for the revealed one. */
export function announce(message: string) {
  if (typeof document === "undefined") return;
  let el = document.getElementById("pp-announcer");
  if (!el) {
    el = document.createElement("div");
    el.id = "pp-announcer";
    el.className = "sr-only";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.textContent = "";
  window.setTimeout(() => {
    if (el) el.textContent = message;
  }, 30);
}

export function RevealSurface({
  adventureId,
  onReveal,
}: {
  adventureId: string;
  onReveal: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const drag = useRef<{ x: number; y: number; dist: number } | null>(null);
  const swallowClick = useRef(false);

  function go() {
    markRevealed(adventureId);
    announce("Adventure revealed.");
    onReveal();
  }
  return (
    <button
      type="button"
      className="pa-scratch"
      style={{ ["--scratch" as string]: progress }}
      onClick={() => {
        if (swallowClick.current) {
          swallowClick.current = false;
          return;
        }
        go();
      }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY, dist: 0 };
        swallowClick.current = false;
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        d.dist += Math.hypot(e.clientX - d.x, e.clientY - d.y);
        d.x = e.clientX;
        d.y = e.clientY;
        setProgress(Math.min(1, d.dist / SCRATCH_PX));
        if (d.dist >= SCRATCH_PX) {
          drag.current = null;
          swallowClick.current = true;
          go();
        }
      }}
      onPointerUp={() => {
        drag.current = null;
        setProgress(0);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setProgress(0);
      }}
    >
      <span className="pa-scratch-text">{REVEAL_LABEL}</span>
    </button>
  );
}
