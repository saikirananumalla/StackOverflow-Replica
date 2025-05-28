import express from "express";
import { addAnswer, deleteAnswer } from "../controllers/answer";

const answerRouter = express.Router();

/**
 * @route POST /answer/addAnswer
 * @desc Adds a new answer to a question
 * @access Protected
 */
answerRouter.post("/addAnswer", addAnswer);

/**
 * @route DELETE /answer/deleteAnswerById/:aid
 * @desc Deletes an answer by ID
 * @access Protected
 */
answerRouter.delete("/deleteAnswerById/:aid", deleteAnswer);

export default answerRouter;
