// Read side of the Adventure Journal: lookups, related articles, structured data. Pure functions over JournalArticle.
import { journalArticles } from "virtual:journal";
import { absoluteUrl, isoDate, jsonLd, breadcrumbLd } from "@/lib/seo";
import { site } from "@/config/site";
import type { JournalArticle } from "./journal-schema";

export const JOURNAL_NAME = "The Adventure Journal";
export const JOURNAL_TAGLINE =
  "Little ideas, new discoveries and more ways to enjoy life together.";

export const allJournal: JournalArticle[] = journalArticles;
export const getJournalArticle = (slug: string, list: JournalArticle[] = allJournal) =>
  list.find((a) => a.slug === slug);

/** The article's declared related articles, falling back to others sharing its collection or context. Never itself. */
export function relatedArticles(a: JournalArticle, list: JournalArticle[] = allJournal) {
  const picked = a.related
    .map((s) => list.find((x) => x.slug === s))
    .filter((x): x is JournalArticle => !!x && x.slug !== a.slug);
  return picked.slice(0, 2);
}

export const articlePath = (slug: string) => `/journal/${slug}`;

export function articleJsonLd(a: JournalArticle) {
  const path = articlePath(a.slug);
  const org = { "@type": "Organization", name: site.name };
  return {
    type: "application/ld+json",
    children: jsonLd({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: a.title,
      description: a.description,
      image: absoluteUrl(a.image),
      datePublished: isoDate(a.datePublished),
      dateModified: isoDate(a.dateModified),
      author: org,
      publisher: org,
      mainEntityOfPage: absoluteUrl(path),
      inLanguage: "en-US",
    }),
  };
}

export const articleBreadcrumbs = (a: JournalArticle) =>
  breadcrumbLd([
    { name: JOURNAL_NAME, path: "/journal" },
    { name: a.title, path: articlePath(a.slug) },
  ]);
