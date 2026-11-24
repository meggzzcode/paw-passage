// The packing planner's content (content/packing.yml), checked at build time by plugins/content.ts.
import { packing } from "virtual:content";
import type { PackingConfig } from "@/lib/packing/schema";

export const packingConfig: PackingConfig = packing;
