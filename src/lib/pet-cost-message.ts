import type { FeeBasis } from "@/content/stays/types";
import { computeCost, formatMoney, parseStay, type StayForm } from "@/lib/cost";

/** One plain sentence on how each kind of pet fee is usually charged. No platform caps are stated here. */
export const feeBasisHelp: Record<FeeBasis, string> = {
  stay: "Per stay: one flat amount for the whole booking, however many dogs or nights.",
  night: "Per night: the amount is charged for every night of the stay, however many dogs.",
  dog: "Per dog: the amount is charged once for each dog, however many nights.",
  "dog-night":
    "Per dog per night: the amount is multiplied by the number of dogs and the number of nights.",
};

export const feeBasisPhrase: Record<FeeBasis, string> = {
  stay: "per stay",
  night: "per night",
  dog: "per dog",
  "dog-night": "per dog per night",
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The paragraph that asks the host to confirm, in writing, the pet-fee facts the visitor entered. */
export function feeConfirmationText(stay: StayForm): string {
  const c = parseStay(stay);
  const r = computeCost(c);
  const trip = `${plural(c.nights, "night", "nights")} and ${plural(c.dogs, "dog", "dogs")}`;
  const deposit =
    c.deposit > 0
      ? ` I also noted a refundable deposit of ${formatMoney(c.deposit)}; please confirm when and how it is returned.`
      : "";
  if (c.petFee <= 0) {
    return `You listed no pet fee for ${trip}; please confirm in writing that there are no pet-related charges, deposits or after-stay charges.${deposit}`;
  }
  return `You listed the pet fee as ${formatMoney(c.petFee)} ${feeBasisPhrase[c.petFeeBasis]}; please confirm in writing that the total for ${trip} is ${formatMoney(r.pet)}, and that there are no other pet-related charges, deposits or after-stay charges.${deposit}`;
}

/** Puts the fee paragraph into a message from buildHostQuestions, just before the thank-you line. */
export function withFeeConfirmation(message: string, stay: StayForm | null): string {
  if (!stay) return message;
  const text = feeConfirmationText(stay);
  const marker = "\n\nThank you";
  const at = message.lastIndexOf(marker);
  if (at === -1) return `${message}\n\n${text}`;
  return `${message.slice(0, at)}\n\n${text}${message.slice(at)}`;
}
