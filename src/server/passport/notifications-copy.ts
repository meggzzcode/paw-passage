// Fixed notification copy and the payload builder. Warm, optional, never guilt, streaks or urgency. Payloads carry no
// adventure text, license data, session data or personal details, and every url is an allow-listed same-origin path.
import type { Season } from "./schedule";

export type NotifKind = "weekly" | "planned" | "saved" | "seasonal";
export type NotifPayload = {
  kind: NotifKind;
  title: string;
  body: string;
  url: string;
  tag: string;
};

export const COPY = {
  weekly: {
    title: "A little adventure awaits!",
    body: "Have some time together this weekend? Discover something new to do with your favorite companion.",
    url: "/discover?mode=surprise",
  },
  saved: {
    title: "Something to look forward to.",
    body: "Your saved adventures are ready whenever you are.",
    url: "/collections?tab=favorites",
  },
  seasonal: {
    spring: {
      title: "A fresh season to explore.",
      body: "Spring is a lovely time to try something new together. See what feels right for the two of you.",
    },
    summer: {
      title: "A season for little adventures.",
      body: "Summer days leave room for new ideas. Find a small adventure to share with your companion.",
    },
    autumn: {
      title: "A season for cozy discoveries.",
      body: "Autumn is a good time to find something new together. See what feels right for the two of you.",
    },
    winter: {
      title: "A season for cozy adventures.",
      body: "Winter is a good time for gentle ideas. Find a small adventure to share with your companion.",
    },
    url: "/discover?mode=made",
  },
  planned: {
    at: {
      title: "Time for your adventure.",
      body: "Your planned adventure is set to start now. Open your plan whenever you are ready.",
    },
    "1h": {
      title: "Your adventure is coming up.",
      body: "Your planned adventure starts in about an hour. Open your plan when you like.",
    },
    "1d": {
      title: "A planned adventure is coming up.",
      body: "Your adventure is planned for tomorrow. Open your plan to see the details.",
    },
  },
} as const;

/** Every string a customer can ever see from the server, flattened. Used by the banned-phrase test. */
export function allCopyStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") out.push(v);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(COPY);
  return out;
}

export const PLAN_ID_RE = /^pl-[a-z0-9]{8}$/;

const ALLOWED_URLS = new Set([
  "/discover?mode=made",
  "/discover?mode=surprise",
  "/collections?tab=favorites",
  "/collections?tab=mine",
  "/passport?view=upcoming",
  "/previews",
]);
export const isAllowedUrl = (u: string): boolean =>
  ALLOWED_URLS.has(u) ||
  (u.startsWith("/passport?view=upcoming&plan=") &&
    PLAN_ID_RE.test(u.slice("/passport?view=upcoming&plan=".length)));

export function buildWeekly(weekId: string): NotifPayload {
  return { kind: "weekly", ...COPY.weekly, tag: `weekly-${weekId}` };
}
export function buildSaved(weekId: string): NotifPayload {
  return { kind: "saved", ...COPY.saved, tag: `saved-${weekId}` };
}
export function buildSeasonal(season: Season, weekId: string): NotifPayload {
  const c = COPY.seasonal[season];
  return {
    kind: "seasonal",
    title: c.title,
    body: c.body,
    url: COPY.seasonal.url,
    tag: `season-${weekId}`,
  };
}
export function buildPlanned(planId: string, remind: "at" | "1h" | "1d"): NotifPayload {
  const c = COPY.planned[remind];
  return {
    kind: "planned",
    title: c.title,
    body: c.body,
    url: `/passport?view=upcoming&plan=${planId}`,
    tag: `plan-${planId}`,
  };
}

/** Serializes a payload. Throws if it is not allow-listed or would exceed 1 KB, so a bad payload is never sent. */
export function serializePayload(p: NotifPayload): string {
  if (!isAllowedUrl(p.url)) throw new Error("payload url not allowed");
  const s = JSON.stringify(p);
  if (Buffer.byteLength(s) > 1000) throw new Error("payload too large");
  return s;
}
