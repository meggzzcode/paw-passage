import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/site/ToolShell";
import { PetCostWorkflow } from "@/components/site/PetCostWorkflow";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/pet-cost-check")({
  head: () => pageHead({ title: "Pet cost and host confirmation tool", description: "Work out what your dog really costs at a vacation rental, compare up to three quotes, then get a ready-to-send message asking the host to confirm the pet fee in writing.", path: "/tools/pet-cost-check" }),
  component: PetCostCheckPage,
});

function PetCostCheckPage() {
  return (
    <ToolShell title="What will my dog really cost, and how do I lock it in?" intro="Three steps: describe your trip, enter the costs each listing quotes, then get a message that asks the host to confirm the pet fee in writing. It runs in your browser and nothing is sent anywhere." guides={[{ slug: "how-vacation-rental-pet-fees-work", label: "How pet fees actually work at vacation rentals" }, { slug: "vacation-rental-secure-fenced-yard", label: "How to find a rental with a truly secure fenced yard" }]} links={[{ to: "/tools/checklist", label: "Before-you-book checklist" }]}>
      <PetCostWorkflow />
    </ToolShell>
  );
}
