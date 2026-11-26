// Notification copy: warm and optional, never guilt, streaks or urgency; payloads small, private and allow-listed.
import { describe, expect, it } from "vitest";
import {
  allCopyStrings,
  buildPlanned,
  buildSaved,
  buildSeasonal,
  buildWeekly,
  COPY,
  isAllowedUrl,
  serializePayload,
} from "../server/passport/notifications-copy";

const BANNED = [
  "haven't played",
  "havent played",
  "is waiting",
  "are waiting",
  "missed",
  "miss out",
  "streak",
  "falling behind",
  "fall behind",
  "don't break",
  "last chance",
  "hurry",
  "don't forget",
  "right now",
  "limited time",
  "expires",
  "only today",
  "act now",
  "you're behind",
  "still waiting",
  "lonely",
];
// Weather is never claimed in seasonal copy.
const WEATHER = [
  "sunny",
  "rain",
  "snow",
  "cold",
  "warm",
  "hot ",
  "freez",
  "chilly",
  "storm",
  "weather",
  "forecast",
];

describe("notification copy", () => {
  const all = allCopyStrings();
  it("has the contract's weekly and saved wording", () => {
    expect(COPY.weekly.title).toBe("A little adventure awaits!");
    expect(COPY.weekly.body).toBe(
      "Have some time together this weekend? Discover something new to do with your favorite companion.",
    );
    expect(COPY.weekly.url).toBe("/discover?mode=surprise");
    expect(COPY.saved.title).toBe("Something to look forward to.");
    expect(COPY.saved.body).toBe("Your saved adventures are ready whenever you are.");
    expect(COPY.saved.url).toBe("/collections?tab=favorites");
  });
  it("scans every string for banned guilt, streak and urgency phrases", () => {
    expect(all.length).toBeGreaterThan(10);
    for (const s of all)
      for (const b of BANNED) expect(s.toLowerCase(), `"${s}" contains "${b}"`).not.toContain(b);
  });
  it("makes no weather claims", () => {
    for (const s of [
      COPY.seasonal.spring,
      COPY.seasonal.summer,
      COPY.seasonal.autumn,
      COPY.seasonal.winter,
    ].flatMap((c) => [c.title, c.body]))
      for (const w of WEATHER) expect(s.toLowerCase(), s).not.toContain(w);
  });
  it("has no exclamation pressure beyond the one in the weekly title, and no emoji", () => {
    for (const s of all) {
      expect(s).not.toMatch(/\p{Extended_Pictographic}/u);
      if (s !== COPY.weekly.title) expect(s).not.toContain("!");
    }
  });
  it("builds payloads under 1 KB with allow-listed urls and no private fields", () => {
    const payloads = [
      buildWeekly("2026-W48"),
      buildSaved("2026-W48"),
      buildSeasonal("autumn", "2026-W48"),
      buildSeasonal("spring", "2026-W48"),
      buildPlanned("pl-abcd1234", "at"),
      buildPlanned("pl-abcd1234", "1h"),
      buildPlanned("pl-abcd1234", "1d"),
    ];
    for (const p of payloads) {
      const s = serializePayload(p);
      expect(Buffer.byteLength(s)).toBeLessThan(1000);
      expect(isAllowedUrl(p.url)).toBe(true);
      expect(Object.keys(p).sort()).toEqual(["body", "kind", "tag", "title", "url"]);
      expect(s).not.toMatch(/adv-|cus_|license|token|session/i);
    }
    expect(buildPlanned("pl-abcd1234", "1h").url).toBe("/passport?view=upcoming&plan=pl-abcd1234");
  });
  it("refuses a payload with a url outside the allow-list", () => {
    expect(isAllowedUrl("/discover?mode=made")).toBe(true);
    expect(isAllowedUrl("/passport?view=upcoming&plan=pl-abcd1234")).toBe(true);
    for (const u of [
      "https://evil.test/",
      "//evil.test",
      "/passport?view=upcoming&plan=../x",
      "/passport?view=upcoming&plan=pl-ABCD1234",
      "/admin",
      "/discover?mode=made&x=1",
    ])
      expect(isAllowedUrl(u)).toBe(false);
    expect(() => serializePayload({ ...buildWeekly("w"), url: "https://evil.test/" })).toThrow();
  });
});
