// Writes public/pet-policies-38-managers.csv from src/content/manager-policies.ts.
// Run: node --experimental-strip-types scripts/make-policy-csv.mjs   (or: bun scripts/make-policy-csv.mjs)
import { managerPolicies, dataDate } from "../src/content/manager-policies.ts";
import { writeFileSync } from "node:fs";
const q = (v) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const cols = ["manager", "region", "place", "dog_or_pet_limit", "limit_basis", "weight_limit", "breed_rule", "pet_fee_as_stated", "dogs_in_pool_or_hot_tub", "minimum_dog_age", "leaving_dog_alone", "source_page", "read_on"];
const rows = managerPolicies.map((p) => [p.name, p.region, p.place, p.maxDogs ?? "not stated", p.limitBasis, p.weight ? `${p.weight.lb} lb ${p.weight.per}` : "not stated", p.breed, p.fee, p.pool ?? "not stated", p.minAge ?? "not stated", p.unattended ?? "not stated", p.url, dataDate]);
writeFileSync("public/pet-policies-38-managers.csv", [cols, ...rows].map((r) => r.map(q).join(",")).join("\n") + "\n");
console.log(`wrote ${rows.length} rows`);
