import { Link } from "@tanstack/react-router";
import { readingMinutes } from "@/lib/reading-time";
import type { Guide } from "@/content/types";
import { guideHero } from "@/lib/images";
import { isPublic } from "@/content/guides";
import { PreviewBadge } from "./StatusBadge";

export function GuideCard({
  guide,
  variant = "default",
}: {
  guide: Guide;
  variant?: "default" | "wide" | "compact";
}) {
  const img = guideHero(guide);
  if (variant === "compact") {
    return (
      <Link to="/guides/$slug" params={{ slug: guide.slug }} className="group flex gap-4">
        <img
          src={img.card ?? img.src}
          alt=""
          loading="lazy"
          decoding="async"
          width={160}
          height={100}
          className="h-20 w-28 shrink-0 rounded-md object-cover"
        />
        <div>
          <p className="eyebrow">{guide.category}</p>
          <p className="mt-1 font-display text-lg leading-snug group-hover:text-primary">
            {guide.title}
          </p>
        </div>
      </Link>
    );
  }
  return (
    <Link
      to="/guides/$slug"
      params={{ slug: guide.slug }}
      className={`group block ${variant === "wide" ? "md:grid md:grid-cols-2 md:gap-8" : ""}`}
    >
      <div className="overflow-hidden rounded-lg">
        <img
          src={img.card ?? img.src}
          alt={img.alt}
          loading="lazy"
          decoding="async"
          width={1600}
          height={1008}
          className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className={variant === "wide" ? "mt-5 md:mt-0 md:self-center" : "mt-4"}>
        <div className="flex items-center gap-2">
          <p className="eyebrow">{guide.category}</p>
          {!isPublic(guide) && <PreviewBadge>Draft, preview only</PreviewBadge>}
        </div>
        <h3
          className={`mt-2 font-display leading-tight group-hover:text-primary ${variant === "wide" ? "text-3xl" : "text-xl"}`}
        >
          {guide.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{guide.dek}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          {readingMinutes(guide.body, guide.readingMinutes)} min read · Reviewed{" "}
          {guide.lastReviewed}
        </p>
      </div>
    </Link>
  );
}
