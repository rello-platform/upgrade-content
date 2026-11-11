import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { APP_SLUGS } from "@rello-platform/slugs";
import {
  APP_PUBLIC_HOSTS,
  GROWTH_PRODUCTS,
  PEER_STORIES,
  RELLO_APP_SLUG,
  RELLO_SITE_HOST,
  UPGRADE_CONTENT,
  assertPeerStory,
  refusedCopy,
  shippedUpgradePaths,
  type SourcedText,
  type StandaloneProductSlug,
  type UpgradeContentEntry,
} from "./index.js";

const STANDALONE = (Object.keys(GROWTH_PRODUCTS) as Array<keyof typeof GROWTH_PRODUCTS>).filter(
  (slug) => GROWTH_PRODUCTS[slug].kind === "standalone",
) as StandaloneProductSlug[];

function sourcedTexts(): Array<{ where: string; value: SourcedText }> {
  const out: Array<{ where: string; value: SourcedText }> = [];
  for (const [slug, raw] of Object.entries(UPGRADE_CONTENT)) {
    const entry = raw as UpgradeContentEntry;
    if (entry.displayName) out.push({ where: `${slug}.displayName`, value: entry.displayName });
    if (entry.tagline) out.push({ where: `${slug}.tagline`, value: entry.tagline });
    if (entry.explainer.title) out.push({ where: `${slug}.explainer.title`, value: entry.explainer.title });
    entry.explainer.points.forEach((p, i) => {
      if (p) out.push({ where: `${slug}.explainer.points[${i}]`, value: p });
    });
  }
  return out;
}

// ── Product map (moved from Rello products.ts) ───────────────────────────────

test("product map: one entry per APP_SLUGS value, none extra", () => {
  assert.deepEqual(Object.keys(GROWTH_PRODUCTS).sort(), [...APP_SLUGS].sort());
});

test("product map locks: eight standalone apps, one bundle named rello, Oven and Home Scout are Rello features", () => {
  assert.deepEqual([...STANDALONE].sort(), [
    "harvest-home", "home-ready", "home-stretch", "market-intel",
    "newsletter-studio", "open-house-hub", "pathfinder-pro", "the-drumbeat",
  ]);
  assert.equal(RELLO_APP_SLUG, "rello");
  assert.equal(GROWTH_PRODUCTS["the-oven"].kind, "rello-feature");
  assert.equal(GROWTH_PRODUCTS["home-scout"].kind, "rello-feature");
  assert.deepEqual([...GROWTH_PRODUCTS["home-ready"].includes], ["home-stretch"]);
  assert.deepEqual([...GROWTH_PRODUCTS["home-stretch"].includes], []);
});

// ── Hosts ────────────────────────────────────────────────────────────────────

test("hosts: exactly the eight standalone apps + rello, bare hostnames", () => {
  assert.deepEqual(Object.keys(APP_PUBLIC_HOSTS).sort(), [...STANDALONE, "rello"].sort());
  for (const [slug, host] of Object.entries(APP_PUBLIC_HOSTS)) {
    assert.match(host, /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, `${slug}: "${host}" is not a bare hostname`);
  }
  assert.equal(APP_PUBLIC_HOSTS.rello, "hellorello.app");
});

test("the public Rello site's host is null until Kelly answers RELLO FRONT DOOR Q1", () => {
  assert.equal(RELLO_SITE_HOST, null);
});

// ── Content ──────────────────────────────────────────────────────────────────

test("content: one entry per product-map key", () => {
  assert.deepEqual(Object.keys(UPGRADE_CONTENT).sort(), Object.keys(GROWTH_PRODUCTS).sort());
});

test("every string carries a source of the form '<Repo> <path>:<line> @ <sha>'", () => {
  const texts = sourcedTexts();
  assert.ok(texts.length > 0);
  for (const { where, value } of texts) {
    assert.ok(value.text.trim().length > 0, `${where}: empty text (use null instead)`);
    assert.match(value.source, /^[A-Za-z][\w.-]* \S+:\d+(-\d+)? @ [0-9a-f]{7,40}$/, `${where}: bad source "${value.source}"`);
  }
});

test("no quoted text holds an HTML entity (text is what renders, not source markup; GD-47)", () => {
  const withEntity = sourcedTexts()
    .filter(({ value }) => /&(?:[a-z][a-z0-9]*|#\d+|#x[0-9a-f]+);/i.test(value.text))
    .map(({ where }) => where);
  assert.deepEqual(withEntity, []);
});

test("copy rules: no string in the package breaks one (no price, no AI, no NMLS/ClearPath, no rate claim)", () => {
  const broken = sourcedTexts()
    .map(({ where, value }) => ({ where, rules: refusedCopy(value.text) }))
    .filter((r) => r.rules.length > 0);
  assert.deepEqual(broken, []);
});

test("copy rules catch each planted string (and pass clean copy)", () => {
  const planted: Array<[string, string]> = [
    ["Only $49/mo", "currency figure"],
    ["Just 49 per month", "monthly price"],
    ["Plans from 29 a month", "monthly price"],
    ["Billed per month, starting at 30", "per month with a number"],
    ["Your AI homebuying guide", "AI"],
    ["Powered by artificial intelligence", "AI"],
    ["NMLS #3146", "NMLS"],
    ["From ClearPath Utah Mortgage", "ClearPath"],
    ["Today's mortgage rates in one place", "mortgage-rate claim"],
    ["Rates from 5.99%", "mortgage-rate claim"],
  ];
  for (const [text, rule] of planted) {
    assert.ok(refusedCopy(text).includes(rule), `"${text}" should break "${rule}", got ${JSON.stringify(refusedCopy(text))}`);
  }
  for (const clean of ["Run better open houses", "Milo, your smart assistant", "a 0-100 score", "delivered by 7:45 AM", "Said hi to Aiden"]) {
    assert.deepEqual(refusedCopy(clean), [], `"${clean}" should be clean`);
  }
});

test("rello-feature and unlisted products never carry an upgrade path", () => {
  for (const slug of Object.keys(GROWTH_PRODUCTS) as Array<keyof typeof GROWTH_PRODUCTS>) {
    if (GROWTH_PRODUCTS[slug].kind === "standalone") continue;
    assert.equal((UPGRADE_CONTENT[slug] as UpgradeContentEntry).upgradePath, null, `${slug}`);
  }
});

test("upgrade paths shipped: 4 of 8 at v0.5.0, Harvest Home, Newsletter Studio, Pathfinder Pro and The Drumbeat (each spoke's Phase-4 PR moves this count)", () => {
  assert.equal(STANDALONE.length, 8);
  assert.deepEqual([...shippedUpgradePaths(STANDALONE)].sort(), ["harvest-home", "newsletter-studio", "pathfinder-pro", "the-drumbeat"]);
});

test("every upgradePath that is set is a root-relative path with no host, query or trailing slash", () => {
  for (const [slug, raw] of Object.entries(UPGRADE_CONTENT)) {
    const path = (raw as UpgradeContentEntry).upgradePath;
    if (path === null) continue;
    assert.match(path, /^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/, `${slug}: "${path}"`);
  }
});

// ── The Drumbeat (RELLO UPSELL Drumbeat slice 1, Platform KA 825) ────────────
// Each point is JSX text in The-Drumbeat at 3f89afc, so it renders exactly as quoted
// (JSX trims the line breaks and indentation around it; no entity in any of them).

test("the-drumbeat: upgradePath is /upgrade, the page Drumbeat's slice-1 PR ships", () => {
  assert.equal(UPGRADE_CONTENT["the-drumbeat"].upgradePath, "/upgrade");
});

test("the-drumbeat: explainer is exactly two shipped page subtitles (video, calendar), each sourced to The-Drumbeat @ 3f89afc", () => {
  const explainer = UPGRADE_CONTENT["the-drumbeat"].explainer as UpgradeContentEntry["explainer"];
  assert.equal(explainer.title, null);
  assert.deepEqual(explainer.points, [
    { text: "Record and publish video content for social media.", source: "The-Drumbeat src/app/(dashboard)/content/video/page.tsx:55 @ 3f89afc" },
    { text: "Plan and schedule content across all channels.", source: "The-Drumbeat src/app/(dashboard)/content/calendar/page.tsx:199 @ 3f89afc" },
  ]);
});

test("the-drumbeat: no explainer point promises direct mail until Drumbeat ships a job flow (PLATFORM AUDIT 82 GD-331)", () => {
  const points = (UPGRADE_CONTENT["the-drumbeat"].explainer as UpgradeContentEntry["explainer"]).points;
  assert.equal(points.length, 2);
  for (const p of points) assert.doesNotMatch(p?.text ?? "", /direct mail|\bLob\b/i);
});

test("the-drumbeat: displayName and tagline are unchanged from v0.1.0", () => {
  assert.deepEqual(UPGRADE_CONTENT["the-drumbeat"].displayName, { text: "The Drumbeat", source: "Rello src/lib/spoke-branding.ts:58 @ 8114c16d7" });
  assert.deepEqual(UPGRADE_CONTENT["the-drumbeat"].tagline, {
    text: "Marketing automation platform for mortgage and real estate professionals",
    source: "The-Drumbeat src/app/layout.tsx:49 @ 0221ccb",
  });
});

// ── Harvest Home (RELLO UPSELL Phase 4, Platform KA 871) ─────────────────────

test("harvest-home: upgradePath is /upgrade, the page Harvest Home's Phase-4 chrome PR ships at src/app/(app)/upgrade/page.tsx", () => {
  assert.equal(UPGRADE_CONTENT["harvest-home"].upgradePath, "/upgrade");
});

test("harvest-home: displayName, tagline and explainer are unchanged from v0.2.0 (no new points)", () => {
  const entry = UPGRADE_CONTENT["harvest-home"] as UpgradeContentEntry;
  assert.deepEqual(entry.displayName, { text: "Harvest Home", source: "Rello src/lib/spoke-branding.ts:74 @ 8114c16d7" });
  assert.deepEqual(entry.tagline, { text: "Turn signals into qualified leads", source: "Rello src/lib/spoke-branding.ts:79 @ 8114c16d7" });
  assert.equal(entry.explainer.title, null);
  assert.deepEqual(entry.explainer.points, [
    { text: "Lead intelligence platform — discover, score, and enrich real estate leads", source: "Harvest-Home src/app/layout.tsx:50 @ a198a63" },
  ]);
});

// ── Pathfinder Pro (RELLO UPSELL Phase 4, Platform KA 893/894) ──────────────

test("pathfinder-pro: upgradePath is /dashboard/upgrade, the page PFP's Phase-4 chrome PR ships at src/app/(dashboard)/dashboard/upgrade/page.tsx", () => {
  // /dashboard, not /upgrade: PFP's MLO app lives under /dashboard on pathfinder-pro.app (its middleware 404s /dashboard on
  // agent subdomains, and the borrower-facing routes are outside it).
  assert.equal(UPGRADE_CONTENT["pathfinder-pro"].upgradePath, "/dashboard/upgrade");
});

test("pathfinder-pro: the one explainer point is rendered screen text (the cockpit page subtitle), not the HTML metadata description", () => {
  const entry = UPGRADE_CONTENT["pathfinder-pro"] as UpgradeContentEntry;
  assert.deepEqual(entry.explainer.points, [
    { text: "MLO Phone Call Workstation", source: "PathfinderPro src/app/(dashboard)/dashboard/scenarios/page.tsx:322 @ 23b902a6" },
  ]);
});

test("pathfinder-pro: no point claims a time ('in under 5 minutes' is shown on no PFP screen, KA 894 R6)", () => {
  const entry = UPGRADE_CONTENT["pathfinder-pro"] as UpgradeContentEntry;
  for (const p of entry.explainer.points) {
    assert.doesNotMatch(p?.text ?? "", /minute|second|hour/i);
  }
});

test("pathfinder-pro: displayName and tagline are unchanged from v0.3.0 (tagline stays null: the shipped one says AI)", () => {
  const entry = UPGRADE_CONTENT["pathfinder-pro"] as UpgradeContentEntry;
  assert.deepEqual(entry.displayName, { text: "Pathfinder Pro", source: "Rello src/lib/spoke-branding.ts:82 @ 8114c16d7" });
  assert.equal(entry.tagline, null);
  assert.equal(entry.explainer.title, null);
});

test("package version is 0.5.0", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string };
  assert.equal(pkg.version, "0.5.0");
});

// ── Stories ──────────────────────────────────────────────────────────────────

test("PEER_STORIES is empty in v0.1.0", () => {
  assert.equal(PEER_STORIES.length, 0);
});

test("every published story carries a consent record", () => {
  for (const story of PEER_STORIES) assertPeerStory(story);
});

test("assertPeerStory refuses a story with no, blank or unparseable consent", () => {
  const ok = { headline: "h", body: "b", consentRecordedAt: "2026-11-09T00:00:00Z", customerTenantId: "tenant_x" };
  assert.doesNotThrow(() => assertPeerStory(ok));
  const { consentRecordedAt: _drop, ...noConsent } = ok;
  void _drop;
  assert.throws(() => assertPeerStory(noConsent), /consentRecordedAt is required/);
  assert.throws(() => assertPeerStory({ ...ok, consentRecordedAt: " " }), /consentRecordedAt is required/);
  assert.throws(() => assertPeerStory({ ...ok, consentRecordedAt: "yesterday" }), /consentRecordedAt is required/);
  assert.throws(() => assertPeerStory({ ...ok, customerTenantId: "" }), /customerTenantId is required/);
});

// ── Newsletter Studio (RELLO UPSELL Phase 4, Platform KA 922/924) ───────────
// Each point is JSX text under an in-app <h1> in Newsletter-Studio at 26c5c8ff, quoted
// verbatim (JSX trims the line breaks and indentation around it; no entity in any of them).
// v0.1.0 quoted the public landing page (src/app/page.tsx:229/235/241 @ def9ae5), whose
// claims trace to no app screen: default flows "New Leads, Active Buyers, Past Clients"
// exist only as an input placeholder, and "know which leads are hot" is Rello's data.

test("newsletter-studio: upgradePath is /dashboard/upgrade, the page NS's Phase-4 chrome PR ships at src/app/dashboard/upgrade/page.tsx", () => {
  // /dashboard, not /upgrade: NS's authenticated app is src/app/dashboard/** (its middleware sends an
  // unauthenticated /dashboard to sign-in); every lead-facing page (/unsubscribe, /preferences, /reopt-in) is outside it.
  assert.equal(UPGRADE_CONTENT["newsletter-studio"].upgradePath, "/dashboard/upgrade");
});

test("newsletter-studio: the explainer is exactly three in-app page subtitles (flows, analytics, spotlights), each sourced to Newsletter-Studio @ 26c5c8ff", () => {
  const explainer = UPGRADE_CONTENT["newsletter-studio"].explainer as UpgradeContentEntry["explainer"];
  assert.equal(explainer.title, null);
  assert.deepEqual(explainer.points, [
    { text: "Organize contacts into flows for targeted newsletters.", source: "Newsletter-Studio src/app/dashboard/flows/page.tsx:160 @ 26c5c8ff" },
    {
      text: "See how your newsletters are performing. The charts show opens, clicks, and bounces over time.",
      source: "Newsletter-Studio src/app/dashboard/analytics/page.tsx:223 @ 26c5c8ff",
    },
    {
      text: "Announcements, partner spotlights, and sponsored content that appear in your newsletters.",
      source: "Newsletter-Studio src/app/dashboard/announcements/page.tsx:262 @ 26c5c8ff",
    },
  ]);
});

test("newsletter-studio: no point quotes the public landing page or promises what no NS screen does (GD-331 class)", () => {
  const points = (UPGRADE_CONTENT["newsletter-studio"].explainer as UpgradeContentEntry["explainer"]).points;
  for (const p of points) {
    assert.doesNotMatch(p?.source ?? "", /src\/app\/page\.tsx/);
    assert.doesNotMatch(p?.text ?? "", /Active Buyers|Past Clients|hot and ready|market conditions|SMS|text message|postcard|direct mail/i);
  }
});

test("newsletter-studio: displayName and tagline are unchanged from v0.1.0", () => {
  assert.deepEqual(UPGRADE_CONTENT["newsletter-studio"].displayName, { text: "Newsletter Studio", source: "Rello src/lib/spoke-branding.ts:90 @ 8114c16d7" });
  assert.deepEqual(UPGRADE_CONTENT["newsletter-studio"].tagline, { text: "Nurture your sphere on autopilot", source: "Rello src/lib/spoke-branding.ts:95 @ 8114c16d7" });
});
