import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Fence, Ruler, Dog, BadgeDollarSign, ShieldCheck, MessageSquareText, Calculator, ListChecks } from "lucide-react";
import { images } from "@/lib/images";
import { destinations } from "@/content/destinations";
import { visibleGuides } from "@/content/guides";
import { visibleStays } from "@/content/stays";
import { GuideCard } from "@/components/site/GuideCard";
import { StayCard } from "@/components/site/StayCard";
import { Newsletter } from "@/components/site/Newsletter";
import { featureFilters, type FeatureKey } from "@/lib/stay-search";
import { stayTypeLabels } from "@/lib/filters";
import { pageHead } from "@/lib/seo";
import { site } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => pageHead({
    title: `${site.name}: dog-friendly cabins, beach stays and travel guides`,
    description: "Find dog-friendly cabins and beach stays by the details that matter: fenced yards, large dogs, multiple dogs and real pet fees. Researched guides and free planning tools.",
    path: "/",
  }),
  component: Home,
});

const styles = [
  { label: "Cabins", search: { type: "cabin" }, img: "mountain-cabin" },
  { label: "Beach houses", search: { beach: true }, img: "beach" },
  { label: "Mountain escapes", search: { mountain: true }, img: "hero-porch" },
  { label: "Weekend getaways", guide: "dog-friendly-weekend-getaways-from-atlanta", img: "road-trip" },
  { label: "Unique stays", search: { type: "unique" }, img: "coast-bluff" },
] as const;

const mustHaves: { key: FeatureKey; label: string; icon: typeof Fence; note: string }[] = [
  { key: "fenced", label: "Fully fenced yards", icon: Fence, note: "Fenced on every side, not just partly" },
  { key: "large", label: "Large-dog friendly", icon: Ruler, note: "No small-dogs-only weight limits" },
  { key: "multi", label: "Multiple dogs", icon: Dog, note: "Two or more dogs confirmed" },
  { key: "noFee", label: "No pet fee", icon: BadgeDollarSign, note: "Confirmed $0, not just \"ask\"" },
];

function Home() {
  const navigate = useNavigate();
  const [where, setWhere] = useState("");
  const [type, setType] = useState("");
  const [feature, setFeature] = useState("");
  const guides = visibleGuides();
  const featuredGuides = guides.slice(0, 4);
  const stays = visibleStays().slice(0, 3);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const [state, town] = where.split(":");
    navigate({
      to: "/stays",
      search: (prev) => ({ ...prev, state: state ?? "", town: town ?? "", type, ...(feature ? { [feature]: true } : {}) }),
    });
  }

  return (
    <>
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <img src={images["hero-porch"].src} alt={images["hero-porch"].alt} width={1920} height={1088} fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-scrim" />
        <div className="container-page flex min-h-[88vh] flex-col justify-end pb-14 pt-32">
          <p className="eyebrow animate-rise !text-sage">Dog-friendly travel, done properly</p>
          <h1 className="animate-rise mt-4 max-w-3xl text-5xl leading-[1.05] text-primary-foreground md:text-7xl">Their favorite getaway starts here.</h1>
          <p className="animate-rise mt-5 max-w-xl text-lg text-primary-foreground/90">Discover cabins, beach escapes, and beautiful stays that welcome your dog, with the details that matter.</p>
          <form onSubmit={onSearch} className="animate-rise mt-9 grid gap-2 rounded-2xl bg-background p-2 shadow-card md:grid-cols-[1.3fr_1fr_1fr_auto]" aria-label="Find dog-friendly stays">
            <label className="flex flex-col rounded-xl px-4 py-2 hover:bg-muted">
              <span className="text-xs font-semibold">Destination</span>
              <select value={where} onChange={(e) => setWhere(e.target.value)} className="bg-transparent text-sm outline-none">
                <option value="">Anywhere</option>
                {destinations.map((d) => (
                  <optgroup key={d.slug} label={d.name}>
                    <option value={`${d.slug}:`}>All of {d.name}</option>
                    {d.towns.map((t) => <option key={t.slug} value={`${d.slug}:${t.slug}`}>{t.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="flex flex-col rounded-xl px-4 py-2 hover:bg-muted">
              <span className="text-xs font-semibold">Stay type</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className="bg-transparent text-sm outline-none">
                <option value="">Any type</option>
                {Object.entries(stayTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="flex flex-col rounded-xl px-4 py-2 hover:bg-muted">
              <span className="text-xs font-semibold">Must-have</span>
              <select value={feature} onChange={(e) => setFeature(e.target.value)} className="bg-transparent text-sm outline-none">
                <option value="">No preference</option>
                {featureFilters.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
              </select>
            </label>
            <button className="h-14 rounded-xl bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90">Find dog-friendly stays</button>
          </form>
        </div>
      </section>

      <section className="container-page mt-20">
        <h2 className="text-3xl md:text-4xl">Browse by travel style</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {styles.map((s, i) => {
            const img = images[s.img];
            const inner = (
              <>
                <img src={img.src} alt="" loading="lazy" width={800} height={1000} className={`w-full object-cover transition duration-700 group-hover:scale-105 ${i % 2 ? "aspect-[3/4]" : "aspect-[4/5]"}`} />
                <div className="absolute inset-0 bg-scrim" />
                <span className="absolute bottom-4 left-4 font-display text-xl text-primary-foreground">{s.label}</span>
              </>
            );
            return "guide" in s ? (
              <Link key={s.label} to="/guides/$slug" params={{ slug: s.guide }} className="group relative overflow-hidden rounded-lg">{inner}</Link>
            ) : (
              <Link key={s.label} to="/stays" search={(p) => ({ ...p, ...s.search })} className="group relative overflow-hidden rounded-lg">{inner}</Link>
            );
          })}
        </div>
      </section>

      <section className="container-page mt-24">
        <div className="flex items-end justify-between gap-4">
          <div><p className="eyebrow">Launch destinations</p><h2 className="mt-2 text-3xl md:text-4xl">Where we're starting</h2></div>
          <Link to="/destinations" className="hidden text-sm font-medium text-primary hover:underline md:inline">All destinations →</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {destinations.map((d) => (
            <Link key={d.slug} to="/destinations/$state" params={{ state: d.slug }} className="group relative block overflow-hidden rounded-xl">
              <img src={images[d.image].src} alt={images[d.image].alt} loading="lazy" width={1600} height={1008} className="aspect-[16/11] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-scrim" />
              <div className="absolute bottom-0 p-7 text-primary-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">{d.focus}</p>
                <h3 className="mt-1 text-4xl">{d.name}</h3>
                <p className="mt-2 text-sm text-primary-foreground/85">{d.towns.map((t) => t.name).join(" · ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-24 bg-secondary/60 py-20">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="eyebrow">More than just pet-friendly</p>
            <h2 className="mt-2 text-4xl leading-tight">"Pet-friendly" is one checkbox. Your dog needs more than that.</h2>
            <p className="mt-5 text-muted-foreground">Most travel sites stop at "pets allowed." We record the details that decide whether a stay actually works: whether the fence goes all the way around, how the pet fee is charged, weight and breed limits, and how many dogs are welcome. If a detail isn't confirmed, we say so instead of guessing.</p>
            <Link to="/editorial-standards" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">How we verify stays <ArrowRight className="size-4" /></Link>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ["Fence, in detail", "Fully fenced, partly fenced or none, plus height and gate notes."],
              ["Fees, decoded", "Per stay, per night or per dog: we record which."],
              ["Size and breed", "Weight limits and breed rules stated plainly."],
              ["Unknown means unknown", "Anything unconfirmed is marked \"not confirmed\"."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-lg bg-background p-5 shadow-card"><dt className="font-display text-lg">{t}</dt><dd className="mt-1 text-sm text-muted-foreground">{d}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page mt-24">
        <div className="flex items-end justify-between"><div><p className="eyebrow">Stays</p><h2 className="mt-2 text-3xl md:text-4xl">Featured stays</h2></div></div>
        {stays.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">{stays.map((s) => <StayCard key={s.slug} stay={s} />)}</div>
        ) : (
          <div className="mt-8 grid gap-6 rounded-xl border border-border bg-card p-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h3 className="text-2xl">We're verifying our first stays one by one.</h3>
              <p className="mt-2 text-muted-foreground">Every listing we publish has its pet policy, fees and fencing confirmed with the host. Until the first ones are ready, our guides and tools will help you vet any rental yourself.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/tools/host-questions" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Ask a host the right questions</Link>
              <Link to="/list-your-property" className="rounded-full border border-input px-5 py-2.5 text-sm font-medium">List your property</Link>
            </div>
          </div>
        )}
      </section>

      <section className="container-page mt-24">
        <h2 className="text-3xl md:text-4xl">Browse by must-have</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {mustHaves.map((m) => (
            <Link key={m.key} to="/stays" search={(p) => ({ ...p, [m.key]: true })} className="group rounded-lg border border-border bg-card p-6 transition hover:border-primary">
              <m.icon className="size-7 text-terracotta" />
              <p className="mt-4 font-display text-xl group-hover:text-primary">{m.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-24">
        <div className="flex items-end justify-between"><div><p className="eyebrow">Guides</p><h2 className="mt-2 text-3xl md:text-4xl">Read before you book</h2></div><Link to="/guides" className="text-sm font-medium text-primary hover:underline">All guides →</Link></div>
        {featuredGuides[0] && <div className="mt-8"><GuideCard guide={featuredGuides[0]} variant="wide" /></div>}
        <div className="mt-12 grid gap-8 md:grid-cols-3">{featuredGuides.slice(1).map((g) => <GuideCard key={g.slug} guide={g} />)}</div>
      </section>

      <section className="container-page mt-24">
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">Free planning tools</p>
          <h2 className="mt-2 max-w-2xl text-4xl">Tools that do the awkward part of booking for you</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              { to: "/tools/host-questions", icon: MessageSquareText, t: "Host question generator", d: "A ready-to-send message built around your dog." },
              { to: "/tools/cost-calculator", icon: Calculator, t: "True cost calculator", d: "Compare totals with pet fees, cleaning and tax." },
              { to: "/tools/checklist", icon: ListChecks, t: "Before-you-book checklist", d: "Tick it off, save it, print it." },
              { to: "/tools/compare", icon: ShieldCheck, t: "Compare stays", d: "Verified details side by side." },
            ].map((t) => (
              <Link key={t.to} to={t.to} className="rounded-lg bg-primary-foreground/10 p-5 transition hover:bg-primary-foreground/15">
                <t.icon className="size-6 text-terracotta" />
                <p className="mt-3 font-display text-lg">{t.t}</p>
                <p className="mt-1 text-sm text-primary-foreground/75">{t.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      <section className="container-page mt-24">
        <div className="grid items-center gap-8 rounded-xl border border-border p-8 md:grid-cols-[1.5fr_1fr] md:p-12">
          <div>
            <p className="eyebrow">For hosts</p>
            <h2 className="mt-2 text-3xl">Run a genuinely dog-friendly stay?</h2>
            <p className="mt-2 text-muted-foreground">We list properties whose pet policies we can verify. There's no cost to be considered.</p>
          </div>
          <div className="md:text-right"><Link to="/list-your-property" className="inline-flex rounded-full bg-terracotta px-6 py-3 font-medium text-terracotta-foreground">List your property</Link></div>
        </div>
      </section>
    </>
  );
}
