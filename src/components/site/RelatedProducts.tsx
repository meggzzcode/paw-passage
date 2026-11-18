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
export function RelatedProducts({ productIds, heading = "Gear mentioned in this guide" }: { productIds: string[]; heading?: string }) {
  const loc = useLocation();
  const items = getProducts(productIds ?? []).slice(0, 4);
  if (items.length === 0) return null;
  return (
    <aside className="mt-10 rounded-xl border border-border bg-card p-5" aria-labelledby="related-products">
      <h2 id="related-products" className="text-xl">{heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">Researched from the makers' own pages, not tested by us. No prices or ratings.</p>
      <GearDisclosure products={items} />
      <ul className="mt-4 space-y-3">
        {items.map((p) => {
          const link = resolveProductLink(p);
          const cat = p.categories?.[0];
          return (
            <li key={p.id} className="text-sm">
              <span className="font-medium">{p.brand} {p.name}</span>
              <span className="text-muted-foreground"> — {p.summary}</span>{" "}
              {cat && <Link to="/gear/$category" params={{ category: cat }} hash={p.id} className="text-primary underline">Details</Link>}
              {link && (
                <>
                  {" · "}
                  <a href={link.url} target="_blank" rel={link.rel} className="underline" onClick={() => trackProductClick({ product: p.id, partner: link.kind === "affiliate" ? (link.network ?? "affiliate") : link.kind === "retailer" ? "retailer website" : "maker website", url: link.url, page: loc.pathname })}>{link.label}</a>
                  {link.kind === "affiliate" && <span className="text-xs text-muted-foreground"> (affiliate link)</span>}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
