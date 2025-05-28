import { VoteStrategy } from "./vote_strategy";
import Question from "../../models/questions";
import Vote from "../../models/votes";
import {ParentType, VoteType} from "../../types/enums";

/**
 * Concrete voting strategy for handling votes on questions.
 * Manages creation or update of vote records and adjusts the vote count accordingly.
 */
export class QuestionVoteStrategy implements VoteStrategy {
    /**
     * Handles a vote operation for a question.
     *
     * @param {string} userId - ID of the user casting the vote.
     * @param {string} questionId - ID of the question being voted on.
     * @param {string} voteType - Type of the vote ("up_vote" or "down_vote").
     * @returns {Promise<number>} The updated vote count for the question.
     * @throws Will throw an error if the user tries to vote the same way again.
     */
    async handleVote(userId: string, questionId: string, voteType: string): Promise<number> {
        let voteCount = 0;
        const existingVote = await Vote.findVote(userId, questionId, ParentType.QUESTION);

        if (existingVote) {
            if (existingVote.vote_type === voteType) {
                throw new Error(`You've already ${voteType}d this question`);
            }
            voteCount = existingVote.vote_type === VoteType.UP_VOTE ? -2 : 2;
            await Vote.updateVoteType(existingVote, voteType);
        } else {
            voteCount = voteType === VoteType.UP_VOTE ? 1 : -1;
            await Vote.createVote(voteType, userId, questionId, ParentType.QUESTION);
        }

        const updated = await Question.incrementVoteCount(questionId, voteCount);

        return updated?.vote_count ?? 0;
    }
}
