import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  KELLY_D60,
  PFP_FEATURES,
  PFP_HOME_COPY,
  PFP_LOCKED_FEATURE_SLUGS,
  PFP_LOCK_COPY,
  PFP_SETUP_COPY,
  PFP_SETUP_STEP_IDS,
  UPGRADE_CONTENT,
  refusedCopy,
  sourceForm,
  type SourcedText,
  type UpgradeContentEntry,
} from "./index.js";
import { D60_FEATURE_HOLES, deriveD60Text, type D60Kind } from "./pfp-d60-derive.js";

/**
 * X2 (PFP GATEWAY; MAP-LAND-EXPAND-261119 §1.3/§1.4, A1/A2; Platform KA 1415): PathfinderPro's lock words.
 * Kelly-sourced words must be BYTE-EQUAL to the approved D60 mockup. Always checked against the frozen copy
 * (test-fixtures/pfp-d60-approved.json); also checked against the mockup itself when its file is readable at the pinned
 * hash (Kelly's Mac, iCloud), and skipped cleanly where it is not (CI, another machine).
 */

interface Frozen {
  mockup: string;
  sha256: string;
  strings: Array<{ key: string; kind: D60Kind; mockup: string; text: string }>;
}
const FROZEN = JSON.parse(readFileSync(new URL("../test-fixtures/pfp-d60-approved.json", import.meta.url), "utf8")) as Frozen;
const PINNED_SHA256 = "31a8b00489d56ae65744f6741df0026b62893bbc2fd9f3dae7a3a163e34e9529";
const MOCKUP_PATH =
  process.env.PFP_D60_MOCKUP ??
  join(
    homedir(),
    "Library/Mobile Documents/com~apple~CloudDocs/ClearPath Utah Mortgage/Applications/~Application Docs/RELLO TO BE BUILT",
    "BUILD-|-WORKSTREAM/PFP-GATEWAY/mockup/land-expand/pfp-land-expand-261119.html",
  );

/** Every PFP string in the package, by the key the frozen copy uses. */
function pfpTexts(): Array<{ key: string; value: SourcedText }> {
  const out: Array<{ key: string; value: SourcedText }> = [];
  for (const slug of PFP_LOCKED_FEATURE_SLUGS) {
    const f = PFP_FEATURES[slug];
    out.push({ key: `PFP_FEATURES.${slug}.name`, value: f.name });
    if (f.value) out.push({ key: `PFP_FEATURES.${slug}.value`, value: f.value });
  }
  const walk = (prefix: string, node: unknown) => {
    if (node === null) return; // null means omit: no string here
    const o = node as Record<string, unknown>;
    if (typeof o.text === "string" && typeof o.source === "string") out.push({ key: prefix, value: o as unknown as SourcedText });
    else for (const [k, v] of Object.entries(o)) walk(`${prefix}.${k}`, v);
  };
  walk("PFP_LOCK_COPY", PFP_LOCK_COPY);
  walk("PFP_SETUP_COPY", PFP_SETUP_COPY);
  walk("PFP_HOME_COPY", PFP_HOME_COPY);
  return out;
}

test("PFP features: exactly the map's 14 locked slugs (§1.3), each with a name and a value; learnMore null for every slug (A2)", () => {
  assert.deepEqual(Object.keys(PFP_FEATURES).sort(), [...PFP_LOCKED_FEATURE_SLUGS].sort());
  assert.equal(PFP_LOCKED_FEATURE_SLUGS.length, 14);
  for (const slug of PFP_LOCKED_FEATURE_SLUGS) {
    assert.ok(PFP_FEATURES[slug].name.text.length > 0, slug);
    assert.ok(PFP_FEATURES[slug].value, `${slug}: value`);
    assert.equal(PFP_FEATURES[slug].learnMore, null, `${slug}: no /features page is live yet`);
  }
});

test("every PFP string has exactly one source, shipped or kelly; every kelly source is D60's", () => {
  const texts = pfpTexts();
  assert.equal(texts.length, 79); // 14 names + 14 values + 18 lock-UI (v0.13.0 adds 1) + 19 Get set up (v0.11.0) + 14 Home (v0.12.0)
  for (const { key, value } of texts) {
    assert.ok(value.text.trim().length > 0, `${key}: empty`);
    const form = sourceForm(value.source);
    assert.ok(form !== null, `${key}: no valid source ("${value.source}")`);
    if (form === "kelly") assert.equal(value.source, KELLY_D60, key);
    else assert.match(value.source, /^PathfinderPro /, `${key}: a shipped PFP string is sourced to PathfinderPro`);
  }
  // Which strings are shipped: the ten names MAP §1.4 lists. Everything else is Kelly's.
  const shipped = texts.filter(({ value }) => sourceForm(value.source) === "shipped").map(({ key }) => key);
  assert.deepEqual(shipped.sort(), [
    "bank-statement-advisor", "call-workstation", "dscr-advisor", "events", "exports", "hecm-advisor", "loan-programs",
    "pre-approval-letter", "quick-quote", "va-advisor",
  ].map((s) => `PFP_FEATURES.${s}.name`).sort());
});

test("a string with neither source fails (the package's rule, planted)", () => {
  for (const bad of [
    "",
    "Kelly said so",
    "kelly: D60",
    "kelly: D60 · pfp-land-expand-261119.html",
    "kelly: D60 · pfp-land-expand-261119.html · sha256 31a8b004",
    "kelly: D60 · pfp-land-expand-261119.html · sha256 31A8B00489D56AE6",
    "PathfinderPro src/x.tsx @ 23cb4758",
    "PathfinderPro src/x.tsx:12",
  ]) {
    assert.equal(sourceForm(bad), null, `"${bad}" must not pass as a source`);
  }
  assert.equal(sourceForm("PathfinderPro src/x.tsx:12 @ 23cb4758"), "shipped");
  assert.equal(sourceForm(KELLY_D60), "kelly");
  // The whole package: every string, old and new, has a valid form.
  const all: SourcedText[] = pfpTexts().map((t) => t.value);
  for (const raw of Object.values(UPGRADE_CONTENT)) {
    const e = raw as UpgradeContentEntry;
    for (const v of [e.displayName, e.tagline, e.explainer.title, ...e.explainer.points]) if (v) all.push(v);
  }
  assert.deepEqual(all.filter((v) => sourceForm(v.source) === null), []);
});

test("byte-equal to the frozen copy of the approved strings: every kelly string, no more and no fewer", () => {
  assert.equal(FROZEN.sha256, PINNED_SHA256);
  // The source every Kelly string carries names exactly the frozen artefact: its path and the first 16 hex of its hash.
  assert.equal(KELLY_D60, `kelly: D60 · ${FROZEN.mockup.replace(/^RELLO TO BE BUILT\//, "")} · sha256 ${FROZEN.sha256.slice(0, 16)}`);
  const kelly = pfpTexts().filter(({ value }) => sourceForm(value.source) === "kelly");
  assert.deepEqual(kelly.map((k) => k.key).sort(), FROZEN.strings.map((s) => s.key).sort());
  const byKey = new Map(FROZEN.strings.map((s) => [s.key, s]));
  for (const { key, value } of kelly) {
    const f = byKey.get(key)!;
    assert.equal(value.text, f.text, `${key}: differs from the approved words`);
    // The frozen text is what the mockup's own snippet renders as (no hand-typed copy in the fixture).
    assert.equal(deriveD60Text(f.kind, f.mockup), f.text, `${key}: frozen text does not follow from its mockup snippet`);
  }
});

test("byte-equal to the approved mockup itself, read at the pinned hash (skipped when the file is not readable here)", (t) => {
  let raw: Buffer;
  try {
    raw = readFileSync(MOCKUP_PATH);
  } catch {
    t.skip(`mockup not readable here (${MOCKUP_PATH}); the frozen copy above is still checked`);
    return;
  }
  const sha = createHash("sha256").update(raw).digest("hex");
  if (sha !== PINNED_SHA256) {
    t.skip(`mockup on disk is not the approved version (sha256 ${sha}); the frozen copy above is still checked`);
    return;
  }
  const src = raw.toString("utf8");
  for (const f of FROZEN.strings) assert.ok(src.includes(f.mockup), `${f.key}: snippet not in the approved mockup: ${f.mockup}`);
  // The banner frame is composed exactly as the templates say: `<name> <part>.`
  assert.ok(src.includes("${esc(nm)} ${esc(c.part)}."));
  // Shipped names print as the mockup's banner prints them ("The " dropped) — except the call workstation (see pfp.ts).
  for (const slug of PFP_LOCKED_FEATURE_SLUGS) {
    const m = new RegExp(`"${slug}":\\s*\\{[^}]*?long:"([^"]*)"`, "s").exec(src);
    assert.ok(m, slug);
    const bannerName = m[1].replace(/^The /, "");
    if (slug === "call-workstation") assert.notEqual(PFP_FEATURES[slug].name.text, bannerName);
    else assert.equal(PFP_FEATURES[slug].name.text, bannerName, slug);
  }
});

test("templates hold only {feature}, and filling it leaves no brace", () => {
  for (const { key, value } of pfpTexts()) {
    const holes = value.text.match(/\{[^}]*\}/g) ?? [];
    for (const h of holes) assert.equal(h, "{feature}", key);
    const filled = value.text.replaceAll("{feature}", PFP_FEATURES["rate-widget"].name.text);
    assert.doesNotMatch(filled, /[{}]/, key);
  }
  assert.equal(PFP_LOCK_COPY.banner.full.text.replace("{feature}", PFP_FEATURES.events.name.text), "Events is part of Full PathfinderPro.");
});

test("copy rules: no PFP string breaks one; no price anywhere", () => {
  const broken = pfpTexts()
    .map(({ key, value }) => ({ key, rules: refusedCopy(value.text) }))
    .filter((r) => r.rules.length > 0);
  assert.deepEqual(broken, []);
  const json = JSON.stringify({ PFP_FEATURES, PFP_LOCK_COPY, PFP_SETUP_COPY, PFP_HOME_COPY });
  assert.doesNotMatch(json, /\$\s?\d|\bprice\b"?\s*:|\bamount\b"?\s*:/i);
});

/**
 * X2b (PFP GATEWAY; ruling K-812; MAP-LAND-EXPAND §5 LE-4b, A5): the Get set up card's words. They are Kelly strings, so
 * the tests above already hold them byte-equal to the frozen copy and (when readable) to the mockup, one source each, no
 * figures. These add the shape: keyed by PathfinderPro's step ids, no billing, labels only for the two new steps, and
 * the identity lines null for the reason the README gives.
 */
test("Get set up: keyed by exactly PathfinderPro's eight step ids (setup-progress.ts @ 4102cabd), no billing", () => {
  assert.deepEqual([...PFP_SETUP_STEP_IDS], [
    "lenders", "comp", "identity", "compliance", "check-your-rate", "test-quote", "rate-widget", "email-signature",
  ]);
  assert.deepEqual(Object.keys(PFP_SETUP_COPY.steps), [...PFP_SETUP_STEP_IDS]);
  assert.doesNotMatch(JSON.stringify(PFP_SETUP_COPY), /billing|payment/i);
});

test("Get set up: a label only for the two steps PathfinderPro has no title for; every other line sourced or null", () => {
  const labelled = PFP_SETUP_STEP_IDS.filter((id) => "label" in PFP_SETUP_COPY.steps[id]);
  assert.deepEqual(labelled, ["test-quote", "email-signature"]);
  for (const id of PFP_SETUP_STEP_IDS) {
    const s = PFP_SETUP_COPY.steps[id];
    for (const v of [s.where, s.rule]) if (v !== null) assert.equal(v.source, KELLY_D60, id);
    if (s.rule) assert.match(s.rule.text, /^Checks off when /, id);
  }
  // identity's mockup lines name NMLS (copy rule 4), so they are null: the card renders nothing there.
  assert.equal(PFP_SETUP_COPY.steps.identity.where, null);
  assert.equal(PFP_SETUP_COPY.steps.identity.rule, null);
  assert.ok(refusedCopy("your NMLS").includes("NMLS"), "the rule that nulls them exists");
});

test("Get set up: no count is templated (templates hold only {feature}); the footer reads in the mockup's order", () => {
  for (const { key, value } of pfpTexts().filter((t) => t.key.startsWith("PFP_SETUP_COPY."))) {
    assert.doesNotMatch(value.text, /[{}$]|\d/, `${key}: no hole, no figure`);
  }
  assert.deepEqual(Object.keys(PFP_SETUP_COPY.footer), ["goTo", "neverTicked"]);
});

test("Get set up: the identity lines the package leaves null are the mockup's NMLS lines (skipped when the file is not readable here)", (t) => {
  let raw: Buffer;
  try {
    raw = readFileSync(MOCKUP_PATH);
  } catch {
    t.skip(`mockup not readable here (${MOCKUP_PATH})`);
    return;
  }
  if (createHash("sha256").update(raw).digest("hex") !== PINNED_SHA256) {
    t.skip("mockup on disk is not the approved version");
    return;
  }
  const src = raw.toString("utf8");
  const block = src.slice(src.indexOf("identity:  {title:"), src.indexOf("compliance:{title:"));
  const where = /where:"([^"]*)"/.exec(block)![1];
  const rule = /rule:"([^"]*)"/.exec(block)![1];
  assert.ok(refusedCopy(where).includes("NMLS"), where);
  assert.ok(refusedCopy(rule).includes("NMLS"), rule);
  // Every frozen Get set up snippet occurs exactly once in the approved file (no ambiguous source).
  for (const f of FROZEN.strings.filter((s) => s.key.startsWith("PFP_SETUP_COPY."))) {
    assert.equal(src.split(f.mockup).length - 1, 1, `${f.key}: snippet must occur exactly once`);
  }
});

/**
 * X2c (PFP GATEWAY; ruling K-822; MAP §2): the gateway Home's words. As Kelly strings, the tests above already hold them
 * byte-equal to the frozen copy and the mockup, one source each, no figures. These add: no hole and no digit anywhere
 * in the Home copy, and the words the KA ruled out (a count, a time, a second hole) are absent.
 */
test("Home: no hole, no figure; every string is Kelly's D60", () => {
  const home = pfpTexts().filter((t) => t.key.startsWith("PFP_HOME_COPY."));
  assert.equal(home.length, 14);
  for (const { key, value } of home) {
    assert.equal(value.source, KELLY_D60, key);
    assert.doesNotMatch(value.text, /[{}$]|\d/, `${key}: no hole, no figure`);
  }
});

test("Home: the words with a count, a time or a second hole are NOT in the package (listed for the KA)", () => {
  const all = pfpTexts().map((t) => t.value.text).join("\n");
  for (const out of ["leads this week", "sheet in", "Next:", "shown", "Live on your website", "Not on your website yet", "Pricing your Check Your Rate page", "Sample data", "Search name"]) {
    assert.ok(!all.includes(out), `"${out}" must not be in the package`);
  }
});

test("Home: every frozen Home snippet occurs exactly once in the approved mockup (skipped when the mockup isn't readable)", (t) => {
  let raw: Buffer;
  try {
    raw = readFileSync(MOCKUP_PATH);
  } catch {
    t.skip("mockup not readable here");
    return;
  }
  if (createHash("sha256").update(raw).digest("hex") !== PINNED_SHA256) {
    t.skip("mockup on disk is not the approved version");
    return;
  }
  const src = raw.toString("utf8");
  for (const f of FROZEN.strings.filter((s) => s.key.startsWith("PFP_HOME_COPY."))) {
    assert.equal(src.split(f.mockup).length - 1, 1, `${f.key}: snippet must occur exactly once`);
  }
});

/**
 * X2d (PFP GATEWAY; rulings K-824, K-834; prompt 608): the locked-item screen-reader text, word for word from the D60
 * mockup's :832 line, as a template over the package's own feature name. The derive rule is widened by ONE exact hole
 * (`D60_FEATURE_HOLES[2]`); these tests hold that it is the only widening and that near forms still fail.
 */
const SR_832 = ', locked: opens a preview of ${esc(F[slug].long.replace(/^The /,""))}';

test("X2d: the :832 sr text is a {feature} template, frozen from the mockup's own snippet", () => {
  assert.equal(PFP_LOCK_COPY.menu.lockedOpensPreview.text, ", locked: opens a preview of {feature}");
  assert.equal(PFP_LOCK_COPY.menu.lockedOpensPreview.source, KELLY_D60);
  assert.equal(deriveD60Text("template", SR_832), PFP_LOCK_COPY.menu.lockedOpensPreview.text);
  const frozen = FROZEN.strings.find((f) => f.key === "PFP_LOCK_COPY.menu.lockedOpensPreview");
  assert.deepEqual(frozen, { key: "PFP_LOCK_COPY.menu.lockedOpensPreview", kind: "template", mockup: SR_832, text: PFP_LOCK_COPY.menu.lockedOpensPreview.text });
  assert.equal(
    PFP_LOCK_COPY.menu.lockedOpensPreview.text.replace("{feature}", PFP_FEATURES["refi-radar"].name.text),
    ", locked: opens a preview of Refi Radar",
  );
});

test("X2d: the derive rule turns exactly three exact holes into {feature}, and only them", () => {
  assert.deepEqual([...D60_FEATURE_HOLES], ["${esc(nm)}", "${esc(F[slug].long)}", '${esc(F[slug].long.replace(/^The /,""))}']);
  for (const hole of D60_FEATURE_HOLES) assert.equal(deriveD60Text("template", `a ${hole} b`), "a {feature} b", hole);
  // Near forms are code, not words: each stays in the derived text with its `${`, so it can never equal a frozen string.
  const near = [
    "${esc(label)}",
    "${esc(F[slug].short)}",
    "${F[slug].long.replace(/^The /,\"\")}",
    '${esc(F[slug].long.replace(/^A /,""))}',
    '${esc(F[slug].long.replace(/^The /,"x"))}',
    '${esc(F[other].long.replace(/^The /,""))}',
    '${esc(F[slug].long.replace(/^The /,"").toUpperCase())}',
    '${esc(F[slug].long.replace(/^The /,""))} ${esc(label)}',
    "${esc(F[slug].long.replace(/^The /,''))}",
    "${esc( nm )}",
  ];
  for (const form of near) {
    const out = deriveD60Text("template", `, locked: opens a preview of ${form}`);
    assert.match(out, /\$\{/, `${form} must not derive to words`);
    assert.ok(!FROZEN.strings.some((f) => f.text === out), form);
  }
  // A {feature} template never holds more than one hole.
  for (const { key, value } of pfpTexts()) assert.ok((value.text.match(/\{feature\}/g) ?? []).length <= 1, key);
});

test("X2d: the :832 snippet occurs once in the approved mockup, and its hole is the package name (skipped when the mockup isn't readable)", (t) => {
  let raw: Buffer;
  try {
    raw = readFileSync(MOCKUP_PATH);
  } catch {
    t.skip("mockup not readable here");
    return;
  }
  if (createHash("sha256").update(raw).digest("hex") !== PINNED_SHA256) {
    t.skip("mockup on disk is not the approved version");
    return;
  }
  const src = raw.toString("utf8");
  assert.equal(src.split(SR_832).length - 1, 1);
  // The widened hole is used nowhere else in the mockup's copy (so it widens only this string).
  const hole = D60_FEATURE_HOLES[2];
  assert.equal(src.split(hole).length - 1, 1);
  // F[slug].long with "The " dropped is the package's name for every slug but the call workstation (see pfp.ts).
  for (const slug of PFP_LOCKED_FEATURE_SLUGS) {
    const m = new RegExp(`"${slug}":\\s*\\{[^}]*?long:"([^"]*)"`, "s").exec(src);
    assert.ok(m, slug);
    const filled = m[1].replace(/^The /, "");
    if (slug === "call-workstation") assert.notEqual(PFP_FEATURES[slug].name.text, filled);
    else assert.equal(PFP_FEATURES[slug].name.text, filled, slug);
  }
});
