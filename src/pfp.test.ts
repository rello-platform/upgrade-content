import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  KELLY_D60,
  PFP_FEATURES,
  PFP_LOCKED_FEATURE_SLUGS,
  PFP_LOCK_COPY,
  UPGRADE_CONTENT,
  refusedCopy,
  sourceForm,
  type SourcedText,
  type UpgradeContentEntry,
} from "./index.js";
import { deriveD60Text, type D60Kind } from "./pfp-d60-derive.js";

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
    const o = node as Record<string, unknown>;
    if (typeof o.text === "string" && typeof o.source === "string") out.push({ key: prefix, value: o as unknown as SourcedText });
    else for (const [k, v] of Object.entries(o)) walk(`${prefix}.${k}`, v);
  };
  walk("PFP_LOCK_COPY", PFP_LOCK_COPY);
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
  assert.equal(texts.length, 45); // 14 names + 14 values + 17 lock-UI strings
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
  const json = JSON.stringify({ PFP_FEATURES, PFP_LOCK_COPY });
  assert.doesNotMatch(json, /\$\s?\d|\bprice\b"?\s*:|\bamount\b"?\s*:/i);
});
