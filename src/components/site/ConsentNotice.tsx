// Analytics choice: one small, non-blocking notice plus the "Analytics choices" control used in the footer and on /privacy.
// Both choices are equally visible and styled the same. Markup and class names are deliberately simple (cn-*) so the
// final design can restyle them. Nothing here blocks browsing: it is a region at the bottom of the page, not a dialog.
import { useEffect, useSyncExternalStore } from "react";
import { Link } from "@tanstack/react-router";
import {
  analyticsAllowed,
  applyConsent,
  closeConsentChoices,
  consentVersion,
  isReopened,
  noticeVisible,
  openConsentChoices,
  setConsent,
  storedChoice,
  subscribeConsent,
} from "@/lib/consent";

/** Re-reads on every change; renders nothing on the server and during the first client render (no hydration mismatch). */
function useConsentView() {
  useSyncExternalStore(subscribeConsent, consentVersion, () => 0);
  return { visible: noticeVisible(), reopened: isReopened(), allowed: analyticsAllowed() };
}

export function ConsentNotice() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const { visible, reopened, allowed } = useConsentView();
  useEffect(() => {
    applyConsent(); // honors a saved choice on every page load; a no-op outside the production site
  }, []);
  if (!mounted || !visible) return null;
  const saved = storedChoice();
  return (
    <section className="cn-notice" aria-labelledby="cn-title" data-testid="consent-notice">
      <h2 id="cn-title" className="cn-title">
        Analytics choice
      </h2>
      <p className="cn-text">
        {reopened && saved
          ? `Analytics are currently ${allowed ? "allowed" : "off"}${saved.at ? ` (chosen ${saved.at})` : ""}. You can change this at any time. `
          : "We would like to use Google Analytics to count visits and see which pages and tools are used. It sets a cookie and sends small, anonymous events. The site works the same either way. "}
        <Link to="/privacy" className="cn-link">
          What we store and why
        </Link>
        .
      </p>
      <div className="cn-actions">
        <button type="button" className="cn-btn" onClick={() => setConsent("denied")}>
          Essential only
        </button>
        <button type="button" className="cn-btn" onClick={() => setConsent("granted")}>
          Allow analytics
        </button>
        {reopened && (
          <button type="button" className="cn-link cn-close" onClick={closeConsentChoices}>
            Close
          </button>
        )}
      </div>
    </section>
  );
}

/** Footer and privacy-page control. Always rendered, so the choice can be changed (or made) at any time. */
export function AnalyticsChoicesButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className ?? "cn-link"} onClick={openConsentChoices}>
      Analytics choices
    </button>
  );
}
