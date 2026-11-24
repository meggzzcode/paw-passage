import type { Product } from "@/content/gear";
import { GearProductCard } from "@/components/site/GearProductCard";

/**
 * Products that belong to another category first but also fit this one, as compact rows under a plain heading.
 * The id sits on the row so #<product-id> links land here too.
 */
export function RelatedProductRows({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section id="also-useful" className="mt-12 scroll-mt-24" aria-labelledby="also-useful-h">
      <h2 id="also-useful-h" className="text-2xl">
        Also useful for this category
      </h2>
      <ul className="mt-4 grid gap-3">
        {products.map((p) => (
          <li key={p.id} id={p.id} className="scroll-mt-24 rounded-xl">
            <GearProductCard product={p} variant="compact" headingLevel={3} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The category's own products: one column on phones, two from tablet width, readable split card when there is only one. */
export function CategoryProductGrid({ products }: { products: Product[] }) {
  const single = products.length === 1;
  return (
    <ul className={`mt-6 grid gap-5 ${single ? "" : "md:grid-cols-2"}`} aria-label="Products">
      {products.map((p) => (
        <li key={p.id} className="min-w-0">
          <GearProductCard
            product={p}
            variant={single ? "featured" : "standard"}
            headingLevel={2}
            hideDetailsLink
          />
        </li>
      ))}
    </ul>
  );
}
