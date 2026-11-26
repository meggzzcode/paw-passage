import { describe, expect, it, vi } from "vitest";
import {
  buildIcs,
  icsText,
  nextAnniversary,
  occasionIn,
  occasionsNow,
  parseYmd,
  seasonOf,
} from "@/passport/suggest";
import { track } from "@/passport/events";

const ymd = (s: string) => parseYmd(s)!;

describe("season from the date", () => {
  it("northern seasons by month, with boundaries", () => {
    const north = (s: string) => seasonOf(ymd(s), "north");
    expect(north("2026-02-28")).toBe("winter");
    expect(north("2026-03-01")).toBe("spring");
    expect(north("2026-05-31")).toBe("spring");
    expect(north("2026-06-01")).toBe("summer");
    expect(north("2026-09-01")).toBe("autumn");
    expect(north("2026-11-30")).toBe("autumn");
    expect(north("2026-12-01")).toBe("winter");
    expect(north("2026-01-15")).toBe("winter");
  });
  it("southern is six months away, and the default is northern", () => {
    expect(seasonOf(ymd("2026-01-15"), "south")).toBe("summer");
    expect(seasonOf(ymd("2026-07-04"), "south")).toBe("winter");
    expect(seasonOf(ymd("2026-10-04"), "south")).toBe("spring");
    expect(seasonOf(ymd("2026-04-04"), "south")).toBe("autumn");
    expect(seasonOf(ymd("2026-07-04"))).toBe("summer");
  });
});

describe("occasion window", () => {
  it("covers 14 days ahead and 3 days back, inclusive", () => {
    const b = "2020-06-20";
    expect(occasionIn("birthday", b, ymd("2026-06-06"))?.daysUntil).toBe(14);
    expect(occasionIn("birthday", b, ymd("2026-06-05"))).toBeNull();
    expect(occasionIn("birthday", b, ymd("2026-06-20"))?.daysUntil).toBe(0);
    expect(occasionIn("birthday", b, ymd("2026-06-23"))?.daysUntil).toBe(-3);
    expect(occasionIn("birthday", b, ymd("2026-06-24"))).toBeNull();
  });
  it("wraps the year in both directions", () => {
    expect(occasionIn("birthday", "2020-01-05", ymd("2026-12-25"))?.daysUntil).toBe(11);
    expect(occasionIn("adoption", "2020-12-30", ymd("2027-01-02"))?.daysUntil).toBe(-3);
  });
  it("handles 29 February: observed on 28 February in other years", () => {
    expect(occasionIn("birthday", "2020-02-29", ymd("2027-02-20"))?.date).toEqual(
      ymd("2027-02-28"),
    );
    expect(occasionIn("birthday", "2020-02-29", ymd("2028-02-20"))?.date).toEqual(
      ymd("2028-02-29"),
    );
    expect(occasionIn("birthday", "2020-02-29", ymd("2027-03-01"))?.daysUntil).toBe(-1);
    expect(occasionIn("birthday", "2020-02-29", ymd("2027-03-05"))).toBeNull();
  });
  it("ignores missing or invalid dates and orders by nearness", () => {
    expect(occasionIn("birthday", undefined, ymd("2026-06-01"))).toBeNull();
    expect(occasionIn("birthday", "2021-02-30", ymd("2026-02-28"))).toBeNull();
    expect(occasionIn("birthday", "not a date", ymd("2026-02-28"))).toBeNull();
    const o = occasionsNow(
      { birthday: "2020-06-30", adoptionDate: "2021-06-21" },
      ymd("2026-06-20"),
    );
    expect(o.map((x) => x.kind)).toEqual(["adoption", "birthday"]);
  });
  it("next anniversary includes today and rolls into next year", () => {
    expect(nextAnniversary("2020-06-20", ymd("2026-06-20"))).toEqual(ymd("2026-06-20"));
    expect(nextAnniversary("2020-06-20", ymd("2026-06-21"))).toEqual(ymd("2027-06-20"));
    expect(nextAnniversary("2020-02-29", ymd("2026-03-01"))).toEqual(ymd("2027-02-28"));
  });
});

describe(".ics", () => {
  const stamp = new Date(Date.UTC(2026, 5, 1, 12, 0, 0));
  it("is a plain yearly all-day event with a neutral title and no extra personal data", () => {
    const ics = buildIcs(
      "Juno",
      [
        { kind: "birthday", iso: "2020-06-20" },
        { kind: "adoption", iso: "2021-01-05" },
      ],
      ymd("2026-06-01"),
      stamp,
    )!;
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics).toContain("DTSTART;VALUE=DATE:20260620");
    expect(ics).toContain("DTEND;VALUE=DATE:20260621");
    expect(ics).toContain("DTSTART;VALUE=DATE:20270105");
    expect(ics.match(/RRULE:FREQ=YEARLY/g)).toHaveLength(2);
    expect(ics).toContain("SUMMARY:Juno: adventure day?");
    expect(ics).toContain("DTSTAMP:20260601T120000Z");
    for (const banned of ["ATTENDEE", "ORGANIZER", "LOCATION", "GEO", "URL", "mailto", "http"])
      expect(ics).not.toContain(banned);
    // Only these properties appear.
    const props = new Set(
      ics
        .replace(/\r\n /g, "")
        .split("\r\n")
        .filter(Boolean)
        .map((l) => l.split(/[:;]/)[0]),
    );
    expect([...props].sort()).toEqual(
      [
        "BEGIN",
        "CALSCALE",
        "DESCRIPTION",
        "DTEND",
        "DTSTAMP",
        "DTSTART",
        "END",
        "PRODID",
        "RRULE",
        "SUMMARY",
        "TRANSP",
        "UID",
        "VERSION",
      ].sort(),
    );
  });
  it("repeats a 29 February date on the last day of February", () => {
    const ics = buildIcs(
      "Juno",
      [{ kind: "birthday", iso: "2020-02-29" }],
      ymd("2026-06-01"),
      stamp,
    )!;
    expect(ics).toContain("DTSTART;VALUE=DATE:20270228");
    expect(ics).toContain("RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=-1");
  });
  it("escapes and folds, skips invalid dates, and works without a name", () => {
    expect(icsText("A, B; C\\D\nE")).toBe("A\\, B\\; C\\\\D E");
    const long = buildIcs(
      "É".repeat(60),
      [{ kind: "birthday", iso: "2020-06-20" }],
      ymd("2026-06-01"),
      stamp,
    )!;
    for (const line of long.split("\r\n"))
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    expect(buildIcs("Juno", [{ kind: "birthday", iso: "bad" }], ymd("2026-06-01"))).toBeNull();
    expect(
      buildIcs(undefined, [{ kind: "birthday", iso: "2020-06-20" }], ymd("2026-06-01")),
    ).toContain("SUMMARY:Adventure day?");
  });
});

describe("analytics allow-list", () => {
  it("accepts the two new events with slug fields only", () => {
    const gtag = vi.fn();
    (window as unknown as { gtag: unknown }).gtag = gtag;
    expect(
      track("suggestion_revealed", {
        source: "for-you",
        adventure: "adv-aaa111",
        note: "Juno Smith",
      }),
    ).toBe(true);
    expect(track("calendar_reminder_downloaded", { kind: "both" })).toBe(true);
    expect(gtag.mock.calls[0]![1]).toBe("pp_suggestion_revealed");
    expect(JSON.stringify(gtag.mock.calls[0]![2])).not.toContain("Juno");
    expect(gtag.mock.calls[1]![1]).toBe("pp_calendar_reminder_downloaded");
    delete (window as unknown as { gtag?: unknown }).gtag;
  });
});
