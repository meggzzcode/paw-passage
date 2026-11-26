// A compact, factual trust strip reused on the homepage, /unlock and /faq. It states what the product does today:
// no testimonials, no ratings, no counts. Support and refund terms are links to the real pages.
import { Check } from "lucide-react";
import { AppLink } from "@/components/shell/AppLink";
import { TRUST_POINTS } from "@/config/commercial";

export function TrustStrip({ heading = "Good to know before you buy" }: { heading?: string }) {
  return (
    <section className="pp-trust" aria-label={heading}>
      <h2 className="pp-trust-h">{heading}</h2>
      <ul className="pp-trust-list">
        {TRUST_POINTS.map((p) => (
          <li key={p.id}>
            <Check aria-hidden="true" size={16} />
            <span>{p.text}</span>
          </li>
        ))}
      </ul>
      <p className="pp-trust-links">
        <AppLink to="/refund-policy" className="pp-textlink">
          Refund terms
        </AppLink>
        <AppLink to="/restore-access" className="pp-textlink">
          Restore access
        </AppLink>
        <AppLink to="/contact" className="pp-textlink">
          Contact support
        </AppLink>
      </p>
    </section>
  );
}
