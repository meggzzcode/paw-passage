import { flags } from "@/config/commercial";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { Button } from "@/components/shell/Button";
import { AppLink } from "@/components/shell/AppLink";
import { StampShelf } from "@/components/passport/StampShelf";
import { AccountPanel } from "@/components/passport/AccessForms";
import { achievements as achDefs, collections } from "@/passport/content";
import { useAdventureLibrary } from "@/components/passport/collections-shared";
import { TrustBlock } from "@/components/passport/TrustBlock";
import { SyncStatus } from "@/components/passport/SyncStatus";
import { achievements, members } from "@/passport/progress";
import { clearLocal, exportJson, importJson } from "@/passport/local-store";
import { downloadBlob, makeKeepsakeBlob } from "@/passport/keepsake/render";
import { usePassport } from "@/passport/usePassport";
import { track } from "@/passport/events";
import { pageHead } from "@/lib/seo";
import { NotificationSettings } from "@/components/passport/NotificationSettings";
import { RestoreAccessCallout } from "@/components/passport/RestoreAccessCallout";
import { PrintablesCard } from "@/components/printables/PrintablesIndex";
import { InstallCard } from "@/components/site/InstallCard";
import { UpcomingAdventures } from "@/components/passport/UpcomingAdventures";

export const Route = createFileRoute("/passport")({
  head: () =>
    pageHead({
      title: "My Passport",
      description:
        "Your dog's adventure passport: stamps, milestones and memories, stored on your device.",
      path: "/passport",
      noindex: true,
    }),
  validateSearch: (s: Record<string, unknown>): { view?: "upcoming"; plan?: string } => {
    const out: { view?: "upcoming"; plan?: string } = {};
    if (s["view"] === "upcoming") out.view = "upcoming";
    if (typeof s["plan"] === "string" && /^pl-[a-z0-9]{8}$/.test(s["plan"])) out.plan = s["plan"];
    return out;
  },
  component: PassportPage,
});

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function PassportPage() {
  const { ready, save, saveState, profile } = usePassport();
  const { view, plan } = Route.useSearch();
  const [msg, setMsg] = useState("");
  const [askDelete, setAskDelete] = useState(false);
  const { all: lib } = useAdventureLibrary();
  const cols = Object.fromEntries(
    collections.map((c) => [
      c.slug,
      lib.filter((a) => a.collections.includes(c.slug)).map((a) => a.id),
    ]),
  );
  const earned = achievements(save, lib, cols);
  const favs = members(save.favorites)
    .map((id) => lib.find((a) => a.id === id))
    .filter((a) => a !== undefined)
    .slice(0, 5);
  const next = achDefs.find((x) => x.kind === "count" && x.threshold === earned.next);

  function doExport() {
    downloadBlob(
      new Blob([exportJson()], { type: "application/json" }),
      "paw-and-passage-progress.json",
    );
  }

  if (!ready)
    return (
      <Container>
        <div className="pa-page" aria-busy="true" />
      </Container>
    );
  const name = profile.name || "Your dog";
  const facts = [
    profile.lifeStage && cap(profile.lifeStage),
    profile.size && `${cap(profile.size)} dog`,
    profile.energy && `${cap(profile.energy)} energy`,
    profile.home && cap(profile.home.replace(/-/g, " ")),
  ].filter((x): x is string => Boolean(x));
  const prefs = [
    save.owner.data.mobility && `Walking: ${save.owner.data.mobility.replace(/-/g, " ")}`,
    save.owner.data.hasCar === "no" && "No car",
    save.owner.data.typicalBudget !== undefined && `Budget about $${save.owner.data.typicalBudget}`,
    save.owner.data.prep && `Prep: ${save.owner.data.prep}`,
  ].filter((x): x is string => Boolean(x));

  return (
    <Container>
      <div className="pa-page">
        <RestoreAccessCallout />
        <p className="pa-kicker">Adventure Passport</p>
        <h1 className="pa-h1">{name}'s passport</h1>
        <p className="pa-sub">
          {earned.count} {earned.count === 1 ? "adventure" : "adventures"} collected ·{" "}
          {earned.stamps.length} {earned.stamps.length === 1 ? "stamp" : "stamps"}
        </p>
        <p className="pa-fine" role="status">
          {saveState === "saved"
            ? "Your progress is saved in this browser on this device. It isn't uploaded anywhere. Export a backup below to keep a copy or move to another device."
            : "This browser couldn't save your progress, so it is only kept while this tab stays open. Export a backup below before you leave."}
        </p>

        <div className="pa-row">
          <button type="button" className="pp-btn pp-btn-primary" onClick={doExport}>
            Export my progress
          </button>
          <span className="pa-fine">Free, always. A small file with your progress.</span>
        </div>

        <SyncStatus />

        <StampShelf earned={earned.stamps} />

        <UpcomingAdventures focus={view === "upcoming"} planId={plan} />
        <PrintablesCard />
        {flags.notifications && <NotificationSettings />}
        <InstallCard />

        <section className="pa-panel" aria-labelledby="ms-h">
          <h2 id="ms-h" className="pa-h">
            Milestones
          </h2>
          {earned.milestones.length > 0 ? (
            <ul>
              {earned.milestones.map((t) => (
                <li key={t}>
                  {achDefs.find((x) => x.threshold === t)?.title ?? `${t} adventures`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="pa-fine">Your first milestone is one adventure away.</p>
          )}
          {earned.next && (
            <p className="pa-fine">
              Next milestone at {earned.next} adventures{next ? `: ${next.title}` : ""}.
            </p>
          )}
          {earned.milestones.length > 0 && (
            <div className="pa-row">
              <button
                type="button"
                className="pp-btn pp-btn-secondary"
                onClick={async () => {
                  const b = await makeKeepsakeBlob({
                    template: "milestone-card",
                    dogName: name,
                    title: `${earned.count} adventures`,
                    stampCount: earned.stamps.length,
                    stampSlugs: earned.stamps,
                    variant: "square",
                  });
                  downloadBlob(b, "paw-and-passage-milestone.png");
                  track("keepsake_created", { kind: "milestone" });
                }}
              >
                Download milestone card
              </button>
            </div>
          )}
        </section>

        <section className="pa-panel" aria-labelledby="prof-h">
          <h2 id="prof-h" className="pa-h">
            Profile and preferences
          </h2>
          {facts.length + prefs.length > 0 ? (
            <ul className="pa-meta" aria-label="What we know">
              {[...facts, ...prefs].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : (
            <p className="pa-fine">
              We don't know much about {name === "Your dog" ? "your dog" : name} yet. Anything we
              don't know is treated as unknown, never as safe.
            </p>
          )}
          <div className="pa-row">
            <AppLink
              to="/discover"
              search={{ mode: "made" } as never}
              hash="profile"
              className="pp-btn pp-btn-secondary"
            >
              Personalize
            </AppLink>
          </div>
        </section>

        {favs.length > 0 && (
          <section className="pa-panel" aria-labelledby="fav-h">
            <h2 id="fav-h" className="pa-h">
              Recent favorites
            </h2>
            <ul>
              {favs.map((a) => (
                <li key={a.id}>{a.title}</li>
              ))}
            </ul>
            <AppLink
              to="/collections"
              search={{ tab: "favorites" } as never}
              className="pa-linkbtn"
            >
              All favorites
            </AppLink>
          </section>
        )}

        <div className="pa-row">
          <Button to="/discover">Find another adventure</Button>
          <Button to="/our-story" variant="secondary">
            Our Story
          </Button>
        </div>

        <section className="pa-panel" aria-labelledby="bk-h">
          <h2 id="bk-h" className="pa-h">
            Keep your progress safe
          </h2>
          <p>
            Export a backup, or restore one on another device. A backup holds your profile,
            completed adventures, favorites, memories and collections. It never holds photos or
            keepsakes.
          </p>
          <div className="pa-row">
            <button type="button" className="pp-btn pp-btn-secondary" onClick={doExport}>
              Export my progress
            </button>
            <label className="pp-btn pp-btn-secondary">
              Import backup
              <input
                type="file"
                accept="application/json"
                className="sr-only"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = importJson(await f.text());
                  setMsg(r.ok ? "Backup merged into this passport." : r.error);
                }}
              />
            </label>
            {!askDelete ? (
              <button
                type="button"
                className="pp-btn pp-btn-ghost"
                onClick={() => setAskDelete(true)}
              >
                Delete local data
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="pp-btn pp-btn-primary"
                  onClick={() => {
                    clearLocal();
                    setAskDelete(false);
                    setMsg("Local progress deleted.");
                  }}
                >
                  Yes, delete everything on this device
                </button>
                <button
                  type="button"
                  className="pp-btn pp-btn-secondary"
                  onClick={() => setAskDelete(false)}
                >
                  Keep it
                </button>
              </>
            )}
          </div>
          {msg && <p role="status">{msg}</p>}
        </section>

        <TrustBlock heading="Where your data lives" />

        <AccountPanel />
      </div>
    </Container>
  );
}
