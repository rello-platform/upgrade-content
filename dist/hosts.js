// MOVED from Rello src/lib/spoke-branding.ts:28-31 + the `host` field of each entry
// (:36, :44, :52, :60, :68, :76, :84, :92) @ 8114c16d7. Comment word for word:
//
// `host` must be the domain the spoke really serves, the one its OAuthApp row
// registers: RELLO-E07 sends a live sign-in token to it. The spokes' folder and
// slug spellings aren't a guide (marketintel.app, with no hyphen, is a stranger's
// site). spoke-branding.test.ts pins each host to production's row.
//
// Added: `rello` = hellorello.app, the Rello app's own host (Rello CLAUDE.md infra
// facts; `successUrl` in Rello src/app/api/public/checkout/route.ts:246 @ 8114c16d7).
//
// Bare hostnames only: no scheme, no path, no trailing dot. Consumers build URLs.
export const APP_PUBLIC_HOSTS = {
    "home-ready": "homeready.app",
    "home-stretch": "thehomestretch.ai",
    "open-house-hub": "openhousehub.app",
    "the-drumbeat": "thedrumbeat.app",
    "market-intel": "market-intel.app",
    "harvest-home": "harvesthome.app",
    "pathfinder-pro": "pathfinder-pro.app",
    "newsletter-studio": "newsletterstudio.app",
    rello: "hellorello.app",
};
/**
 * The public Rello site's host (RELLO FRONT DOOR). `null` until Kelly answers that
 * workstream's ANSWERS Q1 (which domain). Consumers that need it render no link while
 * it is null; they never guess a domain.
 */
export const RELLO_SITE_HOST = null;
