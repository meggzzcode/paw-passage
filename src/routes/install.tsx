import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { InstallGuide } from "@/components/site/InstallGuide";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/install")({
  head: () =>
    pageHead({
      title: "Add to your home screen",
      description:
        "Optional: keep Paws & Passage one tap away on iPhone, iPad, Android or your computer.",
      path: "/install",
    }),
  component: () => (
    <Container>
      <div className="pa-page">
        <h1 className="pa-h1">Keep your adventures one tap away</h1>
        <InstallGuide />
      </div>
    </Container>
  ),
});
