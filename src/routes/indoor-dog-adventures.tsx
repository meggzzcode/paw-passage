import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/site/LandingPage";
import { landingHead } from "@/components/site/landing-head";

export const Route = createFileRoute("/indoor-dog-adventures")({
  head: () => landingHead("indoor-dog-adventures"),
  component: () => <LandingPage slug="indoor-dog-adventures" />,
});
