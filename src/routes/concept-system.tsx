import { createFileRoute } from "@tanstack/react-router";
import { ConceptSystem } from "@/components/concept/ConceptSystem";
import { pageHead } from "@/lib/seo";

const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Caveat:wght@500;600&family=Figtree:wght@400;600;700&display=swap";

export const Route = createFileRoute("/concept-system")({
  head: () => {
    const h = pageHead({ title: "Everyday Magic — design system", description: "Color, type, components and accessibility rules for the Everyday Magic design concept.", path: "/concept-system", noindex: true });
    return { ...h, links: [...(h.links ?? []), { rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "stylesheet", href: FONTS }] };
  },
  component: ConceptSystem,
});
