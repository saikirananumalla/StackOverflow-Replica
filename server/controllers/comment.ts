import { Request, Response } from "express";
import Comment from "../models/comments";
import { startSession, Types } from "mongoose";
import {getLogger} from "log4js";
import {ValidationUtil} from "../utils/validation-util";
import {getCommentStrategy} from "../services/commenting/strategy_selector";
import {CommentContext} from "../services/commenting/comment_context";

const Logger = getLogger("controllers/comment.ts");

/**
 * Adds a new comment to a question or an answer.
 *
 * @param req - Express request object, expects parentType/parentID in params, and comment body in request.
 * @param res - Express response object.
 * @returns JSON response containing the created comment or error.
 */
export const addComment = async (req: Request, res: Response) => {

    const session = await startSession();
    session.startTransaction();

    try {
        const parentType = req.params.parentType;
        const parentID = req.params.parentID;

        if (!ValidationUtil.validateParentId(parentID) || !ValidationUtil.validateParentType(parentType)) {
            return res.status(400).json({error: {message: "Invalid parent details"}});
        }

        const id = req.context!.id;
        const sanitizedParentId = parentID.trim();

        // Add in the comment table.
        const newComment = req.body;
        newComment.comment_by = new Types.ObjectId(id);
        newComment.comment_date_time = new Date();


        const commentResponse = await Comment.createComment(newComment);

        const strategy = getCommentStrategy(parentType);
        const context = new CommentContext(strategy);

        await context.addComment(sanitizedParentId, commentResponse);

        res.json({
            _id: commentResponse._id.toString(),
            comment_by: commentResponse.comment_by.toString(),
            text: commentResponse.text,
            vote_count: 0
        });
        Logger.info(`Successfully added comment for parent ${parentType} and ID ${parentID}`);

        await session.commitTransaction();
    }
    catch (error) {
        Logger.error(`Error while adding a comment for ${req.context?.name} - ${(error as Error).message}`);
        await session.abortTransaction();
        res.status(500).json({error: {message: "Internal Server Error"}});
    } finally {
        await session.endSession();
    }

};


/**
 * Deletes a comment from a parent entity (question/answer).
 *
 * @param req - Express request object, expects parentType, parentID, commentID in params.
 * @param res - Express response object.
 * @returns 200 OK or error response.
 */
export const deleteComment = async (req: Request, res: Response) => {

    // Need the _id of the comment, delete from the list of the parent and the DB.
    // Need the parent _id and the parent type.
    const session = await startSession();
    session.startTransaction();

    try {

        const parentType = req.params.parentType;
        const parentID = req.params.parentID;
        const commentID = req.params.commentID;
        const sanitizedCommentId = commentID.trim();

        const sanitizedParentId = parentID.trim();

        if (!ValidationUtil.validateParentId(parentID) ||
            !ValidationUtil.validateParentType(parentType) ||
            !ValidationUtil.validateCommentId(commentID)) {
            return res.status(400).json({error: {message: "Bad request - check parent details & commentID"}});
        }

        const strategy = getCommentStrategy(parentType);
        const context = new CommentContext(strategy);

        await context.deleteComment(sanitizedParentId, sanitizedCommentId);

        // Delete from the comments table.
        await Comment.deleteCommentById(sanitizedCommentId);

        await session.commitTransaction();
        Logger.info(`Successfully deleted comment for parent ${parentType} and ID ${parentID}`);
        res.status(200).json({});
    }
    catch (error) {
        Logger.error(`Error while deleting a comment for ${req.context?.name} - ${(error as Error).message}`);
        await session.abortTransaction();
        res.status(500).json({error: {message: "Internal Server Error"}});
    } finally {
        await session.endSession();
    }
};