import { useLocation } from "@tanstack/react-router";
import { getApprovedLink } from "@/content/affiliates";
import { trackOutbound } from "@/lib/analytics";
import type { Stay } from "@/content/stays/types";

/**
 * The button for a stay. An approved affiliate link for THIS stay (a deeplink to the listing, generated in the
 * partner's hub and pasted unchanged) shows as a sponsored button. Until one exists, a plain link to the listing
 * we read the details from is shown, and it earns nothing, so it carries no sponsored note.
 */
export function BookingButton({ stay }: { stay: Stay }) {
  const loc = useLocation();
  const link = getApprovedLink(stay.affiliateId);
  if (stay.status === "sample") return null;
  const btn = "inline-flex h-12 items-center justify-center rounded-full px-7 font-medium transition hover:brightness-95";
  if (link) {
    return (
      <div>
        <a href={link.url} target="_blank" rel="sponsored nofollow noopener" onClick={() => trackOutbound({ stay: stay.slug, partner: link.network, url: link.url, page: loc.pathname })} className={`${btn} bg-terracotta text-terracotta-foreground`}>See photos and check dates on {link.network}</a>
        <p className="mt-2 text-xs text-muted-foreground">Sponsored link: we may earn a commission if you book, at no extra cost to you.</p>
      </div>
    );
  }
  if (/^https:\/\/(www\.)?(vrbo|airbnb)\.com\//.test(stay.sourceUrl)) {
    const name = /vrbo\.com/.test(stay.sourceUrl) ? "Vrbo" : "Airbnb";
    return <a href={stay.sourceUrl} target="_blank" rel="nofollow noopener" onClick={() => trackOutbound({ stay: stay.slug, partner: `${name} (plain link)`, url: stay.sourceUrl, page: loc.pathname })} className={`${btn} border border-border bg-background text-foreground hover:bg-muted`}>See photos and dates on {name}</a>;
  }
  return null;
}
