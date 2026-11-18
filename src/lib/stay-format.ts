import type { PetFee } from "@/content/stays/types";

export function describeFee(fee: PetFee | null): string {
  if (!fee) return "Not confirmed";
  if (fee.amount === 0) return "No pet fee";
  const per = {
    stay: "per stay",
    night: "per night",
    dog: "per dog",
    "dog-night": "per dog, per night",
  }[fee.basis];
  return `$${fee.amount} ${per}`;
}

export function yesNo(v: boolean | null | undefined, yes = "Yes", no = "No"): string {
  if (v === null || v === undefined) return "Not confirmed";
  return v ? yes : no;
}
