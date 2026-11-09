export const PEER_STORIES = [];
/** Throws unless the story carries a real consent record. */
export function assertPeerStory(story) {
    if (typeof story !== "object" || story === null) {
        throw new Error("PeerStory: not an object");
    }
    const s = story;
    for (const key of ["headline", "body", "customerTenantId"]) {
        if (typeof s[key] !== "string" || s[key].trim() === "") {
            throw new Error(`PeerStory: ${key} is required`);
        }
    }
    const at = s.consentRecordedAt;
    if (typeof at !== "string" || at.trim() === "" || Number.isNaN(Date.parse(at))) {
        throw new Error("PeerStory: consentRecordedAt is required (an ISO 8601 time)");
    }
}
