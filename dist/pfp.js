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
export const KELLY_D60 = "kelly: D60 · BUILD-|-WORKSTREAM/PFP-GATEWAY/mockup/land-expand/pfp-land-expand-261119.html · sha256 31a8b00489d56ae6";
// Shipped sources: the PathfinderPro repo at origin/main 23cb4758.
const P = "@ 23cb4758";
const DASH = "PathfinderPro src/app/(dashboard)/dashboard";
const ROUTE_MAP = "PathfinderPro src/lib/gateway/route-map.ts";
const kelly = (text) => ({ text, source: KELLY_D60 });
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
];
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
};
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
};
/**
 * The step ids PathfinderPro's setup-progress read uses (PathfinderPro `src/lib/gateway/setup-progress.ts:32-40 @ 4102cabd`),
 * in its order. Billing is not a step (MAP-LAND-EXPAND amendment A5).
 */
export const PFP_SETUP_STEP_IDS = [
    "lenders",
    "comp",
    "identity",
    "compliance",
    "check-your-rate",
    "test-quote",
    "rate-widget",
    "email-signature",
];
/**
 * The Get set up card's words, as Kelly approved them (D60), keyed by the PathfinderPro read's step ids. The mockup's
 * `test-lead` step is the read's `test-quote`.
 *
 * NULLS. `identity.where` and `identity.rule` are null: the mockup's lines name "NMLS", which this package's copy rules
 * refuse (README rule 4). The consumer renders nothing in their place.
 *
 * NOT HERE. The footer's last sentence ("When all ${g.m} are done, this card goes away.") interpolates a count; this
 * package's templates hold only `{feature}`, so it is left for the PFP Gateway KA. ⛔ No price anywhere.
 */
export const PFP_SETUP_COPY = {
    title: kelly("Get set up"),
    steps: {
        lenders: {
            where: kelly("Settings › Lenders & Rate Sheets"),
            rule: kelly("Checks off when at least one lender is turned on and saved in Settings › Lenders & Rate Sheets."),
        },
        comp: {
            where: kelly("My Rates › Comp"),
            rule: kelly("Checks off when your comp is saved in My Rates for a lender you turned on."),
        },
        identity: {
            where: null,
            rule: null,
        },
        compliance: {
            where: kelly("Settings › Compliance"),
            rule: kelly("Checks off when your disclosures are saved in Settings › Compliance."),
        },
        "check-your-rate": {
            where: kelly("Check Your Rate › Setup"),
            rule: kelly("Checks off when your page is turned on and saved in Check Your Rate › Setup."),
        },
        "test-quote": {
            label: kelly("Send yourself a test quote"),
            where: kelly("Check Your Rate › your page, then Pipeline › Quotes"),
            rule: kelly("Checks off when one quote from your page is saved in Pipeline › Quotes."),
        },
        "rate-widget": {
            where: kelly("Rate Widget"),
            rule: kelly("Checks off when your widget is first seen on your website."),
        },
        "email-signature": {
            label: kelly("Add rates to your email signature"),
            where: kelly("Email Signature"),
            rule: kelly("Checks off when your signature is saved in Email Signature."),
        },
    },
    /** The card's footer, in order. */
    footer: {
        goTo: kelly("Click › to go to that spot in PathfinderPro."),
        neverTicked: kelly("A circle checks off by itself when that data is saved there; you never tick it."),
    },
};
/**
 * PathfinderPro's gateway Home words (PFP GATEWAY X2c; ruling K-822; MAP-LAND-EXPAND §2), as Kelly approved them (D60):
 * the card row's name, the setup card's "steps done" and link, the rates card's title and link, the Check Your Rate
 * card's lines, and Recent Calls' empty states and chips. ⛔ No price anywhere, no figure, and no hole: words the mockup
 * draws with a count or a time ("leads this week", "sheet in …", "Next: …", the website lines that carry "shown N
 * times" / "sheet in …") are NOT here, nor the locked-item screen-reader text (its hole isn't `{feature}`'s form).
 * The PFP Gateway KA has the list.
 */
export const PFP_HOME_COPY = {
    /** The card row's accessible name. */
    cardRowLabel: kelly("Your plan at a glance"),
    setup: {
        /** Follows the card's "N of M" count. */
        stepsDone: kelly("steps done"),
        seeAll: kelly("See all steps →"),
    },
    rates: {
        title: kelly("Your rates"),
        /** The link to the Rate Widget step when the widget isn't on the website yet. */
        putOnSite: kelly("Put your rates on your site →"),
    },
    cyr: {
        /** Check Your Rate on with no quote yet. */
        pageLive: kelly("Your page is live. Share it to get your first quote."),
        open: kelly("Open Check Your Rate →"),
        /** Precedes the newest quote's borrower. */
        newest: kelly("Newest:"),
    },
    recentCalls: {
        /** Check Your Rate off. */
        noCalls: { title: kelly("No calls yet"), body: kelly("Borrowers who price a loan on a Check Your Rate page land here as calls you can work.") },
        /** Check Your Rate on, no quote yet. */
        noLeads: { title: kelly("No leads yet"), body: kelly("When a borrower prices a loan on your Check Your Rate page, they land here, newest first.") },
        chips: {
            fromCheckYourRate: kelly("From Check Your Rate"),
            new: kelly("New"),
        },
    },
};
