// MOVED from Rello src/lib/growth/products.ts:1-69 @ 8114c16d7 (Platform KA prompt 741).
// Body and lock comments are word for word. Only the import list changed: the three
// helpers Rello's later lines use (isAppSlug, isEngineSlug, tryNormalizeSlug) are not
// used by this part and stay in Rello with isRelloPlanAppSlug / productOf.
import { APP_SLUGS } from "@rello-platform/slugs";
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
};
/**
 * Rello's own slug, taken from the one `bundle` entry of the map above (whose
 * keys are checked against APP_SLUGS by `satisfies`), never typed by hand.
 */
export const RELLO_APP_SLUG = (() => {
    const bundles = APP_SLUGS.filter((s) => GROWTH_PRODUCTS[s].kind === "bundle");
    if (bundles.length !== 1) {
        throw new Error(`products.ts: expected exactly one bundle in GROWTH_PRODUCTS, found ${bundles.length}`);
    }
    return bundles[0];
})();
