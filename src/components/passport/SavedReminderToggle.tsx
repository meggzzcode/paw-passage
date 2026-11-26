// One plain switch for saved-adventure reminders. Saving an adventure never sends anything by itself.
export function SavedReminderToggle({
  on,
  busy,
  onChange,
}: {
  on: boolean;
  busy: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="pa-check">
      <input
        type="checkbox"
        checked={on}
        disabled={busy}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        Saved-adventure reminders
        <span className="nt-hint">
          An occasional note about adventures you saved for later. Saving one never sends anything
          by itself.
        </span>
      </span>
    </label>
  );
}
