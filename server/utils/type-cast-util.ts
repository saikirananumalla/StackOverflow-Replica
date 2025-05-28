import {
    IAnswer,
    IAnswerDocument, IComment, ICommentDocument,
    IQuestion,
    IQuestionDocument,
    ITag, IUser,
    IUserDocument
} from "../types/types";
import {ITagDB} from "../scripts/script_types";
import mongoose from "mongoose";

/**
 * Maps an array of IQuestionDocument objects to an array of IQuestion objects.
 * @param {IQuestionDocument[]} questions - Array of question documents.
 * @returns Array of mapped question objects.
 */
export function mapIQuestionDocumentToIQuestion(questions: IQuestionDocument[]): IQuestion[] {
    const result: IQuestion[] = []

    for (const question of questions) {
        result.push({
            _id: question._id.toString(),
            answers: mapIAnswerDocumentToIAnswer(question.answers),
            ask_date_time: question.ask_date_time,
            asked_by: (question.asked_by as IUserDocument).name,
            vote_count: question.vote_count,
            tags: mapITagDBToITag(question.tags),
            text: question.text,
            title: question.title,
            views: question.views
        });
    }
    return result;
}

/**
 * Maps an array of ITagDB objects to an array of ITag objects.
 * @param {ITagDB[]} tags - Array of tag database objects.
 * @returns {ITag[]} Array of mapped tag objects.
 */
export function mapITagDBToITag(tags: ITagDB[]): ITag[] {
    const result: ITag[] = [];

    for (const tag of tags) {
        result.push({
            _id: tag._id?.toString(),
            name: tag.name,
        });
    }
    return result;
}

/**
 * Maps an array of answer document references (ObjectId or IAnswerDocument)
 * to an array of IAnswer objects, ensuring they are sorted by date.
 * @param {mongoose.Types.Array<mongoose.Types.ObjectId | IAnswerDocument>} answers - Array of answer references.
 * @returns {IAnswer[]} Array of mapped answer objects.
 */
export function mapIAnswerDocumentToIAnswer(answers: mongoose.Types.Array<mongoose.Types.ObjectId | IAnswerDocument>): IAnswer[] {
    const result: IAnswer[] = [];
    const answerDocs = answers as IAnswerDocument[];

    if (!answers) {
        return [];
    }

    for (const answer of answerDocs) {

        result.push({
            _id: answer._id?.toString(),
            text: answer.text,
            ans_by: (answer.ans_by as IUserDocument)?.name,
            ans_date_time: answer.ans_date_time,
            comments: mapICommentDocumentToIComment(answer.comments),
            vote_count: answer.vote_count
        });
    }

    if (result) {
        result.sort((a, b) => b?.ans_date_time?.getTime() - a?.ans_date_time?.getTime());
    }
    return result;
}

/**
 * Maps an array of comment document references (ObjectId or ICommentDocument)
 * to an array of IComment objects, ensuring they are sorted by date.
 * @param {mongoose.Types.Array<mongoose.Types.ObjectId | ICommentDocument>} comments - Array of comment references.
 * @returns {IComment[]} Array of mapped comment objects.
 */
export function mapICommentDocumentToIComment(comments: mongoose.Types.Array<mongoose.Types.ObjectId | ICommentDocument>): IComment[] {
    const result: IComment[] = [];
    const commentDocs = comments as ICommentDocument[];

    if (!comments) {
        return [];
    }

    for (const comment of commentDocs) {

        result.push({
            _id: comment._id?.toString(),
            text: comment.text,
            comment_by: (comment.comment_by as IUserDocument)?.name,
            comment_date_time: comment.comment_date_time,
            vote_count: comment.vote_count
        });
    }

    console.log(result);

    if (result) {
        result.sort((a, b) => b?.comment_date_time.getTime() - a?.comment_date_time.getTime());
    }
    return result;
}

/**
 * Converts a user document into an `IUser` object.
 *
 * @param {IUserDocument} userDoc - The user document.
 * @returns {IUser} The converted user.
 */
export function convertToIUser(userDoc: IUserDocument | null): IUser | null {
    if (!userDoc) {return null;}
    return {
        _id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        password: userDoc.password,
        role: userDoc.role
    }
}