import { createFileRoute, Link } from "@tanstack/react-router";
import { dogTypes, dogTypeIsLive } from "@/content/dog-types";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/dogs/")({
  head: () =>
    pageHead({
      title: "Dog-friendly travel by dog type",
      description:
        "Find the right rental for your dog. Guides, real manager policies and questions to ask, organized by the kind of dog you have.",
      path: "/dogs",
    }),
  component: DogsPage,
});

function DogsPage() {
  const list = dogTypes.filter(dogTypeIsLive);
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "By dog type" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">Find the right trip for your dog</h1>
        <p className="mt-3 text-muted-foreground">
          A rental that suits one dog can fail another. Pick the description that sounds like yours
          and we will show the guides and questions that matter most.
        </p>
      </header>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {list.map((d) => (
          <Link
            key={d.slug}
            to="/dogs/$slug"
            params={{ slug: d.slug }}
            className="rounded-lg border p-6 hover:bg-muted"
          >
            <h2 className="text-2xl">{d.name}</h2>
            <p className="mt-2 text-muted-foreground">{d.tagline}</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary">See guides →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
