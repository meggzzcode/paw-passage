// Pure time logic for notifications: IANA time zones and DST through Intl only (no date library). Everything here is a
// function of its arguments, so the edges (spring forward, fall back, month and year ends) are testable.
export const SLOT_MS = 15 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function fmt(tz: string): Intl.DateTimeFormat {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    fmtCache.set(tz, f);
  }
  return f;
}

export function isValidTz(tz: unknown): tz is string {
  if (typeof tz !== "string" || tz.length < 1 || tz.length > 64) return false;
  if (!/^[A-Za-z0-9_+\-/]+$/.test(tz)) return false;
  try {
    fmt(tz);
    return true;
  } catch {
    return false;
  }
}

export type LocalParts = {
  y: number;
  m: number; // 1-12
  d: number;
  h: number;
  mi: number;
  s: number;
  dow: number; // 0 = Sunday
};

/** Wall-clock parts of an instant in a zone. */
export function localParts(ms: number, tz: string): LocalParts {
  const o: Record<string, number> = {};
  for (const p of fmt(tz).formatToParts(new Date(ms)))
    if (p.type !== "literal") o[p.type] = Number(p.value);
  const y = o["year"] ?? 1970;
  const m = o["month"] ?? 1;
  const d = o["day"] ?? 1;
  return {
    y,
    m,
    d,
    h: (o["hour"] ?? 0) % 24,
    mi: o["minute"] ?? 0,
    s: o["second"] ?? 0,
    dow: new Date(Date.UTC(y, m - 1, d)).getUTCDay(),
  };
}

/** Offset (ms, local minus UTC) in force at an instant. */
function offsetAt(ms: number, tz: string): number {
  const p = localParts(ms, tz);
  const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s);
  return asUtc - Math.floor(ms / 1000) * 1000;
}

/**
 * Wall-clock time in a zone to a UTC instant. A time that does not exist (spring forward) moves forward by the gap, so
 * 02:30 becomes 03:30. A time that happens twice (fall back) resolves to the first, earlier occurrence.
 */
export function zonedToUtc(
  y: number,
  m: number,
  d: number,
  h: number,
  mi: number,
  tz: string,
): number {
  const wall = Date.UTC(y, m - 1, d, h, mi, 0);
  const offs = new Set([offsetAt(wall - DAY_MS, tz), offsetAt(wall + DAY_MS, tz)]);
  const valid: number[] = [];
  for (const off of offs) {
    const cand = wall - off;
    if (offsetAt(cand, tz) === off) valid.push(cand);
  }
  if (valid.length > 0) return Math.min(...valid);
  // Gap: use the offset in force before the change, which lands after the gap.
  return wall - Math.min(...offs);
}

const addDays = (y: number, m: number, d: number, n: number) => {
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
};

export const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
export function parseTime(t: string): { h: number; mi: number } | null {
  const m = TIME_RE.exec(t);
  return m ? { h: Number(m[1]), mi: Number(m[2]) } : null;
}

/**
 * First local occurrence of `day` (0 = Sunday) at `time` ("HH:MM") in `tz` that is strictly after `after` (epoch ms).
 * The local date is stepped, never "+7 * 24h", so the wall time survives a DST change.
 */
export function nextWeeklyOccurrence(day: number, time: string, tz: string, after: number): number {
  const t = parseTime(time);
  if (!t || !Number.isInteger(day) || day < 0 || day > 6 || !isValidTz(tz))
    throw new RangeError("bad weekly schedule");
  const base = localParts(after, tz);
  for (let i = 0; i <= 8; i++) {
    const c = addDays(base.y, base.m, base.d, i);
    if (new Date(Date.UTC(c.y, c.m - 1, c.d)).getUTCDay() !== day) continue;
    const utc = zonedToUtc(c.y, c.m, c.d, t.h, t.mi, tz);
    if (utc > after) return utc;
  }
  throw new RangeError("no occurrence found");
}

export type RemindKind = "none" | "at" | "1h" | "1d";

/**
 * When a planned reminder is due, or null for "none". "at" and "1h" are exact durations before the start. "1d" is the
 * same wall-clock time on the previous calendar day in the plan's zone, so a reminder for a 10:00 start stays at 10:00
 * across a DST change (it is 23 or 25 hours earlier on those days).
 */
export function plannedReminderDueMs(
  startAtMs: number,
  tz: string,
  remind: RemindKind,
): number | null {
  if (remind === "none") return null;
  if (remind === "at") return startAtMs;
  if (remind === "1h") return startAtMs - 60 * 60 * 1000;
  const p = localParts(startAtMs, tz);
  const prev = addDays(p.y, p.m, p.d, -1);
  return zonedToUtc(prev.y, prev.m, prev.d, p.h, p.mi, tz);
}

/** ISO 8601 week id of the local calendar date, e.g. "2026-W48". Weeks start on Monday. */
export function isoWeekId(ms: number, tz: string): string {
  const p = localParts(ms, tz);
  const t = new Date(Date.UTC(p.y, p.m - 1, p.d));
  const dow = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dow); // the Thursday of this week decides the year
  const yearStart = Date.UTC(t.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((t.getTime() - yearStart) / DAY_MS + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
/** Whole Monday-based weeks since 1970 of the local date. Steady across year ends, unlike the ISO week number. */
export function weekIndex(ms: number, tz: string): number {
  const p = localParts(ms, tz);
  return Math.floor((Date.UTC(p.y, p.m - 1, p.d) / DAY_MS + 3) / 7);
}

/** Minutes since local midnight. */
export const localMinutes = (ms: number, tz: string): number => {
  const p = localParts(ms, tz);
  return p.h * 60 + p.mi;
};

export type Quiet = { start: string; end: string };

/** True when the local time falls in the quiet window. The window may wrap midnight (21:00 to 08:00). */
export function inQuietHours(ms: number, tz: string, quiet: Quiet): boolean {
  const s = parseTime(quiet.start);
  const e = parseTime(quiet.end);
  if (!s || !e) return false;
  const a = s.h * 60 + s.mi;
  const b = e.h * 60 + e.mi;
  if (a === b) return false; // an empty window means "no quiet hours"
  const now = localMinutes(ms, tz);
  return a < b ? now >= a && now < b : now >= a || now < b;
}

/** The first instant at or after `ms` that is outside the quiet window. */
export function quietEndAfter(ms: number, tz: string, quiet: Quiet): number {
  const e = parseTime(quiet.end);
  if (!e || !inQuietHours(ms, tz, quiet)) return ms;
  const p = localParts(ms, tz);
  for (let i = 0; i <= 1; i++) {
    const c = addDays(p.y, p.m, p.d, i);
    const utc = zonedToUtc(c.y, c.m, c.d, e.h, e.mi, tz);
    if (utc >= ms) return utc;
  }
  return ms + DAY_MS;
}

export type Season = "spring" | "summer" | "autumn" | "winter";

// Zones south of the equator. A heuristic by time-zone name, used only to pick a calendar season label for fixed copy.
const SOUTH = [
  "Australia/",
  "Antarctica/",
  "Pacific/Auckland",
  "Pacific/Fiji",
  "Pacific/Chatham",
  "Pacific/Tongatapu",
  "Pacific/Apia",
  "Pacific/Noumea",
  "Pacific/Port_Moresby",
  "America/Sao_Paulo",
  "America/Argentina/",
  "America/Buenos_Aires",
  "America/Santiago",
  "America/Montevideo",
  "America/Asuncion",
  "America/Lima",
  "America/La_Paz",
  "Africa/Johannesburg",
  "Africa/Maputo",
  "Africa/Harare",
  "Africa/Lusaka",
  "Africa/Windhoek",
  "Indian/Mauritius",
  "Indian/Reunion",
  "Indian/Antananarivo",
];
export const isSouthern = (tz: string): boolean => SOUTH.some((p) => tz.startsWith(p));

/** Meteorological season of the local calendar date (Mar-May spring in the north, flipped in the south). */
export function seasonFor(ms: number, tz: string): Season {
  const m = localParts(ms, tz).m;
  const north: Season =
    m >= 3 && m <= 5
      ? "spring"
      : m >= 6 && m <= 8
        ? "summer"
        : m >= 9 && m <= 11
          ? "autumn"
          : "winter";
  if (!isSouthern(tz)) return north;
  return { spring: "autumn", summer: "winter", autumn: "spring", winter: "summer" }[
    north
  ] as Season;
}

/** True during the first seven local days of a meteorological season (Mar, Jun, Sep, Dec 1-7). */
export function inSeasonStartWeek(ms: number, tz: string): boolean {
  const p = localParts(ms, tz);
  return p.d <= 7 && (p.m === 3 || p.m === 6 || p.m === 9 || p.m === 12);
}

export const slotOf = (ms: number): number => Math.floor(ms / SLOT_MS);
export const slotStart = (slot: number): number => slot * SLOT_MS;
/** First slot strictly after `ms`. */
export const nextSlotAfter = (ms: number): number => Math.floor(ms / SLOT_MS) + 1;
