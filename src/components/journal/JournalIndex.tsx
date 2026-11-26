import "@/design/journal.css";
import { AppLink } from "@/components/shell/AppLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JOURNAL_NAME, JOURNAL_TAGLINE, articlePath } from "@/lib/journal";
import type { JournalArticle } from "@/lib/journal-schema";

export function JournalIndex({ articles }: { articles: JournalArticle[] }) {
  return (
    <div className="jn-wrap">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: JOURNAL_NAME }]} />
      <header className="jn-head">
        <h1>{JOURNAL_NAME}</h1>
        <p className="jn-lead">{JOURNAL_TAGLINE}</p>
      </header>
      <ul className="jn-grid" aria-label="Articles">
        {articles.map((a) => (
          <li key={a.slug}>
            <article className="jn-card">
              <img
                src={a.image}
                alt={a.imageAlt}
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
              />
              <div className="jn-card-body">
                <h2>
                  <AppLink to={articlePath(a.slug)}>{a.title}</AppLink>
                </h2>
                <p>{a.description}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {articles.length === 0 && <p className="jn-lead">New articles are on their way.</p>}
    </div>
  );
}
