import type { ReactNode } from "react";
import { setProfile } from "@/passport/local-store";
import { usePassport } from "@/passport/usePassport";
import type { Comfort, DogProfile, Tri } from "@/passport/profile";
import { ACTIVITY_TYPES, HOMES } from "@/passport/schema";
import { ACTIVITY_LABELS } from "./labels";

/** One-of choice as pressed buttons. A value of undefined is "Not sure" / no preference. */
export function Choice<T extends string | number | boolean>({
  legend,
  hint,
  options,
  value,
  onChange,
}: {
  legend: string;
  hint?: ReactNode;
  options: readonly { value: T | undefined; label: string }[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <fieldset className="pa-field">
      <legend>{legend}</legend>
      {hint && <p className="pa-fine">{hint}</p>}
      <div className="pa-chips">
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            className="pa-chip"
            aria-pressed={o.value === value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Pick any number of options. Pressing a pressed chip removes it. */
export function MultiChoice<T extends string>({
  legend,
  hint,
  options,
  values,
  onChange,
}: {
  legend: string;
  hint?: ReactNode;
  options: readonly { value: T; label: string }[];
  values: readonly T[] | undefined;
  onChange: (v: T[]) => void;
}) {
  const cur = values ?? [];
  return (
    <fieldset className="pa-field">
      <legend>{legend}</legend>
      {hint && <p className="pa-fine">{hint}</p>}
      <div className="pa-chips">
        {options.map((o) => {
          const on = cur.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              className="pa-chip"
              aria-pressed={on}
              onClick={() => onChange(on ? cur.filter((x) => x !== o.value) : [...cur, o.value])}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const COMFORT: { value: Comfort | undefined; label: string }[] = [
  { value: "comfortable", label: "Comfortable" },
  { value: "nervous", label: "Nervous" },
  { value: "unknown", label: "Not sure" },
];
const TRI: { value: Tri | undefined; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unknown", label: "Not sure" },
];

// Clearing a value sets it to undefined, which the typed Partial does not allow under exactOptionalPropertyTypes.
const patch = (p: { [K in keyof DogProfile]?: DogProfile[K] | undefined }) =>
  setProfile(p as Partial<DogProfile>);

export const hasProfile = (p: DogProfile): boolean =>
  Object.entries(p).some(([k, v]) => k !== "skipped" && v !== undefined && v !== "");

/**
 * Edits the dog profile. Every change is saved at once on this device and can be changed again any time.
 * part: "quick" (the short first step), "more" (everything else) or "all".
 */
export function ProfileEditor({ part = "all" }: { part?: "quick" | "more" | "all" }) {
  const { profile: p } = usePassport();
  const quick = part !== "more";
  const more = part !== "quick";
  const num = (v: string, max: number): number | undefined => {
    if (v.trim() === "") return undefined;
    const n = Math.floor(Number(v));
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : undefined;
  };

  return (
    <div className="pd-editor">
      {quick && (
        <>
          <label className="pa-field">
            <span>Your dog's name (optional)</span>
            <input
              value={p.name ?? ""}
              maxLength={30}
              autoComplete="off"
              onChange={(e) => patch({ name: e.target.value || undefined })}
            />
          </label>
          <Choice
            legend="Life stage"
            options={[
              { value: "puppy", label: "Puppy" },
              { value: "adult", label: "Adult" },
              { value: "senior", label: "Senior" },
              { value: undefined, label: "Not sure" },
            ]}
            value={p.lifeStage}
            onChange={(v) => patch({ lifeStage: v })}
          />
          <Choice
            legend="With unfamiliar people"
            options={COMFORT}
            value={p.people}
            onChange={(v) => patch({ people: v })}
          />
          <Choice
            legend="Around other dogs"
            options={COMFORT}
            value={p.dogs}
            onChange={(v) => patch({ dogs: v })}
          />
          <Choice
            legend="In busy places"
            options={COMFORT}
            value={p.crowds}
            onChange={(v) => patch({ crowds: v })}
          />
        </>
      )}
      {more && (
        <>
          {part === "all" && (
            <p className="pa-fine">
              Anything you are not sure about can stay as “Not sure”. Adventures that depend on it
              are kept on hold and we ask you a quick question first. Nothing leaves this device.
            </p>
          )}
          <label className="pa-field">
            <span>Breed (optional)</span>
            <input
              value={p.breed ?? ""}
              maxLength={60}
              autoComplete="off"
              placeholder="Mixed, unknown, or a breed"
              onChange={(e) => patch({ breed: e.target.value || undefined })}
            />
            <small className="pa-fine">
              Breed is only a gentle hint for ideas. It never decides what is suitable for your dog.
            </small>
          </label>
          <div className="pd-pair">
            <label className="pa-field">
              <span>Age: years</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={30}
                value={p.ageYears ?? ""}
                onChange={(e) => patch({ ageYears: num(e.target.value, 30) })}
              />
            </label>
            <label className="pa-field">
              <span>Age: months</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={11}
                value={p.ageMonths ?? ""}
                onChange={(e) => patch({ ageMonths: num(e.target.value, 11) })}
              />
            </label>
          </div>
          {part === "more" && (
            <Choice
              legend="Life stage"
              options={[
                { value: "puppy", label: "Puppy" },
                { value: "adult", label: "Adult" },
                { value: "senior", label: "Senior" },
                { value: undefined, label: "Not sure" },
              ]}
              value={p.lifeStage}
              onChange={(v) => patch({ lifeStage: v })}
            />
          )}
          <Choice
            legend="Size"
            options={[
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: undefined, label: "Not sure" },
            ]}
            value={p.size}
            onChange={(v) => patch({ size: v })}
          />
          <Choice
            legend="Energy"
            options={[
              { value: "gentle", label: "Gentle" },
              { value: "moderate", label: "Moderate" },
              { value: "lively", label: "Lively" },
              { value: undefined, label: "Not sure" },
            ]}
            value={p.energy}
            onChange={(v) => patch({ energy: v })}
          />
          <Choice
            legend="Moves slowly or not far"
            hint="Only you know what is right for your dog. This just keeps longer outings out of your suggestions."
            options={[
              { value: true, label: "Yes" },
              { value: false, label: "No" },
              { value: undefined, label: "Not sure" },
            ]}
            value={p.limitedMobility}
            onChange={(v) => patch({ limitedMobility: v })}
          />
          <label className="pa-field">
            <span>Anything to keep in mind (only you see this)</span>
            <textarea
              rows={2}
              maxLength={200}
              value={p.restrictions ?? ""}
              onChange={(e) => patch({ restrictions: e.target.value || undefined })}
            />
          </label>
          <MultiChoice
            legend="Personality"
            options={(["curious", "playful", "cozy", "gentle", "adventurous"] as const).map(
              (v) => ({ value: v, label: v[0]!.toUpperCase() + v.slice(1) }),
            )}
            values={p.personality}
            onChange={(v) => patch({ personality: v.length ? v : undefined })}
          />
          <MultiChoice
            legend="Favorite kinds of adventure"
            options={ACTIVITY_TYPES.map((v) => ({ value: v, label: ACTIVITY_LABELS[v] }))}
            values={p.favoriteTypes}
            onChange={(v) => patch({ favoriteTypes: v.length ? v : undefined })}
          />
          {part === "more" && (
            <>
              <Choice
                legend="With unfamiliar people"
                options={COMFORT}
                value={p.people}
                onChange={(v) => patch({ people: v })}
              />
              <Choice
                legend="Around other dogs"
                options={COMFORT}
                value={p.dogs}
                onChange={(v) => patch({ dogs: v })}
              />
              <Choice
                legend="In busy places"
                options={COMFORT}
                value={p.crowds}
                onChange={(v) => patch({ crowds: v })}
              />
            </>
          )}
          <Choice
            legend="Bothered by loud noises"
            options={TRI}
            value={p.noiseSensitive}
            onChange={(v) => patch({ noiseSensitive: v })}
          />
          <Choice
            legend="Does food or treat activities"
            options={TRI}
            value={p.foodActivities}
            onChange={(v) => patch({ foodActivities: v })}
          />
          <label className="pa-field">
            <span>Food notes (only you see this)</span>
            <input
              value={p.dietaryRestrictions ?? ""}
              maxLength={120}
              onChange={(e) => patch({ dietaryRestrictions: e.target.value || undefined })}
            />
          </label>
          <Choice
            legend="Around water"
            options={[
              { value: "loves", label: "Loves it" },
              { value: "ok", label: "Okay" },
              { value: "avoids", label: "Avoids it" },
              { value: "unknown", label: "Not sure" },
            ]}
            value={p.water}
            onChange={(v) => patch({ water: v })}
          />
          <Choice
            legend="Swims"
            options={TRI}
            value={p.swims}
            onChange={(v) => patch({ swims: v })}
          />
          <Choice
            legend="Happy to travel by car"
            options={TRI}
            value={p.carTravel}
            onChange={(v) => patch({ carTravel: v })}
          />
          <Choice
            legend="Home"
            options={[
              ...HOMES.map((h) => ({
                value: h,
                label:
                  h === "apartment"
                    ? "Apartment"
                    : h === "house-no-yard"
                      ? "House, no yard"
                      : "House with yard",
              })),
              { value: undefined, label: "Not sure" },
            ]}
            value={p.home}
            onChange={(v) => patch({ home: v })}
          />
          <Choice
            legend="Has a yard"
            options={TRI}
            value={p.yard}
            onChange={(v) => patch({ yard: v })}
          />
          <div className="pd-pair">
            <label className="pa-field">
              <span>Birthday (optional)</span>
              <input
                type="date"
                value={p.birthday ?? ""}
                onChange={(e) => patch({ birthday: e.target.value || undefined })}
              />
            </label>
            <label className="pa-field">
              <span>Adoption date (optional)</span>
              <input
                type="date"
                value={p.adoptionDate ?? ""}
                onChange={(e) => patch({ adoptionDate: e.target.value || undefined })}
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
