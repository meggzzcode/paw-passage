import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { ContactEmail } from "@/components/site/ContactEmail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/list-your-property")({
  head: () => pageHead({ title: "List your dog-friendly property", description: "Host a genuinely dog-friendly cabin, cottage or beach house? Here's what we need to verify and list your stay on Paws & Passage.", path: "/list-your-property" }),
  component: () => (
    <InfoPage title="List your property" intro="We feature stays whose pet policies we can verify. Here's what helps us review yours quickly." body={`## What we look for

Stays in or near our launch regions (the North Georgia mountains and coastal California) that are honestly set up for dogs. A fenced yard is great but not required; clarity is.

## Please send

1. **Your listing link** (Airbnb, Vrbo, your own site or a property manager).
2. **Your exact pet policy:** number of dogs, any weight or breed limits, and whether dogs can be left alone.
3. **Pet fees:** the amount and whether it's per stay, per night or per dog, plus any deposit.
4. **Fence details**, if you have one: height, material, gates and latches, and whether the yard is private.
5. **Photos you own or are licensed to share**, including the yard, gates and entrance, and your permission for us to use them.
6. **Nearby dog-friendly walks or beaches** you recommend.

## How it works

We check what you send against your public listing and follow up with any questions. We only publish details we have confirmed, and we mark anything else as "not confirmed." Being reviewed is free. Sponsored placement, if we offer it, is always clearly labeled.`}>
      <div className="mt-8"><ContactEmail subject="Property submission" label="Email us your property" /></div>
    </InfoPage>
  ),
});
