import { useEffect } from "react";
import { AppLink } from "@/components/shell/AppLink";
import {
  canPromptNatively,
  currentPlatform,
  promptInstall,
  startInstallCapture,
  trackPwa,
} from "@/lib/pwa";
import {
  AndroidMenuFigure,
  DesktopFigure,
  IosAddFigure,
  IosShareFigure,
} from "@/components/site/InstallIllustrations";
import "./install.css";

export function InstallGuide() {
  useEffect(() => {
    startInstallCapture();
    trackPwa("install_guide_viewed", { platform: currentPlatform() });
  }, []);
  const mine = typeof navigator === "undefined" ? "other" : currentPlatform();
  return (
    <div className="ins-guide">
      <p className="pa-sub">
        Installing is optional. The website works fully in your browser, and you never need to
        install to use or buy anything. A home-screen icon is just a shortcut.
      </p>
      <p className="pa-fine" id="ins-free-note">
        Free adventures and progress are saved on this device only, with no account. A home-screen
        app keeps its own separate storage, so progress made in the browser will not appear in it,
        and clearing site data removes it. Exporting a backup from My Passport is optional. Paid
        Passport owners can restore access with their purchase code.
      </p>

      <section aria-labelledby="ins-ios">
        <h2 className="pa-h" id="ins-ios">
          iPhone and iPad
        </h2>
        <ol className="ins-steps">
          <li>
            Open this website in Safari. On iPhone and iPad, Safari is the browser that reliably
            offers this.
          </li>
          <li>
            Tap the Share button (a square with an arrow pointing up). If you do not see it, tap the
            Page Menu button first, then Share.
          </li>
          <li>Scroll the list and tap Add to Home Screen.</li>
          <li>Tap Add. The icon appears on your home screen.</li>
        </ol>
        <IosShareFigure />
        <IosAddFigure />
        <p className="pa-fine">
          Some other iPhone browsers also offer Add to Home Screen in their Share menu on iOS 16.4
          and later, but the steps vary, so Safari is the sure route. Reminders (notifications) are
          optional and need iOS 16.4 or later, with the app added to the home screen.
          {mine === "ios-other" &&
            " It looks like you are not in Safari; open this page in Safari to follow these steps."}
        </p>
      </section>

      <section aria-labelledby="ins-android">
        <h2 className="pa-h" id="ins-android">
          Android
        </h2>
        <NativeButton />
        <ol className="ins-steps">
          <li>Open this website in Chrome.</li>
          <li>Tap the three-dot menu at the top right.</li>
          <li>Tap Install app, or Add to Home screen if that is what your menu says.</li>
          <li>Confirm. The icon appears on your home screen or in your app list.</li>
        </ol>
        <AndroidMenuFigure />
        <p className="pa-fine">Wording differs between phones and browser versions.</p>
      </section>

      <section aria-labelledby="ins-desktop">
        <h2 className="pa-h" id="ins-desktop">
          Computer (optional)
        </h2>
        <p>
          In Chrome or Edge, look for the install icon at the right end of the address bar, or open
          the browser menu and choose Install. Other desktop browsers may not offer it, and that is
          fine.
        </p>
        <DesktopFigure />
      </section>

      <section aria-labelledby="ins-restore" className="pa-card">
        <h2 className="pa-h" id="ins-restore">
          Restore access
        </h2>
        <p>
          A home-screen app can start with its own empty storage, especially on iPhone and iPad. If
          your Passport access is missing after installing, use{" "}
          <AppLink to="/restore-access">Restore access</AppLink> with the code from your purchase
          email; your saved progress then comes back from your account. Free progress can be moved
          only by exporting and importing a file in My Passport. Your purchase code is never put in
          a web address.
        </p>
      </section>
    </div>
  );
}

function NativeButton() {
  const ok = typeof window !== "undefined" && canPromptNatively();
  if (!ok) return null;
  return (
    <p>
      <button
        type="button"
        className="pp-btn pp-btn-primary"
        onClick={() => {
          trackPwa("install_initiated", { where: "guide", how: "native" });
          void promptInstall();
        }}
      >
        Install now
      </button>
    </p>
  );
}
