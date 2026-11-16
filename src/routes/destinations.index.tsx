import { createFileRoute, Link } from "@tanstack/react-router";
import { destinations } from "@/content/destinations";
import { images } from "@/lib/images";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/destinations/")({
  head: () => pageHead({ title: "Dog-friendly destinations in Georgia and California", description: "Plan dog-friendly trips to the North Georgia mountains and the California coast, with town-by-town notes on yards, beaches and local rules.", path: "/destinations" }),
  component: DestinationsPage,
});

function DestinationsPage() {
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Destinations" }]} />
      <h1 className="mt-6 text-4xl md:text-5xl">Destinations</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">We're starting with two places we think dog owners love most, and where the details matter most: mountain cabins in Georgia and beach stays in California.</p>
      <div className="mt-12 space-y-20">
        {destinations.map((d, i) => (
          <section key={d.slug} className={`grid gap-10 md:grid-cols-2 md:items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <img src={images[d.image].card ?? images[d.image].src} alt={images[d.image].alt} loading="lazy" decoding="async" width={1600} height={1008} className="aspect-[4/3] w-full rounded-xl object-cover" />
            <div>
              <p className="eyebrow">{d.focus}</p>
              <h2 className="mt-2 text-4xl">{d.name}</h2>
              <p className="mt-4 text-muted-foreground">{d.intro}</p>
              <ul className="mt-6 grid grid-cols-2 gap-2">
                {d.towns.map((t) => <li key={t.slug}><Link to="/destinations/$state/$town" params={{ state: d.slug, town: t.slug }} className="block rounded-md border border-border px-4 py-3 text-sm font-medium hover:border-primary hover:text-primary">{t.name}</Link></li>)}
              </ul>
              <Link to="/destinations/$state" params={{ state: d.slug }} className="mt-6 inline-block font-medium text-primary underline">Explore {d.name} →</Link>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
