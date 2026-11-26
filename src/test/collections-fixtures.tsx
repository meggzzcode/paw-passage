// Shared test helpers for the Collections, Our Story and access tests: a tiny synthetic library (the real content is
// written by another workstream and must not make these UI tests depend on it) and a router wrapper for links.
import { act, render } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Adventure } from "@/passport/schema";

export function adv(id: string, title: string, over: Partial<Adventure> = {}): Adventure {
  return {
    schema: 2,
    id,
    title,
    clue: "A clue",
    reveal: "An introduction",
    objective: "Do a small thing together",
    instructions: ["Start", "Continue", "Finish"],
    twist: "A twist",
    variations: [],
    completion: "When you are done",
    memoryPrompt: "What did you notice?",
    minutesMin: 5,
    minutesMax: 10,
    costMin: 0,
    costMax: 0,
    prep: "none",
    supplies: [],
    optionalSupplies: [],
    substitutes: [],
    personalities: [],
    requires: [],
    transport: "none",
    reservation: { needed: false },
    setting: "indoor",
    homes: ["apartment", "house-no-yard", "house-with-yard"],
    space: "a-room",
    places: ["home"],
    seasons: [],
    avoidWeather: [],
    lifeStages: ["puppy", "adult", "senior"],
    sizes: [],
    energy: "gentle",
    dogMobility: "low",
    ownerMobility: "seated",
    stepFree: true,
    crowd: "none",
    strangers: false,
    otherDogs: false,
    noise: "quiet",
    food: false,
    water: "none",
    safety: ["Stop whenever your dog loses interest"],
    activityTypes: ["play-and-games"],
    collections: ["rainy-day-club"],
    stamps: [],
    achievements: [],
    keepsake: { family: "travel-postcard", theme: "hometown-postcard", headline: "A DAY OUT" },
    access: "free",
    status: "published",
    relatedGuides: [],
    affiliateProducts: [],
    research: [],
    ...over,
  };
}

export const A1 = adv("adv-aaa111", "Cozy Treasure Hunt", {
  lifeStages: ["puppy", "adult"],
  collections: ["rainy-day-club", "five-minute-moments"],
});
export const A2 = adv("adv-aaa222", "Blanket Fort Picnic", { collections: ["rainy-day-club"] });
export const A3 = adv("adv-aaa333", "Backyard Safari", {
  setting: "outdoor",
  places: ["home"],
  collections: ["weekend-together"],
  costMax: 12,
  costMin: 5,
});
export const A4 = adv("adv-aaa444", "Neighborhood Postcard Walk", {
  setting: "outdoor",
  collections: ["weekend-together", "five-minute-moments"],
});

export const LIBRARY = [A1, A2, A3, A4];
const col = (slug: string, title: string, order: number, premiumOnly = false) => ({
  slug,
  title,
  tagline: `${title} tagline`,
  description: `${title} description`,
  order,
  accent: "ink" as const,
  premiumOnly,
});

/** The module shape of "@/passport/content" for vi.mock. */
export const contentMock = {
  adventures: LIBRARY,
  freeLibrary: () => LIBRARY,
  collections: [
    col("five-minute-moments", "Five-Minute Moments", 1),
    col("rainy-day-club", "Rainy Day Club", 2),
    col("weekend-together", "Weekend Together", 3),
    col("road-trip-adventures", "Road Trip Adventures", 4, true),
  ],
  stamps: [{ slug: "explorer", title: "Explorer", blurb: "b", rule: "Finish one adventure" }],
  achievements: [],
};

export async function renderUi(ui: ReactNode) {
  const root = createRootRoute({ component: () => <>{ui}</> });
  const router = createRouter({
    routeTree: root,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  let result!: ReturnType<typeof render>;
  await act(async () => {
    result = render(<RouterProvider router={router} />);
  });
  return result;
}
