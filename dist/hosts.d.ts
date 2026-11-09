import { GROWTH_PRODUCTS, type GrowthProductSlug } from "./products.js";
/** The eight apps sold on their own (`kind: "standalone"` in the product map). */
export type StandaloneProductSlug = {
    [K in GrowthProductSlug]: (typeof GROWTH_PRODUCTS)[K]["kind"] extends "standalone" ? K : never;
}[GrowthProductSlug];
/** Rello itself (`kind: "bundle"`). */
export type BundleProductSlug = {
    [K in GrowthProductSlug]: (typeof GROWTH_PRODUCTS)[K]["kind"] extends "bundle" ? K : never;
}[GrowthProductSlug];
/** Every product a public page may link to with a buy or sign-in address. */
export type HostedProductSlug = StandaloneProductSlug | BundleProductSlug;
export declare const APP_PUBLIC_HOSTS: {
    readonly "home-ready": "homeready.app";
    readonly "home-stretch": "thehomestretch.ai";
    readonly "open-house-hub": "openhousehub.app";
    readonly "the-drumbeat": "thedrumbeat.app";
    readonly "market-intel": "market-intel.app";
    readonly "harvest-home": "harvesthome.app";
    readonly "pathfinder-pro": "pathfinder-pro.app";
    readonly "newsletter-studio": "newsletterstudio.app";
    readonly rello: "hellorello.app";
};
/**
 * The public Rello site's host (RELLO FRONT DOOR). `null` until Kelly answers that
 * workstream's ANSWERS Q1 (which domain). Consumers that need it render no link while
 * it is null; they never guess a domain.
 */
export declare const RELLO_SITE_HOST: string | null;
//# sourceMappingURL=hosts.d.ts.map