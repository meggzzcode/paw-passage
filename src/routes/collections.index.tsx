import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { AppLink } from "@/components/shell/AppLink";
import { CuratedCollections } from "@/components/passport/CollectionsCurated";
import { MyCollections } from "@/components/passport/CollectionsMine";
import { FavoriteCollections } from "@/components/passport/CollectionsFavorites";
import { useAccessLibrary } from "@/components/passport/collections-shared";
import { worldBySlug } from "@/passport/worlds";
import { pageHead } from "@/lib/seo";

export type CollectionsTab = "curated" | "mine" | "favorites";
// Plain words: Browse (our collections), Saved (bookmarked), My collections (your own lists, full Passport only).
const TABS: { tab: CollectionsTab; label: string; paid?: boolean }[] = [
  { tab: "curated", label: "Browse" },
  { tab: "favorites", label: "Saved" },
  { tab: "mine", label: "My collections", paid: true },
];

export const Route = createFileRoute("/collections/")({
  validateSearch: (s: Record<string, unknown>): { tab: CollectionsTab; world?: string } => ({
    tab: s["tab"] === "mine" || s["tab"] === "favorites" ? s["tab"] : "curated",
    ...(worldBySlug(typeof s["world"] === "string" ? s["world"] : undefined)
      ? { world: s["world"] as string }
      : {}),
  }),
  // ?tab=mine and ?tab=favorites show the visitor's own lists (stored on their device): noindex, canonical stays /collections.
  head: ({ match }) =>
    pageHead({
      title: "Adventure collections for dogs",
      description:
        "Themed decks of dog adventures: five-minute moments, rainy days, apartment life, the golden years and more. Self-paced, no deadlines.",
      path: "/collections",
      noindex:
        match.search.tab === "mine" || match.search.tab === "favorites" || !!match.search.world,
    }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const { tab, world } = Route.useSearch();
  const { unlocked } = useAccessLibrary();
  const inWorld = tab === "curated" && !!world;
  return (
    <Container>
      <div className="pa-page co-page">
        {!inWorld && (
          <>
            <h1 className="pa-h1">Collections</h1>
            <nav aria-label="Collections sections" className="co-tabs">
              {TABS.filter((t) => !t.paid || unlocked || tab === t.tab).map((t) => (
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
          </>
        )}
        {tab === "mine" ? (
          <MyCollections />
        ) : tab === "favorites" ? (
          <FavoriteCollections />
        ) : (
          <CuratedCollections world={world} />
        )}
      </div>
    </Container>
  );
}
