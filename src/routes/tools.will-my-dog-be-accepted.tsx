import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/site/ToolShell";
import { DogAcceptedChecker } from "@/components/site/DogAcceptedChecker";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/will-my-dog-be-accepted")({
  head: () => pageHead({ title: "Will my dog be accepted? Rental pet policy checker", description: "Enter your dogs' number, weight and breed and see how 38 vacation rental managers' own pet policies compare, with a link to each manager's page.", path: "/tools/will-my-dog-be-accepted" }),
  component: Page,
});

function Page() {
  return (
    <ToolShell title="Will my dog be accepted?" intro="Tell us about your dogs and see how 38 rental managers' own pet pages compare, with the ones that need a question first marked. It runs in your browser and nothing you enter is sent anywhere." guides={[{ slug: "how-many-dogs-can-you-bring-to-a-vacation-rental", label: "How many dogs can you bring to a vacation rental?" }, { slug: "how-vacation-rental-pet-fees-work", label: "How pet fees actually work" }]} links={[{ to: "/tools/pet-cost-check", label: "Pet cost and host confirmation tool" }]}>
      <DogAcceptedChecker />
    </ToolShell>
  );
}
