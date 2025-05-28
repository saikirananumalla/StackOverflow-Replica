import { CommentStrategy } from "./comment_strategy";
import {ICommentDocument} from "../../types/types";

/**
 * CommentContext class is responsible for delegating comment operations
 * (add or delete) to a specific strategy based on the parent type (e.g., question or answer).
 */
export class CommentContext {
    private strategy: CommentStrategy;

    /**
     * Initializes the context with a specific comment strategy.
     *
     * @param {CommentStrategy} strategy - The initial strategy to use for comment operations.
     */
    constructor(strategy: CommentStrategy) {
        this.strategy = strategy;
    }

    /**
     * Sets or changes the current comment strategy at runtime.
     *
     * @param {CommentStrategy} strategy - The new strategy to use.
     */
    setStrategy(strategy: CommentStrategy) {
        this.strategy = strategy;
    }

    /**
     * Delegates the addition of a comment to the current strategy.
     *
     * @param {string} parentId - The ID of the parent (question or answer).
     * @param {ICommentDocument} commentResponse - The comment document to add.
     */
    async addComment(parentId: string, commentResponse: ICommentDocument) {
        return this.strategy.handleAddComment(parentId, commentResponse);
    }

    /**
     * Delegates the deletion of a comment to the current strategy.
     *
     * @param {string} parentId - The ID of the parent (question or answer).
     * @param {string} commentId - The ID of the comment to delete.
     */
    async deleteComment(parentId: string, commentId: string) {
        return this.strategy.handleDeleteComment(parentId, commentId);
    }
}