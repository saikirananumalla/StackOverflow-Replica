import { startSession } from "mongoose";
import { Request, Response } from "express";
import {getVoteStrategy} from "../services/voting/strategy_selector";
import {VoteContext} from "../services/voting/vote_context";
import {ValidationUtil} from "../utils/validation-util";
import {getLogger} from "log4js";

const Logger = getLogger("controllers/vote.ts");

/**
 * Handles voting (upvote/downvote) on a parent entity (question, answer, comment).
 *
 * @param {Request} req - The HTTP request object containing vote info.
 * @param {Response} res - The HTTP response object returning updated vote count or error.
 * @returns {Promise<void>} A promise that resolves when the vote has been processed.
 */
export const voteByParentId = async (req: Request, res: Response) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const parentType = req.params.parentType;
        const parentId = req.params.parentId.trim();
        const voteType = req.query.vote?.toString() ?? "up_vote";
        const userId = req.context!.id;

        if (!ValidationUtil.validateParentId(parentId)) {
            return res.status(400).json({ error: { message: "Invalid parent ID format" } });
        }

        const strategy = getVoteStrategy(parentType);
        const context = new VoteContext(strategy);

        const updatedCount = await context.executeVote(userId, parentId, voteType);

        await session.commitTransaction();
        Logger.info(`Updated vote with vote_count ${updatedCount} for ${parentType}:${parentId}`);
        res.json({ vote_count: updatedCount });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ error: { message: (error as Error).message } });
    } finally {
        await session.endSession();
    }
};