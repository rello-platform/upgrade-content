/**
 * Customer outcome stories (RELLO UPSELL Q-CS-9; RELLO FRONT DOOR B4).
 *
 * EMPTY in v0.1.0, on purpose. A story is published only when it is a real
 * customer's outcome and that customer agreed to it. Placeholder people (the
 * Utah examples in the design notes) never ship here: on a public page they would
 * read as fabricated testimonials.
 *
 * The type makes the consent record mandatory: a story without `consentRecordedAt`
 * and `customerTenantId` does not compile, and `assertPeerStory` refuses one at
 * runtime (blank or unparseable values included).
 */
export interface PeerStory {
  /** Short headline, from the customer's own words. */
  readonly headline: string;
  /** The outcome, in the customer's own words. No prices (the copy rules apply). */
  readonly body: string;
  /** ISO 8601 time the customer's consent to publish was recorded. */
  readonly consentRecordedAt: string;
  /** The Rello tenant the customer belongs to (who gave the consent). */
  readonly customerTenantId: string;
}

export const PEER_STORIES: readonly PeerStory[] = [];

/** Throws unless the story carries a real consent record. */
export function assertPeerStory(story: unknown): asserts story is PeerStory {
  if (typeof story !== "object" || story === null) {
    throw new Error("PeerStory: not an object");
  }
  const s = story as Record<string, unknown>;
  for (const key of ["headline", "body", "customerTenantId"] as const) {
    if (typeof s[key] !== "string" || (s[key] as string).trim() === "") {
      throw new Error(`PeerStory: ${key} is required`);
    }
  }
  const at = s.consentRecordedAt;
  if (typeof at !== "string" || at.trim() === "" || Number.isNaN(Date.parse(at))) {
    throw new Error("PeerStory: consentRecordedAt is required (an ISO 8601 time)");
  }
}
