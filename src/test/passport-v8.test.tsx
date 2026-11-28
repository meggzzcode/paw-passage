import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StampArt, STAMP_SLUGS } from "@/components/passport/art/StampArt";
import { BadgeArt, BADGE_IDS, badgeIdFor } from "@/components/passport/art/BadgeArt";
import { STATE_TEXT } from "@/components/passport/art/art-shared";
import type { CollectibleState } from "@/components/passport/art/art-shared";
import { PassportSection } from "@/components/passport/PassportSection";
import { PassportCover, passportPrimaryLabel } from "@/components/passport/PassportCover";
import { StampsAndMilestones } from "@/components/passport/PassportRewards";
import { achievements, stamps } from "@/passport/content";
import { renderUi } from "./collections-fixtures";

const STATES = Object.keys(STATE_TEXT) as CollectibleState[];

describe("collectible artwork", () => {
  it("covers every stamp and achievement in the library", () => {
    expect(stamps).toHaveLength(12);
    expect(achievements).toHaveLength(8);
    expect(stamps.map((s) => s.slug).sort()).toEqual([...STAMP_SLUGS].sort());
    expect(achievements.map(badgeIdFor).sort()).toEqual([...BADGE_IDS].sort());
  });

  it("renders every id in every state with role=img and a name plus state text", () => {
    for (const state of STATES) {
      for (const id of STAMP_SLUGS) {
        const { container, unmount } = render(<StampArt id={id} state={state} />);
        const svg = container.querySelector("svg")!;
        expect(svg.getAttribute("role")).toBe("img");
        expect(svg.getAttribute("aria-label")).toContain(STATE_TEXT[state]);
        expect(svg.getAttribute("data-state")).toBe(state);
        unmount();
      }
      for (const id of BADGE_IDS) {
        const { container, unmount } = render(<BadgeArt id={id} state={state} />);
        const svg = container.querySelector("svg")!;
        expect(svg.getAttribute("role")).toBe("img");
        expect(svg.getAttribute("aria-label")).toContain(STATE_TEXT[state]);
        unmount();
      }
    }
  });

  it("gives each stamp and badge its own artwork", () => {
    const stampHtml = STAMP_SLUGS.map(
      (id) => render(<StampArt id={id} state="earned" />).container.innerHTML,
    );
    const badgeHtml = BADGE_IDS.map(
      (id) => render(<BadgeArt id={id} state="earned" />).container.innerHTML,
    );
    expect(new Set(stampHtml.map((h) => h.replace(/:r[0-9a-z]+:|r[0-9a-z]+/g, ""))).size).toBe(12);
    expect(new Set(badgeHtml.map((h) => h.replace(/:r[0-9a-z]+:|r[0-9a-z]+/g, ""))).size).toBe(8);
  });

  it("marks only the earned state as earned, and only full-passport gets the ribbon", () => {
    for (const state of STATES) {
      const s = render(<StampArt id="trail-blazer" state={state} />).container;
      const b = render(<BadgeArt id="milestone-10" state={state} />).container;
      for (const c of [s, b]) {
        const label = c.querySelector("svg")!.getAttribute("aria-label")!;
        expect(label.includes("earned") && !label.includes("to earn")).toBe(state === "earned");
        expect(!!c.querySelector('[data-ribbon="full-passport"]')).toBe(state === "full-passport");
        expect(!!c.querySelector('[data-next-pin="true"]')).toBe(state === "next");
      }
      expect(!!s.querySelector('[data-postmark="true"]')).toBe(state === "earned");
      expect(!!b.querySelector('[data-earned-seal="true"]')).toBe(state === "earned");
    }
  });

  it("never greys the artwork out", () => {
    for (const state of STATES) {
      const h = render(<StampArt id="beach-explorer" state={state} />).container.innerHTML;
      expect(h).not.toContain("grayscale");
      expect(h).not.toContain('stroke-dasharray="5 4"');
    }
  });
});

const base = { earnedMilestones: [] as number[], collectionsComplete: 0 };
const states = (c: HTMLElement, kind: string) =>
  [...c.querySelectorAll(`svg[data-art="${kind}"]`)].map((n) => [
    n.getAttribute("data-id"),
    n.getAttribute("data-state"),
  ]);

describe("stamps and milestones", () => {
  it("free visitor: intro stamp is free, the rest are Full Passport, nothing unearned is earned", async () => {
    const { container } = await renderUi(
      <StampsAndMilestones {...base} earnedStamps={[]} entitled={false} />,
    );
    const st = states(container, "stamp");
    expect(st).toContainEqual(["first-adventure", "next"]);
    expect(st.filter(([, s]) => s === "full-passport").length).toBeGreaterThan(0);
    expect(st.filter(([, s]) => s === "earned")).toHaveLength(0);
    expect(st.length).toBeLessThan(12);
    expect(screen.getByText("Included with the Full Passport")).toBeTruthy();
    expect(screen.getByRole("link", { name: "See the Full Passport" })).toBeTruthy();
    expect(container.textContent).not.toMatch(/free plan|premium|membership/i);
  });

  it("free visitor with the intro stamp sees it earned", async () => {
    const { container } = await renderUi(
      <StampsAndMilestones
        {...base}
        earnedMilestones={[1]}
        earnedStamps={["first-adventure"]}
        entitled={false}
      />,
    );
    expect(states(container, "stamp")).toContainEqual(["first-adventure", "earned"]);
    expect(states(container, "badge")).toContainEqual(["milestone-1", "earned"]);
  });

  it("paying customer: all stamps and badges, one next up, no ribbons or sales text", () => {
    const { container } = render(
      <StampsAndMilestones
        {...base}
        earnedMilestones={[1]}
        earnedStamps={["first-adventure"]}
        entitled
      />,
    );
    const st = states(container, "stamp");
    expect(st).toHaveLength(12);
    expect(st.filter(([, s]) => s === "next")).toHaveLength(1);
    expect(st.filter(([, s]) => s === "earned")).toHaveLength(1);
    expect(states(container, "badge")).toHaveLength(8);
    expect(container.querySelector("[data-ribbon]")).toBeNull();
    expect(container.textContent).not.toMatch(
      /Full Passport|buying|unlock|free plan|premium|membership/i,
    );
  });
});

describe("passport chapters", () => {
  it("cover leads with the dog's name and short progress", () => {
    render(
      <PassportCover
        name="Biscuit"
        headline="Our headline"
        adventures={2}
        stamps={1}
        earnedStamps={["first-adventure"]}
        facts={["Adult"]}
      />,
    );
    expect(screen.getByText("Biscuit's Adventure Passport")).toBeTruthy();
    expect(screen.getByText(/2 adventures collected · 1 stamp$/)).toBeTruthy();
  });

  it("the cover copy follows the access state and never claims free when unconfirmed", () => {
    const cover = (access: "free" | "paid" | "unconfirmed") =>
      render(
        <PassportCover
          name="Biscuit"
          headline="H"
          adventures={0}
          stamps={0}
          earnedStamps={[]}
          facts={[]}
          access={access}
        />,
      ).container.textContent ?? "";
    expect(cover("paid")).toMatch(/Your Passport is ready\. Nothing collected yet\./);
    expect(cover("paid")).not.toMatch(/first adventure is waiting/);
    expect(cover("free")).toMatch(/Your first adventure is waiting\./);
    expect(cover("unconfirmed")).not.toMatch(/waiting|free|ready/i);
  });

  it("the cover's primary action follows the state", () => {
    expect(passportPrimaryLabel(false, false)).toBe("Find our first adventure");
    expect(passportPrimaryLabel(false, true)).toBe("Revisit our adventure");
    expect(passportPrimaryLabel(true, false)).toBe("Find an adventure");
    expect(passportPrimaryLabel(true, true, 0)).toBe("Find an adventure");
    expect(passportPrimaryLabel(true, false, 1)).toBe("Find another adventure");
    expect(passportPrimaryLabel(true, true, 3)).toBe("Find another adventure");
  });

  it("starts collapsed, mounts content on open, and opens for its hash anchor", async () => {
    window.location.hash = "";
    const { container } = await renderUi(
      <>
        <PassportSection id="memories" title="Our little memories" summary="2 done">
          <p>Inside</p>
        </PassportSection>
        <PassportSection id="account" anchors={["acct-h"]} title="Account and privacy">
          <p>Settings body</p>
        </PassportSection>
      </>,
    );
    const [a, b] = [...container.querySelectorAll("details")];
    expect(a!.open).toBe(false);
    expect(screen.queryByText("Inside")).toBeNull();
    a!.open = true;
    fireEvent(a!, new Event("toggle"));
    expect(screen.getByText("Inside")).toBeTruthy();
    expect(b!.open).toBe(false);
    window.location.hash = "#acct-h";
    fireEvent(window, new HashChangeEvent("hashchange"));
    await screen.findByText("Settings body");
    expect(b!.open).toBe(true);
    window.location.hash = "";
  });
});
