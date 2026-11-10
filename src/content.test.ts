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

test("upgrade paths shipped: 1 of 8 at v0.2.0, The Drumbeat (each spoke's Phase-4 PR moves this count)", () => {
  assert.equal(STANDALONE.length, 8);
  assert.deepEqual(shippedUpgradePaths(STANDALONE), ["the-drumbeat"]);
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

test("package version is 0.2.0", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string };
  assert.equal(pkg.version, "0.2.0");
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
