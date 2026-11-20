import type { SourcedText } from "./content.js";

/**
 * PathfinderPro land-and-expand words (PFP GATEWAY unit X2; MAP-LAND-EXPAND-261119 §1.3, §1.4, amendments A1/A2;
 * Platform KA 1415 ruling on a Kelly-approved source).
 *
 * Two kinds of source, one per string (see `SourcedText`):
 * - shipped: the words already render in PathfinderPro (`PathfinderPro <path>:<line> @ <sha>`);
 * - kelly: Kelly approved these exact words in the D60 mockup (`KELLY_D60` below). They are byte-equal to that
 *   artefact: no paraphrase, no punctuation fixes. A frozen copy of every approved string, with the mockup's hash, is
 *   committed at test-fixtures/pfp-d60-approved.json and checked by src/pfp.test.ts.
 *
 * TEMPLATES. A string holding `{feature}` is a template from the mockup. The consumer replaces `{feature}` with
 * `PFP_FEATURES[slug].name.text`, the feature's name as the banner prints it, and changes nothing else.
 *
 * NULL MEANS OMIT (as everywhere in this package): a null `value` leaves the sentence out of the banner; a null
 * `learnMore` hides the Learn more button. ⛔ No price anywhere.
 */

/** Kelly D60 (ANSWERS.md): the approved land-and-expand mockup, under iCloud RELLO TO BE BUILT, by the first 16 hex of its sha256. */
export const KELLY_D60 =
  "kelly: D60 · BUILD-|-WORKSTREAM/PFP-GATEWAY/mockup/land-expand/pfp-land-expand-261119.html · sha256 31a8b00489d56ae6";

// Shipped sources: the PathfinderPro repo at origin/main 23cb4758.
const P = "@ 23cb4758";
const DASH = "PathfinderPro src/app/(dashboard)/dashboard";
const ROUTE_MAP = "PathfinderPro src/lib/gateway/route-map.ts";

const kelly = (text: string): SourcedText => ({ text, source: KELLY_D60 });

/** The features PathfinderPro locks behind a plan or an add-on (MAP §1.3), in the map's order. */
export const PFP_LOCKED_FEATURE_SLUGS = [
  "call-workstation",
  "quick-quote",
  "hecm-advisor",
  "va-advisor",
  "dscr-advisor",
  "bank-statement-advisor",
  "pre-approval-letter",
  "events",
  "loan-programs",
  "exports",
  "check-your-rate",
  "refi-radar",
  "rate-widget",
  "email-signature",
] as const;

export type LockedFeatureSlug = (typeof PFP_LOCKED_FEATURE_SLUGS)[number];

export interface PfpFeatureCopy {
  /** The feature's name as the lock banner prints it: the shipped name where one renders today (MAP §1.4), else Kelly D60's. */
  readonly name: SourcedText;
  /** The one value sentence from the mockup's feature table (Kelly D60). */
  readonly value: SourcedText | null;
  /** The feature's sales page. null for every slug until its `/features/<slug>` page is live (MAP amendment A2). */
  readonly learnMore: string | null;
}

export const PFP_FEATURES = {
  "call-workstation": {
    // MAP §1.4 lists the shipped subtitle. ⚠ The D60 banner names this feature "call workstation" ("The call
    // workstation", with "The" dropped); see the X2 paste-back for the KA's call on which name the banner prints.
    name: { text: "MLO Phone Call Workstation", source: `${DASH}/scenarios/page.tsx:322 ${P}` },
    value: kelly("Run the whole phone call on one screen: the borrower's answers on the left, live rates and payments on the right."),
    learnMore: null,
  },
  "quick-quote": {
    name: { text: "Quick Quote", source: `PathfinderPro src/components/QuickQuoteMiniForm.tsx:195 ${P}` },
    value: kelly("Price a scenario in seconds while the borrower is still on the line."),
    learnMore: null,
  },
  "hecm-advisor": {
    name: { text: "HECM Advisor", source: `${DASH}/hecm-advisor/HecmWorkspace.tsx:959 ${P}` },
    value: kelly("Show a reverse-mortgage borrower what they can draw and what it costs, side by side."),
    learnMore: null,
  },
  "va-advisor": {
    name: { text: "VA Loan Cockpit", source: `${DASH}/va-advisor/page.tsx:183 ${P}` },
    value: kelly("Walk a veteran through funding fee, entitlement and payment in one view."),
    learnMore: null,
  },
  "dscr-advisor": {
    name: { text: "DSCR Advisor", source: `${DASH}/dscr-advisor/DscrWorkspace.tsx:1227 ${P}` },
    value: kelly("Qualify an investor on the property's rent instead of their tax returns."),
    learnMore: null,
  },
  "bank-statement-advisor": {
    name: { text: "Bank-Statement Advisor", source: `${DASH}/bankstatement-advisor/BankStatementWorkspace.tsx:1348 ${P}` },
    value: kelly("Turn a self-employed borrower's deposits into qualifying income."),
    learnMore: null,
  },
  "pre-approval-letter": {
    name: { text: "Pre-Approval Letter", source: `${ROUTE_MAP}:287 ${P}` },
    value: kelly("Send a branded pre-approval letter the moment a borrower qualifies, filled in from the call."),
    learnMore: null,
  },
  events: {
    name: { text: "Events", source: `${ROUTE_MAP}:289 ${P}` },
    value: kelly("Plan homebuyer events and keep every attendee in your pipeline."),
    learnMore: null,
  },
  "loan-programs": {
    name: { text: "Loan Programs", source: `${ROUTE_MAP}:294 ${P}` },
    value: kelly("Your library of loan programs, so you can match a borrower to the right one during the call."),
    learnMore: null,
  },
  exports: {
    name: { text: "Exports", source: `${ROUTE_MAP}:295 ${P}` },
    value: kelly("Send a finished file to your loan system without typing it in twice."),
    learnMore: null,
  },
  "check-your-rate": {
    name: kelly("Check Your Rate"),
    value: kelly("A page on your website where borrowers price their own loan and land in your pipeline."),
    learnMore: null,
  },
  "refi-radar": {
    name: kelly("Refi Radar"),
    value: kelly("Upload your past clients and see which ones today's rates could help."),
    learnMore: null,
  },
  "rate-widget": {
    name: kelly("Rate Widget"),
    value: kelly("Your live rates on your own website, updated whenever your lenders' sheets change."),
    learnMore: null,
  },
  "email-signature": {
    name: kelly("Email signature"),
    value: kelly("Today's rates in every email you send."),
    learnMore: null,
  },
} as const satisfies Record<LockedFeatureSlug, PfpFeatureCopy>;

/**
 * Every string PathfinderPro's lock UI shows around a locked feature, as Kelly approved them (D60). `{feature}` is
 * filled with `PFP_FEATURES[slug].name.text`.
 */
export const PFP_LOCK_COPY = {
  banner: {
    /** The banner's first sentence, by what unlocks the feature (mockup `unlockCopy()` + `banner()`: `<name> <part>.`). */
    full: kelly("{feature} is part of Full PathfinderPro."),
    addOn: kelly("{feature} is an add-on to your Rates plan."),
    rates: kelly("{feature} comes with PathfinderPro Rates."),
    /** Follows the value sentence when a preview is shown under the banner. */
    previewNote: kelly("Below is a preview."),
    /** The banner's accessible name. */
    lockedLabel: kelly("{feature} is locked"),
  },
  buttons: {
    startTrial: kelly("Start 14-day trial"),
    addCheckYourRate: kelly("Add Check Your Rate"),
    addRefiRadar: kelly("Add Refi Radar"),
    addRates: kelly("Add Rates to your plan"),
    learnMore: kelly("Learn more"),
    /** Learn more's accessible name (its visible text plus the screen-reader-only rest). */
    learnMoreLabel: kelly("Learn more about {feature} (opens the sales page in a new tab)"),
  },
  /** The tag on a locked menu item or section, by what unlocks it. */
  tags: {
    full: kelly("Full PathfinderPro"),
    addOn: kelly("Add-on"),
    rates: kelly("PathfinderPro Rates"),
  },
  menu: {
    inFull: kelly("In Full PathfinderPro"),
    addMore: kelly("Add more"),
  },
  /** Shown when a locked preview's input is used. */
  hint: kelly("Start your trial to price your own borrower"),
} as const satisfies Record<string, SourcedText | Record<string, SourcedText>>;
