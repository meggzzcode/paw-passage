import type { ArticleHeading } from "./Markdown";

/** "On this page": plain anchor links to the article's ## headings. Works without JavaScript. */
export function TableOfContents({ headings, variant }: { headings: ArticleHeading[]; variant: "mobile" | "sidebar" }) {
  const items = headings.filter((h) => h.depth === 2);
  if (items.length < 2) return null;
  const list = (
    <ol className="space-y-1.5 text-sm">
      {items.map((h) => <li key={h.id}><a href={`#${h.id}`} className="text-muted-foreground hover:text-primary hover:underline">{h.text}</a></li>)}
    </ol>
  );
  if (variant === "mobile") {
    return (
      <details className="no-print mb-8 rounded-lg border border-border bg-card p-4 lg:hidden">
        <summary className="cursor-pointer font-display text-lg">On this page</summary>
        <nav aria-label="On this page" className="mt-3">{list}</nav>
      </details>
    );
  }
  return (
    <nav aria-label="On this page" className="no-print hidden rounded-xl border border-border bg-card p-5 lg:block">
      <p className="font-display text-lg">On this page</p>
      <div className="mt-3">{list}</div>
    </nav>
  );
}
