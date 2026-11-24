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
