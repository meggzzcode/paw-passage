import { createFileRoute } from "@tanstack/react-router";
import { PreviewsPage } from "@/components/passport/PreviewsPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/previews")({
  head: () =>
    pageHead({
      title: "Adventure previews for your dog",
      description:
        "A hand-picked selection of previews from the full Adventure Passport. Browse and save favorites, no account needed.",
      path: "/previews",
      // Reachable by URL and linked from the product, but not a search landing page (client-rendered cards). Not in the sitemap.
      noindex: true,
    }),
  component: PreviewsPage,
});
