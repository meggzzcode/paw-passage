// A collectible mystery tile for a preview, tinted from its keepsake theme. Drawn with CSS only (no canvas, no image
// fetch), so it is cheap and never shows anything about how the adventure works.

const FAMILY_NAMES: Record<string, string> = {
  "travel-postcard": "Postcard",
  "magazine-cover": "Cover",
  "id-card": "ID card",
  "trading-card": "Trading card",
  certificate: "Certificate",
  "seasonal-frame": "Frame",
  "event-ticket": "Ticket",
  "then-and-now": "Photo pair",
  collage: "Collage",
  poster: "Poster",
};

// A stable tint from the theme id. The keepsake theme configuration is part of the editor and is not loaded here.
function hueOf(key: string): number {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

export function PreviewArt({ family, theme }: { family: string; theme: string }) {
  const h = hueOf(`${family}/${theme}`);
  const bg = `hsl(${h} 38% 26%)`;
  const bg2 = `hsl(${(h + 20) % 360} 42% 17%)`;
  const accent = `hsl(${(h + 40) % 360} 75% 72%)`;
  const card = "#fbf6ea";
  const ink = "#14283a";
  return (
    <div
      className="pv-art"
      aria-hidden="true"
      style={{
        background: `linear-gradient(145deg, ${bg} 0%, ${bg2} 100%)`,
        borderColor: accent,
      }}
    >
      <span className="pv-art-mark" style={{ color: accent, borderColor: accent }}>
        ?
      </span>
      <span className="pv-art-tag" style={{ background: card, color: ink }}>
        {FAMILY_NAMES[family] ?? "Keepsake"}
      </span>
    </div>
  );
}
