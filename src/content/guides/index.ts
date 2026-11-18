import { guidesMeta } from "virtual:guides-meta";
import { guideLoaders } from "virtual:guide-loaders";
import { guideIsPublic } from "../publish-rule";
import { site } from "@/config/site";
import type { Guide } from "../types";

// Guides are loaded in two sizes so list pages stay small:
//  * `allGuides`, `visibleGuides`, `getGuide`: summaries. In a production build the text (body), faqs, sources and
//    research notes are EMPTY here; use these for cards, lists, links, gear picks and the public/draft rule.
//  * `loadGuide(slug)`: the full guide, loaded on demand (only the guide page needs it). In development and tests the
//    summaries already contain everything, so both give the same data.

// Guides still written as code files (being moved to /content so they can be edited in Pages CMS). Loaded lazily.
const legacyLoaders = import.meta.glob<Guide>(["./*.ts", "!./index.ts"], { import: "guide" });

// Code-file guides were approved before the approval fields existed.
const withApproval = (g: Guide): Guide => ({ ...g, approvedBy: g.approvedBy ?? "Paws & Passage Editors", approvedOn: g.approvedOn ?? g.lastReviewed });

const bySlug = new Map<string, Guide>();
for (const g of guidesMeta) {
  if (bySlug.has(g.slug)) throw new Error(`Two guides share the web address "${g.slug}" (one in code, one in /content). Remove one.`);
  bySlug.set(g.slug, withApproval(g));
}

export const allGuides: Guide[] = [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title));

export function isPublic(g: Guide) {
  return guideIsPublic(g);
}

export function visibleGuides(includeDrafts: boolean = site.showDraftGuides): Guide[] {
  return allGuides.filter((g) => isPublic(g) || includeDrafts);
}

/** Summary of one guide (see the note at the top: no text in production builds). */
export function getGuide(slug: string, includeDrafts: boolean = site.showDraftGuides) {
  return visibleGuides(includeDrafts).find((g) => g.slug === slug);
}

/** The full guide (text, questions, sources), or undefined when it does not exist or is not public. */
export async function loadGuide(slug: string, includeDrafts: boolean = site.showDraftGuides): Promise<Guide | undefined> {
  const summary = getGuide(slug, includeDrafts);
  if (!summary) return undefined;
  if (summary.body) return summary; // development and tests: already complete
  const legacy = legacyLoaders[`./${slug}.ts`];
  if (legacy) return withApproval(await legacy());
  const load = guideLoaders[slug];
  return load ? load() : undefined;
}
