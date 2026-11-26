// A calendar file for one planned adventure (RFC 5545), built entirely on this device.
// The file holds the adventure title, the time and a link to the site. Never instructions, never the dog's name.
import { icsText } from "./suggest";
import type { Plan, Remind } from "@/lib/notifications";

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

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

export const utcStamp = (d: Date): string =>
  `${pad(d.getUTCFullYear(), 4)}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

/** Wall-clock time in an IANA zone as YYYYMMDDTHHMMSS (no Z): a "floating" time the calendar reads in its own zone. */
export function floatingStamp(d: Date, tz: string): string {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(d);
  } catch {
    return utcStamp(d).slice(0, -1);
  }
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${g("year")}${g("month")}${g("day")}T${g("hour")}${g("minute")}${g("second")}`;
}

export const ALARM: Record<Exclude<Remind, "none">, string> = {
  at: "-PT0M",
  "1h": "-PT1H",
  "1d": "-P1D",
};
export const REMIND_LABEL: Record<Remind, string> = {
  none: "No reminder",
  at: "At the start time",
  "1h": "1 hour before",
  "1d": "1 day before",
};

export function planUid(plan: Pick<Plan, "id">, host = "pawsandpassage"): string {
  return `${plan.id}@${host}`;
}

/**
 * `time: "utc"` (default) writes an absolute moment every calendar understands. `"floating"` writes the wall-clock time
 * in the plan's zone with no zone attached, for calendars that should follow the traveller.
 */
export function buildPlanIcs(
  plan: Plan,
  opts: { title: string; siteUrl: string; time?: "utc" | "floating"; stamp?: Date },
): string {
  const start = new Date(plan.startAt);
  const end = new Date(start.getTime() + Math.max(5, plan.durationMin) * 60_000);
  const floating = opts.time === "floating";
  const dt = (d: Date) => (floating ? floatingStamp(d, plan.tz) : utcStamp(d));
  const summary = icsText(`Paws & Passage: ${opts.title}`.slice(0, 120));
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Paws & Passage//Adventure//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${planUid(plan)}`,
    `DTSTAMP:${utcStamp(opts.stamp ?? new Date(plan.updatedAt || Date.now()))}`,
    `DTSTART:${dt(start)}`,
    `DTEND:${dt(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${icsText(opts.siteUrl)}`,
    `URL:${opts.siteUrl}`,
    "TRANSP:OPAQUE",
  ];
  if (plan.remind !== "none")
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${summary}`,
      `TRIGGER:${ALARM[plan.remind]}`,
      "END:VALARM",
    );
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
