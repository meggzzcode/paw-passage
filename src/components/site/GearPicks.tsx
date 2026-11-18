import { Link, useLocation } from "@tanstack/react-router";
import { liveCategoryFor } from "@/content/gear-hub";
import { AMAZON_DISCLOSURE, getApprovedLink, isAmazon } from "@/content/affiliates";
import { getProduct, type GearPick } from "@/content/gear";
import { trackProductClick } from "@/lib/analytics";
import { productLinkId, productButton } from "@/content/affiliate-usage";

/** Disclosure shown above the picks whenever at least one approved link will render. */
export function hasAffiliateLinks(picks: GearPick[]) {
  return picks.some((p) => !!getApprovedLink(((x) => (x ? productLinkId(x) : undefined))(getProduct(p.productId))));
}

export function GearPicks({ picks }: { picks: GearPick[] }) {
  const loc = useLocation();
  const rows = picks.map((pick) => ({ pick, product: getProduct(pick.productId) })).filter((r) => !!r.product);
  if (rows.length === 0) return null;
  const links = rows.map((r) => getApprovedLink(productLinkId(r.product!)));
  const anyAffiliate = links.some(Boolean);
  const anyAmazon = links.some((l) => l && isAmazon(l));
  return (
    <section className="mt-12" aria-labelledby="gear-picks">
      <h2 id="gear-picks" className="text-3xl">Picks by criteria</h2>
      {anyAffiliate && (
        <p className="mt-3 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          Some links below are affiliate links. If you buy through them we may earn a commission at no extra cost to you. It never changes which products we list or what we say about them. {anyAmazon && AMAZON_DISCLOSURE}
        </p>
      )}
      <p className="mt-3 text-sm text-muted-foreground">We haven't tested these products. They were chosen against the criteria above using the maker's published specifications and independent standards, which are linked for each one.</p>
      <ul className="mt-6 space-y-6">
        {rows.map(({ pick, product }, i) => {
          const link = links[i];
          return (
            <li key={pick.productId} className="rounded-xl border border-border bg-card p-6">
              <p className="eyebrow">{pick.bestFor}</p>
              <h3 className="mt-2 text-2xl">{product!.brand} {product!.name}</h3>
              <p className="mt-2 text-muted-foreground">{product!.summary}</p>
              <p className="mt-3">{pick.whyItMadeTheList}</p>
              <ul className="mt-3 list-disc pl-5 text-sm">{product!.keySpecs.map((s) => <li key={s}>{s}</li>)}</ul>
              <p className="mt-3 text-sm font-medium">Check before you buy</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">{pick.watchOuts.map((w) => <li key={w}>{w}</li>)}</ul>
              <p className="mt-3 text-xs text-muted-foreground">Specs from <a className="underline" href={product!.specSource.url} target="_blank" rel="noopener noreferrer">{product!.specSource.title}</a> ({product!.specSource.publisher}, accessed {product!.specSource.accessedOn}). Sizes, models and availability change: confirm on the seller's page.</p>
              {(() => {
                const cat = liveCategoryFor(product!);
                return cat ? <p className="mt-2 text-xs text-muted-foreground">More like this: <Link to="/gear/$category" params={{ category: cat.slug }} hash={product!.id} className="underline">{cat.name} gear</Link></p> : null;
              })()}
              {(() => {
                const btn = productButton(product!);
                if (!btn) return null;
                const affiliate = btn.kind === "affiliate";
                return (
                  <a
                    href={btn.url}
                    target="_blank"
                    rel={affiliate ? "sponsored nofollow noopener" : "noopener noreferrer"}
                    onClick={() => trackProductClick({ product: product!.id, partner: affiliate ? btn.network : "maker website", url: btn.url, page: loc.pathname })}
                    className={
                      affiliate
                        ? "mt-4 inline-flex h-11 items-center justify-center rounded-full bg-terracotta px-6 font-medium text-terracotta-foreground transition hover:brightness-95"
                        : "mt-4 inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 font-medium text-foreground transition hover:bg-muted"
                    }
                  >
                    {btn.label}
                  </a>
                );
              })()}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
