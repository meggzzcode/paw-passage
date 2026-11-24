import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Guide } from "@/content/types";

/** At most three guides as plain linked rows, not a wall of image cards. */
export function RelatedGuides({ guides }: { guides: Guide[] }) {
  if (guides.length === 0) return null;
  return (
    <section id="related-guides" className="mt-12 scroll-mt-24" aria-labelledby="related-guides-h">
      <h2 id="related-guides-h" className="text-2xl">
        Read before you buy
      </h2>
      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              to="/guides/$slug"
              params={{ slug: g.slug }}
              className="group flex min-h-14 items-center gap-4 px-4 py-3.5 transition hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:px-5"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg leading-snug group-hover:text-primary">
                  {g.title}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{g.dek}</span>
              </span>
              <ArrowRight
                className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none"
                aria-hidden="true"
                focusable="false"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** One concise statement of how products are chosen, with the methodology link. */
export function CategoryHowWePick() {
  return (
    <section className="mt-12 rounded-xl bg-muted p-5 sm:p-6" aria-labelledby="how-we-pick-h">
      <h2 id="how-we-pick-h" className="text-xl">
        How we pick
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/85">
        Every product comes from the maker's own page or an independent standard, and each card
        names its source and the date we read it. We say so where a maker does not state something.
        Sizes and models change, so confirm yours on the seller's page.{" "}
        <a className="text-primary underline underline-offset-2" href="/methodology">
          Read our methodology
        </a>
        .
      </p>
    </section>
  );
}
