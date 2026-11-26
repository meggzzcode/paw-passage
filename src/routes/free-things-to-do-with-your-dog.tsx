import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/site/LandingPage";
import { landingHead } from "@/components/site/landing-head";

export const Route = createFileRoute("/free-things-to-do-with-your-dog")({
  head: () => landingHead("free-things-to-do-with-your-dog"),
  component: () => <LandingPage slug="free-things-to-do-with-your-dog" />,
});
