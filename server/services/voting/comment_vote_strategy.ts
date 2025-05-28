import { VoteStrategy } from "./vote_strategy";
import Comment from "../../models/comments";
import Vote from "../../models/votes";
import {ParentType, VoteType} from "../../types/enums";

/**
 * Concrete voting strategy for handling votes on comments.
 * Determines whether to create a new vote or update an existing one and applies the vote count change.
 */
export class CommentVoteStrategy implements VoteStrategy {
    /**
     * Handles a vote operation for a comment.
     *
     * @param {string} userId - ID of the user casting the vote.
     * @param {string} commentId - ID of the comment being voted on.
     * @param {string} voteType - Type of the vote (e.g., "up_vote" or "down_vote").
     * @returns {Promise<number>} The updated vote count for the comment.
     * @throws Will throw an error if the same vote has already been submitted.
     */
    async handleVote(userId: string, commentId: string, voteType: string): Promise<number> {
        let voteCount = 0;
        const existingVote = await Vote.findVote(userId, commentId, ParentType.COMMENT);


        if (existingVote) {
            if (existingVote.vote_type === voteType) {
                throw new Error(`You've already ${voteType}d this comment`);
            }
            voteCount = existingVote.vote_type === VoteType.UP_VOTE ? -2 : 2;
            await Vote.updateVoteType(existingVote, voteType);
        } else {
            voteCount = voteType === VoteType.UP_VOTE ? 1 : -1;
            await Vote.createVote(voteType, userId, commentId, ParentType.COMMENT);
        }

        const updated = await Comment.incrementVoteCount(commentId, voteCount);

        return updated?.vote_count ?? 0;
    }
}
