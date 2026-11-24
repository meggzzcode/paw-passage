import { AMAZON_DISCLOSURE } from "@/content/affiliates";
import type { Product } from "@/content/gear";
import { resolveProductLink } from "@/content/gear-links";
import { GearProductCard as SharedCard } from "@/components/site/GearProductCard";

/**
 * Shown only when at least one approved affiliate link is actually rendered. Same sentence as GearPicks and
 * consistent with /affiliate-disclosure. The Amazon sentence is added only when an Amazon link is rendered.
 */
export function GearDisclosure({ products }: { products: Product[] }) {
  const aff = products.map((p) => resolveProductLink(p)).filter((l) => l?.kind === "affiliate");
  if (aff.length === 0) return null;
  const anyAmazon = aff.some((l) => /amazon/i.test(l?.network ?? ""));
  return (
    <p className="mt-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
      This page has affiliate links. If you buy through them we may earn a commission, at no extra
      cost to you. {anyAmazon && AMAZON_DISCLOSURE}{" "}
      <a className="underline" href="/affiliate-disclosure">
        Affiliate disclosure
      </a>
    </p>
  );
}

/**
 * List-item wrapper kept for the category page: renders the shared card (src/components/site/GearProductCard.tsx).
 * New code should use `GearProductCard` from that file directly.
 */
export function GearProductCard({
  product,
  variant = "standard",
  hideDetailsLink = true,
}: {
  product: Product;
  variant?: "featured" | "standard" | "compact";
  hideDetailsLink?: boolean;
}) {
  return (
    <li className="list-none">
      <SharedCard product={product} variant={variant} hideDetailsLink={hideDetailsLink} />
    </li>
  );
}

/** "How we pick" block shared by the hub and category pages. */
export function HowWePick() {
  return (
    <section
      className="mt-12 max-w-3xl rounded-xl border border-border bg-card p-6"
      aria-labelledby="how-we-pick"
    >
      <h2 id="how-we-pick" className="text-2xl">
        How we pick
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
        <li>
          <strong>Chosen against stated criteria.</strong> Every product here comes from the maker's
          own page or an independent standard. Each card cites its source and the date we read it.
        </li>
        <li>
          No prices and no star ratings, because prices change. Where a maker does not state
          something, we say so.
        </li>
      </ul>
      <p className="mt-4 text-sm">
        Read the full{" "}
        <a className="text-primary underline" href="/methodology">
          methodology
        </a>
        , see our{" "}
        <a className="text-primary underline" href="/editorial-standards">
          editorial standards
        </a>
        , or{" "}
        <a className="text-primary underline" href="/corrections">
          report a correction
        </a>
        .
      </p>
    </section>
  );
}
