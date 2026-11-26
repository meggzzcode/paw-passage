// Plain-language answer to "where does my stuff live?". Shared by /unlock and /passport.
import { AppLink } from "@/components/shell/AppLink";

export function TrustBlock({
  heading = "How it works and where your data lives",
  entitled = false,
}: {
  heading?: string;
  /** A paying customer already has sync: never tell them that buying adds it. */
  entitled?: boolean;
}) {
  return (
    <section className="pa-panel" aria-labelledby="trust-h">
      <h2 id="trust-h" className="pa-h">
        {heading}
      </h2>
      <ul className="co-plain">
        <li>
          <strong>Your progress is saved on your device.</strong> No account is needed to use the
          free passport.
        </li>
        <li>
          <strong>Export a backup any time, free.</strong> It is a small file you can keep or move
          to another device.
        </li>
        <li>
          <strong>Photos never leave your device.</strong> Personalized keepsakes in the full
          Passport are made in your browser and are never uploaded.
        </li>
        {entitled ? (
          <li>
            <strong>Your progress syncs.</strong> With your Passport, your progress follows you
            across devices, and you can restore it with your purchase code.
          </li>
        ) : (
          <li>
            <strong>Buying adds sync.</strong> With the full Passport your progress follows you
            across devices, and you can restore it with your purchase code.
          </li>
        )}
      </ul>
      <p className="pa-fine">
        Read your dog: three short signs on every adventure card that tell you when to ease off.{" "}
        <AppLink to="/how-we-write-adventures" className="pa-linkbtn">
          How we write adventures
        </AppLink>
      </p>
    </section>
  );
}
