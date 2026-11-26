// Pure time logic for notifications: DST-safe weekly occurrences, planned-reminder due times, quiet hours, weeks, seasons.
import { describe, expect, it } from "vitest";
import {
  inQuietHours,
  isoWeekId,
  isSouthern,
  isValidTz,
  localParts,
  nextWeeklyOccurrence,
  plannedReminderDueMs,
  quietEndAfter,
  seasonFor,
  inSeasonStartWeek,
  zonedToUtc,
} from "../server/passport/schedule";

const iso = (ms: number) => new Date(ms).toISOString();
const NY = "America/New_York";

describe("zonedToUtc", () => {
  it("resolves an ordinary local time", () => {
    expect(iso(zonedToUtc(2026, 7, 4, 9, 0, NY))).toBe("2026-07-04T13:00:00.000Z");
    expect(iso(zonedToUtc(2026, 1, 10, 9, 0, NY))).toBe("2026-01-10T14:00:00.000Z");
  });
  it("moves a time that does not exist (spring forward) to just after the gap", () => {
    expect(iso(zonedToUtc(2026, 3, 8, 2, 30, NY))).toBe("2026-03-08T07:30:00.000Z"); // 03:30 EDT
  });
  it("uses the first occurrence of a time that happens twice (fall back)", () => {
    expect(iso(zonedToUtc(2026, 11, 1, 1, 30, NY))).toBe("2026-11-01T05:30:00.000Z"); // EDT, not EST
  });
  it("handles half-hour and southern zones", () => {
    expect(iso(zonedToUtc(2026, 6, 1, 9, 0, "Asia/Kolkata"))).toBe("2026-06-01T03:30:00.000Z");
    expect(iso(zonedToUtc(2026, 1, 15, 9, 0, "Australia/Sydney"))).toBe("2026-01-14T22:00:00.000Z");
  });
});

describe("nextWeeklyOccurrence", () => {
  it("keeps the wall-clock time across spring-forward DST", () => {
    // Saturday 2026-03-07 10:00 EST is after 09:00, so the next Saturday 09:00 is 2026-03-14, now EDT (UTC-4).
    const after = Date.UTC(2026, 2, 7, 15, 0);
    expect(iso(nextWeeklyOccurrence(6, "09:00", NY, after))).toBe("2026-03-14T13:00:00.000Z");
    // The week that contains the change: Sunday 09:00 on 2026-03-08 itself is 09:00 EDT.
    expect(iso(nextWeeklyOccurrence(0, "09:00", NY, Date.UTC(2026, 2, 7, 15, 0)))).toBe(
      "2026-03-08T13:00:00.000Z",
    );
  });
  it("keeps the wall-clock time across fall-back DST", () => {
    // Sunday 2026-11-01 09:00 is EST (UTC-5) after the change at 02:00.
    expect(iso(nextWeeklyOccurrence(0, "09:00", NY, Date.UTC(2026, 9, 31, 12, 0)))).toBe(
      "2026-11-01T14:00:00.000Z",
    );
    // A 01:30 slot on that Sunday is the ambiguous hour: the first one (EDT).
    expect(iso(nextWeeklyOccurrence(0, "01:30", NY, Date.UTC(2026, 9, 31, 12, 0)))).toBe(
      "2026-11-01T05:30:00.000Z",
    );
  });
  it("a nonexistent local time lands after the gap", () => {
    expect(iso(nextWeeklyOccurrence(0, "02:30", NY, Date.UTC(2026, 2, 7, 12, 0)))).toBe(
      "2026-03-08T07:30:00.000Z",
    );
  });
  it("is strictly after the given instant", () => {
    const occ = Date.UTC(2026, 10, 28, 9, 0); // Saturday 09:00 UTC
    expect(iso(nextWeeklyOccurrence(6, "09:00", "UTC", occ - 1))).toBe(iso(occ));
    expect(iso(nextWeeklyOccurrence(6, "09:00", "UTC", occ))).toBe(iso(occ + 7 * 86400000));
  });
  it("works at year end and for southern hemisphere zones", () => {
    expect(iso(nextWeeklyOccurrence(5, "09:00", "UTC", Date.UTC(2026, 11, 30, 12, 0)))).toBe(
      "2027-01-01T09:00:00.000Z",
    );
    // 2026-04-05 03:00 in Sydney ends DST at 03:00 local (AEDT to AEST).
    expect(iso(nextWeeklyOccurrence(0, "09:00", "Australia/Sydney", Date.UTC(2026, 3, 1)))).toBe(
      "2026-04-04T23:00:00.000Z",
    );
  });
  it("uses the local weekday, not the UTC weekday", () => {
    // 2026-11-28 23:30 UTC is Sunday 2026-11-29 10:30 in Sydney.
    const after = Date.UTC(2026, 10, 28, 23, 30);
    expect(localParts(after, "Australia/Sydney").dow).toBe(0);
    expect(iso(nextWeeklyOccurrence(0, "09:00", "Australia/Sydney", after))).toBe(
      "2026-12-05T22:00:00.000Z",
    );
  });
  it("rejects bad input", () => {
    expect(() => nextWeeklyOccurrence(7, "09:00", "UTC", 0)).toThrow();
    expect(() => nextWeeklyOccurrence(1, "9:00", "UTC", 0)).toThrow();
    expect(() => nextWeeklyOccurrence(1, "09:00", "Not/AZone", 0)).toThrow();
  });
});

describe("plannedReminderDueMs", () => {
  it("none, at and 1h are exact", () => {
    const start = Date.UTC(2026, 5, 10, 15, 0);
    expect(plannedReminderDueMs(start, NY, "none")).toBeNull();
    expect(plannedReminderDueMs(start, NY, "at")).toBe(start);
    expect(plannedReminderDueMs(start, NY, "1h")).toBe(start - 3600000);
  });
  it("1d keeps the wall-clock time across spring-forward (23 hours earlier)", () => {
    const start = zonedToUtc(2026, 3, 8, 10, 0, NY); // 10:00 EDT on the change day
    const due = plannedReminderDueMs(start, NY, "1d") as number;
    expect(iso(due)).toBe("2026-03-07T15:00:00.000Z"); // 10:00 EST the day before
    expect(start - due).toBe(23 * 3600000);
  });
  it("1d keeps the wall-clock time across fall-back (25 hours earlier)", () => {
    const start = zonedToUtc(2026, 11, 1, 10, 0, NY); // 10:00 EST on the change day
    const due = plannedReminderDueMs(start, NY, "1d") as number;
    expect(iso(due)).toBe("2026-10-31T14:00:00.000Z"); // 10:00 EDT the day before
    expect(start - due).toBe(25 * 3600000);
  });
  it("1d for a start just after midnight lands on the previous local date", () => {
    const start = zonedToUtc(2026, 1, 1, 0, 30, NY);
    expect(iso(plannedReminderDueMs(start, NY, "1d") as number)).toBe("2025-12-31T05:30:00.000Z");
  });
  it("1d for a start inside the previous day's nonexistent hour moves to after the gap", () => {
    // Start 02:30 on 2026-03-09 (EDT). The day before, 02:30 does not exist: it lands at 03:30 EDT.
    const start = zonedToUtc(2026, 3, 9, 2, 30, NY);
    expect(iso(plannedReminderDueMs(start, NY, "1d") as number)).toBe("2026-03-08T07:30:00.000Z");
  });
});

describe("quiet hours", () => {
  const q = { start: "21:00", end: "08:00" };
  it("wraps midnight", () => {
    expect(inQuietHours(Date.UTC(2026, 5, 1, 22, 0), "UTC", q)).toBe(true);
    expect(inQuietHours(Date.UTC(2026, 5, 1, 7, 59), "UTC", q)).toBe(true);
    expect(inQuietHours(Date.UTC(2026, 5, 1, 8, 0), "UTC", q)).toBe(false);
    expect(inQuietHours(Date.UTC(2026, 5, 1, 12, 0), "UTC", q)).toBe(false);
  });
  it("uses the customer's zone", () => {
    // 02:00 UTC is 22:00 the evening before in New York (EDT).
    expect(inQuietHours(Date.UTC(2026, 5, 2, 2, 0), NY, q)).toBe(true);
    expect(inQuietHours(Date.UTC(2026, 5, 2, 2, 0), "Asia/Tokyo", q)).toBe(false); // 11:00
  });
  it("an empty window means none, and a same-day window works", () => {
    expect(inQuietHours(Date.UTC(2026, 5, 1, 3, 0), "UTC", { start: "00:00", end: "00:00" })).toBe(
      false,
    );
    expect(inQuietHours(Date.UTC(2026, 5, 1, 13, 0), "UTC", { start: "12:00", end: "14:00" })).toBe(
      true,
    );
  });
  it("quietEndAfter finds the next end", () => {
    expect(iso(quietEndAfter(Date.UTC(2026, 5, 1, 22, 0), "UTC", q))).toBe(
      "2026-06-02T08:00:00.000Z",
    );
    expect(iso(quietEndAfter(Date.UTC(2026, 5, 1, 6, 0), "UTC", q))).toBe(
      "2026-06-01T08:00:00.000Z",
    );
    expect(iso(quietEndAfter(Date.UTC(2026, 5, 1, 12, 0), "UTC", q))).toBe(
      "2026-06-01T12:00:00.000Z",
    );
  });
});

describe("weeks, seasons, zones", () => {
  it("ISO week ids at year edges", () => {
    expect(isoWeekId(Date.UTC(2026, 11, 31, 12), "UTC")).toBe("2026-W53");
    expect(isoWeekId(Date.UTC(2027, 0, 1, 12), "UTC")).toBe("2026-W53");
    expect(isoWeekId(Date.UTC(2027, 0, 4, 12), "UTC")).toBe("2027-W01");
    expect(isoWeekId(Date.UTC(2026, 10, 29, 12), "UTC")).toBe("2026-W48"); // Sunday ends the ISO week
    expect(isoWeekId(Date.UTC(2026, 10, 30, 12), "UTC")).toBe("2026-W49");
  });
  it("seasons follow the hemisphere heuristic", () => {
    const nov = Date.UTC(2026, 10, 15);
    expect(seasonFor(nov, NY)).toBe("autumn");
    expect(seasonFor(nov, "Australia/Sydney")).toBe("spring");
    expect(seasonFor(Date.UTC(2026, 0, 15), "Europe/London")).toBe("winter");
    expect(seasonFor(Date.UTC(2026, 0, 15), "America/Sao_Paulo")).toBe("summer");
    expect(isSouthern("Africa/Johannesburg")).toBe(true);
    expect(isSouthern("Africa/Cairo")).toBe(false);
  });
  it("season start week is the first seven days of Mar, Jun, Sep and Dec", () => {
    expect(inSeasonStartWeek(Date.UTC(2026, 11, 5, 12), "UTC")).toBe(true);
    expect(inSeasonStartWeek(Date.UTC(2026, 11, 8, 12), "UTC")).toBe(false);
    expect(inSeasonStartWeek(Date.UTC(2026, 10, 3, 12), "UTC")).toBe(false);
  });
  it("validates IANA names", () => {
    expect(isValidTz("America/New_York")).toBe(true);
    expect(isValidTz("UTC")).toBe(true);
    expect(isValidTz("Mars/Olympus")).toBe(false);
    expect(isValidTz("")).toBe(false);
    expect(isValidTz("A".repeat(80))).toBe(false);
    expect(isValidTz(5)).toBe(false);
  });
});
