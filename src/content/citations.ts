// Pure helpers for how a guide's body cites its frontmatter `sources` (no "@/" imports: the build and tests load this too).
// A source is cited when the body has a [[n]] marker for it OR an inline Markdown link to its exact URL.

/** A numbered marker, written [[7]](https://source-url). The address is optional so [[7]] alone also counts. */
export const markerPattern = () => /\[\[(\d{1,3})\]\](?:\((https?:[^)\s]+)\))?/g;

/** Source numbers (1-based) a body cites, by marker or by an inline link to the source's exact URL. */
export function citedSourceNumbers(body: string, sources: { url: string }[]): Set<number> {
  const cited = new Set<number>();
  for (const m of body.matchAll(markerPattern())) cited.add(Number(m[1]));
  const links = new Set<string>();
  for (const m of body.matchAll(/\]\((https?:[^)\s]+)(?:\s+"[^"]*")?\)/g)) links.add(m[1]!);
  sources.forEach((s, i) => {
    if (links.has(s.url)) cited.add(i + 1);
  });
  return cited;
}

/** Source numbers (1-based) a body links to by the source's exact URL (inline publisher links; markers do not count). */
export function linkedSourceNumbers(body: string, sources: { url: string }[]): Set<number> {
  const links = new Set<string>();
  for (const m of body.matchAll(/\]\((https?:[^)\s]+)(?:\s+"[^"]*")?\)/g)) links.add(m[1]!);
  const out = new Set<number>();
  sources.forEach((s, i) => {
    if (links.has(s.url)) out.add(i + 1);
  });
  return out;
}

// Publisher names as written in a sentence. The display name is what a link shows; aliases are other ways the same
// publisher is named in running text (the first mention of any of them can carry the link).
const NAMES: Record<string, { name: string; aliases?: string[] }> = {
  "Cornell University College of Veterinary Medicine": {
    name: "Cornell Vet",
    aliases: ["Cornell University College of Veterinary Medicine", "Cornell Vet"],
  },
  "Cornell University Riney Canine Health Center": {
    name: "Cornell Riney Center",
    aliases: ["Riney Canine Health Center", "Cornell Riney Center"],
  },
  "U.S. Centers for Disease Control and Prevention": {
    name: "CDC",
    aliases: ["Centers for Disease Control and Prevention", "CDC"],
  },
  "Centers for Disease Control and Prevention": {
    name: "CDC",
    aliases: ["Centers for Disease Control and Prevention", "CDC"],
  },
  "U.S. Department of Justice": {
    name: "DOJ",
    aliases: ["Department of Justice", "Justice Department", "DOJ"],
  },
  "American Kennel Club": { name: "AKC", aliases: ["American Kennel Club", "AKC"] },
  "American Veterinary Medical Association": {
    name: "AVMA",
    aliases: ["American Veterinary Medical Association", "AVMA"],
  },
  "American Veterinary Society of Animal Behavior": {
    name: "AVSAB",
    aliases: ["American Veterinary Society of Animal Behavior", "AVSAB"],
  },
  "Georgia State Parks (Georgia DNR)": {
    name: "Georgia State Parks",
    aliases: ["Georgia State Parks", "Georgia DNR"],
  },
  "Humane World for Animals (formerly the Humane Society of the United States)": {
    name: "Humane World for Animals",
    aliases: ["Humane World for Animals", "Humane Society of the United States"],
  },
  "KONG Company": { name: "KONG", aliases: ["KONG"] },
  "National Park Service": {
    name: "National Park Service",
    aliases: ["National Park Service", "NPS"],
  },
  "U.S. National Park Service": {
    name: "National Park Service",
    aliases: ["National Park Service", "NPS"],
  },
  "National Fire Protection Association": {
    name: "NFPA",
    aliases: ["National Fire Protection Association", "NFPA"],
  },
  "U.S. Consumer Product Safety Commission": {
    name: "CPSC",
    aliases: ["Consumer Product Safety Commission", "CPSC"],
  },
  "U.S. Food and Drug Administration": {
    name: "FDA",
    aliases: ["Food and Drug Administration", "FDA"],
  },
  "Animal Legal & Historical Center, Michigan State University College of Law": {
    name: "Michigan State Animal Legal Center",
    aliases: ["Animal Legal & Historical Center", "Michigan State"],
  },
  "Animals (Basel)": { name: "Animals (Basel)", aliases: ["Animals (Basel)"] },
  "Petco Love": { name: "Petco Love" },
  "University of Florida College of Veterinary Medicine": {
    name: "UF Vet",
    aliases: ["University of Florida College of Veterinary Medicine", "UF Vet"],
  },
  "West Virginia Division of Natural Resources": {
    name: "West Virginia DNR",
    aliases: ["West Virginia Division of Natural Resources", "West Virginia DNR"],
  },
  "U.S. Forest Service, Gila National Forest": {
    name: "U.S. Forest Service",
    aliases: ["U.S. Forest Service", "Forest Service"],
  },
  "Twiddy & Company": { name: "Twiddy", aliases: ["Twiddy & Company", "Twiddy"] },
  "Soggy Doggy Productions": {
    name: "Soggy Doggy",
    aliases: ["Soggy Doggy Productions", "Soggy Doggy"],
  },
  "Newman-Dailey Resort Properties": {
    name: "Newman-Dailey",
    aliases: ["Newman-Dailey Resort Properties", "Newman-Dailey"],
  },
  "Canine Arthritis Resources and Education": {
    name: "CARE",
    aliases: ["Canine Arthritis Resources and Education"],
  },
  "Enterprise Rent-A-Car": { name: "Enterprise", aliases: ["Enterprise Rent-A-Car", "Enterprise"] },
  "Small Door Veterinary": { name: "Small Door", aliases: ["Small Door Veterinary", "Small Door"] },
  "U.S. Coast Guard": { name: "U.S. Coast Guard", aliases: ["U.S. Coast Guard", "Coast Guard"] },
};

/** The publisher's name with notes removed: "ASPCA (2018-12-04)" -> "ASPCA", "Animals (Basel), 2022" -> "Animals (Basel)". */
function cleanPublisher(publisher: string): string {
  let p = publisher
    .trim()
    .replace(/\s+via\s+.*$/i, "")
    .replace(/,\s*\d{4}$/, "");
  p = p.replace(
    /\s*\((?:updated [^)]*|[^)]*\b\d{4}\b[^)]*|[^)]*(?:thread|blog|DVM)[^)]*|AVSAB|via [^)]*|formerly[^)]*)\)/gi,
    "",
  );
  return p.trim();
}

/** Short publisher name a link shows: a small override map, otherwise the cleaned publisher as written. */
export function publisherDisplayName(publisher: string): string {
  const c = cleanPublisher(publisher);
  return NAMES[c]?.name ?? NAMES[publisher]?.name ?? c;
}

/** Names that may stand for this publisher in running text, longest first. */
export function publisherAliases(publisher: string): string[] {
  const c = cleanPublisher(publisher);
  const set = new Set<string>([
    c,
    publisherDisplayName(publisher),
    ...(NAMES[c]?.aliases ?? NAMES[publisher]?.aliases ?? []),
  ]);
  return [...set].filter((n) => n.length >= 2).sort((a, b) => b.length - a.length);
}
