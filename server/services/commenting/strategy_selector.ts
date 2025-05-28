import { CommentStrategy } from "./comment_strategy";
import { QuestionCommentStrategy } from "./question_comment_strategy";
import { AnswerCommentStrategy } from "./answer_comment_strategy";
import {ParentType} from "../../types/enums";

/**
 * Returns the appropriate CommentStrategy based on the provided parent type.
 *
 * @param {string} parentType - The type of the parent entity (e.g., "question" or "answer").
 * @returns {CommentStrategy} The strategy instance corresponding to the parent type.
 * @throws Will throw an error if the parent type is unsupported.
 */
export function getCommentStrategy(parentType: string): CommentStrategy {
    switch (parentType.toLowerCase()) {
        case ParentType.QUESTION:
            return new QuestionCommentStrategy();
        case ParentType.ANSWER:
            return new AnswerCommentStrategy();
        default:
            throw new Error(`Unsupported parent type: ${parentType}`);
    }
}
