import { z } from "zod";

export const placeSearchSchema = z.object({
  q: z.string().default("").catch(""),
  state: z.string().default("").catch(""),
  kind: z.string().default("").catch(""),
  // "yes" = dogs may use its trails or beaches, "no" = they may not
  trails: z.string().default("").catch(""),
});
export type PlaceSearch = z.infer<typeof placeSearchSchema>;
