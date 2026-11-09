export const COPY_RULES = [
    { name: "currency figure", pattern: /\$\s?\d/ },
    { name: "monthly price", pattern: /\d[\d,.]*\s*(?:\/\s*mo(?:nth)?\b|per\s+month\b|a\s+month\b|mo\b)/i },
    { name: "per month with a number", pattern: /\bper\s+month\b[^.]*\d|\d[^.]*\bper\s+month\b/i },
    { name: "AI", pattern: /\bAI\b|\bA\.I\.|artificial\s+intelligence/i },
    { name: "NMLS", pattern: /\bNMLS\b/i },
    { name: "ClearPath", pattern: /clear\s?path/i },
    { name: "mortgage-rate claim", pattern: /\b(?:mortgage|interest)\s+rates?\b|\bAPR\b|\d+(?:\.\d+)?\s?%/i },
];
/** The names of every rule `text` breaks; empty when it is clean. */
export function refusedCopy(text) {
    return COPY_RULES.filter((rule) => rule.pattern.test(text)).map((rule) => rule.name);
}
