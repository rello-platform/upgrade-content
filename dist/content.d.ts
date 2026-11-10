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
            readonly source: "Rello src/app/page.tsx:39 @ 8114c16d7";
        };
        readonly tagline: {
            readonly text: "Powerful standalone apps that work even better together";
            readonly source: "Rello src/app/page.tsx:508 @ 8114c16d7";
        };
        readonly explainer: {
            readonly title: {
                readonly text: "The Rello Ecosystem";
                readonly source: "Rello src/app/page.tsx:505 @ 8114c16d7";
            };
            readonly points: readonly [{
                readonly text: "Visual lead scoring shows who's hot, warm, and cold at a glance.";
                readonly source: "Rello src/app/page.tsx:263 @ 8114c16d7";
            }, {
                readonly text: "Set up intelligent nurture sequences that adapt to each lead's behavior.";
                readonly source: "Rello src/app/page.tsx:283 @ 8114c16d7";
            }, {
                readonly text: "Track agent partnerships, referral leaderboards, and co-marketing campaigns.";
                readonly source: "Rello src/app/page.tsx:295 @ 8114c16d7";
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
            readonly points: readonly [null, {
                readonly text: "Get notified the moment a lead hits a milestone or becomes mortgage-ready.";
                readonly source: "HomeReady src/app/page.tsx:465 @ 08bf4051";
            }, {
                readonly text: "Email and SMS sequences that educate and engage leads without manual work.";
                readonly source: "HomeReady src/app/page.tsx:471 @ 08bf4051";
            }];
        };
        readonly upgradePath: null;
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
                readonly text: "Homebuyer education journey. Guide buyers from credit basics to closing.";
                readonly source: "Rello src/app/page.tsx:538 @ 8114c16d7";
            }];
        };
        readonly upgradePath: null;
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
                readonly text: "Organize contacts into flows like New Leads, Active Buyers, Past Clients. Each gets content tailored to their journey.";
                readonly source: "Newsletter-Studio src/app/page.tsx:229 @ def9ae5";
            }, {
                readonly text: "Milo, your smart assistant, helps personalize content based on lead interests, market conditions, and engagement history.";
                readonly source: "Newsletter-Studio src/app/page.tsx:235 @ def9ae5";
            }, {
                readonly text: "See who opens, clicks, and engages. Know which leads are hot and ready for a call.";
                readonly source: "Newsletter-Studio src/app/page.tsx:241 @ def9ae5";
            }];
        };
        readonly upgradePath: null;
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
            readonly points: readonly [];
        };
        readonly upgradePath: null;
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
                readonly text: "Daily market digests & podcasts. Stay informed with curated real estate news.";
                readonly source: "Rello src/app/page.tsx:544 @ 8114c16d7";
            }, {
                readonly text: "10+ industry sources distilled into a clean 5-minute read, delivered by 7:45 AM.";
                readonly source: "MarketIntel src/app/page.tsx:207 @ d0747b4";
            }, {
                readonly text: "A buyer/seller market gauge with 6 key indicators. Share with clients instantly.";
                readonly source: "MarketIntel src/app/page.tsx:235 @ d0747b4";
            }];
        };
        readonly upgradePath: null;
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
                readonly text: "MLO phone call workstation — pre-qualify borrowers, build rate scenarios, and deliver branded comparisons in under 5 minutes.";
                readonly source: "PathfinderPro src/app/layout.tsx:8 @ cc842d42";
            }];
        };
        readonly upgradePath: null;
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