import { managerPolicies, dataDate, type ManagerPolicy } from "@/content/manager-policies";

/** Counts computed from the dataset, so the site never hard-codes them. */
export function policyStats(list: ManagerPolicy[] = managerPolicies) {
  const total = list.length;
  const limitStated = list.filter((p) => p.maxDogs !== null);
  return {
    total,
    date: dataDate,
    limitStated: limitStated.length,
    capTwo: limitStated.filter((p) => p.maxDogs === 2).length,
    capThree: limitStated.filter((p) => p.maxDogs === 3).length,
    noLimitStated: total - limitStated.length,
    feeStated: list.filter((p) => p.fee !== "Not stated").length,
    zeroFee: list.filter((p) => /^\$0\b/.test(p.fee)).length,
    breedSilent: list.filter((p) => p.breed === "not-stated").length,
    breedNamed: list.filter((p) => p.breed === "named").length,
    breedUnnamed: list.filter((p) => p.breed === "unnamed").length,
    breedNone: list.filter((p) => p.breed === "none").length,
    poolStated: list.filter((p) => !!p.pool).length,
    minAgeStated: list.filter((p) => !!p.minAge).length,
    unattendedStated: list.filter((p) => !!p.unattended).length,
    weightStated: list.filter((p) => !!p.weight).length,
  };
}

export function regionsOf(list: ManagerPolicy[] = managerPolicies) {
  return [...new Set(list.map((p) => p.region))].sort();
}
