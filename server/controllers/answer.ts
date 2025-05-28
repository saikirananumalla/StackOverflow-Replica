import { Request, Response } from "express";
import Answer from "../models/answers";
import Question from "../models/questions";
import {IAnswerDocument, IAnswerRequest} from "../types/types";
import {getLogger} from "log4js";
import {ValidationUtil} from "../utils/validation-util";
import {startSession} from "mongoose";

const Logger = getLogger("controllers/answer.ts");

/**
 * Handles adding an answer to a question.
 *
 * @param {Request} req - The request object containing the answer details.
 * @param {Response} res - The response object used to send back the created answer.
 */
export const addAnswer = async (req: Request, res: Response) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const answerReq = req.body as IAnswerRequest;
        const qid = answerReq.qid;

        const sanitizedQid = qid.trim();

       answerReq.ans.ans_date_time = new Date();
       answerReq.ans.ans_by = req.context!.id;

        if (!ValidationUtil.validateQuestionId(sanitizedQid)) {
            return res.status(400).json({error: {message: `Invalid question ID: ${qid}`}});
        }

        // Create a new answer document
        const saved: IAnswerDocument = await Answer.createAnswer(answerReq);
        const ansId = saved._id;

        Logger.info(`Created new answer with id: ${ansId} for question id: ${sanitizedQid}`);

        // Update the question document to include the new answer
        await Question.addAndPushAnswerToTop(sanitizedQid, ansId.toString());

        Logger.info(`Added answer record ${ansId} for question id ${sanitizedQid}`);
        await session.commitTransaction();

        // Send the created answer as a response
        res.json({
            _id: saved._id?.toString(),
            text: saved.text,
            ans_by: req.context!.name,
            ans_date_time: saved.ans_date_time
        });
    } catch (error) {
        await session.abortTransaction();
        Logger.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await session.endSession();
    }
};


/**
 * Deletes an answer if the user is a moderator or the original author.
 *
 * @param req - Express request object with `aid` param and `context` from session.
 * @param res - Express response object.
 * @returns JSON with deletion result or error.
 */
export const deleteAnswer = async (req: Request, res: Response) => {
    try {
        const aid = req.params.aid;
        const {id, role} = req.context!;

        const sanitizedAid = aid.trim();

        if (!ValidationUtil.validateAnswerId(sanitizedAid)) {
            return res.status(400).json({ error: { message: "Invalid answer ID format" } });
        }

        const answer = await Answer.findAnswerById(sanitizedAid);
        if (!answer) {
            Logger.error(`Answer not found for id ${sanitizedAid}`);
            return res.status(404).json({ error: { message: "Answer not found" } });

        }

        if (!(role === 'mod' || id === answer.ans_by.toString())) {

            Logger.error(`You are not authorized to delete this answer for id ${sanitizedAid}`);
            return res.status(401).json({ error: { message: "You are not authorized to delete this answer" } });
        }

        const result = await Answer.deleteAnswer(sanitizedAid);
        Logger.info(`Successfully deleted answer with id ${sanitizedAid}`);
        res.json(result);
    } catch (error) {
        Logger.error((error as Error).message);
        res.status(500).json({ error: (error as Error).message });
    }
};
