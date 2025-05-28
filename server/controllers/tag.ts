import Question from "../models/questions";
import Tag from "../models/tags";
import { Request, Response } from 'express';
import { IQuestionDocument, ITagDocument, ITagCount } from "../types/types";
import {getLogger} from "log4js";

const Logger = getLogger("controllers/tag.ts");

/**
 * Retrieves all tags along with the number of questions associated with each tag.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send back the list of tags with question counts.
 */
export const getTagsWithQuestionNumber = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch all questions and populate their tags
        const questions: IQuestionDocument[] = await Question.getQuestionsWithTags();
        console.log(questions);

        // Fetch all tags
        const tags: ITagDocument[] = await Tag.getAllTags();

        const result: ITagCount[] = [];

        // Count the number of questions associated with each tag
        for (const tag of tags) {
            let count = 0;
            for (const question of questions) {
                const tNames = question.tags.map(tg => tg.name.toLowerCase());
                if (tNames.indexOf(tag.name.toLowerCase()) !== -1) {
                    count++;
                }
            }
            result.push({ name: tag.name, qcnt: count });
        }

        Logger.info("Success getting tags and their questions");

        // Send the result as a JSON response
        res.json(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
