import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/config/brand";
import { Container } from "@/components/shell/Container";
import { StoryTimeline } from "@/components/passport/StoryTimeline";
import { SyncStatus } from "@/components/passport/SyncStatus";
import { usePassport } from "@/passport/usePassport";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/our-story")({
  head: () =>
    pageHead({
      title: "Our Story",
      description: "The adventures you have shared, with your memories and keepsakes.",
      path: "/our-story",
      noindex: true,
    }),
  component: OurStory,
});

function OurStory() {
  const { ready, profile } = usePassport();
  return (
    <Container>
      <div className="pa-page">
        <p className="pa-kicker">Our Story</p>
        <h1 className="pa-h1">{profile.name ? `${profile.name}'s story` : "Our story so far"}</h1>
        <p className="pa-sub">{BRAND.ourStory}</p>
        {ready && <SyncStatus />}
        {ready ? <StoryTimeline /> : <div aria-busy="true" />}
      </div>
    </Container>
  );
}
