// Content model for the Paw & Passage guides. Plain files, no backend.

import type { GearPick } from "./gear";

export type GuideStatus = "published" | "draft";

export interface CompetitorReview {
  url: string;
  title: string;
  checkedOn: string; // YYYY-MM-DD
  coversWell: string;
  gaps: string;
}

export interface Source {
  title: string;
  url: string;
  publisher: string;
  accessedOn: string; // YYYY-MM-DD
}

export interface ResearchBrief {
  primaryKeyword: string;
  relatedKeywords: string[];
  readerQuestions: string[];
  intendedReader: string;
  competitors: CompetitorReview[];
  gapsFound: string[];
  differentiators: string[]; // at least 3
  angle: string;
  /** Process notes for a future editor (e.g. competitor pages only seen as excerpts). Not factual claims. */
  followUps?: string[];
  /** Factual claims in the article that still need independent verification. Non-empty => keep as draft. */
  unverified: string[];
  researchComplete: boolean;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  title: string; // on-page H1
  seoTitle: string; // <= 60 chars
  seoDescription: string; // <= 160 chars
  dek: string; // one-line standfirst under the title
  category: "Planning" | "Checklist" | "Gear";
  status: GuideStatus;
  author: string;
  publishedOn: string; // YYYY-MM-DD
  lastReviewed: string; // YYYY-MM-DD
  readingMinutes: number;
  /** Name of a built-in photo (see src/lib/images.ts). Leave empty when heroUpload is used. */
  layout?: "standard" | "emergency";
  heroImage?: string;
  /** Path of an uploaded photo, e.g. /uploads/my-photo.jpg. Takes priority over heroImage. */
  heroUpload?: string;
  heroAlt?: string;
  /** Who approved this for publishing, and when. A guide is not public without both. */
  approvedBy?: string;
  approvedOn?: string;
  /** Article body in Markdown (GFM). Use ## and ### headings only (H1 is the title). Internal links like /guides/<slug> or /tools/<tool>. */
  body: string;
  faqs: FAQ[];
  /** Gear guides only: the products recommended, rendered as picks with optional affiliate buttons. */
  gear?: GearPick[];
  relatedGuides: string[]; // slugs
  /** Product ids from content/products.yml (at most 6), shown as "Gear for this trip" after the article. */
  relatedProducts?: string[];
  relatedTools: "packing-list"[];
  sources: Source[];
  research: ResearchBrief;
}
