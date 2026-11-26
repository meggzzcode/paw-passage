import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DISCOVER_MODES, type DiscoverMode } from "@/components/passport/DiscoverTabs";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/discover")({
  head: () =>
    pageHead({
      title: "Find a little adventure for your dog",
      description:
        "Tell us about your dog and get one adventure picked for them, free. No account needed.",
      path: "/discover",
    }),
  validateSearch: (s: Record<string, unknown>): { mode?: DiscoverMode } => {
    const m = DISCOVER_MODES.find((x) => x.id === s["mode"]);
    return m ? { mode: m.id } : {};
  },
  component: DiscoverRoute,
});

function DiscoverRoute() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });
  return (
    <DiscoverPage
      mode={mode ?? "made"}
      onMode={(m) => void navigate({ search: { mode: m }, replace: true })}
    />
  );
}
