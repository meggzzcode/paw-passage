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
    <aside role="note" className="mb-8 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
      This article contains affiliate links. If you buy or book through them we may earn a
      commission at no extra cost to you. It does not change what we write.{" "}
      {usage.anyAmazon && <>{AMAZON_DISCLOSURE} </>}
      <Link to="/affiliate-disclosure" className="text-primary underline">
        How we earn money
      </Link>
      .
    </aside>
  );
}
