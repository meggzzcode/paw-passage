import { useEffect, useRef, useState } from "react";

/** One card surface: scratch it, or tap/press Enter to reveal. */
export function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const moved = useRef(0);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.width = r.width * 2;
    c.height = r.height * 2;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const css = getComputedStyle(c);
    const g = ctx.createLinearGradient(0, 0, c.width, c.height);
    g.addColorStop(0, css.getPropertyValue("--em-butter"));
    g.addColorStop(0.5, css.getPropertyValue("--em-strawberry"));
    g.addColorStop(1, css.getPropertyValue("--em-powder"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = css.getPropertyValue("--em-paper");
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 90; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * c.width, Math.random() * c.height, 3 + Math.random() * 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = css.getPropertyValue("--em-ink");
    ctx.textAlign = "center";
    ctx.font = `700 ${c.width / 9}px "Bricolage Grotesque", sans-serif`;
    ctx.fillText("A little", c.width / 2, c.height / 2 - c.width / 14);
    ctx.fillText("adventure awaits", c.width / 2, c.height / 2 + c.width / 22);
    ctx.font = `600 ${c.width / 13}px Caveat, cursive`;
    ctx.fillText("scratch or tap to reveal", c.width / 2, c.height / 2 + c.width / 5);
  }, []);

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const c = e.currentTarget;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const r = c.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc((e.clientX - r.left) * 2, (e.clientY - r.top) * 2, 44, 0, Math.PI * 2);
    ctx.fill();
    moved.current += 1;
    if (moved.current > 70) setRevealed(true);
  };

  return (
    <div className="em-scratch" data-revealed={revealed}>
      <div className="em-scratch-inner" aria-live="polite">
        <div>
          <p className="em-hand" style={{ fontSize: "1.5rem", color: "var(--em-cherry)" }}>Your mystery date</p>
          <h3 style={{ fontSize: "2.4rem", marginTop: ".5rem" }}>Pup-cup tasting flight</h3>
          <p style={{ marginTop: ".8rem", color: "var(--em-ink-soft)", lineHeight: 1.5 }}>
            Visit two dog-friendly cafés and let your sidekick cast the deciding sniff.
          </p>
        </div>
        <div className="em-chips">
          <span className="em-chip">⏱ 1–2 hrs</span>
          <span className="em-chip">$ Under $15</span>
          <span className="em-chip">☕ Doggy date</span>
          <span className="em-chip">Leash-friendly pups</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        role="button"
        tabIndex={revealed ? -1 : 0}
        aria-label="Mystery adventure card. Scratch or tap to reveal."
        onPointerDown={(e) => { drawing.current = true; moved.current = 0; scratch(e); }}
        onPointerMove={scratch}
        onPointerUp={() => { if (moved.current < 4) setRevealed(true); drawing.current = false; }}
        onPointerLeave={() => { drawing.current = false; }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setRevealed(true); } }}
      />
    </div>
  );
}
