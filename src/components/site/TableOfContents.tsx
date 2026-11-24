import type { ArticleHeading } from "./Markdown";

/** "On this page": plain anchor links to the article's ## headings. Works without JavaScript. */
export function TableOfContents({
  headings,
  variant,
}: {
  headings: ArticleHeading[];
  variant: "mobile" | "sidebar";
}) {
  const items = headings.filter((h) => h.depth === 2);
  if (items.length < 2) return null;
  const list = (
    <ol className="divide-y divide-border text-sm">
      {items.map((h, i) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            className="group flex items-start gap-3 py-2.5 text-foreground/80 hover:text-primary"
          >
            <span className="mt-0.5 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-muted px-1 text-[11px] font-semibold tabular-nums text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground">
              {i + 1}
            </span>
            <span className="leading-snug group-hover:underline">{h.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );
  if (variant === "mobile") {
    return (
      <details className="no-print mb-3 rounded-lg border border-border bg-card px-4 py-1.5 sm:mb-8 sm:py-3 lg:hidden">
        <summary className="cursor-pointer font-display text-[0.95rem] sm:text-lg">
          On this page
        </summary>
        <nav aria-label="On this page" className="mt-3">
          {list}
        </nav>
      </details>
    );
  }
  return (
    <nav
      aria-label="On this page"
      className="no-print hidden rounded-xl border border-border bg-card p-5 lg:block"
    >
      <p className="border-b-2 border-primary/30 pb-2 font-display text-lg">On this page</p>
      <div className="mt-1">{list}</div>
    </nav>
  );
}
