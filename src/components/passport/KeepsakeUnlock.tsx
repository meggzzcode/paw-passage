// What a free visitor sees where the personalized keepsake editor would be: a finished static example of the matching
// style and a plain, calm way to get the full Passport. It has no file input, no camera and no canvas, and it imports
// no keepsake editor or template code. Personalized keepsake creation is part of the full Passport.
import { AppLink } from "@/components/shell/AppLink";
import { FILTER_EXAMPLES } from "@/components/site/keepsake-examples";
import { price } from "@/config/commercial";
import { track } from "@/passport/events";

export type KeepsakeUnlockWhere = "intro-complete" | "card";

const BY_FAMILY: Record<string, string> = {
  "travel-postcard": "/examples/postcard.webp",
  "magazine-cover": "/examples/magazine.webp",
  "id-card": "/examples/detective.webp",
  "trading-card": "/examples/trading-card.webp",
  "seasonal-frame": "/examples/seasonal.webp",
  "event-ticket": "/examples/camping-patch.webp",
  "then-and-now": "/examples/then-and-now.webp",
};
const BY_WHERE: Record<KeepsakeUnlockWhere, string> = {
  "intro-complete": "/examples/magazine.webp",
  card: "/examples/trading-card.webp",
};

const COPY: Record<KeepsakeUnlockWhere, { lead: string; line: string }> = {
  "intro-complete": {
    lead: "Your stamp is in your passport.",
    line: `This is the keepsake style that goes with it. Making one from your own photo is part of the full Passport (${price}, once).`,
  },
  card: {
    lead: "Keepsakes made from your photo are part of the full Passport.",
    line: `Here is what this style looks like (${price}, once, yours to keep).`,
  },
};

/** The static example alone (no explanation, no button), for places that already say what it is. */
export function KeepsakeExampleFigure({
  where,
  family,
}: {
  where: KeepsakeUnlockWhere;
  family?: string | undefined;
}) {
  const src = (family && BY_FAMILY[family]) || BY_WHERE[where];
  const ex = FILTER_EXAMPLES.find((e) => e.src === src) ?? FILTER_EXAMPLES[0];
  if (!ex) return null;
  return (
    <figure className="kp-unlock-fig">
      <img
        src={ex.src}
        alt={ex.alt}
        loading="lazy"
        width={ex.width}
        height={ex.height}
        style={{ maxWidth: "min(220px, 100%)", height: "auto" }}
      />
      <figcaption className="pa-fine">Example keepsake with sample art, not a customer.</figcaption>
    </figure>
  );
}

export function KeepsakeUnlock({
  where,
  family,
}: {
  where: KeepsakeUnlockWhere;
  /** The adventure's keepsake family, to show the matching style. */
  family?: string | undefined;
}) {
  const src = (family && BY_FAMILY[family]) || BY_WHERE[where];
  const ex = FILTER_EXAMPLES.find((e) => e.src === src) ?? FILTER_EXAMPLES[0];
  const { lead, line } = COPY[where];
  return (
    <aside className="pp-prompt kp-unlock" aria-label="About personalized keepsakes">
      {ex && (
        <figure className="kp-unlock-fig">
          <img
            src={ex.src}
            alt={ex.alt}
            loading="lazy"
            width={ex.width}
            height={ex.height}
            style={{ maxWidth: "min(220px, 100%)", height: "auto" }}
          />
          <figcaption className="pa-fine">
            Example keepsake with sample art, not a customer.
          </figcaption>
        </figure>
      )}
      <p className="pp-prompt-text">
        <strong>{lead}</strong> {line}
      </p>
      <p className="pp-prompt-actions">
        <AppLink
          to="/unlock"
          className="pp-btn pp-btn-secondary pp-btn-sm"
          onClick={() => track("purchase_cta_clicked", { where: `keepsake-${where}` })}
        >
          See what is included
        </AppLink>
      </p>
    </aside>
  );
}
