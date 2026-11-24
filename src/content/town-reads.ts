// "Things to do with a dog" companion articles, one per destination town. They live under the town, at
// /destinations/<state>/<town>/things-to-do, and are NOT guides: they stay out of /guides, the guide count and the guide cards.
// They reuse the guide gate (publish-rule.ts), the guide Markdown renderer and the guide Sources list.
import { guideIsPublic } from "./publish-rule";
import type { Source } from "./types";
import type { ImageKey } from "@/lib/images";
import { georgiaReads } from "./town-reads/georgia";
import { californiaReads } from "./town-reads/california";

export interface TownRead {
  state: "georgia" | "california";
  town: string;
  title: string; // on-page H1, the reader's question
  seoTitle: string; // <= 60 characters
  seoDescription: string; // 120 to 160 characters
  dek: string;
  status: "published" | "draft";
  approvedBy: string;
  approvedOn: string;
  author: string;
  publishedOn: string;
  lastReviewed: string;
  body: string; // Markdown; may use {{pick:product-id|label|why|url}}
  sources: Source[];
  relatedGuides: string[];
  research: { unverified: string[]; researchComplete: boolean };
}

export const allTownReads: TownRead[] = [...georgiaReads, ...californiaReads];

export const townReadIsPublic = (r: TownRead) =>
  guideIsPublic({
    status: r.status,
    approvedBy: r.approvedBy,
    approvedOn: r.approvedOn,
    research: r.research,
  });

export function getTownRead(stateSlug: string, townSlug: string): TownRead | undefined {
  return allTownReads.find((r) => r.state === stateSlug && r.town === townSlug);
}

/** The public companion article for a town, or undefined while it is a draft. */
export function getPublicTownRead(stateSlug: string, townSlug: string): TownRead | undefined {
  const r = getTownRead(stateSlug, townSlug);
  return r && townReadIsPublic(r) ? r : undefined;
}

export const townReadPath = (stateSlug: string, townSlug: string) =>
  `/destinations/${stateSlug}/${townSlug}/things-to-do`;

/** Word count of the body with links reduced to their text and pick lines removed. */
export function townReadWordCount(body: string): number {
  return body
    .replace(/\{\{pick:[^}]*\}\}/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*>_`-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Hero photo key for a town article (src/assets/things-<town>.jpg, credited in image-credits.ts). */
export const townReadImageKey = (townSlug: string) => `things-${townSlug}` as ImageKey;

/** 1200x630 share image for a town article (made by scripts/make-town-share-images.py). */
export const townReadShareImage = (stateSlug: string, townSlug: string) =>
  `/share-towns/${stateSlug}-${townSlug}.jpg`;
