// A quiet, in-page purchase prompt. No modal, no popup, no urgency, no discount. Placed where a visitor has just
// seen something they might want more of. `where` is a slug (it is sent to analytics as-is, so keep it plain).
import { AppLink } from "@/components/shell/AppLink";
import { offer } from "@/config/site";
import { track } from "@/passport/events";

export type PromptPlace =
  | "home"
  | "faq"
  | "previews"
  | "preview-card"
  | "collection"
  | "keepsake"
  | "intro-complete"
  | "landing";

function copyFor(where: string, count?: number): { lead: string; line: string } {
  const n = typeof count === "number" && count > 0 ? count : 0;
  switch (where) {
    case "preview-card":
      return {
        lead: "Like the look of this one?",
        line: "The full instructions are part of the full Passport.",
      };
    case "previews":
      return n
        ? {
            lead: `${n} of these suit your dog.`,
            line: "The full Passport unlocks every one of them, once.",
          }
        : {
            lead: "Want the whole collection?",
            line: "The full Passport unlocks every adventure, once.",
          };
    case "collection":
      return {
        lead: "Want to do the whole collection?",
        line: "The full Passport opens every adventure in it.",
      };
    case "keepsake":
      return {
        lead: "Enjoyed making that?",
        line: "The full Passport adds more keepsake designs and many more adventures to make them from.",
      };
    case "intro-complete":
      return {
        lead: "That was your first stamp.",
        line: "There are many more to collect whenever you are ready.",
      };
    case "faq":
      return {
        lead: "Still deciding?",
        line: "Start with the free adventure. It is a complete one.",
      };
    default:
      return {
        lead: "Ready for more little adventures?",
        line: "The full Passport is one payment, and there is no subscription.",
      };
  }
}

export function PurchasePrompt({ where, count }: { where: PromptPlace | string; count?: number }) {
  const { lead, line } = copyFor(where, count);
  return (
    <aside className="pp-prompt" aria-label="About the full Passport">
      <p className="pp-prompt-text">
        <strong>{lead}</strong> {line}
      </p>
      <p className="pp-prompt-actions">
        <AppLink
          to="/unlock"
          className="pp-btn pp-btn-secondary pp-btn-sm"
          onClick={() => track("purchase_cta_clicked", { where })}
        >
          See what is included, {offer.price}
        </AppLink>
      </p>
    </aside>
  );
}
