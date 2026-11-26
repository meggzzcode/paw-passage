// Our Story: the adventures you have completed, newest first, with the memory you wrote and a keepsake on request.
// Photos are never stored: a keepsake is drawn on this device from a photo you pick, then forgotten.
import { useState } from "react";
import type { Adventure } from "@/passport/schema";
import { setMemory } from "@/passport/local-store";
import { members } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";
import { Button } from "@/components/shell/Button";
import { Keepsake } from "./Keepsake";
import { useLibrary } from "./collections-shared";

const MEMORY_MAX = 140;

function Entry({ a, at, dogName }: { a: Adventure; at: number; dogName: string | undefined }) {
  const { save } = usePassport();
  const memory = save.memories[a.id]?.text ?? "";
  const repeats = save.repeats[a.id] ?? 0;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(memory);
  const [keepsake, setKeepsake] = useState(false);
  return (
    <li className="pa-card co-entry">
      <p className="pa-kicker">
        {new Date(at).toLocaleDateString(undefined, { dateStyle: "medium" })}
      </p>
      <h3 className="pa-title">{a.title}</h3>
      {editing ? (
        <form
          className="co-stack"
          onSubmit={(e) => {
            e.preventDefault();
            setMemory(a.id, text);
            setEditing(false);
          }}
        >
          <label className="pa-field">
            <span>{a.memoryPrompt}</span>
            <textarea
              rows={3}
              maxLength={MEMORY_MAX}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <div className="pa-row">
            <button type="submit" className="pp-btn pp-btn-primary">
              Save memory
            </button>
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => {
                setText(memory);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : memory ? (
        <blockquote className="co-memory">{memory}</blockquote>
      ) : (
        <p className="pa-fine">No memory written. That is perfectly fine.</p>
      )}
      {repeats > 0 && (
        <p className="pa-fine">
          Done again {repeats} {repeats === 1 ? "time" : "times"}.
        </p>
      )}
      {!editing && (
        <div className="pa-row">
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            onClick={() => {
              setText(memory);
              setEditing(true);
            }}
          >
            {memory ? "Edit memory" : "Add a memory"}
            <span className="sr-only"> for {a.title}</span>
          </button>
          {memory && (
            <button
              type="button"
              className="pp-btn pp-btn-ghost"
              onClick={() => {
                setMemory(a.id, "");
                setText("");
              }}
            >
              Delete memory<span className="sr-only"> for {a.title}</span>
            </button>
          )}
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            aria-expanded={keepsake}
            onClick={() => setKeepsake((v) => !v)}
          >
            {keepsake ? "Hide keepsake" : "Create a keepsake"}
            <span className="sr-only"> for {a.title}</span>
          </button>
        </div>
      )}
      {keepsake && <Keepsake adventure={a} dogName={dogName} memory={memory} />}
    </li>
  );
}

export function StoryTimeline() {
  const { save, profile } = usePassport();
  const lib = useLibrary(save);
  const ids = members(save.done);
  const known = ids
    .map((id) => ({ a: lib.byId.get(id), at: save.done.added[id] ?? 0 }))
    .filter((x): x is { a: Adventure; at: number } => x.a !== undefined)
    .sort((x, y) => y.at - x.at);
  const other = ids.length - known.length;
  return (
    <>
      <p className="pa-sub" role="status">
        {ids.length === 0
          ? "No adventures completed yet. Your story starts with the first one."
          : `${ids.length} ${ids.length === 1 ? "adventure" : "adventures"} completed. Each counts once, however many collections it sits in.`}
      </p>
      {ids.length === 0 && <Button to="/discover">Find an adventure</Button>}
      {known.length > 0 && (
        <ol className="co-timeline">
          {known.map(({ a, at }) => (
            <Entry key={a.id} a={a} at={at} dogName={profile.name} />
          ))}
        </ol>
      )}
      {other > 0 && (
        <p className="pa-fine">
          {other} more {other === 1 ? "adventure" : "adventures"} from outside the free library{" "}
          {other === 1 ? "is" : "are"} counted in the total but cannot be listed here.
        </p>
      )}
      <p className="pa-fine">
        Memories are part of your passport progress (text only). No photos are saved anywhere: a
        keepsake is made on your device from a photo you choose, and you can make it again at any
        time.
      </p>
    </>
  );
}
