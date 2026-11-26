import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/site/LandingPage";
import { landingHead } from "@/components/site/landing-head";

export const Route = createFileRoute("/things-to-do-with-your-dog")({
  head: () => landingHead("things-to-do-with-your-dog"),
  component: () => <LandingPage slug="things-to-do-with-your-dog" />,
});
