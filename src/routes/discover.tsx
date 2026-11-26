import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DISCOVER_MODES, type DiscoverMode } from "@/components/passport/DiscoverTabs";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import { pageHead } from "@/lib/seo";
import { parseCtx, type CtxKey } from "@/passport/journal-context";

export const Route = createFileRoute("/discover")({
  // Canonical is always plain /discover; a ctx or mode variant is a starting point, not a page to index.
  head: ({ match }) =>
    pageHead({
      title: "Find a little adventure for your dog",
      description:
        "Answer a few questions about your dog and get a personalized little adventure to try together. Your first adventure is free, with no account needed.",
      path: "/discover",
      noindex: !!(match.search.ctx || match.search.mode),
    }),
  validateSearch: (s: Record<string, unknown>): { mode?: DiscoverMode; ctx?: CtxKey } => {
    const m = DISCOVER_MODES.find((x) => x.id === s["mode"]);
    const ctx = parseCtx(s["ctx"]); // unknown values are ignored
    return { ...(m ? { mode: m.id } : {}), ...(ctx ? { ctx } : {}) };
  },
  component: DiscoverRoute,
});

function DiscoverRoute() {
  const { mode, ctx } = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });
  return (
    <DiscoverPage
      mode={mode ?? (ctx ? "browse" : "made")}
      onMode={(m) => void navigate({ search: { mode: m, ...(ctx ? { ctx } : {}) }, replace: true })}
      {...(ctx ? { ctx } : {})}
      onClearCtx={() => void navigate({ search: mode ? { mode } : {}, replace: true })}
    />
  );
}
