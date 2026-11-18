import { managerPolicies, type ManagerPolicy } from "@/content/manager-policies";

export type BreedChoice = "none" | "pit" | "doberman" | "rottweiler" | "shepherd" | "other";
export interface DogCheckInput {
  dogs: number;
  weights: (number | null)[];
  breed: BreedChoice;
}
export type Status = "fits" | "ask" | "conflict";
export interface Result {
  policy: ManagerPolicy;
  status: Status;
  reasons: string[];
}

const breedKeys: Record<Exclude<BreedChoice, "none" | "other">, string> = {
  pit: "pit",
  doberman: "doberman",
  rottweiler: "rottweiler",
  shepherd: "shepherd",
};

export function evaluate(input: DogCheckInput, list: ManagerPolicy[] = managerPolicies): Result[] {
  return list.map((p) => {
    const conflicts: string[] = [];
    const asks: string[] = [];
    const notes: string[] = [];
    const unit = p.limitBasis === "pets" ? "pets" : "dogs";

    if (p.maxDogs === null) asks.push("The page gives no limit on the number of dogs. Ask.");
    else if (input.dogs > p.maxDogs) {
      if (p.limitBasis === "most-homes")
        asks.push(
          `The usual limit is ${p.maxDogs}; some homes may allow more. Ask about your home.`,
        );
      else conflicts.push(`The page says up to ${p.maxDogs} ${unit}.`);
    } else
      notes.push(
        `Allows up to ${p.maxDogs} ${unit}${p.limitBasis === "most-homes" ? " at most homes" : ""}.`,
      );

    if (p.weight) {
      const known = input.weights.filter((w): w is number => typeof w === "number" && w > 0);
      const w = p.weight;
      const label = `${w.lb} lb ${w.per === "combined" ? "combined" : "per dog"}`;
      if (known.length === 0)
        asks.push(`Weight limit of ${label}. Enter your dog's weight to check.`);
      else {
        const value = w.per === "combined" ? known.reduce((a, b) => a + b, 0) : Math.max(...known);
        const complete = w.per !== "combined" || known.length === input.dogs;
        if (value > w.lb)
          (w.soft ? asks : conflicts).push(
            w.soft
              ? `Standard limit is ${label}. ${w.note ?? "Ask about larger dogs."}`
              : `Weight limit is ${label}; yours is about ${value} lb.`,
          );
        else if (!complete)
          asks.push(`Weight limit is ${label}. Enter every dog's weight to check.`);
        else notes.push(`Within the ${label} weight limit.`);
      }
    }

    if (p.breed === "named") {
      if (input.breed === "other") asks.push("Names restricted breeds. Check the list for yours.");
      else if (input.breed !== "none" && p.breedNamed?.includes(breedKeys[input.breed]))
        conflicts.push("Your breed is on the restricted list.");
      else notes.push("Names restricted breeds; yours is not on the list we saw.");
    } else if (p.breed === "unnamed") {
      if (input.breed === "none") notes.push("Has breed limits without naming them.");
      else asks.push("Restricts some breeds without naming them. Ask whether yours is affected.");
    } else if (p.breed === "not-stated" && input.breed !== "none") {
      // Silence on breed is not a yes: the rule may sit on another page or in the home's own listing.
      asks.push(
        "The page we read does not say whether breed limits apply. Ask about your dog's breed.",
      );
    }

    const status: Status = conflicts.length ? "conflict" : asks.length ? "ask" : "fits";
    return { policy: p, status, reasons: [...conflicts, ...asks, ...notes] };
  });
}

export function summarize(results: Result[]) {
  return {
    fits: results.filter((r) => r.status === "fits").length,
    ask: results.filter((r) => r.status === "ask").length,
    conflict: results.filter((r) => r.status === "conflict").length,
    total: results.length,
  };
}
