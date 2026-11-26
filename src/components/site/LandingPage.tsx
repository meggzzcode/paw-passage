import { BRAND } from "@/config/brand";
import { Container } from "@/components/shell/Container";
import { Button } from "@/components/shell/Button";
import { AppLink } from "@/components/shell/AppLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PreviewCards } from "@/components/site/PreviewCards";
import { PurchasePrompt } from "@/components/site/PurchasePrompt";
import { landingFor, type PreviewFilterKey } from "@/components/site/landing-pages";
import type { PreviewItem } from "@/lib/previews";

const FILTERS: Record<PreviewFilterKey, (p: PreviewItem) => boolean> = {
  any: () => true,
};

export function LandingPage({ slug }: { slug: string }) {
  const l = landingFor(slug);
  return (
    <Container>
      <article className="pp-landing">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: l.h1 }]} />
        <h1 className="pp-h1">{l.h1}</h1>
        <p className="pp-lede">{l.intro}</p>
        <p className="pp-cta-row">
          <Button to="/discover">{BRAND.hero.primaryCta}</Button>
          <Button to="/passport" variant="secondary">
            See the Passport
          </Button>
        </p>
        {l.sections.map((s) => (
          <section key={s.h} className="pp-prose">
            <h2 className="pp-h2">{s.h}</h2>
            {s.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </section>
        ))}
        {l.journal ? (
          <section className="pp-prose" aria-labelledby="hub-journal">
            <h2 className="pp-h2" id="hub-journal">
              Ideas from The Adventure Journal
            </h2>
            <p>Each article goes deeper on one kind of day.</p>
            <ul>
              {l.journal.map((j) => (
                <li key={j.slug}>
                  <AppLink to={`/journal/${j.slug}`} className="pp-textlink">
                    {j.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <PreviewCards filter={FILTERS[l.previews.filter]} heading={l.previews.heading} />
        <PurchasePrompt where="landing" />
        <nav aria-label="Related pages" className="pp-related">
          <h2 className="pp-h2">Keep exploring</h2>
          <ul>
            {l.related.map((r) => (
              <li key={r.to}>
                <AppLink to={r.to} className="pp-textlink">
                  {r.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>
        <p className="pp-fine">
          Every adventure is a gentle suggestion, and your dog can stop at any time. This page is
          general guidance, not veterinary advice.
        </p>
      </article>
    </Container>
  );
}
