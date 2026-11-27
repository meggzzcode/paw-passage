// The home page for a verified customer: a warm welcome and the day's adventure, with no price, purchase action, free
// pitch or restore link (a customer already has all of it). The visitor home stays in routes/index.tsx.
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/shell/Button";
import { Container } from "@/components/shell/Container";
import { HeroCollage } from "@/components/site/HeroCollage";
import { AppLink } from "@/components/shell/AppLink";
import { useNavMode } from "@/components/shell/useNavMode";

const QUIET_LINKS = [
  { label: "Collections", to: "/collections" as const, search: undefined },
  { label: "Saved", to: "/collections" as const, search: { tab: "favorites" } },
  { label: "My Passport", to: "/passport" as const, search: undefined },
];

export function ReturningHome() {
  return (
    <section className="pp-hero pp-hero-returning" aria-labelledby="home-h1">
      <Container>
        <div className="pp-hero-grid">
          <div>
            <p className="pp-eyebrow">Welcome back</p>
            <h1 id="home-h1" className="pp-h1">
              What shall we do <em>today</em>?
            </h1>
            <p className="pp-lede">
              Your Passport is open and your dog is ready. Pick something small, step out of the
              usual, and make another little memory.
            </p>
            <p className="pp-cta-row">
              <Button to="/discover">Find today's adventure</Button>
            </p>
            <ul className="pp-returning-links pp-plainlist" aria-label="Your Passport">
              {QUIET_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    {...(l.search ? { search: l.search as never } : {})}
                    className="pp-textlink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <HeroCollage />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Shown while a returning browser's access is being confirmed: same footprint, no content to flash or contradict. */
export function HomeSkeleton() {
  return (
    <section
      className="pp-hero pp-hero-returning pp-home-skeleton"
      aria-busy="true"
      aria-label="Checking your access"
    >
      <Container>
        <p className="pp-fine" role="status">
          Checking your access...
        </p>
      </Container>
    </section>
  );
}

/**
 * Entitlement could not be verified (API error or offline) for a browser that holds an account flag. Calm and neutral:
 * it never shows the confirmed customer welcome, and offers no purchase, restore push or price. Retry re-checks access.
 */
export function AccessCheckFailed() {
  const { retry } = useNavMode();
  return (
    <section
      className="pp-hero pp-hero-returning pp-home-error"
      aria-labelledby="home-h1"
      data-testid="access-check-failed"
    >
      <Container>
        <h1 id="home-h1" className="pp-h1">
          Having a little trouble opening your Passport. Let's try again.
        </h1>
        <p className="pp-cta-row">
          <button type="button" className="pp-btn pp-btn-primary" onClick={retry}>
            Retry
          </button>
        </p>
        <p className="pp-fine">
          Your adventures and progress on this device are safe.{" "}
          <AppLink to="/contact" className="pp-textlink">
            Contact support
          </AppLink>
        </p>
      </Container>
    </section>
  );
}
