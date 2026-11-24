import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";

export interface SourceItem {
  title: string;
  url: string;
  publisher: string;
  accessedOn: string;
}

/**
 * The guide's Sources list, in a collapsible <details> (a plain disclosure without JavaScript). Entry n has id="src-n"
 * so a marker's #src-n link lands on it. When the URL hash targets an entry, a small effect opens the list first.
 * `backLinks` holds the source numbers the text cites, so each entry can link back to the first citation (#cite-n-1).
 */
export function SourcesList({
  sources,
  backLinks,
}: {
  sources: SourceItem[];
  backLinks: ReadonlySet<number>;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const openForHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!/^src-\d+$/.test(id)) return;
      const box = ref.current;
      if (!box) return;
      box.open = true;
      const el = document.getElementById(id);
      // The list was closed when the browser tried to scroll, so scroll again once it is open.
      el?.scrollIntoView({ block: "center" });
      (el?.querySelector("a") as HTMLElement | null)?.focus({ preventScroll: true });
    };
    openForHash();
    window.addEventListener("hashchange", openForHash);
    return () => window.removeEventListener("hashchange", openForHash);
  }, []);
  return (
    <>
      <p className="mt-2 text-muted-foreground">
        Sources, with the date we read each. We research from published sources; we have not stayed
        at, inspected or tested anything covered here. See{" "}
        <Link to="/methodology" className="text-primary underline">
          how we research
        </Link>{" "}
        and{" "}
        <Link
          to="/editorial-standards"
          hash="use-of-artificial-intelligence"
          className="text-primary underline"
        >
          our use of AI tools
        </Link>
        .
      </p>
      <details ref={ref} id="sources-list" className="group mt-3">
        <summary className="inline-flex min-h-6 cursor-pointer items-center py-1 font-medium text-primary underline">
          Show the {sources.length} sources
        </summary>
        <ol className="sources-list mt-3 list-decimal space-y-2 pl-6">
          {sources.map((s, i) => (
            <li key={s.url} id={`src-${i + 1}`} className="scroll-mt-28 rounded-sm pl-1">
              <span className="text-muted-foreground">{s.publisher}.</span>{" "}
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {s.title}
              </a>{" "}
              <span className="whitespace-nowrap text-muted-foreground">(read {s.accessedOn})</span>
              {backLinks.has(i + 1) && (
                <>
                  {" "}
                  <a
                    href={`#cite-${i + 1}-1`}
                    aria-label={`Back to text, where source ${i + 1} is first cited`}
                    className="inline-flex min-h-6 min-w-6 items-center gap-1 whitespace-nowrap text-primary underline"
                  >
                    <span aria-hidden="true">&#8617;&#xFE0E;</span> back to text
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </details>
    </>
  );
}
