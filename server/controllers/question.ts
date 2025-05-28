import { Request, Response } from "express";
import Question from "../models/questions";
import { IQuestion, IQuestionReq, ITag } from "../types/types";
import Tag from "../models/tags";
import {startSession} from "mongoose";
import {getLogger} from "log4js";
import {ValidationUtil} from "../utils/validation-util";

const Logger = getLogger("controllers/question.ts");

/**
 * Adds a new question to the database after validating the tags.
 *
 * @param {Request} req - The request object containing the question details.
 * @param {Response} res - The response object used to send back the created question.
 */
export const addQuestion = async (req: Request, res: Response) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const {id, name} = req.context!;
        const question = req.body as IQuestionReq;

        const tagsList = question.tags;
        const regex = /(\w+-?\w+)\s?/;

        for (const tag of tagsList) {
            if (!regex.test(tag.name)) {
                Logger.error(`Invalid tag name - ${tag} was sent.`);
                return res.status(400).json({error: {message: "Invalid tag name"}});
            }
        }

        question.asked_by = id;
        question.ask_date_time = new Date();

        // Extract tag names and find or create them in the database
        const tagNames = question.tags.map(tag => tag.name);
        question.tags = await Tag.findOrCreateMany(tagNames);

        // Create a new question document
        const newQuestion = await Question.createQuestion(question);
        const tags: ITag[] = newQuestion.tags.map(tag => ({
            _id: tag._id?.toString(),
            name: tag.name,
        }));

        Logger.info(`Added question under user name ${name}`);

        // Send the created question as a response
        res.json({
            answers: [],
            comments: [],
            vote_count: 0,
            views: 0,
            _id: newQuestion._id?.toString(),
            tags: tags,
            asked_by: name,
            ask_date_time: newQuestion.ask_date_time,
            text: newQuestion.text,
            title: newQuestion.title,
        });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Retrieves a question by its ID and increments its view count.
 *
 * @param {Request} req - The request object containing the question ID as a parameter.
 * @param {Response} res - The response object used to send back the retrieved question.
 */
export const getQuestionById = async (req: Request, res: Response) => {
    try {
        const qid = req.params.qid;

        if (!ValidationUtil.validateQuestionId(qid)) {
            return res.status(403).json({error: {message: "Invalid question ID format"}});
        }

        const result = await Question.findByIdAndIncrementViews(qid.trim());

        if (!result) {
            return res.status(404).json({ error: {message: "Question not found"}});
        }
        Logger.info(`Fetched question for question ID ${qid.trim()}`);
        res.json(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({});
    }
};

/**
 * Retrieves questions based on order and search criteria.
 *
 * @param {Request} req - The request object containing order and search query parameters.
 * @param {Response} res - The response object used to send back the filtered list of questions.
 */
export const getQuestion = async (req: Request, res: Response) => {
    try {
        const { order, search } = req.query;
        let orderFilter: string = order === undefined ? "newest" : order as string;
        const searchFilter: string = search === undefined ? "" : search as string;

        orderFilter = orderFilter.toLowerCase();

        if (!(order === 'newest' || order === 'unanswered' || order === 'active')) {
            Logger.error(`Invalid order type - ${order} was sent.`);
            return res.status(400).json({error: {message: "Invalid order type"}});
        }

        const questionsInOrder = await getQuestionsByOrder(orderFilter);

        let filteredQuestionsList;
        try {
            filteredQuestionsList = filterQuestionsBySearch(questionsInOrder, searchFilter.trim());
        } catch (error) {
            Logger.error(`Invalid search string - ${search} was sent.` + (error as Error).message);
            return res.status(400).json({error: {message: "Invalid search string"}});
        }

        Logger.info(`Fetched questions for order ${order} and search ${search}`);

        res.json(filteredQuestionsList);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Deletes a question if the user is authorized (mod or owner).
 *
 * @param req - The request object containing question ID and user context.
 * @param res - The response object returning status of deletion.
 */
export const deleteQuestion = async (req: Request, res: Response) => {

    const session = await startSession();
    session.startTransaction();

    try {

        // get user and question details.
        const {id, role, name} = req.context!;
        const qid = req.params.qid;
        const sanitizedQid = qid.trim();

        if (!ValidationUtil.validateQuestionId(sanitizedQid)) {
            return res.status(400).json({error: {message: "Invalid question ID format"}});
        }

        const question = await Question.findQuestionById(sanitizedQid);

        // authorize appropriately, check if the user is a mod or if the user is the one who
        // asked the particular question.
        if (!(role === 'mod' || id === question?.asked_by._id.toString())) {
            Logger.error(`User ${req.context!.name} does not have permission to delete question.`);
            return res.status(401)
                .json({error: {message: "User not allowed to delete the question"}});
        } else {
            // auth successful, delete the question.
            const deletedQuestionResponse = await Question.deleteQuestion(sanitizedQid);
            res.json(deletedQuestionResponse);
        }
        Logger.info(`Deleted question under user name ${name}, question ID ${sanitizedQid}`);
        await session.commitTransaction();

    } catch (error) {
        Logger.error(
            `Error while deleting question for user ${req.context!.name} - ${(error as Error).message}`);
        await session.abortTransaction();
        res.status(500).json({error: {message: (error as Error).message}});
    } finally {
        await session.endSession();
    }

};

/**
 * Retrieves questions based on the specified ordering criteria.
 *
 * @param {string} order - The ordering criteria (e.g., "newest", "unanswered", "active").
 * @returns {Promise<IQuestion[]>} A promise that resolves to an array of questions.
 */
const getQuestionsByOrder = async (order: string): Promise<IQuestion[]> => {
    return Question.getQuestionsByOrder(order);
};

/**
 * Filters a list of questions based on search criteria.
 *
 * @param {IQuestion[]} qList - The list of questions to filter.
 * @param {string} search - The search string containing keywords or tags.
 * @returns {IQuestion[]} The filtered list of questions.
 */
const filterQuestionsBySearch = (qList: IQuestion[], search: string): IQuestion[] => {
    const searchTags = parseTags(search);
    const searchKeyword = parseKeyword(search);

    const regex = /\w+/g;
    for (const tag of searchTags) {
        if (!regex.test(tag)) {
            throw Error("Invalid tag name");
        }
    }
    for (const key of searchKeyword) {
        if (!regex.test(key)) {
            throw Error("Invalid keyword");
        }
    }

    return qList.filter((q) => {
        if (searchKeyword.length === 0 && searchTags.length === 0) {
            return true;
        } else if (searchKeyword.length === 0) {
            return checkQuestionForTags(q, searchTags);
        } else if (searchTags.length === 0) {
            return checkQuestionForKeywords(q, searchKeyword);
        } else {
            return (
                checkQuestionForKeywords(q, searchKeyword) ||
                checkQuestionForTags(q, searchTags)
            );
        }
    });
};

/**
 * Checks if a question contains any of the specified keywords.
 *
 * @param {IQuestion} q - The question to check.
 * @param {string[]} wordlist - The list of keywords to search for.
 * @returns {boolean} `true` if the question contains any of the keywords, otherwise `false`.
 */
const checkQuestionForKeywords = (q: IQuestion, wordlist: string[]): boolean => {
    for (const w of wordlist) {
        if (q.title.toLowerCase().includes(w.toLowerCase()) ||
            q.text.toLowerCase().includes(w.toLowerCase())) {
            return true;
        }
    }
    return false;
};

/**
 * Checks if a question contains any of the specified tags.
 *
 * @param {IQuestion} q - The question to check.
 * @param {string[]} tags - The list of tags to search for.
 * @returns {boolean} `true` if the question contains any of the tags, otherwise `false`.
 */
const checkQuestionForTags = (q: IQuestion, tags: string[]): boolean => {
    for (const tag of tags) {
        for (const qTag of q.tags) {
            if (tag.toLowerCase() === qTag.name.toLowerCase()) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Extracts tag names from a search string.
 *
 * @param {string} search - The search string containing tags in square brackets.
 * @returns {string[]} The extracted tag names.
 */
const parseTags = (search: string): string[] => {
    return (search.match(/\[([^\]]+)\]/g) || []).map((word) =>
        word.slice(1, -1)
    );
};

/**
 * Extracts keywords from a search string, excluding tag-based searches.
 *
 * @param {string} search - The search string.
 * @returns {string[]} The extracted keywords.
 */
const parseKeyword = (search: string): string[] => {
    return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
};

