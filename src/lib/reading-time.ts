/** Reading speed used for the byline, in words per minute. */
export const WORDS_PER_MINUTE = 220;

/** Words a reader actually reads in a Markdown body: link addresses, pick tags, code fences and markup symbols do not count. */
export function bodyWordCount(body: string): number {
  const text = body
    .replace(/\{\{pick:[^}]*\}\}/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[\[\d{1,3}\]\](?:\([^)]*\))?/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[|#>*_`~-]+/g, " ");
  return (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.,%:/$-]*/gu) ?? []).length;
}

/** Minutes to read the body, rounded up (at least 1). Falls back to the frontmatter number when the body is empty. */
export function readingMinutes(body: string, fallback: number): number {
  const words = bodyWordCount(body);
  return words > 0 ? Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)) : fallback;
}

/**
 * The one reading time shown everywhere (guide header, guide cards, guide index). Production list pages only carry a
 * summary without the text, so the build step (plugins/content.ts guideSummary) writes the number computed from the
 * full body into `readingMinutes`; the guide page computes it from the same body, so both always agree.
 */
export function guideReadingMinutes(guide: { body: string; readingMinutes: number }): number {
  return readingMinutes(guide.body, guide.readingMinutes);
}
