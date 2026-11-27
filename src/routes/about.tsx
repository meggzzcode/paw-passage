import { createFileRoute } from "@tanstack/react-router";
import { ABOUT_BODY, ABOUT_INTRO, ABOUT_UPDATED } from "@/components/site/about-content";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Paws & Passage",
      description:
        "The Adventure Passport: little adventures for everyday life with your dog, from cozy days at home to outings, plus researched dog travel and outdoor guides",
      path: "/about",
    }),
  component: () => (
    <InfoPage
      title="About Paws & Passage"
      intro={ABOUT_INTRO}
      updated={ABOUT_UPDATED}
      body={ABOUT_BODY}
    />
  ),
});
