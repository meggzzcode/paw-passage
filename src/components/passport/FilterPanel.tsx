import { useId, useState } from "react";
import type { SessionFilters } from "@/passport/profile";
import { ACTIVITY_TYPES, PLACES, SEASONS, SUPPLY_KEYS } from "@/passport/schema";
import { describeFilters } from "@/passport/engine";
import { Choice, MultiChoice } from "./ProfileEditor";
import {
  ACTIVITY_LABELS,
  PLACE_LABELS,
  QUICK_PICKS,
  QUICK_PICK_LABELS,
  SEASON_LABELS,
  SUPPLY_LABELS,
  type QuickPick,
} from "./labels";

const BOOL_PICKS = ["chair", "quick", "quiet", "noYard", "puppy", "highEnergy"] as const;

/** Which quick-pick chips are on, read from the filters. */
function picksOf(f: SessionFilters): QuickPick[] {
  return [...BOOL_PICKS.filter((k) => f[k] === true), ...(f.household ?? [])] as QuickPick[];
}

/** Writes the chosen quick picks back into the filters. */
function withPicks(f: SessionFilters, picks: QuickPick[]): SessionFilters {
  let next = f;
  for (const k of BOOL_PICKS) next = set(next, k, picks.includes(k) ? true : undefined);
  const household = picks.filter(
    (p): p is "two-dogs" | "family" => p === "two-dogs" || p === "family",
  );
  return set(next, "household", household);
}

/** Returns the filters with one field changed or cleared (undefined = no preference). */
function set<K extends keyof SessionFilters>(
  f: SessionFilters,
  key: K,
  value: SessionFilters[K] | undefined,
): SessionFilters {
  const next = { ...f };
  const empty = value === undefined || (Array.isArray(value) && value.length === 0);
  if (empty) delete next[key];
  else next[key] = value as SessionFilters[K];
  return next;
}

const ANY = { value: undefined, label: "Any" } as const;

export function FilterPanel({
  filters,
  onChange,
  onSaveSmart,
}: {
  filters: SessionFilters;
  onChange: (f: SessionFilters) => void;
  onSaveSmart?: ((name: string, f: SessionFilters) => void) | undefined;
}) {
  const [more, setMore] = useState(false);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState("");
  const moreId = useId();
  const active = describeFilters(filters);

  return (
    <section className="pa-panel pd-filters" aria-label="Filters">
      <Choice
        legend="How long do you have"
        options={[
          ANY,
          { value: 15, label: "Up to 15 min" },
          { value: 30, label: "Up to 30 min" },
          { value: 60, label: "Up to an hour" },
          { value: 120, label: "Up to 2 hours" },
        ]}
        value={filters.minutes}
        onChange={(v) => onChange(set(filters, "minutes", v))}
      />
      <Choice
        legend="Budget"
        options={[
          ANY,
          { value: 0, label: "Free" },
          { value: 15, label: "Up to $15" },
          { value: 40, label: "Up to $40" },
        ]}
        value={filters.budget}
        onChange={(v) => onChange(set(filters, "budget", v))}
      />
      <Choice
        legend="Indoors or outdoors"
        options={[
          ANY,
          { value: "indoor", label: "Indoors" },
          { value: "outdoor", label: "Outdoors" },
        ]}
        value={filters.setting}
        onChange={(v) => onChange(set(filters, "setting", v))}
      />
      <MultiChoice
        legend="Kinds of adventure"
        options={ACTIVITY_TYPES.map((v) => ({ value: v, label: ACTIVITY_LABELS[v] }))}
        values={filters.types}
        onChange={(v) => onChange(set(filters, "types", v))}
      />
      <MultiChoice
        legend="Physical effort"
        options={[
          { value: "gentle", label: "Gentle" },
          { value: "moderate", label: "Moderate" },
          { value: "lively", label: "Lively" },
        ]}
        values={filters.energy}
        onChange={(v) => onChange(set(filters, "energy", v))}
      />

      <MultiChoice
        legend="Quick picks"
        options={QUICK_PICKS.map((v) => ({ value: v, label: QUICK_PICK_LABELS[v] }))}
        values={picksOf(filters)}
        onChange={(v) => onChange(withPicks(filters, v))}
      />

      <button
        type="button"
        className="pp-btn pp-btn-secondary"
        aria-expanded={more}
        aria-controls={moreId}
        onClick={() => setMore((v) => !v)}
      >
        {more ? "Fewer filters" : "More filters"}
      </button>
      {more && (
        <div id={moreId} className="pd-more">
          <Choice
            legend="Preparation"
            options={[
              ANY,
              { value: "none", label: "None" },
              { value: "light", label: "A little" },
              { value: "some", label: "Some is fine" },
            ]}
            value={filters.prep}
            onChange={(v) => onChange(set(filters, "prep", v))}
          />
          <MultiChoice
            legend="Supplies I have"
            hint="Only shows adventures that need nothing else."
            options={SUPPLY_KEYS.map((v) => ({ value: v, label: SUPPLY_LABELS[v] }))}
            values={filters.haveSupplies}
            onChange={(v) => onChange(set(filters, "haveSupplies", v))}
          />
          <Choice
            legend="Getting there"
            options={[ANY, { value: "none-or-walk", label: "No car needed" }]}
            value={filters.transport === "none-or-walk" ? "none-or-walk" : undefined}
            onChange={(v) => onChange(set(filters, "transport", v))}
          />
          <MultiChoice
            legend="Place"
            options={PLACES.map((v) => ({ value: v, label: PLACE_LABELS[v] }))}
            values={filters.places}
            onChange={(v) => onChange(set(filters, "places", v))}
          />
          <Choice
            legend="Season"
            options={[ANY, ...SEASONS.map((v) => ({ value: v, label: SEASON_LABELS[v] }))]}
            value={filters.season}
            onChange={(v) => onChange(set(filters, "season", v))}
          />
          <Choice
            legend="Weather today"
            options={[
              ANY,
              { value: "rain", label: "Rainy" },
              { value: "heat", label: "Hot" },
              { value: "cold", label: "Cold" },
            ]}
            value={filters.weather}
            onChange={(v) => onChange(set(filters, "weather", v))}
          />
          <Choice
            legend="Food"
            options={[ANY, { value: true, label: "Food-free only" }]}
            value={filters.foodFree ? true : undefined}
            onChange={(v) => onChange(set(filters, "foodFree", v))}
          />
          <Choice
            legend="Noise"
            options={[ANY, { value: true, label: "Quiet only" }]}
            value={filters.quiet ? true : undefined}
            onChange={(v) => onChange(set(filters, "quiet", v))}
          />
          <Choice
            legend="New or done"
            options={[
              ANY,
              { value: "new-only", label: "New to us" },
              { value: "done-only", label: "Already done" },
            ]}
            value={filters.novelty === "any" ? undefined : filters.novelty}
            onChange={(v) => onChange(set(filters, "novelty", v))}
          />
          <Choice
            legend="Favorites"
            options={[ANY, { value: true, label: "Favorites only" }]}
            value={filters.favoritesOnly ? true : undefined}
            onChange={(v) => onChange(set(filters, "favoritesOnly", v))}
          />
        </div>
      )}

      <div className="pa-row">
        <button
          type="button"
          className="pp-btn pp-btn-ghost"
          disabled={active.length === 0}
          onClick={() => {
            onChange({});
            setSaved("");
          }}
        >
          Reset filters
        </button>
        {onSaveSmart && active.length > 0 && !naming && (
          <button type="button" className="pp-btn pp-btn-secondary" onClick={() => setNaming(true)}>
            Save these filters as a smart collection
          </button>
        )}
      </div>
      {active.length > 0 && <p className="pa-fine">Showing: {active.join(", ")}.</p>}
      {naming && onSaveSmart && (
        <form
          className="pa-row"
          onSubmit={(e) => {
            e.preventDefault();
            const clean = name.trim().slice(0, 60);
            if (!clean) return;
            onSaveSmart(clean, filters);
            setSaved(`Saved “${clean}” to My Collections.`);
            setName("");
            setNaming(false);
          }}
        >
          <label className="pa-field pd-grow">
            <span>Name this smart collection</span>
            <input
              value={name}
              maxLength={60}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button type="submit" className="pp-btn pp-btn-primary" disabled={!name.trim()}>
            Save collection
          </button>
          <button type="button" className="pp-btn pp-btn-ghost" onClick={() => setNaming(false)}>
            Cancel
          </button>
        </form>
      )}
      <p className="pa-fine" role="status">
        {saved}
      </p>
    </section>
  );
}
