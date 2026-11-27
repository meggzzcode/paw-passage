// What shows under an adventure once it has been marked done. One calm moment: the memory, the stamp, and either the
// keepsake maker (full Passport) or ONE static example with ONE invitation (free). It never sells to a paying customer.
import { useEffect, useRef, useState } from "react";
import { AppLink } from "@/components/shell/AppLink";
import { KeepsakeExampleFigure } from "./KeepsakeUnlock";
import { KeepsakeGate } from "./KeepsakeGate";
import { COMPLETION_HEADING, PASSPORT_INVITE, PASSPORT_PAYMENT } from "./purchase-copy";
import { StampGrid } from "@/passport/art/stamps";
import { stamps } from "@/passport/content";
import { track } from "@/passport/events";
import { setMemory } from "@/passport/local-store";
import { usePassport } from "@/passport/usePassport";
import { useKeepsakeEntitled } from "@/passport/useKeepsakeEntitled";
import type { Adventure } from "@/passport/schema";

export function CompletionPanel({
  a,
  dogName,
  focus = false,
}: {
  a: Adventure;
  dogName?: string | undefined;
  /** Move focus to the heading (just completed). */
  focus?: boolean | undefined;
}) {
  const { save } = usePassport();
  const paid = useKeepsakeEntitled();
  const [memory, setMem] = useState(save.memories[a.id]?.text ?? "");
  const [showKeepsake, setShowKeepsake] = useState(false);
  const h = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focus) h.current?.focus();
  }, [focus]);
  const names = a.stamps.map((s) => stamps.find((x) => x.slug === s)?.title ?? "").filter(Boolean);

  const memoryField = (
    <label className="pa-field">
      <span>{a.memoryPrompt} (optional)</span>
      <textarea
        rows={2}
        maxLength={140}
        value={memory}
        onChange={(e) => setMem(e.target.value)}
        onBlur={() => setMemory(a.id, memory)}
      />
    </label>
  );

  return (
    <section className="ux-done qr-done" aria-labelledby={`${a.id}-done`} data-testid="completion">
      <h3 className="pa-h" id={`${a.id}-done`} tabIndex={-1} ref={h}>
        {COMPLETION_HEADING}
      </h3>
      {paid ? (
        <p>
          Added to your passport{names.length ? `, and it counts toward ${names.join(", ")}` : ""}.
        </p>
      ) : (
        <>
          <div className="qr-stamp">
            <StampGrid earned={["first-adventure"]} slugs={["first-adventure"]} size={112} />
            <p>Your first stamp is in your passport.</p>
          </div>
        </>
      )}
      {memoryField}
      {paid ? (
        <>
          <button
            type="button"
            className="pp-btn pp-btn-primary"
            aria-expanded={showKeepsake}
            onClick={() => {
              setMemory(a.id, memory);
              setShowKeepsake((v) => !v);
            }}
          >
            {showKeepsake ? "Hide keepsake maker" : "Create a keepsake"}
          </button>
          {showKeepsake && <KeepsakeGate adventure={a} dogName={dogName} memory={memory} />}
        </>
      ) : (
        <>
          <KeepsakeExampleFigure family={a.keepsake?.family} where="intro-complete" />
          <p>Making a keepsake like this from your own photo is included in the full Passport.</p>
          <div className="ux-invite" data-testid="purchase-invite">
            <p>
              <strong>{PASSPORT_INVITE}</strong>
            </p>
            <p className="pa-fine">{PASSPORT_PAYMENT}</p>
            <AppLink
              to="/unlock"
              className="pp-btn pp-btn-secondary"
              onClick={() => track("purchase_cta_clicked", { where: "intro-complete" })}
            >
              See the full Passport
            </AppLink>
          </div>
          <details className="pa-fold">
            <summary>Where is my progress kept?</summary>
            <div className="pa-fold-body">
              <p>
                Your adventures and stamps are saved on this device, in this browser, and nothing is
                uploaded. If you clear your browser's site data, or open Paws &amp; Passage in
                another browser or on another device, they will not be there. You can save a backup
                from My Passport any time.
              </p>
            </div>
          </details>
        </>
      )}
    </section>
  );
}
