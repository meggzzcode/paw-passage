import { createFileRoute } from "@tanstack/react-router";
import { ConceptJourney } from "@/components/concept/ConceptJourney";
import { pageHead } from "@/lib/seo";

const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Caveat:wght@500;600&family=Figtree:wght@400;600;700&display=swap";

export const Route = createFileRoute("/concept-journey")({
  head: () => {
    const h = pageHead({ title: "Everyday Magic — customer journey concept", description: "Design concept screens for the Adventure Passport customer journey. Demonstration content only.", path: "/concept-journey", noindex: true });
    return { ...h, links: [...(h.links ?? []), { rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "stylesheet", href: FONTS }] };
  },
  component: ConceptJourney,
});
