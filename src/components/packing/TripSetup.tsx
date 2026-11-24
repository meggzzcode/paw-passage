import { useEffect, useId, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import {
  MAX_DAYS,
  MAX_DOGS,
  MAX_MEALS,
  MIN_DAYS,
  MIN_DOGS,
  clampInt,
  impliedConditions,
  type Trip,
} from "@/lib/packing/engine";
import type { PackingConfig } from "@/lib/packing/schema";
import { TRIP_ICONS, FALLBACK_ICON } from "./icons";

function Stepper({
  label,
  hint,
  value,
  min,
  max,
  noun,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  noun: string;
  onChange: (n: number) => void;
}) {
  const id = useId();
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  const commit = (raw: string | number) => {
    const n = clampInt(raw, min, max, value);
    onChange(n);
    setText(String(n));
  };
  return (
    <div>
      <label htmlFor={id} className="pk-label">
        {label}
      </label>
      <div className="pk-stepper">
        <button
          type="button"
          aria-label={`Fewer ${noun}`}
          disabled={value <= min}
          onClick={() => commit(value - 1)}
        >
          <Minus aria-hidden="true" focusable="false" />
        </button>
        <input
          id={id}
          type="text"
          role="spinbutton"
          inputMode="numeric"
          autoComplete="off"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-describedby={hint ? `${id}-hint` : undefined}
          value={text}
          onChange={(e) => setText(e.target.value.replace(/\D/g, "").slice(0, 2))}
          onBlur={() => commit(text)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              commit(value + 1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              commit(value - 1);
            } else if (e.key === "Enter") commit(text);
          }}
        />
        <button
          type="button"
          aria-label={`More ${noun}`}
          disabled={value >= max}
          onClick={() => commit(value + 1)}
        >
          <Plus aria-hidden="true" focusable="false" />
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="pk-hint">
          {hint}
        </p>
      )}
    </div>
  );
}

export function TripSetup({
  cfg,
  draft,
  onChange,
  onSubmit,
  onCancel,
  editing,
  presetNote,
}: {
  cfg: PackingConfig;
  draft: Trip;
  onChange: (t: Trip) => void;
  onSubmit: () => void;
  onCancel?: (() => void) | undefined;
  editing: boolean;
  presetNote?: string | undefined;
}) {
  const implied = new Set(impliedConditions(draft.tripType, cfg));
  const tripLabel = cfg.tripTypes.find((t) => t.id === draft.tripType)?.short ?? "trip";
  const mealsId = useId();
  return (
    <section className="pk-setup pk-panel" aria-labelledby="pk-setup-h" id="pk-setup">
      <h2 id="pk-setup-h">{editing ? "Edit your trip." : "First, tell us about your trip."}</h2>
      <p className="pk-lede">
        {editing
          ? "Change anything. Your checked items, quantities and extras stay where they are."
          : "A few quick details make your list more useful."}
      </p>
      {presetNote && (
        <p className="pk-hint" data-testid="pk-preset-note">
          {presetNote}
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <fieldset className="pk-fieldset">
          <legend>What kind of trip is it?</legend>
          <div className="pk-trip-grid">
            {cfg.tripTypes.map((t) => {
              const Icon = TRIP_ICONS[t.icon] ?? FALLBACK_ICON;
              return (
                <label key={t.id} className="pk-trip-card">
                  <input
                    type="radio"
                    name="pk-trip"
                    value={t.id}
                    checked={draft.tripType === t.id}
                    onChange={() => onChange({ ...draft, tripType: t.id })}
                  />
                  <Icon aria-hidden="true" focusable="false" />
                  <span className="pk-trip-name">{t.label}</span>
                  {t.hint && <span className="pk-trip-hint">{t.hint}</span>}
                  <span className="pk-tick" aria-hidden="true">
                    <Check />
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="pk-steppers">
          <Stepper
            label="How many days away?"
            hint="Count every day, including the days you travel."
            value={draft.days}
            min={MIN_DAYS}
            max={MAX_DAYS}
            noun="days"
            onChange={(days) => onChange({ ...draft, days })}
          />
          <Stepper
            label="How many dogs are coming?"
            value={draft.dogs}
            min={MIN_DOGS}
            max={MAX_DOGS}
            noun="dogs"
            onChange={(dogs) => onChange({ ...draft, dogs })}
          />
          <div>
            <label htmlFor={mealsId} className="pk-label">
              Meals per dog each day <span style={{ fontWeight: 400 }}>(optional)</span>
            </label>
            <select
              id={mealsId}
              className="pk-select"
              aria-describedby={`${mealsId}-hint`}
              value={draft.mealsPerDay ?? ""}
              onChange={(e) =>
                onChange({
                  ...draft,
                  mealsPerDay: e.target.value ? clampInt(e.target.value, 1, MAX_MEALS, 1) : null,
                })
              }
            >
              <option value="">Skip this</option>
              {Array.from({ length: MAX_MEALS }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "meal" : "meals"} a day
                </option>
              ))}
            </select>
            <p id={`${mealsId}-hint`} className="pk-hint">
              Counts meal portions to pack instead of dog-days of food.
            </p>
          </div>
        </div>

        <fieldset className="pk-fieldset">
          <legend>Anything else we should plan for?</legend>
          <p className="pk-hint" style={{ marginTop: "-0.3rem", marginBottom: "0.6rem" }}>
            All optional. Tick whatever applies.
          </p>
          <div className="pk-checks">
            {cfg.conditions.map((c) => {
              const isImplied = implied.has(c.id);
              const checked = isImplied || draft.conditions.includes(c.id);
              return (
                <label key={c.id} className="pk-check-row">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={isImplied}
                    onChange={(e) =>
                      onChange({
                        ...draft,
                        conditions: e.target.checked
                          ? [...new Set([...draft.conditions, c.id])]
                          : draft.conditions.filter((x) => x !== c.id),
                      })
                    }
                  />
                  <span>
                    {c.label}
                    {isImplied && (
                      <span className="pk-implied">Included with your {tripLabel}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="pk-actions-row">
          <button type="submit" className="pk-btn pk-btn-primary">
            {editing ? "Update my packing list" : "Build my packing list"}
          </button>
          {onCancel && (
            <button type="button" className="pk-btn pk-btn-quiet" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
