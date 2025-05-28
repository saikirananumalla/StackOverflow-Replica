import {CommentStrategy} from "./comment_strategy";
import Question from "../../models/questions";
import {ICommentDocument} from "../../types/types";

/**
 * Strategy implementation for handling comments on questions.
 * Implements logic to add or delete a comment from a question.
 */
export class QuestionCommentStrategy implements CommentStrategy {
    /**
     * Adds a comment to the top of the question's comment list.
     *
     * @param {string} sanitizedParentId - The sanitized ID of the question.
     * @param {ICommentDocument} commentResponse - The comment document to be added.
     */
    async handleAddComment(sanitizedParentId: string, commentResponse: ICommentDocument) {
        await Question.addAndPushCommentToTop(sanitizedParentId, commentResponse._id.toString());
    }

    /**
     * Removes a comment from the question's comment list.
     *
     * @param {string} sanitizedParentId - The sanitized ID of the question.
     * @param {string} sanitizedCommentId - The sanitized ID of the comment to delete.
     */
    async handleDeleteComment(sanitizedParentId: string, sanitizedCommentId: string): Promise<unknown> {
        return await Question.removeComment(sanitizedParentId, sanitizedCommentId);
    }

}
