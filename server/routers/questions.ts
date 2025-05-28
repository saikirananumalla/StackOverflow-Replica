import express from "express";
import {addQuestion, deleteQuestion, getQuestion, getQuestionById} from "../controllers/question";

const questionRouter = express.Router();

/**
 * @route POST /question/addQuestion
 * @desc Adds a new question with title, text, and tags
 * @access Protected
 */
questionRouter.post('/addQuestion', addQuestion);

/**
 * @route GET /question/getQuestionById/:qid
 * @desc Retrieves a specific question by its ID and increments view count
 * @access Public
 * @param {string} qid - ID of the question
 */
questionRouter.get('/getQuestionById/:qid', getQuestionById);

/**
 * @route GET /question/getQuestion
 * @desc Retrieves all questions filtered by order and search keyword/tag
 * @access Public
 * @query {string} order - 'newest' | 'unanswered' | 'active'
 * @query {string} search - optional keywords or [tag]
 */
questionRouter.get('/getQuestion', getQuestion);

/**
 * @route DELETE /question/deleteQuestionById/:qid
 * @desc Deletes a question if the user is a moderator or the author
 * @access Protected
 * @param {string} qid - ID of the question
 */
questionRouter.delete('/deleteQuestionById/:qid', deleteQuestion);

export default questionRouter;