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
      className="mb-4 rounded-md bg-muted px-3 py-2 text-sm leading-snug text-muted-foreground sm:mb-6"
    >
      Some links are affiliate links; we may earn a commission.{" "}
      {usage.anyAmazon && <>{AMAZON_DISCLOSURE} </>}
      <Link to="/affiliate-disclosure" className="text-primary underline">
        How we earn
      </Link>
    </aside>
  );
}
