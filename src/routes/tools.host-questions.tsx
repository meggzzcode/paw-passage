import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Mail } from "lucide-react";
import { buildHostQuestions, type DogProfile } from "@/lib/host-questions";
import { ToolShell } from "@/components/site/ToolShell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/host-questions")({
  head: () => pageHead({ title: "Host question generator for dog-friendly rentals", description: "Tell us about your dog and get a ready-to-send message for a vacation rental host, covering fences, fees, size limits and the photos to ask for.", path: "/tools/host-questions" }),
  component: HostQuestionsPage,
});

const needLabels: [keyof DogProfile["needs"], string][] = [
  ["fencedYard", "I need a securely fenced yard"],
  ["jumper", "My dog can jump or climb fences"],
  ["digger", "My dog digs"],
  ["pool", "There's a pool or hot tub"],
  ["crate", "We'll use a crate"],
  ["leftAlone", "We may need to leave the dog alone sometimes"],
  ["furniture", "My dog sleeps on the bed or sofa"],
  ["stairsHard", "Stairs are hard for my dog"],
  ["reactive", "My dog is reactive to other dogs or people"],
  ["beach", "We want beach access"],
];

function HostQuestionsPage() {
  const [p, setP] = useState<DogProfile>({ dogName: "", dogs: 1, size: "medium", breed: "", needs: { fencedYard: true, jumper: false, digger: false, pool: false, crate: false, leftAlone: false, furniture: false, stairsHard: false, reactive: false, beach: false } });
  const [stayName, setStayName] = useState("");
  const [copied, setCopied] = useState(false);
  const result = buildHostQuestions(p, stayName);

  async function copy() {
    await navigator.clipboard.writeText(result.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ToolShell title="Host question generator" intro="Answer a few questions about your dog and get a clear, friendly message to send a host before you book. It runs in your browser and nothing is stored." guides={[{ slug: "vacation-rental-secure-fenced-yard", label: "How to find a rental with a truly secure fenced yard" }, { slug: "how-vacation-rental-pet-fees-work", label: "How pet fees actually work" }]}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm"><span className="font-semibold">Dog's name (optional)</span><input value={p.dogName} onChange={(e) => setP({ ...p, dogName: e.target.value })} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3" /></label>
            <label className="block text-sm"><span className="font-semibold">Breed or mix (optional)</span><input value={p.breed} onChange={(e) => setP({ ...p, breed: e.target.value })} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3" /></label>
            <label className="block text-sm"><span className="font-semibold">Number of dogs</span>
              <select value={p.dogs} onChange={(e) => setP({ ...p, dogs: Number(e.target.value) })} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3">{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}</select>
            </label>
            <label className="block text-sm"><span className="font-semibold">Size</span>
              <select value={p.size} onChange={(e) => setP({ ...p, size: e.target.value as DogProfile["size"] })} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3">
                <option value="small">Small (under ~25 lb)</option><option value="medium">Medium</option><option value="large">Large</option><option value="giant">Giant breed</option>
              </select>
            </label>
          </div>
          <label className="block text-sm"><span className="font-semibold">Property name (optional)</span><input value={stayName} onChange={(e) => setStayName(e.target.value)} placeholder="e.g. Laurel Creek Cabin" className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3" /></label>
          <fieldset>
            <legend className="text-sm font-semibold">What applies to your trip?</legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {needLabels.map(([k, label]) => (
                <label key={k} className="flex items-start gap-2.5 rounded-md border border-border bg-card p-3 text-sm">
                  <input type="checkbox" checked={p.needs[k]} onChange={(e) => setP({ ...p, needs: { ...p.needs, [k]: e.target.checked } })} className="mt-0.5 size-4 accent-[var(--primary)]" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </form>
        <section aria-live="polite" className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl">Your message ({result.questions.length} questions)</h2>
            <div className="flex gap-2">
              <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? "Copied" : "Copy"}</button>
              <a href={`mailto:?subject=${encodeURIComponent("Questions before booking")}&body=${encodeURIComponent(result.message)}`} className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm"><Mail className="size-4" /> Email it</a>
            </div>
          </div>
          <pre className="mt-5 whitespace-pre-wrap rounded-lg bg-muted p-5 font-sans text-sm leading-relaxed">{result.message}</pre>
        </section>
      </div>
    </ToolShell>
  );
}
