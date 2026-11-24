import { Backpack, CarFront, CupSoda, House, MountainSnow } from "lucide-react";

/** Photo-free composition: five tonal tiles with line icons (car, bowl, bag, cabin, trail). Decorative only. */
function HeroComposition() {
  const tile = "flex items-center justify-center rounded-2xl border border-border/70 shadow-card";
  const icon = "size-12 md:size-14";
  return (
    <div
      aria-hidden="true"
      className="relative hidden h-[19rem] w-full max-w-md justify-self-end md:block lg:h-[21rem]"
    >
      <svg
        className="absolute inset-0 size-full text-primary/10"
        viewBox="0 0 400 340"
        fill="none"
        focusable="false"
      >
        <defs>
          <pattern id="gear-hero-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="currentColor" />
          </pattern>
        </defs>
        <rect x="150" y="0" width="250" height="210" rx="28" fill="url(#gear-hero-dots)" />
        <circle cx="70" cy="290" r="46" stroke="currentColor" strokeWidth="2" />
        <circle cx="70" cy="290" r="28" stroke="currentColor" strokeWidth="2" />
      </svg>
      <div className={`${tile} absolute left-0 top-6 h-36 w-40 bg-secondary text-primary`}>
        <CarFront className={icon} strokeWidth={1.25} />
      </div>
      <div className={`${tile} absolute left-44 top-0 h-28 w-36 bg-accent text-accent-foreground`}>
        <CupSoda className={icon} strokeWidth={1.25} />
      </div>
      <div className={`${tile} absolute right-0 top-32 h-36 w-32 bg-sky text-primary`}>
        <House className={icon} strokeWidth={1.25} />
      </div>
      <div className={`${tile} absolute bottom-0 left-12 h-32 w-36 bg-muted text-primary`}>
        <MountainSnow className={icon} strokeWidth={1.25} />
      </div>
      <div className={`${tile} absolute bottom-6 left-52 h-28 w-28 bg-card text-terracotta`}>
        <Backpack className={icon} strokeWidth={1.25} />
      </div>
    </div>
  );
}

export function GearHero() {
  return (
    <section
      aria-labelledby="gear-hero-title"
      className="mt-5 grid items-center gap-8 overflow-hidden rounded-3xl bg-muted/60 px-5 py-6 sm:px-8 md:grid-cols-[1.1fr_1fr] md:py-12 lg:px-12"
    >
      <div className="max-w-xl">
        <p className="eyebrow">Dog travel essentials</p>
        <h1 id="gear-hero-title" className="mt-3 text-4xl leading-tight md:text-5xl">
          Good gear. Better getaways.
        </h1>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Thoughtful essentials for easier road trips, cozy cabin stays, and adventures with your
          dog.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href="#trips"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 font-medium text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Find gear for your trip
          </a>
          <a
            href="#categories"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 font-medium transition hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Browse all categories
          </a>
        </div>
      </div>
      <HeroComposition />
    </section>
  );
}
