import { useId, useState } from "react";
import { addToCustomCollection, newCollection } from "@/passport/local-store";
import { listCollections, newCollectionId } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";

/** Adds an adventure to one of the visitor's own collections, or starts a new one. */
export function AddToCollection({ adventureId, title }: { adventureId: string; title: string }) {
  const { save } = usePassport();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const panel = useId();
  const mine = listCollections(save);

  function create() {
    const clean = name.trim().slice(0, 60);
    if (!clean) return;
    newCollection({ id: newCollectionId(), kind: "handpicked", name: clean, ids: [adventureId] });
    setNote(`Added to “${clean}”.`);
    setName("");
  }

  return (
    <div className="pd-addto">
      <button
        type="button"
        className="pp-btn pp-btn-ghost"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen((v) => !v)}
      >
        Add to collection
      </button>
      {open && (
        <div
          className="pd-popover"
          id={panel}
          role="group"
          aria-label={`Add ${title} to a collection`}
        >
          {mine.length > 0 && (
            <ul className="pd-plain">
              {mine.map((c) => {
                const has = c.kind === "handpicked" && c.ids.includes(adventureId);
                return (
                  <li key={c.id}>
                    {c.kind === "handpicked" ? (
                      <button
                        type="button"
                        className="pp-btn pp-btn-ghost"
                        disabled={has}
                        onClick={() => {
                          addToCustomCollection(c.id, adventureId);
                          setNote(`Added to “${c.name}”.`);
                        }}
                      >
                        {has ? `✓ In ${c.name}` : c.name}
                      </button>
                    ) : (
                      <span className="pa-fine">{c.name} (a smart collection fills itself)</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <form
            className="pa-row"
            onSubmit={(e) => {
              e.preventDefault();
              create();
            }}
          >
            <label className="pa-field pd-grow">
              <span>New collection name</span>
              <input
                value={name}
                maxLength={60}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button type="submit" className="pp-btn pp-btn-secondary" disabled={!name.trim()}>
              Create and add
            </button>
          </form>
          <p className="pa-fine" role="status">
            {note}
          </p>
        </div>
      )}
    </div>
  );
}
