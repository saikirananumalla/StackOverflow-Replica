import { VoteStrategy } from "./vote_strategy";
import { CommentVoteStrategy } from "./comment_vote_strategy";
import { QuestionVoteStrategy } from "./question_vote_strategy";
import { AnswerVoteStrategy } from "./answer_vote_strategy";
import {ParentType} from "../../types/enums";

/**
 * Factory function to return the appropriate VoteStrategy based on the parent type.
 *
 * @param {string} parentType - The type of the parent entity (e.g., "question", "answer", "comment").
 * @returns {VoteStrategy} An instance of the corresponding VoteStrategy implementation.
 * @throws Will throw an error if the parent type is not supported.
 */
export function getVoteStrategy(parentType: string): VoteStrategy {
    switch (parentType.toLowerCase()) {
        case ParentType.COMMENT:
            return new CommentVoteStrategy();
        case ParentType.QUESTION:
            return new QuestionVoteStrategy();
        case ParentType.ANSWER:
            return new AnswerVoteStrategy();
        default:
            throw new Error(`Unsupported parent type: ${parentType}`);
    }
}
