// @vitest-environment jsdom
// Launch gate for install prompts: hidden by default; with the gate mocked on, shown only after purchase, activation and
// a successful first sync; never in the free flow; /install is not linked and is noindex.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const gate = vi.hoisted(() => ({ on: false }));
const state = vi.hoisted(() => ({ ent: "entitled", sync: "saved" }));

vi.mock("@/lib/pwa", async (orig) => {
  const m = await orig<typeof import("@/lib/pwa")>();
  return {
    ...m,
    get PWA_PROMPTS_ENABLED() {
      return gate.on;
    },
  };
});
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({ status: state.ent, signedIn: state.ent === "entitled", premium: [] }),
}));
vi.mock("@/passport/useSync", () => ({
  useSyncState: () => ({ status: state.sync, label: null }),
}));
vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ to, children, ...r }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...r}>
      {children}
    </a>
  ),
}));

import { InstallPrompt } from "@/components/site/InstallPrompt";
import { InstallCard } from "@/components/site/InstallCard";
import * as pwa from "@/lib/pwa";

const HEAD = "Keep your adventures one tap away.";
const CARD = "Add to your home screen";

beforeEach(() => {
  cleanup();
  window.localStorage.clear();
  window.matchMedia = (() => ({ matches: false })) as never;
  gate.on = false;
  state.ent = "entitled";
  state.sync = "saved";
});
afterEach(cleanup);

describe("pwaInstallPrompts launch gate", () => {
  it("ships OFF", () => {
    // The real module (not the mock getter): the constant itself must be false at launch.
    const src = readFileSync("src/lib/pwa.ts", "utf8");
    expect(src).toMatch(/export const PWA_PROMPTS_ENABLED = false;/);
    expect(pwa.INSTALL_COOLDOWN_MS).toBe(90 * 24 * 60 * 60 * 1000);
  });
  it("prompt and card render nothing while the gate is off, even for a synced customer", () => {
    const a = render(<InstallPrompt where="t" />);
    expect(a.container.innerHTML).toBe("");
    const b = render(<InstallCard />);
    expect(b.container.innerHTML).toBe("");
  });
  it("with the gate on: shown only for an entitled customer whose first sync succeeded", () => {
    gate.on = true;
    render(<InstallPrompt where="t" />);
    expect(screen.getByText(HEAD)).toBeTruthy();
    cleanup();
    render(<InstallCard />);
    expect(screen.getByText(CARD)).toBeTruthy();
  });
  it.each([
    ["free visitor", "free", "off"],
    ["still checking", "checking", "idle"],
    ["revoked", "revoked", "saved"],
    ["entitled but sync not yet confirmed", "entitled", "idle"],
    ["entitled, syncing", "entitled", "saving"],
    ["entitled, offline", "entitled", "offline"],
    ["entitled, sync error", "entitled", "error"],
  ])("with the gate on, hidden for %s", (_n, ent, sync) => {
    gate.on = true;
    state.ent = ent;
    state.sync = sync;
    render(<InstallPrompt where="t" />);
    expect(screen.queryByText(HEAD)).toBeNull();
    cleanup();
    render(<InstallCard />);
    expect(screen.queryByText(CARD)).toBeNull();
  });
  it("keeps the 90-day dismissal cooldown", () => {
    gate.on = true;
    window.localStorage.setItem(pwa.INSTALL_DISMISS_KEY, String(Date.now() - 1000));
    render(<InstallPrompt where="t" />);
    expect(screen.queryByText(HEAD)).toBeNull();
  });
  it("is hidden inside the installed app", () => {
    gate.on = true;
    window.matchMedia = ((q: string) => ({ matches: q.includes("standalone") })) as never;
    render(<InstallPrompt where="t" />);
    expect(screen.queryByText(HEAD)).toBeNull();
  });
});

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|ts)$/.test(f) && !/routeTree\.gen|\.test\./.test(f)) out.push(p);
  }
  return out;
}

describe("free flow and discoverability", () => {
  it("FreeStarter does not mount InstallPrompt or InstallCard", () => {
    const src = readFileSync("src/components/passport/FreeStarter.tsx", "utf8");
    expect(src).not.toMatch(/InstallPrompt|InstallCard|components\/site\/Install/);
  });
  it("only the install components and the notification settings note refer to /install", () => {
    const hits = walk("src")
      .filter((f) => {
        const t = readFileSync(f, "utf8");
        return /["'`]\/install["'`]|INSTALL_GUIDE_PATH/.test(t);
      })
      .map((f) => f.replace(/\\/g, "/"))
      .sort();
    expect(hits).toEqual(
      [
        "src/components/passport/NotificationSettings.tsx",
        "src/components/site/InstallCard.tsx",
        "src/components/site/InstallPrompt.tsx",
        "src/lib/pwa.ts",
        "src/routes/install.tsx",
      ].sort(),
    );
  });
  it("is not in the sitemap entries, nav, footer, FAQ or home", () => {
    for (const f of [
      "src/lib/sitemap-entries.ts",
      "src/components/site/faq-content.ts",
      "src/routes/index.tsx",
      "src/routes/unlock.tsx",
    ])
      expect(readFileSync(f, "utf8")).not.toMatch(/\/install\b/);
    for (const f of walk("src/components/shell"))
      expect(readFileSync(f, "utf8")).not.toMatch(/\/install\b/);
  });
  it("the /install page is noindex and says installing is optional", async () => {
    const { Route } = await import("@/routes/install");
    const head = (Route.options.head as () => { meta: { name?: string; content?: string }[] })();
    expect(head.meta.some((m) => m.name === "robots" && /noindex/.test(m.content ?? ""))).toBe(
      true,
    );
    const { InstallGuide } = await import("@/components/site/InstallGuide");
    const { container } = render(<InstallGuide />);
    expect(container.textContent).toMatch(/optional/i);
    expect(container.textContent).toMatch(/works fully in your browser/i);
  });
});
