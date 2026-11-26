import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/disclaimer")({
  head: () =>
    pageHead({
      title: "Disclaimer",
      description:
        "General guidance only: what Paws & Passage is and is not, and where your own judgment and your vet come in.",
      path: "/disclaimer",
    }),
  component: () => (
    <InfoPage
      title="Disclaimer"
      updated="2026-11-26"
      body={`Paws & Passage adventures are ideas for spending time with your dog. They are general guidance, not veterinary advice.

## What this is not

We are not veterinarians or trainers, and nothing here is vet-reviewed. Nothing on this site is veterinary, training, nutrition, medical or legal advice, and no adventure is a treatment or a way to change behavior.

## Your dog, your call

You know your dog best. Check with your veterinarian about your dog's health, diet, fitness and age. Ask a qualified trainer about behavior. Your dog can stop any adventure at any time, and you can change or skip any step.

## Your responsibility

You are responsible for your dog's safety and behavior, for supervising them, and for following local laws, leash rules and the rules of any place you visit. Check the weather, the ground and the surroundings before you go.

## How we write adventures

See [How we write adventures](/how-we-write-adventures) for where the guidance comes from. See also our [terms](/terms).`}
    />
  ),
});
