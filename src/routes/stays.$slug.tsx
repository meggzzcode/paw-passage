import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getStay } from "@/content/stays";
import { stayPhoto } from "@/lib/images";
import { getState, townName } from "@/content/destinations";
import { stayTypeLabels } from "@/lib/filters";
import { describeFee, yesNo } from "@/lib/stay-format";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BookingButton } from "@/components/site/BookingButton";
import { PreviewBadge } from "@/components/site/StatusBadge";
import { pageHead, breadcrumbLd, jsonLd } from "@/lib/seo";
import { getGuide } from "@/content/guides";
import { GuideCard } from "@/components/site/GuideCard";

export const Route = createFileRoute("/stays/$slug")({
  loader: ({ params }) => {
    const stay = getStay(params.slug);
    if (!stay) throw notFound();
    return { stay };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Stay not found" }, { name: "robots", content: "noindex" }] };
    const s = loaderData.stay;
    const h = pageHead({ title: `${s.name}, dog-friendly ${stayTypeLabels[s.type].toLowerCase()} in ${townName(s.town)}`, description: s.summary, path: `/stays/${params.slug}`, noindex: s.status !== "verified" });
    return { ...h, scripts: s.status === "verified" ? [{ type: "application/ld+json", children: jsonLd({ "@context": "https://schema.org", "@type": "LodgingBusiness", name: s.name, description: s.summary, petsAllowed: true, address: { "@type": "PostalAddress", addressLocality: townName(s.town), addressRegion: getState(s.state)?.name } }) }, breadcrumbLd([{ name: "Stays", path: "/stays" }, { name: s.name, path: `/stays/${s.slug}` }])] : [] };
  },
  component: StayPage,
});

function StayPage() {
  const { stay: s } = Route.useLoaderData();
  const img = stayPhoto(s);
  const facts: [string, string][] = [
    ["Dogs allowed", s.maxDogs === null ? "Not confirmed" : `Up to ${s.maxDogs}`],
    ["Large dogs", yesNo(s.largeDogsOk)],
    ["Weight limit", s.weightLimitLbs ? `${s.weightLimitLbs} lb` : s.largeDogsOk ? "None stated" : "Not confirmed"],
    ["Breed restrictions", s.breedRestrictions === null ? "Not confirmed" : s.breedRestrictions ? "Yes, ask host" : "None stated"],
    ["Pet fee", describeFee(s.petFee)],
    ["Fenced yard", s.fencedYard === null ? "Not confirmed" : { full: "Fully fenced", partial: "Partly fenced", none: "No fence" }[s.fencedYard]],
    ["Private outdoor space", yesNo(s.privateOutdoor)],
    ["Hot tub", yesNo(s.hotTub)],
    ["Sleeps", s.sleeps ? String(s.sleeps) : "Not confirmed"],
  ];
  const related = (getState(s.state)?.guides ?? []).map((g) => getGuide(g)).filter((g) => !!g).slice(0, 2);
  return (
    <article className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Stays", to: "/stays" }, { label: s.name }]} />
      {s.status === "unverified" && (
        <div role="note" className="mt-6 rounded-lg border border-terracotta/50 bg-accent/40 p-4 text-sm">
          <span className="font-semibold">Not yet verified.</span> These details come from the listing and have not been confirmed with the host. Ask the host about the pet fee, dog limit, weight and breed rules, and fencing before you book. Anything marked "Not confirmed" is unknown, not a yes.
        </div>
      )}
      {s.status === "sample" && (
        <div className="mt-6 rounded-lg border border-dashed border-terracotta/60 bg-accent/40 p-4 text-sm">
          <PreviewBadge>Sample, preview only</PreviewBadge> <span className="ml-2">This is a fictional record used to preview the layout. It never appears on the live site.</span>
        </div>
      )}
      <header className="mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="eyebrow">{stayTypeLabels[s.type]} · <Link to="/destinations/$state/$town" params={{ state: s.state, town: s.town }} className="hover:underline">{townName(s.town)}</Link></p>
          <h1 className="mt-2 text-4xl md:text-5xl">{s.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{s.summary}</p>
        </div>
        <div><BookingButton stay={s} /></div>
      </header>
      <img src={img.src} alt={s.photoPermission ? img.alt : "Stock photo, not a photo of this property"} width={1600} height={1008} className="mt-8 aspect-[16/8] w-full rounded-xl object-cover" />
      {!s.photoPermission && <p className="mt-2 text-xs text-muted-foreground">Stock photo for illustration. Not a photo of this property.</p>}
      <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-2xl">About this stay</h2>
          <p className="mt-3 leading-relaxed">{s.description}</p>
          {s.fenceNotes && (<><h3 className="mt-8 text-xl">Fence and gates</h3><p className="mt-2">{s.fenceNotes}</p></>)}
          {s.houseRules.length > 0 && (<><h3 className="mt-8 text-xl">Dog house rules</h3><ul className="mt-2 list-disc pl-5">{s.houseRules.map((r) => <li key={r}>{r}</li>)}</ul></>)}
          {s.nearby.length > 0 && (<><h3 className="mt-8 text-xl">Nearby</h3><ul className="mt-2 list-disc pl-5">{s.nearby.map((r) => <li key={r}>{r}</li>)}</ul></>)}
          <div className="mt-10 rounded-lg bg-secondary/70 p-6">
            <p className="font-display text-lg">Before you book</p>
            <p className="mt-1 text-sm text-muted-foreground">Policies change. Confirm the fee, dog limits and fence with the host in writing. Our <Link to="/tools/pet-cost-check" className="text-primary underline">pet cost and host confirmation tool</Link> writes the message for you.</p>
          </div>
        </div>
        <aside>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl">Pet policy at a glance</h2>
            <dl className="mt-4 divide-y divide-border text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className={`text-right font-medium ${v === "Not confirmed" ? "text-muted-foreground italic" : ""}`}>{v}</dd></div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">{s.lastVerified ? `Last verified ${s.lastVerified}` : "Not yet verified"}</p>
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="mt-16"><h2 className="text-2xl">Related guides</h2><div className="mt-6 grid gap-8 md:grid-cols-2">{related.map((g) => <GuideCard key={g!.slug} guide={g!} />)}</div></section>
      )}
    </article>
  );
}
