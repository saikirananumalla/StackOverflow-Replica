import express from "express";
import {getTagsWithQuestionNumber} from "../controllers/tag";

const tagRouter = express.Router();

/**
 * @route GET /tag/getTagsWithQuestionNumber
 * @desc Retrieves all tags along with the number of questions associated with each tag
 * @access Public
 */
tagRouter.get('/getTagsWithQuestionNumber', getTagsWithQuestionNumber);

export default tagRouter;