// Hand-made diagrams for the install guide. They are ILLUSTRATIONS, not screenshots of any real browser, and every
// figure says so. Colors come from the site's design tokens so they follow light and dark themes.
import type { ReactNode } from "react";

export const ILLUSTRATION_NOTE = "Illustration, your screen may look different.";

function Figure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="ins-fig">
      <svg viewBox="0 0 220 150" role="img" aria-label={label}>
        {children}
      </svg>
      <figcaption>{ILLUSTRATION_NOTE}</figcaption>
    </figure>
  );
}

const ink = "var(--pp-ink)";
const red = "var(--pp-red)";
const paper = "var(--pp-paper-2)";

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g stroke={red} strokeWidth="2.5" fill={red} strokeLinecap="round">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <circle cx={x2} cy={y2} r="4" />
    </g>
  );
}

function ShareGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={ink}
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M-5 -1v8h10v-8" />
      <path d="M0 5v-12M-3.5 -3.5L0 -7l3.5 3.5" />
    </g>
  );
}

export function IosShareFigure() {
  return (
    <Figure label="Illustration of an iPhone browser. An arrow points at the Share button in the bottom toolbar.">
      <rect
        x="70"
        y="6"
        width="80"
        height="138"
        rx="12"
        fill={paper}
        stroke={ink}
        strokeWidth="2"
      />
      <rect
        x="78"
        y="16"
        width="64"
        height="12"
        rx="6"
        fill="none"
        stroke={ink}
        strokeWidth="1.2"
      />
      <text x="110" y="25" fontSize="7" textAnchor="middle" fill={ink}>
        pawsandpassage
      </text>
      <line x1="70" y1="120" x2="150" y2="120" stroke={ink} strokeWidth="1" />
      <ShareGlyph x={110} y={133} />
      <circle cx="110" cy="132" r="11" fill="none" stroke={red} strokeWidth="2" />
      <Arrow x1={20} y1={96} x2={96} y2={128} />
      <text x="8" y="88" fontSize="10" fill={ink} fontWeight="700">
        1. Tap Share
      </text>
    </Figure>
  );
}

export function IosAddFigure() {
  return (
    <Figure label="Illustration of the share sheet list. An arrow points at the Add to Home Screen row.">
      <rect
        x="30"
        y="10"
        width="160"
        height="130"
        rx="12"
        fill={paper}
        stroke={ink}
        strokeWidth="2"
      />
      {["Copy", "Add to Bookmarks", "Add to Home Screen", "Find on Page"].map((t, i) => (
        <g key={t}>
          <line
            x1="30"
            y1={42 + i * 26}
            x2="190"
            y2={42 + i * 26}
            stroke={ink}
            strokeOpacity="0.25"
          />
          <text x="44" y={30 + i * 26} fontSize="10" fill={ink} fontWeight={i === 2 ? 700 : 400}>
            {t}
          </text>
        </g>
      ))}
      <rect x="34" y="64" width="152" height="22" rx="5" fill="none" stroke={red} strokeWidth="2" />
      <Arrow x1={150} y1={118} x2={150} y2={90} />
      <text x="36" y="136" fontSize="10" fill={ink} fontWeight="700">
        2. Add to Home Screen
      </text>
    </Figure>
  );
}

export function AndroidMenuFigure() {
  return (
    <Figure label="Illustration of an Android browser. An arrow points at the three-dot menu, which lists Install app or Add to Home screen.">
      <rect
        x="70"
        y="6"
        width="80"
        height="138"
        rx="12"
        fill={paper}
        stroke={ink}
        strokeWidth="2"
      />
      <rect
        x="76"
        y="14"
        width="50"
        height="12"
        rx="6"
        fill="none"
        stroke={ink}
        strokeWidth="1.2"
      />
      <g fill={ink}>
        <circle cx="140" cy="20" r="1.6" />
        <circle cx="140" cy="25" r="1.6" />
        <circle cx="140" cy="30" r="1.6" />
      </g>
      <rect
        x="150"
        y="34"
        width="62"
        height="38"
        rx="5"
        fill={paper}
        stroke={ink}
        strokeWidth="1.5"
      />
      <text x="134" y="48" fontSize="7" fill={ink} fontWeight="700">
        Install app
      </text>
      <text x="134" y="62" fontSize="7" fill={ink}>
        Add to Home screen
      </text>
      <Arrow x1={30} y1={50} x2={136} y2={27} />
      <text x="6" y="44" fontSize="10" fill={ink} fontWeight="700">
        Menu
      </text>
    </Figure>
  );
}

export function DesktopFigure() {
  return (
    <Figure label="Illustration of a desktop browser address bar. An arrow points at the install icon at the right end of the bar.">
      <rect
        x="10"
        y="30"
        width="200"
        height="90"
        rx="8"
        fill={paper}
        stroke={ink}
        strokeWidth="2"
      />
      <line x1="10" y1="56" x2="210" y2="56" stroke={ink} strokeWidth="1.2" />
      <rect
        x="22"
        y="38"
        width="150"
        height="12"
        rx="6"
        fill="none"
        stroke={ink}
        strokeWidth="1.2"
      />
      <rect x="178" y="37" width="14" height="14" rx="3" fill="none" stroke={red} strokeWidth="2" />
      <path
        d="M185 41v6M182.5 45l2.5 2.5 2.5-2.5"
        fill="none"
        stroke={ink}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <Arrow x1={130} y1={100} x2={182} y2={54} />
      <text x="22" y="108" fontSize="10" fill={ink} fontWeight="700">
        Install icon
      </text>
    </Figure>
  );
}
