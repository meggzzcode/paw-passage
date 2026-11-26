// Entitlement gate for personalized keepsake creation. Free visitors get KeepsakeUnlock (static example, no uploader).
// The editor is a lazy import that only runs once useEntitlement() says "entitled", so it is never downloaded
// for anyone else. Photos are still processed on this device only.
import { Suspense, lazy, type ComponentProps } from "react";
import { useEntitlement } from "@/passport/useEntitlement";
import { loadKeepsakeEditor } from "./keepsake-loader";
import { KeepsakeUnlock } from "./KeepsakeUnlock";
import type { Adventure } from "@/passport/schema";

const Editor = lazy(() => loadKeepsakeEditor().then((m) => ({ default: m.Keepsake })));

type Props = ComponentProps<typeof Editor>;

export function KeepsakeGate(props: Props) {
  const { status, message } = useEntitlement();
  if (status === "entitled") {
    return (
      <Suspense fallback={<p className="pa-fine">Opening the keepsake maker…</p>}>
        <Editor {...props} />
      </Suspense>
    );
  }
  const family = (props.adventure as Adventure).keepsake?.family;
  if (status === "checking")
    return (
      <p className="pa-fine" role="status">
        Checking your Passport…
      </p>
    );
  if (status === "offline" || status === "revoked")
    return (
      <>
        {message && (
          <p className="pa-fine" role="status">
            {message}
          </p>
        )}
        <KeepsakeUnlock where="card" family={family} />
      </>
    );
  return <KeepsakeUnlock where="card" family={family} />;
}
