/* eslint-disable react-refresh/only-export-components */
// Twelve original passport stamps, drawn as plain SVG. No external assets; system serif only.
// Each stamp: its own silhouette, its own small illustration, two inks at most, and a "cancelled"
// postmark ring once earned. Unearned stamps are a faint dashed outline so the collection reads as a goal.
import { useId } from "react";
import type { ReactNode } from "react";

export const STAMP_SLUGS = [
  "first-adventure",
  "cozy-companion",
  "beach-explorer",
  "trail-blazer",
  "city-explorer",
  "playtime-champion",
  "road-tripper",
  "night-owl",
  "sunshine-seeker",
  "memory-maker",
  "seasonal-explorer",
  "adventure-legend",
] as const;
export type StampSlug = (typeof STAMP_SLUGS)[number];

export const STAMP_LABELS: Record<StampSlug, string> = {
  "first-adventure": "First Adventure",
  "cozy-companion": "Cozy Companion",
  "beach-explorer": "Beach Explorer",
  "trail-blazer": "Trail Blazer",
  "city-explorer": "City Explorer",
  "playtime-champion": "Playtime Champion",
  "road-tripper": "Road Tripper",
  "night-owl": "Night Owl",
  "sunshine-seeker": "Sunshine Seeker",
  "memory-maker": "Memory Maker",
  "seasonal-explorer": "Seasonal Explorer",
  "adventure-legend": "Adventure Legend",
};

const PAPER = "#fbf6ea";
const FAINT = "#9a9486";
const SERIF = 'Georgia, "Times New Roman", serif';

// ------------------------------------------------------------------ outlines (viewBox 0 0 120 120)

function scallop(x0: number, y0: number, x1: number, y1: number, n: number): string {
  const r = (x1 - x0) / n / 2;
  let d = `M${x0} ${y0}`;
  for (let i = 1; i <= n; i++) d += ` A${r} ${r} 0 0 1 ${x0 + 2 * r * i} ${y0}`;
  for (let i = 1; i <= n; i++) d += ` A${r} ${r} 0 0 1 ${x1} ${y0 + 2 * r * i}`;
  for (let i = 1; i <= n; i++) d += ` A${r} ${r} 0 0 1 ${x1 - 2 * r * i} ${y1}`;
  for (let i = 1; i <= n; i++) d += ` A${r} ${r} 0 0 1 ${x0} ${y1 - 2 * r * i}`;
  return d + "Z";
}

function burst(points: number, outer: number, inner: number): string {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? inner : outer;
    d += `${i ? "L" : "M"}${(60 + Math.cos(a) * r).toFixed(2)} ${(60 + Math.sin(a) * r).toFixed(2)}`;
  }
  return d + "Z";
}

const OUTLINES: Record<StampSlug, string> = {
  // postage stamp, scalloped
  "first-adventure": scallop(10, 10, 110, 110, 10),
  // arched doorway
  "cozy-companion": "M18 112V52A42 42 0 0 1 102 52V112Z",
  // wide oval
  "beach-explorer": "M60 18C93 18 112 38 112 60S93 102 60 102 8 82 8 60 27 18 60 18Z",
  // shield
  "trail-blazer": "M60 6L108 20V62C108 88 88 106 60 116 32 106 12 88 12 62V20Z",
  // ticket with notched sides and punched corners
  "city-explorer": "M10 28H110V50A10 10 0 0 0 110 70V92H10V70A10 10 0 0 0 10 50Z",
  // octagon
  "playtime-champion": "M38 8H82L112 38V82L82 112H38L8 82V38Z",
  // road sign diamond with rounded points
  "road-tripper":
    "M60 6Q66 6 70 10L110 50Q114 60 110 70L70 110Q60 114 50 110L10 70Q6 60 10 50L50 10Q54 6 60 6Z",
  // tall pill
  "night-owl": "M60 6C84 6 98 20 98 40V80C98 100 84 114 60 114S22 100 22 80V40C22 20 36 6 60 6Z",
  // sunburst
  "sunshine-seeker": burst(20, 57, 49),
  // cut-corner photo label
  "memory-maker": "M24 10H96L110 24V96L96 110H24L10 96V24Z",
  // lozenge / leaf
  "seasonal-explorer":
    "M60 6C92 22 112 44 112 60 112 80 92 98 60 114 28 98 8 80 8 60 8 44 28 22 60 6Z",
  // crest: pennant top, pointed base
  "adventure-legend": "M10 14H110V70C110 92 84 106 60 116 36 106 10 92 10 70Z",
};

// ------------------------------------------------------------------ illustrations

type Inks = { a: string; b: string };
type Art = (i: Inks) => ReactNode;

const Paw = ({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) => (
  <g fill={fill} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 4C-9 4-13 12-9 17 -5 22 5 22 9 17 13 12 9 4 0 4Z" />
    <ellipse cx="-13" cy="-3" rx="4" ry="5.5" transform="rotate(-20 -13 -3)" />
    <ellipse cx="-5" cy="-11" rx="4" ry="5.5" transform="rotate(-6 -5 -11)" />
    <ellipse cx="5" cy="-11" rx="4" ry="5.5" transform="rotate(6 5 -11)" />
    <ellipse cx="13" cy="-3" rx="4" ry="5.5" transform="rotate(20 13 -3)" />
  </g>
);

const ART: Record<StampSlug, Art> = {
  "first-adventure": ({ a, b }) => (
    <g>
      <Paw x={60} y={52} s={1.5} fill={a} />
      <path
        d="M26 96C40 84 50 98 64 88S86 80 94 90"
        fill="none"
        stroke={b}
        strokeWidth="2.4"
        strokeDasharray="1 5"
        strokeLinecap="round"
      />
      <path d="M92 28l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill={b} />
    </g>
  ),
  "cozy-companion": ({ a, b }) => (
    <g>
      <path d="M32 98C32 86 44 82 60 82S88 86 88 98Z" fill={b} />
      <ellipse cx="58" cy="76" rx="22" ry="12" fill={a} />
      <circle cx="78" cy="68" r="9" fill={a} />
      <path d="M72 62C68 56 74 52 77 58Z" fill={b} />
      <path
        d="M36 74C26 72 24 64 30 62"
        fill="none"
        stroke={a}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M60 50c-6-6-14 1-8 8l8 7 8-7c6-7-2-14-8-8z"
        fill={b}
        transform="translate(0 -6) scale(1)"
      />
    </g>
  ),
  "beach-explorer": ({ a, b }) => (
    <g>
      <path d="M26 66A34 34 0 0 1 94 66Z" fill={b} />
      <path d="M26 66Q60 56 94 66" fill="none" stroke={a} strokeWidth="2" />
      <path d="M60 48V86" stroke={a} strokeWidth="3" strokeLinecap="round" />
      <path
        d="M18 80Q26 74 34 80T50 80 66 80 82 80 102 80"
        fill="none"
        stroke={a}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M20 90Q28 84 36 90T52 90 68 90 84 90 100 90"
        fill="none"
        stroke={a}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.7"
      />
    </g>
  ),
  "trail-blazer": ({ a, b }) => (
    <g>
      <path d="M22 84L48 40L62 62L72 48L98 84Z" fill={a} />
      <path d="M48 40L42 50L48 48L52 52Z" fill={PAPER} />
      <path
        d="M84 84V70M84 56l-8 14h16z"
        stroke={b}
        strokeWidth="3"
        fill={b}
        strokeLinejoin="round"
      />
      <path
        d="M40 100C50 90 46 86 60 84S72 78 80 90"
        fill="none"
        stroke={b}
        strokeWidth="2.4"
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
    </g>
  ),
  "city-explorer": ({ a, b }) => (
    <g>
      <path d="M24 82V54H38V82ZM42 82V38H58V82ZM62 82V50H76V82ZM80 82V60H94V82Z" fill={a} />
      <path d="M46 46h4m4 0h2M46 56h4m4 0h2M46 66h4m4 0h2" stroke={PAPER} strokeWidth="2" />
      <path d="M20 82H100" stroke={b} strokeWidth="3" strokeLinecap="round" />
      <path
        d="M100 82V58M100 58a8 8 0 0 0-8-6"
        fill="none"
        stroke={b}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </g>
  ),
  "playtime-champion": ({ a, b }) => (
    <g>
      <circle cx="48" cy="60" r="19" fill={a} />
      <path d="M32 50Q48 58 64 50M32 70Q48 62 64 70" fill="none" stroke={PAPER} strokeWidth="2" />
      <g transform="rotate(-35 70 70)">
        <path d="M52 66a5 5 0 1 1 3-7h20a5 5 0 1 1 8 5 5 5 0 1 1-8 5H55a5 5 0 1 1-3-3z" fill={b} />
      </g>
      <path d="M86 28l2 5 5 .6-4 3.5 1.2 5-4.2-2.8-4.2 2.8 1.2-5-4-3.5 5-.6z" fill={b} />
    </g>
  ),
  "road-tripper": ({ a, b }) => (
    <g>
      <path d="M26 72L34 56Q36 52 42 52H74Q80 52 84 58L94 72V80H26Z" fill={a} />
      <path d="M40 56H58V68H34ZM62 56H76L86 68H62Z" fill={PAPER} />
      <circle cx="42" cy="80" r="8" fill={b} />
      <circle cx="80" cy="80" r="8" fill={b} />
      <circle cx="42" cy="80" r="3" fill={PAPER} />
      <circle cx="80" cy="80" r="3" fill={PAPER} />
      <path d="M20 96H100" stroke={b} strokeWidth="2.4" strokeDasharray="8 6" />
    </g>
  ),
  "night-owl": ({ a, b }) => (
    <g>
      <path d="M72 34A24 24 0 1 0 84 78A20 20 0 0 1 72 34Z" fill={a} />
      <path d="M40 30l1.6 4 4 1.6-4 1.6L40 41l-1.6-3.8-4-1.6 4-1.6z" fill={b} />
      <path d="M86 52l1.2 3 3 1.2-3 1.2L86 60l-1.2-3.2-3-1.2 3-1.2z" fill={b} />
      <path
        d="M52 96h16V86H52zM55 86V82h10v4M60 82V76"
        fill="none"
        stroke={b}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </g>
  ),
  "sunshine-seeker": ({ a, b }) => (
    <g>
      <circle cx="60" cy="60" r="15" fill={a} />
      <g stroke={b} strokeWidth="3" strokeLinecap="round">
        <path d="M60 32V38M60 82V88M32 60H38M82 60H88M40 40L44 44M76 76L80 80M80 40L76 44M44 76L40 80" />
      </g>
    </g>
  ),
  "memory-maker": ({ a, b }) => (
    <g>
      <rect
        x="31"
        y="30"
        width="58"
        height="66"
        fill="#fffdf7"
        stroke={a}
        strokeWidth="2.4"
        transform="rotate(-4 60 63)"
      />
      <rect
        x="37"
        y="36"
        width="46"
        height="44"
        fill={b}
        opacity="0.35"
        transform="rotate(-4 60 63)"
      />
      <g transform="rotate(-4 60 63)">
        <Paw x={60} y={56} s={0.9} fill={a} />
        <path d="M44 88H76" stroke={a} strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </g>
  ),
  "seasonal-explorer": ({ a, b }) => (
    <g>
      <path d="M42 50C42 36 54 34 58 34C58 46 52 54 42 50Z" fill={a} />
      <g stroke={b} strokeWidth="2.2" strokeLinecap="round">
        <path d="M80 34V54M71 39L89 49M71 49L89 39" />
      </g>
      <g fill={b}>
        <circle cx="46" cy="78" r="4" />
        <circle cx="46" cy="68" r="4" />
        <circle cx="38" cy="73" r="4" />
        <circle cx="54" cy="73" r="4" />
      </g>
      <circle cx="46" cy="73" r="2.6" fill={a} />
      <path
        d="M72 78a10 10 0 0 1 16 0"
        fill="none"
        stroke={a}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  ),
  "adventure-legend": ({ a, b }) => (
    <g>
      <path d="M40 54L46 40L54 50L60 36L66 50L74 40L80 54Z" fill={a} />
      <path d="M40 58H80" stroke={a} strokeWidth="3" strokeLinecap="round" />
      <path d="M60 66l3.4 7 7.6 1-5.6 5.2 1.5 7.6L60 83l-6.9 3.8 1.5-7.6L49 74l7.6-1z" fill={b} />
      <path
        d="M32 70C30 84 40 92 50 96M88 70C90 84 80 92 70 96"
        fill="none"
        stroke={b}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </g>
  ),
};

const INKS: Record<StampSlug, Inks> = {
  "first-adventure": { a: "#b4412f", b: "#2f5d62" },
  "cozy-companion": { a: "#8a4f3a", b: "#c9786a" },
  "beach-explorer": { a: "#2c6e8a", b: "#d19a3a" },
  "trail-blazer": { a: "#2f5f3a", b: "#8a5a2b" },
  "city-explorer": { a: "#2b3a4a", b: "#b4412f" },
  "playtime-champion": { a: "#b4412f", b: "#2b5c8a" },
  "road-tripper": { a: "#2f5d62", b: "#b4412f" },
  "night-owl": { a: "#3d3a7a", b: "#c9962c" },
  "sunshine-seeker": { a: "#c47a14", b: "#b4412f" },
  "memory-maker": { a: "#6a3f7a", b: "#c9786a" },
  "seasonal-explorer": { a: "#8a4b1f", b: "#2c6e8a" },
  "adventure-legend": { a: "#a9822c", b: "#7a2a2a" },
};

// ------------------------------------------------------------------ component

export interface StampProps {
  slug: StampSlug | string;
  earned?: boolean;
  size?: number;
  /** Overrides the default stamp name in the accessible label. */
  label?: string;
}

function isSlug(s: string): s is StampSlug {
  return (STAMP_SLUGS as readonly string[]).includes(s);
}

export function Stamp({ slug, earned = false, size = 120, label }: StampProps) {
  const uid = useId();
  const known = isSlug(slug);
  const key: StampSlug = known ? slug : "first-adventure";
  const name = label ?? (known ? STAMP_LABELS[key] : String(slug));
  const inks = INKS[key];
  const outline = OUTLINES[key];
  const title = `${name} stamp, ${earned ? "earned" : "not yet earned"}`;

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      data-stamp={key}
      data-earned={earned ? "true" : "false"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {earned ? (
        <>
          <path d={outline} fill={PAPER} stroke={inks.a} strokeWidth="2.6" strokeLinejoin="round" />
          <path
            d={outline}
            fill="none"
            stroke={inks.a}
            strokeWidth="0.9"
            transform="translate(60 60) scale(0.86) translate(-60 -60)"
            strokeLinejoin="round"
            opacity="0.7"
          />
          {ART[key](inks)}
          <PostmarkRing id={`${uid}-pm`} ink={inks.b} />
        </>
      ) : (
        <>
          <path
            d={outline}
            fill="none"
            stroke={FAINT}
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinejoin="round"
            opacity="0.7"
          />
          <g opacity="0.2" style={{ filter: "grayscale(1)" }}>
            {ART[key]({ a: FAINT, b: FAINT })}
          </g>
        </>
      )}
    </svg>
  );
}

/** The "cancelled" postmark: a double ring with wavy cancellation bars, tilted, overlapping the corner. */
function PostmarkRing({ id, ink }: { id: string; ink: string }) {
  return (
    <g
      data-postmark="true"
      transform="translate(84 88) rotate(-14)"
      opacity="0.8"
      fill="none"
      stroke={ink}
      id={id}
    >
      <circle r="17" strokeWidth="1.8" />
      <circle r="12.5" strokeWidth="0.9" />
      <text
        y="3"
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fontFamily={SERIF}
        fill={ink}
        stroke="none"
        letterSpacing="0.6"
      >
        VISITED
      </text>
      <path
        d="M-30 -6Q-24 -11 -18 -6T-6 -6M-30 3Q-24 -2 -18 3T-6 3"
        strokeWidth="1.4"
        strokeLinecap="round"
        transform="translate(-4 0)"
      />
    </g>
  );
}

// ------------------------------------------------------------------ grid and preview

export interface StampGridProps {
  /** Slugs that are earned; every other stamp is drawn unearned. */
  earned?: readonly string[];
  slugs?: readonly string[];
  size?: number;
  showLabels?: boolean;
  className?: string;
}

export function StampGrid({
  earned = [],
  slugs = STAMP_SLUGS,
  size = 112,
  showLabels = true,
  className,
}: StampGridProps) {
  const got = new Set(earned);
  return (
    <ul
      className={className}
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`,
        gap: "20px 12px",
        justifyItems: "center",
      }}
    >
      {slugs.map((slug) => (
        <li key={slug} style={{ textAlign: "center", margin: 0 }}>
          <Stamp slug={slug} earned={got.has(slug)} size={size} />
          {showLabels && (
            <span
              aria-hidden="true"
              style={{
                display: "block",
                marginTop: 6,
                fontFamily: SERIF,
                fontSize: 13,
                color: "#4a4437",
              }}
            >
              {isSlug(slug) ? STAMP_LABELS[slug] : slug}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** All 12 stamps, the first `earnedCount` earned. Drop onto a page to show the collection. */
export function StampPreview({
  earnedCount = 7,
  size = 112,
}: {
  earnedCount?: number;
  size?: number;
}) {
  return <StampGrid earned={STAMP_SLUGS.slice(0, earnedCount)} size={size} />;
}
