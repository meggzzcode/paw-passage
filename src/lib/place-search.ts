import { z } from "zod";
import { fallback } from "@tanstack/zod-adapter";

export const placeSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  state: fallback(z.string(), "").default(""),
  kind: fallback(z.string(), "").default(""),
  // "yes" = dogs may use its trails or beaches, "no" = they may not
  trails: fallback(z.string(), "").default(""),
});
export type PlaceSearch = z.infer<typeof placeSearchSchema>;
