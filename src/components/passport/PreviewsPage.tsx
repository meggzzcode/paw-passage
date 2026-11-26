// The public previews showcase. Anyone can browse it: no quiz, no account, no purchase. The page says plainly that
// these are selected previews from a larger collection, using the verified totals from the API (or plain wording when
// they cannot be loaded). Saving a preview is local to this device.
import { useEffect, useMemo, useState } from "react";
import { AppLink } from "@/components/shell/AppLink";
import { Container } from "@/components/shell/Container";
import { usePreviews } from "@/lib/usePreviews";
import {
  filterPreviews,
  premiumPreviews,
  ROLE_LABELS,
  savedIdCount,
  savedPreviews,
  type PreviewFilters,
} from "@/passport/preview-view";
import { useEntitlement } from "@/passport/useEntitlement";
import { usePassport } from "@/passport/usePassport";
import { hasProfile } from "./ProfileEditor";
import { PreviewCard } from "./PreviewCard";
import { PreviewMatch } from "./PreviewMatch";
import { flow } from "./flow-events";

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly [string, string][];
}) {
  return (
    <label className="pa-field pv-select">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

const ANY: [string, string] = ["", "Any"];

export function PreviewsPage() {
  const { ready, save, profile } = usePassport();
  const { status: entitlement } = useEntitlement();
  const { status, data } = usePreviews();
  const [view, setView] = useState<"all" | "saved">("all");
  const [f, setF] = useState<PreviewFilters>({});
  const items = useMemo(() => premiumPreviews(data?.items ?? []), [data]);

  useEffect(() => {
    if (status === "ready") flow("preview_viewed", { count: items.length });
  }, [status, items.length]);

  const saved = ready ? savedPreviews(items, save) : [];
  const shown = filterPreviews(view === "saved" ? saved : items, f);
  const set = <K extends keyof PreviewFilters>(k: K, v: PreviewFilters[K] | undefined) =>
    setF((cur) => {
      const next = { ...cur };
      if (v === undefined) delete next[k];
      else next[k] = v;
      return next;
    });

  const total = data?.total ?? 0;
  const collections = data?.collections ?? 0;
  const intro =
    status === "ready" && items.length > 0 && total > 0
      ? `${items.length} hand-picked previews from a larger collection of ${total} adventures${
          collections > 0 ? ` across ${collections} collections` : ""
        }.`
      : "A hand-picked selection from a larger collection of adventures.";

  return (
    <Container>
      <div className="pa-page pd-page">
        <p className="pa-kicker">Selected previews</p>
        <h1 className="pa-h1">A peek at the full Passport</h1>
        <p className="pa-sub">
          {intro} These are previews only: each shows what to expect, and the full instructions are
          part of the full Passport. You can browse and save favorites without an account.
        </p>
        {entitlement === "entitled" && (
          <p className="pa-fine" role="status">
            You have the full Passport.{" "}
            <AppLink to="/discover" className="pa-linkbtn">
              Find an adventure
            </AppLink>
          </p>
        )}

        {status === "loading" && <p aria-busy="true">Loading previews...</p>}
        {status === "unavailable" && (
          <div className="pa-card" role="status">
            <p>The previews could not be loaded just now. Please try again in a little while.</p>
            {ready && savedIdCount(save) > 0 && (
              <p className="pa-fine">
                {savedIdCount(save)} saved on this device. They are still here.
              </p>
            )}
            <div className="pa-row">
              <AppLink to="/discover" className="pp-btn pp-btn-secondary">
                Find our free first adventure
              </AppLink>
            </div>
          </div>
        )}

        {status === "ready" && items.length === 0 && (
          <div className="pa-card" role="status">
            <p>There are no previews to show yet.</p>
          </div>
        )}

        {status === "ready" && items.length > 0 && (
          <>
            <div className="pv-views" role="group" aria-label="Show">
              <button
                type="button"
                className="pa-chip"
                aria-pressed={view === "all"}
                onClick={() => setView("all")}
              >
                All previews ({items.length})
              </button>
              <button
                type="button"
                className="pa-chip"
                aria-pressed={view === "saved"}
                onClick={() => setView("saved")}
              >
                Saved ({saved.length})
              </button>
            </div>

            <section className="pa-panel pv-filters" aria-label="Filter previews">
              <Select
                label="Time"
                value={f.time ? String(f.time) : ""}
                onChange={(v) => set("time", v ? (Number(v) as 15 | 30 | 60) : undefined)}
                options={[
                  ANY,
                  ["15", "Up to 15 min"],
                  ["30", "Up to 30 min"],
                  ["60", "Up to an hour"],
                ]}
              />
              <Select
                label="Budget"
                value={f.budget ? String(f.budget) : ""}
                onChange={(v) => set("budget", v === "free" ? "free" : v === "20" ? 20 : undefined)}
                options={[ANY, ["free", "No spending"], ["20", "Up to $20"]]}
              />
              <Select
                label="Setting"
                value={f.setting ?? ""}
                onChange={(v) => set("setting", v === "indoor" || v === "outdoor" ? v : undefined)}
                options={[ANY, ["indoor", "Indoors"], ["outdoor", "Outdoors"]]}
              />
              <Select
                label="Life stage"
                value={f.lifeStage ?? ""}
                onChange={(v) =>
                  set("lifeStage", v === "puppy" || v === "adult" || v === "senior" ? v : undefined)
                }
                options={[ANY, ["puppy", "Puppy"], ["adult", "Adult"], ["senior", "Senior"]]}
              />
              <Select
                label="Kind of adventure"
                value={f.role ?? ""}
                onChange={(v) => set("role", v || undefined)}
                options={[
                  ANY,
                  ...Object.entries(ROLE_LABELS).filter(([r]) => items.some((i) => i.role === r)),
                ]}
              />
            </section>

            {view === "saved" && saved.length === 0 && (
              <p className="pa-fine" role="status">
                You have not saved any previews yet. Use "Save for later" on a card.
              </p>
            )}
            {shown.length === 0 && (view === "all" || saved.length > 0) && (
              <p className="pa-fine" role="status">
                No previews match those filters. Try loosening one.
              </p>
            )}
            <ul className="pa-grid pv-grid" aria-label="Previews">
              {shown.map((i) => (
                <PreviewCard key={i.id} item={i} />
              ))}
            </ul>
            <p className="pa-fine" role="status">
              Showing {shown.length} of {view === "saved" ? saved.length : items.length}
              {view === "saved" ? " saved" : ""} previews.
            </p>

            {ready && !hasProfile(profile) && (
              <p className="pa-fine">
                Want a count of what suits your dog?{" "}
                <AppLink to="/discover" className="pa-linkbtn">
                  Answer a few questions
                </AppLink>{" "}
                first.
              </p>
            )}
            <PreviewMatch items={items} hasIntro={!!save.starter} />

            {entitlement !== "entitled" && (
              <aside className="pa-panel" aria-labelledby="pv-buy-h">
                <h2 className="pa-h" id="pv-buy-h">
                  {saved.length > 0
                    ? `You have saved ${saved.length} ${saved.length === 1 ? "preview" : "previews"}`
                    : "Like what you see?"}
                </h2>
                <p>
                  {saved.length > 0
                    ? "They stay saved on this device, and they are still here if you get the full Passport. "
                    : "The full Passport opens every adventure's instructions. "}
                  One-time purchase, no subscription, no account.
                </p>
                <div className="pa-row">
                  <AppLink
                    to="/unlock"
                    className="pp-btn pp-btn-primary"
                    onClick={() => flow("purchase_cta_clicked", { where: "previews" })}
                  >
                    See the full Passport
                  </AppLink>
                  <AppLink to="/discover" className="pp-btn pp-btn-ghost">
                    Find our free first adventure
                  </AppLink>
                </div>
              </aside>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
