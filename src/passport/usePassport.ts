// React bindings for the local progress store. Rendering waits for the browser copy so the server HTML and the first
// client render match (no hydration mismatch for returning visitors).
import { useEffect, useState, useSyncExternalStore } from "react";
import { getSave, getSaveState, subscribe, type SaveState } from "./local-store";
import { emptySave, has, members, type Save } from "./progress";
import type { DogProfile } from "./profile";

const serverSave = emptySave();

export function usePassport(): {
  ready: boolean;
  save: Save;
  saveState: SaveState;
  profile: DogProfile & { skipped?: boolean };
} {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const save = useSyncExternalStore(subscribe, getSave, () => serverSave);
  const saveState = useSyncExternalStore(subscribe, getSaveState, () => "saved" as SaveState);
  return {
    ready,
    save: ready ? save : serverSave,
    saveState,
    profile: (ready ? save : serverSave).profile.data as DogProfile & { skipped?: boolean },
  };
}

export const isDone = (s: Save, id: string) => has(s.done, id);
export const doneSet = (s: Save) => new Set(members(s.done));
