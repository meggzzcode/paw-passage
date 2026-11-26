import { AppLink } from "@/components/shell/AppLink";
import { FAQS, type Faq } from "@/components/site/faq-content";

/** Accordion of questions. Links inside answers are added for the few that point to another page. */
const LINKS: Record<string, { to: string; label: string }> = {
  refund: { to: "/refund-policy", label: "Read the refund policy" },
  contact: { to: "/contact", label: "Go to the contact page" },
  recover: { to: "/restore-access", label: "Restore access" },
  "try-first": { to: "/discover", label: "Find our first adventure" },
};

export function FaqList({ items = FAQS }: { items?: readonly Faq[] }) {
  return (
    <div className="pp-faq">
      {items.map((f) => (
        <details key={f.id} id={f.id}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
          {LINKS[f.id] && (
            <p>
              <AppLink to={LINKS[f.id]!.to} className="pp-textlink">
                {LINKS[f.id]!.label}
              </AppLink>
            </p>
          )}
        </details>
      ))}
    </div>
  );
}
