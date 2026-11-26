// Curated collections. The directory, world pages and collection pages live in src/components/collections; this file keeps
// the names the routes and tests already use. Counts come from one place (collections/stats.ts) and progress from the
// one shared set of completions, so an adventure finished anywhere counts everywhere.
import type { Collection } from "@/passport/content";
import { worldBySlug } from "@/passport/worlds";
import { CollectionDetail } from "@/components/collections/CollectionDetail";
import { CollectionsLanding } from "@/components/collections/CollectionsLanding";
import { WorldPage } from "@/components/collections/WorldPage";

export function CuratedCollections({ world }: { world?: string | undefined } = {}) {
  const w = worldBySlug(world);
  return w ? <WorldPage w={w} /> : <CollectionsLanding />;
}

export function CuratedDetail({ c }: { c: Collection }) {
  return <CollectionDetail c={c} />;
}
