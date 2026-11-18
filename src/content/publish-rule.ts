// The single rule that decides whether content is public. It is shared by the build step (which
// leaves unpublished content OUT of the shipped code) and the page code, so they can never disagree.
// Pure TypeScript with no imports on purpose: the build tool loads it too.

export interface GuideGate {
  status: string;
  approvedBy?: string | undefined;
  approvedOn?: string | undefined;
  research: { researchComplete: boolean; unverified: string[] };
}

/** A guide goes live only when it is Published, fact-checked, has no open questions, and has been approved. */
export function guideIsPublic(g: GuideGate): boolean {
  return (
    g.status === "published" &&
    g.research.researchComplete === true &&
    g.research.unverified.length === 0 &&
    !!g.approvedBy?.trim() &&
    !!g.approvedOn?.trim()
  );
}

/** Verified and unverified stays are listed; unverified ones carry a "Not yet verified" label. Samples never go live. */
export function stayIsPublic(s: { status: string }): boolean {
  return s.status === "verified" || s.status === "unverified";
}

export interface PlaceGate {
  status: string;
  sourceUrl?: string | null | undefined;
  sourceQuote?: string | null | undefined;
  lastChecked?: string | null | undefined;
}

/**
 * A place's dog rules go live only when someone marked it Verified AND it carries the official page's
 * address, the exact quoted sentence and the date the page was read. Anything less stays unpublished.
 */
export function placeIsPublic(p: PlaceGate): boolean {
  return p.status === "verified" && !!p.sourceUrl?.trim() && !!p.sourceQuote?.trim() && !!p.lastChecked?.trim();
}

/** A verified place is flagged "needs recheck" once its last check is more than 12 months old (computed when the page is shown). */
export function placeNeedsRecheck(p: { lastChecked?: string | null | undefined }, now: Date = new Date()): boolean {
  if (!p.lastChecked) return true;
  const checked = new Date(`${p.lastChecked}T00:00:00Z`);
  if (Number.isNaN(checked.getTime())) return true;
  const limit = new Date(Date.UTC(checked.getUTCFullYear() + 1, checked.getUTCMonth(), checked.getUTCDate()));
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return today > limit.getTime();
}

// ---------------------------------------------------------------------------------------------
// INDEXING QUALITY RULE for stay, town and state pages (does NOT need host verification).
// A page is listed on the site whenever it is public, but it is offered to search engines (no noindex tag,
// present in the sitemap) only when it is useful and original enough. Pure functions, no imports.
// The page head and the sitemap both call these, so they can never disagree.
// ---------------------------------------------------------------------------------------------

/** A stay page needs at least this many of the six content sections filled. */
export const MIN_STAY_SECTIONS = 5;
/** A stay description (our own text) needs at least this many characters. */
export const MIN_STAY_DESCRIPTION_CHARS = 250;
/** Two descriptions sharing at least this fraction of their four-word phrases count as duplicates. */
export const DUPLICATE_SIMILARITY = 0.6;
/** A town page is indexable with at least this many indexable stays, or with enough of its own text. */
export const MIN_TOWN_INDEXABLE_STAYS = 1;
/** "Substantive own text" for a town: at least this many planning notes totalling at least this many characters (with the blurb). */
export const MIN_TOWN_NOTES = 3;
export const MIN_TOWN_TEXT_CHARS = 350;
/** A state page is indexable with at least this many indexable towns and an intro of at least this many characters. */
export const MIN_STATE_INDEXABLE_TOWNS = 1;
export const MIN_STATE_INTRO_CHARS = 200;

export interface StayQuality {
  slug?: string;
  status: string;
  summary: string;
  description: string;
  maxDogs: number | null;
  largeDogsOk: boolean | null;
  weightLimitLbs: number | null;
  petFee: unknown | null;
  fencedYard: string | null;
  fenceNotes?: string | undefined;
  sleeps: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  beds: string[];
  amenityGroups: { items: string[] }[];
  locationNote?: string | undefined;
  distances: string[];
  accessNotes: string[];
  guestNotes: string[];
  generalRules: string[];
  houseRules: string[];
  checkIn?: string | undefined;
  checkOut?: string | undefined;
  minimumStay?: string | undefined;
  cancellation?: string | undefined;
}

export interface Indexability {
  indexable: boolean;
  /** Plain-language reasons the page stays noindex (empty when indexable). */
  missing: string[];
  sections: number;
}

const shingles = (t: string) => {
  const w = t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + 4 <= w.length; i++) out.add(w.slice(i, i + 4).join(" "));
  return out;
};

/** Share of four-word phrases two texts have in common (the smaller text as the denominator); shared boilerplate scores low, near copies score high. */
export function textSimilarity(a: string, b: string): number {
  const sa = shingles(a);
  const sb = shingles(b);
  if (!sa.size || !sb.size) return 0;
  let shared = 0;
  for (const x of sa) if (sb.has(x)) shared++;
  return shared / Math.min(sa.size, sb.size);
}

/** Count of the six content sections a stay page can show that actually hold something. */
export function stayFilledSections(s: StayQuality): number {
  const has = (v: string | undefined) => !!v && v.trim().length > 0;
  return [
    (s.sleeps ?? 0) > 0 || s.beds.length > 0, // the space
    s.amenityGroups.some((g) => g.items.length > 0), // what is included
    has(s.locationNote) || s.distances.length > 0, // location
    s.accessNotes.length > 0 || s.guestNotes.length > 0, // good to know
    has(s.checkIn) || has(s.checkOut) || has(s.minimumStay) || has(s.cancellation) || s.generalRules.length > 0, // stay details
    s.houseRules.length > 0 || has(s.fenceNotes), // dog rules in the listing's words
  ].filter(Boolean).length;
}

/**
 * A stay page is indexable only when it is useful and original: a stated dog limit, at least one more pet-policy
 * detail, the basic size facts, a location note, enough filled sections, and a description of our own that is not
 * thin and not a near copy of another stay's. Host verification is NOT required. The function cannot prove that
 * the description was written by us (we hold no copy of the listing text); that is an editorial rule: descriptions
 * are paraphrased, never pasted. It can and does reject thin, template-like and duplicated text.
 */
export function stayIndexability(s: StayQuality, others: StayQuality[] = []): Indexability {
  const missing: string[] = [];
  const sections = stayFilledSections(s);
  if (!(s.status === "verified" || s.status === "unverified")) missing.push("not a public stay record (samples are never indexed)");
  if (s.maxDogs === null) missing.push("dog limit not stated");
  if (s.weightLimitLbs === null && s.petFee === null && s.fencedYard === null && s.largeDogsOk === null) missing.push("no weight limit, pet fee or fence information");
  const size: string[] = [];
  if (!s.sleeps) size.push("sleeps");
  if (!s.bedrooms) size.push("bedrooms");
  if (!s.bathrooms) size.push("bathrooms");
  if (size.length) missing.push(`missing ${size.join(", ")}`);
  if (!s.locationNote?.trim()) missing.push("no location note");
  if (sections < MIN_STAY_SECTIONS) missing.push(`only ${sections} of 6 sections filled (need ${MIN_STAY_SECTIONS})`);
  const d = s.description.trim();
  if (d.length < MIN_STAY_DESCRIPTION_CHARS) missing.push(`description too short (${d.length} of ${MIN_STAY_DESCRIPTION_CHARS} characters)`);
  else if (textSimilarity(d, s.summary) >= DUPLICATE_SIMILARITY && d.length < 2 * s.summary.length) missing.push("description repeats the summary");
  const twin = others.find((o) => o !== s && o.slug !== s.slug && textSimilarity(d, o.description) >= DUPLICATE_SIMILARITY);
  if (twin) missing.push(`description duplicates another stay (${twin.slug ?? "unknown"})`);
  return { indexable: missing.length === 0, missing, sections };
}

export interface TownQuality {
  blurb: string;
  planningNotes: string[];
}

/** A town page: enough indexable stays, or substantive own text (several planning notes of real length). */
export function townIndexability(t: TownQuality, indexableStayCount: number): Indexability {
  const missing: string[] = [];
  const chars = t.blurb.length + t.planningNotes.reduce((n, x) => n + x.length, 0);
  const ownText = t.planningNotes.length >= MIN_TOWN_NOTES && chars >= MIN_TOWN_TEXT_CHARS;
  if (indexableStayCount < MIN_TOWN_INDEXABLE_STAYS && !ownText) {
    missing.push(`no indexable stay and own text too thin (${t.planningNotes.length} planning notes, ${chars} characters; need ${MIN_TOWN_NOTES} notes and ${MIN_TOWN_TEXT_CHARS} characters)`);
  }
  return { indexable: missing.length === 0, missing, sections: indexableStayCount };
}

/** A state page: a real intro and at least one indexable town beneath it. */
export function stateIndexability(s: { intro: string }, indexableTownCount: number): Indexability {
  const missing: string[] = [];
  if (s.intro.trim().length < MIN_STATE_INTRO_CHARS) missing.push("intro too short");
  if (indexableTownCount < MIN_STATE_INDEXABLE_TOWNS) missing.push("no indexable town page beneath it");
  return { indexable: missing.length === 0, missing, sections: indexableTownCount };
}
