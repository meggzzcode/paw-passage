import { site } from "@/config/site";
import type { Guide } from "../types";

const modules = import.meta.glob<{ guide: Guide }>("./*.ts", { eager: true });

export const allGuides: Guide[] = Object.entries(modules)
  .filter(([path]) => !path.endsWith("/index.ts"))
  .map(([, m]) => m.guide)
  .filter(Boolean)
  .sort((a, b) => a.title.localeCompare(b.title));

export function isPublic(g: Guide) {
  return g.status === "published" && g.research.researchComplete === true && g.research.unverified.length === 0;
}

export function visibleGuides(includeDrafts: boolean = site.showDraftGuides): Guide[] {
  return allGuides.filter((g) => isPublic(g) || includeDrafts);
}

export function getGuide(slug: string, includeDrafts: boolean = site.showDraftGuides) {
  return visibleGuides(includeDrafts).find((g) => g.slug === slug);
}
