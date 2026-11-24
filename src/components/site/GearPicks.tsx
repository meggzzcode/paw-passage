import { Link, useLocation } from "@tanstack/react-router";
import { liveCategoryFor } from "@/content/gear-hub";
import { AMAZON_DISCLOSURE, getApprovedLink, isAmazon } from "@/content/affiliates";
import { getProduct, type GearPick } from "@/content/gear";
import { trackProductClick } from "@/lib/analytics";
import { ChevronDown } from "lucide-react";
import { ProductSpecCard } from "@/components/site/ProductSpecCard";
import { productLinkId, productButton, isMonetized } from "@/content/affiliate-usage";
import { PRODUCT_CALLOUTS_REQUIRE_AFFILIATE_LINK } from "@/content/publish-rule";

/** Disclosure shown above the picks whenever at least one approved link will render. */
export function hasAffiliateLinks(picks: GearPick[]) {
  return picks.some(
    (p) => !!getApprovedLink(((x) => (x ? productLinkId(x) : undefined))(getProduct(p.productId))),
  );
}

export function GearPicks({
  picks,
  excludeIds = [],
}: {
  picks: GearPick[];
  /** Products that already have a pick card in the article body: not repeated here. */
  excludeIds?: string[];
}) {
  const loc = useLocation();
  const rows = picks
    .map((pick) => ({ pick, product: getProduct(pick.productId) }))
    .filter((r) => !!r.product)
    .filter((r) => !excludeIds.includes(r.pick.productId))
    .filter((r) => !PRODUCT_CALLOUTS_REQUIRE_AFFILIATE_LINK || isMonetized(r.product!));
  if (rows.length === 0) return null;
  const links = rows.map((r) => getApprovedLink(productLinkId(r.product!)));
  const anyAffiliate = links.some(Boolean);
  const anyAmazon = links.some((l) => l && isAmazon(l));
  return (
    <section className="mt-12" aria-labelledby="gear-picks">
      <h2 id="gear-picks" className="text-3xl">
        Picks by criteria
      </h2>
      {anyAffiliate && (
        <p className="mt-3 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          This page has affiliate links. If you buy through them we may earn a commission, at no
          extra cost to you. {anyAmazon && AMAZON_DISCLOSURE}
        </p>
      )}
      <p className="mt-3 text-sm text-muted-foreground">
        We haven't tested these products. They were chosen against the criteria above using the
        maker's published specifications and independent standards, which are linked for each one.
      </p>
      <ul className="mt-6 space-y-6">
        {rows.map(({ pick, product }, i) => {
          const link = links[i];
          return (
            <li key={pick.productId} className="rounded-xl border border-border bg-card p-6">
              <p className="eyebrow">{pick.bestFor}</p>
              <ProductSpecCard product={product!} as="h3" className="mt-2" />
              <p className="mt-2 text-muted-foreground">{product!.summary}</p>
              <p className="mt-3">{pick.whyItMadeTheList}</p>
              <p className="mt-3 text-sm font-medium">Check before you buy</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {pick.watchOuts.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              {(() => {
                const btn = productButton(product!);
                if (!btn) return null;
                const affiliate = btn.kind === "affiliate";
                return (
                  <>
                    <a
                      href={btn.url}
                      target="_blank"
                      rel={affiliate ? "sponsored nofollow noopener" : "nofollow noopener"}
                      onClick={() =>
                        trackProductClick({
                          product: product!.id,
                          partner: affiliate ? btn.network : "maker website",
                          url: btn.url,
                          page: loc.pathname,
                        })
                      }
                      className={
                        affiliate
                          ? "gearcard-cta gearcard-cta-affiliate mt-4"
                          : "gearcard-cta gearcard-cta-plain mt-4"
                      }
                    >
                      {btn.label}
                    </a>
                  </>
                );
              })()}
              <details className="gearcard-details mt-4 rounded-lg border border-border">
                <summary>
                  Details, fit &amp; sources
                  <ChevronDown aria-hidden="true" focusable="false" />
                </summary>
                <div className="gearcard-more">
                  <ul>
                    {product!.keySpecs.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <p>
                    Specs from{" "}
                    <a href={product!.specSource.url} target="_blank" rel="nofollow noopener">
                      {product!.specSource.title}
                    </a>{" "}
                    ({product!.specSource.publisher}, read {product!.specSource.accessedOn}).
                  </p>
                  {(() => {
                    const cat = liveCategoryFor(product!);
                    return cat ? (
                      <p>
                        More like this:{" "}
                        <Link
                          to="/gear/$category"
                          params={{ category: cat.slug }}
                          hash={product!.id}
                        >
                          {cat.name} gear
                        </Link>
                      </p>
                    ) : null;
                  })()}
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
