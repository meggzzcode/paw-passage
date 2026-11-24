import { useState, type ReactNode } from "react";
import { site } from "@/config/site";

/** Print and copy-link buttons. No third-party scripts. */
export function ArticleActions({ slug, title }: { slug?: string; title?: string } = {}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  async function copy() {
    const url = window.location.href;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
      else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (!ok) throw new Error("copy failed");
      }
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2500);
  }
  const btn =
    "inline-flex min-h-9 items-center rounded-full border border-input px-3.5 text-sm hover:bg-muted";
  return (
    <div className="no-print mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2">
      <button type="button" onClick={() => window.print()} className={btn}>
        Print
      </button>
      <button type="button" onClick={copy} className={btn}>
        {state === "copied" ? "Copied" : "Copy link"}
      </button>
      {slug && title && site.siteUrl && (
        <a
          href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(`${site.siteUrl}/guides/${slug}`)}&media=${encodeURIComponent(`${site.siteUrl}/pins/${slug}.jpg`)}&description=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
        >
          Save to Pinterest
        </a>
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "Link copied" : state === "failed" ? "Could not copy the link" : ""}
      </span>
      {state === "failed" && (
        <span className="text-sm text-muted-foreground">Copy it from the address bar.</span>
      )}
    </div>
  );
}

/** "2026-11-16" -> "Nov 16, 2026" (no time zone shifting). */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[Number(m[2]) - 1] ?? m[2]} ${Number(m[3])}, ${m[1]}`;
}

/**
 * One compact byline row: author and reading time (optional `lead`), when it was last reviewed and
 * how many sources it cites. No separator glyphs, so a wrapped line never starts with "·";
 * the dated and sourced facts are small chips and the gap does the spacing.
 */
export function TrustStrip({
  guide,
  lead,
}: {
  guide: {
    category: string;
    lastReviewed: string;
    sources: unknown[];
    body: string;
    gear?: { productId: string }[] | undefined;
  };
  lead?: ReactNode;
}) {
  // On phones the date is plain text on the byline row (no wrapped chip); from sm up it is a chip.
  const chip = "sm:rounded-full sm:border sm:border-border sm:px-2.5 sm:py-0.5";
  return (
    <ul
      aria-label="About this guide"
      className="mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground sm:mt-3 sm:gap-y-1.5 sm:text-sm"
    >
      {lead ? <li>{lead}</li> : null}
      <li className={chip}>
        Last reviewed <time dateTime={guide.lastReviewed}>{formatDate(guide.lastReviewed)}</time>
      </li>
    </ul>
  );
}
