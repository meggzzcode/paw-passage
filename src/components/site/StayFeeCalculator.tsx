import { useState } from "react";
import type { FeeBasis, Stay } from "@/content/stays/types";
import { feeBasisLabels, petFeeTotal } from "@/lib/pet-fee-calc";
import { trackToolOnce } from "@/lib/analytics";

export const MAX_NIGHTS = 60;

/** Whole-number nights 1 to 60 and dogs 1 to the stay's limit. Anything else shows no total. */
export function feeInputsValid(nights: number, dogs: number, maxDogs: number): boolean {
  return Number.isInteger(nights) && Number.isInteger(dogs) && nights >= 1 && nights <= MAX_NIGHTS && dogs >= 1 && dogs <= maxDogs;
}

const field = "mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm";

/**
 * Pet fee for the visitor's dates. When we have a confirmed fee for the stay it is used as is; otherwise the visitor
 * types the fee they see on the booking page and we do the arithmetic. Only the pet charge is calculated: cleaning
 * fees, taxes and the nightly rate are not included.
 */
export function StayFeeCalculator({ stay }: { stay: Stay }) {
  const known = stay.petFee;
  const maxDogs = stay.maxDogs ?? 4;
  const [nights, setNights] = useState("2");
  const [dogs, setDogs] = useState("1");
  const [amount, setAmount] = useState("");
  const [basis, setBasis] = useState<FeeBasis>("stay");
  const touch = () => trackToolOnce("tool_start", { tool: "stay-fee-calculator", label: stay.slug });
  const useAmount = known ? known.amount : amount === "" ? NaN : Number(amount);
  const useBasis = known ? known.basis : basis;
  const dogCount = Number(dogs);
  const nightCount = Number(nights);
  const overLimit = stay.maxDogs !== null && Number.isFinite(dogCount) && dogCount > stay.maxDogs;
  const valid = feeInputsValid(nightCount, dogCount, maxDogs);
  const total = valid ? petFeeTotal({ amount: useAmount, basis: useBasis, nights: nightCount, dogs: dogCount }) : null;
  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-xl">Pet fee for your dates</h2>
      <p className="mt-1 text-sm text-muted-foreground">{known ? "Uses the fee we have on file for this stay." : "We have not confirmed this stay's pet fee. Type the fee shown on the Vrbo booking page and we will work out the total."}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="text-sm">Nights<input className={field} type="number" min={1} max={MAX_NIGHTS} inputMode="numeric" value={nights} onChange={(e) => { touch(); setNights(e.target.value); }} /></label>
        <label className="text-sm">Dogs<input className={field} type="number" min={1} max={maxDogs} inputMode="numeric" value={dogs} onChange={(e) => { touch(); setDogs(e.target.value); }} /></label>
        {!known && (
          <>
            <label className="text-sm">Fee shown ($)<input className={field} type="number" min={0} inputMode="decimal" value={amount} onChange={(e) => { touch(); setAmount(e.target.value); }} placeholder="e.g. 75" /></label>
            <label className="text-sm">Charged<select className={field} value={basis} onChange={(e) => { touch(); setBasis(e.target.value as FeeBasis); }}>{(Object.keys(feeBasisLabels) as FeeBasis[]).map((b) => <option key={b} value={b}>{feeBasisLabels[b]}</option>)}</select></label>
          </>
        )}
      </div>
      <p className="mt-4 text-sm" aria-live="polite">
        {overLimit ? `The listing allows up to ${stay.maxDogs} ${stay.maxDogs === 1 ? "dog" : "dogs"}.` : total === null ? (!valid || known ? `Enter nights from 1 to ${MAX_NIGHTS} and dogs from 1 to ${maxDogs}.` : "Enter the fee to see the total.") : (
          <><span className="font-display text-2xl">${total.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span> <span className="text-muted-foreground">for {Math.floor(nightCount)} night{Math.floor(nightCount) === 1 ? "" : "s"}, {Math.floor(dogCount)} dog{Math.floor(dogCount) === 1 ? "" : "s"} ({feeBasisLabels[useBasis]})</span></>
        )}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">Pet charge only. The nightly rate, cleaning fee and taxes are not included, and the host can change fees. Confirm the total with the host in writing.</p>
    </div>
  );
}
