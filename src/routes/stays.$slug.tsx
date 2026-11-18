import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getStay } from "@/content/stays";
import { stayPhoto } from "@/lib/images";
import { getState, getTown, townName, stateAbbr } from "@/content/destinations";
import { stayTypeLabels } from "@/lib/filters";
import { describeFee, yesNo } from "@/lib/stay-format";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { StayFeeCalculator } from "@/components/site/StayFeeCalculator";
import { BookingButton } from "@/components/site/BookingButton";
import { PreviewBadge } from "@/components/site/StatusBadge";
import { stayTitle, stayDescription } from "@/lib/stay-meta";
import { pageHead, breadcrumbLd, jsonLd, stayIsIndexable } from "@/lib/seo";
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
    const h = pageHead({ title: stayTitle(s), description: stayDescription(s), path: `/stays/${params.slug}`, noindex: !stayIsIndexable(s) });
    const indexable = stayIsIndexable(s);
    // The lodging record is only for host-verified stays; a listing-based page gets breadcrumbs only.
    return { ...h, scripts: indexable ? [...(s.status === "verified" ? [{ type: "application/ld+json", children: jsonLd({ "@context": "https://schema.org", "@type": "LodgingBusiness", name: s.name, description: s.summary, petsAllowed: true, address: { "@type": "PostalAddress", addressLocality: townName(s.town), addressRegion: getState(s.state)?.name } }) }] : []), breadcrumbLd([{ name: "Stays", path: "/stays" }, { name: s.name, path: `/stays/${s.slug}` }])] : [] };
  },
  component: StayPage,
});

function StayPage() {
  const { stay: s } = Route.useLoaderData();
  const img = s.photoPermission && (s.image || s.imageUpload) ? stayPhoto(s) : null;
  const facts: [string, string][] = [
    ["Dogs allowed", s.maxDogs === null ? "Not confirmed" : `Up to ${s.maxDogs}`],
    ["Large dogs", yesNo(s.largeDogsOk)],
    ["Weight limit", s.weightLimitLbs ? `${s.weightLimitLbs} lb` : s.largeDogsOk ? "None stated" : "Not confirmed"],
    ["Breed restrictions", s.breedRestrictions === null ? "Not confirmed" : s.breedRestrictions ? "Yes, ask host" : "None stated"],
    ["Pet fee", describeFee(s.petFee)],
    ["Fenced yard", s.fencedYard === null ? "Not confirmed" : { full: "Fully fenced", partial: "Partly fenced", none: "No fence" }[s.fencedYard]],
    // Amenities that are not pet rules appear only once they are known, so an unknown never looks like a gap in the pet policy.
    ...(s.privateOutdoor === null ? [] : ([["Private outdoor space", yesNo(s.privateOutdoor)]] as [string, string][])),
    ...(s.hotTub === null ? [] : ([["Hot tub", yesNo(s.hotTub)]] as [string, string][])),
    ["Sleeps", s.sleeps ? String(s.sleeps) : "Not confirmed"],
  ];
  const related = (getState(s.state)?.guides ?? []).map((g) => getGuide(g)).filter((g) => !!g).slice(0, 2);
  return (
    <article className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Stays", to: "/stays" }, { label: s.name }]} />
      {s.status === "sample" && (
        <div className="mt-6 rounded-lg border border-dashed border-terracotta/60 bg-accent/40 p-4 text-sm">
          <PreviewBadge>Sample, preview only</PreviewBadge> <span className="ml-2">This is a fictional record used to preview the layout. It never appears on the live site.</span>
        </div>
      )}
      <header className="mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="eyebrow">{stayTypeLabels[s.type]} · {getTown(s.state, s.town) ? <Link to="/destinations/$state/$town" params={{ state: s.state, town: s.town }} className="hover:underline">{townName(s.town)}, {stateAbbr(s.state)}</Link> : <>{townName(s.town)}, {stateAbbr(s.state)}</>}</p>
          <h1 className="mt-2 text-4xl md:text-5xl">{s.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{s.summary}</p>
        </div>
        <div>{img ? <BookingButton stay={s} /> : null}</div>
      </header>
      {img ? (
        <img src={img.src} alt={img.alt} width={1600} height={1008} className="mt-8 aspect-[16/8] w-full rounded-xl object-cover" />
      ) : (
        <div className="mt-8 rounded-xl border border-border bg-gradient-to-br from-secondary to-accent/40 p-6 md:p-8">
          <p className="font-display text-xl">Photos of this stay</p>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">The photos belong to the host, so we do not copy them here. You can see every photo, the floor plan and live availability on the booking page.</p>
          <div className="mt-4"><BookingButton stay={s} /></div>
        </div>
      )}
      <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-2xl">About this stay</h2>
          <p className="mt-3 leading-relaxed">{s.description}</p>
          {s.fenceNotes && (<><h3 className="mt-8 text-xl">Fence and gates</h3><p className="mt-2">{s.fenceNotes}</p></>)}
          {s.houseRules.length > 0 && (<><h3 className="mt-8 text-xl">Dog house rules</h3><ul className="mt-2 list-disc pl-5">{s.houseRules.map((r) => <li key={r}>{r}</li>)}</ul></>)}
          {(s.sleeps || s.bedrooms || s.bathrooms || s.beds.length > 0) && (
            <>
              <h2 className="mt-12 text-2xl">The space</h2>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                {s.sleeps ? <li className="rounded-full bg-secondary px-3 py-1">Sleeps {s.sleeps}</li> : null}
                {s.bedrooms ? <li className="rounded-full bg-secondary px-3 py-1">{s.bedrooms} bedroom{s.bedrooms === 1 ? "" : "s"}</li> : null}
                {s.bathrooms ? <li className="rounded-full bg-secondary px-3 py-1">{s.bathrooms} bathroom{s.bathrooms === 1 ? "" : "s"}</li> : null}
              </ul>
              {s.beds.length > 0 && <ul className="mt-3 list-disc pl-5 text-sm">{s.beds.map((b) => <li key={b}>{b}</li>)}</ul>}
            </>
          )}
          {s.amenityGroups.length > 0 && (
            <>
              <h2 className="mt-12 text-2xl">What is included</h2>
              <p className="mt-1 text-xs text-muted-foreground">As listed on the booking page. If a feature matters to you, confirm it with the host.</p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {s.amenityGroups.map((g) => (
                  <div key={g.title}><h3 className="text-lg">{g.title}</h3><ul className="mt-2 list-disc pl-5 text-sm">{g.items.map((i) => <li key={i}>{i}</li>)}</ul></div>
                ))}
              </div>
            </>
          )}
          {(s.locationNote || s.distances.length > 0) && (
            <>
              <h2 className="mt-12 text-2xl">Location and getting around</h2>
              {s.locationNote && <p className="mt-3 leading-relaxed">{s.locationNote}</p>}
              {s.distances.length > 0 && <ul className="mt-3 list-disc pl-5 text-sm">{s.distances.map((d) => <li key={d}>{d}</li>)}</ul>}
            </>
          )}
          {(s.accessNotes.length > 0 || s.guestNotes.length > 0) && (
            <>
              <h2 className="mt-12 text-2xl">Good to know</h2>
              {s.accessNotes.length > 0 && <ul className="mt-3 list-disc pl-5 text-sm">{s.accessNotes.map((a) => <li key={a}>{a}</li>)}</ul>}
              {s.guestNotes.length > 0 && (<><h3 className="mt-5 text-lg">What guests mention</h3><p className="text-xs text-muted-foreground">Paraphrased from the booking page's guest reviews. Not confirmed by us.</p><ul className="mt-2 list-disc pl-5 text-sm">{s.guestNotes.map((a) => <li key={a}>{a}</li>)}</ul></>)}
            </>
          )}
          {(s.checkIn || s.checkOut || s.minimumStay || s.cancellation || s.generalRules.length > 0) && (
            <>
              <h2 className="mt-12 text-2xl">Stay details and house rules</h2>
              <dl className="mt-3 divide-y divide-border text-sm">
                {([["Check-in", s.checkIn], ["Check-out", s.checkOut], ["Minimum stay", s.minimumStay], ["Cancellation", s.cancellation]] as [string, string | undefined][]).filter(([, v]) => !!v).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
                ))}
              </dl>
              {s.generalRules.length > 0 && <ul className="mt-3 list-disc pl-5 text-sm">{s.generalRules.map((r) => <li key={r}>{r}</li>)}</ul>}
            </>
          )}
          {s.nearby.length > 0 && (<><h3 className="mt-8 text-xl">Nearby</h3><ul className="mt-2 list-disc pl-5">{s.nearby.map((r) => <li key={r}>{r}</li>)}</ul></>)}
          <div className="mt-10 rounded-lg bg-secondary/70 p-6">
            <p className="font-display text-lg">Before you book</p>
            <p className="mt-1 text-sm text-muted-foreground">These details come from the listing, and policies change. Confirm the fee, dog limits and fence with the host in writing, and ask any other questions before you book. Anything marked "Not confirmed" is unknown, not a yes. Our <Link to="/tools/pet-cost-check" className="text-primary underline">pet cost and host confirmation tool</Link> writes the message for you.</p>
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
            <p className="mt-4 text-xs text-muted-foreground">{s.status === "verified" && s.lastVerified ? `Last verified ${s.lastVerified}` : "Details read from the listing, not confirmed with the host"}</p>
            <div className="mt-5"><BookingButton stay={s} book /></div>
          </div>
          <StayFeeCalculator stay={s} />
        </aside>
      </div>
      {related.length > 0 && (
        <section className="mt-16"><h2 className="text-2xl">Related guides</h2><div className="mt-6 grid gap-8 md:grid-cols-2">{related.map((g) => <GuideCard key={g!.slug} guide={g!} />)}</div></section>
      )}
    </article>
  );
}
