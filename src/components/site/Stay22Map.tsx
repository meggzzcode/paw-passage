import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";
import { stay22Src } from "@/lib/stay22";

/**
 * A Stay22 map of places to stay. It renders nothing until a Stay22 account ID is saved in Site settings.
 * Stay22 cannot filter for dogs, so the panel says so and points to the checks that do.
 */
export function Stay22Map({
  address,
  campaign,
  heading,
}: {
  address: string;
  campaign: string;
  heading?: string;
}) {
  const src = stay22Src({ aid: site.stay22AccountId, address, campaign, zoom: 11 });
  if (!src) return null;
  return (
    <section className="mt-16" aria-labelledby={`stay22-${campaign}`}>
      <h2 id={`stay22-${campaign}`} className="text-3xl">
        {heading ?? `Search stays near ${address}`}
      </h2>
      <p
        role="note"
        className="mt-3 max-w-3xl rounded-lg bg-muted p-4 text-sm text-muted-foreground"
      >
        These listings come from our booking partner Stay22.{" "}
        <strong>We have not checked them, and the map cannot filter for dogs.</strong> Confirm the
        dog policy, fees, limits and fencing with the host before you book. Affiliate map: we may
        earn a commission if you book, at no extra cost to you. Try our{" "}
        <Link to="/tools/will-my-dog-be-accepted" className="text-primary underline">
          dog policy checker
        </Link>{" "}
        and the{" "}
        <Link to="/tools/checklist" className="text-primary underline">
          before-you-book checklist
        </Link>{" "}
        first.
      </p>
      <iframe
        title={`Map of stays near ${address}, powered by Stay22`}
        src={src}
        loading="lazy"
        className="mt-4 h-[480px] w-full rounded-xl border border-border"
      />
    </section>
  );
}
