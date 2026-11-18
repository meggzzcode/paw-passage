import { Link, useLocation } from "@tanstack/react-router";
import { getProducts } from "@/content/gear";
import { resolveProductLink } from "@/content/gear-links";
import { GearDisclosure } from "@/components/site/GearHubCards";
import { trackProductClick } from "@/lib/analytics";

/**
 * A small "related gear" block a guide page can reuse. Pass the product ids from the guide's frontmatter
 * `relatedProducts`. Unknown or inactive ids are skipped, and nothing renders when none are left. It links to the
 * /gear category card (never a price or rating) and, for the outbound button, uses the same link rules as the hub
 * (approved affiliate link, then maker page).
 */
export function RelatedProducts({ productIds, heading = "Gear for this trip" }: { productIds: string[]; heading?: string }) {
  const loc = useLocation();
  const items = getProducts(productIds ?? []).slice(0, 4);
  if (items.length === 0) return null;
  return (
    <section className="no-print mt-16" aria-labelledby="related-products">
      <h2 id="related-products" className="text-3xl">{heading}</h2>
      <p className="mt-2 text-sm text-muted-foreground">Researched from the makers' own pages, not tested by us. No prices or ratings. <Link to="/gear" className="text-primary underline">See all travel gear</Link>.</p>
      <GearDisclosure products={items} />
      <ul className="mt-6 space-y-4">
        {items.map((p) => {
          const link = resolveProductLink(p);
          const cat = p.categories?.[0];
          return (
            <li key={p.id} className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xl">{p.brand} {p.name}</h3>
              <p className="mt-1 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Researched, not tested by us</p>
              <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                {cat && <Link to="/gear/$category" params={{ category: cat }} hash={p.id} className="text-primary underline">Details and specs</Link>}
                {link && (
                  <>
                    <a
                      href={link.url}
                      target="_blank"
                      rel={link.rel}
                      onClick={() => trackProductClick({ product: p.id, partner: link.kind === "affiliate" ? (link.network ?? "affiliate") : link.kind === "retailer" ? "retailer website" : "maker website", url: link.url, page: loc.pathname })}
                      className={link.kind === "affiliate" ? "inline-flex h-10 items-center rounded-full bg-terracotta-button px-5 font-medium text-terracotta-foreground transition hover:brightness-95" : "inline-flex h-10 items-center rounded-full border border-border bg-background px-5 font-medium text-foreground transition hover:bg-muted"}
                    >
                      {link.label}
                    </a>
                    {link.kind === "affiliate" && <span className="text-xs text-muted-foreground">Affiliate link</span>}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
