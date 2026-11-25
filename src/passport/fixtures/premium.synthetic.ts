// SYNTHETIC TEST DATA ONLY. These three invented "premium" adventures exist so authorization tests have something to
// protect. They are not real product content, never ship to customers and must never be imported by site code.
import type { Adventure } from "../schema";

const base = {
  prep: "none",
  supplies: [],
  minutesMin: 10,
  minutesMax: 20,
  costMin: 0,
  costMax: 0,
  setting: "indoor",
  environments: ["house"],
  lifeStages: ["adult"],
  energy: "gentle",
  mobilityFriendly: true,
  crowd: "none",
  otherDogs: false,
  seasons: [],
  safety: ["SYNTHETIC safety line for tests."],
  variations: [],
  memoryPrompt: "SYNTHETIC memory prompt.",
  keepsake: "milestone-card",
  collections: ["road-trip-adventures"],
  stamps: [],
  access: "premium",
  status: "published",
  relatedGuides: [],
} as const;

export const syntheticPremium: Adventure[] = [
  {
    ...base,
    id: "adv-syn001",
    title: "SYNTHETIC Premium One",
    clue: "SYNTHETIC clue one.",
    description: "SYNTHETIC description one. Not real content.",
    instructions: ["SYNTHETIC step A.", "SYNTHETIC step B."],
    twist: "SYNTHETIC twist one.",
  },
  {
    ...base,
    id: "adv-syn002",
    title: "SYNTHETIC Premium Two",
    clue: "SYNTHETIC clue two.",
    description: "SYNTHETIC description two. Not real content.",
    instructions: ["SYNTHETIC step A.", "SYNTHETIC step B."],
    twist: "SYNTHETIC twist two.",
  },
  {
    ...base,
    id: "adv-syn003",
    title: "SYNTHETIC Premium Three",
    clue: "SYNTHETIC clue three.",
    description: "SYNTHETIC description three. Not real content.",
    instructions: ["SYNTHETIC step A.", "SYNTHETIC step B."],
    twist: "SYNTHETIC twist three.",
  },
].map((a) => ({ ...a }) as unknown as Adventure);
