import { site } from "@/config/site";
import { sampleStays } from "./samples";
import { verifiedStays } from "./verified";
import type { Stay } from "./types";

export type { Stay } from "./types";

/** Stays visible in this build: verified only in production; plus samples in dev/preview. */
export function visibleStays(opts: { includeSamples?: boolean } = {}): Stay[] {
  const includeSamples = opts.includeSamples ?? site.showSampleStays;
  const verified = verifiedStays.filter((s) => s.status === "verified");
  return includeSamples ? [...verified, ...sampleStays] : verified;
}

export function getStay(slug: string, opts: { includeSamples?: boolean } = {}): Stay | undefined {
  return visibleStays(opts).find((s) => s.slug === slug);
}
