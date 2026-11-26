import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { CuratedDetail } from "@/components/passport/CollectionsCurated";
import { collections } from "@/passport/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const c = collections.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: `${loaderData.title}: dog adventures`,
          description: loaderData.description,
          path: `/collections/${loaderData.slug}`,
        })
      : {},
  component: CollectionPage,
});

function CollectionPage() {
  const c = Route.useLoaderData();
  return (
    <Container>
      <div className="pa-page">
        <CuratedDetail c={c} />
      </div>
    </Container>
  );
}
