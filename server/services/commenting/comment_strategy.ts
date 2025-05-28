import { ICommentDocument } from "../../types/types";

/**
 * Interface representing a strategy for handling comment operations
 * for different parent types (e.g., Question, Answer).
 */
export interface CommentStrategy {
    /**
     * Handles the logic for adding a comment to a parent (question or answer).
     *
     * @param {string} sanitizedParentId - The sanitized ID of the parent.
     * @param {ICommentDocument} commentResponse - The comment document to be added.
     * @returns {Promise<void>} A promise that resolves when the comment is added.
     */
    handleAddComment(sanitizedParentId: string, commentResponse: ICommentDocument): Promise<void>;

    /**
     * Handles the logic for deleting a comment from a parent (question or answer).
     *
     * @param {string} sanitizedParentId - The sanitized ID of the parent.
     * @param {string} sanitizedCommentId - The sanitized ID of the comment to delete.
     * @returns {Promise<unknown>} A promise that resolves with the result of the deletion operation.
     */
    handleDeleteComment(sanitizedParentId: string, sanitizedCommentId: string): Promise<unknown>;
}