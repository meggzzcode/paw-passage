// "For you today", "This season", an occasion card and picks from the visitor's smart collections.
// Every pick comes from the engine (rank, pickSurprise), so hard eligibility, held questions, completed adventures and
// "unknown is never safe" apply exactly as everywhere else. Nothing here calls the network or stores personal data.
import { useMemo, useState, type ReactNode } from "react";
import { AdventureCard, MysteryCard } from "./AdventureCard";
import { AdventureRow } from "./collections-shared";
import { pickSurprise, rank, type Ctx, type History } from "@/passport/engine";
import type { DogProfile, SessionFilters } from "@/passport/profile";
import { listCollections, type Save } from "@/passport/progress";
import type { Adventure } from "@/passport/schema";
import { track } from "@/passport/events";
import {
  buildIcs,
  nextAnniversary,
  occasionsNow,
  parseYmd,
  seasonOf,
  ymdOf,
  type Hemisphere,
  type Occasion,
} from "@/passport/suggest";

const HEMI_KEY = "pp.hemisphere.v1";
function readHemisphere(): Hemisphere {
  try {
    return window.localStorage.getItem(HEMI_KEY) === "south" ? "south" : "north";
  } catch {
    return "north";
  }
}

/** One suggestion with Reveal, Try another (never repeats in this visit) and an honest empty state. */
function PickSlot({
  source,
  resetKey,
  pick,
  dogName,
  emptyText,
}: {
  source: string;
  resetKey: string;
  pick: (skipped: Set<string>) => Adventure | null;
  dogName: string | undefined;
  emptyText: string;
}) {
  const [st, setSt] = useState<{
    skipped: string[];
    sticky: Adventure | null;
    revealed: boolean;
    key: string;
  }>({ skipped: [], sticky: null, revealed: false, key: resetKey });
  let s = st;
  if (st.key !== resetKey) {
    s = { ...st, sticky: null, revealed: false, key: resetKey };
    setSt(s);
  }
  // A revealed card stays put while you finish it, even though a completed adventure is no longer drawn.
  const current = s.sticky ?? pick(new Set(s.skipped));

  if (!current)
    return (
      <div role="status">
        <p>{s.skipped.length > 0 ? "That is everything for now." : emptyText}</p>
        {s.skipped.length > 0 && (
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            onClick={() => setSt({ ...s, skipped: [], sticky: null, revealed: false })}
          >
            Start over
          </button>
        )}
      </div>
    );

  const another = () =>
    setSt({ ...s, skipped: [...s.skipped, current.id], sticky: null, revealed: false });
  return s.revealed ? (
    <AdventureCard a={current} dogName={dogName} defaultOpen onAnother={another} />
  ) : (
    <MysteryCard
      a={current}
      onAnother={another}
      onReveal={() => {
        setSt({ ...s, sticky: current, revealed: true });
        track("suggestion_revealed", { source, adventure: current.id });
      }}
    />
  );
}

function Panel({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="pa-panel" aria-labelledby={id}>
      <h2 className="pa-h" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}

const TIMES: { label: string; minutes: number | undefined }[] = [
  { label: "Any time", minutes: undefined },
  { label: "About 10 minutes", minutes: 10 },
  { label: "About 30 minutes", minutes: 30 },
  { label: "An hour", minutes: 60 },
];
const PLACES: { label: string; setting: SessionFilters["setting"] }[] = [
  { label: "Anywhere", setting: undefined },
  { label: "At home", setting: "indoor" },
  { label: "Outdoors", setting: "outdoor" },
];

function Chip({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`pp-btn ${on ? "pp-btn-secondary" : "pp-btn-ghost"}`}
      aria-pressed={on}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function occasionLine(o: Occasion, name: string | undefined): string {
  const who = name ? `${name}'s` : "Your dog's";
  const what = o.kind === "birthday" ? `${who} birthday` : `${who} adoption anniversary`;
  const n = Math.abs(o.daysUntil);
  if (o.daysUntil === 0) return `${what} is today.`;
  if (o.daysUntil > 0) return `${what} is in ${n} ${n === 1 ? "day" : "days"}.`;
  return `${what} was ${n} ${n === 1 ? "day" : "days"} ago.`;
}

function downloadText(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function Suggestions({
  library,
  ctx,
  history,
  save,
  dog,
  today: todayDate,
}: {
  library: Adventure[];
  ctx: Ctx;
  history: History;
  save: Save;
  dog: DogProfile;
  today?: Date | undefined;
}) {
  const today = useMemo(() => ymdOf(todayDate ?? new Date()), [todayDate]);
  const todayKey = `${today.y}-${today.m}-${today.d}`;
  const [hemisphere, setHemisphere] = useState<Hemisphere>(readHemisphere);
  const [minutes, setMinutes] = useState<number | undefined>(undefined);
  const [setting, setSetting] = useState<SessionFilters["setting"]>(undefined);
  const [calendarNote, setCalendarNote] = useState("");
  const season = seasonOf(today, hemisphere);
  const unlocked = ctx.unlocked;
  const dogName = dog.name;

  const filters: SessionFilters = { season };
  if (minutes !== undefined) filters.minutes = minutes;
  if (setting) filters.setting = setting;

  const pickToday = (skipped: Set<string>): Adventure | null => {
    const r = rank(library, ctx, filters, { ...history, skipped }, { seed: `today-${todayKey}` });
    return r.ok ? (r.ranked.find((x) => !skipped.has(x.adventure.id))?.adventure ?? null) : null;
  };

  const shelf = (() => {
    const r = rank(library, ctx, { season }, history, { seed: `season-${season}` });
    return r.ok ? r.ranked.filter((x) => x.adventure.seasons.includes(season)).slice(0, 4) : [];
  })();

  const occasion = occasionsNow(dog, today)[0];
  const pickOccasion = (skipped: Set<string>): Adventure | null => {
    if (!occasion) return null;
    const slugs =
      occasion.kind === "birthday"
        ? ["holidays-and-celebrations", "our-story"]
        : ["our-story", "holidays-and-celebrations"];
    for (const slug of slugs) {
      const a = pickSurprise(
        library,
        { kind: "curated", slug },
        ctx,
        {},
        { ...history, skipped },
        [],
        { seed: `occasion-${occasion.kind}` },
      );
      if (a) return a;
    }
    return null;
  };

  const mine = listCollections(save);
  const smart = mine.filter((c) => c.kind === "smart").slice(0, 3);

  const hasDates = parseYmd(dog.birthday) !== null || parseYmd(dog.adoptionDate) !== null;
  function addToCalendar() {
    const reminders = [
      { kind: "birthday" as const, iso: dog.birthday },
      { kind: "adoption" as const, iso: dog.adoptionDate },
    ].filter((r) => nextAnniversary(r.iso, today) !== null);
    const ics = buildIcs(dogName, reminders, today);
    if (!ics) return;
    downloadText(ics, "adventure-days.ics");
    track("calendar_reminder_downloaded", {
      kind: reminders.length > 1 ? "both" : (reminders[0]?.kind ?? "none"),
    });
    setCalendarNote("Downloaded. Open the file to add it to your calendar app.");
  }

  return (
    <>
      <Panel id="sg-today-h" title="For you today">
        <p className="pa-fine">
          One idea, chosen from your answers and the {season} season (worked out from today's date).
          Tap what fits today, or leave it open.
        </p>
        <div className="pa-row" role="group" aria-label="Time I have">
          {TIMES.map((t) => (
            <Chip
              key={t.label}
              on={minutes === t.minutes}
              label={t.label}
              onClick={() => setMinutes(t.minutes)}
            />
          ))}
        </div>
        <div className="pa-row" role="group" aria-label="Where">
          {PLACES.map((p) => (
            <Chip
              key={p.label}
              on={setting === p.setting}
              label={p.label}
              onClick={() => setSetting(p.setting)}
            />
          ))}
        </div>
        <label className="pa-field">
          <span>Where I live, for the season</span>
          <select
            className="pd-select"
            value={hemisphere}
            onChange={(e) => {
              const h = e.target.value === "south" ? "south" : "north";
              setHemisphere(h);
              try {
                window.localStorage.setItem(HEMI_KEY, h);
              } catch {
                /* blocked storage: the choice lasts for this visit */
              }
            }}
          >
            <option value="north">Northern hemisphere</option>
            <option value="south">Southern hemisphere</option>
          </select>
        </label>
        <PickSlot
          source="for-you"
          resetKey={`${minutes ?? ""}|${setting ?? ""}|${season}`}
          pick={pickToday}
          dogName={dogName}
          emptyText="Nothing suited to your answers fits those choices today. Loosen a choice above, or see the list below."
        />
        {!unlocked && (
          <p className="pa-fine">
            This idea comes from the free library. The full Passport suggests from a much larger
            library. <a href="/unlock">See what it adds</a>.
          </p>
        )}
      </Panel>

      {occasion && (
        <Panel id="sg-occasion-h" title="Occasion">
          <p>{occasionLine(occasion, dogName)} A little adventure could mark it.</p>
          <PickSlot
            source="occasion"
            resetKey={`${occasion.kind}`}
            pick={pickOccasion}
            dogName={dogName}
            emptyText="Nothing in your library suits this occasion and your answers yet."
          />
        </Panel>
      )}

      {hasDates && (
        <Panel id="sg-cal-h" title="Calendar reminders">
          {unlocked ? (
            <>
              <button
                type="button"
                className="pp-btn pp-btn-secondary"
                aria-describedby="sg-cal-note"
                onClick={addToCalendar}
              >
                Add to my calendar
              </button>
              <p className="pa-fine" id="sg-cal-note" role="status">
                {calendarNote ||
                  "Makes a small file on this device with a yearly all-day reminder. Nothing is sent anywhere."}
              </p>
            </>
          ) : (
            <p className="pa-fine">
              The full Passport can make a yearly calendar reminder for your dog's birthday and
              adoption anniversary, built on your device.
            </p>
          )}
        </Panel>
      )}

      <Panel id="sg-season-h" title="This season">
        {shelf.length === 0 ? (
          <p className="pa-fine" role="status">
            No adventures tagged for {season} suit your answers right now.
          </p>
        ) : (
          <ul className="co-list" aria-label={`Adventures for ${season}`}>
            {shelf.map((r) => (
              <AdventureRow key={r.adventure.id} a={r.adventure} done={false} dogName={dogName} />
            ))}
          </ul>
        )}
      </Panel>

      {smart.map((c) => (
        <Panel key={c.id} id={`sg-coll-${c.id}`} title={`From your collection ${c.name}`}>
          <PickSlot
            source="collection"
            resetKey={c.id}
            pick={(skipped) =>
              pickSurprise(
                library,
                { kind: "custom", id: c.id },
                ctx,
                {},
                { ...history, skipped },
                mine,
                { seed: `coll-${c.id}-${todayKey}` },
              )
            }
            dogName={dogName}
            emptyText="Nothing in this collection suits your answers and is still new."
          />
        </Panel>
      ))}
    </>
  );
}
