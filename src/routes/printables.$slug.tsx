import { createFileRoute } from "@tanstack/react-router";
import { PrintablePage } from "@/components/printables/PrintablePage";
import { printableBySlug } from "@/components/printables/data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/printables/$slug")({
  head: ({ params }) => {
    const p = printableBySlug(params.slug);
    return pageHead({
      title: p ? `${p.title} (printable)` : "Printable",
      description: p ? p.teaser : "Printable adventure pages for dog owners.",
      path: `/printables/${params.slug}`,
      noindex: !p?.sample,
    });
  },
  component: PrintableRoute,
});

function PrintableRoute() {
  const { slug } = Route.useParams();
  return <PrintablePage slug={slug} />;
}
