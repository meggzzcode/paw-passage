import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, TriangleAlert } from "lucide-react";
import { AMAZON_DISCLOSURE } from "@/content/affiliates";
import { liveCategoryFor } from "@/content/gear-hub";
import { SpecGlyph, SpecMotif, styleFor } from "@/components/site/ProductSpecCard";
import { AFFILIATE_SURFACE_NOTICE } from "@/lib/disclosure";
import { trackProductClick } from "@/lib/analytics";
import { productNameOnly } from "@/lib/product-display";
import { hasAffiliate, needsAmazonSentence, type Recommendation } from "@/lib/packing/shopping";
import type { Entry } from "@/lib/packing/state";
import type { CustomItem } from "@/lib/packing/state";

/** One notice at the top of a shopping surface, beside the affiliate actions it covers. Amazon's sentence is exact. */
export function ShoppingNotice({ recs }: { recs: Recommendation[] }) {
  if (!hasAffiliate(recs)) return null;
  return (
    <p className="pk-notice" role="note">
      {AFFILIATE_SURFACE_NOTICE} {needsAmazonSentence(recs) && <>{AMAZON_DISCLOSURE} </>}
      <Link to="/affiliate-disclosure">How we earn</Link>
    </p>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function RecCard({ rec, label, page }: { rec: Recommendation; label: string; page: () => string }) {
  const { product, link } = rec;
  const { icon, tone } = styleFor(product);
  const title = productNameOnly(product);
  const cat = liveCategoryFor(product);
  return (
    <article
      className="gearcard pk-rec"
      aria-label={`${product.brand} ${title}`}
      data-rec={product.id}
      data-role={rec.role}
    >
      <div className={`speccard speccard-${tone} gearcard-panel`}>
        <SpecMotif tone={tone} />
        <SpecGlyph icon={icon} />
        <p className="gearcard-usecase">{label}</p>
      </div>
      <div className="gearcard-body">
        <div>
          <p className="gearcard-brand">{product.brand}</p>
          <h4 className="gearcard-name">{title}</h4>
        </div>
        <p className="gearcard-reason">{rec.benefit}</p>
        {rec.because && (
          <p className="pk-differs">
            <span className="font-medium">How it differs: </span>
            {rec.because}
          </p>
        )}
        {rec.facts.length > 0 && (
          <ul className="gearcard-facts" aria-label="Key facts">
            {rec.facts.map((f) => (
              <li key={f} className="gearcard-fact">
                {f}
              </li>
            ))}
          </ul>
        )}
        <p className="gearcard-caution">
          <TriangleAlert aria-hidden="true" focusable="false" />
          <span>
            <span className="font-medium">Check: </span>
            {rec.caution}
          </span>
        </p>
        <div className="gearcard-actions">
          <a
            href={link.url}
            target="_blank"
            rel={link.rel}
            aria-label={`${rec.ctaLabel}: ${product.brand} ${title} (opens in a new tab)`}
            onClick={() =>
              trackProductClick({
                product: product.id,
                partner:
                  link.kind === "affiliate"
                    ? (link.network ?? "affiliate")
                    : link.kind === "retailer"
                      ? "retailer website"
                      : "maker website",
                url: link.url,
                page: page(),
              })
            }
            className={`gearcard-cta ${rec.affiliate ? "gearcard-cta-affiliate" : "gearcard-cta-plain"}`}
          >
            {rec.ctaLabel}
            <ArrowUpRight aria-hidden="true" focusable="false" />
          </a>
          {cat && (
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
    </article>
  );
}

/** The small panel under an item the visitor marked "Need to buy". At most two options. */
export function ShoppingPanel({ entry, recs }: { entry: Entry; recs: Recommendation[] }) {
  if (recs.length === 0) return null;
  const shopFor = entry.item.shopFor ?? entry.item.name.toLowerCase();
  const cat = liveCategoryFor(recs[0]!.product);
  const page = () => (typeof window === "undefined" ? "" : window.location.pathname);
  return (
    <section
      className="pk-shop no-print"
      aria-label={`Options for ${shopFor}`}
      data-shopping={entry.item.id}
    >
      <p className="pk-shop-title">
        Need a {shopFor}? Here are a couple of researched options to consider.
      </p>
      <ShoppingNotice recs={recs} />
      <div className="pk-recs">
        {recs.map((r) => (
          <RecCard
            key={r.product.id}
            rec={r}
            label={r.role === "primary" ? cap(shopFor) : "A different approach"}
            page={page}
          />
        ))}
      </div>
      {cat && (
        <p className="pk-shop-more">
          <Link to="/gear/$category" params={{ category: cat.slug }}>
            See more {cat.name.toLowerCase()} gear
          </Link>
        </p>
      )}
    </section>
  );
}

export interface PickRow {
  id: string;
  name: string;
  qty: string;
  packed: boolean;
  rec: Recommendation | undefined;
  custom: boolean;
}

export function pickRows(
  entries: Entry[],
  custom: CustomItem[],
  recsFor: (e: Entry) => Recommendation[],
): PickRow[] {
  return [
    ...entries
      .filter((e) => e.buy)
      .map((e) => ({
        id: e.item.id,
        name: e.item.name,
        qty: e.qtyText,
        packed: e.packed,
        rec: recsFor(e)[0],
        custom: false,
      })),
    ...custom
      .filter((c) => c.buy)
      .map((c) => ({
        id: c.id,
        name: c.name,
        qty: c.qty,
        packed: c.packed,
        rec: undefined,
        custom: true,
      })),
  ];
}

/** "Things to pick up before you go": a compact list of what the visitor marked, not a cart. */
export function PickUpList({ rows }: { rows: PickRow[] }) {
  if (rows.length === 0) return null;
  const recs = rows.flatMap((r) => (r.rec ? [r.rec] : []));
  const page = () => (typeof window === "undefined" ? "" : window.location.pathname);
  return (
    <section className="pk-pickup pk-panel" id="pick-up" aria-labelledby="pk-pickup-h">
      <h2 id="pk-pickup-h">Things to pick up before you go</h2>
      <p className="pk-lede no-print">The items you marked "Need to buy", in one place.</p>
      <ShoppingNotice recs={recs} />
      <ul className="pk-pick-list">
        {rows.map((r) => {
          const cat = r.rec ? liveCategoryFor(r.rec.product) : undefined;
          return (
            <li key={r.id} className="pk-pick-row" data-pick-row={r.id}>
              <div className="pk-pick-name">
                <a href={`#item-${r.id}`}>{r.name}</a>{" "}
                {r.packed && (
                  <span className="pk-packed-pill">
                    <Check aria-hidden="true" focusable="false" />
                    Packed
                  </span>
                )}
                {r.qty && <span className="pk-pick-meta">{r.qty}</span>}
              </div>
              {r.rec && (
                <div className="pk-pick-rec">
                  <span>
                    {r.rec.product.brand} {productNameOnly(r.rec.product)}
                  </span>
                  <a
                    className="pk-pick-cta"
                    href={r.rec.link.url}
                    target="_blank"
                    rel={r.rec.link.rel}
                    aria-label={`${r.rec.ctaLabel}: ${r.rec.product.brand} ${productNameOnly(r.rec.product)} (opens in a new tab)`}
                    onClick={() => {
                      const rec = r.rec!;
                      trackProductClick({
                        product: rec.product.id,
                        partner:
                          rec.link.kind === "affiliate"
                            ? (rec.link.network ?? "affiliate")
                            : rec.link.kind === "retailer"
                              ? "retailer website"
                              : "maker website",
                        url: rec.link.url,
                        page: page(),
                      });
                    }}
                  >
                    {r.rec.ctaLabel}
                  </a>
                  {cat && (
                    <Link to="/gear/$category" params={{ category: cat.slug }}>
                      More {cat.name.toLowerCase()} gear
                    </Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="pk-closing">
        You may already have some of these. Only pick up what you actually need.
      </p>
    </section>
  );
}
