// Collectible souvenir stamps: a die-cut paper sticker with a coloured wash, a stitched inner border, a lightly
// inked motif and (once earned) a paw postmark. Every stamp keeps the silhouette and motif from the passport set.
import { useId } from "react";
import {
  ART,
  INKS,
  OUTLINES,
  PostmarkRing,
  STAMP_LABELS,
  STAMP_SLUGS,
} from "@/passport/art/stamps";
import type { StampSlug } from "@/passport/art/stamps";
import { ArtSvg, FullPassportRibbon, InkDefs, NextPin, PAPER, safeId } from "./art-shared";
import type { CollectibleState } from "./art-shared";

export { STAMP_SLUGS, STAMP_LABELS };
export type { StampSlug };

const isSlug = (s: string): s is StampSlug => (STAMP_SLUGS as readonly string[]).includes(s);

export function StampArt({
  id,
  state = "available",
  size = 112,
  label,
}: {
  id: StampSlug | string;
  state?: CollectibleState;
  size?: number;
  label?: string;
}) {
  const uid = safeId(useId());
  const known = isSlug(id);
  const key: StampSlug = known ? id : "first-adventure";
  const name = label ?? (known ? STAMP_LABELS[key] : String(id));
  const inks = INKS[key];
  const outline = OUTLINES[key];
  const ribbon = state === "full-passport";
  return (
    <ArtSvg name={name} state={state} kind="stamp" size={size} dataId={key}>
      <InkDefs id={uid} ink={inks.a} />
      {state === "next" && (
        <path
          d={outline}
          fill="none"
          stroke="#c9962c"
          strokeWidth="9"
          strokeLinejoin="round"
          opacity="0.28"
          data-glow="true"
        />
      )}
      {/* die-cut sticker border, then the paper, wash and speckle */}
      <path
        d={outline}
        fill="#fffdf7"
        stroke="#fffdf7"
        strokeWidth="5"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path d={outline} fill={PAPER} stroke={inks.a} strokeWidth="2.6" strokeLinejoin="round" />
      <path d={outline} fill={inks.a} opacity="0.08" />
      <path d={outline} fill={`url(#${uid}-sp)`} />
      <path
        d={outline}
        fill="none"
        stroke={inks.a}
        strokeWidth="1.2"
        strokeDasharray="0.1 3.4"
        strokeLinecap="round"
        transform="translate(60 60) scale(0.88) translate(-60 -60)"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <g filter={`url(#${uid}-ink)`}>{ART[key](inks)}</g>
      {state === "earned" && <PostmarkRing id={`${uid}-pm`} ink={inks.b} />}
      {state === "next" && <NextPin />}
      {ribbon && <FullPassportRibbon y={92} />}
    </ArtSvg>
  );
}
