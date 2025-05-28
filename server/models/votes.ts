import mongoose from "mongoose";
import VoteSchema from "./schema/vote";
import {IVoteDocument, IVoteModel} from "../types/types";

/**
 * Mongoose model for handling vote documents.
 */
export const Vote = mongoose.model<IVoteDocument, IVoteModel>(
    "Vote",
    VoteSchema
);

/**
 * Finds an existing vote document for a specific user and parent entity.
 *
 * @param {string} userId - ID of the user who voted.
 * @param {string} parentId - ID of the entity being voted on.
 * @param {string} parentType - Type of the parent entity (e.g., 'question', 'answer', 'comment').
 * @returns {Promise<IVoteDocument|null>} The found vote document or null if not found.
 */
Vote.findVote = async function (userId: string, parentId: string, parentType: string): Promise<IVoteDocument | null> {
    return this.findOne({
        voted_by: userId,
        parent_id: parentId,
        parent_type: parentType
    });
};

/**
 * Updates the vote type on an existing vote document and saves it.
 *
 * @param {IVoteDocument} voteDoc - The existing vote document.
 * @param {string} newType - The new vote type to set (e.g., 'up_vote', 'down_vote').
 */
Vote.updateVoteType = async function(voteDoc: IVoteDocument, newType: string) {
    voteDoc.vote_type = newType;
    await voteDoc.save();
};

/**
 * Creates a new vote document.
 *
 * @param {string} voteType - Type of vote ('up_vote' or 'down_vote').
 * @param {string} userId - ID of the user casting the vote.
 * @param {string} parentId - ID of the entity being voted on.
 * @param {string} parentType - Type of the parent entity.
 */
Vote.createVote = async function (voteType: string, userId: string, parentId: string, parentType: string) {
    await this.create({
        vote_type: voteType,
        voted_by: userId,
        parent_id: parentId,
        parent_type: parentType
    });
};


export default Vote;
