import { VoteStrategy } from "./vote_strategy";
import Answer from "../../models/answers";
import Vote from "../../models/votes";
import {ParentType, VoteType} from "../../types/enums";

/**
 * Concrete voting strategy for handling votes on answers.
 * Implements logic to create or update votes and update the answer's vote count accordingly.
 */
export class AnswerVoteStrategy implements VoteStrategy {
    /**
     * Handles a vote operation for an answer.
     *
     * @param {string} userId - ID of the user casting the vote.
     * @param {string} answerId - ID of the answer being voted on.
     * @param {string} voteType - Type of the vote (e.g., "up_vote" or "down_vote").
     * @returns {Promise<number>} The updated vote count for the answer.
     * @throws Will throw an error if the same vote already exists.
     */
    async handleVote(userId: string, answerId: string, voteType: string): Promise<number> {
        let voteCount = 0;
        const existingVote = await Vote.findVote(userId, answerId, ParentType.ANSWER);

        if (existingVote) {
            if (existingVote.vote_type === voteType) {
                throw new Error(`You've already ${voteType}d this answer`);
            }
            voteCount = existingVote.vote_type === VoteType.UP_VOTE ? -2 : 2;
            await Vote.updateVoteType(existingVote, voteType);
        } else {
            voteCount = voteType === VoteType.UP_VOTE ? 1 : -1;
            await Vote.createVote(voteType, userId, answerId, ParentType.ANSWER);
        }

        const updated = await Answer.incrementVoteCount(answerId, voteCount);

        return updated?.vote_count ?? 0;
    }
}
