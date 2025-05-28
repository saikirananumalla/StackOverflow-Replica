/**
 * Enum representing the two types of votes that can be cast.
 * - `UP_VOTE`: Represents an upvote.
 * - `DOWN_VOTE`: Represents a down_vote.
 */
export enum VoteType {
    UP_VOTE = "up_vote",
    DOWN_VOTE = "down_vote",
}

/**
 * Enum representing the types of parent entities a vote can be associated with.
 * - `QUESTION`: Vote is associated with a question.
 * - `ANSWER`: Vote is associated with an answer.
 * - `COMMENT`: Vote is associated with a comment.
 */
export enum ParentType {
    QUESTION = "question",
    ANSWER = "answer",
    COMMENT = "comment",
}