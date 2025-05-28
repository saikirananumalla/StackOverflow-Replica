import { CommentStrategy } from "./comment_strategy";
import Answer from "../../models/answers";
import { ICommentDocument } from "../../types/types";

/**
 * Concrete strategy for handling comments on answers.
 * Implements the CommentStrategy interface for answer-related comment operations.
 */
export class AnswerCommentStrategy implements CommentStrategy {
    /**
     * Adds a comment to the top of the comment list for a specific answer.
     *
     * @param {string} sanitizedParentId - The sanitized answer ID.
     * @param {ICommentDocument} commentResponse - The comment document to add.
     */
    async handleAddComment(sanitizedParentId: string, commentResponse: ICommentDocument): Promise<void> {
        await Answer.addAndPushCommentToTop(sanitizedParentId, commentResponse._id.toString());
    }

    /**
     * Removes a comment from the comment list of a specific answer.
     *
     * @param {string} sanitizedParentId - The sanitized answer ID.
     * @param {string} sanitizedCommentId - The sanitized comment ID to remove.
     * @returns {Promise<unknown>} A promise that resolves to the update result.
     */
    async handleDeleteComment(sanitizedParentId: string, sanitizedCommentId: string): Promise<unknown> {
        return await Answer.removeComment(sanitizedParentId, sanitizedCommentId);
    }
}
