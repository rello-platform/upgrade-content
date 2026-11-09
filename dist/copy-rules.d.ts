/**
 * Words and figures that may never appear in this package's copy.
 *
 * - Prices: a currency figure ("$" then a digit), or a number with "per month",
 *   "/mo" or "a month". Prices come only from Rello's `Plan`.
 * - "AI" or "artificial intelligence". Milo is a "Smart Assistant" and is never
 *   called AI in any Rello-facing context; the rule is applied to all copy here,
 *   not only to sentences that name Milo, because a word test cannot know the
 *   context and over-refusing costs one null field.
 * - Kelly's mortgage identity: "NMLS", "ClearPath".
 * - Mortgage-rate claims: "mortgage rate(s)", "interest rate(s)", "APR", or a
 *   percentage figure.
 */
export interface CopyRule {
    readonly name: string;
    readonly pattern: RegExp;
}
export declare const COPY_RULES: readonly CopyRule[];
/** The names of every rule `text` breaks; empty when it is clean. */
export declare function refusedCopy(text: string): string[];
//# sourceMappingURL=copy-rules.d.ts.map