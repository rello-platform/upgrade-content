// Consumer test: install the PACKED package into a fresh project and load it the
// way consumers do. Run by .husky/pre-push after `npm run compile`.
//
// WHY (PLATFORM AUDIT 78 GD-46): the tsx unit tests and a tsc check of the source
// were green while the shipped dist/ could not be imported by plain Node: it
// re-exported extensionless "./products". Only a real install of the real
// artifact sees that. Hence:
//   1. `npm pack` this repo into a temp dir (exactly the files a git install gets);
//   2. install that tarball into a fresh temp project;
//   3. plain Node (`node --input-type=module -e`) imports the package by name and
//      checks every runtime export the README names;
//   4. tsc --noEmit of a one-file TypeScript consumer, once with NodeNext and once
//      with Bundler resolution;
//   5. the temp dirs are removed in `finally`.
// Any failure exits 1. Nothing here is optional and nothing is swallowed.

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PKG = "@rello-platform/upgrade-content";
const TSC = join(REPO, "node_modules", "typescript", "bin", "tsc");

// The runtime exports the README names. Types are checked by the tsc step.
const RUNTIME_EXPORTS = [
  "GROWTH_PRODUCTS", "RELLO_APP_SLUG",
  "APP_PUBLIC_HOSTS", "RELLO_SITE_HOST",
  "UPGRADE_CONTENT", "shippedUpgradePaths",
  "PEER_STORIES", "assertPeerStory",
  "COPY_RULES", "refusedCopy",
];

const RUNTIME_CHECK = `
import assert from "node:assert/strict";
import * as m from "${PKG}";
import { APP_SLUGS } from "@rello-platform/slugs";
const want = ${JSON.stringify(RUNTIME_EXPORTS)};
const missing = want.filter((n) => !(n in m));
assert.deepEqual(missing, [], "missing runtime exports: " + missing.join(", "));
const slugs = [...APP_SLUGS].sort();
assert.deepEqual(Object.keys(m.GROWTH_PRODUCTS).sort(), slugs, "GROWTH_PRODUCTS keys != APP_SLUGS");
assert.equal(m.RELLO_APP_SLUG, "rello");
assert.equal(Object.keys(m.APP_PUBLIC_HOSTS).length, 9, "APP_PUBLIC_HOSTS should have 9 entries");
assert.equal(m.APP_PUBLIC_HOSTS.rello, "hellorello.app");
assert.equal(m.RELLO_SITE_HOST, null);
assert.deepEqual(Object.keys(m.UPGRADE_CONTENT).sort(), slugs, "UPGRADE_CONTENT keys != APP_SLUGS");
assert.equal(typeof m.UPGRADE_CONTENT.rello.displayName.text, "string");
assert.ok(Array.isArray(m.PEER_STORIES));
assert.equal(m.PEER_STORIES.length, 0);
assert.equal(typeof m.assertPeerStory, "function");
assert.throws(() => m.assertPeerStory({ headline: "h", body: "b", customerTenantId: "t" }), /consentRecordedAt/);
assert.equal(typeof m.refusedCopy, "function");
assert.ok(m.refusedCopy("Only $49/mo").includes("currency figure"));
assert.deepEqual(m.refusedCopy("Run better open houses"), []);
assert.ok(Array.isArray(m.COPY_RULES) && m.COPY_RULES.length > 0);
assert.equal(typeof m.shippedUpgradePaths, "function");
assert.deepEqual(m.shippedUpgradePaths(["home-ready"]), []);
console.log("runtime: " + want.length + " of " + want.length + " exports import and check out in plain Node " + process.version);
`;

const TS_CONSUMER = `
import {
  GROWTH_PRODUCTS, RELLO_APP_SLUG, APP_PUBLIC_HOSTS, RELLO_SITE_HOST, UPGRADE_CONTENT,
  shippedUpgradePaths, PEER_STORIES, assertPeerStory, COPY_RULES, refusedCopy,
  type ProductKind, type ProductEntry, type GrowthProductSlug, type StandaloneProductSlug,
  type BundleProductSlug, type HostedProductSlug, type UpgradeContentEntry, type SourcedText,
  type ExplainerPoints, type PeerStory, type CopyRule,
} from "${PKG}";

const kind: ProductKind = GROWTH_PRODUCTS["home-ready"].kind;
const entry: ProductEntry = GROWTH_PRODUCTS.rello;
const slug: GrowthProductSlug = RELLO_APP_SLUG as GrowthProductSlug;
const standalone: StandaloneProductSlug = "home-ready";
const bundle: BundleProductSlug = "rello";
const hosted: HostedProductSlug = bundle;
const host: string = APP_PUBLIC_HOSTS[hosted];
const site: string | null = RELLO_SITE_HOST;
const content: UpgradeContentEntry = UPGRADE_CONTENT[standalone];
const name: SourcedText | null = content.displayName;
const points: ExplainerPoints = content.explainer.points;
const stories: readonly PeerStory[] = PEER_STORIES;
const rules: readonly CopyRule[] = COPY_RULES;
const refused: string[] = refusedCopy("x");
const shipped: StandaloneProductSlug[] = shippedUpgradePaths([standalone]);
const maybe: unknown = {};
assertPeerStory(maybe);
const narrowed: PeerStory = maybe;
// The types are real, not \`any\`: each of these must be a compile error.
// @ts-expect-error not a product slug
UPGRADE_CONTENT["not-an-app"];
// @ts-expect-error The Oven is a rello-feature, never a standalone app
const notStandalone: StandaloneProductSlug = "the-oven";
// @ts-expect-error no price field exists
content.price;
export { kind, entry, slug, host, site, name, points, stories, rules, refused, shipped, narrowed, notStandalone };
`;

function run(cmd, args, opts) {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });
  } catch (err) {
    // A spawn failure (ENOENT, timeout) has no status: name its code and message.
    const how = err.status ?? err.signal ?? `${err.code ?? "spawn error"}: ${err.message}`;
    const out = [err.stdout, err.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${[cmd, ...args].join(" ").slice(0, 200)}\n  exited ${how}\n${out}`);
  }
}

const root = mkdtempSync(join(tmpdir(), "upgrade-content-consumer-"));
let failed = false;
try {
  const packDir = join(root, "pack");
  const app = join(root, "app");
  run("mkdir", ["-p", packDir, app]);

  const packed = JSON.parse(run("npm", ["pack", "--json", "--pack-destination", packDir], { cwd: REPO, timeout: 120_000 }));
  const tarball = join(packDir, packed[0].filename);
  console.log(`packed: ${packed[0].filename} (${packed[0].entryCount} files)`);

  writeFileSync(join(app, "package.json"), JSON.stringify({ name: "upgrade-content-consumer", private: true, type: "module" }, null, 2));
  run("npm", ["install", "--no-audit", "--no-fund", "--no-package-lock", "--ignore-scripts", tarball], { cwd: app, timeout: 300_000 });
  console.log("installed the tarball into a fresh project");

  process.stdout.write(run(process.execPath, ["--input-type=module", "-e", RUNTIME_CHECK], { cwd: app, timeout: 60_000 }));

  writeFileSync(join(app, "consumer.ts"), TS_CONSUMER);
  for (const [label, flags] of [
    ["NodeNext", ["--module", "nodenext", "--moduleResolution", "nodenext"]],
    ["Bundler", ["--module", "esnext", "--moduleResolution", "bundler"]],
  ]) {
    run(process.execPath, [TSC, "--noEmit", "--strict", "--target", "es2022", ...flags, "consumer.ts"], { cwd: app, timeout: 120_000 });
    console.log(`types: tsc --noEmit consumer.ts OK (${label})`);
  }
  console.log("consumer test: PASS");
} catch (err) {
  failed = true;
  console.error(`consumer test: FAIL\n${err instanceof Error ? err.message : String(err)}`);
} finally {
  rmSync(root, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
