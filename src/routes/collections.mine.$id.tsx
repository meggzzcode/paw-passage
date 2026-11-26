import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { CollectionEditor } from "@/components/passport/CollectionEditor";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/collections/mine/$id")({
  head: () =>
    pageHead({
      title: "My collection",
      description: "One of your own adventure collections, stored on your device.",
      path: "/collections",
      noindex: true,
    }),
  component: MineDetail,
});

function MineDetail() {
  const { id } = Route.useParams();
  return (
    <Container>
      <div className="pa-page">
        <CollectionEditor id={id} />
      </div>
    </Container>
  );
}
