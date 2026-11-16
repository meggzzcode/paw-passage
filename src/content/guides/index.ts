import { guides as contentGuides } from "virtual:content";
import { guideIsPublic } from "../publish-rule";
import { site } from "@/config/site";
import type { Guide } from "../types";

// Guides still written as code files (being moved to /content so they can be edited in Pages CMS).
const modules = import.meta.glob<{ guide: Guide }>("./*.ts", { eager: true });
const legacyGuides: Guide[] = Object.entries(modules)
  .filter(([path]) => !path.endsWith("/index.ts"))
  .map(([, m]) => m.guide)
  .filter(Boolean)
  // Code-file guides were approved before the approval fields existed.
  .map((g) => ({ ...g, approvedBy: g.approvedBy ?? "Paws & Passage Editors", approvedOn: g.approvedOn ?? g.lastReviewed }));

const bySlug = new Map<string, Guide>();
for (const g of [...legacyGuides, ...(contentGuides as Guide[])]) {
  if (bySlug.has(g.slug)) throw new Error(`Two guides share the web address "${g.slug}" (one in code, one in /content). Remove one.`);
  bySlug.set(g.slug, g);
}

export const allGuides: Guide[] = [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title));

export function isPublic(g: Guide) {
  return guideIsPublic(g);
}

export function visibleGuides(includeDrafts: boolean = site.showDraftGuides): Guide[] {
  return allGuides.filter((g) => isPublic(g) || includeDrafts);
}

export function getGuide(slug: string, includeDrafts: boolean = site.showDraftGuides) {
  return visibleGuides(includeDrafts).find((g) => g.slug === slug);
}
