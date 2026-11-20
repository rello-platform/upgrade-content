/**
 * How a frozen D60 entry's `mockup` snippet (an exact substring of the approved mockup's source) becomes the words the
 * reader sees. One function, used by the test that checks the frozen copy and by nothing that ships to a page.
 *
 * - quoted:   a JS string literal in the mockup (`value:"…"`, `primary:"…"`, `["group","…"]`): the text between the
 *             LAST pair of double quotes, trimmed (`" Below is a preview."` is appended after a space).
 * - banner:   `part:"…"`, composed by the mockup's banner() as `${name} ${part}.`, so `{feature} <part>.`.
 * - template: markup or an attribute with the feature interpolated: tags removed, `${esc(nm)}` and
 *             `${esc(F[slug].long)}` become `{feature}`, the attribute's quotes and a leading `>` dropped.
 */
export type D60Kind = "quoted" | "banner" | "template";

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
  const attr = /^[a-z-]+="(.*)"$/.exec(snippet);
  const body = attr ? attr[1] : snippet.replace(/^>/, "");
  return body.replace(/<[^>]+>/g, "").replace(FEATURE, "{feature}");
}
