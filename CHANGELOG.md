# Changelog

Earlier versions (v0.1.0 to v0.9.0) are described in the README's "Known nulls and choices" section and in each tag's commit.

## v0.14.0 (additive minor; v0.13.0 is X2d's)

- **PathfinderPro feature sales pages (PFP GATEWAY X2e; ruling K-834; MAP-LAND-EXPAND-261119 amendment A2, unit LE-16):** `PFP_FEATURE_PAGE_COPY` (`more`: a longer line per locked slug, null where the mockup draws none) and `PfpFeaturePageCopy`. Five Kelly D60 strings added to the frozen copy (73 in all): Quick Quote, HECM Advisor, DSCR Advisor, Bank-Statement Advisor and Loan Programs. Each is the line the mockup draws under that feature's heading (each also renders in PathfinderPro today).
- **Derive kind `markup`:** a quoted string the mockup writes into the page as markup; its entities are decoded as the reader sees them (`P&amp;L` reads "P&L"). The existing kinds are unchanged.
- `PFP_FEATURES[slug].learnMore` stays null for every slug: no `/features/<slug>` page is live yet.
- The consumer test imports `PFP_FEATURE_PAGE_COPY`.
- Nothing renamed or removed; no existing string changed.

## v0.12.0 (additive minor)

- **PathfinderPro gateway Home words (PFP GATEWAY X2c; ruling K-822; MAP-LAND-EXPAND-261119 §2):** `PFP_HOME_COPY`, 14 Kelly D60 strings added to the frozen copy:
  - the card row label;
  - setup "steps done" / "See all steps →";
  - "Your rates" / "Put your rates on your site →";
  - Check Your Rate's "Your page is live. …", "Open Check Your Rate →" and "Newest:";
  - Recent Calls' "No calls yet" / "No leads yet" with their lines;
  - the "From Check Your Rate" / "New" chips.
- Words with a count, a time or a second hole are not added (README).
- The consumer test imports `PFP_HOME_COPY`.
- Nothing renamed or removed; no existing string changed.

## v0.11.0 (additive minor)

- **PathfinderPro Get set up words (PFP GATEWAY X2b; ruling K-812; MAP-LAND-EXPAND-261119 §5 LE-4b, A5):** `PFP_SETUP_COPY` (card title, per-step `where` and `rule` lines, labels for `test-quote` and `email-signature`, two footer sentences), `PFP_SETUP_STEP_IDS`, `PfpSetupStepId`, `PfpSetupStepCopy`. Source is Kelly D60 (sha256 31a8b00489d56ae6…); 19 strings added to the frozen copy. `identity.where`/`identity.rule` are null (they name NMLS).
- The consumer test now also imports the PathfinderPro exports (v0.10.0's and these) in plain Node and under NodeNext and Bundler.
- Nothing renamed or removed; no existing string changed. Opt-in for consumers.

## v0.10.0 (additive minor)

- **Kelly-approved source (Platform KA 1415).** A string's source may now be `kelly: <decision id> · <file under iCloud RELLO TO BE BUILT> · sha256 <first 16 hex>` beside the shipped form. The words must be byte-equal to the approved artefact; a frozen copy with its hash is committed and tested. A string with neither form still fails the tests. The header rule in `src/content.ts` and README rule 1 say this.
- **`sourceForm(source)`**: `"shipped" | "kelly" | null`.
- **PathfinderPro lock words (PFP GATEWAY X2; MAP-LAND-EXPAND-261119 §1.3, §1.4, A1, A2):**
  - `PFP_FEATURES` (14 locked slugs: `name`, `value`, `learnMore: null`);
  - `PFP_LOCKED_FEATURE_SLUGS`, `LockedFeatureSlug`;
  - `PFP_LOCK_COPY` (banner frame templates, buttons, tags, menu group labels, the preview hint);
  - `KELLY_D60`.
  Source is Kelly D60 (the land-and-expand mockup, sha256 31a8b00489d56ae6…), except ten names already shipped in PathfinderPro @ 23cb4758.
- Nothing renamed or removed; no existing string changed. Opt-in for consumers.
