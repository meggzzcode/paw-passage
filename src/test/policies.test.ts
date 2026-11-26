import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { COOKIE } from "@/server/passport/session";
import { SESSION_DAYS } from "@/server/passport/config";
import { STORAGE_KEY } from "@/passport/local-store";
import { PWA_ENABLED } from "@/lib/pwa";
import { flags } from "@/config/commercial";
import { affiliateDisclosureBody } from "@/lib/disclosure";

// The policy pages are plain text inside route files; these tests keep them in step with what the code does.
const read = (f: string) => readFileSync(`src/routes/${f}.tsx`, "utf8");
const privacy = read("privacy");
const terms = read("terms");
const refund = read("refund-policy");
const contact = read("contact");
const disclaimer = read("disclaimer");
const all = [privacy, terms, refund, contact, disclaimer].join("\n");

describe("privacy policy matches the code", () => {
  it("names the real session cookie, its lifetime and the real storage key", () => {
    expect(privacy).toContain(COOKIE);
    expect(privacy).toContain(`${SESSION_DAYS} days`);
    expect(privacy).toContain(STORAGE_KEY);
  });
  it("says photos are never uploaded and the server does not keep email", () => {
    expect(privacy).toMatch(/\*\*not uploaded\*\*/);
    expect(privacy).toMatch(/does not request or store your email/);
  });
  it("discloses Google Analytics cookies and does not claim 'no cookies'", () => {
    expect(privacy).toMatch(/Google Analytics[^.]*cookies/);
    expect(privacy).not.toMatch(/we (do not|don't) (use|set) (any )?cookies/i);
  });
  it("points to buttons that exist for export and deletion", () => {
    const forms = readFileSync("src/components/passport/AccessForms.tsx", "utf8");
    expect(forms).toContain("Download account data");
    expect(forms).toContain("Delete account copy");
    expect(privacy).toContain("Download account data");
    expect(privacy).toContain("Delete account copy");
  });
  it("describes push and the service worker as off only while they are off", () => {
    expect(PWA_ENABLED).toBe(false);
    expect(flags.notifications).toBe(false);
    expect(privacy).toMatch(/does not install a service worker or offer push notifications/);
  });
});

describe("terms, refunds and contact stay honest", () => {
  it("never states a refund period, a guarantee or perpetual service", () => {
    for (const t of [terms, refund, privacy, contact]) {
      expect(t).not.toMatch(/\b\d+[- ]day(s)? (refund|money)/i);
      expect(t).not.toMatch(/money.back guarantee|no questions asked/i);
      expect(t).not.toMatch(/forever|for life|unlimited updates|lifetime (access|updates)/i);
    }
    expect(refund).toMatch(/does not set a refund period/);
    expect(terms).toMatch(/do not promise to add adventures/);
  });
  it("shows no price on policy pages (the price lives in one config)", () => {
    expect(all).not.toMatch(/\$\d/);
  });
  it("the contact page has no hard-coded address and uses the configured one", () => {
    expect(contact).not.toMatch(/[\w.]+@[\w.]+\.[a-z]{2,}/i);
    expect(contact).toContain("ContactEmail");
    const settings = readFileSync("content/settings.yml", "utf8");
    expect(settings).toMatch(/^contactEmail:\s*"[^"@\s]+@[^"@\s]+\.[a-z]+"/m);
  });
  it("refunds, restore and photo handling tell people what not to send", () => {
    expect(refund).toMatch(/Do not send your license key/);
    expect(contact).toMatch(/Never send your license\s+key/);
  });
});

describe("affiliate disclosure", () => {
  const body = affiliateDisclosureBody("As an Amazon Associate I earn from qualifying purchases.");
  it("says there are no display ads or affiliate links inside the Passport", () => {
    expect(body).toMatch(/no display ads/);
    expect(body).toMatch(/Passport shows no affiliate links/);
  });
  it("no affiliate code in the Passport components", () => {
    const fs = readFileSync("src/components/passport/AccessForms.tsx", "utf8");
    expect(fs).not.toMatch(/amazon|affiliate/i);
  });
});

describe("disclaimer", () => {
  it("makes no medical or behavior-change promise", () => {
    expect(disclaimer).toMatch(/not veterinary advice/);
    expect(disclaimer).toMatch(/not behavior treatment|no adventure is intended as a treatment/);
  });
});
