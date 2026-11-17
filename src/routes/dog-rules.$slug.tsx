import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { getPlace, placeKindLabels, ruleLabels, placeIsPublic, placeNeedsRecheck } from "@/content/places";
import { getState, destinations } from "@/content/destinations";
import { getGuide } from "@/content/guides";
import { GuideCard } from "@/components/site/GuideCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PlaceBadges } from "@/components/site/PlaceCard";
import { pageHead, breadcrumbLd } from "@/lib/seo";
import { trackTool } from "@/lib/analytics";

export const Route = createFileRoute("/dog-rules/$slug")({
  loader: ({ params }) => {
    // In production an unverified place does not exist at all (it is not even in the shipped code).
    const place = getPlace(params.slug);
    if (!place) throw notFound();
    return { place };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Place not found" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.place;
    const live = placeIsPublic(p);
    const h = pageHead({
      title: `Are dogs allowed at ${p.name}? Leash rules and exclusions`,
      description: `Dog rules for ${p.name}, managed by ${p.managedBy}, with the official source and the date we last checked it.`,
      path: `/dog-rules/${params.slug}`,
      noindex: !live,
    });
    return { ...h, scripts: live ? [breadcrumbLd([{ name: "Dog rules", path: "/dog-rules" }, { name: p.name, path: `/dog-rules/${p.slug}` }])] : [] };
  },
  component: PlacePage,
});

function PlacePage() {
  const { place: p } = Route.useLoaderData();
  const live = placeIsPublic(p);
  const recheck = live && placeNeedsRecheck(p);
  const town = p.nearTown ? destinations.flatMap((d) => d.towns).find((t) => t.slug === p.nearTown) : undefined;
  useEffect(() => { trackTool("rules_view", { tool: "dog-rules", label: p.slug }); }, [p.slug]);

  const guideSlugs = [...new Set([p.claimFrom, ...(town?.guides ?? []), ...(getState(p.state)?.guides ?? [])].filter((s): s is string => !!s))];
  const guides = guideSlugs.map((s) => getGuide(s)).filter((g) => !!g).slice(0, 2);

  return (
    <article className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Dog rules", to: "/dog-rules" }, { label: p.name }]} />
      {!live && (
        <div className="mt-6 rounded-lg border border-dashed border-terracotta/60 bg-accent/40 p-4 text-sm">
          <PlaceBadges place={p} /> <span className="ml-2">Preview only. Nobody has checked this against the official page yet, so it never appears on the live site.</span>
        </div>
      )}
      <header className="mt-6 max-w-3xl">
        <p className="eyebrow">{placeKindLabels[p.kind]} · {getState(p.state)?.name}{town ? <> · near <Link to="/destinations/$state/$town" params={{ state: p.state, town: town.slug }} className="hover:underline">{town.name}</Link></> : null}</p>
        <h1 className="mt-2 text-4xl md:text-5xl">Are dogs allowed at {p.name}?</h1>
        <p className="mt-3 text-muted-foreground">Managed by {p.managedBy}.</p>
        {live && <div className="mt-3"><PlaceBadges place={p} /></div>}
      </header>

      <p className="mt-8 max-w-3xl rounded-lg bg-secondary/70 p-4 text-sm"><strong>Rules change: confirm with the park before you go.</strong> Signs on site and temporary closures can override anything written here.</p>

      <div className="mt-10 grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-2xl">Where dogs are allowed</h2>
          {p.dogsAllowed.length === 0 ? (
            <p className="mt-3 text-muted-foreground">No area-by-area rules recorded yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-left"><tr><th scope="col" className="px-4 py-3 font-semibold">Area</th><th scope="col" className="px-4 py-3 font-semibold">Dogs</th><th scope="col" className="px-4 py-3 font-semibold">Note</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {p.dogsAllowed.map((d) => (
                    <tr key={d.area} className="align-top"><th scope="row" className="px-4 py-3 text-left font-medium">{d.area}</th><td className="px-4 py-3">{ruleLabels[d.rule]}</td><td className="px-4 py-3 text-muted-foreground">{d.note ?? ""}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {p.exclusions.length > 0 && (<><h2 className="mt-10 text-2xl">Where dogs are not allowed</h2><ul className="mt-3 list-disc pl-5">{p.exclusions.map((e) => <li key={e}>{e}</li>)}</ul></>)}
          {p.seasonal && (<><h2 className="mt-10 text-2xl">Seasonal rules and closures</h2><p className="mt-3">{p.seasonal}</p></>)}
          {p.nearbyAlternative && (<><h2 className="mt-10 text-2xl">If dogs are not allowed, or it does not suit yours</h2><p className="mt-3">{p.nearbyAlternative}</p></>)}
          {p.conflictNote && (<div className="mt-10 rounded-lg border border-border bg-card p-5"><h2 className="font-display text-xl">Where sources disagree</h2><p className="mt-2 text-sm">{p.conflictNote}</p></div>)}
        </div>

        <aside>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl">Basics</h2>
            <dl className="mt-4 divide-y divide-border text-sm">
              <div className="flex justify-between gap-4 py-2.5"><dt className="text-muted-foreground">Leash</dt><dd className="text-right font-medium">{p.leash ?? "Not recorded"}</dd></div>
              <div className="flex justify-between gap-4 py-2.5"><dt className="text-muted-foreground">Fees</dt><dd className="text-right font-medium">{p.fees ?? "None stated"}</dd></div>
            </dl>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl">Official source</h2>
            {p.sourceUrl ? (
              <p className="mt-3 text-sm"><a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackTool("rules_source_click", { tool: "dog-rules", label: p.slug })} className="font-medium text-primary underline">Official source: {p.managedBy}</a></p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No official page recorded yet.</p>
            )}
            {p.sourceQuote && <blockquote className="mt-4 border-l-2 border-terracotta pl-4 text-sm italic">“{p.sourceQuote}”</blockquote>}
            <p className="mt-4 text-xs text-muted-foreground">
              {p.lastChecked ? `Last checked ${p.lastChecked}` : "Not yet checked"}
              {p.sourcePageDate ? ` · The page itself is dated ${p.sourcePageDate}` : ""}
              {p.verifiedBy && live ? ` · Checked by ${p.verifiedBy}` : ""}
            </p>
            {recheck && <p className="mt-3 text-sm"><strong>Needs recheck.</strong> We last read this page more than 12 months ago. Use the official page above as the final word.</p>}
          </div>
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl">Plan the rest of the trip</h2>
        <p className="mt-2 text-sm text-muted-foreground">A dog-friendly park does not make the place you sleep dog-friendly. Check the stay separately with our <Link to="/tools/checklist" className="text-primary underline">before-you-book checklist</Link>.</p>
        {guides.length > 0 && <div className="mt-6 grid gap-8 md:grid-cols-2">{guides.map((g) => <GuideCard key={g!.slug} guide={g!} />)}</div>}
      </section>
    </article>
  );
}
