import { Types } from "mongoose";
import { getLogger } from "log4js";

const Logger = getLogger("utils/ValidationUtil");

export class ValidationUtil {
    /**
     * Validates if the parent type is allowed.
     * @param parentType - The type of the parent (question/answer/etc.)
     * @returns true if valid, false otherwise
     */
    static validateParentType(parentType: string): boolean {
        const allowedTypes = ['question', 'answer'];

        if (!allowedTypes.includes(parentType.toLowerCase())) {
            Logger.error(`Invalid parent type - ${parentType} was sent.`);
            return false;
        }

        return true;
    }

    /**
     * Validates if the parent ID is a valid Mongo ObjectId.
     * @param parentID - The ID string to validate
     * @returns true if valid, false otherwise
     */
    static validateParentId(parentID: string): boolean {
        const trimmedId = parentID.trim();

        if (!Types.ObjectId.isValid(trimmedId)) {
            Logger.error(`Invalid parent ID - ${parentID} was sent.`);
            return false;
        }

        return true;
    }

    /**
     * Validates if the comment ID is a valid Mongo ObjectId.
     * @param commentID - The ID string to validate
     * @returns true if valid, false otherwise
     */
    static validateCommentId(commentID: string): boolean {
        const trimmedId = commentID.trim();

        if (!Types.ObjectId.isValid(trimmedId)) {
            Logger.error(`Invalid comment ID - ${commentID} was sent.`);
            return false;
        }

        return true;
    }

    /**
     * Validates if the question ID is a valid Mongo ObjectId.
     * @param qid - The ID string to validate
     * @returns true if valid, false otherwise
     */
    static validateQuestionId(qid: string): boolean {
        const sanitizedQid = qid.trim();

        if (!Types.ObjectId.isValid(sanitizedQid)) {
            Logger.error(`Invalid question ID - ${qid} was sent.`);
            return false;
        }
        return true;
    }

    /**
     * Validates if the answer ID is a valid Mongo ObjectId.
     * @param aid - The ID string to validate
     * @returns true if valid, false otherwise
     */
    static validateAnswerId(aid: string): boolean {
        const sanitizedAid = aid.trim();

        if (!Types.ObjectId.isValid(sanitizedAid)) {
            Logger.error(`Invalid answer ID - ${sanitizedAid}`);
            return false;
        }

        return true;
    }


}
