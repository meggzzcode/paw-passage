import { Link } from "@tanstack/react-router";
import { AMAZON_DISCLOSURE } from "@/content/affiliates";
import { affiliateUsage } from "@/content/affiliate-usage";

/** Shown at the top of an article only when the article really contains approved affiliate links. */
export function AffiliateNotice({
  guide,
}: {
  guide: { body: string; gear?: { productId: string }[] | undefined };
}) {
  const usage = affiliateUsage(guide);
  if (usage.count === 0) return null;
  return (
    <aside
      role="note"
      className="mb-3 rounded-md bg-muted px-2.5 py-1.5 text-[11px] leading-4 text-muted-foreground sm:mb-6 sm:py-2 sm:text-sm sm:leading-snug"
    >
      Some links are affiliate links; we may earn a commission.{" "}
      {usage.anyAmazon && <>{AMAZON_DISCLOSURE} </>}
      <Link to="/affiliate-disclosure" className="text-primary underline">
        How we earn
      </Link>
    </aside>
  );
}
