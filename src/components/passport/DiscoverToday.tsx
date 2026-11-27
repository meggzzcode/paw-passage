// "What shall we do today?" for a customer: where we are, what fits our day, then a small set of ideas or a surprise.
// Today's choices live in one temporary state owned by the page. They never write to the saved dog or household profile.
import { useState } from "react";
import "@/design/discover-v9.css";
import { AppLink } from "@/components/shell/AppLink";
import { QuickSurprise, TodayMatches } from "./PaidDiscover";
import { useDiscoverData } from "./discover-data";
import {
  EMPTY_TODAY,
  PLACE_OPTIONS,
  PREF_OPTIONS,
  alternatives,
  analyticsPlace,
  togglePref,
  visiblePlaces,
  visiblePrefs,
  dropChoice,
  surpriseLabel,
  type PlaceOption,
  type PrefOption,
  type TodayState,
} from "@/passport/context";
import { track } from "@/passport/events";

export const NO_MATCH = "We couldn't find a little adventure that fits all of today's choices.";

function NoMatch({
  reason,
  state,
  onChange,
  places,
  prefs,
}: {
  reason: "none-eligible" | "too-narrow";
  state: TodayState;
  onChange: (s: TodayState) => void;
  places: PlaceOption[];
  prefs: PrefOption[];
}) {
  const { library, ctx, history } = useDiscoverData();
  const alts =
    reason === "too-narrow" ? alternatives(library, ctx, history, state, { places, prefs }) : [];
  return (
    <section className="pa-card dt-nomatch" role="status" data-testid="today-nomatch">
      <h2 className="pa-title">{NO_MATCH}</h2>
      {alts.length > 0 && <p>Here is what we could try instead.</p>}
      <div className="pa-actions">
        {alts.map((a) => (
          <button
            key={a.choice.id}
            type="button"
            className="pp-btn pp-btn-secondary"
            onClick={() => onChange(dropChoice(state, a.choice.id))}
          >
            Without “{a.choice.label}” ({a.count})
          </button>
        ))}
        <button type="button" className="pp-btn pp-btn-ghost" onClick={() => onChange(EMPTY_TODAY)}>
          Reset today's choices
        </button>
      </div>
    </section>
  );
}

export function DiscoverToday({
  state,
  onChange,
  onSeeMore,
  startSearched = false,
  places: placeTable = PLACE_OPTIONS,
  prefs: prefTable = PREF_OPTIONS,
}: {
  state: TodayState;
  onChange: (s: TodayState) => void;
  /** Opens the existing Browse with today's choices applied. */
  onSeeMore: () => void;
  startSearched?: boolean;
  places?: PlaceOption[];
  prefs?: PrefOption[];
}) {
  const { library } = useDiscoverData();
  const places = visiblePlaces(library, placeTable);
  const prefs = visiblePrefs(library, prefTable);
  const [searched, setSearched] = useState(startSearched);
  const [seed, setSeed] = useState(1);
  const [surprise, setSurprise] = useState(false);
  const dirty =
    state.place !== null || state.prefs.length > 0 || Object.keys(state.filters).length > 0;
  const aggregate = (kind: "find" | "surprise") => {
    const where = analyticsPlace(state);
    const n = prefs.filter((p) => state.prefs.includes(p.key)).length;
    track("discover_context_used", { kind, where, n });
  };

  return (
    <div className="dt">
      <fieldset className="dt-group" aria-labelledby="dt-where-h">
        <legend className="pa-h dt-h" id="dt-where-h">
          Where are we today?
        </legend>
        <div className="pa-chips dt-tiles">
          {places.map((p) => (
            <button
              key={p.key}
              type="button"
              className="pa-chip dt-tile"
              aria-pressed={state.place === p.key}
              onClick={() => onChange({ ...state, place: p.key })}
            >
              <span className="pa-chip-emoji" aria-hidden="true">
                {p.emoji}
              </span>
              {p.label}
            </button>
          ))}
        </div>
      </fieldset>

      {prefs.length > 0 && (
        <fieldset className="dt-group" aria-labelledby="dt-fits-h">
          <legend className="pa-h dt-h" id="dt-fits-h">
            Something that fits our day.
          </legend>
          <p className="pa-fine dt-opt">Optional. Choose any that help.</p>
          <div className="pa-chips dt-chips">
            {prefs.map((p) => {
              const on = state.prefs.includes(p.key);
              return (
                <button
                  key={p.key}
                  type="button"
                  className="pa-chip dt-chip"
                  aria-pressed={on}
                  onClick={() => onChange(togglePref(state, p.key))}
                >
                  <span aria-hidden="true">{p.emoji}</span> {p.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="dt-actions">
        <button
          type="button"
          className="pp-btn pp-btn-primary dt-find"
          onClick={() => {
            setSearched(true);
            setSeed((n) => n + 1);
            aggregate("find");
          }}
        >
          Find our adventure
        </button>
        <button
          type="button"
          className="pp-btn pp-btn-secondary dt-surprise"
          aria-expanded={surprise}
          onClick={() => {
            if (!surprise) aggregate("surprise");
            setSurprise((v) => !v);
          }}
        >
          {surpriseLabel(state, placeTable, prefTable)}
        </button>
      </div>
      <p className="dt-links">
        <AppLink to="/collections">Collections</AppLink>
        <span aria-hidden="true"> · </span>
        <AppLink to="/collections" search={{ tab: "favorites" } as never}>
          Saved
        </AppLink>
        {dirty && (
          <>
            <span aria-hidden="true"> · </span>
            <button type="button" className="pa-linkbtn" onClick={() => onChange(EMPTY_TODAY)}>
              Reset today's choices
            </button>
          </>
        )}
      </p>

      {surprise && <QuickSurprise state={state} places={placeTable} prefs={prefTable} />}
      {searched && (
        <TodayMatches
          state={state}
          seed={seed}
          places={placeTable}
          prefs={prefTable}
          onSeeMore={onSeeMore}
          onNoMatch={(reason) => (
            <NoMatch
              reason={reason}
              state={state}
              onChange={onChange}
              places={placeTable}
              prefs={prefTable}
            />
          )}
        />
      )}
    </div>
  );
}
