import { createFileRoute } from "@tanstack/react-router";
import { ConceptPage } from "@/components/concept/ConceptPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/concept")({
  head: () => {
    const h = pageHead({
      title: "Everyday Magic — design concept",
      description: "A creative direction exploration for Paws & Passage. Demonstration content only.",
      path: "/concept",
      noindex: true,
    });
    return {
      ...h,
      links: [
        ...(h.links ?? []),
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Caveat:wght@500;600&family=Figtree:wght@400;600;700&display=swap" },
      ],
    };
  },
  component: ConceptPage,
});
