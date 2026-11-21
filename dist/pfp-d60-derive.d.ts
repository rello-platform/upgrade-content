/**
 * How a frozen D60 entry's `mockup` snippet (an exact substring of the approved mockup's source) becomes the words the
 * reader sees. One function, used by the test that checks the frozen copy and by nothing that ships to a page.
 *
 * - quoted:   a JS string literal in the mockup (`value:"…"`, `primary:"…"`, `["group","…"]`): the text between the
 *             LAST pair of double quotes, trimmed (`" Below is a preview."` is appended after a space).
 * - banner:   `part:"…"`, composed by the mockup's banner() as `${name} ${part}.`, so `{feature} <part>.`.
 * - template: markup or an attribute with the feature interpolated: tags removed, each hole in
 *             `D60_FEATURE_HOLES` becomes `{feature}`, the attribute's quotes and a leading `>` dropped. Any other
 *             `${…}` is left in the text as code, so it can never pass as words.
 */
export type D60Kind = "quoted" | "banner" | "template";
/**
 * The mockup's ways of printing a feature's name, each turned into `{feature}`: exact strings, never a pattern. These
 * three and no others. The third (X2d, v0.13.0; ruling K-824) is the locked quick action's screen-reader text at
 * mockup :832: the banner name, `long` with a leading "The " dropped, which is what `PFP_FEATURES[slug].name.text`
 * holds (pfp.test.ts checks that against the mockup slug by slug).
 */
export declare const D60_FEATURE_HOLES: readonly ["${esc(nm)}", "${esc(F[slug].long)}", "${esc(F[slug].long.replace(/^The /,\"\"))}"];
export declare function deriveD60Text(kind: D60Kind, snippet: string): string;
//# sourceMappingURL=pfp-d60-derive.d.ts.map