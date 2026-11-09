const RELLO = "Rello src/app/page.tsx";
const BRAND = "Rello src/lib/spoke-branding.ts";
const R = "@ 8114c16d7";
const none = { title: null, points: [] };
/**
 * One entry per product-map key (`satisfies Record<AppSlug, …>`), so a slug added to
 * @rello-platform/slugs is a compile error here until it has an entry.
 */
export const UPGRADE_CONTENT = {
    rello: {
        displayName: { text: "Rello", source: `${RELLO}:39 ${R}` },
        tagline: { text: "Powerful standalone apps that work even better together", source: `${RELLO}:508 ${R}` },
        explainer: {
            title: { text: "The Rello Ecosystem", source: `${RELLO}:505 ${R}` },
            points: [
                { text: "Visual lead scoring shows who's hot, warm, and cold at a glance.", source: `${RELLO}:263 ${R}` },
                { text: "Set up intelligent nurture sequences that adapt to each lead's behavior.", source: `${RELLO}:283 ${R}` },
                { text: "Track agent partnerships, referral leaderboards, and co-marketing campaigns.", source: `${RELLO}:295 ${R}` },
            ],
        },
        upgradePath: null,
    },
    "harvest-home": {
        displayName: { text: "Harvest Home", source: `${BRAND}:74 ${R}` },
        tagline: { text: "Turn signals into qualified leads", source: `${BRAND}:79 ${R}` },
        explainer: {
            title: null,
            points: [
                { text: "Lead intelligence platform — discover, score, and enrich real estate leads", source: "Harvest-Home src/app/layout.tsx:50 @ a198a63" },
            ],
        },
        upgradePath: null,
    },
    "home-ready": {
        displayName: { text: "Home Ready", source: `${BRAND}:34 ${R}` },
        tagline: { text: "Your guided path to homeownership", source: `${BRAND}:39 ${R}` },
        explainer: {
            title: null,
            points: [
                { text: "Every lead gets a 0-100 score based on credit, savings, and engagement. Know exactly who's ready.", source: "HomeReady src/app/page.tsx:459 @ 08bf4051" },
                { text: "Get notified the moment a lead hits a milestone or becomes mortgage-ready.", source: "HomeReady src/app/page.tsx:465 @ 08bf4051" },
                { text: "Email and SMS sequences that educate and engage leads without manual work.", source: "HomeReady src/app/page.tsx:471 @ 08bf4051" },
            ],
        },
        upgradePath: null,
    },
    "home-stretch": {
        displayName: { text: "The Home Stretch", source: `${BRAND}:42 ${R}` },
        tagline: { text: "Your guided path to closing day", source: `${BRAND}:47 ${R}` },
        explainer: {
            title: null,
            points: [
                { text: "Homebuyer education journey. Guide buyers from credit basics to closing.", source: `${RELLO}:538 ${R}` },
            ],
        },
        upgradePath: null,
    },
    "newsletter-studio": {
        displayName: { text: "Newsletter Studio", source: `${BRAND}:90 ${R}` },
        tagline: { text: "Nurture your sphere on autopilot", source: `${BRAND}:95 ${R}` },
        explainer: {
            title: null,
            points: [
                { text: "Organize contacts into flows like New Leads, Active Buyers, Past Clients. Each gets content tailored to their journey.", source: "Newsletter-Studio src/app/page.tsx:229 @ def9ae5" },
                { text: "Milo, your smart assistant, helps personalize content based on lead interests, market conditions, and engagement history.", source: "Newsletter-Studio src/app/page.tsx:235 @ def9ae5" },
                { text: "See who opens, clicks, and engages. Know which leads are hot and ready for a call.", source: "Newsletter-Studio src/app/page.tsx:241 @ def9ae5" },
            ],
        },
        upgradePath: null,
    },
    "open-house-hub": {
        displayName: { text: "Open House Hub", source: `${BRAND}:50 ${R}` },
        tagline: { text: "Run better open houses", source: `${BRAND}:55 ${R}` },
        explainer: none,
        upgradePath: null,
    },
    "market-intel": {
        displayName: { text: "Market Intel", source: `${BRAND}:66 ${R}` },
        tagline: { text: "Live market data for your sphere", source: `${BRAND}:71 ${R}` },
        explainer: {
            title: null,
            points: [
                { text: "Daily market digests & podcasts. Stay informed with curated real estate news.", source: `${RELLO}:544 ${R}` },
                { text: "10+ industry sources distilled into a clean 5-minute read, delivered by 7:45 AM.", source: "MarketIntel src/app/page.tsx:207 @ d0747b4" },
                { text: "A buyer/seller market gauge with 6 key indicators. Share with clients instantly.", source: "MarketIntel src/app/page.tsx:235 @ d0747b4" },
            ],
        },
        upgradePath: null,
    },
    "pathfinder-pro": {
        displayName: { text: "Pathfinder Pro", source: `${BRAND}:82 ${R}` },
        // null: the shipped productTagline (spoke-branding.ts:87) says "AI", which the copy
        // rules refuse (Milo is a Smart Assistant). Left null, not reworded.
        tagline: null,
        explainer: {
            title: null,
            points: [
                { text: "MLO phone call workstation — pre-qualify borrowers, build rate scenarios, and deliver branded comparisons in under 5 minutes.", source: "PathfinderPro src/app/layout.tsx:8 @ cc842d42" },
            ],
        },
        upgradePath: null,
    },
    "the-drumbeat": {
        displayName: { text: "The Drumbeat", source: `${BRAND}:58 ${R}` },
        // The app's own description. Rello's spoke-branding productTagline for this app
        // (:63, "Daily market intelligence for real estate pros") describes Market Intel,
        // not The Drumbeat; it is filed as DISCOVERED and not used here.
        tagline: { text: "Marketing automation platform for mortgage and real estate professionals", source: "The-Drumbeat src/app/layout.tsx:49 @ 0221ccb" },
        explainer: none,
        upgradePath: null,
    },
    // Never sold on their own (product map kind "rello-feature"): shown only as part of
    // Rello, with no buy or trial button. upgradePath stays null by design.
    "the-oven": {
        displayName: { text: "The Oven", source: "The-Oven src/app/(dashboard)/DashboardLayoutClient.tsx:190 @ 482aa0c" },
        tagline: { text: "Keep your relationships at the perfect temperature", source: "The-Oven src/app/layout.tsx:6 @ 482aa0c" },
        explainer: none,
        upgradePath: null,
    },
    "home-scout": {
        displayName: { text: "The Home Scout", source: "The-Home-Scout src/app/layout.tsx:6 @ 3fcac343" },
        tagline: { text: "Interactive tool library & lead capture engine — calculators, estimators, and lead magnets for real estate professionals", source: "The-Home-Scout src/app/layout.tsx:8 @ 3fcac343" },
        explainer: none,
        upgradePath: null,
    },
    // Not in the locked product map (kind "unlisted"): never offered, so no copy.
    arive: { displayName: null, tagline: null, explainer: none, upgradePath: null },
    "prequal-pro": { displayName: null, tagline: null, explainer: none, upgradePath: null },
};
/** The eight standalone apps whose `/upgrade` page has shipped (upgradePath set). */
export function shippedUpgradePaths(standalone) {
    return standalone.filter((slug) => UPGRADE_CONTENT[slug].upgradePath !== null);
}
