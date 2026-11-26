// What the Discover screens share: the library, who it is for, and what has been done.
import { useAdventureLibrary } from "./collections-shared";
import type { Ctx, History } from "@/passport/engine";
import type { DogProfile } from "@/passport/profile";
import { members } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";

export function useDiscoverData() {
  const { save, profile } = usePassport();
  const { all: library, unlocked } = useAdventureLibrary();
  const dog: DogProfile = profile;
  const ctx: Ctx = { dog, owner: save.owner.data, unlocked };
  const history: History = {
    done: new Set(members(save.done)),
    favorites: new Set(members(save.favorites)),
    skipped: new Set<string>(),
    feedback: Object.fromEntries(Object.entries(save.feedback).map(([k, v]) => [k, v.value])),
  };
  return { save, dog, library, ctx, history };
}
