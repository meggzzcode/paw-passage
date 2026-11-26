import "@/design/journal.css";
import { useEffect } from "react";
import { AppLink } from "@/components/shell/AppLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JOURNAL_NAME, articlePath } from "@/lib/journal";
import { renderJournalMarkdown } from "@/lib/journal-markdown";
import type { JournalArticle } from "@/lib/journal-schema";
import { usePreviews } from "@/lib/usePreviews";
import { collections } from "@/passport/content";
import { track } from "@/passport/events";
import { discoverHref } from "@/passport/journal-context";
import { timeText, costText } from "@/components/passport/labels";

const PREVIEW_LIMIT = 3;

const fmtDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export function JournalArticleView({
  article: a,
  related,
}: {
  article: JournalArticle;
  related: JournalArticle[];
}) {
  const previews = usePreviews();
  const collection = collections.find((c) => c.slug === a.collection);
  // Only allowlisted public fields are used here (title, teaser, category, time, cost); never anything about how an adventure works.
  const picks =
    previews.status === "ready"
      ? previews
          .data!.items.filter((i) => i.collections.includes(a.collection))
          .slice(0, PREVIEW_LIMIT)
      : [];
  useEffect(() => {
    track("journal_article_view", { source: a.slug });
  }, [a.slug]);
  const html = renderJournalMarkdown(a.body);
  const ev =
    (name: Parameters<typeof track>[0], extra: Record<string, string> = {}) =>
    () =>
      void track(name, { source: a.slug, ...extra });

  return (
    <div className="jn-wrap">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: JOURNAL_NAME, to: "/journal" },
          { label: a.title },
        ]}
        hideCurrentOnPhone
      />
      <article className="jn-article">
        <header>
          <p className="jn-meta">
            <AppLink to="/journal">{JOURNAL_NAME}</AppLink>
          </p>
          <h1>{a.title}</h1>
          <p className="jn-meta">
            By Paws &amp; Passage · Published{" "}
            <time dateTime={a.datePublished}>{fmtDate(a.datePublished)}</time>
            {a.dateModified !== a.datePublished && (
              <>
                {" "}
                · Updated <time dateTime={a.dateModified}>{fmtDate(a.dateModified)}</time>
              </>
            )}
          </p>
        </header>
        <figure className="jn-hero">
          <img
            src={a.image}
            alt={a.imageAlt}
            width={1280}
            height={720}
            decoding="async"
            fetchPriority="high"
          />
        </figure>
        <div className="jn-prose" dangerouslySetInnerHTML={{ __html: html }} />

        {picks.length > 0 && (
          <section className="jn-section" aria-labelledby="jn-previews-h">
            <h2 id="jn-previews-h">A few ideas from the full collection</h2>
            <ul className="jn-previews">
              {picks.map((p) => (
                <li key={p.id} className="jn-preview">
                  <AppLink to="/previews" onClick={ev("journal_preview_click", { where: p.id })}>
                    <strong>{p.title}</strong>
                    <span>{p.teaser}</span>
                    <span>
                      {p.category} · {timeText(p)} · {costText(p)}
                    </span>
                  </AppLink>
                </li>
              ))}
            </ul>
            <p className="jn-note">Selected previews from a larger collection.</p>
          </section>
        )}

        <section className="jn-section jn-cta" aria-label="Find an adventure">
          <p>
            Want one picked for your dog? Answer a few questions and get one adventure to try, free.
            No account, no card.
          </p>
          <a
            className="pp-btn pp-btn-primary"
            href={discoverHref(a.ctaContext)}
            onClick={ev("journal_cta_click", { where: a.ctaContext })}
          >
            {a.ctaLabel}
          </a>
          <div className="jn-links">
            {collection && (
              <AppLink
                to={`/collections/${collection.slug}`}
                onClick={ev("journal_collection_click", { where: collection.slug })}
              >
                Browse the {collection.title} collection
              </AppLink>
            )}
            <AppLink to="/unlock" onClick={ev("purchase_cta_clicked", { where: "journal" })}>
              See what the full Passport includes
            </AppLink>
          </div>
        </section>

        {related.length > 0 && (
          <section className="jn-section" aria-labelledby="jn-related-h">
            <h2 id="jn-related-h">Keep reading</h2>
            <ul className="jn-grid">
              {related.map((r) => (
                <li key={r.slug}>
                  <article className="jn-card">
                    <div className="jn-card-body">
                      <h3 className="font-display text-lg">
                        <AppLink
                          to={articlePath(r.slug)}
                          onClick={ev("journal_related_click", { where: r.slug })}
                        >
                          {r.title}
                        </AppLink>
                      </h3>
                      <p>{r.description}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

        {a.sources.length > 0 && (
          <section className="jn-section jn-sources" aria-labelledby="jn-sources-h">
            <h2 id="jn-sources-h">Sources</h2>
            <ul>
              {a.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <p className="jn-note">
          Ideas here are for fun and enrichment, not behavior treatment or veterinary advice. Your
          dog can always opt out.
        </p>
      </article>
    </div>
  );
}
