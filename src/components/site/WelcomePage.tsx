// The page after a verified purchase or restore. Everything shown is either verified (the library the server just
// delivered to this browser) or counted on this device. It asks for nothing: one obvious next step, then optional
// extras. The purchase code is never on this page or in its address.
import { collections as allCollections } from "@/passport/content";
import { AppLink } from "@/components/shell/AppLink";
import { flags } from "@/config/commercial";
import { InstallCard } from "@/components/site/InstallCard";
import { useInstallEligible } from "@/components/site/useInstallEligibility";
import { hasProfile } from "@/components/passport/ProfileEditor";
import { members } from "@/passport/progress";
import { savedIdCount } from "@/passport/preview-view";
import { useEntitlement } from "@/passport/useEntitlement";
import { usePassport } from "@/passport/usePassport";
import type { Adventure } from "@/passport/schema";

const n = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** Verified totals from the library the server delivered: counts only, nothing about any single adventure. */
export function unlockedTotals(premium: readonly Adventure[]): {
  adventures: number;
  collections: number;
} {
  return {
    adventures: premium.length,
    collections: allCollections.length,
  };
}

export function WelcomePage() {
  const ent = useEntitlement();
  const { ready, save, profile } = usePassport();
  const installEligible = useInstallEligible();

  if (ent.status === "checking" || (ent.status === "free" && ent.signedIn)) {
    return (
      <div className="pa-page">
        <h1 className="pa-h1">Welcome</h1>
        <p aria-busy="true" role="status">
          Checking your purchase...
        </p>
      </div>
    );
  }

  if (ent.status === "offline") {
    return (
      <div className="pa-page">
        <h1 className="pa-h1">Welcome</h1>
        <p className="pa-sub" role="status">
          We could not reach the site to check your purchase just now. Nothing is wrong with your
          purchase or your progress. Please try again in a little while.
        </p>
        <p className="pp-cta-row">
          <AppLink to="/passport" className="pp-btn pp-btn-primary">
            Open my Passport
          </AppLink>
        </p>
      </div>
    );
  }

  if (ent.status !== "entitled") {
    return (
      <div className="pa-page">
        <h1 className="pa-h1">Welcome</h1>
        <p className="pa-sub">
          We could not find an active full Passport on this device. If you have already bought it,
          restore access with your purchase code. Nothing is lost either way, and your first
          adventure keeps working.
        </p>
        <p className="pp-cta-row">
          <AppLink to="/restore-access" className="pp-btn pp-btn-primary">
            Restore access
          </AppLink>
          <AppLink to="/unlock" className="pp-btn pp-btn-secondary">
            See what is included
          </AppLink>
        </p>
      </div>
    );
  }

  const t = unlockedTotals(ent.premium);
  const saved = ready ? savedIdCount(save) : 0;
  const done = ready ? members(save.done).length : 0;
  const haveProfile = ready && hasProfile(profile);
  const next = haveProfile
    ? { to: "/discover", label: "Find my next adventure" }
    : { to: "/passport", label: "Open my Passport" };

  return (
    <div className="pa-page">
      <p className="pa-kicker">Thank you</p>
      <h1 className="pa-h1">Welcome to the full Passport</h1>
      <p className="pa-sub">
        Your purchase is confirmed, and the Passport is yours to keep. Everything you have already
        done together is still here.
      </p>

      <section className="pa-card" aria-labelledby="wl-unlocked-h">
        <h2 className="pa-h" id="wl-unlocked-h">
          What is unlocked
        </h2>
        <ul className="co-plain">
          {t.adventures > 0 ? (
            <li>
              {n(t.adventures, "premium adventure", "premium adventures")}
              {t.collections > 0 ? ` across ${n(t.collections, "collection", "collections")}` : ""},
              on top of your first adventure
            </li>
          ) : (
            <li>The full library is loading on this device</li>
          )}
          <li>Personalized picks, mystery reveals, filters and your own collections</li>
          <li>
            Personalized keepsakes from your own photos, and progress that follows you to your other
            devices
          </li>
        </ul>
      </section>

      <section className="pa-card" aria-labelledby="wl-kept-h">
        <h2 className="pa-h" id="wl-kept-h">
          Where you left off
        </h2>
        <ul className="co-plain">
          <li>
            {haveProfile
              ? `Your dog's profile is saved in the same passport.`
              : "Tell us about your dog any time and the picks will fit them."}
          </li>
          {done > 0 && <li>{n(done, "adventure", "adventures")} completed, with your stamps.</li>}
          {saved > 0 && (
            <li>
              Your saved previews are now ready: {saved} saved, and their full adventures are open.
            </li>
          )}
        </ul>
      </section>

      <p className="wl-next pp-cta-row">
        <AppLink to={next.to} className="pp-btn pp-btn-primary">
          {next.label}
        </AppLink>
        {next.to === "/discover" && (
          <AppLink to="/passport" className="pp-textlink">
            or open my Passport
          </AppLink>
        )}
      </p>

      {(installEligible || flags.notifications) && <h2 className="pa-h">Only if you like</h2>}
      <InstallCard />
      {flags.notifications && (
        <p className="pa-fine">
          Reminders are optional. If you ever want one, you can turn it on in My Passport. Nothing
          is switched on for you.
        </p>
      )}
    </div>
  );
}
