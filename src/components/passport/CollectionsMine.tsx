// "My Collections": hand-picked lists and smart (saved-filter) collections, created and listed here, edited in CollectionEditor.
import { useId, useState } from "react";
import { describeFilters } from "@/passport/engine";
import { newCollection } from "@/passport/local-store";
import { newCollectionId, listCollections, collectionProgress } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";
import { AppLink } from "@/components/shell/AppLink";
import { memberIdsOf, smartTemplates, useLibrary } from "./collections-shared";

const MAX_NAME = 60;

function CreateForm({
  kind,
  label,
  hint,
}: {
  kind: "handpicked" | "smart";
  label: string;
  hint: string;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <form
      className="pa-card"
      onSubmit={(e) => {
        e.preventDefault();
        const n = name.trim().slice(0, MAX_NAME);
        if (!n) {
          setMsg("Give it a name first.");
          return;
        }
        const cid = newCollectionId();
        newCollection(
          kind === "smart"
            ? { id: cid, kind: "smart", name: n, filters: {} }
            : { id: cid, kind: "handpicked", name: n, ids: [] },
        );
        setName("");
        setMsg(
          `Created “${n}”. Open it from the list below to ${kind === "smart" ? "choose its filters" : "add adventures"}.`,
        );
      }}
    >
      <label className="pa-field" htmlFor={id}>
        <span>{label}</span>
        <input
          id={id}
          value={name}
          maxLength={MAX_NAME}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </label>
      <p className="pa-fine">{hint}</p>
      <div className="pa-row">
        <button type="submit" className="pp-btn pp-btn-primary">
          {kind === "smart" ? "Create smart collection" : "Create hand-picked collection"}
        </button>
      </div>
      {msg && <p role="status">{msg}</p>}
    </form>
  );
}

export function MyCollections() {
  const { save, profile } = usePassport();
  const lib = useLibrary(save);
  const cols = listCollections(save);
  const templates = smartTemplates(profile.name);
  const [made, setMade] = useState("");

  return (
    <section aria-labelledby="mine-h" className="co-stack">
      <h2 id="mine-h" className="pa-h">
        My collections
      </h2>
      <p className="pa-fine">
        Hand-picked collections are lists you build one adventure at a time. Smart collections save
        a set of filters and fill themselves. They live on this device with the rest of your
        passport.
      </p>

      {cols.length === 0 ? (
        <div className="pa-card">
          <p>
            You have no collections of your own yet. Start with a one-tap smart collection, or make
            a list by hand below.
          </p>
        </div>
      ) : (
        <ul className="pa-list">
          {cols.map((c) => {
            const ids = memberIdsOf(c, lib, save);
            const p = collectionProgress(save, c, ids);
            return (
              <li key={c.id} className="pa-card">
                <p className="pa-kicker">
                  {c.kind === "smart" ? "Smart collection" : "Hand-picked"}
                </p>
                <h3 className="pa-title">
                  <AppLink to={`/collections/mine/${c.id}`}>{c.name}</AppLink>
                </h3>
                <p className="pa-fine">
                  {p.done} of {p.total} done
                  {c.kind === "smart" ? " (the adventures that match right now)" : ""}
                </p>
                {c.kind === "smart" && (
                  <ul className="pa-meta" aria-label="Saved filters">
                    {describeFilters(c.filters).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="pa-card">
        <h3 className="pa-h">Start from an idea</h3>
        <p className="pa-fine">One tap makes a smart collection you can change later.</p>
        <ul className="co-templates">
          {templates.map((t) => {
            const exists = cols.some((c) => c.name === t.name);
            return (
              <li key={t.name}>
                <button
                  type="button"
                  className="pa-listbtn"
                  disabled={exists}
                  onClick={() => {
                    newCollection({
                      id: newCollectionId(),
                      kind: "smart",
                      name: t.name,
                      filters: t.filters,
                    });
                    setMade(`Created “${t.name}”.`);
                  }}
                >
                  <strong>{t.name}</strong>
                  <span className="pa-fine">{exists ? "Already added" : t.blurb}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {made && <p role="status">{made}</p>}
      </div>

      <CreateForm
        kind="handpicked"
        label="Name a hand-picked collection"
        hint="For example: Our Weekend Bucket List. You choose every adventure yourself."
      />
      <CreateForm
        kind="smart"
        label="Name a smart collection"
        hint="You will choose its filters next. Its members update whenever your profile or filters change."
      />
    </section>
  );
}
