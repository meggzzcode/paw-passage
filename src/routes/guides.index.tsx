import { createFileRoute } from "@tanstack/react-router";
import { visibleGuides } from "@/content/guides";
import { GuideCard } from "@/components/site/GuideCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/guides/")({
  head: () => pageHead({ title: "Dog travel guides: cabins, beaches, fees and fenced yards", description: "Researched, practical guides to booking dog-friendly cabins and beach rentals: secure yards, pet fees, large dogs, two dogs and what to pack.", path: "/guides" }),
  component: GuidesPage,
});

const groups = [
  { key: "Destination", title: "Destination guides" },
  { key: "Planning", title: "Planning guides" },
  { key: "Checklist", title: "Checklists" },
  { key: "Gear", title: "Gear guides" },
] as const;

function GuidesPage() {
  const guides = visibleGuides();
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">Guides</h1>
        <p className="mt-3 text-muted-foreground">Written to answer the questions most dog-travel articles skip. Each one is researched against what's already out there and checked against official sources, which we list at the end.</p>
      </header>
      {groups.map((g) => {
        const list = guides.filter((x) => x.category === g.key);
        if (!list.length) return null;
        return (
          <section key={g.key} className="mt-16">
            <h2 className="text-2xl">{g.title}</h2>
            <div className="mt-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">{list.map((x) => <GuideCard key={x.slug} guide={x} />)}</div>
          </section>
        );
      })}
    </div>
  );
}
