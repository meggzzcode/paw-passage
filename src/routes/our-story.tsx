import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/config/brand";
import { AppLink } from "@/components/shell/AppLink";
import { InfoPage } from "@/components/site/InfoPage";
import { StoryStrip } from "@/components/site/StoryStrip";
import { ABOUT_BODY, ABOUT_UPDATED } from "@/components/site/about-content";
import { isRevealed } from "@/passport/starter";
import { members } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";
import { pageHead } from "@/lib/seo";

// Public "Our Story" shows the same brand story as /about, so /about is the ONE canonical, indexed page: this route
// canonicals to /about (no noindex, which would contradict a canonical) and stays out of the sitemap. The personal timeline lives in My Passport ("Our little memories").
export const Route = createFileRoute("/our-story")({
  head: () =>
    pageHead({
      title: "Our Story",
      description: "The story behind Paws & Passage and the Adventure Passport.",
      path: "/about",
    }),
  component: OurStory,
});

function OurStory() {
  const { ready, save } = usePassport();
  const hasProgress = ready && (members(save.done).length > 0 || isRevealed(save));
  return (
    <InfoPage
      title="Our Story"
      intro={BRAND.ourStory}
      updated={ABOUT_UPDATED}
      body={ABOUT_BODY}
      lead={<StoryStrip />}
    >
      {hasProgress && (
        <p className="mt-8">
          <AppLink to="/passport" hash="memories" className="pa-linkbtn">
            See your memories in My Passport
          </AppLink>
        </p>
      )}
    </InfoPage>
  );
}
