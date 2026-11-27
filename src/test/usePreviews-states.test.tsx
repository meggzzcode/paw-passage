// The hook and fetch layer must never turn a failed request into an empty catalogue.
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPreviewsResult } from "@/lib/previews";

const ok = (body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status: 200, headers });

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

describe("fetchPreviewsResult", () => {
  it("distinguishes network failure, server error, missing configuration and a genuine empty answer", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    expect(await fetchPreviewsResult()).toEqual({ ok: false, kind: "network" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("x", { status: 500 })));
    expect(await fetchPreviewsResult()).toEqual({ ok: false, kind: "server" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("x", { status: 503 })));
    expect(await fetchPreviewsResult()).toEqual({ ok: false, kind: "unavailable" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>", { status: 200 })));
    expect(await fetchPreviewsResult()).toEqual({ ok: false, kind: "server" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok({ items: [], total: 0, collections: 0 })));
    expect(await fetchPreviewsResult()).toEqual({
      ok: true,
      data: { items: [], total: 0, collections: 0 },
      synthetic: false,
    });
  });

  it("reports the synthetic marker without changing the data", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(ok({ items: [], total: 0, collections: 0 }, { "x-pp-synthetic": "1" })),
    );
    expect((await fetchPreviewsResult()) as { synthetic: boolean }).toMatchObject({
      synthetic: true,
    });
  });
});

describe("usePreviews", () => {
  it("is loading, then unavailable on failure, and Retry recovers", async () => {
    const f = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("offline"))
      .mockResolvedValue(ok({ items: [], total: 0, collections: 0 }));
    vi.stubGlobal("fetch", f);
    const { usePreviews } = await import("@/lib/usePreviews");
    const { result } = renderHook(() => usePreviews());
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("unavailable"));
    expect(result.current.failure).toBe("network");
    act(() => result.current.retry?.());
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.data?.items).toEqual([]);
    expect(f).toHaveBeenCalledTimes(2);
  });
});
