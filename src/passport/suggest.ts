// Pure helpers for the suggestion cards: the season from a date, the occasion window around a birthday or adoption
// date, and a plain .ics reminder. No network, no storage, no clock reads (callers pass "today").
// Which adventures are suggested is always decided by the engine (rank, pickSurprise); nothing here re-implements rules.
import type { Adventure } from "./schema";

export type Hemisphere = "north" | "south";
export type Season = Adventure["seasons"][number];
export type Ymd = { y: number; m: number; d: number };
export type OccasionKind = "birthday" | "adoption";
export type Occasion = { kind: OccasionKind; daysUntil: number; date: Ymd };

/** Today's date parts in the browser's local time. */
export function ymdOf(date: Date): Ymd {
  return { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate() };
}

const NORTH: Season[] = [
  "winter", // Jan
  "winter", // Feb
  "spring",
  "spring",
  "spring",
  "summer",
  "summer",
  "summer",
  "autumn",
  "autumn",
  "autumn",
  "winter", // Dec
];

/** Meteorological seasons by month. Southern hemisphere is the northern season six months away. */
export function seasonOf(today: Ymd, hemisphere: Hemisphere = "north"): Season {
  const idx = today.m - 1 + (hemisphere === "south" ? 6 : 0);
  return NORTH[idx % 12]!;
}

export const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const dayNumber = (p: Ymd) => Math.round(Date.UTC(p.y, p.m - 1, p.d) / 86_400_000);

/** Parses YYYY-MM-DD strictly. Returns null for anything that is not a real calendar date. */
export function parseYmd(s: string | undefined): Ymd | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s ?? "");
  if (!m) return null;
  const p = { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
  const t = new Date(Date.UTC(p.y, p.m - 1, p.d));
  if (t.getUTCFullYear() !== p.y || t.getUTCMonth() !== p.m - 1 || t.getUTCDate() !== p.d)
    return null;
  return p;
}

/** The anniversary in a given year. A 29 February date is kept on 28 February in years without one. */
export function anniversaryIn(year: number, p: Ymd): Ymd {
  return p.m === 2 && p.d === 29 && !isLeap(year)
    ? { y: year, m: 2, d: 28 }
    : { y: year, m: p.m, d: p.d };
}

export const OCCASION_AHEAD_DAYS = 14;
export const OCCASION_BEHIND_DAYS = 3;

/** The anniversary of `iso` that falls within 3 days before to 14 days after `today`, or null. Handles year wrap. */
export function occasionIn(
  kind: OccasionKind,
  iso: string | undefined,
  today: Ymd,
): Occasion | null {
  const p = parseYmd(iso);
  if (!p) return null;
  for (const year of [today.y - 1, today.y, today.y + 1]) {
    const date = anniversaryIn(year, p);
    const daysUntil = dayNumber(date) - dayNumber(today);
    if (daysUntil >= -OCCASION_BEHIND_DAYS && daysUntil <= OCCASION_AHEAD_DAYS)
      return { kind, daysUntil, date };
  }
  return null;
}

/** Birthday and adoption occasions in the window, nearest first. */
export function occasionsNow(
  p: { birthday?: string | undefined; adoptionDate?: string | undefined },
  today: Ymd,
): Occasion[] {
  return [occasionIn("birthday", p.birthday, today), occasionIn("adoption", p.adoptionDate, today)]
    .filter((o): o is Occasion => o !== null)
    .sort((a, b) => Math.abs(a.daysUntil) - Math.abs(b.daysUntil));
}

/** The next time this anniversary happens, today included. */
export function nextAnniversary(iso: string | undefined, today: Ymd): Ymd | null {
  const p = parseYmd(iso);
  if (!p) return null;
  for (const year of [today.y, today.y + 1]) {
    const date = anniversaryIn(year, p);
    if (dayNumber(date) >= dayNumber(today)) return date;
  }
  return null;
}

// ---------- .ics ----------

const pad = (n: number, w = 2) => String(n).padStart(w, "0");
const compact = (p: Ymd) => `${pad(p.y, 4)}${pad(p.m)}${pad(p.d)}`;
const addDay = (p: Ymd): Ymd => {
  const t = new Date(Date.UTC(p.y, p.m - 1, p.d + 1));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
};

/** Escapes text for an iCalendar value and drops control characters. */
export function icsText(s: string): string {
  const clean = Array.from(s, (ch) =>
    ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127 ? " " : ch,
  ).join("");
  return clean.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").trim();
}

/** Folds a content line at 75 octets with a CRLF and a space, as RFC 5545 asks. Never splits a character. */
function fold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > (out.length === 0 ? 75 : 74)) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

export type ReminderInput = { kind: OccasionKind; iso: string | undefined };

/**
 * A plain yearly all-day reminder for each date given. The only personal data in the file is the dog's name (as typed)
 * and the date (as typed). A 29 February date repeats on the last day of February.
 */
export function buildIcs(
  dogName: string | undefined,
  reminders: ReminderInput[],
  today: Ymd,
  stamp: Date = new Date(),
): string | null {
  const name = icsText((dogName ?? "").slice(0, 40));
  const summary = name ? `${name}: adventure day?` : "Adventure day?";
  const dtstamp = `${compact({ y: stamp.getUTCFullYear(), m: stamp.getUTCMonth() + 1, d: stamp.getUTCDate() })}T${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}${pad(stamp.getUTCSeconds())}Z`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Adventure Passport//Reminder//EN",
    "CALSCALE:GREGORIAN",
  ];
  let count = 0;
  for (const r of reminders) {
    const p = parseYmd(r.iso);
    const start = nextAnniversary(r.iso, today);
    if (!p || !start) continue;
    count++;
    const leapDay = p.m === 2 && p.d === 29;
    lines.push(
      "BEGIN:VEVENT",
      `UID:pp-${r.kind}-${pad(p.m)}${pad(p.d)}@adventure-passport.invalid`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${compact(start)}`,
      `DTEND;VALUE=DATE:${compact(addDay(start))}`,
      leapDay ? "RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=-1" : "RRULE:FREQ=YEARLY",
      `SUMMARY:${summary}`,
      `DESCRIPTION:${r.kind === "birthday" ? "Birthday" : "Adoption anniversary"} reminder: a yearly nudge to pick a little adventure.`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }
  if (count === 0) return null;
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
