import { useEffect, useRef } from "react";
import { PHOTO_EFFECTS, effectThumb, type PhotoEffectId } from "@/passport/keepsake/filter-effects";
import type { PhotoSource } from "@/passport/keepsake/photo";

function Thumb({ source, id }: { source: PhotoSource | null; id: PhotoEffectId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    if (!source) return;
    const t = effectThumb(source, id, 144);
    if (!t) return;
    const s = Math.max(c.width / t.width, c.height / t.height);
    ctx.drawImage(
      t as CanvasImageSource,
      (c.width - t.width * s) / 2,
      (c.height - t.height * s) / 2,
      t.width * s,
      t.height * s,
    );
  }, [source, id]);
  return <canvas ref={ref} width={96} height={96} className="kp-fx-thumb" aria-hidden="true" />;
}

/** Six photo effects as small swatches of the person's own photo. The plain "Original" is first. */
export function EffectPicker({
  value,
  source,
  onChange,
}: {
  value: PhotoEffectId;
  source: PhotoSource | null;
  onChange: (id: PhotoEffectId) => void;
}) {
  return (
    <fieldset className="kp-fx">
      <legend>Photo look</legend>
      <div className="kp-fx-row">
        {PHOTO_EFFECTS.map((e) => (
          <label key={e.id} className={`kp-fx-opt${value === e.id ? " kp-fx-on" : ""}`}>
            <input
              type="radio"
              name="kp-effect"
              value={e.id}
              checked={value === e.id}
              onChange={() => onChange(e.id)}
            />
            <Thumb source={source} id={e.id} />
            <span>{e.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
