import { useEffect, useMemo, useState } from "react";
import { evaluate, summarize, type BreedChoice, type Status } from "@/lib/dog-accepted";
import { dataDate } from "@/content/manager-policies";
import { regionsOf } from "@/lib/policy-stats";
import { trackTool, trackToolOnce } from "@/lib/analytics";

const TOOL = "dog-accepted";
const breeds: { v: BreedChoice; l: string }[] = [
  { v: "none", l: "None of these" },
  { v: "pit", l: "Pit bull type (including Staffordshire and similar mixes)" },
  { v: "rottweiler", l: "Rottweiler" },
  { v: "doberman", l: "Doberman" },
  { v: "shepherd", l: "German shepherd" },
  {
    v: "other",
    l: "Another breed that some insurers restrict (for example Chow, Akita, Husky, Great Dane)",
  },
];
const labels: Record<Status, string> = {
  fits: "No conflict found",
  ask: "Ask first",
  conflict: "Likely a problem",
};
const tone: Record<Status, string> = {
  fits: "border-green-600/40 bg-green-50 text-green-900",
  ask: "border-amber-500/50 bg-amber-50 text-amber-900",
  conflict: "border-red-500/40 bg-red-50 text-red-900",
};

export function DogAcceptedChecker() {
  const [dogs, setDogs] = useState(2);
  const [weights, setWeights] = useState<string[]>(["", "", "", ""]);
  const [breed, setBreed] = useState<BreedChoice>("none");
  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [region, setRegion] = useState("all");
  const [copied, setCopied] = useState(false);

  // Restore a shared link: ?dogs=2&w=60,45&breed=pit
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const d = Number(q.get("dogs"));
      if (d >= 1 && d <= 4) {
        setDogs(d);
        const ws = (q.get("w") ?? "").split(",").slice(0, 4);
        setWeights([0, 1, 2, 3].map((i) => (/^\d{1,3}$/.test(ws[i] ?? "") ? ws[i]! : "")));
        const b = q.get("breed") as BreedChoice | null;
        if (b && breeds.some((x) => x.v === b)) setBreed(b);
        setSubmitted(true);
      }
    } catch {
      /* ignore a bad link */
    }
  }, []);

  const results = useMemo(
    () =>
      evaluate({
        dogs,
        weights: weights.slice(0, dogs).map((w) => (w.trim() === "" ? null : Number(w))),
        breed,
      }),
    [dogs, weights, breed],
  );
  const sum = summarize(results);
  const shown = results
    .filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (region === "all" || r.policy.region === region),
    )
    .sort(
      (a, b) =>
        ["fits", "ask", "conflict"].indexOf(a.status) -
        ["fits", "ask", "conflict"].indexOf(b.status),
    );

  function touch() {
    trackToolOnce("tool_start", { tool: TOOL });
    setSubmitted(false);
  }
  function check() {
    setSubmitted(true);
    trackTool("tool_complete", { tool: TOOL, label: `dogs=${dogs}`, count: sum.fits });
    try {
      const q = new URLSearchParams({
        dogs: String(dogs),
        w: weights
          .slice(0, dogs)
          .map((w) => (/^\d{1,3}$/.test(w) ? w : ""))
          .join(","),
        breed,
      });
      window.history.replaceState(null, "", `${window.location.pathname}?${q.toString()}`);
    } catch {
      /* history blocked */
    }
  }
  async function copyResults() {
    const lines = shown.map(
      (r) =>
        `${labels[r.status]}: ${r.policy.name} (${r.policy.place}). ${r.reasons[0] ?? ""} Fee: ${r.policy.fee}. ${r.policy.url}`,
    );
    const text = `Will my dog be accepted? ${dogs} dog${dogs === 1 ? "" : "s"}, checked ${dataDate} against ${sum.total} managers' own pet pages (a sample; confirm with the host)\n\n${lines.join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
    trackTool("tool_copy", { tool: TOOL, count: shown.length });
  }
  function printResults() {
    trackTool("tool_print", { tool: TOOL, count: shown.length });
    window.print();
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
        className="max-w-2xl space-y-6 rounded-xl border bg-card p-6 shadow-card"
      >
        <fieldset>
          <legend className="font-medium">How many dogs are coming?</legend>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={dogs === n}
                onClick={() => {
                  setDogs(n);
                  touch();
                }}
                className={`size-11 rounded-full border text-sm ${dogs === n ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-muted"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-medium">Weight of each dog in pounds (optional)</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {Array.from({ length: dogs }).map((_, i) => (
              <label key={i} className="text-sm">
                Dog {i + 1}
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={250}
                  value={weights[i]}
                  onChange={(e) => {
                    const next = [...weights];
                    next[i] = e.target.value;
                    setWeights(next);
                    touch();
                  }}
                  className="mt-1 block h-11 w-28 rounded-md border border-input bg-background px-3"
                />
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="font-medium">Is one of your dogs any of these?</span>
          <select
            value={breed}
            onChange={(e) => {
              setBreed(e.target.value as BreedChoice);
              touch();
            }}
            className="mt-2 block h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {breeds.map((b) => (
              <option key={b.v} value={b.v}>
                {b.l}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-muted-foreground">
            Nothing you enter leaves your browser. We only count the tool being used.
          </span>
        </label>
        <button className="h-12 rounded-xl bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90">
          Check these managers
        </button>
      </form>

      {submitted && (
        <section className="mt-10" aria-live="polite">
          <h2 className="text-2xl">
            Of {sum.total} rental managers, {sum.fits} show no conflict for{" "}
            {dogs === 1 ? "your dog" : `your ${dogs} dogs`}
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            {sum.ask} need a question first, and {sum.conflict} look like a problem. This is based
            on what each manager's own pet page said on {dataDate}. Many managers set rules per
            home, so confirm your exact home in writing before you pay.
          </p>
          <div role="group" aria-label="Filter results" className="mt-4 flex flex-wrap gap-2">
            {(["all", "fits", "ask", "conflict"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-1.5 text-sm ${filter === f ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-muted"}`}
              >
                {f === "all" ? "All" : labels[f]}
              </button>
            ))}
          </div>
          <div className="no-print mt-4 flex flex-wrap items-center gap-3">
            <label className="text-sm">
              Region
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="ml-2 h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All regions</option>
                {regionsOf().map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={copyResults}
              className="h-10 rounded-lg border border-input bg-background px-4 text-sm hover:bg-muted"
            >
              {copied ? "Copied" : "Copy results"}
            </button>
            <button
              type="button"
              onClick={printResults}
              className="h-10 rounded-lg border border-input bg-background px-4 text-sm hover:bg-muted"
            >
              Print
            </button>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {shown.map((r) => (
              <li key={r.policy.name} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{r.policy.name}</p>
                    <p className="text-sm text-muted-foreground">{r.policy.place}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${tone[r.status]}`}
                  >
                    {labels[r.status]}
                  </span>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                  {r.reasons.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  Pet fee as stated: {r.policy.fee}
                </p>
                <a
                  href={r.policy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackTool("rules_source_click", { tool: TOOL, label: "manager_policy" })
                  }
                  className="mt-2 inline-block text-sm text-primary underline"
                >
                  Read their pet policy
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-sm text-muted-foreground">
            A convenience sample, not every manager: sites that refused automated reading were
            skipped, and policies change. A blank rule means the page we read did not say, not that
            there is none.
          </p>
        </section>
      )}
    </div>
  );
}
