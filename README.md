# @rello-platform/upgrade-content

The one source of product facts and shipped copy for Rello's upgrade and public surfaces. One package read by everyone, so no app keeps its own copy.

Install from a git tag (no npm registry):

```json
"@rello-platform/upgrade-content": "github:rello-platform/upgrade-content#v0.2.0"
```

ES module only: `"type": "module"`, with `"exports"` → `./dist/index.js` (types `./dist/index.d.ts`). Import it with `import { … } from "@rello-platform/upgrade-content"`. Plain Node, bundlers and TypeScript (`NodeNext` or `Bundler` resolution) all load it; the consumer test proves each on every push.

## Exports

| Export | What it is | Who reads it |
|---|---|---|
| `GROWTH_PRODUCTS`, `ProductKind`, `ProductEntry`, `GrowthProductSlug`, `RELLO_APP_SLUG` | The locked product map, moved word for word from Rello `src/lib/growth/products.ts:1-69 @ 8114c16d7`. Keyed by every `APP_SLUGS` value (`satisfies Record<AppSlug, ProductEntry>`), so a new slug in `@rello-platform/slugs` is a compile error here. | Rello Growth (which re-exports it in place of its local copy, in a later Rello PR); the RELLO FRONT DOOR pages (HS); each spoke's `/upgrade` page. |
| `APP_PUBLIC_HOSTS`, `StandaloneProductSlug`, `BundleProductSlug`, `HostedProductSlug` | The host each app really serves: the `host` field of Rello's `SPOKE_BRANDING` (`src/lib/spoke-branding.ts @ 8114c16d7`) for the eight standalone apps, plus `rello: "hellorello.app"`. Bare hostnames; consumers build URLs. | RELLO FRONT DOOR "See plans" links (`https://<host>/pricing`); Rello (in place of `SPOKE_BRANDING.host`, in a later Rello PR). |
| `RELLO_SITE_HOST` | The public Rello site's host. `null` until Kelly answers RELLO FRONT DOOR ANSWERS Q1. A consumer renders no link while it is null and never guesses a domain. | RELLO FRONT DOOR; the spokes' `/upgrade` pages ("Learn about Rello"). |
| `UPGRADE_CONTENT`, `UpgradeContentEntry`, `SourcedText`, `ExplainerPoints` | One entry per product-map key: `displayName`, `tagline`, `explainer` (`title` + at most three `points`), `upgradePath`. | Each spoke's in-app `/upgrade` page (RELLO UPSELL Q-CS-10); RELLO FRONT DOOR product cards. |
| `shippedUpgradePaths(standalone)` | The standalone apps whose `upgradePath` is set. 0 of 8 at v0.1.0; 1 of 8 at v0.2.0 (`the-drumbeat`); 2 of 8 at v0.3.0 (`harvest-home`, `the-drumbeat`). | Tests; RELLO FRONT DOOR (shows "Start a Rello trial" only for these). |
| `PEER_STORIES`, `PeerStory`, `assertPeerStory` | Customer stories. Empty at v0.1.0. Each story's type requires `consentRecordedAt` and `customerTenantId`. | RELLO FRONT DOOR and the `/upgrade` pages, once a real, authorized story exists (RELLO UPSELL Q-CS-9). |
| `COPY_RULES`, `refusedCopy(text)` | The copy rules below, as code. | This package's tests; any consumer that wants to check its own strings. |

## Rules

1. **No new copy.** Every non-null string already ships in product code. Each carries a `source`, `<Repo> <path>:<line> @ <sha>`, and is quoted byte for byte as it renders. JSX text and JSX attribute strings decode HTML entities. A JS string rendered as `{expression}` shows exactly as written, so an entity inside it renders literally and cannot be quoted decoded: that line stays `null`. A change of copy happens in the product first, then is copied here with its new source.
2. **Null means omit.** A `null` field, a `null` point, or an empty `points` means no shipped copy exists. The consumer renders nothing in its place: never a placeholder, a default sentence or a stand-in.
3. **No prices, ever.** There is no money field. Prices come only from Rello `Plan` through `GET /api/public/pricing?app=<slug>`.
4. **Copy rules** (`src/copy-rules.ts`, enforced by `src/content.test.ts` over every string). The package refuses:
   - a currency figure;
   - a monthly price, or "per month" with a number;
   - "AI" or "artificial intelligence" (Milo is a Smart Assistant);
   - NMLS;
   - the ClearPath name;
   - a mortgage-rate claim (mortgage or interest rates, APR, a percentage).

   If a shipped string breaks a rule, its field stays `null` here. The source is not edited from this package.
5. **Stories need consent.** `PEER_STORIES` holds only real, authorized outcomes. A story with no `consentRecordedAt` is a compile error and a test failure. Placeholder people are never published.
6. **upgradePath is set by each app's own PR.** It stays `null` until that app's `/upgrade` page ships (RELLO UPSELL Phase 4). The Oven and The Home Scout (`rello-feature`) and the `unlisted` slugs never get one.

## Known nulls and choices at v0.3.0

- `pathfinder-pro.tagline` is `null`. The shipped tagline (Rello `spoke-branding.ts:87`) says "AI".
- `home-ready.explainer.points[0]` is `null`. HomeReady `src/app/page.tsx:459` is a JS string holding `who&apos;s`, which the page shows literally (PLATFORM AUDIT 78 GD-47).
- `the-drumbeat.tagline` is the app's own description (The-Drumbeat `src/app/layout.tsx:49`). Rello's `spoke-branding.ts:63` tagline for The Drumbeat describes Market Intel.
- `the-drumbeat.explainer.points` (v0.2.0) are two page subtitles, each JSX text under the page's `<h1>` in The-Drumbeat at `3f89afc`: Video and Content Calendar. `the-drumbeat.upgradePath` is `"/upgrade"`. Left out because Drumbeat cannot do them from its UI today:
  - Video Messages: its send route answers 503.
  - Direct Mail ("Create and manage direct mail campaigns powered by Lob."): "New Job" opens the template form and no page calls `/api/direct-mail/jobs` (PLATFORM AUDIT 82 GD-331; `APP REBUILDS/DRUMBEAT/DISCOVERED/DISCOVERED-DRUMBEAT-DIRECT-MAIL-NEW-JOB-OPENS-TEMPLATE-FORM-261110.md`). It comes back once Drumbeat ships a job flow.
- `harvest-home.upgradePath` is `"/upgrade"` (v0.3.0), the page Harvest Home's RELLO UPSELL Phase-4 PR ships at `src/app/(app)/upgrade/page.tsx`. Its explainer is unchanged: the one shipped point (`src/app/layout.tsx:50`).
- `open-house-hub`, `the-oven` and `home-scout` have no explainer points, because no short shipped copy was found.
- `arive` and `prequal-pro` (`unlisted`) have no copy.

## Develop

```sh
npm ci && npm run hooks   # wires .husky/pre-push
npm run typecheck         # src + tests
npm test
npm run compile           # dist/ is committed; the pre-push hook refuses a stale one
```

The pre-push hook runs, in order: the `tag-dist-gate` (tag pushes only), the lockfile git+ssh check, typecheck, compile and a dist/ freshness check, tests, the consumer test (`npm run test:consumer`: `npm pack`, install the tarball into a fresh project, import it by name from plain Node, then `tsc --noEmit` a TypeScript consumer under NodeNext and Bundler), and lint. Never push with `--no-verify`.

Releases are git tags (`v0.1.0`, …) pushed by the Platform KA after an audit CLEAR.
