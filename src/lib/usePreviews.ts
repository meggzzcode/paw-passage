// Loads the public previews once per page view. "unavailable" means callers should use local counts and plain wording.
import { useEffect, useState } from "react";
import { fetchPreviews, type PreviewsResponse } from "./previews";

export type PreviewsState = {
  status: "loading" | "ready" | "unavailable";
  data: PreviewsResponse | null;
};

let cache: Promise<PreviewsResponse | null> | null = null;

export function usePreviews(): PreviewsState {
  const [state, setState] = useState<PreviewsState>({ status: "loading", data: null });
  useEffect(() => {
    let live = true;
    cache ??= fetchPreviews().then((v) => {
      if (!v) cache = null; // let a later view retry after a failure
      return v;
    });
    void cache.then((v) => {
      if (live) setState(v ? { status: "ready", data: v } : { status: "unavailable", data: null });
    });
    return () => {
      live = false;
    };
  }, []);
  return state;
}
