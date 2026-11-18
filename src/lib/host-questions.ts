export interface DogProfile {
  dogName: string;
  dogs: number;
  size: "small" | "medium" | "large" | "giant";
  breed: string;
  needs: {
    fencedYard: boolean;
    jumper: boolean;
    digger: boolean;
    pool: boolean;
    crate: boolean;
    leftAlone: boolean;
    furniture: boolean;
    stairsHard: boolean;
    reactive: boolean;
    beach: boolean;
  };
}

export interface HostQuestionsResult {
  questions: string[];
  photos: string[];
  message: string;
}

const countWord = ["no", "one", "two", "three", "four"];
const numWord = (n: number) => countWord[n] ?? String(n);

const sizeWord = {
  small: "small",
  medium: "medium-sized",
  large: "large",
  giant: "giant-breed",
} as const;

export function buildHostQuestions(p: DogProfile, stayName = ""): HostQuestionsResult {
  const q: string[] = [];
  const photos: string[] = [];
  const many = p.dogs > 1;
  const name = p.dogName.trim();
  const them = many ? "the dogs" : name || "my dog";

  // Always ask
  q.push(
    `Is the pet fee charged per stay, per night or per dog, and is any part of it refundable?`,
  );
  q.push(
    many
      ? `Are ${p.dogs} dogs allowed, and is there a combined weight limit? The largest of our dogs is ${sizeWord[p.size]}.`
      : `Is there a weight or size limit? My dog is ${sizeWord[p.size]}.`,
  );
  if (p.breed.trim())
    q.push(
      `Are there any breed restrictions (for example from your insurance or HOA)? ${many ? "Our dogs include a" : "My dog is a"} ${p.breed.trim()}.`,
    );
  else q.push(`Are there any breed restrictions, for example from your insurance or HOA?`);

  if (p.needs.fencedYard || p.needs.jumper || p.needs.digger) {
    q.push(`Is the yard fully enclosed on every side, including where the fence meets the house?`);
    q.push(`How tall is the fence at its lowest point, and what is it made of?`);
    q.push(
      `Does every gate self-close and latch? Do cleaners, landscapers or neighbors use any of them?`,
    );
    q.push(`Is the yard private to this rental, or shared with other guests or units?`);
    photos.push("The full fence line, including the corners and where it meets the house");
    photos.push("Each gate, showing the latch and the gap underneath");
  }
  if (p.needs.jumper)
    q.push(
      `Is there anything near the fence (furniture, a woodpile, a slope or a deck) a dog could use to climb over?`,
    );
  if (p.needs.digger)
    q.push(`Is the bottom of the fence buried or reinforced, or does it sit on soft ground?`);
  if (p.needs.pool) {
    q.push(
      `Is the pool or hot tub separately fenced or covered, and can the gate to it be locked?`,
    );
    photos.push("The pool or hot tub area and its barrier");
  }
  if (p.needs.crate)
    q.push(
      `Is there a good spot for a crate, and are crates required when ${them} ${many ? "are" : "is"} left?`,
    );
  if (p.needs.leftAlone)
    q.push(
      `Can ${them} be left alone in the rental, and if so, for how long and under what conditions?`,
    );
  if (p.needs.furniture) q.push(`Are dogs allowed on beds or sofas if we bring our own covers?`);
  if (p.needs.stairsHard || p.size === "giant" || p.size === "large") {
    q.push(
      `How many steps are there from parking to the door, and are the bedrooms on the entry level?`,
    );
    q.push(`What are the floors like? Are there rugs on slippery wood or tile?`);
    photos.push("The steps from parking to the entrance, and any interior stairs");
  }
  if (p.needs.reactive) {
    q.push(`Are there other dogs, livestock or busy foot traffic right next to the property?`);
    q.push(`Is there a quiet, private spot nearby for toilet breaks?`);
  }
  if (p.needs.beach) {
    q.push(
      `Which beach do you mean by "beach access", and are dogs allowed on that beach? Are there leash hours or seasonal closures?`,
    );
    q.push(`Is there an outdoor shower or hose for rinsing sand and salt off?`);
  }
  q.push(`What is the nearest emergency vet, and is it open overnight?`);
  q.push(`Are there any house rules for dogs not shown in the listing?`);

  const greeting = stayName.trim()
    ? `Hi! We're interested in ${stayName.trim()}`
    : "Hi! We're interested in your place";
  const dogLine = many
    ? `and would be traveling with ${numWord(p.dogs)} dogs${name ? `, including ${name}` : ""}. The largest is ${sizeWord[p.size]}${p.breed.trim() ? ` and our dogs include a ${p.breed.trim()}` : ""}.`
    : `and would be traveling with ${p.dogName.trim() || "our dog"}, a ${sizeWord[p.size]} ${p.breed.trim() || "dog"}.`;
  const photoLine = photos.length
    ? `\n\nIf it's easy, could you also send photos of:\n${photos.map((x) => `- ${x}`).join("\n")}`
    : "";
  const message = `${greeting} ${dogLine} Before booking, could you help with a few questions?\n\n${q.map((x, i) => `${i + 1}. ${x}`).join("\n")}${photoLine}\n\nThank you, we really appreciate it!`;

  return { questions: q, photos, message };
}
