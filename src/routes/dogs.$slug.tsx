import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getDogType, dogTypeGuides, dogTypeIsLive } from "@/content/dog-types";
import { GuideCard } from "@/components/site/GuideCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/dogs/$slug")({
  loader: ({ params }) => {
    const d = getDogType(params.slug);
    if (!d) throw notFound();
    return { d };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData)
      return { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] };
    const d = loaderData.d;
    const h = pageHead({
      title: d.seoTitle,
      description: d.seoDescription,
      path: `/dogs/${params.slug}`,
      noindex: !dogTypeIsLive(d),
    });
    return {
      ...h,
      scripts: [
        breadcrumbLd([
          { name: "By dog type", path: "/dogs" },
          { name: d.name, path: `/dogs/${d.slug}` },
        ]),
      ],
    };
  },
  component: DogTypePage,
});

function DogTypePage() {
  const { d } = Route.useLoaderData();
  const guides = dogTypeGuides(d);
  return (
    <div className="container-page pt-10">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "By dog type", to: "/dogs" },
          { label: d.name },
        ]}
      />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">{d.seoTitle}</h1>
        <p className="mt-3 text-muted-foreground">{d.intro}</p>
      </header>
      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl">Questions to ask before you book</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          {d.ask.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>
      {d.facts?.map((f) => (
        <p key={f.text} className="mt-6 max-w-3xl rounded-lg bg-muted p-4 text-sm">
          {f.text}
          {f.to ? (
            <>
              {" "}
              <Link to={f.to} className="text-primary underline">
                See the full list
              </Link>
            </>
          ) : null}
        </p>
      ))}
      <section className="mt-12">
        <h2 className="text-2xl">Guides for this dog</h2>
        <div className="mt-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      </section>
      <p className="mt-12 text-sm text-muted-foreground">
        Also useful: the{" "}
        <Link to="/tools/pet-cost-check" className="text-primary underline">
          pet cost check
        </Link>{" "}
        and the{" "}
        <Link to="/tools/checklist" className="text-primary underline">
          before-you-book checklist
        </Link>
        .
      </p>
    </div>
  );
}
