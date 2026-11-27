// Small decorative pieces for the free journey (quiz, mystery gift, adventure header). They reuse the photography already in
// the repo (src/assets/concept) and draw a few tiny vectors. Everything here is aria-hidden decoration: no text, no data.
import cozy from "@/assets/concept/cozy.jpg";
import picnic from "@/assets/concept/picnic.jpg";
import puppy from "@/assets/concept/puppy.jpg";
import trail from "@/assets/concept/trail.jpg";
import date from "@/assets/concept/date.jpg";
import type { Adventure } from "@/passport/schema";

/** One existing photo that suits where the adventure happens. Setting only: it never hints at the title or steps. */
export function journeyPhoto(a: Pick<Adventure, "setting" | "lifeStages">): string {
  if (a.setting === "indoor") return cozy;
  if (a.setting === "outdoor") return trail;
  return a.lifeStages.length === 1 && a.lifeStages[0] === "puppy" ? puppy : picnic;
}

/** A different existing photo for each quiz question, as a small "polaroid" in the corner of the panel. */
export const QUIZ_PHOTOS = [puppy, trail, cozy, date];

export function Polaroid({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span className={`qr-polaroid ${className}`} aria-hidden="true">
      <img src={src} alt="" width={96} height={96} loading="eager" decoding="async" />
    </span>
  );
}

/** A small hand-drawn ribbon bow: the "little gift" cue for the mystery card. */
export function GiftBow() {
  return (
    <svg className="qr-bow" viewBox="0 0 64 40" width="64" height="40" aria-hidden="true">
      <path
        d="M32 24C22 8 6 4 6 14s14 14 26 10Z"
        fill="var(--pp-red)"
        stroke="var(--pp-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M32 24C42 8 58 4 58 14s-14 14-26 10Z"
        fill="var(--pp-red)"
        stroke="var(--pp-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="24" r="6" fill="var(--pp-ochre)" stroke="var(--pp-ink)" strokeWidth="2" />
      <path
        d="M30 29 24 38M34 29l6 9"
        stroke="var(--pp-ink)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
