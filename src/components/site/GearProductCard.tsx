import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, Info, TriangleAlert } from "lucide-react";
import type { Product } from "@/content/gear";
import { relFor, resolveProductLink } from "@/content/gear-links";
import { guidePickFor, liveCategoryFor } from "@/content/gear-hub";
import { getGuide, isPublic } from "@/content/guides";
import { SpecGlyph, SpecMotif, styleFor } from "@/components/site/ProductSpecCard";
import { trackProductClick } from "@/lib/analytics";
import { productNameOnly } from "@/lib/product-display";

export type GearProductCardProps = {
  product: Product;
  /** featured: wide split card; standard: grid card (default); compact: one row for secondary-category lists. */
  variant?: "featured" | "standard" | "compact";
  /** Overrides the use-case label. Only pass text the product record or a guide pick supports. */
  useCase?: string;
  /** A public guide to list first under "Read with it" (for example the guide the product is picked in). */
  guideSlug?: string;
  /** Heading level of the product name. Default 3. */
  headingLevel?: 2 | 3 | 4;
  /** Leave out the quiet "Details and specs" link (use it when the card already sits on that category page). */
  hideDetailsLink?: boolean;
};

/** Short uppercase purpose label per category. Descriptive of the job, never a ranking. */
export const USE_CASE_LABEL: Record<string, string> = {
  "car-safety": "Car travel safety",
  "car-interior": "Car seat protection",
  "ramps-and-steps": "Getting into the car",
  "feeding-and-hydration": "Food and water on the go",
  "pens-and-gates": "Containment at the stay",
  "comfort-and-cooling": "Comfort and cooling",
  "water-and-beach": "Water and beach days",
  "trail-and-hiking": "On the trail",
  "cold-weather": "Cold-weather trips",
  "safety-id-first-aid": "Safety and ID",
  "rental-cleanup": "Rental cleanup",
};

const NO_TESTING = /^none cited\.?$/i;

/** The label above the card: an explicit one, else a short guide "best for" with the ranking word removed, else the category job. */
export function useCaseFor(product: Product, override?: string): string {
  if (override?.trim()) return override.trim();
  const bestFor = guidePickFor(product.id)
    ?.pick.bestFor?.replace(/^best\s+for\s+/i, "")
    .replace(/^best\s+/i, "")
    .trim();
  if (bestFor && bestFor.length <= 34) return bestFor.charAt(0).toUpperCase() + bestFor.slice(1);
  const cat = product.categories?.[0];
  return (cat && USE_CASE_LABEL[cat]) || "Dog travel gear";
}

/** One decision-relevant caution, only when the record or the guide pick supports it. */
export function cautionFor(product: Product): string | undefined {
  const pick = guidePickFor(product.id)?.pick;
  if (pick?.watchOuts?.[0]) return pick.watchOuts[0];
  const claims = product.manufacturerClaimsVsIndependentTesting ?? "";
  const sentence = claims
    .split(/(?<=\.)\s+/)
    .find((s) =>
      /not a (crash-tested )?restraint|no crash-test claim|names no testing body/i.test(s),
    );
  if (sentence) return sentence.replace(/^none cited\.\s*/i, "").trim();
  if (product.categories?.[0] === "car-safety" && NO_TESTING.test(claims.trim()))
    return "Crash-test wording here is the maker's own; no independent tester is cited.";
  return undefined;
}

function partnerOf(link: NonNullable<ReturnType<typeof resolveProductLink>>) {
  return link.kind === "affiliate"
    ? (link.network ?? "affiliate")
    : link.kind === "retailer"
      ? "retailer website"
      : "maker website";
}

/**
 * The one product card for the Gear section. Purpose first (use-case label, graphic panel, name, reason), the buying
 * decision second (facts, caution, ONE button), research on demand (native <details>). No photo, price, rating, stock
 * or per-card affiliate label: the page-level notice carries the disclosure.
 */
export function GearProductCard({
  product,
  variant = "standard",
  useCase,
  guideSlug,
  headingLevel = 3,
  hideDetailsLink = false,
}: GearProductCardProps) {
  const Name = `h${headingLevel}` as "h2" | "h3" | "h4";
  const Sub = `h${Math.min(headingLevel + 1, 6)}` as "h3" | "h4" | "h5";
  const link = resolveProductLink(product);
  const { icon, tone } = styleFor(product);
  const label = useCaseFor(product, useCase);
  const title = productNameOnly(product);
  const brand = product.brand.trim();
  const facts = (product.cardSpecs ?? []).slice(0, 3);
  const caution = cautionFor(product);
  const pick = guidePickFor(product.id)?.pick;
  const moreWatchOuts = (pick?.watchOuts ?? []).filter((w) => w !== caution);
  const claims = (product.manufacturerClaimsVsIndependentTesting ?? "").trim();
  const showClaims = claims !== "" && !NO_TESTING.test(claims);
  const guides = [guideSlug, ...(product.relatedGuides ?? [])]
    .filter((s, i, a): s is string => !!s && a.indexOf(s) === i)
    .map((s) => getGuide(s))
    .filter((g): g is NonNullable<typeof g> => !!g && isPublic(g))
    .slice(0, 3);
  const cat = liveCategoryFor(product);
  const compact = variant === "compact";

  const cta = link ? (
    <a
      href={link.url}
      target="_blank"
      rel={link.rel}
      aria-label={`${link.label}: ${product.brand} ${title} (opens in a new tab)`}
      onClick={() =>
        trackProductClick({
          product: product.id,
          partner: partnerOf(link),
          url: link.url,
          page: typeof window === "undefined" ? "" : window.location.pathname,
        })
      }
      className={`gearcard-cta ${link.kind === "affiliate" ? "gearcard-cta-affiliate" : "gearcard-cta-plain"}`}
    >
      {link.label}
      <ArrowUpRight aria-hidden="true" focusable="false" />
    </a>
  ) : (
    <p className="gearcard-info">
      <Info aria-hidden="true" focusable="false" />
      Information only: no buying link yet
    </p>
  );

  const details = (
    <details className="gearcard-details" data-gearcard-details="">
      <summary>
        Details, fit &amp; sources
        <ChevronDown aria-hidden="true" focusable="false" />
      </summary>
      <div className="gearcard-more">
        {product.keySpecs.length > 0 && (
          <div>
            <Sub>What the maker states</Sub>
            <ul>
              {product.keySpecs.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {showClaims && (
          <div>
            <Sub>Maker claims and independent testing</Sub>
            <p>{claims}</p>
          </div>
        )}
        {moreWatchOuts.length > 0 && (
          <div>
            <Sub>Also check</Sub>
            <ul>
              {moreWatchOuts.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}
        <p>
          Specs from{" "}
          <a href={product.specSource.url} target="_blank" rel="nofollow noopener">
            {product.specSource.title}
          </a>{" "}
          ({product.specSource.publisher}), read{" "}
          {product.lastVerified ?? product.specSource.accessedOn}.
        </p>
        {guides.length > 0 && (
          <p>
            Read with it:{" "}
            {guides.map((g, i) => (
              <span key={g.slug}>
                {i > 0 && ", "}
                <Link to="/guides/$slug" params={{ slug: g.slug }}>
                  {g.title}
                </Link>
              </span>
            ))}
          </p>
        )}
        {product.alternativeRetailer?.url && (
          <p>
            Also at{" "}
            <a href={product.alternativeRetailer.url} target="_blank" rel={relFor("retailer")}>
              {product.alternativeRetailer.name}
            </a>
          </p>
        )}
      </div>
    </details>
  );

  if (compact)
    return (
      <article
        className={`gearcard gearcard-compact speccard-${tone}`}
        aria-label={`${product.brand} ${title}`}
        data-gearcard="compact"
      >
        <SpecGlyph icon={icon} />
        <div className="gearcard-compact-text">
          {brand && <p className="gearcard-brand">{brand}</p>}
          <Name className="gearcard-name">{title}</Name>
          <p className="gearcard-reason">{label}</p>
        </div>
        {cta}
        {details}
      </article>
    );

  return (
    <article
      id={product.id}
      className={`gearcard scroll-mt-24 ${variant === "featured" ? "gearcard-featured" : ""}`.trim()}
      aria-label={`${product.brand} ${title}`}
      data-gearcard={variant}
    >
      <div className={`speccard speccard-${tone} gearcard-panel`}>
        <SpecMotif tone={tone} />
        <SpecGlyph icon={icon} />
        <p className="gearcard-usecase">{label}</p>
      </div>
      <div className="gearcard-body">
        <div>
          {brand && <p className="gearcard-brand">{brand}</p>}
          <Name className="gearcard-name">{title}</Name>
        </div>
        <p className="gearcard-reason">{product.summary}</p>
        {facts.length > 0 && (
          <ul className="gearcard-facts" aria-label="Key facts">
            {facts.map((f) => (
              <li key={f} className="gearcard-fact">
                {f}
              </li>
            ))}
          </ul>
        )}
        {caution && (
          <p className="gearcard-caution">
            <TriangleAlert aria-hidden="true" focusable="false" />
            <span>
              <span className="font-medium">Check: </span>
              {caution}
            </span>
          </p>
        )}
        <div className="gearcard-actions">
          {cta}
          {!hideDetailsLink && cat && (
            <Link
              to="/gear/$category"
              params={{ category: cat.slug }}
              hash={product.id}
              className="gearcard-quiet"
            >
              Details and specs
            </Link>
          )}
        </div>
      </div>
      {details}
    </article>
  );
}
