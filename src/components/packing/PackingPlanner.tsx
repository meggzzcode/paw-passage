import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, Pencil, Printer, RotateCcw, Save, Undo2 } from "lucide-react";
import { packingConfig as cfg } from "@/content/packing";
import { trackTool, trackToolOnce } from "@/lib/analytics";
import {
  defaultTrip,
  effectiveConditions,
  gearTripFor,
  normalizeTrip,
  tripSummaryLine,
  tripTitle,
  type Trip,
} from "@/lib/packing/engine";
import { hasPreset, type Preset } from "@/lib/packing/preset";
import { packingText } from "@/lib/packing/export";
import { buyResponseFor } from "@/lib/packing/shopping";
import { clearState, getStorage, loadState, saveState } from "@/lib/packing/storage";
import {
  activeEntries,
  addCustom,
  addIdea,
  availableExtras,
  buildList,
  conflictsWithPreset,
  dismissFresh,
  editCustom,
  emptyState,
  excludeItem,
  groupEntries,
  progressOf,
  reinsertCustom,
  removeCustom,
  removedEntries,
  restoreItem,
  setBuy,
  setPacked,
  setQuantity,
  type CustomItem,
  type PlannerState,
} from "@/lib/packing/state";
import { Checklist, type ItemActions } from "./Checklist";
import { ExtrasSection } from "./Extras";
import { PickUpList, pickRows } from "./Shopping";
import { TripSetup } from "./TripSetup";
import "./packing.css";

const TOOL = "packing-builder";
/** How long the Undo bar stays after a removal (it also goes away on the next action). */
const UNDO_MS = 10000;

type Undo =
  | { kind: "item"; id: string; name: string }
  | { kind: "custom"; item: CustomItem; index: number; name: string };

function draftFromPreset(preset: Preset): Trip {
  return normalizeTrip(
    {
      ...defaultTrip(),
      ...(preset.tripType ? { tripType: preset.tripType } : {}),
      ...(preset.days ? { days: preset.days } : {}),
      ...(preset.dogs ? { dogs: preset.dogs } : {}),
    },
    cfg,
  );
}

function presetLine(preset: Preset): string {
  const t = cfg.tripTypes.find((x) => x.id === preset.tripType)?.label;
  const parts = [
    t,
    preset.days ? `${preset.days} ${preset.days === 1 ? "day" : "days"}` : undefined,
    preset.dogs ? `${preset.dogs} ${preset.dogs === 1 ? "dog" : "dogs"}` : undefined,
  ].filter(Boolean);
  return parts.join(", ");
}

export function PackingPlanner({
  preset = {},
  onPresetHandled,
}: {
  preset?: Preset;
  onPresetHandled?: (() => void) | undefined;
}) {
  const [state, setState] = useState<PlannerState>(() => emptyState(cfg));
  const [draft, setDraft] = useState<Trip>(() => draftFromPreset(preset));
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [startFresh, setStartFresh] = useState(false);
  const [pending, setPending] = useState<Preset | null>(null);
  const [message, setMessage] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [saveBlocked, setSaveBlocked] = useState(false);
  const [undo, setUndo] = useState<Undo | null>(null);
  const focusAfterUndo = useRef<string | null>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const focusSummary = useRef(false);
  const presetLoaded = useRef(preset);

  // Load what this device saved. Done after mount so the server-rendered page and the first client render match.
  useEffect(() => {
    const storage = getStorage();
    if (!storage) setSaveBlocked(true);
    const got = loadState(storage, cfg);
    const p = presetLoaded.current;
    if (got.state?.built) {
      setState(got.state);
      setDraft(got.state.trip);
      if (hasPreset(p) && conflictsWithPreset(got.state, p)) setPending(p);
      else if (hasPreset(p)) onPresetHandled?.();
      if (got.source === "legacy") setMessage("We found your earlier list and carried it over.");
      if (got.source === "legacy") saveState(storage, got.state);
    } else if (got.source === "recovered") {
      setMessage("Your saved list could not be read, so we started a fresh one.");
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded || !state.built) return;
    const ok = saveState(getStorage(), state);
    setSaveBlocked(!ok);
  }, [state, loaded]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 6000);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => setUndo(null), UNDO_MS);
    return () => clearTimeout(t);
  }, [undo]);

  useEffect(() => {
    if (focusAfterUndo.current) {
      const id = focusAfterUndo.current;
      focusAfterUndo.current = null;
      document.querySelector<HTMLElement>(`#item-${id} input[type="checkbox"]`)?.focus();
    }
  });

  useEffect(() => {
    if (focusSummary.current && state.built && !editing) {
      focusSummary.current = false;
      summaryRef.current?.focus();
    }
  });

  const showList = state.built && !startFresh;
  const showSetup = !showList || editing;
  const entries = useMemo(() => activeEntries(state, cfg), [state]);
  const groups = useMemo(() => groupEntries(entries, cfg), [entries]);
  const progress = useMemo(() => progressOf(state, entries), [state, entries]);
  const extras = useMemo(() => availableExtras(state, cfg), [state]);
  const removed = useMemo(() => removedEntries(state, cfg), [state]);
  const responseFor = useCallback(
    (e: { item: Parameters<typeof buyResponseFor>[0] }) => buyResponseFor(e.item, state.trip, cfg),
    [state.trip],
  );
  const rows = useMemo(
    () => pickRows(entries, state.custom, (e) => responseFor(e)),
    [entries, state.custom, responseFor],
  );

  const touch = () => void trackToolOnce("tool_start", { tool: TOOL });
  // Any change other than a removal closes the Undo bar: it only ever undoes the latest removal.
  const update = (fn: (s: PlannerState) => PlannerState) => {
    setUndo(null);
    setState(fn);
  };

  const submit = () => {
    const prev = startFresh ? null : state;
    const isEdit = !!prev?.built;
    const next = buildList(prev, draft, cfg);
    setState(next);
    setDraft(next.trip);
    setEditing(false);
    setStartFresh(false);
    focusSummary.current = true;
    const count = activeEntries(next, cfg).length + next.custom.length;
    if (isEdit) {
      trackTool("packing_trip_edited", { tool: TOOL, count });
      setMessage(
        next.fresh.length
          ? `Trip updated. ${next.fresh.length} new ${next.fresh.length === 1 ? "suggestion was" : "suggestions were"} added.`
          : "Trip updated. Your list is up to date.",
      );
    } else {
      trackTool("tool_complete", { tool: TOOL, label: next.trip.tripType, count });
      setMessage("Your packing list is ready.");
    }
  };

  const actions: ItemActions = {
    packed: (id, value, custom) => {
      touch();
      update((s) => setPacked(s, id, value));
      if (value) trackTool("packing_item_packed", { tool: TOOL, label: custom ? "custom" : id });
    },
    buy: (id, value, custom) => {
      touch();
      update((s) => setBuy(s, id, value));
      if (value) {
        trackTool("packing_item_need_to_buy", { tool: TOOL, label: custom ? "custom" : id });
        const entry = entries.find((e) => e.item.id === id);
        if (!custom && entry && responseFor(entry).kind === "products")
          trackToolOnce("packing_recommendation_opened", { tool: TOOL, label: id });
        const name = custom
          ? state.custom.find((c) => c.id === id)?.name
          : entries.find((e) => e.item.id === id)?.item.name;
        setMessage(`${name ?? "Item"} added to your shopping list.`);
      }
    },
    exclude: (id) => {
      touch();
      const name = cfg.items.find((i) => i.id === id)?.name ?? "Item";
      update((s) => excludeItem(s, id));
      setUndo({ kind: "item", id, name });
      setMessage(
        `${name} removed from your list. Undo is available, or add it back under "Removed from your list".`,
      );
    },
    restore: (id) => {
      update((s) => restoreItem(s, id));
      setMessage(`${cfg.items.find((i) => i.id === id)?.name ?? "Item"} added back to your list.`);
    },
    undo: () => {
      if (!undo) return;
      if (undo.kind === "item") {
        setState((s) => restoreItem(s, undo.id));
        focusAfterUndo.current = undo.id;
        setMessage(`${undo.name} is back on your list.`);
      } else {
        setState((s) => reinsertCustom(s, undo.item, undo.index));
        focusAfterUndo.current = undo.item.id;
        setMessage(`${undo.name} is back on your list.`);
      }
      setUndo(null);
    },
    addIdea: (id) => {
      touch();
      update((s) => addIdea(s, id));
      setMessage(`${cfg.items.find((i) => i.id === id)?.name ?? "Item"} added to your list.`);
    },
    quantity: (id, value) => update((s) => setQuantity(s, id, value)),
    addCustom: (name, qty) => {
      touch();
      update((s) => addCustom(s, name, qty));
      trackTool("packing_custom_added", { tool: TOOL });
      setMessage("Your item was added.");
    },
    editCustom: (id, name, qty) => update((s) => editCustom(s, id, name, qty)),
    removeCustom: (id) => {
      const index = state.custom.findIndex((c) => c.id === id);
      const item = state.custom[index];
      update((s) => removeCustom(s, id));
      if (item) setUndo({ kind: "custom", item, index, name: item.name });
      setMessage(`${item?.name ?? "Your item"} was removed. Undo is available.`);
    },
  };

  const copy = async () => {
    const text = packingText(state, entries, cfg);
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Your list was copied.");
    } catch {
      setMessage("Copying was blocked by your browser. Use Print my list instead.");
    }
    trackTool("tool_copy", { tool: TOOL, count: progress.total });
  };
  const print = () => {
    trackTool("tool_print", { tool: TOOL, count: progress.total });
    window.print();
  };
  const reset = () => {
    clearState(getStorage());
    setState(emptyState(cfg));
    setDraft(defaultTrip());
    setEditing(false);
    setStartFresh(false);
    setConfirmReset(false);
    setMessage("Your list was cleared. You can build a new one.");
  };

  const conds = effectiveConditions(state.trip, cfg).map(
    (id) => cfg.conditions.find((c) => c.id === id)?.label ?? id,
  );
  const tripLabel = cfg.tripTypes.find((t) => t.id === state.trip.tripType)?.label ?? "";
  const pct = progress.total ? Math.round((progress.packed / progress.total) * 100) : 0;

  return (
    <div className="pk-root" data-hydrated={loaded ? "true" : "false"}>
      <div role="status" aria-live="polite" className="pk-sr" data-testid="pk-live">
        {message}
      </div>

      {undo && showList && (
        <div className="pk-undo no-print" role="group" aria-label="Undo removal">
          <p>{undo.name} removed from your list.</p>
          <button
            type="button"
            className="pk-btn pk-btn-sm"
            data-testid="pk-undo"
            autoFocus
            onClick={actions.undo}
          >
            <Undo2 aria-hidden="true" focusable="false" />
            Undo
          </button>
        </div>
      )}

      {pending && showList && (
        <section className="pk-banner" role="region" aria-label="You have a saved list">
          <p>
            You already have a saved list ({tripSummaryLine(state.trip, cfg)}). This link sets up{" "}
            {presetLine(pending)}. Which would you like?
          </p>
          <div className="pk-actions-row">
            <button
              type="button"
              className="pk-btn pk-btn-primary"
              onClick={() => {
                setPending(null);
                onPresetHandled?.();
              }}
            >
              Continue my saved list
            </button>
            <button
              type="button"
              className="pk-btn"
              onClick={() => {
                setDraft(draftFromPreset(pending));
                setStartFresh(true);
                setPending(null);
                onPresetHandled?.();
              }}
            >
              Start with this preset
            </button>
          </div>
        </section>
      )}

      {showSetup && (
        <TripSetup
          cfg={cfg}
          draft={draft}
          onChange={(t) => {
            touch();
            setDraft(t);
          }}
          onSubmit={submit}
          onCancel={
            showList && editing
              ? () => {
                  setEditing(false);
                  setDraft(state.trip);
                }
              : startFresh
                ? () => {
                    setStartFresh(false);
                    setDraft(state.trip);
                  }
                : undefined
          }
          editing={editing}
          presetNote={
            !state.built && hasPreset(preset)
              ? `Set up from your link: ${presetLine(preset)}. Change anything you like.`
              : undefined
          }
        />
      )}

      {showList && (
        <div className="pk-layout">
          <div className="pk-main">
            <Checklist
              groups={groups}
              custom={state.custom}
              trip={state.trip}
              cfg={cfg}
              actions={actions}
              removed={removed}
            />
            <ExtrasSection
              extras={extras}
              gearTrip={gearTripFor(state.trip, cfg)}
              onAdd={actions.addIdea}
            />
            <PickUpList rows={rows} />
          </div>
          <div className="pk-side">
            <section className="pk-summary pk-panel" aria-labelledby="pk-summary-h">
              <h2 id="pk-summary-h" tabIndex={-1} ref={summaryRef}>
                {tripTitle(state.trip, cfg)}
              </h2>
              <p className="pk-summary-line">{tripSummaryLine(state.trip, cfg)}</p>
              <p className="pk-summary-note">
                Here's what we'd plan to bring. Adjust anything that doesn't fit your trip.
              </p>
              <ul className="pk-chips" aria-label="Trip details">
                <li className="pk-chip">{tripLabel}</li>
                <li className="pk-chip">
                  {state.trip.days} {state.trip.days === 1 ? "day" : "days"}
                </li>
                <li className="pk-chip">
                  {state.trip.dogs} {state.trip.dogs === 1 ? "dog" : "dogs"}
                </li>
                {conds.map((c) => (
                  <li key={c} className="pk-chip">
                    {c}
                  </li>
                ))}
              </ul>
              <div className="pk-progress-label">
                <span data-testid="pk-progress-text">
                  {progress.packed} of {progress.total} items packed
                </span>
              </div>
              <div
                className="pk-bar"
                role="progressbar"
                aria-label="Packing progress"
                aria-valuemin={0}
                aria-valuemax={progress.total}
                aria-valuenow={progress.packed}
                aria-valuetext={`${progress.packed} of ${progress.total} items packed`}
              >
                <span style={{ width: `${pct}%` }} />
              </div>
              {progress.buy > 0 && (
                <p className="pk-buy-count" data-testid="pk-buy-count">
                  {progress.buy} {progress.buy === 1 ? "item" : "items"} to buy.{" "}
                  <a href="#pick-up">See the list</a>
                </p>
              )}
              {state.fresh.length > 0 && (
                <p className="pk-new-note" role="note">
                  {state.fresh.length} new{" "}
                  {state.fresh.length === 1 ? "suggestion was" : "suggestions were"} added for your
                  updated trip, marked "New".{" "}
                  <button
                    type="button"
                    className="pk-link-btn"
                    onClick={() => update(dismissFresh)}
                  >
                    Got it
                  </button>
                </p>
              )}
              <button
                type="button"
                className="pk-btn pk-btn-sm no-print"
                onClick={() => {
                  setDraft(state.trip);
                  setEditing(true);
                  setTimeout(
                    () => document.getElementById("pk-setup-h")?.scrollIntoView({ block: "start" }),
                    0,
                  );
                }}
              >
                <Pencil aria-hidden="true" focusable="false" />
                Edit trip
              </button>
            </section>

            <section className="pk-actions pk-panel no-print" aria-labelledby="pk-actions-h">
              <h2 id="pk-actions-h">Take it with you</h2>
              <div className="pk-actions-row">
                <button type="button" className="pk-btn pk-btn-sm" onClick={copy}>
                  <Copy aria-hidden="true" focusable="false" />
                  Copy my list
                </button>
                <button type="button" className="pk-btn pk-btn-sm" onClick={print}>
                  <Printer aria-hidden="true" focusable="false" />
                  Print my list
                </button>
                <button
                  type="button"
                  className="pk-btn pk-btn-sm pk-btn-quiet"
                  onClick={() => setConfirmReset(true)}
                  aria-expanded={confirmReset}
                >
                  <RotateCcw aria-hidden="true" focusable="false" />
                  Start over
                </button>
              </div>
              {confirmReset && (
                <div
                  className="pk-confirm"
                  role="alertdialog"
                  aria-label="Start over?"
                  aria-describedby="pk-confirm-text"
                >
                  <p id="pk-confirm-text">
                    Start over? This clears your list, quantities and extras from this device.
                  </p>
                  <div className="pk-actions-row">
                    <button
                      type="button"
                      className="pk-btn pk-btn-sm pk-btn-danger"
                      onClick={reset}
                    >
                      Yes, start over
                    </button>
                    <button
                      type="button"
                      className="pk-btn pk-btn-sm"
                      onClick={() => setConfirmReset(false)}
                      autoFocus
                    >
                      Keep my list
                    </button>
                  </div>
                </div>
              )}
              <p className="pk-privacy">
                <Save
                  aria-hidden="true"
                  focusable="false"
                  style={{
                    display: "inline",
                    width: "0.9rem",
                    height: "0.9rem",
                    marginRight: "0.3rem",
                    verticalAlign: "-0.15em",
                  }}
                />
                {saveBlocked
                  ? "Your browser is blocking saving, so this list lasts only while this page is open."
                  : "Your list saves on this device only, with no account. The site records only anonymous counts of actions such as copying or printing, never what you type or tick."}
              </p>
            </section>
          </div>

          <section className="pk-connect pk-panel no-print" aria-labelledby="pk-connect-h">
            <h2 id="pk-connect-h">Keep planning</h2>
            <ul>
              <li>
                <Link to="/guides/$slug" params={{ slug: "dog-friendly-cabin-packing-list" }}>
                  Read the dog-friendly cabin packing guide
                </Link>
              </li>
              <li>
                <Link to="/gear">Browse dog travel gear</Link>
              </li>
            </ul>
          </section>
        </div>
      )}
      {!showList && (
        <p className="pk-hint no-print" style={{ marginTop: "1rem" }}>
          Prefer to read first? The{" "}
          <Link to="/guides/$slug" params={{ slug: "dog-friendly-cabin-packing-list" }}>
            dog-friendly cabin packing guide
          </Link>{" "}
          covers what changes by cabin, season and drive.
        </p>
      )}
    </div>
  );
}
