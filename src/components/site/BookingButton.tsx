import { useLocation } from "@tanstack/react-router";
import { getApprovedLink } from "@/content/affiliates";
import { trackOutbound } from "@/lib/analytics";
import type { Stay } from "@/content/stays/types";

/** Renders nothing unless the stay has an approved affiliate/booking link. */
export function BookingButton({ stay }: { stay: Stay }) {
  const loc = useLocation();
  const link = getApprovedLink(stay.affiliateId);
  if (!link || stay.status !== "verified") return null;
  return (
    <a
      href={link.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={() => trackOutbound({ stay: stay.slug, partner: link.network, url: link.url, page: loc.pathname })}
      className="inline-flex h-12 items-center justify-center rounded-full bg-terracotta px-7 font-medium text-terracotta-foreground transition hover:brightness-95"
    >
      Check dates with {link.network}
    </a>
  );
}
