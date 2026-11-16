import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { computeCost, type CostInput } from "@/lib/cost";
import type { FeeBasis } from "@/content/stays/types";
import { ToolShell } from "@/components/site/ToolShell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/cost-calculator")({
  head: () => pageHead({ title: "Pet fee & trip cost calculator for vacation rentals", description: "Compare the real total of up to three dog-friendly stays: nightly rate, per-dog or per-night pet fees, cleaning, other fees, tax and refundable deposits.", path: "/tools/cost-calculator" }),
  component: CostPage,
});

const blank = (label: string): CostInput => ({ label, nightly: 0, nights: 3, cleaning: 0, otherFees: 0, petFee: 0, petFeeBasis: "stay", dogs: 1, taxPct: 0, deposit: 0 });
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

function NumField({ label, value, onChange, step = 1, suffix }: { label: string; value: number; onChange: (n: number) => void; step?: number; suffix?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-muted-foreground">{label}{suffix ? ` (${suffix})` : ""}</span>
      <input type="number" min={0} step={step} value={Number.isFinite(value) ? value : 0} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3" />
    </label>
  );
}

function CostPage() {
  const [stays, setStays] = useState<CostInput[]>([blank("Stay A"), blank("Stay B")]);
  const upd = (i: number, patch: Partial<CostInput>) => setStays((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const results = stays.map(computeCost);
  const cheapest = results.length > 1 && results.some((r) => r.total > 0) ? results.reduce((m, r, i) => (r.total < results[m].total ? i : m), 0) : -1;
  return (
    <ToolShell title="Pet fee & trip cost calculator" intro="Headline nightly rates hide a lot. Enter what each listing actually charges and see the real total, including pet fees that scale per dog or per night. Refundable deposits are shown separately." guides={[{ slug: "how-vacation-rental-pet-fees-work", label: "How pet fees actually work at vacation rentals" }, { slug: "traveling-with-two-dogs-accommodation-guide", label: "Traveling with two dogs" }]}>
      <div className="grid gap-6 lg:grid-cols-3">
        {stays.map((s, i) => {
          const r = results[i];
          return (
            <section key={i} className={`rounded-xl border bg-card p-6 shadow-card ${i === cheapest ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
              <div className="flex items-center gap-2">
                <input aria-label="Stay name" value={s.label} onChange={(e) => upd(i, { label: e.target.value })} className="flex-1 bg-transparent font-display text-xl outline-none" />
                {stays.length > 1 && <button type="button" aria-label={`Remove ${s.label}`} onClick={() => setStays((x) => x.filter((_, j) => j !== i))}><Trash2 className="size-4 text-muted-foreground" /></button>}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <NumField label="Nightly rate" suffix="$" value={s.nightly} onChange={(n) => upd(i, { nightly: n })} />
                <NumField label="Nights" value={s.nights} onChange={(n) => upd(i, { nights: n })} />
                <NumField label="Cleaning fee" suffix="$" value={s.cleaning} onChange={(n) => upd(i, { cleaning: n })} />
                <NumField label="Other fees" suffix="$" value={s.otherFees} onChange={(n) => upd(i, { otherFees: n })} />
                <NumField label="Pet fee" suffix="$" value={s.petFee} onChange={(n) => upd(i, { petFee: n })} />
                <label className="block text-sm"><span className="text-muted-foreground">Charged</span>
                  <select value={s.petFeeBasis} onChange={(e) => upd(i, { petFeeBasis: e.target.value as FeeBasis })} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-2">
                    <option value="stay">Per stay</option><option value="night">Per night</option><option value="dog">Per dog</option><option value="dog-night">Per dog, per night</option>
                  </select>
                </label>
                <NumField label="Dogs" value={s.dogs} onChange={(n) => upd(i, { dogs: n })} />
                <NumField label="Tax" suffix="%" step={0.1} value={s.taxPct} onChange={(n) => upd(i, { taxPct: n })} />
                <div className="col-span-2"><NumField label="Refundable deposit" suffix="$" value={s.deposit} onChange={(n) => upd(i, { deposit: n })} /></div>
              </div>
              <dl className="mt-6 space-y-1.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between"><dt>Lodging</dt><dd>{money(r.lodging)}</dd></div>
                <div className="flex justify-between"><dt>Cleaning + other</dt><dd>{money(s.cleaning + s.otherFees)}</dd></div>
                <div className="flex justify-between"><dt>Pet fees</dt><dd>{money(r.pet)}</dd></div>
                <div className="flex justify-between"><dt>Tax</dt><dd>{money(r.tax)}</dd></div>
                <div className="flex justify-between border-t border-border pt-2 font-display text-xl"><dt>Total</dt><dd>{money(r.total)}</dd></div>
                <div className="flex justify-between text-muted-foreground"><dt>Effective per night</dt><dd>{money(r.perNight)}</dd></div>
                {s.deposit > 0 && <div className="flex justify-between text-muted-foreground"><dt>Up front incl. deposit</dt><dd>{money(r.upfront)}</dd></div>}
                {r.pet > 0 && <p className="pt-2 text-xs text-muted-foreground">Pet fees are {r.petShare}% of this total.</p>}
              </dl>
              {i === cheapest && <p className="mt-3 text-sm font-semibold text-primary">Lowest total</p>}
            </section>
          );
        })}
        {stays.length < 3 && (
          <button type="button" onClick={() => setStays((s) => [...s, blank(`Stay ${String.fromCharCode(65 + s.length)}`)])} className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">
            <Plus className="size-6" /> Add a stay
          </button>
        )}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Tax is applied to lodging, cleaning and other fees. Local rules vary, so check the listing's checkout total. This is an estimate, not a quote.</p>
    </ToolShell>
  );
}
