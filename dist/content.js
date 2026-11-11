const RELLO = "Rello src/app/page.tsx";
const BRAND = "Rello src/lib/spoke-branding.ts";
const R = "@ 8114c16d7";
const DRUM = "The-Drumbeat src/app/(dashboard)";
const D = "@ 3f89afc";
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
        // Harvest Home's in-app /upgrade page (RELLO UPSELL Phase 4, src/app/(app)/upgrade/page.tsx).
        upgradePath: "/upgrade",
    },
    "home-ready": {
        displayName: { text: "Home Ready", source: `${BRAND}:34 ${R}` },
        tagline: { text: "Your guided path to homeownership", source: `${BRAND}:39 ${R}` },
        explainer: {
            title: null,
            points: [
                // null (PLATFORM AUDIT 78 GD-47): HomeReady src/app/page.tsx:459 @ 08bf4051 is a
                // JS string containing `who&apos;s`, rendered as {feature.desc} at :501, so the
                // page shows the entity literally. Not quotable as it renders; not fixed here.
                null,
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
            // Three in-app page subtitles, each JSX text under the page's <h1> in Newsletter-Studio at
            // 26c5c8ff, so each renders exactly as quoted (the first two are the opening sentences of
            // their subtitle). v0.1.0 quoted the public landing page (src/app/page.tsx:229/235/241 @
            // def9ae5), whose claims trace to no app screen: the named default flows exist only as an
            // input placeholder, and "know which leads are hot" is Rello's data (PLATFORM KA 922 A2).
            points: [
                { text: "Organize contacts into flows for targeted newsletters.", source: "Newsletter-Studio src/app/dashboard/flows/page.tsx:160 @ 26c5c8ff" },
                {
                    text: "See how your newsletters are performing.",
                    source: "Newsletter-Studio src/app/dashboard/analytics/page.tsx:223 @ 26c5c8ff",
                },
                {
                    text: "Announcements, partner spotlights, and sponsored content that appear in your newsletters.",
                    source: "Newsletter-Studio src/app/dashboard/announcements/page.tsx:262 @ 26c5c8ff",
                },
            ],
        },
        // Newsletter Studio's in-app /upgrade page (RELLO UPSELL Phase 4, src/app/dashboard/upgrade/page.tsx).
        // Under /dashboard, NS's authenticated app; every lead-facing page is outside it.
        upgradePath: "/dashboard/upgrade",
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
            // The cockpit page's subtitle, JSX text under its <h1>, so it renders exactly as quoted. v0.3.0 quoted the HTML
            // metadata description (layout.tsx:8), which no screen shows and which claims "in under 5 minutes" (KA 894 R6).
            // Not used: Check Your Rate's subtitle (check-your-rate/page.tsx:553): 0 sites exist in production (2026-11-11).
            points: [
                { text: "MLO Phone Call Workstation", source: "PathfinderPro src/app/(dashboard)/dashboard/scenarios/page.tsx:322 @ 23b902a6" },
            ],
        },
        // Pathfinder Pro's in-app /upgrade page (RELLO UPSELL Phase 4, src/app/(dashboard)/dashboard/upgrade/page.tsx). Under
        // /dashboard, where PFP's MLO app lives on pathfinder-pro.app.
        upgradePath: "/dashboard/upgrade",
    },
    "the-drumbeat": {
        displayName: { text: "The Drumbeat", source: `${BRAND}:58 ${R}` },
        // The app's own description. Rello's spoke-branding productTagline for this app
        // (:63, "Daily market intelligence for real estate pros") describes Market Intel,
        // not The Drumbeat; it is filed as DISCOVERED and not used here.
        tagline: { text: "Marketing automation platform for mortgage and real estate professionals", source: "The-Drumbeat src/app/layout.tsx:49 @ 0221ccb" },
        explainer: {
            title: null,
            // Two page subtitles, each JSX text under the page's <h1>, so each renders
            // exactly as quoted. Left out because the product cannot do them from its UI
            // today, so the line would promise a workflow Drumbeat does not have:
            // - Video Messages ("Send personalized video messages to your leads"): its
            //   send route answers 503 until the Newsletter Studio rewire ships.
            // - Direct Mail ("Create and manage direct mail campaigns powered by Lob.",
            //   outreach/direct-mail/page.tsx:55): "New Job" opens the template form and
            //   no page calls /api/direct-mail/jobs (PLATFORM AUDIT 82 GD-331;
            //   DISCOVERED-DRUMBEAT-DIRECT-MAIL-NEW-JOB-OPENS-TEMPLATE-FORM-261110).
            //   Back in once Drumbeat ships a job flow.
            points: [
                { text: "Record and publish video content for social media.", source: `${DRUM}/content/video/page.tsx:55 ${D}` },
                { text: "Plan and schedule content across all channels.", source: `${DRUM}/content/calendar/page.tsx:199 ${D}` },
            ],
        },
        // The Drumbeat's in-app /upgrade page (RELLO UPSELL Drumbeat slice 1).
        upgradePath: "/upgrade",
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
