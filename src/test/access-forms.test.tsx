import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderUi } from "./collections-fixtures";
import { AccessForm, FAILURE_TEXT } from "@/components/passport/AccessForms";
import { _resetForTests } from "@/passport/local-store";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);

const CODE = "TESTCODE-12345678";
const reply = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }));
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function submit(kind: "activate" | "restore", code = CODE) {
  await renderUi(<AccessForm kind={kind} />);
  fireEvent.change(screen.getByLabelText("Purchase code"), { target: { value: code } });
  fireEvent.click(
    screen.getByRole("button", { name: kind === "restore" ? "Restore access" : "Activate" }),
  );
}

describe("access forms", () => {
  it("activates: sends the code only in the POST body, never in the URL, and clears it", async () => {
    fetchMock.mockReturnValue(
      reply(200, { ok: true, reason: "activated", entitled: true, csrf: "c", save: null, rev: 1 }),
    );
    await submit("activate");
    expect(await screen.findByText(/purchase is confirmed/i)).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("/api/access/activate");
    expect(init.method).toBe("POST");
    expect(String(url)).not.toContain(CODE);
    expect(JSON.parse(init.body).code).toBe(CODE);
    expect((screen.getByLabelText("Purchase code") as HTMLInputElement).value).toBe("");
    expect(JSON.stringify(window.localStorage)).not.toContain(CODE);
  });

  it("restores on a new device with the plain explanation", async () => {
    fetchMock.mockReturnValue(
      reply(200, { ok: true, reason: "restored", entitled: true, csrf: "c", save: null }),
    );
    await renderUi(<AccessForm kind="restore" />);
    expect(screen.getByText(/No second purchase needed/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Purchase code"), { target: { value: CODE } });
    fireEvent.click(screen.getByRole("button", { name: "Restore access" }));
    expect(await screen.findByText(/Access is restored on this device/)).toBeInTheDocument();
    expect(fetchMock.mock.calls[0]![0]).toBe("/api/access/restore");
  });

  const failures: [string, number, unknown, keyof typeof FAILURE_TEXT][] = [
    ["invalid", 403, { ok: false, error: "invalid_code", reason: "invalid_code" }, "invalid_code"],
    ["refunded", 403, { ok: false, error: "refunded", reason: "refunded" }, "refunded"],
    ["disputed", 403, { ok: false, error: "disputed", reason: "disputed" }, "disputed"],
    [
      "unavailable",
      503,
      { ok: false, error: "provider_unavailable", reason: "provider_unavailable" },
      "unavailable",
    ],
    ["rate limited", 429, { ok: false, error: "rate_limited" }, "rate_limited"],
  ];
  for (const [label, status, body, key] of failures)
    it(`shows a truthful message when ${label}`, async () => {
      fetchMock.mockReturnValue(reply(status, body));
      await submit("activate");
      expect(await screen.findByText(FAILURE_TEXT[key])).toBeInTheDocument();
      expect(screen.queryByText(/confirmed|restored/i)).not.toBeInTheDocument();
    });

  it("reports a network failure separately from a bad code", async () => {
    fetchMock.mockRejectedValue(new TypeError("offline"));
    await submit("activate");
    expect(await screen.findByText(FAILURE_TEXT.network)).toBeInTheDocument();
  });

  it("rejects an obviously malformed code without calling the server", async () => {
    await submit("activate", "short");
    expect(await screen.findByText(FAILURE_TEXT.invalid_format)).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).not.toHaveBeenCalled());
  });

  it("retries without the local copy if the server rejects it", async () => {
    fetchMock
      .mockReturnValueOnce(reply(400, { ok: false, error: "bad_local_save" }))
      .mockReturnValueOnce(
        reply(200, { ok: true, reason: "already_active", csrf: "c", save: null }),
      );
    await submit("activate");
    expect(await screen.findByText(/already active/i)).toBeInTheDocument();
    expect(JSON.parse(fetchMock.mock.calls[1]![1].body)).toEqual({ code: CODE });
  });
});
