// A small, quiet line about sync and access. Renders nothing for a free visitor.
import { useEntitlement } from "@/passport/useEntitlement";
import { useSyncState } from "@/passport/useSync";

export function SyncStatus() {
  const { status, message } = useEntitlement();
  const { label } = useSyncState();
  const note = status === "revoked" || status === "offline" ? message : null;
  if (!label && !note) return null;
  return (
    <p className="pa-fine sync-status" role="status" aria-live="polite">
      {label && <span data-sync>{label}</span>}
      {label && note ? " · " : ""}
      {note}
    </p>
  );
}
