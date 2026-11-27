/* eslint-disable react-refresh/only-export-components */
// Shared pieces of the collectible artwork (stamps and badges): the four visual states, their accessible wording,
// the cheap ink texture and the "Full Passport" ribbon. Original SVG only; nothing here is a third-party asset.
import type { ReactNode } from "react";

/**
 * earned: full colour with the postmark. next: full colour with a soft "next up" glow. available: full colour, quiet.
 * full-passport: full colour with a ribbon, for artwork that comes with the Full Passport (shown to free visitors).
 */
export type CollectibleState = "earned" | "next" | "available" | "full-passport";

export const STATE_TEXT: Record<CollectibleState, string> = {
  earned: "earned",
  next: "next up to earn",
  available: "available to earn",
  "full-passport": "included with the Full Passport",
};

/** Short visible caption under the artwork, so state is never colour only. */
export const STATE_CAPTION: Record<CollectibleState, string> = {
  earned: "Earned",
  next: "Next up",
  available: "To earn",
  "full-passport": "Full Passport",
};

export const PAPER = "#fbf6ea";
export const SERIF = '"Bricolage Grotesque", Georgia, "Times New Roman", serif';

/** useId output contains colons, which are awkward inside url(#...). */
export const safeId = (raw: string) => raw.replace(/[^a-zA-Z0-9_-]/g, "");

/**
 * Cheap ink texture: a tiny speckle pattern (for the paper) and one low-scale turbulence displacement that gives
 * the motif a slightly uneven, stamped edge. Both are defined once per artwork.
 */
export function InkDefs({ id, ink }: { id: string; ink: string }) {
  return (
    <defs>
      <pattern id={`${id}-sp`} width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="4" r="0.7" fill={ink} opacity="0.22" />
        <circle cx="10" cy="9" r="0.6" fill={ink} opacity="0.18" />
        <circle cx="7" cy="12" r="0.5" fill={ink} opacity="0.2" />
      </pattern>
      <filter id={`${id}-ink`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" />
      </filter>
    </defs>
  );
}

/** A small folded corner ribbon at the bottom of the artwork. Text is real SVG text, also named by the label. */
export function FullPassportRibbon({ y = 96 }: { y?: number }) {
  return (
    <g data-ribbon="full-passport">
      <path d={`M6 ${y}H114L108 ${y + 8}L114 ${y + 16}H6L12 ${y + 8}Z`} fill="#c8343f" />
      <path d={`M6 ${y}H114`} stroke="#fff6e3" strokeWidth="0.8" opacity="0.6" />
      <text
        x="60"
        y={y + 11.2}
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fontFamily={SERIF}
        fill="#fff6e3"
        letterSpacing="0.4"
      >
        Full Passport
      </text>
    </g>
  );
}

/** The "next up" pin: a little sparkle badge at the top right, plus the glow drawn by the caller. */
export function NextPin() {
  return (
    <g data-next-pin="true" transform="translate(100 18)">
      <circle r="11" fill="#fff6e3" stroke="#c9962c" strokeWidth="1.6" />
      <path d="M0-6l1.8 4.2L6 0l-4.2 1.8L0 6l-1.8-4.2L-6 0l4.2-1.8z" fill="#c9962c" />
    </g>
  );
}

export function ArtSvg({
  name,
  state,
  kind,
  size,
  dataId,
  children,
}: {
  name: string;
  state: CollectibleState;
  kind: "stamp" | "badge";
  size: number;
  dataId: string;
  children: ReactNode;
}) {
  const label = `${name} ${kind}, ${STATE_TEXT[state]}`;
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      data-art={kind}
      data-id={dataId}
      data-state={state}
      className="pv8-art"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}
