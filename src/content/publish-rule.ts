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

/** Only verified stays go live. Samples and unverified records never do. */
export function stayIsPublic(s: { status: string }): boolean {
  return s.status === "verified";
}
