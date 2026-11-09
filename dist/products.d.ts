import { type AppSlug } from "@rello-platform/slugs";
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
export declare const GROWTH_PRODUCTS: {
    readonly "harvest-home": {
        readonly kind: "standalone";
        readonly includes: readonly [];
    };
    readonly "home-ready": {
        readonly kind: "standalone";
        readonly includes: readonly ["home-stretch"];
    };
    readonly "home-stretch": {
        readonly kind: "standalone";
        readonly includes: readonly [];
    };
    readonly "newsletter-studio": {
        readonly kind: "standalone";
        readonly includes: readonly [];
    };
    readonly "open-house-hub": {
        readonly kind: "standalone";
        readonly includes: readonly [];
    };
    readonly "market-intel": {
        readonly kind: "standalone";
        readonly includes: readonly [];
    };
    readonly "pathfinder-pro": {
        readonly kind: "standalone";
        readonly includes: readonly [];
    };
    readonly "the-drumbeat": {
        readonly kind: "standalone";
        readonly includes: readonly [];
    };
    readonly rello: {
        readonly kind: "bundle";
        readonly includes: readonly [];
    };
    readonly "the-oven": {
        readonly kind: "rello-feature";
        readonly includes: readonly [];
    };
    readonly "home-scout": {
        readonly kind: "rello-feature";
        readonly includes: readonly [];
    };
    readonly arive: {
        readonly kind: "unlisted";
        readonly includes: readonly [];
    };
    readonly "prequal-pro": {
        readonly kind: "unlisted";
        readonly includes: readonly [];
    };
};
export type GrowthProductSlug = keyof typeof GROWTH_PRODUCTS;
/**
 * Rello's own slug, taken from the one `bundle` entry of the map above (whose
 * keys are checked against APP_SLUGS by `satisfies`), never typed by hand.
 */
export declare const RELLO_APP_SLUG: AppSlug;
//# sourceMappingURL=products.d.ts.map