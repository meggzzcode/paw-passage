import { useEffect } from "react";

/**
 * Progressive enhancement for #<product-id> links. The anchor itself works without JS (the id is on the card and the
 * browser scrolls to it). With JS this also opens the card's details panel, makes sure the card is in view after the
 * layout settles, and briefly outlines it so the reader can see which card the link meant.
 */
export function GearHashTarget() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      const d = el.tagName === "DETAILS" ? el : el.querySelector("details");
      if (d && !(d as HTMLDetailsElement).open) (d as HTMLDetailsElement).open = true;
      el.scrollIntoView({ block: "start" });
      el.classList.add("outline-2", "outline-offset-4", "outline-ring");
      clearTimeout(timer);
      timer = setTimeout(
        () => el.classList.remove("outline-2", "outline-offset-4", "outline-ring"),
        2500,
      );
    };
    run();
    window.addEventListener("hashchange", run);
    return () => {
      window.removeEventListener("hashchange", run);
      clearTimeout(timer);
    };
  }, []);
  return null;
}
