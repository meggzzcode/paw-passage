import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/site/LandingPage";
import { landingHead } from "@/components/site/landing-head";

export const Route = createFileRoute("/weekend-adventure-finder")({
  head: () => landingHead("weekend-adventure-finder"),
  component: () => <LandingPage slug="weekend-adventure-finder" />,
});
