import { CommentContext } from "../../services/commenting/comment_context";
import { QuestionCommentStrategy } from "../../services/commenting/question_comment_strategy";
import { AnswerCommentStrategy } from "../../services/commenting/answer_comment_strategy";
import { getCommentStrategy } from "../../services/commenting/strategy_selector";
import Question from "../../models/questions";
import Answer from "../../models/answers";
import { ICommentDocument } from "../../types/types";

jest.mock("../../models/questions");
jest.mock("../../models/answers");

const mockComment = {
    _id: { toString: () => "comment123" },
    text: "Sample Comment",
} as unknown as ICommentDocument;

describe("Comment Strategies", () => {
    describe("QuestionCommentStrategy", () => {
        const strategy = new QuestionCommentStrategy();

        it("adds comment to a question", async () => {
            await strategy.handleAddComment("qid123", mockComment);
            expect(Question.addAndPushCommentToTop).toHaveBeenCalledWith("qid123", "comment123");
        });

        it("deletes comment from a question", async () => {
            await strategy.handleDeleteComment("qid123", "comment123");
            expect(Question.removeComment).toHaveBeenCalledWith("qid123", "comment123");
        });
    });

    describe("AnswerCommentStrategy", () => {
        const strategy = new AnswerCommentStrategy();

        it("adds comment to an answer", async () => {
            await strategy.handleAddComment("aid123", mockComment);
            expect(Answer.addAndPushCommentToTop).toHaveBeenCalledWith("aid123", "comment123");
        });

        it("deletes comment from an answer", async () => {
            await strategy.handleDeleteComment("aid123", "comment123");
            expect(Answer.removeComment).toHaveBeenCalledWith("aid123", "comment123");
        });
    });
});

describe("CommentContext", () => {
    const mockStrategy = {
        handleAddComment: jest.fn(),
        handleDeleteComment: jest.fn(),
    };

    const context = new CommentContext(mockStrategy);

    it("calls addComment via strategy", async () => {
        await context.addComment("parentId", mockComment);
        expect(mockStrategy.handleAddComment).toHaveBeenCalledWith("parentId", mockComment);
    });

    it("calls deleteComment via strategy", async () => {
        await context.deleteComment("parentId", "commentId");
        expect(mockStrategy.handleDeleteComment).toHaveBeenCalledWith("parentId", "commentId");
    });

    it("updates strategy via setStrategy", async () => {
        const newStrategy = {
            handleAddComment: jest.fn(),
            handleDeleteComment: jest.fn(),
        };
        context.setStrategy(newStrategy);
        await context.addComment("newId", mockComment);
        expect(newStrategy.handleAddComment).toHaveBeenCalled();
    });
});

describe("getCommentStrategy", () => {
    it("returns QuestionCommentStrategy for 'question'", () => {
        const strategy = getCommentStrategy("question");
        expect(strategy).toBeInstanceOf(QuestionCommentStrategy);
    });

    it("returns AnswerCommentStrategy for 'answer'", () => {
        const strategy = getCommentStrategy("answer");
        expect(strategy).toBeInstanceOf(AnswerCommentStrategy);
    });

    it("throws error for invalid parentType", () => {
        expect(() => getCommentStrategy("invalid")).toThrow("Unsupported parent type: invalid");
    });
});