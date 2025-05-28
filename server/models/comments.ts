import mongoose from "mongoose";
import CommentSchema from "./schema/comment";
import {ICommentDocument, ICommentModel} from "../types/types";

/**
 * Mongoose model for handling Comment documents.
 */
export const Comment = mongoose.model<ICommentDocument, ICommentModel>(
    "Comment",
    CommentSchema
);

/**
 * Pre-hook to delete associated votes when a single comment is deleted.
 */
CommentSchema.pre('findOneAndDelete', { document: false, query: true }, async function(next) {
    try {
        // Delete associated votes
        const comment = await this.model.findOne(this.getFilter());
        console.log(comment);

        if (!comment) {
            // If the answer is not found, exit the pre-hook
            console.log("comment not found");
            return new Error("Comment not found");
        }

        await mongoose.model('Vote').deleteMany({parent_id: comment._id, parent_type: 'comment'});
        next();

    } catch (err) {
        next(err as Error);
    }
});

/**
 * Pre-hook to delete associated votes when multiple comments are deleted.
 */
CommentSchema.pre('deleteMany', { document: false, query: true }, async function(next) {
    try {
        // Find comments being deleted
        const comments = await this.model.find(this.getFilter());

        // Extract IDs of comments being deleted
        const commentIds = comments.map(comment => comment._id);

        // Delete associated votes for comments
        await mongoose.model('Vote').deleteMany({parent_id: {$in: commentIds}, parent_type: 'comment'});

        next();
    } catch (err) {
        next(err as Error);
    }
});

/**
 * Increments the vote count for a specific comment.
 *
 * @param {string} commentId - The ID of the comment.
 * @param {number} count - The increment value (+1 or -1).
 * @returns {Promise<ICommentDocument | null>} Updated comment document or null.
 */
Comment.incrementVoteCount = function(commentId: string, count: number): Promise<ICommentDocument | null> {
    return this.findOneAndUpdate(
        { _id: commentId },
        { $inc: { vote_count: count } },
        { new: true }
    );
};

/**
 * Creates a new comment document.
 *
 * @param {Partial<ICommentDocument>} commentData - The data to create the comment with.
 */
Comment.createComment = function(commentData:  Partial<ICommentDocument>) {
    return this.create(commentData);
};

/**
 * Deletes a comment by its ID.
 *
 * @param {string} commentId - The ID of the comment to delete.
 */
Comment.deleteCommentById = function(commentId: string) {
    return this.findOneAndDelete({ _id: commentId });
};


export default Comment;
