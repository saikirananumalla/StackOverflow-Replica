/**
 * Interface representing a strategy for handling votes on different parent entities
 * like questions, answers, or comments.
 */
export interface VoteStrategy {
    /**
     * Handles voting logic for the given user and parent entity.
     *
     * @param {string} userId - The ID of the user performing the vote.
     * @param {string} parentId - The ID of the question, answer, or comment being voted on.
     * @param {string} voteType - The type of vote being cast (e.g., "up_vote", "down_vote").
     * @returns {Promise<number>} - A promise that resolves to the updated vote count.
     */
    handleVote(userId: string, parentId: string, voteType: string): Promise<number>;
}