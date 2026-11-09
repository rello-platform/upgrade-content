// MOVED from Rello src/lib/growth/products.ts:1-69 @ 8114c16d7 (Platform KA prompt 741).
// Body and lock comments are word for word. Only the import list changed: the three
// helpers Rello's later lines use (isAppSlug, isEngineSlug, tryNormalizeSlug) are not
// used by this part and stay in Rello with isRelloPlanAppSlug / productOf.
import { APP_SLUGS, type AppSlug } from "@rello-platform/slugs";

// ─────────────────────────────────────────────────────────────────────────────
// RELLO GROWTH MARKETING, slice 2 — the product map (locked).
//
// Source: RELLO-GROWTH-MARKETING/_SPEC-FEATURE.md "Product map (locked)";
// ANSWERS A2 + A3; RELLO UPSELL ANSWERS Q-CS-0 (roster) + Q-CS-1 (the bundle is
// "Rello", never named after one app).
//
// Keyed by every `APP_SLUGS` value from @rello-platform/slugs. The `satisfies`
// below makes a new slug in the package a compile error here, so the map can
// never silently miss an app the platform knows about.
//
// Prices are deliberately absent: they come from `Plan` only.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * - `standalone`    — sold on its own (the eight apps), each with an upgrade path to Rello.
 * - `bundle`        — Rello itself, the bundle every app upgrades to.
 * - `rello-feature` — never sold on its own; appears only as a Rello feature
 *                     (no buy or trial button). The Oven, The Home Scout.
 * - `unlisted`      — an APP_SLUGS value the locked product map does not name.
 *                     Never offered by Growth; reported, not guessed.
 */
export type ProductKind = "standalone" | "bundle" | "rello-feature" | "unlisted";

export interface ProductEntry {
  readonly kind: ProductKind;
  /** Apps a customer of this app has without buying them ("Already included"). */
  readonly includes: readonly AppSlug[];
}

export const GROWTH_PRODUCTS = {
  "harvest-home": { kind: "standalone", includes: [] },
  // Locked: HomeReady includes Home Stretch. Home Stretch does not include HomeReady.
  "home-ready": { kind: "standalone", includes: ["home-stretch"] },
  "home-stretch": { kind: "standalone", includes: [] },
  "newsletter-studio": { kind: "standalone", includes: [] },
  "open-house-hub": { kind: "standalone", includes: [] },
  "market-intel": { kind: "standalone", includes: [] },
  "pathfinder-pro": { kind: "standalone", includes: [] },
  "the-drumbeat": { kind: "standalone", includes: [] },
  rello: { kind: "bundle", includes: [] },
  "the-oven": { kind: "rello-feature", includes: [] },
  "home-scout": { kind: "rello-feature", includes: [] },
  // Not in the locked product map (an integration and a not-yet-mapped app).
  arive: { kind: "unlisted", includes: [] },
  "prequal-pro": { kind: "unlisted", includes: [] },
} as const satisfies Record<AppSlug, ProductEntry>;

export type GrowthProductSlug = keyof typeof GROWTH_PRODUCTS;

/**
 * Rello's own slug, taken from the one `bundle` entry of the map above (whose
 * keys are checked against APP_SLUGS by `satisfies`), never typed by hand.
 */
export const RELLO_APP_SLUG: AppSlug = (() => {
  const bundles = APP_SLUGS.filter((s) => GROWTH_PRODUCTS[s].kind === "bundle");
  if (bundles.length !== 1) {
    throw new Error(`products.ts: expected exactly one bundle in GROWTH_PRODUCTS, found ${bundles.length}`);
  }
  return bundles[0];
})();

