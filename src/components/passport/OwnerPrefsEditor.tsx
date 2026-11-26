import { setOwner } from "@/passport/local-store";
import { usePassport } from "@/passport/usePassport";
import type { OwnerPrefs } from "@/passport/profile";
import { ACTIVITY_TYPES, OWNER_MOBILITY, PLACES, SUPPLY_KEYS } from "@/passport/schema";
import { Choice, MultiChoice } from "./ProfileEditor";
import { ACTIVITY_LABELS, OWNER_MOBILITY_LABELS, PLACE_LABELS, SUPPLY_LABELS } from "./labels";

// Clearing a value sets it to undefined, which the typed partial does not allow under exactOptionalPropertyTypes.
const patch = (p: { [K in keyof OwnerPrefs]?: OwnerPrefs[K] | undefined }) =>
  setOwner(p as OwnerPrefs);

/** What suits the person on the adventure. Saved at once on this device, editable any time. */
export function OwnerPrefsEditor() {
  const { save } = usePassport();
  const o: OwnerPrefs = save.owner.data;
  return (
    <div className="pd-editor">
      <Choice
        legend="How much walking suits you"
        options={[
          ...OWNER_MOBILITY.map((v) => ({ value: v, label: OWNER_MOBILITY_LABELS[v] })),
          { value: undefined, label: "No preference" },
        ]}
        value={o.mobility}
        onChange={(v) => patch({ mobility: v })}
      />
      <Choice
        legend="Step-free, even ground"
        options={[
          { value: true, label: "Please" },
          { value: undefined, label: "Not needed" },
        ]}
        value={o.stepFree === true ? true : undefined}
        onChange={(v) => patch({ stepFree: v })}
      />
      <Choice
        legend="Your own effort"
        options={[
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
          { value: undefined, label: "No preference" },
        ]}
        value={o.effort}
        onChange={(v) => patch({ effort: v })}
      />
      <Choice
        legend="Do you have a car for outings"
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "unknown", label: "Not sure" },
        ]}
        value={o.hasCar}
        onChange={(v) => patch({ hasCar: v })}
      />
      <Choice
        legend="Typical budget for an adventure"
        options={[
          { value: 0, label: "Free" },
          { value: 15, label: "Up to $15" },
          { value: 40, label: "Up to $40" },
          { value: undefined, label: "No preference" },
        ]}
        value={o.typicalBudget}
        onChange={(v) => patch({ typicalBudget: v })}
      />
      <Choice
        legend="How much preparation you like"
        options={[
          { value: "none", label: "None" },
          { value: "light", label: "A little" },
          { value: "some", label: "Some is fine" },
          { value: undefined, label: "No preference" },
        ]}
        value={o.prep}
        onChange={(v) => patch({ prep: v })}
      />
      <MultiChoice
        legend="Kinds of adventure you enjoy"
        options={ACTIVITY_TYPES.map((v) => ({ value: v, label: ACTIVITY_LABELS[v] }))}
        values={o.preferredTypes}
        onChange={(v) => patch({ preferredTypes: v })}
      />
      <MultiChoice
        legend="Places you like"
        options={PLACES.map((v) => ({ value: v, label: PLACE_LABELS[v] }))}
        values={o.preferredPlaces}
        onChange={(v) => patch({ preferredPlaces: v })}
      />
      <MultiChoice
        legend="Supplies I already have"
        hint="Used for the “what I have” filter."
        options={SUPPLY_KEYS.map((v) => ({ value: v, label: SUPPLY_LABELS[v] }))}
        values={o.supplies}
        onChange={(v) => patch({ supplies: v })}
      />
    </div>
  );
}
