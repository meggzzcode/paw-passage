// Mounted once in the root layout. Registers the service worker after load and offers a small "refresh" toast when a
// new version is waiting. Renders nothing otherwise. No permission is requested here.
import { useEffect, useState } from "react";
import { registerServiceWorker, startInstallCapture } from "@/lib/pwa";
import "./install.css";

export function InstallRuntime() {
  const [activate, setActivate] = useState<(() => void) | null>(null);
  useEffect(() => {
    startInstallCapture();
    registerServiceWorker((fn) => setActivate(() => fn));
  }, []);
  if (!activate) return null;
  return (
    <div className="pa-card ins-toast" role="status">
      <p>A new version is ready.</p>
      <div className="ins-actions">
        <button type="button" className="pp-btn pp-btn-primary pp-btn-sm" onClick={activate}>
          Refresh
        </button>
        <button
          type="button"
          className="pp-btn pp-btn-secondary pp-btn-sm"
          onClick={() => setActivate(null)}
        >
          Later
        </button>
      </div>
    </div>
  );
}
