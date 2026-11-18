import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { visibleGuides } from "@/content/guides";
import { GuideCard } from "@/components/site/GuideCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/guides/")({
  head: () =>
    pageHead({
      title: "Dog travel guides: fees, yards, big dogs",
      description:
        "Researched, practical guides to booking dog-friendly cabins and beach rentals: secure yards, pet fees, large dogs, two dogs and what to pack.",
      path: "/guides",
    }),
  component: GuidesPage,
});

const groups = [
  { key: "Destination", title: "Destination guides" },
  { key: "Planning", title: "Planning guides" },
  { key: "Checklist", title: "Checklists" },
  { key: "Gear", title: "Gear guides" },
] as const;

const startHere = [
  { slug: "how-vacation-rental-pet-fees-work", label: "How pet fees work" },
  { slug: "pet-friendly-vacation-rental-checklist", label: "Before-you-book checklist" },
] as const;

function GuidesPage() {
  const guides = visibleGuides();
  const [filter, setFilter] = useState<"All" | (typeof groups)[number]["key"]>("All");
  const chips = [
    "All",
    ...groups.filter((g) => guides.some((x) => x.category === g.key)).map((g) => g.key),
  ] as const;
  const start = startHere
    .map((s) => ({ ...s, guide: guides.find((x) => x.slug === s.slug) }))
    .filter((s) => s.guide);
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">Guides</h1>
        <p className="mt-3 text-muted-foreground">
          Written to answer the questions most dog-travel articles skip. Each one is researched
          against what's already out there and checked against official sources, which we list at
          the end.
        </p>
      </header>
      {start.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="font-medium">Start here:</span>
          {start.map((s) => (
            <Link
              key={s.slug}
              to="/guides/$slug"
              params={{ slug: s.slug }}
              className="text-primary underline"
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}
      <div role="group" aria-label="Filter guides by type" className="mt-6 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-1.5 text-sm ${filter === c ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-muted"}`}
          >
            {c}
          </button>
        ))}
      </div>
      {groups.map((g) => {
        if (filter !== "All" && filter !== g.key) return null;
        const list = guides.filter((x) => x.category === g.key);
        if (!list.length) return null;
        return (
          <section key={g.key} className="mt-16">
            <h2 className="text-2xl">{g.title}</h2>
            <div className="mt-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {list.map((x) => (
                <GuideCard key={x.slug} guide={x} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
