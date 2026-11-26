// One custom collection: rename, add/remove/reorder (hand-picked), edit saved filters (smart), reveal a random one, delete.
import { useState } from "react";
import type { Adventure } from "@/passport/schema";
import { describeFilters, pickSurprise } from "@/passport/engine";
import {
  addToCustomCollection,
  deleteCustomCollection,
  removeFromCustomCollection,
  renameCustomCollection,
  reorderCustomCollection,
  updateSmartFilters,
} from "@/passport/local-store";
import { collectionProgress, listCollections, members } from "@/passport/progress";
import type { CustomCollection, SessionFilters } from "@/passport/profile";
import { usePassport } from "@/passport/usePassport";
import { AppLink } from "@/components/shell/AppLink";
import { RevealedCard } from "./AdventureCard";
import {
  AdventureRow,
  costText,
  ctxFor,
  historyFor,
  memberIdsOf,
  timeText,
  useLibrary,
} from "./collections-shared";

const MAX_NAME = 60;

function Rename({ c }: { c: CustomCollection }) {
  const [name, setName] = useState(c.name);
  const [msg, setMsg] = useState("");
  return (
    <form
      className="co-inline"
      onSubmit={(e) => {
        e.preventDefault();
        const n = name.trim().slice(0, MAX_NAME);
        if (!n) {
          setMsg("A collection needs a name.");
          return;
        }
        renameCustomCollection(c.id, n);
        setName(n);
        setMsg("Renamed.");
      }}
    >
      <label className="pa-field co-grow">
        <span>Name</span>
        <input
          value={name}
          maxLength={MAX_NAME}
          onChange={(e) => {
            setName(e.target.value);
            setMsg("");
          }}
          autoComplete="off"
        />
      </label>
      <button type="submit" className="pp-btn pp-btn-secondary">
        Rename
      </button>
      {msg && (
        <p role="status" className="pa-fine">
          {msg}
        </p>
      )}
    </form>
  );
}

function DeleteControl({ c, onDeleted }: { c: CustomCollection; onDeleted: () => void }) {
  const [ask, setAsk] = useState(false);
  if (!ask)
    return (
      <button type="button" className="pp-btn pp-btn-ghost" onClick={() => setAsk(true)}>
        Delete collection
      </button>
    );
  return (
    <div className="pa-card" role="alertdialog" aria-label="Confirm delete">
      <p>
        Delete “{c.name}”? The adventures themselves, and anything you completed, stay exactly as
        they are.
      </p>
      <div className="pa-row">
        <button
          type="button"
          className="pp-btn pp-btn-primary"
          onClick={() => {
            deleteCustomCollection(c.id);
            onDeleted();
          }}
        >
          Yes, delete it
        </button>
        <button type="button" className="pp-btn pp-btn-secondary" onClick={() => setAsk(false)}>
          Keep it
        </button>
      </div>
    </div>
  );
}

type Opt<T> = { label: string; value: T | undefined };
const MINUTES: Opt<number>[] = [
  { label: "Any time", value: undefined },
  { label: "5 min or less", value: 5 },
  { label: "15 min or less", value: 15 },
  { label: "30 min or less", value: 30 },
  { label: "An hour or less", value: 60 },
];
const BUDGET: Opt<number>[] = [
  { label: "Any budget", value: undefined },
  { label: "Free", value: 0 },
  { label: "Up to $10", value: 10 },
  { label: "Up to $25", value: 25 },
];
const SETTING: Opt<"indoor" | "outdoor">[] = [
  { label: "Indoors or out", value: undefined },
  { label: "Indoors", value: "indoor" },
  { label: "Outdoors", value: "outdoor" },
];
const PREP: Opt<"none" | "light" | "some">[] = [
  { label: "Any prep", value: undefined },
  { label: "No prep", value: "none" },
  { label: "Light prep at most", value: "light" },
];
const TRANSPORT: Opt<"none-or-walk">[] = [
  { label: "Car is fine", value: undefined },
  { label: "Home or on foot", value: "none-or-walk" },
];
const NOVELTY: Opt<"new-only" | "done-only">[] = [
  { label: "New and done", value: undefined },
  { label: "Not done yet", value: "new-only" },
  { label: "Already done", value: "done-only" },
];
const ENERGY = ["gentle", "moderate", "lively"] as const;

function Pick<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Opt<T>[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
}) {
  const idx = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  return (
    <label className="pa-field">
      <span>{label}</span>
      <select
        className="co-select"
        value={idx}
        onChange={(e) => onChange(options[Number(e.target.value)]?.value)}
      >
        {options.map((o, i) => (
          <option key={o.label} value={i}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** A compact filter editor (the full filter panel belongs to Discover). Saves one explicit change at a time. */
function SmartFilterEditor({ c }: { c: Extract<CustomCollection, { kind: "smart" }> }) {
  const f = c.filters;
  const [draft, setDraft] = useState<SessionFilters>(f);
  const [msg, setMsg] = useState("");
  const set = <K extends keyof SessionFilters>(k: K, v: SessionFilters[K] | undefined) => {
    setMsg("");
    setDraft((d) => {
      const n = { ...d };
      if (v === undefined || (Array.isArray(v) && v.length === 0)) delete n[k];
      else n[k] = v;
      return n;
    });
  };
  const energy = draft.energy ?? [];
  return (
    <form
      className="pa-card"
      aria-label="Edit filters"
      onSubmit={(e) => {
        e.preventDefault();
        updateSmartFilters(c.id, draft);
        setMsg("Filters saved. The list below has updated.");
      }}
    >
      <h3 className="pa-h">Filters</h3>
      <div className="co-fields">
        <Pick
          label="Time"
          options={MINUTES}
          value={draft.minutes}
          onChange={(v) => set("minutes", v)}
        />
        <Pick
          label="Budget"
          options={BUDGET}
          value={draft.budget}
          onChange={(v) => set("budget", v)}
        />
        <Pick
          label="Where"
          options={SETTING}
          value={draft.setting}
          onChange={(v) => set("setting", v)}
        />
        <Pick
          label="Preparation"
          options={PREP}
          value={draft.prep}
          onChange={(v) => set("prep", v)}
        />
        <Pick
          label="Getting there"
          options={TRANSPORT}
          value={draft.transport === "any" ? undefined : draft.transport}
          onChange={(v) => set("transport", v)}
        />
        <Pick
          label="New or done"
          options={NOVELTY}
          value={draft.novelty === "any" ? undefined : draft.novelty}
          onChange={(v) => set("novelty", v)}
        />
      </div>
      <fieldset className="pa-field">
        <legend>Energy</legend>
        <div className="pa-chips">
          {ENERGY.map((e) => (
            <button
              key={e}
              type="button"
              className="pa-chip"
              aria-pressed={energy.includes(e)}
              onClick={() =>
                set("energy", energy.includes(e) ? energy.filter((x) => x !== e) : [...energy, e])
              }
            >
              {e[0]!.toUpperCase() + e.slice(1)}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="pa-check">
        <input
          type="checkbox"
          checked={draft.foodFree === true}
          onChange={(e) => set("foodFree", e.target.checked ? true : undefined)}
        />
        No food or treats
      </label>
      <label className="pa-check">
        <input
          type="checkbox"
          checked={draft.quiet === true}
          onChange={(e) => set("quiet", e.target.checked ? true : undefined)}
        />
        Quiet only
      </label>
      <label className="pa-check">
        <input
          type="checkbox"
          checked={draft.favoritesOnly === true}
          onChange={(e) => set("favoritesOnly", e.target.checked ? true : undefined)}
        />
        Favorites only
      </label>
      <div className="pa-row">
        <button type="submit" className="pp-btn pp-btn-primary">
          Save filters
        </button>
      </div>
      {msg && <p role="status">{msg}</p>}
    </form>
  );
}

function HandpickedMembers({ c }: { c: Extract<CustomCollection, { kind: "handpicked" }> }) {
  const { save, profile } = usePassport();
  const lib = useLibrary(save);
  const [q, setQ] = useState("");
  const doneIds = new Set(members(save.done));
  const inSet = new Set(c.ids);
  const candidates = lib.eligible
    .filter((a) => !inSet.has(a.id))
    .filter((a) => a.title.toLowerCase().includes(q.trim().toLowerCase()));
  const move = (i: number, d: -1 | 1) => {
    const next = [...c.ids];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    reorderCustomCollection(c.id, next);
  };
  return (
    <>
      <h3 className="pa-h">In this collection</h3>
      {c.ids.length === 0 ? (
        <p className="pa-fine">Nothing here yet. Add adventures from the list below.</p>
      ) : (
        <ul className="co-list">
          {c.ids.map((id, i) => {
            const a = lib.byId.get(id);
            const controls = (
              <>
                <button
                  type="button"
                  className="pp-btn pp-btn-ghost"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  Move up
                  <span className="sr-only"> {a?.title ?? "this adventure"}</span>
                </button>
                <button
                  type="button"
                  className="pp-btn pp-btn-ghost"
                  disabled={i === c.ids.length - 1}
                  onClick={() => move(i, 1)}
                >
                  Move down
                  <span className="sr-only"> {a?.title ?? "this adventure"}</span>
                </button>
                <button
                  type="button"
                  className="pp-btn pp-btn-ghost"
                  onClick={() => removeFromCustomCollection(c.id, id)}
                >
                  Remove
                  <span className="sr-only"> {a?.title ?? "this adventure"}</span>
                </button>
              </>
            );
            return a ? (
              <AdventureRow
                key={id}
                a={a}
                done={doneIds.has(id)}
                dogName={profile.name}
                note={
                  lib.eligibleIds.has(id)
                    ? undefined
                    : "doesn't suit your dog's profile right now, so it isn't counted"
                }
                actions={controls}
              />
            ) : (
              <li key={id} className="co-row">
                <div className="co-row-main">
                  <p className="co-row-title">An adventure from the full Passport</p>
                  <p className="pa-fine">Not in the free library, so it isn't counted here.</p>
                </div>
                <div className="co-row-actions">{controls}</div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="pa-card">
        <h3 className="pa-h">Add adventures</h3>
        <p className="pa-fine">Only adventures that suit your dog are offered.</p>
        <label className="pa-field">
          <span>Search by title</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        </label>
        {candidates.length === 0 ? (
          <p className="pa-fine">Nothing more to add{q ? " for that search" : ""}.</p>
        ) : (
          <ul className="co-list">
            {candidates.map((a: Adventure) => (
              <li key={a.id} className="co-row">
                <div className="co-row-main">
                  <p className="co-row-title">{a.title}</p>
                  <p className="pa-fine">
                    {timeText(a)} · {costText(a)}
                  </p>
                </div>
                <div className="co-row-actions">
                  <button
                    type="button"
                    className="pp-btn pp-btn-secondary"
                    onClick={() => addToCustomCollection(c.id, a.id)}
                  >
                    Add<span className="sr-only"> {a.title}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function SmartMembers({ c }: { c: Extract<CustomCollection, { kind: "smart" }> }) {
  const { save, profile } = usePassport();
  const lib = useLibrary(save);
  const doneIds = new Set(members(save.done));
  const ids = memberIdsOf(c, lib, save);
  return (
    <>
      <SmartFilterEditor key={JSON.stringify(c.filters)} c={c} />
      <h3 className="pa-h">Matching right now</h3>
      <p className="pa-fine">
        Progress counts the adventures that match right now. Change your dog's profile or these
        filters and the list changes with them.
      </p>
      {ids.length === 0 ? (
        <p className="pa-fine">Nothing matches right now. Try loosening a filter.</p>
      ) : (
        <ul className="co-list">
          {ids.map((id) => {
            const a = lib.byId.get(id);
            return a ? (
              <AdventureRow key={id} a={a} done={doneIds.has(id)} dogName={profile.name} />
            ) : null;
          })}
        </ul>
      )}
    </>
  );
}

export function CollectionEditor({ id }: { id: string }) {
  const { ready, save, profile } = usePassport();
  const lib = useLibrary(save);
  const [picked, setPicked] = useState<Adventure | null>(null);
  const [nothing, setNothing] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const c = listCollections(save).find((x) => x.id === id);

  if (!ready) return <div aria-busy="true" />;
  if (deleted)
    return (
      <>
        <h1 className="pa-h1">Collection deleted</h1>
        <p className="pa-sub" role="status">
          The adventures themselves are still in your passport.
        </p>
        <AppLink
          to="/collections"
          search={{ tab: "mine" } as never}
          className="pp-btn pp-btn-primary"
        >
          Back to my collections
        </AppLink>
      </>
    );
  if (!c)
    return (
      <>
        <h1 className="pa-h1">Collection not found</h1>
        <p className="pa-sub">
          Collections live on the device that made them. It may have been deleted, or created on
          another device.
        </p>
        <AppLink
          to="/collections"
          search={{ tab: "mine" } as never}
          className="pp-btn pp-btn-primary"
        >
          Back to my collections
        </AppLink>
      </>
    );

  const p = collectionProgress(save, c, memberIdsOf(c, lib, save));
  return (
    <>
      <p className="pa-kicker">
        {c.kind === "smart" ? "Smart collection" : "Hand-picked collection"}
      </p>
      <h1 className="pa-h1">{c.name}</h1>
      <p className="pa-sub">
        {c.kind === "smart"
          ? "Fills itself from saved filters."
          : "A list you choose and order yourself."}
      </p>
      {c.kind === "smart" && (
        <ul className="pa-meta" aria-label="Saved filters">
          {describeFilters(c.filters).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      <p role="status" className="pa-fine">
        {p.done} of {p.total} done
        {c.kind === "smart" ? ". Progress counts the adventures that match right now." : ""}
      </p>
      <progress
        className="co-progress"
        value={p.done}
        max={Math.max(p.total, 1)}
        aria-label={`${p.done} of ${p.total} done`}
      />

      <Rename key={c.name} c={c} />

      <div className="pa-row">
        <button
          type="button"
          className="pp-btn pp-btn-primary"
          onClick={() => {
            const a = pickSurprise(
              lib.all,
              { kind: "custom", id: c.id },
              ctxFor(save, lib.unlocked),
              {},
              historyFor(save),
              listCollections(save),
              { seed: String(Date.now()) },
            );
            setPicked(a);
            setNothing(a === null);
          }}
        >
          Reveal a random one
        </button>
      </div>
      {nothing && (
        <p role="status" className="pa-fine">
          Nothing left to reveal: this collection is empty, or everything in it that suits your dog
          is already done.
        </p>
      )}
      {picked && <RevealedCard a={picked} dogName={profile.name} />}

      {c.kind === "smart" ? <SmartMembers c={c} /> : <HandpickedMembers c={c} />}

      <DeleteControl c={c} onDeleted={() => setDeleted(true)} />
      <p>
        <AppLink to="/collections" search={{ tab: "mine" } as never} className="pa-linkbtn">
          All my collections
        </AppLink>
      </p>
    </>
  );
}
