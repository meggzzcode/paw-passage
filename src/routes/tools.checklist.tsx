import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Printer, RotateCcw } from "lucide-react";
import { checklist } from "@/content/checklist";
import { ToolShell } from "@/components/site/ToolShell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/checklist")({
  head: () => pageHead({ title: "Dog-friendly rental checklist (printable)", description: "An interactive before-you-book checklist for dog-friendly vacation rentals: pet policy, fence, house layout, local rules and packing.", path: "/tools/checklist" }),
  component: ChecklistPage,
});

const KEY = "pp-checklist-v1";

function ChecklistPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(done)); }, [done, loaded]);
  const total = checklist.reduce((n, g) => n + g.items.length, 0);
  const count = Object.values(done).filter(Boolean).length;
  return (
    <ToolShell title="Before-you-book checklist" intro="Work through this before paying for a dog-friendly stay. Your ticks are saved on this device only." guides={[{ slug: "pet-friendly-vacation-rental-checklist", label: "What to check before booking a pet-friendly rental" }, { slug: "dog-friendly-cabin-packing-list", label: "What to pack for a dog-friendly cabin" }]}>
      <div className="no-print mb-6 flex flex-wrap items-center gap-3">
        <div className="h-2 w-48 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${(count / total) * 100}%` }} /></div>
        <span className="text-sm text-muted-foreground" aria-live="polite">{count} of {total} done</span>
        <button type="button" onClick={() => window.print()} className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Printer className="size-4" /> Print</button>
        <button type="button" onClick={() => setDone({})} className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm"><RotateCcw className="size-4" /> Reset</button>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {checklist.map((g) => (
          <fieldset key={g.group} className="rounded-xl border border-border bg-card p-6">
            <legend className="px-2 font-display text-xl">{g.group}</legend>
            <ul className="mt-2 space-y-3">
              {g.items.map((it) => {
                const id = `${g.group}:${it}`;
                return (
                  <li key={id}>
                    <label className="flex cursor-pointer gap-3 text-sm">
                      <input type="checkbox" checked={!!done[id]} onChange={(e) => setDone((d) => ({ ...d, [id]: e.target.checked }))} className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]" />
                      <span className={done[id] ? "text-muted-foreground line-through" : ""}>{it}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </ToolShell>
  );
}
