/** FAQ answers are written as plain text with at most inline Markdown links. These helpers keep one rule for both uses. */

/** Plain text with no Markdown syntax: [words](url) becomes "words"; emphasis marks and code ticks are removed. */
export function faqPlainText(answer: string): string {
  return answer
    .replace(/!?\[\[\d{1,3}\]\](?:\([^)]*\))?/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(?<![\w*])([*_])([^*_\n]+?)\1(?![\w*])/g, "$2")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** FAQPage structured data with clean plain-text answers (the site does not emit it today; see docs/recovery/FAQPAGE-DECISION.md). */
export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: faqPlainText(f.q),
      acceptedAnswer: { "@type": "Answer", text: faqPlainText(f.a) },
    })),
  };
}
