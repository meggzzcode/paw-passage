import { createFileRoute, Link, useNavigate, stripSearchParams } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { visibleStays } from "@/content/stays";
import { townName } from "@/content/destinations";
import { stayTypeLabels } from "@/lib/filters";
import { describeFee, yesNo } from "@/lib/stay-format";
import type { Stay } from "@/content/stays/types";
import { ToolShell } from "@/components/site/ToolShell";
import { PreviewBadge } from "@/components/site/StatusBadge";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/compare")({
  validateSearch: zodValidator(z.object({ ids: fallback(z.string(), "").default("") })),
  // Keep the bare /tools/compare URL clean (no redirect to ?ids=).
  search: { middlewares: [stripSearchParams({ ids: "" })] },
  head: ({ match }) => pageHead({ title: "Compare dog-friendly stays side by side", description: "Compare verified dog-friendly stays by dog limits, pet fees, fencing, breed rules and outdoor space.", path: "/tools/compare", noindex: !!match.search.ids }),
  component: ComparePage,
});

const rows: [string, (s: Stay) => string][] = [
  ["Type", (s) => stayTypeLabels[s.type]],
  ["Town", (s) => townName(s.town)],
  ["Dogs allowed", (s) => (s.maxDogs === null ? "Not confirmed" : `Up to ${s.maxDogs}`)],
  ["Large dogs", (s) => yesNo(s.largeDogsOk)],
  ["Weight limit", (s) => (s.weightLimitLbs ? `${s.weightLimitLbs} lb` : s.largeDogsOk ? "None stated" : "Not confirmed")],
  ["Breed restrictions", (s) => (s.breedRestrictions === null ? "Not confirmed" : s.breedRestrictions ? "Yes" : "None stated")],
  ["Pet fee", (s) => describeFee(s.petFee)],
  ["Fenced yard", (s) => (s.fencedYard === null ? "Not confirmed" : { full: "Fully fenced", partial: "Partly fenced", none: "None" }[s.fencedYard])],
  ["Private outdoor space", (s) => yesNo(s.privateOutdoor)],
  ["Beach", (s) => (s.beach ? "Yes" : "No")],
  ["Hot tub", (s) => yesNo(s.hotTub)],
  ["Last verified", (s) => s.lastVerified ?? "Not yet"],
];

function ComparePage() {
  const { ids } = Route.useSearch();
  const navigate = useNavigate({ from: "/tools/compare" });
  const all = visibleStays();
  const selected = ids.split(",").filter(Boolean).slice(0, 4);
  const chosen = selected.map((id) => all.find((s) => s.slug === id)).filter((s): s is Stay => !!s);
  const toggle = (slug: string) => {
    const next = selected.includes(slug) ? selected.filter((x) => x !== slug) : [...selected, slug].slice(0, 4);
    navigate({ search: { ids: next.join(",") }, replace: true });
  };
  return (
    <ToolShell title="Compare stays" intro="Pick up to four stays to see their pet policies side by side. Anything we haven't confirmed shows as not confirmed. We never guess." guides={[{ slug: "pet-friendly-vacation-rental-checklist", label: "What to check before booking" }]}>
      {all.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8">
          <h2 className="text-2xl">Nothing to compare yet</h2>
          <p className="mt-2 text-muted-foreground">We publish stays only after verifying them, and the first ones are still being checked. In the meantime, the <Link to="/tools/cost-calculator" className="text-primary underline">trip cost calculator</Link> lets you compare any listings you've found yourself.</p>
        </div>
      ) : (
        <>
          <fieldset>
            <legend className="text-sm font-semibold">Choose stays ({chosen.length}/4)</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {all.map((s) => (
                <button key={s.slug} type="button" aria-pressed={selected.includes(s.slug)} onClick={() => toggle(s.slug)} className={`rounded-full border px-4 py-2 text-sm ${selected.includes(s.slug) ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>{s.name}</button>
              ))}
            </div>
          </fieldset>
          {chosen.length > 0 && (
            <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="w-44 p-4 text-left font-normal text-muted-foreground" />
                    {chosen.map((s) => <th key={s.slug} className="p-4 text-left align-top"><Link to="/stays/$slug" params={{ slug: s.slug }} className="font-display text-lg hover:text-primary">{s.name}</Link>{s.status === "sample" && <div className="mt-1"><PreviewBadge>Sample</PreviewBadge></div>}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, fn]) => (
                    <tr key={label} className="border-b border-border last:border-0">
                      <th scope="row" className="p-4 text-left font-medium text-muted-foreground">{label}</th>
                      {chosen.map((s) => { const v = fn(s); return <td key={s.slug} className={`p-4 ${v === "Not confirmed" ? "italic text-muted-foreground" : ""}`}>{v}</td>; })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </ToolShell>
  );
}
