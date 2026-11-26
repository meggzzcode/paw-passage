import { describe, expect, it } from "vitest";
import { buildPlanIcs, planUid } from "@/passport/ics";
import { PLAN_ID, newPlanId, type Plan } from "@/lib/notifications";
import { readFileSync } from "node:fs";

const plan: Plan = {
  id: "pl-abcd1234",
  adventureId: "adv-abc123",
  startAt: "2026-12-05T15:30:00.000Z",
  tz: "America/Chicago",
  durationMin: 45,
  remind: "1h",
  push: false,
  status: "planned",
  updatedAt: Date.UTC(2026, 10, 26, 12, 0, 0),
};
const opts = { title: "Sniff; the, \\ Garden", siteUrl: "https://example.com/" };
const unfold = (s: string) => s.replace(/\r\n /g, "");

describe("plan calendar file", () => {
  const ics = unfold(buildPlanIcs(plan, opts));
  it("has a stable UID, DTSTAMP and CRLF line endings", () => {
    expect(ics).toContain(`UID:${planUid(plan)}`);
    expect(buildPlanIcs({ ...plan, startAt: "2026-12-06T10:00:00.000Z" }, opts)).toContain(
      planUid(plan),
    );
    expect(ics).toContain("DTSTAMP:20261126T120000Z");
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });
  it("writes UTC start and end by default", () => {
    expect(ics).toContain("DTSTART:20261205T153000Z");
    expect(ics).toContain("DTEND:20261205T161500Z");
  });
  it("writes floating wall-clock time in the plan's zone on request", () => {
    const f = buildPlanIcs(plan, { ...opts, time: "floating" });
    expect(f).toContain("DTSTART:20261205T093000\r\n");
  });
  it("adds a VALARM per choice and none for no reminder", () => {
    expect(ics).toContain("TRIGGER:-PT1H");
    expect(unfold(buildPlanIcs({ ...plan, remind: "1d" }, opts))).toContain("TRIGGER:-P1D");
    expect(unfold(buildPlanIcs({ ...plan, remind: "at" }, opts))).toContain("TRIGGER:-PT0M");
    expect(buildPlanIcs({ ...plan, remind: "none" }, opts)).not.toContain("VALARM");
  });
  it("escapes the title and keeps the description to the site link", () => {
    expect(ics).toContain(String.raw`SUMMARY:Paws & Passage: Sniff\; the\, \\ Garden`);
    expect(ics).toContain("DESCRIPTION:https://example.com/");
  });
  it("folds long lines at 75 octets", () => {
    const long = buildPlanIcs(plan, { ...opts, title: "é".repeat(100) });
    for (const l of long.split("\r\n"))
      expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
  });
  it("never contains the dog's name or instructions (inputs are title and link only)", () => {
    expect(ics).not.toMatch(/instruction|steps|dog:/i);
  });
});

describe("plan ids", () => {
  it("match the contract", () => {
    for (let i = 0; i < 20; i++) expect(newPlanId()).toMatch(PLAN_ID);
  });
});

describe("copy", () => {
  it("has no banned pressure wording in the notification UI strings", () => {
    const files = [
      "src/components/passport/NotificationSettings.tsx",
      "src/components/passport/ScheduleAdventure.tsx",
      "src/components/passport/UpcomingAdventures.tsx",
      "src/components/passport/SavedReminderToggle.tsx",
      "src/components/passport/RevealSurface.tsx",
    ];
    for (const f of files)
      expect(readFileSync(f, "utf8")).not.toMatch(
        /you haven't played|your dog is waiting|you missed|don't break your streak|falling behind/i,
      );
  });
});
