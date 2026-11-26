// Theme configuration for the ten keepsake families. A family is a layout; a theme gives it a palette,
// type, a motif drawn with canvas paths, and its own small labels, so a Toy Champion magazine cover, a
// Secret Agent ID card and a bake-off poster each look like their own thing, not one frame with new words.
// Only system serif/sans font stacks are used: nothing is downloaded.
// The family list mirrors KEEPSAKE_FAMILIES in schema.ts (a test keeps them equal) so this file pulls no zod into the page.
export const KEEPSAKE_FAMILY_LIST = [
  "travel-postcard",
  "magazine-cover",
  "id-card",
  "trading-card",
  "certificate",
  "seasonal-frame",
  "event-ticket",
  "then-and-now",
  "collage",
  "poster",
] as const;
export type KeepsakeFamily = (typeof KEEPSAKE_FAMILY_LIST)[number];

export const FONTS = {
  serif: 'Georgia, "Times New Roman", Times, serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  condensed: '"Arial Narrow", "Helvetica Neue", Helvetica, Arial, sans-serif',
  heavy: '"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;
export type FontKey = keyof typeof FONTS;

export const MOTIFS = [
  "paw",
  "star",
  "bone",
  "ball",
  "tent",
  "pine",
  "leaf",
  "sun",
  "compass",
  "magnifier",
  "cupcake",
  "fossil",
  "acacia",
  "bunting",
  "snowflake",
  "wave",
  "fingerprint",
  "icecream",
  "whisk",
  "constellation",
  "pin",
  "anchor",
  "wheel",
  "reel",
  "brush",
  "cloche",
  "key",
  "mountain",
  "fern",
  "lantern",
  "heart",
  "house",
  "wheat",
  "apple",
  "pumpkin",
  "parasol",
  "envelope",
  "suitcase",
  "soundwave",
  "medal",
  "laurel",
  "camera",
  "tag",
  "mortarboard",
  "book",
  "tree",
  "spray",
  "bench",
  "question",
  "globe",
  "ring",
  "reeds",
  "shell",
  "signpost",
  "flame",
  "daisy",
  "pawtrail",
  "bridge",
  "cup",
  "moon",
  "bubbles",
  "mask",
  "door",
] as const;
export type MotifId = (typeof MOTIFS)[number];

export interface Palette {
  /** Main background. */
  bg: string;
  /** Second background tone (stripes, panels, gradients). */
  bg2: string;
  /** Main text. */
  ink: string;
  /** Strong accent (headline colour, seals, rules). */
  accent: string;
  /** Secondary accent. */
  accent2: string;
  /** Quiet text on bg. */
  muted: string;
  /** Text drawn on top of accent. */
  onAccent: string;
  /** Surface for cards, labels and photo mats. */
  card: string;
}

export interface ThemeConfig {
  id: string;
  family: KeepsakeFamily;
  label: string;
  palette: Palette;
  /** Headline face. */
  display: FontKey;
  /** Supporting face. */
  body: FontKey;
  /** Headline casing. */
  upper: boolean;
  motif: MotifId;
  motif2: MotifId;
  /** Decorative frame style used by the family where it has one. */
  frame:
    | "double"
    | "ticks"
    | "scallop"
    | "bold"
    | "none"
    | "stripes"
    | "filmstrip"
    | "rope"
    | "marquee"
    | "lace"
    | "stitch";
  /** Optional layout option inside a family (for example a passport-style ID card or a swatch collage). */
  variant?: string | undefined;
  /** Backdrop pattern for families that draw one behind the artwork. */
  pattern?: "rays" | "stripes" | "dots" | "plain" | undefined;
  /** Small printed labels (kicker, field names, section words). Looked up by key in each family. */
  words: Readonly<Record<string, string>>;
}

import { EXTRA_THEMES } from "./themes-extra";
import { MORE_THEMES } from "./themes-more";

const P = (
  bg: string,
  bg2: string,
  ink: string,
  accent: string,
  accent2: string,
  muted: string,
  onAccent: string,
  card: string,
): Palette => ({ bg, bg2, ink, accent, accent2, muted, onAccent, card });

const T = (c: ThemeConfig): ThemeConfig => c;

const BASE_THEMES: ThemeConfig[] = [
  // ------------------------------------------------------------ travel-postcard
  T({
    id: "picnic-postcard",
    family: "travel-postcard",
    label: "Picnic postcard",
    palette: P(
      "#f6efe0",
      "#e9ddc0",
      "#2b3a4a",
      "#b4412f",
      "#a9822c",
      "#5f594d",
      "#fffaf0",
      "#fffdf7",
    ),
    display: "serif",
    body: "serif",
    upper: false,
    motif: "bone",
    motif2: "paw",
    frame: "double",
    words: { kicker: "PICNIC POSTCARD", stamp: "PICNIC", mark: "OUT FOR LUNCH" },
  }),
  T({
    id: "hometown-postcard",
    family: "travel-postcard",
    label: "Hometown postcard",
    palette: P(
      "#f1e9dc",
      "#d9e3e0",
      "#1f3b46",
      "#2f6f73",
      "#c1623f",
      "#4f5d62",
      "#fbf7ef",
      "#fffdf8",
    ),
    display: "serif",
    body: "sans",
    upper: false,
    motif: "pine",
    motif2: "paw",
    frame: "ticks",
    words: { kicker: "GREETINGS FROM HOME", stamp: "HOME", mark: "HOMETOWN" },
  }),
  T({
    id: "day-trip",
    family: "travel-postcard",
    label: "Day trip",
    palette: P(
      "#f5ecd7",
      "#cfe0e6",
      "#233a52",
      "#c9552e",
      "#2d7a8c",
      "#566676",
      "#fffaf0",
      "#fffdf6",
    ),
    display: "serif",
    body: "serif",
    upper: false,
    motif: "compass",
    motif2: "sun",
    frame: "scallop",
    words: { kicker: "DAY TRIP POSTCARD", stamp: "DAY TRIP", mark: "ON THE ROAD" },
  }),
  T({
    id: "beach-postcard",
    family: "travel-postcard",
    label: "Beach postcard",
    palette: P(
      "#fbf1dc",
      "#bfe0e4",
      "#17414f",
      "#d65a30",
      "#1f8aa0",
      "#4d6670",
      "#fffaf0",
      "#fffdf6",
    ),
    display: "serif",
    body: "sans",
    upper: false,
    motif: "wave",
    motif2: "sun",
    frame: "double",
    words: { kicker: "GREETINGS FROM THE SHORE", stamp: "SEASIDE", mark: "BY THE SEA" },
  }),
  // ------------------------------------------------------------ magazine-cover
  T({
    id: "toy-champion",
    family: "magazine-cover",
    label: "Toy Champion cover",
    palette: P(
      "#c8301f",
      "#ffd24a",
      "#101820",
      "#ffd24a",
      "#ffffff",
      "#f6e6c8",
      "#101820",
      "#ffffff",
    ),
    display: "heavy",
    body: "condensed",
    upper: true,
    motif: "ball",
    motif2: "star",
    frame: "bold",
    words: {
      masthead: "CHAMPION",
      tagline: "THE TOY ISSUE",
      star: "COVER STAR",
      line1: "Play like a champion",
    },
  }),
  T({
    id: "editorial-cover",
    family: "magazine-cover",
    label: "Editorial cover",
    palette: P(
      "#16232f",
      "#e9e1d0",
      "#f6f1e6",
      "#e8d9b0",
      "#c0553a",
      "#cfc7b5",
      "#16232f",
      "#f6f1e6",
    ),
    display: "serif",
    body: "sans",
    upper: false,
    motif: "compass",
    motif2: "paw",
    frame: "none",
    words: {
      masthead: "THE ADVENTURER",
      tagline: "A LIFETIME OF LITTLE ADVENTURES",
      star: "ON THE COVER",
      line1: "The Adventure Issue",
    },
  }),
  T({
    id: "birthday-cover",
    family: "magazine-cover",
    label: "Birthday cover",
    palette: P(
      "#2c6f8f",
      "#f7b6c0",
      "#12303f",
      "#ffcf4a",
      "#f27a8c",
      "#e6f2f6",
      "#12303f",
      "#ffffff",
    ),
    display: "heavy",
    body: "sans",
    upper: true,
    motif: "bunting",
    motif2: "star",
    frame: "bold",
    words: {
      masthead: "PARTY",
      tagline: "THE BIRTHDAY ISSUE",
      star: "BIRTHDAY STAR",
      line1: "One more happy year",
    },
  }),
  // ------------------------------------------------------------ id-card
  T({
    id: "secret-agent",
    family: "id-card",
    label: "Secret Agent ID",
    palette: P(
      "#10161d",
      "#1d2733",
      "#e9eef2",
      "#35e0a1",
      "#f1c14a",
      "#8da0b0",
      "#06150f",
      "#e8edf1",
    ),
    display: "condensed",
    body: "sans",
    upper: true,
    motif: "fingerprint",
    motif2: "magnifier",
    frame: "ticks",
    words: {
      org: "PAW & PASSAGE FIELD AGENCY",
      title: "OFFICIAL ID",
      name: "AGENT",
      code: "CODENAME",
      rank: "CLEARANCE",
      date: "ISSUED",
      note: "FIELD NOTE",
    },
  }),
  T({
    id: "explorer-id",
    family: "id-card",
    label: "Explorer ID",
    palette: P(
      "#e8dfc7",
      "#cdbf9b",
      "#2d3b2b",
      "#2f5d4e",
      "#b4412f",
      "#5c604e",
      "#f6efe0",
      "#fbf6e8",
    ),
    display: "serif",
    body: "serif",
    upper: true,
    motif: "compass",
    motif2: "paw",
    frame: "double",
    words: {
      org: "ADVENTURE PASSPORT SOCIETY",
      title: "MEMBER CARD",
      name: "MEMBER",
      code: "TITLE",
      rank: "RANK",
      date: "JOINED",
      note: "NOTES",
    },
  }),
  // ------------------------------------------------------------ trading-card
  T({
    id: "explorer-card",
    family: "trading-card",
    label: "Explorer card",
    palette: P(
      "#d9a93a",
      "#f3dc8c",
      "#2a2418",
      "#2f5d4e",
      "#b4412f",
      "#6a5a30",
      "#f8f1dc",
      "#fbf5e2",
    ),
    display: "serif",
    body: "serif",
    upper: false,
    motif: "compass",
    motif2: "leaf",
    frame: "bold",
    words: { series: "ADVENTURE CARDS", type: "EXPLORER", flavor: "Field notes" },
  }),
  T({
    id: "star-card",
    family: "trading-card",
    label: "Star card",
    palette: P(
      "#3b3f8f",
      "#8f86e0",
      "#161a3d",
      "#ffd24a",
      "#ff7a59",
      "#5c5fa8",
      "#161a3d",
      "#f4f2ff",
    ),
    display: "condensed",
    body: "sans",
    upper: true,
    motif: "star",
    motif2: "ball",
    frame: "bold",
    words: { series: "ADVENTURE CARDS", type: "ALL-STAR", flavor: "Highlight" },
  }),
  // ------------------------------------------------------------ certificate
  T({
    id: "toy-champion-certificate",
    family: "certificate",
    label: "Toy Champion certificate",
    palette: P(
      "#f7eed9",
      "#ecdcb5",
      "#2b2a35",
      "#b4302a",
      "#b08a2c",
      "#6b6355",
      "#fff8e8",
      "#fffbef",
    ),
    display: "serif",
    body: "serif",
    upper: true,
    motif: "ball",
    motif2: "star",
    frame: "double",
    words: {
      top: "CERTIFICATE OF",
      title: "TOY CHAMPION",
      intro: "This certifies that",
      verb: "has earned the title of",
      foot: "A champion at play, on the Adventure Passport.",
    },
  }),
  T({
    id: "explorer",
    family: "certificate",
    label: "Explorer certificate",
    palette: P(
      "#eee8d2",
      "#d5ddc0",
      "#25382f",
      "#2f5d4e",
      "#a9822c",
      "#5a6358",
      "#f6f1de",
      "#f8f4e3",
    ),
    display: "serif",
    body: "serif",
    upper: true,
    motif: "compass",
    motif2: "leaf",
    frame: "ticks",
    words: {
      top: "CERTIFICATE OF",
      title: "EXPLORATION",
      intro: "This certifies that",
      verb: "has officially completed",
      foot: "An official explorer of the Adventure Passport.",
    },
  }),
  // ------------------------------------------------------------ seasonal-frame
  T({
    id: "sunrise",
    family: "seasonal-frame",
    label: "Sunrise frame",
    palette: P(
      "#fbe3b4",
      "#f6a56b",
      "#43261c",
      "#d9582b",
      "#f2b84b",
      "#7a4a35",
      "#fff6e6",
      "#fff4dc",
    ),
    display: "serif",
    body: "sans",
    upper: false,
    motif: "sun",
    motif2: "paw",
    frame: "scallop",
    words: { kicker: "EARLY MORNING" },
  }),
  T({
    id: "autumn",
    family: "seasonal-frame",
    label: "Autumn frame",
    palette: P(
      "#7a3b1d",
      "#c9772e",
      "#fff1d8",
      "#e9a23b",
      "#b4412f",
      "#f0d6ae",
      "#3a1c0b",
      "#fff4df",
    ),
    display: "serif",
    body: "serif",
    upper: false,
    motif: "leaf",
    motif2: "paw",
    frame: "scallop",
    words: { kicker: "AUTUMN WALK" },
  }),
  T({
    id: "winter",
    family: "seasonal-frame",
    label: "Winter frame",
    palette: P(
      "#1d3a5a",
      "#8fb7d9",
      "#f2f8ff",
      "#ffffff",
      "#9fd0f2",
      "#cfe3f4",
      "#1d3a5a",
      "#f3f9ff",
    ),
    display: "serif",
    body: "sans",
    upper: false,
    motif: "snowflake",
    motif2: "paw",
    frame: "scallop",
    words: { kicker: "WINTER DAY" },
  }),
  T({
    id: "spring",
    family: "seasonal-frame",
    label: "Spring frame",
    palette: P(
      "#d9efc9",
      "#f6c6d0",
      "#27432b",
      "#3f8f4f",
      "#ee7f9a",
      "#4f6c52",
      "#f7fff0",
      "#fbfff4",
    ),
    display: "serif",
    body: "sans",
    upper: false,
    motif: "leaf",
    motif2: "sun",
    frame: "scallop",
    words: { kicker: "SPRING DAY" },
  }),
  // ------------------------------------------------------------ event-ticket
  T({
    id: "campout-ticket",
    family: "event-ticket",
    label: "Campout ticket",
    palette: P(
      "#1f3a34",
      "#2f5d4e",
      "#fff3d6",
      "#f2a33a",
      "#d85c2c",
      "#bcd3c6",
      "#2a1a08",
      "#f7ecd0",
    ),
    display: "heavy",
    body: "condensed",
    upper: true,
    motif: "tent",
    motif2: "pine",
    frame: "ticks",
    words: { admit: "ADMIT ONE DOG", event: "BACKYARD CAMPOUT", gate: "SITE", date: "NIGHT OF" },
  }),
  T({
    id: "safari-pass",
    family: "event-ticket",
    label: "Safari pass",
    palette: P(
      "#c98d3b",
      "#f2d596",
      "#3a2410",
      "#8a2f1c",
      "#2f5d4e",
      "#6c4a22",
      "#fff3d8",
      "#fbefd2",
    ),
    display: "heavy",
    body: "condensed",
    upper: true,
    motif: "acacia",
    motif2: "paw",
    frame: "bold",
    words: { admit: "ALL-ACCESS PASS", event: "HOME SAFARI", gate: "TRACK", date: "DAY OF" },
  }),
  // ------------------------------------------------------------ then-and-now
  T({
    id: "then-and-now",
    family: "then-and-now",
    label: "Then and now",
    palette: P(
      "#f3ece0",
      "#dcd2bd",
      "#2a3441",
      "#b4412f",
      "#2f5d62",
      "#5d6470",
      "#fffaf0",
      "#fffdf8",
    ),
    display: "serif",
    body: "sans",
    upper: false,
    motif: "paw",
    motif2: "star",
    frame: "double",
    words: { then: "THEN", now: "NOW", kicker: "THEN & NOW" },
  }),
  // ------------------------------------------------------------ collage
  T({
    id: "favorite-moments",
    family: "collage",
    label: "Favorite moments",
    palette: P(
      "#efe4cf",
      "#d8e4d6",
      "#2c3640",
      "#b4412f",
      "#2f6f73",
      "#5f6670",
      "#fffaf0",
      "#fffdf8",
    ),
    display: "serif",
    body: "sans",
    upper: false,
    motif: "paw",
    motif2: "star",
    frame: "none",
    words: { kicker: "FAVORITE MOMENTS" },
  }),
  // ------------------------------------------------------------ poster
  T({
    id: "bake-off",
    family: "poster",
    label: "Bake-off poster",
    palette: P(
      "#fbe7ea",
      "#f6b4c2",
      "#4a1f33",
      "#d2406a",
      "#f2b84b",
      "#8a4a62",
      "#fff6f0",
      "#fffafb",
    ),
    display: "heavy",
    body: "sans",
    upper: true,
    motif: "cupcake",
    motif2: "star",
    frame: "bold",
    words: {
      kicker: "THE GREAT HOME BAKE-OFF",
      field1: "BAKER",
      field2: "BAKED ON",
      seal: "BEST IN SHOW",
    },
  }),
  T({
    id: "archaeology-report",
    family: "poster",
    label: "Archaeology report",
    palette: P(
      "#e7dcc1",
      "#c9b88f",
      "#3a2f1d",
      "#8a4a1c",
      "#2f5d4e",
      "#6b5a3a",
      "#f6ecd2",
      "#f3ead2",
    ),
    display: "condensed",
    body: "serif",
    upper: true,
    motif: "fossil",
    motif2: "magnifier",
    frame: "ticks",
    words: {
      kicker: "FIELD REPORT",
      field1: "LEAD DIGGER",
      field2: "LOGGED ON",
      seal: "SPECIMEN FOUND",
    },
  }),
];

export const THEMES: Readonly<Record<string, ThemeConfig>> = Object.fromEntries(
  [...BASE_THEMES, ...EXTRA_THEMES, ...MORE_THEMES].map((t) => [t.id, t]),
);

/** Which themes each family offers. The first one is the family's default. */
export const THEME_REGISTRY: Record<KeepsakeFamily, string[]> = Object.fromEntries(
  KEEPSAKE_FAMILY_LIST.map((f) => [
    f,
    Object.values(THEMES)
      .filter((t) => t.family === f)
      .map((t) => t.id),
  ]),
) as Record<KeepsakeFamily, string[]>;

/** The theme config for a family. An unknown theme name falls back to the family's first theme. */
export function themeFor(family: KeepsakeFamily, theme: string): ThemeConfig {
  const hit = THEMES[theme];
  if (hit && hit.family === family) return hit;
  const first = THEME_REGISTRY[family][0];
  const fallback = first ? THEMES[first] : undefined;
  if (!fallback) throw new Error(`No theme for family ${family}`);
  return fallback;
}

/** How many photos a family can use: [minimum useful, maximum]. */
export const PHOTO_COUNT: Record<KeepsakeFamily, { min: number; max: number }> = {
  "travel-postcard": { min: 1, max: 1 },
  "magazine-cover": { min: 1, max: 1 },
  "id-card": { min: 1, max: 1 },
  "trading-card": { min: 1, max: 1 },
  certificate: { min: 1, max: 1 },
  "seasonal-frame": { min: 1, max: 1 },
  "event-ticket": { min: 1, max: 1 },
  "then-and-now": { min: 2, max: 2 },
  collage: { min: 1, max: 4 },
  poster: { min: 1, max: 1 },
};
