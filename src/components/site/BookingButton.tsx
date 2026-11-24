import { useLocation } from "@tanstack/react-router";
import { getApprovedLink } from "@/content/affiliates";
import { trackOutbound } from "@/lib/analytics";
import { AFFILIATE_BOOK_LABEL, AFFILIATE_LABEL_CLASS } from "@/lib/disclosure";
import type { Stay } from "@/content/stays/types";
import { PLAIN_SOURCE_LINK } from "@/content/stays";

/**
 * The button for a stay. An approved affiliate link for THIS stay (a deeplink to the listing, generated in the
 * partner's hub and pasted unchanged) shows as an affiliate button (labelled "Affiliate link", never "Sponsored", which is reserved for host-paid placement). Until one exists, a plain link to the listing
 * we read the details from is shown, and it earns nothing, so it carries no affiliate label.
 */
export function BookingButton({
  stay,
  compact = false,
  book = false,
}: {
  stay: Stay;
  compact?: boolean;
  book?: boolean;
}) {
  const loc = useLocation();
  const link = getApprovedLink(stay.affiliateId);
  if (stay.status === "sample") return null;
  const btn = compact
    ? "inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition hover:brightness-95"
    : "inline-flex h-12 items-center justify-center rounded-full px-7 font-medium transition hover:brightness-95";
  if (link) {
    return (
      <div>
        <a
          href={link.url}
          target="_blank"
          rel="sponsored nofollow noopener"
          onClick={() =>
            trackOutbound({
              stay: stay.slug,
              partner: link.network,
              url: link.url,
              page: loc.pathname,
            })
          }
          className={`${btn} bg-terracotta-button text-terracotta-foreground`}
        >
          {compact || book
            ? `View on ${link.network}`
            : `See photos and check dates on ${link.network}`}
        </a>
        <p className={`mt-2 ${AFFILIATE_LABEL_CLASS}`}>{AFFILIATE_BOOK_LABEL}</p>
      </div>
    );
  }
  if (PLAIN_SOURCE_LINK.test(stay.sourceUrl)) {
    const name = /vrbo\.com/.test(stay.sourceUrl) ? "Vrbo" : "Airbnb";
    return (
      <a
        href={stay.sourceUrl}
        target="_blank"
        rel="nofollow noopener"
        onClick={() =>
          trackOutbound({
            stay: stay.slug,
            partner: `${name} (plain link)`,
            url: stay.sourceUrl,
            page: loc.pathname,
          })
        }
        className={`${btn} border border-border bg-background text-foreground hover:bg-muted`}
      >
        {compact || book ? `View on ${name}` : `See photos and dates on ${name}`}
      </a>
    );
  }
  return null;
}
