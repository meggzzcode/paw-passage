import { stays as contentStays } from "virtual:content";
import { site } from "@/config/site";
import { sampleStays } from "./samples";
import { verifiedStays } from "./verified";
import type { Stay } from "./types";

export type { Stay } from "./types";

/** Stays visible in this build: verified only in production; plus samples in dev/preview. */
export function visibleStays(opts: { includeSamples?: boolean } = {}): Stay[] {
  const includeSamples = opts.includeSamples ?? site.showSampleStays;
  const all = [...verifiedStays, ...(contentStays as Stay[])];
  const seen = new Set<string>();
  for (const s of [...all, ...sampleStays]) {
    if (seen.has(s.slug)) throw new Error(`Two stays share the web address "${s.slug}".`);
    seen.add(s.slug);
  }
  const verified = all.filter((s) => s.status === "verified");
  // Samples and unverified records are only ever shown in development or private preview builds.
  return includeSamples ? [...verified, ...sampleStays, ...all.filter((s) => s.status !== "verified")] : verified;
}

export function getStay(slug: string, opts: { includeSamples?: boolean } = {}): Stay | undefined {
  return visibleStays(opts).find((s) => s.slug === slug);
}
