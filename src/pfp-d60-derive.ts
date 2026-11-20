/**
 * How a frozen D60 entry's `mockup` snippet (an exact substring of the approved mockup's source) becomes the words the
 * reader sees. One function, used by the test that checks the frozen copy and by nothing that ships to a page.
 *
 * - quoted:   a JS string literal in the mockup (`value:"…"`, `primary:"…"`, `["group","…"]`): the text between the
 *             LAST pair of double quotes, trimmed (`" Below is a preview."` is appended after a space).
 * - banner:   `part:"…"`, composed by the mockup's banner() as `${name} ${part}.`, so `{feature} <part>.`.
 * - template: markup or an attribute with the feature interpolated: tags removed, `${esc(nm)}` and
 *             `${esc(F[slug].long)}` become `{feature}`, the attribute's quotes and a leading `>` dropped.
 * - markup:   a JS string literal the mockup writes into the page AS MARKUP (unescaped, e.g. wsHead's subtitle), so its
 *             entities are what the reader sees decoded (`P&amp;L` reads "P&L"): the quoted text, tags removed, the five
 *             XML entities decoded. (v0.14.0, X2e)
 */
export type D60Kind = "quoted" | "banner" | "template" | "markup";

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'" };

const FEATURE = /\$\{esc\((?:nm|F\[slug\]\.long)\)\}/g;

function lastQuoted(snippet: string): string {
  const end = snippet.lastIndexOf('"');
  const start = snippet.lastIndexOf('"', end - 1);
  if (start < 0 || end <= start) throw new Error(`no quoted string in ${snippet}`);
  return snippet.slice(start + 1, end);
}

export function deriveD60Text(kind: D60Kind, snippet: string): string {
  if (kind === "quoted") return lastQuoted(snippet).trim();
  if (kind === "banner") return `{feature} ${lastQuoted(snippet)}.`;
  if (kind === "markup") return lastQuoted(snippet).replace(/<[^>]+>/g, "").replace(/&(?:amp|lt|gt|quot|apos);/g, (e) => ENTITIES[e]).trim();
  const attr = /^[a-z-]+="(.*)"$/.exec(snippet);
  const body = attr ? attr[1] : snippet.replace(/^>/, "");
  return body.replace(/<[^>]+>/g, "").replace(FEATURE, "{feature}");
}
