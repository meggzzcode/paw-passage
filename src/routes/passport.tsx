import { flags } from "@/config/commercial";
import { BRAND } from "@/config/brand";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { Button } from "@/components/shell/Button";
import { AppLink } from "@/components/shell/AppLink";
import { PassportCover, passportPrimaryLabel } from "@/components/passport/PassportCover";
import { PassportSection } from "@/components/passport/PassportSection";
import { StampsAndMilestones } from "@/components/passport/PassportRewards";
import { StoryTimeline } from "@/components/passport/StoryTimeline";
import { isLive, usePlans } from "@/lib/plans";
import { AccountPanel, SharedDeviceChoice } from "@/components/passport/AccessForms";
import {
  achievements as achDefs,
  collections,
  freeLibrary,
  stamps as stampDefs,
} from "@/passport/content";
import { useAdventureLibrary } from "@/components/passport/collections-shared";
import { TrustBlock } from "@/components/passport/TrustBlock";
import { SyncStatus } from "@/components/passport/SyncStatus";
import { isRevealed } from "@/passport/starter";
import { achievements, has, members } from "@/passport/progress";
import { isSavedMystery } from "@/components/passport/RevealSurface";
import { clearLocal, exportJson, importJson } from "@/passport/local-store";
import { downloadBlob } from "@/passport/keepsake/download";
import { loadMilestoneRenderer } from "@/components/passport/keepsake-loader";
import { useKeepsakeEntitled } from "@/passport/useKeepsakeEntitled";
import { KeepsakeUnlock } from "@/components/passport/KeepsakeUnlock";
import { usePassport } from "@/passport/usePassport";
import { track } from "@/passport/events";
import { pageHead } from "@/lib/seo";
import { NotificationSettings } from "@/components/passport/NotificationSettings";
import { RestoreAccessCallout } from "@/components/passport/RestoreAccessCallout";
import { PrintablesCard } from "@/components/printables/PrintablesIndex";
import { InstallCard } from "@/components/site/InstallCard";
import { useNavMode } from "@/components/shell/useNavMode";
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
  const canMake = useKeepsakeEntitled();
  const [msg, setMsg] = useState("");
  const [askDelete, setAskDelete] = useState(false);
  const { all: lib, unlocked: entitled } = useAdventureLibrary();
  const { mode: accessMode, retry } = useNavMode();
  const accessError = accessMode === "error";
  const livePlans = usePlans().filter(isLive);
  // Collection Complete is judged against the WHOLE curated collection, so it only counts once the full library is
  // loaded for an entitled customer (never against the free pool alone, which would "complete" a larger collection early).
  const fullLibrary = entitled && lib.length > freeLibrary().length;
  const cols = fullLibrary
    ? Object.fromEntries(
        collections.map((c) => [
          c.slug,
          lib.filter((a) => a.collections.includes(c.slug)).map((a) => a.id),
        ]),
      )
    : {};
  const earned = achievements(save, lib, cols);
  // Without the full Passport the list holds only the visitor's own revealed intro adventure (public previews are
  // bookmarked on /previews and Saved).
  const mayList = (id: string) =>
    entitled || (save.starter?.id === id && save.starter.revealedAt !== undefined);
  const savedIds = [...new Set([...members(save.favorites), ...members(save.saved)])].filter(
    mayList,
  );
  const saved = savedIds.map((id) => lib.find((a) => a.id === id)).filter((a) => a !== undefined);

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
  const rewardTotal = stampDefs.length;
  // Collection Complete is one milestone, however many collections have been finished.
  const milestonesReached =
    earned.milestones.length + (earned.collectionsComplete.length > 0 ? 1 : 0);
  const nextAch = achDefs.find((x) => x.kind === "count" && x.threshold === earned.next);
  const showPlans = entitled || livePlans.length > 0 || view === "upcoming";

  return (
    <Container>
      <div className="pa-page pv8-page">
        <RestoreAccessCallout />
        {/* Up front, not inside the collapsed "Account and privacy" section: a different customer must see this choice. */}
        <SharedDeviceChoice />
        <PassportCover
          name={name}
          headline={BRAND.passportHeadline}
          adventures={earned.count}
          stamps={earned.stamps.length}
          earnedStamps={earned.stamps}
          facts={facts}
          access={accessError ? "unconfirmed" : entitled ? "paid" : "free"}
        >
          {accessError ? (
            <div className="pv8-cover-error" data-testid="access-check-failed" role="status">
              <p>Having a little trouble opening your Passport. Let's try again.</p>
              <div className="pv8-cover-actions">
                <button type="button" className="pp-btn pp-btn-primary" onClick={retry}>
                  Retry
                </button>
                <AppLink to="/contact" className="pv8-cover-link">
                  Contact support
                </AppLink>
                <AppLink to="/restore-access" className="pv8-cover-link">
                  Restore access
                </AppLink>
              </div>
              <p className="pa-fine">Your adventures and progress on this device are safe.</p>
            </div>
          ) : (
            <div className="pv8-cover-actions">
              <Button to="/discover">
                {passportPrimaryLabel(entitled, isRevealed(save), earned.count)}
              </Button>
              <AppLink
                to="/discover"
                search={{ mode: "made" } as never}
                hash="profile"
                className="pv8-cover-link"
              >
                Personalize
              </AppLink>
            </div>
          )}
        </PassportCover>
        {saveState !== "saved" && (
          <p className="pa-fine" role="status">
            This browser couldn't save your progress, so it is only kept while this tab stays open.
            Export a backup from Account and privacy before you leave.
          </p>
        )}
        {!accessError && <SyncStatus />}

        <div className="pv8-chapters">
          <PassportSection
            id="bucket"
            title="Our bucket list"
            summary={
              saved.length > 0
                ? `${savedIds.length} saved for later`
                : "Adventures you'd like to try together"
            }
          >
            {saved.length > 0 ? (
              <ul className="pv8-plain">
                {saved.slice(0, 6).map((a) => (
                  <li key={a.id}>
                    {!has(save.done, a.id) && isSavedMystery(a.id)
                      ? "A mystery adventure, saved and not revealed yet"
                      : a.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pa-fine">
                Nothing saved yet. Tap the heart on an adventure to keep it here.
              </p>
            )}
            <AppLink
              to="/collections"
              search={{ tab: "favorites" } as never}
              className="pa-linkbtn"
            >
              {saved.length > 0 ? "See all saved adventures" : "Browse adventures"}
            </AppLink>
          </PassportSection>

          <PassportSection
            id="memories"
            title="Our little memories"
            summary={
              earned.count > 0
                ? `${earned.count} ${earned.count === 1 ? "adventure" : "adventures"} completed`
                : "Your story starts with the first one"
            }
          >
            <StoryTimeline />
          </PassportSection>

          <PassportSection
            id="stamps-h"
            anchors={["stamps", "milestones"]}
            title="Stamps and milestones"
            summary={`${earned.stamps.length} of ${rewardTotal} stamps · ${milestonesReached} ${milestonesReached === 1 ? "milestone" : "milestones"}`}
          >
            <StampsAndMilestones
              earnedStamps={earned.stamps}
              earnedMilestones={earned.milestones}
              collectionsComplete={earned.collectionsComplete.length}
              entitled={entitled}
            />
            {earned.next && (
              <p className="pa-fine">
                Next milestone at {earned.next} adventures{nextAch ? `: ${nextAch.title}` : ""}.
              </p>
            )}
            {earned.milestones.length > 0 && !canMake && (
              <KeepsakeUnlock where="card" family="certificate" />
            )}
            {earned.milestones.length > 0 && canMake && (
              <div className="pa-row">
                <button
                  type="button"
                  className="pp-btn pp-btn-secondary"
                  onClick={async () => {
                    const { makeKeepsakeBlob } = await loadMilestoneRenderer();
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
          </PassportSection>

          {showPlans && (
            <PassportSection
              id="plans"
              anchors={["upcoming"]}
              defaultOpen={view === "upcoming"}
              title="Little plans ahead"
              summary={
                livePlans.length > 0
                  ? `${livePlans.length} ${livePlans.length === 1 ? "adventure" : "adventures"} planned`
                  : "Nothing planned yet"
              }
            >
              <UpcomingAdventures focus={view === "upcoming"} planId={plan} />
              {flags.notifications && <NotificationSettings />}
            </PassportSection>
          )}
        </div>

        <PrintablesCard />
        <InstallCard />

        <PassportSection
          id="account"
          anchors={["acct-h", "privacy"]}
          quiet
          title="Account and privacy"
          summary="Backup, sync, sign out and support"
        >
          <p role="status" className="pa-fine">
            {saveState === "saved"
              ? entitled
                ? "Your progress is saved in this browser and kept in sync with your passport account."
                : "Your progress is saved in this browser on this device. It isn't uploaded anywhere."
              : "This browser couldn't save your progress, so it is only kept while this tab stays open."}
          </p>
          <p>
            Photos are processed locally on your device and are not stored online. A backup holds
            your profile, completed adventures, saved adventures, memories and collections, never
            photos or keepsakes.
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
          {facts.length + prefs.length > 0 && (
            <ul className="pa-meta" aria-label="What we know">
              {[...facts, ...prefs].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          <TrustBlock heading="Where your data lives" entitled={entitled} />
          <AccountPanel />
          <p className="pa-fine">
            Questions? <AppLink to="/contact">Contact support</AppLink>
          </p>
        </PassportSection>
      </div>
    </Container>
  );
}
