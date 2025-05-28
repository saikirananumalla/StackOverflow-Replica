import express from "express";
import {addComment, deleteComment} from "../controllers/comment";

const commentRouter = express.Router();

/**
 * @route POST /comment/addComment/:parentType/:parentID
 * @desc Adds a comment to either a question or an answer
 * @access Protected
 * @param {string} parentType - Type of parent ('question' or 'answer')
 * @param {string} parentID - ID of the parent entity
 */
commentRouter.post('/addComment/:parentType/:parentID', addComment);

/**
 * @route DELETE /comment/deleteCommentById/:parentType/:parentID/comment/:commentID
 * @desc Deletes a comment from either a question or an answer
 * @access Protected
 * @param {string} parentType - Type of parent ('question' or 'answer')
 * @param {string} parentID - ID of the parent entity
 * @param {string} commentID - ID of the comment to delete
 */
commentRouter.delete('/deleteCommentById/:parentType/:parentID/comment/:commentID', deleteComment);

export default commentRouter;