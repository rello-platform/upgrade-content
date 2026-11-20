const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'" };
const FEATURE = /\$\{esc\((?:nm|F\[slug\]\.long)\)\}/g;
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
    if (kind === "markup")
        return lastQuoted(snippet).replace(/<[^>]+>/g, "").replace(/&(?:amp|lt|gt|quot|apos);/g, (e) => ENTITIES[e]).trim();
    const attr = /^[a-z-]+="(.*)"$/.exec(snippet);
    const body = attr ? attr[1] : snippet.replace(/^>/, "");
    return body.replace(/<[^>]+>/g, "").replace(FEATURE, "{feature}");
}
