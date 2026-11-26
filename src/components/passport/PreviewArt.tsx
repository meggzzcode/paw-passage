// A collectible mystery tile for a preview, tinted from its keepsake theme. Drawn with CSS only (no canvas, no image
// fetch), so it is cheap and never shows anything about how the adventure works.
import { themeFor } from "@/passport/keepsake/themes";
import type { KeepsakeFamily } from "@/passport/keepsake/themes";

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

export function PreviewArt({ family, theme }: { family: string; theme: string }) {
  let bg = "#2b4a63";
  let bg2 = "#1d3446";
  let accent = "#f0c36d";
  let card = "#fbf6ea";
  let ink = "#14283a";
  try {
    const p = themeFor(family as KeepsakeFamily, theme).palette;
    ({ bg, bg2, accent, card, ink } = p);
  } catch {
    /* unknown family: keep the default colors */
  }
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
