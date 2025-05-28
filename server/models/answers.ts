import mongoose from "mongoose";
import {IAnswerDocument, IAnswerModel, IAnswerRequest} from "../types/types";
import AnswerSchema from "./schema/answer";
import {IAnswerDB} from "../scripts/script_types";

/**
 * Mongoose model for handling answer documents.
 */
const Answer = mongoose.model<IAnswerDocument, IAnswerModel>(
    "Answer",
    AnswerSchema
);

/**
 * Middleware hook to handle cascading delete of associated votes and comments
 * when a single answer is deleted.
 */
AnswerSchema.pre('deleteOne', {document: false, query: true}, async function (next) {
    try {
        const answer = await this.model.findOne(this.getFilter());
        if (!answer) {
            // If the answer is not found, exit the pre-hook
            console.log("Answer not found");
            return new Error("Answer not found");
        }

        // Delete associated votes

        await mongoose.model('Vote').deleteMany({parent_id: answer._id, parent_type: 'answer'});

        // Delete associated comments
        await mongoose.model('Comment').deleteMany({_id: {$in: answer.comments}});

        next();
    } catch (err) {
        next(err as Error);
    }
});

/**
 * Middleware hook to handle cascading delete of associated votes and comments
 * when multiple answers are deleted at once.
 */
AnswerSchema.pre('deleteMany', { document: false, query: true }, async function(next) {
    try {
        // Find answers being deleted
        const answers = await this.model.find(this.getFilter());

        // Extract IDs of answers being deleted
        const answerIds = answers.map(answer => answer._id);

        const allCommentIds = answers.map(answer => answer.comments).reduce((acc, curr) => acc.concat(curr), []);

        // Delete associated votes for comments
        await mongoose.model('Comment').deleteMany({_id: {$in: allCommentIds}});

        await mongoose.model('Vote').deleteMany({parent_id: {$in: answerIds}, parent_type: 'answer'});

        next();
    } catch (err) {
        next(err as Error);
    }
});

/**
 * Retrieves the most recent answer from a given list of answer IDs.
 *
 * @param {mongoose.Types.ObjectId[]} answers - The list of answer IDs to search within.
 * @returns {Promise<IAnswerDocument[]>} A promise that resolves to an array containing the most recent answer.
 */
Answer.getMostRecent = async function (answers: mongoose.Types.ObjectId[]): Promise<IAnswerDocument[]> {
    return this.find({_id: {$in: answers}})
        .sort({ans_date_time: -1})
        .limit(1);
};

/**
 * Retrieves the latest answer date from a given list of answer objects.
 *
 * @param {IAnswerDB[]} answers - The list of answer objects containing timestamps.
 * @returns {Date} The latest answer date or the epoch date (January 1, 1970) if no answers are found.
 */
Answer.getLatestAnswerDate = function (answers: IAnswerDB[]): Date {
    let result = answers;

    // Sort answers by descending timestamp
    result = result.sort((a, b) => b.ans_date_time.getTime() - a.ans_date_time.getTime());

    // Return the latest answer's timestamp or a default value
    return result.length > 0 ? result[0].ans_date_time : new Date(0);
};

/**
 * Increments vote count for a specific answer.
 *
 * @param {string} answerId - Answer ID.
 * @param {number} count - Number to increment by.
 * @returns {Promise<IAnswerDocument | null>} Updated answer doc or null.
 */
Answer.incrementVoteCount = function(answerId: string, count: number): Promise<IAnswerDocument | null> {
    return this.findOneAndUpdate(
        { _id: answerId },
        { $inc: { vote_count: count } },
        { new: true }
    );
};

/**
 * Adds a comment to the top of the comment list of an answer.
 *
 * @param {string} answerId - Answer ID.
 * @param {string} commentId - Comment ID to add.
 * @returns {Promise<IAnswerDocument | null>} Updated answer document.
 */
Answer.addAndPushCommentToTop = function(answerId: string, commentId: string): Promise<IAnswerDocument | null> {
    return this.findOneAndUpdate(
        { _id: answerId },
        { $push: { comments: { $each: [commentId], $position: 0 } } },
        { new: true }
    );
};

/**
 * Removes a comment from an answer.
 *
 * @param {string} answerId - Answer ID.
 * @param {string} commentId - Comment ID to remove.
 * @returns {Promise<unknown>} Result of the update.
 */
Answer.removeComment = function(answerId: string, commentId: string): Promise<unknown> {
    return this.findOneAndUpdate(
        { _id: answerId },
        { $pull: { comments: commentId } },
        { new: true }
    );
};

/**
 * Creates a new answer.
 *
 * @param {IAnswerRequest} answerData - Object containing answer content and question ID.
 * @returns {Promise<IAnswerDocument>} The created answer document.
 */
Answer.createAnswer = function(answerData: IAnswerRequest): Promise<IAnswerDocument> {
    return this.create(answerData.ans);
};

/**
 * Deletes an answer by ID.
 *
 * @param {string} answerId - Answer ID to delete.
 * @returns {Promise<mongoose.DeleteResult>} Result of deletion.
 */
Answer.deleteAnswer = async function(answerId: string) {
    return this.deleteOne({_id: answerId});
}

/**
 * Finds an answer by ID.
 *
 * @param {string} answerId - ID of the answer to retrieve.
 * @returns {Promise<IAnswerDocument | null>} Found answer document or null.
 */
Answer.findAnswerById = function(answerId: string) : Promise<IAnswerDocument | null> {
    return this.findOne({_id: answerId});
}

export default Answer;
