import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/site/ToolShell";
import { PackingBuilder } from "@/components/site/PackingBuilder";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/packing-list")({
  head: () =>
    pageHead({
      title: "Dog travel packing list builder",
      description:
        "Tell us about your trip and build your dog's bag item by item. Hover or tap each item to see what it is, why you might need it and where to get it.",
      path: "/tools/packing-list",
    }),
  component: Page,
});

function Page() {
  return (
    <ToolShell
      title="Pack your dog's bag"
      intro="Tell us about the trip and we will highlight what to pack. Tap each item to see what it is, what it is for and where to get it, then add it to the bag. Your list saves on this device and nothing you choose is sent anywhere."
      guides={[
        { slug: "dog-friendly-cabin-packing-list", label: "The dog-friendly cabin packing list" },
        {
          slug: "pet-friendly-vacation-rental-checklist",
          label: "Before-you-book checklist guide",
        },
      ]}
      links={[{ to: "/tools/checklist", label: "Before-you-book checklist" }]}
    >
      <PackingBuilder />
    </ToolShell>
  );
}
