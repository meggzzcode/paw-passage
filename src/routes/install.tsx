import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { InstallGuide } from "@/components/site/InstallGuide";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/install")({
  head: () =>
    pageHead({
      title: "Add to your home screen",
      description:
        "Optional: add Paws & Passage to your home screen. The website works fully in your browser.",
      path: "/install",
      noindex: true,
    }),
  component: () => (
    <Container>
      <div className="pa-page">
        <h1 className="pa-h1">Add to your home screen (optional)</h1>
        <InstallGuide />
      </div>
    </Container>
  ),
});
