import type { FeeBasis } from "@/content/stays/types";

export interface FeeInput {
  amount: number;
  basis: FeeBasis;
  nights: number;
  dogs: number;
}

/** The pet charge for one stay. Returns null for input that makes no sense (negative or missing numbers). */
export function petFeeTotal({ amount, basis, nights, dogs }: FeeInput): number | null {
  if (![amount, nights, dogs].every((n) => Number.isFinite(n) && n >= 0)) return null;
  const n = Math.floor(nights),
    d = Math.floor(dogs);
  const total = { stay: amount, night: amount * n, dog: amount * d, "dog-night": amount * d * n }[
    basis
  ];
  return Math.round(total * 100) / 100;
}

export const feeBasisLabels: Record<FeeBasis, string> = {
  stay: "per stay",
  night: "per night",
  dog: "per dog",
  "dog-night": "per dog, per night",
};
