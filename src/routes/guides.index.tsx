import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { visibleGuides } from "@/content/guides";
import { GuideCard } from "@/components/site/GuideCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/guides/")({
  head: () =>
    pageHead({
      title: "Dog travel and outdoor guides",
      description:
        "Researched, practical guides for road trips and outdoor days with your dog: car safety, first aid, water and cold-weather gear, and what to pack.",
      path: "/guides",
    }),
  component: GuidesPage,
});

const groups = [
  { key: "Planning", title: "Planning guides" },
  { key: "Checklist", title: "Checklists" },
  { key: "Gear", title: "Gear guides" },
] as const;

const startHere = [
  { slug: "dog-car-safety-harness-and-crate-guide", label: "Car harness or crate" },
  { slug: "dog-friendly-cabin-packing-list", label: "What to pack" },
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
              className="inline-flex min-h-11 items-center text-primary underline"
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
            className={`min-h-11 rounded-full border px-4 py-1.5 text-sm ${filter === c ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-muted"}`}
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
