// "Ideas for <month>": a few collection links chosen by the calendar month. Rendered only in the browser (the month
// is not known at build time), so the first paint never mismatches. Month names only; no season or hemisphere wording.
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MONTH_NAMES, seasonalFor } from "@/config/commercial";
import { collections } from "@/passport/content";

export function SeasonalPicks({ now }: { now?: Date }) {
  const [month, setMonth] = useState<number | null>(now ? now.getMonth() + 1 : null);
  useEffect(() => {
    if (!now) setMonth(new Date().getMonth() + 1);
  }, [now]);
  if (month === null) return null;
  const known = new Map(collections.map((c) => [c.slug, c.title]));
  const picks = seasonalFor(month).filter((s) => known.has(s));
  if (picks.length === 0) return null;
  return (
    <div className="mt-6">
      <h3>Ideas for {MONTH_NAMES[month - 1]}</h3>
      <ul className="pp-season-list">
        {picks.map((slug) => (
          <li key={slug}>
            <Link to="/collections/$slug" params={{ slug }}>
              {known.get(slug)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
