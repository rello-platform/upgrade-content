import type { StandaloneProductSlug } from "./hosts.js";
/**
 * One piece of shipped copy and where it already ships.
 *
 * ⛔ No new copy lives in this package. Every `text` is a string that already exists
 * in shipped product code, byte for byte as it RENDERS to the reader:
 * - JSX text and JSX attribute strings: HTML entities decode (`&apos;` shows `'`);
 * - a JS string (an object field, metadata, a constant rendered as `{expr}`): it
 *   renders as written, so an entity inside it shows literally and cannot be
 *   quoted here as decoded. Such a line is left null, never "fixed" here.
 * `source` names it: `<Repo> <path>:<line> @ <short sha>`.
 */
export interface SourcedText {
    readonly text: string;
    readonly source: string;
}
/**
 * At most three short points. A fourth is a compile error. A `null` point is a
 * shipped line that cannot be quoted as it renders (see SourcedText): the consumer
 * omits it, like any other null.
 */
export type ExplainerPoints = readonly [] | readonly [SourcedText | null] | readonly [SourcedText | null, SourcedText | null] | readonly [SourcedText | null, SourcedText | null, SourcedText | null];
/**
 * Upgrade and public-site content for one product.
 *
 * NULL MEANS OMIT. A `null` field (or a `null` point, or an empty `points`) means no shipped copy
 * exists for it yet. A consumer renders nothing in its place: never a placeholder,
 * never a default sentence, never a typed stand-in.
 *
 * ⛔ No price, in any field, ever. Prices come only from Rello's `Plan`
 * (`GET /api/public/pricing?app=<slug>`). The copy test refuses currency figures.
 */
export interface UpgradeContentEntry {
    readonly displayName: SourcedText | null;
    readonly tagline: SourcedText | null;
    readonly explainer: {
        readonly title: SourcedText | null;
        readonly points: ExplainerPoints;
    };
    /**
     * Path of the app's in-app `/upgrade` page on its host (APP_PUBLIC_HOSTS), e.g.
     * "/upgrade". `null` until that app's RELLO UPSELL Phase-4 PR ships the page. Each
     * spoke's own PR sets its own value (and moves the "shipped" count in the test).
     * A public "Start a Rello trial" link is shown only when this is set.
     */
    readonly upgradePath: string | null;
}
/**
 * One entry per product-map key (`satisfies Record<AppSlug, …>`), so a slug added to
 * @rello-platform/slugs is a compile error here until it has an entry.
 */
export declare const UPGRADE_CONTENT: {
    readonly rello: {
        readonly displayName: {
            readonly text: "Rello";
            readonly source: "Rello src/components/marketing/SalesPage.tsx:39 @ 4223795b";
        };
        readonly tagline: {
            readonly text: "Powerful standalone apps that work even better together";
            readonly source: "Rello src/components/marketing/SalesPage.tsx:508 @ 4223795b";
        };
        readonly explainer: {
            readonly title: {
                readonly text: "The Rello Ecosystem";
                readonly source: "Rello src/components/marketing/SalesPage.tsx:505 @ 4223795b";
            };
            readonly points: readonly [{
                readonly text: "Visual lead scoring shows who's hot, warm, and cold at a glance.";
                readonly source: "Rello src/components/marketing/SalesPage.tsx:263 @ 4223795b";
            }, {
                readonly text: "Set up intelligent nurture sequences that adapt to each lead's behavior.";
                readonly source: "Rello src/components/marketing/SalesPage.tsx:283 @ 4223795b";
            }, {
                readonly text: "Track agent partnerships, referral leaderboards, and co-marketing campaigns.";
                readonly source: "Rello src/components/marketing/SalesPage.tsx:295 @ 4223795b";
            }];
        };
        readonly upgradePath: null;
    };
    readonly "harvest-home": {
        readonly displayName: {
            readonly text: "Harvest Home";
            readonly source: "Rello src/lib/spoke-branding.ts:74 @ 8114c16d7";
        };
        readonly tagline: {
            readonly text: "Turn signals into qualified leads";
            readonly source: "Rello src/lib/spoke-branding.ts:79 @ 8114c16d7";
        };
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [{
                readonly text: "Lead intelligence platform — discover, score, and enrich real estate leads";
                readonly source: "Harvest-Home src/app/layout.tsx:50 @ a198a63";
            }];
        };
        readonly upgradePath: "/upgrade";
    };
    readonly "home-ready": {
        readonly displayName: {
            readonly text: "Home Ready";
            readonly source: "Rello src/lib/spoke-branding.ts:34 @ 8114c16d7";
        };
        readonly tagline: {
            readonly text: "Your guided path to homeownership";
            readonly source: "Rello src/lib/spoke-branding.ts:39 @ 8114c16d7";
        };
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [{
                readonly text: "Manage automated lead nurturing sequences";
                readonly source: "HomeReady src/app/dashboard/journeys/JourneysClient.tsx:259 @ f0ea99f0";
            }, {
                readonly text: "Share your landing page with clients to capture leads.";
                readonly source: "HomeReady src/app/dashboard/qr-code/QRCodeClient.tsx:108 @ f0ea99f0";
            }, {
                readonly text: "Track cost and performance by acquisition channel";
                readonly source: "HomeReady src/app/dashboard/mlo/source-analytics/SourceAnalyticsClient.tsx:141 @ f0ea99f0";
            }];
        };
        readonly upgradePath: "/dashboard/upgrade";
    };
    readonly "home-stretch": {
        readonly displayName: {
            readonly text: "The Home Stretch";
            readonly source: "Rello src/lib/spoke-branding.ts:42 @ 8114c16d7";
        };
        readonly tagline: {
            readonly text: "Your guided path to closing day";
            readonly source: "Rello src/lib/spoke-branding.ts:47 @ 8114c16d7";
        };
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [{
                readonly text: "Manage and track your homebuyer leads";
                readonly source: "TheHomeStretch src/app/dashboard/leads/page.tsx:221 @ 4fa8cdb";
            }, {
                readonly text: "Control topics, frequency, and content guardrails.";
                readonly source: "TheHomeStretch src/app/dashboard/settings/preferences/page.tsx:74 @ 4fa8cdb";
            }, {
                readonly text: "How content is written on your behalf.";
                readonly source: "TheHomeStretch src/app/dashboard/settings/voice/page.tsx:50 @ 4fa8cdb";
            }];
        };
        readonly upgradePath: "/dashboard/upgrade";
    };
    readonly "newsletter-studio": {
        readonly displayName: {
            readonly text: "Newsletter Studio";
            readonly source: "Rello src/lib/spoke-branding.ts:90 @ 8114c16d7";
        };
        readonly tagline: {
            readonly text: "Nurture your sphere on autopilot";
            readonly source: "Rello src/lib/spoke-branding.ts:95 @ 8114c16d7";
        };
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [{
                readonly text: "Organize contacts into flows for targeted newsletters.";
                readonly source: "Newsletter-Studio src/app/dashboard/flows/page.tsx:160 @ 26c5c8ff";
            }, {
                readonly text: "See how your newsletters are performing.";
                readonly source: "Newsletter-Studio src/app/dashboard/analytics/page.tsx:223 @ 26c5c8ff";
            }, {
                readonly text: "Announcements, partner spotlights, and sponsored content that appear in your newsletters.";
                readonly source: "Newsletter-Studio src/app/dashboard/announcements/page.tsx:262 @ 26c5c8ff";
            }];
        };
        readonly upgradePath: "/dashboard/upgrade";
    };
    readonly "open-house-hub": {
        readonly displayName: {
            readonly text: "Open House Hub";
            readonly source: "Rello src/lib/spoke-branding.ts:50 @ 8114c16d7";
        };
        readonly tagline: {
            readonly text: "Run better open houses";
            readonly source: "Rello src/lib/spoke-branding.ts:55 @ 8114c16d7";
        };
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [{
                readonly text: "Manage your open house events";
                readonly source: "Open-House-Hub src/app/dashboard/events/page.tsx:103 @ 5ed705d5";
            }, {
                readonly text: "Schedule and track private property showings for your leads.";
                readonly source: "Open-House-Hub src/app/dashboard/showings/page.tsx:130 @ 5ed705d5";
            }, {
                readonly text: "All open house attendees across your events";
                readonly source: "Open-House-Hub src/app/dashboard/attendees/page.tsx:101 @ 5ed705d5";
            }];
        };
        readonly upgradePath: "/dashboard/upgrade";
    };
    readonly "market-intel": {
        readonly displayName: {
            readonly text: "Market Intel";
            readonly source: "Rello src/lib/spoke-branding.ts:66 @ 8114c16d7";
        };
        readonly tagline: {
            readonly text: "Live market data for your sphere";
            readonly source: "Rello src/lib/spoke-branding.ts:71 @ 8114c16d7";
        };
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [{
                readonly text: "Websites scraped for articles to include in your digest.";
                readonly source: "MarketIntel src/app/(admin)/admin/websites/page.tsx:19 @ 58caff6e";
            }, {
                readonly text: "Email addresses that send newsletters to be included in your digest.";
                readonly source: "MarketIntel src/app/(admin)/admin/sources/page.tsx:19 @ 58caff6e";
            }, {
                readonly text: "Customize how your digest and podcast appear to subscribers.";
                readonly source: "MarketIntel src/app/(admin)/admin/branding/page.tsx:83 @ 58caff6e";
            }];
        };
        readonly upgradePath: "/admin/upgrade";
    };
    readonly "pathfinder-pro": {
        readonly displayName: {
            readonly text: "Pathfinder Pro";
            readonly source: "Rello src/lib/spoke-branding.ts:82 @ 8114c16d7";
        };
        readonly tagline: null;
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [{
                readonly text: "MLO Phone Call Workstation";
                readonly source: "PathfinderPro src/app/(dashboard)/dashboard/scenarios/page.tsx:322 @ 23b902a6";
            }];
        };
        readonly upgradePath: "/dashboard/upgrade";
    };
    readonly "the-drumbeat": {
        readonly displayName: {
            readonly text: "The Drumbeat";
            readonly source: "Rello src/lib/spoke-branding.ts:58 @ 8114c16d7";
        };
        readonly tagline: {
            readonly text: "Marketing automation platform for mortgage and real estate professionals";
            readonly source: "The-Drumbeat src/app/layout.tsx:49 @ 0221ccb";
        };
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [{
                readonly text: "Record and publish video content for social media.";
                readonly source: "The-Drumbeat src/app/(dashboard)/content/video/page.tsx:55 @ 3f89afc";
            }, {
                readonly text: "Plan and schedule content across all channels.";
                readonly source: "The-Drumbeat src/app/(dashboard)/content/calendar/page.tsx:199 @ 3f89afc";
            }];
        };
        readonly upgradePath: "/upgrade";
    };
    readonly "the-oven": {
        readonly displayName: {
            readonly text: "The Oven";
            readonly source: "The-Oven src/app/(dashboard)/DashboardLayoutClient.tsx:190 @ 482aa0c";
        };
        readonly tagline: {
            readonly text: "Keep your relationships at the perfect temperature";
            readonly source: "The-Oven src/app/layout.tsx:6 @ 482aa0c";
        };
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [];
        };
        readonly upgradePath: null;
    };
    readonly "home-scout": {
        readonly displayName: {
            readonly text: "The Home Scout";
            readonly source: "The-Home-Scout src/app/layout.tsx:6 @ 3fcac343";
        };
        readonly tagline: {
            readonly text: "Interactive tool library & lead capture engine — calculators, estimators, and lead magnets for real estate professionals";
            readonly source: "The-Home-Scout src/app/layout.tsx:8 @ 3fcac343";
        };
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [];
        };
        readonly upgradePath: null;
    };
    readonly arive: {
        readonly displayName: null;
        readonly tagline: null;
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [];
        };
        readonly upgradePath: null;
    };
    readonly "prequal-pro": {
        readonly displayName: null;
        readonly tagline: null;
        readonly explainer: {
            readonly title: null;
            readonly points: readonly [];
        };
        readonly upgradePath: null;
    };
};
/** The eight standalone apps whose `/upgrade` page has shipped (upgradePath set). */
export declare function shippedUpgradePaths(standalone: readonly StandaloneProductSlug[]): StandaloneProductSlug[];
//# sourceMappingURL=content.d.ts.map