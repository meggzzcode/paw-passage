import { Link } from "@tanstack/react-router";
import { getProducts } from "@/content/gear";
import { GearProductCard } from "@/components/site/GearProductCard";
import { isMonetized } from "@/content/affiliate-usage";
import { PRODUCT_CALLOUTS_REQUIRE_AFFILIATE_LINK } from "@/content/publish-rule";

/**
 * A small "related gear" block a guide page can reuse. Pass the product ids from the guide's frontmatter
 * `relatedProducts`. Unknown or inactive ids are skipped, and nothing renders when none are left. It links to the
 * /gear category card (never a price or rating) and, for the outbound button, uses the same link rules as the hub
 * (approved affiliate link, then maker page).
 */
export function RelatedProducts({
  productIds,
  heading = "Gear for this trip",
  excludeIds = [],
}: {
  productIds: string[];
  heading?: string;
  /** Products already shown as pick cards in the article: skipped here, and the block hides if none are left. */
  excludeIds?: string[];
}) {
  const items = getProducts(productIds ?? [])
    .filter((p) => !PRODUCT_CALLOUTS_REQUIRE_AFFILIATE_LINK || isMonetized(p))
    .slice(0, 4)
    .filter((p) => !excludeIds.includes(p.id));
  if (items.length === 0) return null;
  return (
    <section className="no-print mt-16" aria-labelledby="related-products">
      <h2 id="related-products" className="text-3xl">
        {heading}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        <Link to="/gear" className="text-primary underline">
          See all travel gear
        </Link>
        .
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((p) => (
          <li key={p.id} className="flex">
            <GearProductCard product={p} headingLevel={3} />
          </li>
        ))}
      </ul>
    </section>
  );
}
