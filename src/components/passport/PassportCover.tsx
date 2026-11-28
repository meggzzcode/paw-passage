// The front of the passport: whose it is, a short line of progress, and the stamps stuck on the cover so far.
import type { ReactNode } from "react";
import { StampArt } from "./art/StampArt";

/**
 * The cover's one primary action, by state: a new or free visitor with no reveal is invited to the first adventure, a free
 * visitor who has revealed their intro adventure goes back to it, and a paying customer looks for another.
 */
export function passportPrimaryLabel(entitled: boolean, revealed: boolean, completed = 0): string {
  if (entitled) return completed > 0 ? "Find another adventure" : "Find an adventure";
  return revealed ? "Revisit our adventure" : "Find our first adventure";
}

export function PassportCover({
  name,
  headline,
  adventures,
  stamps,
  earnedStamps,
  facts,
  access = "free",
  children,
}: {
  name: string;
  headline: string;
  adventures: number;
  stamps: number;
  earnedStamps: readonly string[];
  facts: readonly string[];
  /** "paid" = verified customer, "unconfirmed" = access check failing (never claims the free state). */
  access?: "free" | "paid" | "unconfirmed";
  children?: ReactNode;
}) {
  const shown = earnedStamps.slice(0, 3);
  return (
    <header className="pv8-cover">
      <p className="pv8-cover-kicker">{name}'s Adventure Passport</p>
      <h1 className="pv8-cover-h1">{headline}</h1>
      <p className="pv8-cover-progress">
        {adventures === 0
          ? access === "paid"
            ? "Your Passport is ready. Nothing collected yet. Let's find a first little adventure."
            : access === "unconfirmed"
              ? "Nothing collected on this device yet."
              : "Your first adventure is waiting."
          : `${adventures} ${adventures === 1 ? "adventure" : "adventures"} collected · ${stamps} ${stamps === 1 ? "stamp" : "stamps"}`}
      </p>
      {shown.length > 0 && (
        <ul className="pv8-cover-stamps" aria-label="Stamps on your cover">
          {shown.map((s, i) => (
            <li key={s} style={{ rotate: `${(i - 1) * 7}deg` }}>
              <StampArt id={s} state="earned" size={72} />
            </li>
          ))}
        </ul>
      )}
      {facts.length > 0 && <p className="pv8-cover-facts">{facts.join(" · ")}</p>}
      {children}
    </header>
  );
}
