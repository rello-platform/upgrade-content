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
export declare const KELLY_D60 = "kelly: D60 \u00B7 BUILD-|-WORKSTREAM/PFP-GATEWAY/mockup/land-expand/pfp-land-expand-261119.html \u00B7 sha256 31a8b00489d56ae6";
/** The features PathfinderPro locks behind a plan or an add-on (MAP §1.3), in the map's order. */
export declare const PFP_LOCKED_FEATURE_SLUGS: readonly ["call-workstation", "quick-quote", "hecm-advisor", "va-advisor", "dscr-advisor", "bank-statement-advisor", "pre-approval-letter", "events", "loan-programs", "exports", "check-your-rate", "refi-radar", "rate-widget", "email-signature"];
export type LockedFeatureSlug = (typeof PFP_LOCKED_FEATURE_SLUGS)[number];
export interface PfpFeatureCopy {
    /** The feature's name as the lock banner prints it: the shipped name where one renders today (MAP §1.4), else Kelly D60's. */
    readonly name: SourcedText;
    /** The one value sentence from the mockup's feature table (Kelly D60). */
    readonly value: SourcedText | null;
    /** The feature's sales page. null for every slug until its `/features/<slug>` page is live (MAP amendment A2). */
    readonly learnMore: string | null;
}
export declare const PFP_FEATURES: {
    readonly "call-workstation": {
        readonly name: {
            readonly text: "MLO Phone Call Workstation";
            readonly source: "PathfinderPro src/app/(dashboard)/dashboard/scenarios/page.tsx:322 @ 23cb4758";
        };
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "quick-quote": {
        readonly name: {
            readonly text: "Quick Quote";
            readonly source: "PathfinderPro src/components/QuickQuoteMiniForm.tsx:195 @ 23cb4758";
        };
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "hecm-advisor": {
        readonly name: {
            readonly text: "HECM Advisor";
            readonly source: "PathfinderPro src/app/(dashboard)/dashboard/hecm-advisor/HecmWorkspace.tsx:959 @ 23cb4758";
        };
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "va-advisor": {
        readonly name: {
            readonly text: "VA Loan Cockpit";
            readonly source: "PathfinderPro src/app/(dashboard)/dashboard/va-advisor/page.tsx:183 @ 23cb4758";
        };
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "dscr-advisor": {
        readonly name: {
            readonly text: "DSCR Advisor";
            readonly source: "PathfinderPro src/app/(dashboard)/dashboard/dscr-advisor/DscrWorkspace.tsx:1227 @ 23cb4758";
        };
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "bank-statement-advisor": {
        readonly name: {
            readonly text: "Bank-Statement Advisor";
            readonly source: "PathfinderPro src/app/(dashboard)/dashboard/bankstatement-advisor/BankStatementWorkspace.tsx:1348 @ 23cb4758";
        };
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "pre-approval-letter": {
        readonly name: {
            readonly text: "Pre-Approval Letter";
            readonly source: "PathfinderPro src/lib/gateway/route-map.ts:287 @ 23cb4758";
        };
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly events: {
        readonly name: {
            readonly text: "Events";
            readonly source: "PathfinderPro src/lib/gateway/route-map.ts:289 @ 23cb4758";
        };
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "loan-programs": {
        readonly name: {
            readonly text: "Loan Programs";
            readonly source: "PathfinderPro src/lib/gateway/route-map.ts:294 @ 23cb4758";
        };
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly exports: {
        readonly name: {
            readonly text: "Exports";
            readonly source: "PathfinderPro src/lib/gateway/route-map.ts:295 @ 23cb4758";
        };
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "check-your-rate": {
        readonly name: SourcedText;
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "refi-radar": {
        readonly name: SourcedText;
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "rate-widget": {
        readonly name: SourcedText;
        readonly value: SourcedText;
        readonly learnMore: null;
    };
    readonly "email-signature": {
        readonly name: SourcedText;
        readonly value: SourcedText;
        readonly learnMore: null;
    };
};
/**
 * Every string PathfinderPro's lock UI shows around a locked feature, as Kelly approved them (D60). `{feature}` is
 * filled with `PFP_FEATURES[slug].name.text`.
 */
export declare const PFP_LOCK_COPY: {
    readonly banner: {
        /** The banner's first sentence, by what unlocks the feature (mockup `unlockCopy()` + `banner()`: `<name> <part>.`). */
        readonly full: SourcedText;
        readonly addOn: SourcedText;
        readonly rates: SourcedText;
        /** Follows the value sentence when a preview is shown under the banner. */
        readonly previewNote: SourcedText;
        /** The banner's accessible name. */
        readonly lockedLabel: SourcedText;
    };
    readonly buttons: {
        readonly startTrial: SourcedText;
        readonly addCheckYourRate: SourcedText;
        readonly addRefiRadar: SourcedText;
        readonly addRates: SourcedText;
        readonly learnMore: SourcedText;
        /** Learn more's accessible name (its visible text plus the screen-reader-only rest). */
        readonly learnMoreLabel: SourcedText;
    };
    /** The tag on a locked menu item or section, by what unlocks it. */
    readonly tags: {
        readonly full: SourcedText;
        readonly addOn: SourcedText;
        readonly rates: SourcedText;
    };
    readonly menu: {
        readonly inFull: SourcedText;
        readonly addMore: SourcedText;
        /**
         * A locked item's screen-reader text, read after its visible label, when the item opens a lock or preview page
         * (X2d, v0.13.0; ruling K-824): the mockup's :832 words, from the comma on. The consumer fills `{feature}` with
         * `PFP_FEATURES[slug].name.text` and changes nothing else.
         */
        readonly lockedOpensPreview: SourcedText;
    };
    /** Shown when a locked preview's input is used. */
    readonly hint: SourcedText;
};
/**
 * The step ids PathfinderPro's setup-progress read uses (PathfinderPro `src/lib/gateway/setup-progress.ts:32-40 @ 4102cabd`),
 * in its order. Billing is not a step (MAP-LAND-EXPAND amendment A5).
 */
export declare const PFP_SETUP_STEP_IDS: readonly ["lenders", "comp", "identity", "compliance", "check-your-rate", "test-quote", "rate-widget", "email-signature"];
export type PfpSetupStepId = (typeof PFP_SETUP_STEP_IDS)[number];
export interface PfpSetupStepCopy {
    /**
     * The step's label, present only for the two steps PathfinderPro has no shipped title for (MAP §5 LE-4b). The other
     * six steps keep the title PathfinderPro already shows; this package holds no label for them.
     */
    readonly label?: SourcedText;
    /** Where in PathfinderPro the step is done (the mockup's `where`). */
    readonly where: SourcedText | null;
    /** When the step checks off (the mockup's `rule`): it checks off by itself, never by a tick. */
    readonly rule: SourcedText | null;
}
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
export declare const PFP_SETUP_COPY: {
    readonly title: SourcedText;
    readonly steps: {
        readonly lenders: {
            readonly where: SourcedText;
            readonly rule: SourcedText;
        };
        readonly comp: {
            readonly where: SourcedText;
            readonly rule: SourcedText;
        };
        readonly identity: {
            readonly where: null;
            readonly rule: null;
        };
        readonly compliance: {
            readonly where: SourcedText;
            readonly rule: SourcedText;
        };
        readonly "check-your-rate": {
            readonly where: SourcedText;
            readonly rule: SourcedText;
        };
        readonly "test-quote": {
            readonly label: SourcedText;
            readonly where: SourcedText;
            readonly rule: SourcedText;
        };
        readonly "rate-widget": {
            readonly where: SourcedText;
            readonly rule: SourcedText;
        };
        readonly "email-signature": {
            readonly label: SourcedText;
            readonly where: SourcedText;
            readonly rule: SourcedText;
        };
    };
    /** The card's footer, in order. */
    readonly footer: {
        readonly goTo: SourcedText;
        readonly neverTicked: SourcedText;
    };
};
/**
 * PathfinderPro's gateway Home words (PFP GATEWAY X2c; ruling K-822; MAP-LAND-EXPAND §2), as Kelly approved them (D60):
 * the card row's name, the setup card's "steps done" and link, the rates card's title and link, the Check Your Rate
 * card's lines, and Recent Calls' empty states and chips. ⛔ No price anywhere, no figure, and no hole: words the mockup
 * draws with a count or a time ("leads this week", "sheet in …", "Next: …", the website lines that carry "shown N
 * times" / "sheet in …") are NOT here. The PFP Gateway KA has the list. (The locked-item screen-reader text is
 * `PFP_LOCK_COPY.menu.lockedOpensPreview` since v0.13.0.)
 */
export declare const PFP_HOME_COPY: {
    /** The card row's accessible name. */
    readonly cardRowLabel: SourcedText;
    readonly setup: {
        /** Follows the card's "N of M" count. */
        readonly stepsDone: SourcedText;
        readonly seeAll: SourcedText;
    };
    readonly rates: {
        readonly title: SourcedText;
        /** The link to the Rate Widget step when the widget isn't on the website yet. */
        readonly putOnSite: SourcedText;
    };
    readonly cyr: {
        /** Check Your Rate on with no quote yet. */
        readonly pageLive: SourcedText;
        readonly open: SourcedText;
        /** Precedes the newest quote's borrower. */
        readonly newest: SourcedText;
    };
    readonly recentCalls: {
        /** Check Your Rate off. */
        readonly noCalls: {
            readonly title: SourcedText;
            readonly body: SourcedText;
        };
        /** Check Your Rate on, no quote yet. */
        readonly noLeads: {
            readonly title: SourcedText;
            readonly body: SourcedText;
        };
        readonly chips: {
            readonly fromCheckYourRate: SourcedText;
            readonly new: SourcedText;
        };
    };
};
//# sourceMappingURL=pfp.d.ts.map