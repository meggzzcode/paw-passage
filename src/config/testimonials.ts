// HOW THE OWNER ADDS A TESTER NOTE (nothing shows on the site until one is added here):
// 1. Get the person's permission to publish their words, their first name or initials, and how they are connected to us.
// 2. Copy their words exactly. Do not edit meaning, invent a rating or add a date they did not give.
// 3. Add one object below: { quote, name, connection, approved: true }. `connection` is shown with the note
//    (for example "friend of the founder" or "received free access"). `rating` (1-5) and `date` are optional.
// 4. Never mark someone "verified". Leave `approved` out (or false) for drafts: those are never shown.
// 5. Save and deploy. The "early testers" section then appears on the home page and /unlock by itself.
export type EarlyTester = {
  /** Their words, as given. */
  quote: string;
  /** First name or initials only. */
  name: string;
  /** Disclosure of the relationship, shown next to the note. */
  connection: string;
  /** True only when the person gave permission to publish this. */
  approved: boolean;
  /** Stars are shown only when the tester supplied a rating (1-5). */
  rating?: 1 | 2 | 3 | 4 | 5;
  date?: string;
};

export const EARLY_TESTERS: readonly EarlyTester[] = [];
