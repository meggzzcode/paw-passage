// Loads the public previews once per page view. "unavailable" means the request FAILED (network, server error or
// missing configuration): it is never the same as a genuinely empty catalogue, which is status "ready" with no items.
// Callers show a calm error with Retry (or fall back to local counts), never "no previews".
import { useCallback, useEffect, useState } from "react";
import { fetchPreviewsResult, type PreviewsFailure, type PreviewsResponse } from "./previews";

export type PreviewsState = {
  status: "loading" | "ready" | "unavailable";
  data: PreviewsResponse | null;
  /** Why it is unavailable. Absent unless status is "unavailable". */
  failure?: PreviewsFailure;
  /** Run the request again. Optional so test doubles need not provide it. */
  retry?: () => void;
};

type Result = Awaited<ReturnType<typeof fetchPreviewsResult>>;
let cache: Promise<Result> | null = null;

export function usePreviews(): PreviewsState {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<Omit<PreviewsState, "retry">>({
    status: "loading",
    data: null,
  });
  const retry = useCallback(() => {
    cache = null;
    setState({ status: "loading", data: null });
    setAttempt((n) => n + 1);
  }, []);
  useEffect(() => {
    let live = true;
    cache ??= fetchPreviewsResult().then((r) => {
      if (!r.ok) cache = null; // let a later view retry after a failure
      return r;
    });
    void cache.then((r) => {
      if (!live) return;
      setState(
        r.ok
          ? { status: "ready", data: r.data }
          : { status: "unavailable", data: null, failure: r.kind },
      );
    });
    return () => {
      live = false;
    };
  }, [attempt]);
  return { ...state, retry };
}
