import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { WelcomePage } from "@/components/site/WelcomePage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/welcome")({
  head: () =>
    pageHead({
      title: "Welcome to the full Passport",
      description: "Your purchase is confirmed. Here is what is unlocked and where to go next.",
      path: "/welcome",
      noindex: true,
    }),
  component: () => (
    <Container>
      <WelcomePage />
    </Container>
  ),
});
