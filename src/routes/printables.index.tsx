import { createFileRoute } from "@tanstack/react-router";
import { PrintablesIndex } from "@/components/printables/PrintablesIndex";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/printables/")({
  head: () =>
    pageHead({
      title: "Printable adventure pages for dog owners",
      description:
        "Print an adventure bucket list, discovery bingo, a weekend planner, a certificate and a family checklist. Made in your browser, nothing uploaded.",
      path: "/printables",
    }),
  component: PrintablesIndex,
});
