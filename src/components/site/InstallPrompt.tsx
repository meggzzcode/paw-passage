// A quiet, optional invitation to add the site to the home screen. Shown only where a parent places it (after a
// purchase or after the first adventure or keepsake), never during discovery or checkout, never inside the installed
// app, and not again for 90 days after "Not now". The website works the same without installing.
import { useEffect, useState, useSyncExternalStore } from "react";
import { AppLink } from "@/components/shell/AppLink";
import {
  INSTALL_GUIDE_PATH,
  canPromptNatively,
  currentPlatform,
  dismissInstallPrompt,
  promptInstall,
  shouldShowInstallPrompt,
  startInstallCapture,
  subscribeInstallState,
  trackPwa,
} from "@/lib/pwa";
import "./install.css";

export const INSTALL_HEADLINE = "Keep your adventures one tap away.";
export const INSTALL_BODY =
  "Add Paws & Passage to your home screen for easy access whenever you're ready for your next adventure.";

export function InstallPrompt({ where }: { where: string }) {
  const [show, setShow] = useState(false);
  const native = useSyncExternalStore(subscribeInstallState, canPromptNatively, () => false);
  useEffect(() => {
    startInstallCapture();
    setShow(shouldShowInstallPrompt());
  }, []);
  if (!show) return null;

  async function install() {
    trackPwa("install_initiated", { where, how: "native" });
    const outcome = await promptInstall();
    if (outcome) setShow(false);
  }
  function notNow() {
    dismissInstallPrompt();
    setShow(false);
  }

  return (
    <aside className="pa-card ins-prompt" aria-labelledby="ins-prompt-h">
      <h2 className="pa-h" id="ins-prompt-h">
        {INSTALL_HEADLINE}
      </h2>
      <p>{INSTALL_BODY}</p>
      <div className="ins-actions">
        {native && currentPlatform() !== "ios-safari" ? (
          <button type="button" className="pp-btn pp-btn-primary" onClick={() => void install()}>
            Install
          </button>
        ) : (
          <AppLink
            to={INSTALL_GUIDE_PATH}
            className="pp-btn pp-btn-primary"
            onClick={() => trackPwa("install_initiated", { where, how: "guide" })}
          >
            Install
          </AppLink>
        )}
        <button type="button" className="pp-btn pp-btn-secondary" onClick={notNow}>
          Not now
        </button>
      </div>
    </aside>
  );
}
