# Changelog

Earlier versions (v0.1.0 to v0.9.0) are described in the README's "Known nulls and choices" section and in each tag's commit.

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
