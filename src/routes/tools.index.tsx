import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquareText, Calculator, ListChecks, Columns3 } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/")({
  head: () => pageHead({ title: "Free dog travel planning tools", description: "A host question generator, a pet-fee trip cost calculator, a printable before-you-book checklist and a side-by-side stay comparison.", path: "/tools" }),
  component: ToolsPage,
});

const tools = [
  { to: "/tools/host-questions", icon: MessageSquareText, t: "Host question generator", d: "Pick your dog's needs and get a polite, specific message to send a host, plus the photos to ask for." },
  { to: "/tools/cost-calculator", icon: Calculator, t: "Pet fee & trip cost calculator", d: "Compare up to three stays with nightly rates, per-dog fees, cleaning, tax and deposits." },
  { to: "/tools/checklist", icon: ListChecks, t: "Before-you-book checklist", d: "Everything to confirm before paying. Saves on your device and prints neatly." },
  { to: "/tools/compare", icon: Columns3, t: "Compare stays", d: "Line up verified stays and see their pet policies side by side." },
] as const;

function ToolsPage() {
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Tools" }]} />
      <h1 className="mt-6 text-4xl md:text-5xl">Planning tools</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Small tools for the fiddly parts of booking with a dog. They run in your browser. Nothing you type is sent anywhere.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group rounded-xl border border-border bg-card p-7 shadow-card transition hover:border-primary">
            <t.icon className="size-8 text-terracotta" />
            <h2 className="mt-4 text-2xl group-hover:text-primary">{t.t}</h2>
            <p className="mt-2 text-muted-foreground">{t.d}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
