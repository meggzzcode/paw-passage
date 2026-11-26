import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/how-we-write-adventures")({
  head: () =>
    pageHead({
      title: "How we write adventures",
      description:
        "Where the adventures come from: public guidance from animal-welfare and veterinary organizations, written by us. We are not veterinarians, and nothing is vet-reviewed.",
      path: "/how-we-write-adventures",
    }),
  component: () => (
    <InfoPage
      title="How we write adventures"
      intro="Short and honest."
      updated="2026-11-26"
      body={`## Where they come from

Adventures are written by Paws & Passage from public guidance on dog enrichment, including pages we read from Cornell's Riney Canine Health Center, VCA Animal Hospitals, the ASPCA and Dogs Trust. We paraphrase ideas into original games and walks. We do not copy them, and these organizations have not reviewed or endorsed our adventures.

We use AI tools to help with research and drafting, as described in our [editorial standards](/editorial-standards).

## What we are not

We are not veterinarians or trainers, and **nothing here is vet-reviewed**. The safety lines on a card and the "Read your dog" signs are general guidance, not veterinary advice. Ask your vet about your own dog's health.

## What we do not do

We do not publish fake reviews, ratings or customer numbers. Our internal editorial scores decide what gets published and are not customer ratings.

## Your dog can always opt out

Every adventure can be stopped, skipped or made easier at any time. Your dog walking away is a good ending. If something does not suit your dog, tap "Not for us" and move on.

Found a mistake? See [corrections](/corrections) or [contact](/contact).`}
    />
  ),
});
