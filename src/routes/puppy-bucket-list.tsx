import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/site/LandingPage";
import { landingHead } from "@/components/site/landing-head";

export const Route = createFileRoute("/puppy-bucket-list")({
  head: () => landingHead("puppy-bucket-list"),
  component: () => <LandingPage slug="puppy-bucket-list" />,
});
