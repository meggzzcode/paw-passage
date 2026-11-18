import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Copy, Check, Printer } from "lucide-react";
import {
  computeCost,
  blankStay,
  parseStay,
  lowestIndex,
  differenceText,
  summaryText,
  exampleStays,
  formatMoney,
  isFilled,
  toNum,
  type StayForm,
} from "@/lib/cost";
import { buildHostQuestions, type DogProfile } from "@/lib/host-questions";
import { feeBasisHelp, withFeeConfirmation } from "@/lib/pet-cost-message";
import { trackTool, trackToolOnce } from "@/lib/analytics";
import type { FeeBasis } from "@/content/stays/types";

const TOOL = "pet-cost-workflow";
const money = formatMoney;

const needLabels: [keyof DogProfile["needs"], string][] = [
  ["fencedYard", "I need a securely fenced yard"],
  ["jumper", "My dog can jump or climb fences"],
  ["digger", "My dog digs"],
  ["pool", "There's a pool or hot tub"],
  ["crate", "We'll use a crate"],
  ["leftAlone", "We may need to leave the dog alone sometimes"],
  ["furniture", "My dog sleeps on the bed or sofa"],
  ["stairsHard", "Stairs are hard for my dog"],
  ["reactive", "My dog is reactive to other dogs or people"],
  ["beach", "We want beach access"],
];

const inputCls = "mt-1 h-11 w-full rounded-md border border-input bg-background px-3";
const btnCls = "inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm";

function NumField({
  label,
  value,
  onChange,
  step = 1,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-muted-foreground">
        {label}
        {suffix ? ` (${suffix})` : ""}
      </span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step={step}
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

const fresh = () => [blankStay("Stay A"), blankStay("Stay B")];

export function PetCostWorkflow() {
  const [dogs, setDogs] = useState("1");
  const [nights, setNights] = useState("3");
  const [profile, setProfile] = useState<Omit<DogProfile, "dogs">>({
    dogName: "",
    size: "medium",
    breed: "",
    needs: {
      fencedYard: true,
      jumper: false,
      digger: false,
      pool: false,
      crate: false,
      leftAlone: false,
      furniture: false,
      stairsHard: false,
      reactive: false,
      beach: false,
    },
  });
  const [stays, setStays] = useState<StayForm[]>(fresh);
  const [isExample, setIsExample] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [aboutIdx, setAboutIdx] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState<"summary" | "message" | null>(null);
  const [printTarget, setPrintTarget] = useState<"summary" | "message" | null>(null);

  const touch = () => {
    trackToolOnce("tool_start", { tool: TOOL });
  };

  // The trip (dogs and nights) applies to every stay, so the stays below only ask for what differs.
  const effective = useMemo(
    () => stays.map((s) => ({ ...s, dogs, nights })),
    [stays, dogs, nights],
  );
  const results = effective.map((s) => computeCost(parseStay(s)));
  const cheapest = lowestIndex(effective);
  const diff = differenceText(effective);
  const filledCount = effective.filter(isFilled).length;

  useEffect(() => {
    if (filledCount >= 2)
      trackToolOnce("tool_complete", { tool: TOOL, label: "total", count: filledCount });
  }, [filledCount]);

  const upd = (i: number, patch: Partial<StayForm>) => {
    touch();
    setStays((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  };

  const filledIdx = effective.map((s, i) => (isFilled(s) ? i : -1)).filter((i) => i >= 0);
  const aboutStay = filledIdx.includes(aboutIdx)
    ? effective[aboutIdx]!
    : filledIdx.length
      ? effective[filledIdx[0]!]!
      : null;
  const profileFull: DogProfile = {
    ...profile,
    dogs: Math.min(4, Math.max(1, Math.round(toNum(dogs)) || 1)),
  };
  const base = buildHostQuestions(profileFull, propertyName);
  const message = withFeeConfirmation(base.message, aboutStay);

  useEffect(() => {
    if (!printTarget) return;
    const done = () => setPrintTarget(null);
    window.addEventListener("afterprint", done, { once: true });
    const t = setTimeout(() => {
      try {
        window.print();
      } finally {
        done();
      }
    }, 50);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", done);
    };
  }, [printTarget]);

  async function copyText(kind: "summary" | "message", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      trackTool("tool_copy", { tool: TOOL, label: kind });
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }
  const print = (kind: "summary" | "message") => {
    trackTool("tool_print", { tool: TOOL, label: kind });
    setPrintTarget(kind);
  };
  const hide = (kind: "summary" | "message") => (printTarget === kind ? "print:hidden" : "");

  return (
    <div data-tool="pet-cost-workflow" className="space-y-10">
      <section
        aria-labelledby="pcw-step1"
        className={printTarget === "message" ? "print:hidden" : ""}
      >
        <h2 id="pcw-step1" className="text-2xl">
          <span className="text-terracotta">Step 1.</span> Your trip
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          These apply to every stay below and to your message to the host.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm">
            <span className="font-semibold">Number of dogs</span>
            <select
              value={dogs}
              onChange={(e) => {
                touch();
                setDogs(e.target.value);
              }}
              className={inputCls}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="block text-sm">
            <NumField
              label="Nights"
              value={nights}
              onChange={(v) => {
                touch();
                setNights(v);
              }}
            />
          </div>
          <label className="block text-sm">
            <span className="font-semibold">Size of the largest dog</span>
            <select
              value={profile.size}
              onChange={(e) => {
                touch();
                setProfile({ ...profile, size: e.target.value as DogProfile["size"] });
              }}
              className={inputCls}
            >
              <option value="small">Small (under ~25 lb)</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="giant">Giant breed</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Dog's name (optional)</span>
            <input
              value={profile.dogName}
              onChange={(e) => {
                touch();
                setProfile({ ...profile, dogName: e.target.value });
              }}
              className={inputCls}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Breed or mix (optional)</span>
            <input
              value={profile.breed}
              onChange={(e) => {
                touch();
                setProfile({ ...profile, breed: e.target.value });
              }}
              className={inputCls}
            />
          </label>
        </div>
      </section>

      <section
        aria-labelledby="pcw-step2"
        className={printTarget === "message" ? "print:hidden" : ""}
      >
        <h2 id="pcw-step2" className="text-2xl">
          <span className="text-terracotta">Step 2.</span> The quoted costs
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter what each listing quotes you, for up to three stays. Refundable deposits are shown
          separately.
        </p>
        <div className="no-print mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              touch();
              setStays(exampleStays().map((s) => ({ ...s, dogs: "", nights: "" })));
              setDogs("2");
              setNights("4");
              setIsExample(true);
            }}
            className={btnCls}
          >
            Load an example
          </button>
          <button
            type="button"
            onClick={() => {
              setStays(fresh());
              setDogs("1");
              setNights("3");
              setIsExample(false);
              setGenerated(false);
            }}
            className={btnCls}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => copyText("summary", summaryText(effective))}
            className={btnCls}
          >
            {copied === "summary" ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied === "summary" ? "Copied" : "Copy summary"}
          </button>
          <button type="button" onClick={() => print("summary")} className={btnCls}>
            <Printer className="size-4" /> Print
          </button>
        </div>
        {isExample && (
          <p className="mt-4 text-sm text-muted-foreground">
            Example numbers only, not real listings. Replace them with your own or press Clear.
          </p>
        )}
        {diff && (
          <p role="status" className="mt-4 rounded-lg bg-secondary/70 p-4 font-semibold">
            {diff}
          </p>
        )}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {effective.map((s, i) => {
            const r = results[i] ?? computeCost(parseStay(s));
            const c = parseStay(s);
            const f = stays[i]!;
            return (
              <section
                key={i}
                className={`rounded-xl border bg-card p-5 shadow-card sm:p-6 ${i === cheapest ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
              >
                <div className="flex items-center gap-2">
                  <input
                    aria-label="Stay name"
                    value={f.label}
                    onChange={(e) => upd(i, { label: e.target.value })}
                    className="min-w-0 flex-1 bg-transparent font-display text-xl outline-none"
                  />
                  {stays.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Remove ${f.label}`}
                      onClick={() => setStays((x) => x.filter((_, j) => j !== i))}
                      className="p-2"
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <NumField
                    label="Nightly rate"
                    suffix="$"
                    value={f.nightly}
                    onChange={(n) => upd(i, { nightly: n })}
                  />
                  <NumField
                    label="Cleaning fee"
                    suffix="$"
                    value={f.cleaning}
                    onChange={(n) => upd(i, { cleaning: n })}
                  />
                  <NumField
                    label="Other fees"
                    suffix="$"
                    value={f.otherFees}
                    onChange={(n) => upd(i, { otherFees: n })}
                  />
                  <NumField
                    label="Tax"
                    suffix="%"
                    step={0.1}
                    value={f.taxPct}
                    onChange={(n) => upd(i, { taxPct: n })}
                  />
                  <NumField
                    label="Pet fee"
                    suffix="$"
                    value={f.petFee}
                    onChange={(n) => upd(i, { petFee: n })}
                  />
                  <label className="block text-sm">
                    <span className="text-muted-foreground">Charged</span>
                    <select
                      value={f.petFeeBasis}
                      onChange={(e) => upd(i, { petFeeBasis: e.target.value as FeeBasis })}
                      className={inputCls}
                    >
                      <option value="stay">Per stay</option>
                      <option value="night">Per night</option>
                      <option value="dog">Per dog</option>
                      <option value="dog-night">Per dog, per night</option>
                    </select>
                  </label>
                  <p
                    data-testid="fee-basis-help"
                    className="col-span-2 -mt-1 text-xs text-muted-foreground"
                  >
                    {feeBasisHelp[f.petFeeBasis]}
                  </p>
                  <div className="col-span-2">
                    <NumField
                      label="Refundable deposit"
                      suffix="$"
                      value={f.deposit}
                      onChange={(n) => upd(i, { deposit: n })}
                    />
                  </div>
                </div>
                <dl className="mt-6 space-y-1.5 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt>Lodging</dt>
                    <dd>{money(r.lodging)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Cleaning + other</dt>
                    <dd>{money(c.cleaning + c.otherFees)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Pet fees</dt>
                    <dd>{money(r.pet)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Tax</dt>
                    <dd>{money(r.tax)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 font-display text-xl">
                    <dt>Total</dt>
                    <dd>{money(r.total)}</dd>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <dt>Effective per night</dt>
                    <dd>{money(r.perNight)}</dd>
                  </div>
                  {c.deposit > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <dt>Up front incl. deposit</dt>
                      <dd>{money(r.upfront)}</dd>
                    </div>
                  )}
                  {r.pet > 0 && (
                    <p className="pt-2 text-xs text-muted-foreground">
                      Pet fees are {r.petShare}% of this total.
                    </p>
                  )}
                </dl>
                {i === cheapest && (
                  <p className="mt-3 text-sm font-semibold text-primary">Lowest total</p>
                )}
              </section>
            );
          })}
          {stays.length < 3 && (
            <button
              type="button"
              onClick={() =>
                setStays((s) => [...s, blankStay(`Stay ${String.fromCharCode(65 + s.length)}`)])
              }
              className="no-print flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Plus className="size-6" /> Add a stay
            </button>
          )}
        </div>
      </section>

      <section aria-labelledby="pcw-step3" className={hide("summary")}>
        <h2 id="pcw-step3" className="text-2xl">
          <span className="text-terracotta">Step 3.</span> Lock it in
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Get a message to send the host that asks them to confirm the pet-fee facts you entered, in
          writing, plus the questions that matter for your dog.
        </p>
        <div className="no-print mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">Property name (optional)</span>
            <input
              value={propertyName}
              onChange={(e) => {
                touch();
                setPropertyName(e.target.value);
              }}
              placeholder="e.g. Laurel Creek Cabin"
              className={inputCls}
            />
          </label>
          {filledIdx.length > 1 && (
            <label className="block text-sm">
              <span className="text-muted-foreground">Message is about</span>
              <select
                value={filledIdx.includes(aboutIdx) ? aboutIdx : filledIdx[0]}
                onChange={(e) => setAboutIdx(Number(e.target.value))}
                className={inputCls}
              >
                {filledIdx.map((i) => (
                  <option key={i} value={i}>
                    {stays[i]!.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <fieldset className="no-print mt-4">
          <legend className="text-sm font-semibold">What applies to your trip?</legend>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {needLabels.map(([k, label]) => (
              <label
                key={k}
                className="flex items-start gap-2.5 rounded-md border border-border bg-card p-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={profile.needs[k]}
                  onChange={(e) => {
                    touch();
                    setProfile({ ...profile, needs: { ...profile.needs, [k]: e.target.checked } });
                  }}
                  className="mt-0.5 size-4 accent-[var(--primary)]"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        {!generated ? (
          <button
            type="button"
            onClick={() => {
              setGenerated(true);
              trackToolOnce("tool_complete", { tool: TOOL, label: "message" });
            }}
            className="no-print mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Write my message to the host
          </button>
        ) : (
          <div
            aria-live="polite"
            className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl">
                Your message ({base.questions.length} questions)
              </h3>
              <div className="no-print flex gap-2">
                <button
                  type="button"
                  onClick={() => copyText("message", message)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  {copied === "message" ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied === "message" ? "Copied" : "Copy"}
                </button>
                <button type="button" onClick={() => print("message")} className={btnCls}>
                  <Printer className="size-4" /> Print
                </button>
              </div>
            </div>
            {!aboutStay && (
              <p className="mt-3 text-sm text-muted-foreground">
                Enter a nightly rate in Step 2 and the message will also ask the host to confirm
                your pet-fee total.
              </p>
            )}
            <pre
              data-testid="host-message"
              className="mt-4 whitespace-pre-wrap rounded-lg bg-muted p-4 font-sans text-sm leading-relaxed sm:p-5"
            >
              {message}
            </pre>
          </div>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Estimate only. Taxes and rules vary: confirm the final total with the host or the booking
        page. Tax here is applied to lodging, cleaning and other fees. It runs in your browser and
        nothing you type is sent anywhere.
      </p>
    </div>
  );
}
