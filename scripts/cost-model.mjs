#!/usr/bin/env node
// Netlify credit calculator for Paws & Passage. Pure: no network, no reads of the repo. Every assumption is a constant
// below so the owner can change it. Run: node scripts/cost-model.mjs   (add --json for machine-readable output).
// Each constant is tagged V (verified on a Netlify/Gumroad page, see docs/OPERATING-COSTS.md), M (measured from this repo
// on 2026-11-26) or E (estimate: replace with real usage numbers once the Netlify Usage screen has a month of data).

export const RATES = {
  // V: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/
  creditsPerGbHour: 10,
  creditsPerGbBandwidth: 20,
  creditsPer10kRequests: 2,
  creditsPerProductionDeploy: 15,
};

export const PLANS = [
  // V: monthly credits from the credit-based-pricing-plans docs page; price from netlify.com/pricing.
  { name: "Free", credits: 300, usdPerMonth: 0, note: "hard limit, no recharge" },
  { name: "Personal", credits: 1000, usdPerMonth: 9, note: "auto recharge optional (keep OFF)" },
  { name: "Pro (base)", credits: 3000, usdPerMonth: 20, note: "auto recharge optional (keep OFF)" },
];

export const GUMROAD = {
  // V: https://gumroad.com/pricing (read 2026-11-26). Payment-processor fees are not itemized on that page.
  price: 19.99,
  directPct: 0.1,
  directFixed: 0.5,
  discoverPct: 0.3,
};

export const ASSUME = {
  // Library size served by /api/premium/adventures. M: 99 records, 504,863 bytes JSON, 136,399 bytes gzip.
  libraryRawBytes: 504_863,
  libraryGzBytes: 136_399,
  libraryScale: 1, // E: set to 3 to model a library three times as large
  compressedResponses: true, // E: assume the CDN compresses the function response. Set false to bill raw bytes.
  libraryBlobReads: 100, // M: index + one blob per adventure (readPremium), at 99 adventures

  // Customer record (Blobs). M: validateSave caps a record at 60,000 chars. E: the average is far smaller.
  recordAvgBytes: 8_000,
  recordMaxBytes: 60_000,
  notifRecordBytes: 3_000, // E, only when push is enabled

  // Behavior of an ACTIVE customer. E.
  sessionsPerActiveMonth: 8,
  putsPerSession: 3, // debounced 2 s after changes, plus flush on tab hide
  pullsPerSession: 1, // focus pull at most once a minute
  progressGetBytes: 8_000, // E: gzip of an average record
  htmlBytes: 30_000, // E: one SSR page, gzip
  returningAssetBytes: 100_000, // E: cached hashed bundles; some chunks refetch after each deploy
  newDeviceEventsPerActiveMonth: 0.2, // E: new device, cleared cache
  newVisitBytes: 850_000, // E: M says JS+CSS is 667 KB gzip in total; a visit loads route chunks + some images
  apiCallsPerSession: 1 /*session*/ + 1 /*premium*/ + 1 /*pull*/ + 3 /*puts*/ + 1 /*plans*/,
  assetRequestsReturning: 4,
  assetRequestsNew: 22,

  // Journal and public traffic. E.
  newVisitorShare: 0.7,
  returnVisitBytes: 150_000,
  previewsFetchPerVisit: 0.25, // GET /api/previews (cache-control public, max-age=300; CDN hit rate unknown: counted as misses)
  previewsBytes: 6_000, // E: ~50 items, gzip
  matchPerVisit: 0.08, // POST /api/previews/match, only on an explicit user action
  matchBytes: 1_000,

  // Function compute. E. Memory per function is NOT verified (docs page for limits was not read): 1 GB is assumed.
  functionMemoryGb: 1,
  msSsrPage: 120,
  msSession: 40,
  msPremium: 350, // 100 parallel blob reads
  msProgressGet: 60,
  msProgressPut: 120,
  msPlansSync: 60,
  msPreviews: 30,
  msMatch: 80,

  // Deploys. E. A docs-only push is skipped by netlify.toml `ignore`.
  productionDeploysPerMonth: 12,

  // Push, only in the ENABLED scenario (paused today: flags.notifications=false, push-deliver has no schedule).
  optInShare: 0.25, // E
  pushesPerOptedInPerMonth: 12, // E
  msPerDelivery: 150, // E
  scheduledRunsPerMonth: 30 * 24 * 4, // 2,880 runs at */15 (V by arithmetic)
  msPerScheduledRun: 250, // E: cursor + one due bucket read, no deliveries
};

const gbHours = (ms, n, A) => (ms / 3_600_000) * n * A.functionMemoryGb;
const bwCredits = (bytes, R) => (bytes / 1e9) * R.creditsPerGbBandwidth;
const reqCredits = (n, R) => (n / 10_000) * R.creditsPer10kRequests;
const cpuCredits = (gbh, R) => gbh * R.creditsPerGbHour;

/** Credits per month for one scenario. Returns a breakdown. */
export function model(
  { customers, activeShare, journalVisits, push = false, deploys, libraryScale },
  A = ASSUME,
  R = RATES,
) {
  const scale = libraryScale ?? A.libraryScale;
  const mau = customers * activeShare;
  const sessions = mau * A.sessionsPerActiveMonth;
  const libBytes = (A.compressedResponses ? A.libraryGzBytes : A.libraryRawBytes) * scale;

  // Customers.
  const custBytes =
    sessions *
      (A.htmlBytes +
        libBytes +
        (A.pullsPerSession + 0) * A.progressGetBytes +
        A.returningAssetBytes +
        500 * A.putsPerSession) +
    mau * A.newDeviceEventsPerActiveMonth * A.newVisitBytes;
  const custReq =
    sessions * (1 + A.assetRequestsReturning + A.apiCallsPerSession) +
    mau * A.newDeviceEventsPerActiveMonth * A.assetRequestsNew;
  const custGbh =
    gbHours(A.msSsrPage, sessions, A) +
    gbHours(A.msSession, sessions, A) +
    gbHours(A.msPremium * Math.max(1, scale), sessions, A) +
    gbHours(A.msProgressGet * A.pullsPerSession, sessions, A) +
    gbHours(A.msProgressPut * A.putsPerSession, sessions, A) +
    gbHours(A.msPlansSync, sessions, A);

  // Journal and other public visits (independent of customers).
  const v = journalVisits;
  const jBytes =
    v *
      (A.htmlBytes +
        A.newVisitorShare * A.newVisitBytes +
        (1 - A.newVisitorShare) * A.returnVisitBytes) +
    v * (A.previewsFetchPerVisit * A.previewsBytes + A.matchPerVisit * A.matchBytes);
  const jReq =
    v *
    (1 +
      A.newVisitorShare * A.assetRequestsNew +
      (1 - A.newVisitorShare) * A.assetRequestsReturning +
      A.previewsFetchPerVisit +
      A.matchPerVisit);
  const jGbh =
    gbHours(A.msSsrPage, v, A) +
    gbHours(A.msPreviews, v * A.previewsFetchPerVisit, A) +
    gbHours(A.msMatch, v * A.matchPerVisit, A);

  // Push (enabled scenario only).
  let pushGbh = 0;
  let pushReq = 0;
  if (push) {
    pushGbh =
      gbHours(A.msPerScheduledRun, A.scheduledRunsPerMonth, A) +
      gbHours(A.msPerDelivery, customers * A.optInShare * A.pushesPerOptedInPerMonth, A);
    pushReq = customers * A.optInShare * 4; // prefs and device calls, E
  }

  const parts = {
    deploys: (deploys ?? A.productionDeploysPerMonth) * R.creditsPerProductionDeploy,
    custBandwidth: bwCredits(custBytes, R),
    custRequests: reqCredits(custReq, R),
    custCompute: cpuCredits(custGbh, R),
    journalBandwidth: bwCredits(jBytes, R),
    journalRequests: reqCredits(jReq, R),
    journalCompute: cpuCredits(jGbh, R),
    pushCompute: cpuCredits(pushGbh, R),
    pushRequests: reqCredits(pushReq, R),
  };
  const total = Object.values(parts).reduce((a, b) => a + b, 0);
  return {
    mau,
    total,
    parts,
    gbOut: (custBytes + jBytes) / 1e9,
    storageMb:
      (customers * A.recordAvgBytes + (push ? customers * A.optInShare * A.notifRecordBytes : 0)) /
      1e6,
    storageMaxMb: (customers * A.recordMaxBytes) / 1e6,
    blobReads: sessions * (A.libraryBlobReads * scale + 3),
    blobWrites: sessions * A.putsPerSession,
  };
}

export const smallestPlan = (credits) =>
  PLANS.find((p) => credits <= p.credits)?.name ?? "above Pro base (3,000): needs more credits";

export function gumroadNet(price = GUMROAD.price, G = GUMROAD) {
  const direct = price * (1 - G.directPct) - G.directFixed;
  const discover = price * (1 - G.discoverPct);
  return { direct: Math.round(direct * 100) / 100, discover: Math.round(discover * 100) / 100 };
}

/** Customer count (at the given active share) where the smallest plan's credits run out. */
export function breakEven({ planCredits, activeShare, journalVisits, deploys }) {
  let lo = 0,
    hi = 5_000_000;
  if (model({ customers: 0, activeShare, journalVisits, deploys }).total > planCredits) return 0;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (model({ customers: mid, activeShare, journalVisits, deploys }).total > planCredits)
      hi = mid;
    else lo = mid;
  }
  return lo;
}

const f = (n) => (n >= 100 ? Math.round(n).toLocaleString("en-US") : n.toFixed(1));

function report() {
  const out = [];
  const base = { journalVisits: 10_000, deploys: ASSUME.productionDeploysPerMonth };
  out.push(
    "# Monthly credits by cumulative customers (paused push; base journal 10,000 visits/mo, 12 deploys/mo)\n",
  );
  out.push(
    "| Customers | Active | MAU | Credits/mo | Of which customers | Plan that covers it | Headroom on that plan |",
  );
  out.push("|---|---|---|---|---|---|---|");
  for (const customers of [100, 1000, 5000, 10000])
    for (const activeShare of [0.2, 0.4, 0.6]) {
      const m = model({ customers, activeShare, ...base });
      const cust = m.parts.custBandwidth + m.parts.custRequests + m.parts.custCompute;
      const plan = PLANS.find((p) => m.total <= p.credits);
      out.push(
        `| ${customers.toLocaleString("en-US")} | ${activeShare * 100}% | ${f(m.mau)} | ${f(m.total)} | ${f(cust)} | ${plan ? plan.name : "none"} | ${plan ? f(plan.credits - m.total) : "over"} |`,
      );
    }
  out.push("\n# Same, push ENABLED (25% opt-in, 12 pushes/month, */15 schedule restored)\n");
  out.push("| Customers | Active | Credits/mo | Push part |");
  out.push("|---|---|---|---|");
  for (const customers of [100, 1000, 5000, 10000]) {
    const m = model({ customers, activeShare: 0.4, push: true, ...base });
    out.push(
      `| ${customers.toLocaleString("en-US")} | 40% | ${f(m.total)} | ${f(m.parts.pushCompute + m.parts.pushRequests)} |`,
    );
  }
  out.push("\n# Journal traffic sensitivity (1,000 customers, 40% active)\n");
  out.push("| Visits/mo | Credits/mo | Plan |");
  out.push("|---|---|---|");
  for (const journalVisits of [0, 5000, 10000, 25000, 50000, 100000, 200000]) {
    const m = model({ customers: 1000, activeShare: 0.4, journalVisits, deploys: base.deploys });
    out.push(
      `| ${journalVisits.toLocaleString("en-US")} | ${f(m.total)} | ${smallestPlan(m.total)} |`,
    );
  }
  out.push("\n# Deploy sensitivity (100 customers, 20% active, 10,000 visits)\n");
  out.push("| Prod deploys/mo | Credits/mo |");
  out.push("|---|---|");
  for (const d of [4, 12, 20, 30])
    out.push(
      `| ${d} | ${f(model({ customers: 100, activeShare: 0.2, journalVisits: 10_000, deploys: d }).total)} |`,
    );
  out.push("\n# Free plan (300 credits) is exhausted at\n");
  for (const [visits, deploys] of [
    [10_000, 12],
    [5_000, 8],
    [0, 8],
  ])
    for (const activeShare of [0.2, 0.4, 0.6])
      out.push(
        `- journal ${visits.toLocaleString("en-US")} visits, ${deploys} deploys, ${activeShare * 100}% active: ${breakEven({ planCredits: 300, activeShare, journalVisits: visits, deploys }).toLocaleString("en-US")} customers`,
      );
  const g = gumroadNet();
  out.push(
    `\n# Gumroad net on $${GUMROAD.price}: direct $${g.direct.toFixed(2)}, discover $${g.discover.toFixed(2)}`,
  );
  return out.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes("--json"))
    console.log(JSON.stringify({ RATES, PLANS, GUMROAD, ASSUME }, null, 2));
  else console.log(report());
}
