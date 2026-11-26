import { createFileRoute, Link } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { ToolShell } from "@/components/site/ToolShell";
import { PackingPlanner } from "@/components/packing/PackingPlanner";
import { packingConfig } from "@/content/packing";
import { parsePresetSearch, presetFromSearch } from "@/lib/packing/preset";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/packing-list")({
  // Presets (for example from the cabin guide) arrive as ?trip=cabin&days=3&dogs=2. They are validated and clamped, and the
  // canonical address stays /tools/packing-list, so no preset ever becomes its own indexable page.
  validateSearch: (search: Record<string, unknown>) => parsePresetSearch(search, packingConfig),
  head: () =>
    pageHead({
      title: "Road Trip Packing List for Dogs | Paws & Passage",
      description:
        "Build a personalized packing list for a road trip adventure with your dog, customize it, check items off as you pack and print it. Free, with no signup.",
      path: "/tools/packing-list",
    }),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <ToolShell
      eyebrow="Road trip adventures"
      crumb="Packing list"
      title="Pack for your next road trip adventure."
      intro="Tell us a little about your trip. We'll help you build a packing list for your dog, without the stuff you don't need."
      note={
        <span className="pk-saves inline-flex items-center gap-2">
          <Save aria-hidden="true" focusable="false" className="size-4 text-primary" />
          Your list saves on this device. No signup required.
        </span>
      }
    >
      <p className="mb-6 text-sm text-muted-foreground">
        Looking for things to do along the way? Browse the{" "}
        <Link
          to="/collections/$slug"
          params={{ slug: "road-trip-adventures" }}
          className="text-primary underline"
        >
          Road Trip Adventures
        </Link>{" "}
        collection.
      </p>
      <PackingPlanner
        preset={presetFromSearch(search)}
        onPresetHandled={() => void navigate({ search: {}, replace: true })}
      />
      <noscript>
        <p className="mt-6 text-sm text-muted-foreground">
          The planner needs JavaScript to build and save your list. The dog-friendly cabin packing
          guide has a checklist you can read without it.
        </p>
      </noscript>
    </ToolShell>
  );
}
