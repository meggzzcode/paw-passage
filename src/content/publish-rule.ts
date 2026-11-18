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
