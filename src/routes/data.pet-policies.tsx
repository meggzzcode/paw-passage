import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { managerPolicies, dataDate } from "@/content/manager-policies";
import { policyStats, regionsOf } from "@/lib/policy-stats";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead, jsonLd } from "@/lib/seo";

const s = policyStats();

export const Route = createFileRoute("/data/pet-policies")({
  head: () => {
    const h = pageHead({
      title: `What ${s.total} rental managers say about dogs`,
      description: `Pet policy data from ${s.total} rental managers' own pages: dog limits, weight limits, breed rules and pet fees, with a source link for each and a CSV.`,
      path: "/data/pet-policies",
    });
    return {
      ...h,
      scripts: [
        {
          type: "application/ld+json",
          children: jsonLd({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `Pet policies of ${s.total} vacation rental managers (read ${dataDate})`,
            description:
              "Dog limits, weight limits, breed rules and pet fees as stated on each manager's own public pet policy page, with the source page for each row. A convenience sample, not a survey.",
            dateModified: dataDate,
            license: "https://creativecommons.org/licenses/by/4.0/",
            creator: { "@type": "Organization", name: "Paws & Passage" },
            distribution: [
              {
                "@type": "DataDownload",
                encodingFormat: "text/csv",
                contentUrl: "/pet-policies-38-managers.csv",
              },
            ],
          }),
        },
      ],
    };
  },
  component: DataPage,
});

const breedLabel = {
  named: "Names breeds",
  unnamed: "Restricts some breeds (not named)",
  none: "Says no breed limits",
  "not-stated": "Not stated",
} as const;

function DataPage() {
  const regions = regionsOf();
  const [region, setRegion] = useState("all");
  const rows = managerPolicies.filter((p) => region === "all" || p.region === region);
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Pet policy data" }]} />
      <header className="mt-6 max-w-3xl">
        <p className="eyebrow">Original research</p>
        <h1 className="mt-2 text-4xl md:text-5xl">
          What {s.total} vacation rental managers say about dogs
        </h1>
        <p className="mt-3 text-muted-foreground">
          We read each manager's own pet policy page and wrote down what it says, with the source
          for every row. Read on {dataDate}. This is a convenience sample, not a survey of the
          market: it covers managers whose pages we could read, in the Smoky Mountains, North
          Carolina, Georgia, California, Colorado and the Florida Gulf Coast.
        </p>
        <p className="mt-4">
          <a
            href="/pet-policies-38-managers.csv"
            download
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Download the CSV
          </a>
        </p>
      </header>

      <section
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Headline numbers"
      >
        {[
          [`${s.capTwo} of ${s.total}`, "state a limit of two dogs or pets"],
          [`${s.noLimitStated} of ${s.total}`, "give no number on the page we read"],
          [`${s.zeroFee} of ${s.total}`, "charge no pet fee on the pages we read"],
          [`${s.breedSilent} of ${s.total}`, "say nothing about breed on their pet page"],
        ].map(([n, t]) => (
          <div key={t} className="rounded-xl border border-border bg-card p-5">
            <p className="font-display text-3xl">{n}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t}</p>
          </div>
        ))}
      </section>
      <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
        More: {s.capThree} set the limit at three pets; {s.weightStated} state a weight limit (35 to
        65 lb); {s.breedNamed} name breeds and {s.breedUnnamed} restrict breeds without naming them;{" "}
        {s.feeStated} state a fee amount; {s.poolStated} say something about dogs in the pool or hot
        tub; {s.minAgeStated} state a minimum dog age or no-puppies rule; {s.unattendedStated} say
        something about leaving a dog alone (most require a crate). A page that says nothing is not
        proof there is no rule: it may sit elsewhere or in the home's own listing.
      </p>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl">Every manager, with its source</h2>
          <label className="text-sm">
            Region
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="ml-2 h-10 rounded-md border border-input bg-background px-3"
            >
              <option value="all">All regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-secondary/60">
              <tr>
                {[
                  "Manager",
                  "Region",
                  "Dog or pet limit",
                  "Weight limit",
                  "Breed rule",
                  "Pet fee as stated",
                  "Also stated",
                ].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.name} className="border-t border-border align-top">
                  <td className="px-3 py-2">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      {p.name}
                    </a>
                    <div className="text-xs text-muted-foreground">{p.place}</div>
                  </td>
                  <td className="px-3 py-2">{p.region}</td>
                  <td className="px-3 py-2">
                    {p.maxDogs === null
                      ? "Not stated"
                      : `${p.maxDogs} ${p.limitBasis === "pets" ? "pets" : p.limitBasis === "most-homes" ? "(most homes)" : "dogs"}`}
                  </td>
                  <td className="px-3 py-2">
                    {p.weight
                      ? `${p.weight.lb} lb ${p.weight.per === "combined" ? "combined" : "each"}`
                      : "Not stated"}
                  </td>
                  <td className="px-3 py-2">{breedLabel[p.breed]}</td>
                  <td className="px-3 py-2">{p.fee}</td>
                  <td className="px-3 py-2 text-xs">
                    {[
                      p.pool && `Pool/hot tub: ${p.pool}`,
                      p.minAge && `Age: ${p.minAge}`,
                      p.unattended && `Alone: ${p.unattended}`,
                    ]
                      .filter(Boolean)
                      .join("; ") || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl">How we built it, and what it cannot tell you</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm">
          <li>
            We read each manager's public pet policy or FAQ page, then re-checked every figure
            against the live page. Weight limits were checked separately for the six managers that
            state one.
          </li>
          <li>
            Eleven more managers' sites refused automated reading, so they are not here. Regions are
            uneven, and managers who publish their policies are probably not typical.
          </li>
          <li>
            Many managers set rules per home. A manager's page is a starting point: confirm the
            exact home in writing before you pay.
          </li>
          <li>
            This is one snapshot. Policies and fees change, so each row links to its source and the
            whole set is re-read on a schedule.
          </li>
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Using these numbers? Please cite "Paws & Passage, pet policies of {s.total} vacation
          rental managers, read {dataDate}" and link to this page. Corrections are welcome:{" "}
          <Link to="/contact" className="text-primary underline">
            tell us
          </Link>
          .
        </p>
        <p className="mt-6 text-sm">
          Put your own dog through it:{" "}
          <Link to="/tools/will-my-dog-be-accepted" className="text-primary underline">
            Will my dog be accepted?
          </Link>
        </p>
      </section>
    </div>
  );
}
