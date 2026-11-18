import type { Stay } from "@/content/stays/types";
import { townName, stateAbbr } from "@/content/destinations";
import { site } from "@/config/site";

const TITLE_MAX = 60;

/** Stay page title: "<Name>, <Town> <ST>" plus the site suffix, at most 60 characters in total. No retailer names. */
export function stayTitle(s: Stay): string {
  const suffix = ` | ${site.name}`;
  const place = `${townName(s.town)} ${stateAbbr(s.state)}`;
  const room = TITLE_MAX - suffix.length;
  const name = s.name.replace(/\s*\([^)]*\)\s*$/, "").trim() || s.name;
  const full = `${name}, ${place}`;
  if (full.length <= room) return full + suffix;
  const nameRoom = room - place.length - 3; // ", " plus the ellipsis
  if (nameRoom >= 8) {
    let cut = name.slice(0, nameRoom);
    if (name[nameRoom] !== " " && cut.includes(" ")) cut = cut.slice(0, cut.lastIndexOf(" "));
    return `${cut.replace(/[\s,;:-]+$/, "")}…, ${place}${suffix}`;
  }
  return `${place} stay${suffix}`.slice(0, TITLE_MAX);
}

/** Stay meta description of 120 to 155 characters: the summary plus the dog limit. */
export function stayDescription(s: Stay): string {
  const limit = s.maxDogs === null ? "Dog limit not confirmed." : `Dog limit: ${s.maxDogs} dog${s.maxDogs === 1 ? "" : "s"}.`;
  const base = s.summary.trim();
  const fillers = [
    "",
    s.status === "verified" ? "" : " Read from the listing, not host-confirmed.",
    ` Check fees and rules before you book.`,
    ` Pet rules and fees for ${townName(s.town)}, ${stateAbbr(s.state)}.`,
    " Confirm the pet rules before you book.",
    " Check the rules first.",
  ];
  let out = `${base} ${limit}`;
  for (const f of fillers) {
    if (out.length >= 120) break;
    if (out.length + f.length <= 155) out += f;
  }
  if (out.length > 155) {
    const room = 155 - limit.length - 2;
    const cut = base.slice(0, room).replace(/[\s,;:-]+\S*$/, "").replace(/[\s,;:.-]+$/, "");
    out = `${cut}… ${limit}`;
  }
  return out;
}
