/* eslint-disable react-refresh/only-export-components */
// Merit badges for the eight milestones: a scalloped rosette with ribbon tails, an inked motif and a small number
// banner. One badge per milestone id; each has its own motif and colours from the warm Everyday Magic palette.
import { useId } from "react";
import type { ReactNode } from "react";
import { Paw } from "@/passport/art/stamps";
import { ArtSvg, FullPassportRibbon, InkDefs, NextPin, PAPER, SERIF, safeId } from "./art-shared";
import type { CollectibleState } from "./art-shared";

export const BADGE_IDS = [
  "milestone-1",
  "milestone-5",
  "milestone-10",
  "milestone-20",
  "milestone-30",
  "milestone-50",
  "milestone-75",
  "collection-complete",
] as const;
export type BadgeId = (typeof BADGE_IDS)[number];

/** The achievement definitions have no id of their own; this is the stable id derived from them. */
export function badgeIdFor(a: { kind?: string; threshold?: number | undefined }): string {
  return a.kind === "collection-complete" ? "collection-complete" : `milestone-${a.threshold}`;
}

export const BADGE_LABELS: Record<BadgeId, string> = {
  "milestone-1": "First Footprint",
  "milestone-5": "Pawing Along",
  "milestone-10": "Regular Explorer",
  "milestone-20": "Seasoned Traveller",
  "milestone-30": "Trailblazing Duo",
  "milestone-50": "Adventure Veteran",
  "milestone-75": "Passport Master",
  "collection-complete": "Collection Complete",
};

const BANNER: Record<BadgeId, string> = {
  "milestone-1": "1",
  "milestone-5": "5",
  "milestone-10": "10",
  "milestone-20": "20",
  "milestone-30": "30",
  "milestone-50": "50",
  "milestone-75": "75",
  "collection-complete": "SET",
};

const INK: Record<BadgeId, { a: string; b: string }> = {
  "milestone-1": { a: "#c8343f", b: "#4f8a5b" },
  "milestone-5": { a: "#2f5f3a", b: "#c47a14" },
  "milestone-10": { a: "#2c6e8a", b: "#c47a14" },
  "milestone-20": { a: "#8a4b1f", b: "#2c6e8a" },
  "milestone-30": { a: "#b5564f", b: "#2f5f3a" },
  "milestone-50": { a: "#7a2a2a", b: "#b08a24" },
  "milestone-75": { a: "#b08a24", b: "#c8343f" },
  "collection-complete": { a: "#6a3f7a", b: "#c8343f" },
};

const CX = 60;
const CY = 50;

/** Scalloped circle: n bumps on a circle of radius r. */
function rosette(n: number, r: number): string {
  const rb = r * Math.sin(Math.PI / n);
  const pt = (i: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return `${(CX + Math.cos(a) * r).toFixed(2)} ${(CY + Math.sin(a) * r).toFixed(2)}`;
  };
  let d = `M${pt(0)}`;
  for (let i = 1; i <= n; i++) d += ` A${rb.toFixed(2)} ${rb.toFixed(2)} 0 0 1 ${pt(i % n)}`;
  return d + "Z";
}

const Star = ({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    fill={fill}
    d="M0-10l3 6.8 7.4.8-5.5 5 1.6 7.3L0 6l-6.5 3.9 1.6-7.3-5.5-5 7.4-.8z"
  />
);

const MOTIF: Record<BadgeId, (i: { a: string; b: string }) => ReactNode> = {
  // one big paw print
  "milestone-1": ({ a, b }) => (
    <g>
      <Paw x={CX} y={CY - 2} s={1.35} fill={a} />
      <Star x={84} y={28} s={0.55} fill={b} />
    </g>
  ),
  // two prints walking up a dotted trail
  "milestone-5": ({ a, b }) => (
    <g>
      <path
        d="M34 70C44 62 50 66 58 58"
        fill="none"
        stroke={b}
        strokeWidth="2.4"
        strokeDasharray="1 5"
        strokeLinecap="round"
      />
      <Paw x={46} y={66} s={0.72} fill={a} />
      <Paw x={74} y={42} s={0.72} fill={a} />
    </g>
  ),
  // compass with a paw print at the centre
  "milestone-10": ({ a, b }) => (
    <g>
      <circle cx={CX} cy={CY} r="23" fill="none" stroke={a} strokeWidth="3" />
      <path d={`M${CX} 30V35M${CX} 65V70M40 ${CY}H45M75 ${CY}H80`} stroke={a} strokeWidth="2.4" />
      <path d={`M${CX} 33L67 ${CY}L${CX} 67L53 ${CY}Z`} fill={b} />
      <path d={`M${CX} 33L67 ${CY}L53 ${CY}Z`} fill={a} />
      <circle cx={CX} cy={CY} r="3" fill={PAPER} />
    </g>
  ),
  // travel suitcase with a paw sticker and a leaf
  "milestone-20": ({ a, b }) => (
    <g>
      <path d="M50 36V31Q50 28 53 28H67Q70 28 70 31V36" fill="none" stroke={a} strokeWidth="3" />
      <rect x="36" y="36" width="48" height="34" rx="6" fill={a} />
      <path d="M46 36V70M74 36V70" stroke={PAPER} strokeWidth="2" opacity="0.7" />
      <circle cx={CX} cy="53" r="8.5" fill={PAPER} />
      <Paw x={CX} y={52} s={0.36} fill={b} />
      <path d="M76 66C76 58 82 56 86 56C86 62 82 68 76 66Z" fill={b} />
    </g>
  ),
  // two paws side by side under a heart
  "milestone-30": ({ a, b }) => (
    <g>
      <path
        d="M60 42c-5-8-15-3-10 5l10 9 10-9c5-8-5-13-10-5z"
        fill={a}
        transform="translate(0 -6)"
      />
      <Paw x={46} y={62} s={0.68} fill={b} />
      <Paw x={74} y={62} s={0.68} fill={b} />
    </g>
  ),
  // medal on a ribbon with a star and dog tag
  "milestone-50": ({ a, b }) => (
    <g>
      <circle cx={CX} cy={CY} r="24" fill={a} />
      <circle cx={CX} cy={CY} r="19" fill="none" stroke={PAPER} strokeWidth="1.4" opacity="0.8" />
      <Star x={CX} y={CY - 2} s={1.35} fill={b} />
      <Paw x={CX} y={CY + 14} s={0.28} fill={PAPER} />
    </g>
  ),
  // an open passport book with a paw and a star
  "milestone-75": ({ a, b }) => (
    <g>
      <path d="M34 38Q48 32 60 38V70Q48 64 34 70Z" fill={b} opacity="0.9" />
      <path d="M86 38Q72 32 60 38V70Q72 64 86 70Z" fill={a} />
      <path d={`M${CX} 38V70`} stroke={PAPER} strokeWidth="1.8" />
      <Paw x={46} y={52} s={0.46} fill={PAPER} />
      <Star x={73} y={53} s={0.78} fill={PAPER} />
    </g>
  ),
  // laurel wreath around a check mark
  "collection-complete": ({ a, b }) => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <ellipse
            cx={38 + i * 1.4}
            cy={64 - i * 9}
            rx="3.2"
            ry="6"
            fill={a}
            transform={`rotate(${-34 + i * 10} ${38 + i * 1.4} ${64 - i * 9})`}
          />
          <ellipse
            cx={82 - i * 1.4}
            cy={64 - i * 9}
            rx="3.2"
            ry="6"
            fill={a}
            transform={`rotate(${34 - i * 10} ${82 - i * 1.4} ${64 - i * 9})`}
          />
        </g>
      ))}
      <path
        d="M50 50L57 58L72 40"
        fill="none"
        stroke={b}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Paw x={CX} y={72} s={0.3} fill={a} />
    </g>
  ),
};

const isId = (s: string): s is BadgeId => (BADGE_IDS as readonly string[]).includes(s);

export function BadgeArt({
  id,
  state = "available",
  size = 112,
  label,
}: {
  id: BadgeId | string;
  state?: CollectibleState;
  size?: number;
  label?: string;
}) {
  const uid = safeId(useId());
  const known = isId(id);
  const key: BadgeId = known ? id : "milestone-1";
  const name = label ?? (known ? BADGE_LABELS[key] : String(id));
  const inks = INK[key];
  const earned = state === "earned";
  return (
    <ArtSvg name={name} state={state} kind="badge" size={size} dataId={key}>
      <InkDefs id={uid} ink={inks.a} />
      {/* ribbon tails */}
      <path d="M42 84L34 114L46 108L52 116L58 88Z" fill={inks.b} />
      <path d="M78 84L86 114L74 108L68 116L62 88Z" fill={inks.a} />
      {state === "next" && (
        <path
          d={rosette(18, 52)}
          fill="none"
          stroke="#c9962c"
          strokeWidth="8"
          opacity="0.28"
          data-glow="true"
        />
      )}
      <path d={rosette(18, 47)} fill="#fffdf7" stroke="#fffdf7" strokeWidth="5" />
      <path d={rosette(18, 47)} fill={PAPER} stroke={inks.a} strokeWidth="2.4" />
      <path d={rosette(18, 47)} fill={inks.a} opacity="0.08" />
      <path d={rosette(18, 47)} fill={`url(#${uid}-sp)`} />
      <circle
        cx={CX}
        cy={CY}
        r="38"
        fill="none"
        stroke={inks.a}
        strokeWidth="1.2"
        strokeDasharray="0.1 3.4"
        strokeLinecap="round"
      />
      <g filter={`url(#${uid}-ink)`}>{MOTIF[key](inks)}</g>
      {/* number banner */}
      <g>
        <rect x="40" y="76" width="40" height="15" rx="7.5" fill={inks.a} />
        <text
          x={CX}
          y="87"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fontFamily={SERIF}
          fill={PAPER}
          letterSpacing="0.6"
        >
          {BANNER[key]}
        </text>
      </g>
      {earned && (
        <g data-earned-seal="true" transform="translate(96 24)">
          <circle r="10" fill="#4f8a5b" stroke={PAPER} strokeWidth="1.6" />
          <path
            d="M-4.5 0.4L-1.2 3.8L5 -3.2"
            fill="none"
            stroke={PAPER}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
      {state === "next" && <NextPin />}
      {state === "full-passport" && <FullPassportRibbon y={98} />}
    </ArtSvg>
  );
}
