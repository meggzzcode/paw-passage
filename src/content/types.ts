// Content model for Paw & Passage. Plain files, no backend.
// Shapes mirror future database tables so a CMS/DB can be added later.

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
  category: "Destination" | "Planning" | "Checklist";
  states: ("georgia" | "california")[];
  status: GuideStatus;
  author: string;
  publishedOn: string; // YYYY-MM-DD
  lastReviewed: string; // YYYY-MM-DD
  readingMinutes: number;
  heroImage: "mountain-cabin" | "beach" | "fenced-yard" | "two-dogs" | "large-dog" | "packing" | "road-trip" | "fees";
  /** Article body in Markdown (GFM). Use ## and ### headings only (H1 is the title). Internal links like /guides/<slug> or /tools/<tool>. */
  body: string;
  faqs: FAQ[];
  relatedGuides: string[]; // slugs
  relatedTools: ("checklist" | "host-questions" | "cost-calculator" | "compare")[];
  sources: Source[];
  research: ResearchBrief;
}
