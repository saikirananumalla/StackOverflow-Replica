import express from "express";
import {voteByParentId} from "../controllers/vote";

const voteRouter = express.Router();

/**
 * @route PATCH /vote/:parentType/:parentId
 * @desc Handles voting (upvote/down_vote) for a given parent (question, answer, or comment)
 * @access Private
 */
voteRouter.patch('/:parentType/:parentId', voteByParentId);

export default voteRouter;