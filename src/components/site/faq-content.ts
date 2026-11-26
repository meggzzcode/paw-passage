// One source for the questions buyers ask. Used by /faq (all of them) and /unlock (a summary).
// Rules: say only what the product does today. Nothing here promises a feature that is not built, quotes a number we
// have not verified, or makes a medical or behavior claim. Price comes from the single offer constant.
import { price, pricing } from "@/config/commercial";

export type Faq = { id: string; q: string; a: string; group: "buying" | "dogs" | "privacy" };

export const FAQS: readonly Faq[] = [
  {
    id: "what-you-buy",
    group: "buying",
    q: "What exactly do I get when I buy?",
    a: `${price}, paid once, unlocks the full Adventure Passport library: every adventure in every collection, the personalized discovery tools, and more keepsake designs. The one free introductory adventure and your passport pages stay free either way.`,
  },
  {
    id: "subscription",
    group: "buying",
    q: "Is this a subscription?",
    a: `No. It is a ${pricing}. There is no renewal, no trial that turns into a charge, and nothing to cancel.`,
  },
  {
    id: "digital-not-book",
    group: "buying",
    q: "Is it a book or something that ships to me?",
    a: "No. It is a digital product that you use on your phone, tablet or computer. Nothing is mailed. If you want something on paper, a finished keepsake can be saved as an image and printed at home or at a print shop.",
  },
  {
    id: "no-app",
    group: "buying",
    q: "Do I have to download an app?",
    a: "No. It works in your web browser. Open the site, and your passport is there.",
  },
  {
    id: "try-first",
    group: "buying",
    q: "Can I try before I buy?",
    a: "Yes. Answer a few questions about your dog and we pick one complete adventure for them, free, with no account and no card. You can also browse selected previews from the larger collection. You do not have to finish the free adventure before you buy, and you can buy at any time.",
  },
  {
    id: "puppies",
    group: "dogs",
    q: "Is it suitable for puppies?",
    a: "There is a collection built for a puppy's first chapter, and the picks respect life stage: an adventure that does not suit a puppy is not offered to one. Every adventure is a gentle suggestion, short sessions are fine, and your dog can stop at any time.",
  },
  {
    id: "seniors",
    group: "dogs",
    q: "Is it suitable for senior dogs?",
    a: "Yes. There is a collection for the golden years, and when you tell us your dog is older or slower we only offer adventures that suit that. Many adventures are gentle and low effort. If your dog has a health concern, your vet is the right person to ask what is comfortable.",
  },
  {
    id: "limited-mobility",
    group: "dogs",
    q: "What if my dog or I have limited mobility?",
    a: "Tell us in the short questions. If your dog has limited mobility, or you need step-free or seated options, adventures that need more than that are filtered out before anything is recommended. When we do not know something that matters, we ask instead of guessing.",
  },
  {
    id: "quiet-dogs",
    group: "dogs",
    q: "Is it only for active, outgoing dogs?",
    a: "No. There are calm, quiet adventures for homebodies, shy dogs and dogs who dislike crowds, noise or other dogs. A nervous dog is never sent to a crowd, and your dog can always opt out.",
  },
  {
    id: "backyard",
    group: "dogs",
    q: "Do I need a backyard?",
    a: "No. Many adventures happen indoors or on a short walk. When an adventure needs a yard, we only suggest it if you have one.",
  },
  {
    id: "car",
    group: "dogs",
    q: "Do I need a car?",
    a: "No. Many adventures need no car, and each one tells you up front if it does. If you do not have a car, or your dog does not ride, those adventures are left out.",
  },
  {
    id: "spending",
    group: "buying",
    q: "Will I have to spend more money on each adventure?",
    a: "Not necessarily. Each adventure shows its cost range before you start, and many cost nothing extra to do. Some use things you already have at home. A few suggest an outing, a treat or a small supply, and those are marked so you can choose.",
  },
  {
    id: "choose-own",
    group: "buying",
    q: "Can I choose my own adventures?",
    a: "Yes. With the full Passport you can browse the whole library with filters, save favorites, and make your own collections. You can also take the personalized picks, or ask for a surprise. Nothing is forced on you.",
  },
  {
    id: "phone-use",
    group: "dogs",
    q: "Will I be on my phone the whole time?",
    a: "No. Read the adventure, put the phone away and go. You only need it again to mark the adventure done, add a short note, or make a keepsake afterward.",
  },
  {
    id: "household",
    group: "dogs",
    q: "Can I use it for more than one dog, or share it with my household?",
    a: "One purchase covers your household's use on your own devices, so the people you live with can use it too, and you can restore it on your other devices with your purchase code. The Passport keeps one dog profile at a time: to switch to another dog, edit the profile, and your progress and stamps carry on in the same passport. Separate profiles for each dog are something we may add one day, but they are not part of the product today.",
  },
  {
    id: "recover",
    group: "buying",
    q: "What if I lose access or switch devices?",
    a: "There are no accounts. When you buy, you get a purchase code. If you open the site on a new device, use Restore access with that code. Keep the code somewhere safe, and never send it to anyone in an email.",
  },
  {
    id: "sync",
    group: "buying",
    q: "Does my progress sync between devices?",
    a: "With the full Passport, your progress can follow you to your other devices once you restore access there. Free progress is stored on your own device, and you can export a backup file any time.",
  },
  {
    id: "keep-photos",
    group: "privacy",
    q: "Can I keep my photos and keepsakes?",
    a: "Yes. Keepsakes are made on your device and saved as images that you own and can print or share if you choose. Nothing is shared unless you share it.",
  },
  {
    id: "photos-not-uploaded",
    group: "privacy",
    q: "Are my photos uploaded anywhere?",
    a: "No. Photos are used only in your browser to draw your keepsake. They are not uploaded, not stored by us and not included in analytics.",
  },
  {
    id: "refund",
    group: "buying",
    q: "What is the refund policy?",
    a: "Refund terms are shown at checkout before you pay, and our refund policy page explains how to ask, what happens to your access and what happens to your progress, which always stays yours. If you were charged and cannot unlock, try Restore access first, then contact us.",
  },
  {
    id: "contact",
    group: "buying",
    q: "How do I reach you?",
    a: "Use the contact page. For a purchase question, tell us the email you bought with, and never include your purchase code.",
  },
] as const;

/** The six questions summarized on /unlock. */
export const UNLOCK_FAQ_IDS = [
  "what-you-buy",
  "subscription",
  "try-first",
  "spending",
  "household",
  "recover",
  "refund",
] as const;
