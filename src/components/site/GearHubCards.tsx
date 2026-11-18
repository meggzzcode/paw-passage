import { useLocation } from "@tanstack/react-router";
import { AMAZON_DISCLOSURE } from "@/content/affiliates";
import type { Product } from "@/content/gear";
import { resolveProductLink } from "@/content/gear-links";
import { guidePickFor } from "@/content/gear-hub";
import { trackProductClick } from "@/lib/analytics";

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
      Some links below are affiliate links. If you buy through them we may earn a commission at no extra cost to you. It never changes which products we list or what we say about them. {anyAmazon && AMAZON_DISCLOSURE}{" "}
      <a className="underline" href="/affiliate-disclosure">Affiliate disclosure</a>
    </p>
  );
}

/** Photo-less product card. Facts come from the product record; trade-offs come from the guide that features it, if any. */
export function GearProductCard({ product }: { product: Product }) {
  const loc = useLocation();
  const link = resolveProductLink(product);
  const featured = guidePickFor(product.id);
  const pick = featured?.pick;
  return (
    <li id={product.id} className="scroll-mt-24 rounded-xl border border-border bg-card p-6">
      {pick && <p className="eyebrow">{pick.bestFor}</p>}
      <h3 className="mt-2 text-2xl">{product.brand} {product.name}</h3>
      <p className="mt-1 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Researched, not tested by us</p>
      <p className="mt-3 text-muted-foreground">{product.summary}</p>
      {pick && <p className="mt-3">{pick.whyItMadeTheList}</p>}
      <p className="mt-3 text-sm font-medium">What the maker states</p>
      <ul className="list-disc pl-5 text-sm">{product.keySpecs.map((s) => <li key={s}>{s}</li>)}</ul>
      {pick && (
        <>
          <p className="mt-3 text-sm font-medium">Check before you buy</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">{pick.watchOuts.map((w) => <li key={w}>{w}</li>)}</ul>
        </>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Specs from <a className="underline" href={product.specSource.url} target="_blank" rel="noopener noreferrer">{product.specSource.title}</a> ({product.specSource.publisher}, accessed {product.specSource.accessedOn}). Last verified {product.lastVerified ?? product.specSource.accessedOn}. Sizes, models and availability change: confirm on the seller's page.
      </p>
      {link && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={link.url}
            target="_blank"
            rel={link.rel}
            onClick={() => trackProductClick({ product: product.id, partner: link.kind === "affiliate" ? (link.network ?? "affiliate") : link.kind === "retailer" ? "retailer website" : "maker website", url: link.url, page: loc.pathname })}
            className={
              link.kind === "affiliate"
                ? "inline-flex h-11 items-center justify-center rounded-full bg-terracotta px-6 font-medium text-terracotta-foreground transition hover:brightness-95"
                : "inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 font-medium text-foreground transition hover:bg-muted"
            }
          >
            {link.label}
          </a>
          {link.kind === "affiliate" && <span className="text-xs text-muted-foreground">Affiliate link</span>}
        </div>
      )}
    </li>
  );
}

/** "How we pick" block shared by the hub and category pages. */
export function HowWePick() {
  return (
    <section className="mt-12 max-w-3xl rounded-xl border border-border bg-card p-6" aria-labelledby="how-we-pick">
      <h2 id="how-we-pick" className="text-2xl">How we pick</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
        <li><strong>Researched, not personally tested.</strong> Every product here is chosen against stated criteria from the maker's own page or an independent standard. Each card cites its source and the date we read it. We have not tested these products.</li>
        <li>No prices and no star ratings: prices change and we have no tests to rate them on. Where a maker does not state something, we say so.</li>
        <li>A link, if there is one, never changes which products we list or what we write.</li>
      </ul>
      <p className="mt-4 text-sm">Read the full <a className="text-primary underline" href="/methodology">methodology</a>, see our <a className="text-primary underline" href="/editorial-standards">editorial standards</a>, or <a className="text-primary underline" href="/corrections">report a correction</a>.</p>
    </section>
  );
}
