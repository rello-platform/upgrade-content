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

export const COPY_RULES: readonly CopyRule[] = [
  { name: "currency figure", pattern: /\$\s?\d/ },
  { name: "monthly price", pattern: /\d[\d,.]*\s*(?:\/\s*mo(?:nth)?\b|per\s+month\b|a\s+month\b|mo\b)/i },
  { name: "per month with a number", pattern: /\bper\s+month\b[^.]*\d|\d[^.]*\bper\s+month\b/i },
  { name: "AI", pattern: /\bAI\b|\bA\.I\.|artificial\s+intelligence/i },
  { name: "NMLS", pattern: /\bNMLS\b/i },
  { name: "ClearPath", pattern: /clear\s?path/i },
  { name: "mortgage-rate claim", pattern: /\b(?:mortgage|interest)\s+rates?\b|\bAPR\b|\d+(?:\.\d+)?\s?%/i },
];

/** The names of every rule `text` breaks; empty when it is clean. */
export function refusedCopy(text: string): string[] {
  return COPY_RULES.filter((rule) => rule.pattern.test(text)).map((rule) => rule.name);
}
