// Early-tester notes. Renders NOTHING until the owner adds an approved entry in src/config/testimonials.ts: no filler,
// no invented quotes, no counts. Each note shows how the person is connected to us, and stars appear only when supplied.
import { Container } from "@/components/shell/Container";
import { BRAND } from "@/config/brand";
import { EARLY_TESTERS, type EarlyTester } from "@/config/testimonials";

export function EarlyTesters({
  entries = EARLY_TESTERS,
  compact = false,
  headingLevel = 2,
  framed = false,
}: {
  entries?: readonly EarlyTester[];
  compact?: boolean;
  headingLevel?: 2 | 3;
  /** Wrap in a page section (home page). Nothing, not even spacing, renders when there is nothing to show. */
  framed?: boolean;
}) {
  const shown = entries.filter((e) => e.approved === true && e.quote.trim() && e.name.trim());
  if (shown.length === 0) return null;
  const H = headingLevel === 3 ? "h3" : "h2";
  const block = (
    <section
      className={`pp-testers${compact ? " pp-testers-compact" : ""}`}
      aria-labelledby="testers-h"
      data-testid="early-testers"
    >
      <H id="testers-h" className="pp-testers-h">
        {BRAND.testersHeading}
      </H>
      <p className="pp-fine">
        Shared by people connected to us, with their permission. Each note says how.
      </p>
      <ul className="pp-testers-list">
        {(compact ? shown.slice(0, 2) : shown).map((e) => (
          <li key={`${e.name}-${e.quote.slice(0, 24)}`}>
            <figure>
              {typeof e.rating === "number" && e.rating >= 1 && e.rating <= 5 && (
                <p
                  className="pp-testers-stars"
                  role="img"
                  aria-label={`${e.rating} out of 5 stars`}
                >
                  {"★".repeat(e.rating)}
                  <span aria-hidden="true">{"☆".repeat(5 - e.rating)}</span>
                </p>
              )}
              <blockquote>{e.quote}</blockquote>
              <figcaption>
                {e.name}, {e.connection}
                {e.date ? ` (${e.date})` : ""}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
  return framed ? (
    <div className="pp-section">
      <Container>{block}</Container>
    </div>
  ) : (
    block
  );
}
