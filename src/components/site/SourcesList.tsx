import { Link } from "@tanstack/react-router";

export interface SourceItem {
  title: string;
  url: string;
  publisher: string;
  accessedOn: string;
}

/**
 * The guide's Sources list: an unnumbered list (publisher, linked title, date read) in a collapsible <details>
 * (a plain disclosure without JavaScript). The article text links its sources by publisher name, so entries have no
 * numbers and nothing links back.
 */
export function SourcesList({ sources }: { sources: SourceItem[] }) {
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
      <details id="sources-list" className="group mt-3">
        <summary className="inline-flex min-h-6 cursor-pointer items-center py-1 font-medium text-primary underline">
          Show the {sources.length} sources
        </summary>
        <ul className="sources-list mt-3 list-disc space-y-2 pl-6">
          {sources.map((s) => (
            <li key={`${s.url}-${s.title}`} className="rounded-sm pl-1">
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
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
