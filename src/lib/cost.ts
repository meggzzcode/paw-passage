import type { FeeBasis } from "@/content/stays/types";

export interface CostInput {
  label: string;
  nightly: number;
  nights: number;
  cleaning: number;
  otherFees: number;
  petFee: number;
  petFeeBasis: FeeBasis;
  dogs: number;
  taxPct: number; // applied to lodging + cleaning + other fees
  deposit: number; // refundable, shown separately
}

export function petFeeTotal(amount: number, basis: FeeBasis, nights: number, dogs: number): number {
  const n = Math.max(0, nights);
  const d = Math.max(0, dogs);
  switch (basis) {
    case "stay": return amount;
    case "night": return amount * n;
    case "dog": return amount * d;
    case "dog-night": return amount * d * n;
  }
}

const round = (x: number) => Math.round(x * 100) / 100;

export function computeCost(i: CostInput) {
  const lodging = round(i.nightly * i.nights);
  const pet = round(petFeeTotal(i.petFee, i.petFeeBasis, i.nights, i.dogs));
  const taxable = lodging + i.cleaning + i.otherFees;
  const tax = round((taxable * i.taxPct) / 100);
  const total = round(lodging + i.cleaning + i.otherFees + pet + tax);
  const perNight = i.nights > 0 ? round(total / i.nights) : 0;
  const upfront = round(total + i.deposit);
  return { lodging, pet, tax, total, perNight, upfront, petShare: total > 0 ? round((pet / total) * 100) : 0 };
}

/** Form state for one stay: numeric fields are strings so they can be cleared while typing. */
export interface StayForm {
  label: string;
  nightly: string;
  nights: string;
  cleaning: string;
  otherFees: string;
  petFee: string;
  petFeeBasis: FeeBasis;
  dogs: string;
  taxPct: string;
  deposit: string;
}

export const toNum = (s: string): number => {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export const blankStay = (label: string): StayForm => ({ label, nightly: "", nights: "3", cleaning: "", otherFees: "", petFee: "", petFeeBasis: "stay", dogs: "1", taxPct: "", deposit: "" });

export const parseStay = (f: StayForm): CostInput => ({
  label: f.label, nightly: toNum(f.nightly), nights: toNum(f.nights), cleaning: toNum(f.cleaning), otherFees: toNum(f.otherFees),
  petFee: toNum(f.petFee), petFeeBasis: f.petFeeBasis, dogs: toNum(f.dogs), taxPct: toNum(f.taxPct), deposit: toNum(f.deposit),
});

/** A stay counts as filled once it has a nightly rate. */
export const isFilled = (f: StayForm) => toNum(f.nightly) > 0;

/** Index of the lowest total among filled stays; -1 unless at least two stays are filled. */
export function lowestIndex(forms: StayForm[]): number {
  const filled = forms.map((f, i) => ({ i, f })).filter((x) => isFilled(x.f));
  if (filled.length < 2) return -1;
  let best = filled[0]!.i;
  let bestTotal = computeCost(parseStay(filled[0]!.f)).total;
  for (const { i, f } of filled.slice(1)) {
    const t = computeCost(parseStay(f)).total;
    if (t < bestTotal) { best = i; bestTotal = t; }
  }
  return best;
}

export const formatMoney = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** Plain-language difference between the first two filled stays, or null. */
export function differenceText(forms: StayForm[]): string | null {
  const filled = forms.filter(isFilled);
  if (filled.length < 2) return null;
  const [a, b] = filled as [StayForm, StayForm];
  const ca = parseStay(a), cb = parseStay(b);
  const ta = computeCost(ca).total, tb = computeCost(cb).total;
  const nights = ca.nights === cb.nights ? `${ca.nights} nights` : `${ca.nights} and ${cb.nights} nights`;
  const dogs = ca.dogs === cb.dogs ? `${ca.dogs} ${ca.dogs === 1 ? "dog" : "dogs"}` : `${ca.dogs} and ${cb.dogs} dogs`;
  const diff = Math.round(Math.abs(ta - tb) * 100) / 100;
  if (diff === 0) return `${a.label} and ${b.label} cost the same (${nights}, ${dogs}).`;
  const [hi, lo] = ta > tb ? [a, b] : [b, a];
  return `${hi.label} costs ${formatMoney(diff)} more than ${lo.label} (${nights}, ${dogs}).`;
}

export function summaryText(forms: StayForm[]): string {
  const lines = ["Trip cost summary (estimate, not a quote)"];
  for (const f of forms.filter(isFilled)) {
    const c = parseStay(f), r = computeCost(c);
    lines.push("", f.label, `  ${c.nights} nights at ${formatMoney(c.nightly)}: ${formatMoney(r.lodging)}`, `  Cleaning + other: ${formatMoney(c.cleaning + c.otherFees)}`, `  Pet fees: ${formatMoney(r.pet)}`, `  Tax: ${formatMoney(r.tax)}`, `  Total: ${formatMoney(r.total)} (${formatMoney(r.perNight)} per night)`);
    if (c.deposit > 0) lines.push(`  Up front incl. refundable deposit: ${formatMoney(r.upfront)}`);
  }
  const d = differenceText(forms);
  if (d) lines.push("", d);
  return lines.join("\n");
}

/** Clearly labelled sample numbers, not real listings. */
export const exampleStays = (): StayForm[] => [
  { label: "Example Stay A", nightly: "200", nights: "4", cleaning: "100", otherFees: "25", petFee: "50", petFeeBasis: "stay", dogs: "2", taxPct: "10", deposit: "300" },
  { label: "Example Stay B", nightly: "150", nights: "4", cleaning: "75", otherFees: "", petFee: "25", petFeeBasis: "dog-night", dogs: "2", taxPct: "8.5", deposit: "" },
];
