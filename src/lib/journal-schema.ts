// The Adventure Journal's article format (content/journal/<slug>.md). Used by the build step (plugins/content.ts) and tests.
import { z } from "zod";

export const CTA_CONTEXTS = [
  "at-home",
  "rainy-day",
  "weekend",
  "doggy-date",
  "no-spend",
  "bond",
  "puppy",
  "senior",
  "family",
  "high-energy",
] as const;

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use the form YYYY-MM-DD");
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "lowercase words joined by hyphens");

export const journalFrontmatterSchema = z.object({
  title: z.string().min(5).max(90),
  slug,
  description: z.string().min(40).max(155),
  datePublished: day,
  dateModified: day,
  primaryQuery: z.string().min(3),
  secondaryQueries: z.array(z.string()).default([]),
  intent: z.string().default(""),
  collection: slug,
  ctaLabel: z.string().min(3).max(60),
  ctaContext: z.enum(CTA_CONTEXTS),
  related: z.array(slug).max(3).default([]),
  image: z
    .string()
    .regex(/^\/journal\/[a-z0-9-]+\.(webp|jpg|png)$/, "a path like /journal/<slug>.webp"),
  imageAlt: z.string().min(10).max(200),
  sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
});

export type JournalFrontmatter = z.infer<typeof journalFrontmatterSchema>;
export type JournalArticle = JournalFrontmatter & { body: string; words: number };

export const countWords = (md: string) => (md.match(/[\p{L}\p{N}'’-]+/gu) ?? []).length;
