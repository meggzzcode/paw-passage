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
