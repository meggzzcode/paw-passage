import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, ListChecks, Dog, Backpack } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/")({
  head: () =>
    pageHead({
      title: "Free dog travel planning tools",
      description:
        "A pet cost and host confirmation tool (trip cost, quotes, a message to the host) and a printable before-you-book checklist for renting with a dog.",
      path: "/tools",
    }),
  component: ToolsPage,
});

const tools = [
  {
    to: "/tools/will-my-dog-be-accepted",
    icon: Dog,
    t: "Will my dog be accepted?",
    d: "Enter your dogs and see how 38 rental managers' own pet policies compare, with the ones that need a question first marked.",
  },
  {
    to: "/tools/packing-list",
    icon: Backpack,
    t: "Pack your dog's bag",
    d: "Tell us about the trip and fill the bag item by item. Tap an item to see what it is, why you might need it and where to get it.",
  },
  {
    to: "/tools/pet-cost-check",
    icon: Calculator,
    t: "Pet cost and host confirmation",
    d: "Work out the real total for up to three stays, then get a message asking the host to confirm the pet fee in writing.",
  },
  {
    to: "/tools/checklist",
    icon: ListChecks,
    t: "Before-you-book checklist",
    d: "Everything to confirm before paying. Saves on your device and prints neatly.",
  },
] as const;

function ToolsPage() {
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Tools" }]} />
      <h1 className="mt-6 text-4xl md:text-5xl">Planning tools</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Small tools for the fiddly parts of booking with a dog. They run in your browser. Nothing
        you type is sent anywhere.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group rounded-xl border border-border bg-card p-7 shadow-card transition hover:border-primary"
          >
            <t.icon className="size-8 text-terracotta" />
            <h2 className="mt-4 text-2xl group-hover:text-primary">{t.t}</h2>
            <p className="mt-2 text-muted-foreground">{t.d}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
