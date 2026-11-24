// Pure helpers for how a guide's body cites its frontmatter `sources` (no "@/" imports: the codemod script and tests load this too).
// A source is cited when the body has a [[n]] marker for it OR an inline Markdown link to its exact URL.

/** A numbered marker, written [[7]](https://source-url). The address is optional so [[7]] alone also counts. */
export const markerPattern = () => /\[\[(\d{1,3})\]\](?:\((https?:[^)\s]+)\))?/g;

/** Source numbers (1-based) a body cites, by marker or by an inline link to the source's exact URL. */
export function citedSourceNumbers(body: string, sources: { url: string }[]): Set<number> {
  const cited = new Set<number>();
  for (const m of body.matchAll(markerPattern())) cited.add(Number(m[1]));
  const links = new Set<string>();
  for (const m of body.matchAll(/\]\((https?:[^)\s]+)(?:\s+"[^"]*")?\)/g)) links.add(m[1]!);
  sources.forEach((s, i) => {
    if (links.has(s.url)) cited.add(i + 1);
  });
  return cited;
}

/**
 * Display numbers for a guide's sources: the order a reader meets them. Maps each source's original (frontmatter,
 * 1-based) number to its display number by first appearance in the body of either a [[n]] marker or an inline link to
 * the source's exact URL; sources the body never references follow, in frontmatter order. The frontmatter and the
 * markdown stay untouched; only what the page shows (superscripts, anchors, Sources list order) uses this map.
 */
export function citationDisplayMap(body: string, sources: { url: string }[]): Map<number, number> {
  const byUrl = new Map<string, number>();
  sources.forEach((s, i) => {
    if (!byUrl.has(s.url)) byUrl.set(s.url, i + 1);
  });
  const display = new Map<number, number>();
  const take = (n: number | undefined) => {
    if (n && n >= 1 && n <= sources.length && !display.has(n)) display.set(n, display.size + 1);
  };
  const re = /\[\[(\d{1,3})\]\](?:\((https?:[^)\s]+)\))?|\]\((https?:[^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (const m of body.matchAll(re)) take(m[1] ? Number(m[1]) : byUrl.get(m[3]!));
  for (let n = 1; n <= sources.length; n++) take(n);
  return display;
}
