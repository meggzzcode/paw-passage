import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { AppLink } from "@/components/shell/AppLink";
import { CuratedCollections } from "@/components/passport/CollectionsCurated";
import { MyCollections } from "@/components/passport/CollectionsMine";
import { FavoriteCollections } from "@/components/passport/CollectionsFavorites";
import { pageHead } from "@/lib/seo";

export type CollectionsTab = "curated" | "mine" | "favorites";
const TABS: { tab: CollectionsTab; label: string }[] = [
  { tab: "curated", label: "Curated" },
  { tab: "mine", label: "My Collections" },
  { tab: "favorites", label: "Favorites" },
];

export const Route = createFileRoute("/collections/")({
  validateSearch: (s: Record<string, unknown>): { tab: CollectionsTab } => ({
    tab: s["tab"] === "mine" || s["tab"] === "favorites" ? s["tab"] : "curated",
  }),
  // ?tab=mine and ?tab=favorites show the visitor's own lists (stored on their device): noindex, canonical stays /collections.
  head: ({ match }) =>
    pageHead({
      title: "Adventure collections for dogs",
      description:
        "Themed decks of dog adventures: five-minute moments, rainy days, apartment life, the golden years and more. Self-paced, no deadlines.",
      path: "/collections",
      noindex: match.search.tab === "mine" || match.search.tab === "favorites",
    }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const { tab } = Route.useSearch();
  return (
    <Container>
      <div className="pa-page">
        <h1 className="pa-h1">Collections</h1>
        <p className="pa-sub">
          Themed decks, your own lists and your favorites. Self-paced, with no deadlines.
        </p>
        <nav aria-label="Collections sections" className="co-tabs">
          {TABS.map((t) => (
            <AppLink
              key={t.tab}
              to="/collections"
              search={{ tab: t.tab } as never}
              className="pa-chip co-tab"
              aria-current={tab === t.tab ? "page" : undefined}
            >
              {t.label}
            </AppLink>
          ))}
        </nav>
        {tab === "mine" ? (
          <MyCollections />
        ) : tab === "favorites" ? (
          <FavoriteCollections />
        ) : (
          <CuratedCollections />
        )}
      </div>
    </Container>
  );
}
