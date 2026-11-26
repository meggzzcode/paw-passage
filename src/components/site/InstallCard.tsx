// Always-available install entry for My Passport and settings. Not subject to the prompt cooldown (the customer is
// looking for it), hidden once the app is already installed.
import { useEffect, useState, useSyncExternalStore } from "react";
import { AppLink } from "@/components/shell/AppLink";
import {
  INSTALL_GUIDE_PATH,
  canPromptNatively,
  isStandalone,
  promptInstall,
  startInstallCapture,
  subscribeInstallState,
  trackPwa,
} from "@/lib/pwa";
import "./install.css";

export function InstallCard() {
  const [standalone, setStandalone] = useState<boolean | null>(null);
  const native = useSyncExternalStore(subscribeInstallState, canPromptNatively, () => false);
  useEffect(() => {
    startInstallCapture();
    setStandalone(isStandalone());
  }, []);
  if (standalone === null) return null;
  if (standalone) {
    return (
      <section className="pa-card ins-card" aria-labelledby="ins-card-h">
        <h2 className="pa-h" id="ins-card-h">
          Home screen app
        </h2>
        <p className="pa-fine">You are using Paws &amp; Passage from your home screen.</p>
      </section>
    );
  }
  return (
    <section className="pa-card ins-card" aria-labelledby="ins-card-h">
      <h2 className="pa-h" id="ins-card-h">
        Add to your home screen
      </h2>
      <p>Open Paws &amp; Passage like an app, one tap from your home screen. Optional.</p>
      <div className="ins-actions">
        {native && (
          <button
            type="button"
            className="pp-btn pp-btn-primary"
            onClick={() => {
              trackPwa("install_initiated", { where: "card", how: "native" });
              void promptInstall();
            }}
          >
            Install
          </button>
        )}
        <AppLink
          to={INSTALL_GUIDE_PATH}
          className={native ? "pp-btn pp-btn-secondary" : "pp-btn pp-btn-primary"}
        >
          How to install
        </AppLink>
      </div>
    </section>
  );
}
