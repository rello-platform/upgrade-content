/**
 * The mockup's ways of printing a feature's name, each turned into `{feature}`: exact strings, never a pattern. These
 * three and no others. The third (X2d, v0.13.0; ruling K-824) is the locked quick action's screen-reader text at
 * mockup :832: the banner name, `long` with a leading "The " dropped, which is what `PFP_FEATURES[slug].name.text`
 * holds (pfp.test.ts checks that against the mockup slug by slug).
 */
export const D60_FEATURE_HOLES = [
    "${esc(nm)}",
    "${esc(F[slug].long)}",
    '${esc(F[slug].long.replace(/^The /,""))}',
];
function fillFeature(text) {
    let out = text;
    for (const hole of D60_FEATURE_HOLES)
        out = out.split(hole).join("{feature}");
    return out;
}
function lastQuoted(snippet) {
    const end = snippet.lastIndexOf('"');
    const start = snippet.lastIndexOf('"', end - 1);
    if (start < 0 || end <= start)
        throw new Error(`no quoted string in ${snippet}`);
    return snippet.slice(start + 1, end);
}
export function deriveD60Text(kind, snippet) {
    if (kind === "quoted")
        return lastQuoted(snippet).trim();
    if (kind === "banner")
        return `{feature} ${lastQuoted(snippet)}.`;
    const attr = /^[a-z-]+="(.*)"$/.exec(snippet);
    const body = attr ? attr[1] : snippet.replace(/^>/, "");
    return fillFeature(body.replace(/<[^>]+>/g, ""));
}
