import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/site/LandingPage";
import { landingHead } from "@/components/site/landing-head";

export const Route = createFileRoute("/doggy-date-ideas")({
  head: () => landingHead("doggy-date-ideas"),
  component: () => <LandingPage slug="doggy-date-ideas" />,
});
