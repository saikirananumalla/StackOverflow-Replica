import { VoteStrategy } from "./vote_strategy";

/**
 * Context class for handling voting logic using a strategy pattern.
 * Delegates vote execution to the appropriate strategy based on the parent type.
 */
export class VoteContext {
    private strategy: VoteStrategy;

    /**
     * Constructs the context with a specific vote strategy.
     * @param {VoteStrategy} strategy - The voting strategy to be used.
     */
    constructor(strategy: VoteStrategy) {
        this.strategy = strategy;
    }

    /**
     * Executes the vote operation using the configured strategy.
     * @param {string} userId - The ID of the user performing the vote.
     * @param {string} parentId - The ID of the parent entity being voted on.
     * @param {string} voteType - The type of vote (e.g., "up_vote", "down_vote").
     * @returns {Promise<number>} - The updated vote count after applying the vote.
     */
    async executeVote(userId: string, parentId: string, voteType: string): Promise<number> {
        return this.strategy.handleVote(userId, parentId, voteType);
    }
}