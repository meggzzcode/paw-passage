// "Save for later", one behavior everywhere: a single tap keeps the adventure (by its stable id) in the Saved list, with
// an immediate, plain confirmation that says where it went. Saving never asks for a collection and never marks anything
// done. Adding it to a personal collection stays a separate, optional step (the More menu on a revealed adventure).
import { useState } from "react";
import { saveForLater, unsaveForLater } from "@/passport/local-store";
import { has } from "@/passport/progress";
import { track } from "@/passport/events";
import { usePassport } from "@/passport/usePassport";
import { markMysterySaved } from "./RevealSurface";

export const SAVE_LABEL = "Save for later";
export const SAVED_LABEL = "Saved for later ✓";
export const SAVED_WHERE =
  "Saved for later. Find it in My Passport under Our bucket list, or in Collections under Saved.";
export const SAVED_MYSTERY_WHERE =
  "Saved for later, still a mystery. Find it in My Passport under Our bucket list, or in Collections under Saved, and reveal it when you're ready.";
export const UNSAVED_NOTE = "Removed from your saved adventures.";

export function useSaveForLater(adventureId: string, mystery = false) {
  const { save } = usePassport();
  const later = has(save.saved, adventureId);
  const [said, setSaid] = useState<{ id: string; text: string }>({ id: "", text: "" });
  function toggle() {
    if (later) {
      unsaveForLater(adventureId);
      if (mystery) markMysterySaved(adventureId, false);
      setSaid({ id: adventureId, text: UNSAVED_NOTE });
      return;
    }
    saveForLater(adventureId);
    if (mystery) markMysterySaved(adventureId, true);
    track("adventure_saved", { adventure: adventureId });
    setSaid({ id: adventureId, text: mystery ? SAVED_MYSTERY_WHERE : SAVED_WHERE });
  }
  // The confirmation belongs to the adventure on screen: a different card never shows the previous one's message.
  const message = said.id === adventureId ? said.text : "";
  return { later, message, toggle };
}
