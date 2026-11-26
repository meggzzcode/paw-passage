import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/site/LandingPage";
import { landingHead } from "@/components/site/landing-head";

export const Route = createFileRoute("/senior-dog-adventures")({
  head: () => landingHead("senior-dog-adventures"),
  component: () => <LandingPage slug="senior-dog-adventures" />,
});
