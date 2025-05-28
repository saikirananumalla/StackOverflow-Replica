import { VoteContext } from "../../services/voting/vote_context";
import { getVoteStrategy } from "../../services/voting/strategy_selector";
import { AnswerVoteStrategy } from "../../services/voting/answer_vote_strategy";
import { CommentVoteStrategy } from "../../services/voting/comment_vote_strategy";
import { QuestionVoteStrategy } from "../../services/voting/question_vote_strategy";
import { ParentType, VoteType } from "../../types/enums";
import Vote from "../../models/votes";
import Answer from "../../models/answers";
import Question from "../../models/questions";
import Comment from "../../models/comments";

jest.mock("../../models/votes");
jest.mock("../../models/answers");
jest.mock("../../models/questions");
jest.mock("../../models/comments");

describe("VoteContext", () => {
    it("delegates vote execution to strategy", async () => {
        const mockStrategy = {
            handleVote: jest.fn().mockResolvedValue(42),
        };
        const context = new VoteContext(mockStrategy);
        const result = await context.executeVote("user1", "id1", VoteType.UP_VOTE);
        expect(result).toBe(42);
        expect(mockStrategy.handleVote).toHaveBeenCalledWith("user1", "id1", VoteType.UP_VOTE);
    });
});

describe("getVoteStrategy", () => {
    it("returns AnswerVoteStrategy", () => {
        expect(getVoteStrategy(ParentType.ANSWER)).toBeInstanceOf(AnswerVoteStrategy);
    });
    it("returns CommentVoteStrategy", () => {
        expect(getVoteStrategy(ParentType.COMMENT)).toBeInstanceOf(CommentVoteStrategy);
    });
    it("returns QuestionVoteStrategy", () => {
        expect(getVoteStrategy(ParentType.QUESTION)).toBeInstanceOf(QuestionVoteStrategy);
    });
    it("throws error for unsupported type", () => {
        expect(() => getVoteStrategy("invalid")).toThrow("Unsupported parent type: invalid");
    });
});

describe("AnswerVoteStrategy", () => {
    const strategy = new AnswerVoteStrategy();
    const userId = "userId";
    const parentId = "parentId";

    it("creates new vote and increments count", async () => {
        (Vote.findVote as jest.Mock).mockResolvedValue(null);
        (Vote.createVote as jest.Mock).mockResolvedValue(undefined);
        (Answer.incrementVoteCount as jest.Mock).mockResolvedValue({ vote_count: 1 });
        const result = await strategy.handleVote(userId, parentId, VoteType.UP_VOTE);
        expect(result).toBe(1);
    });

    it("updates existing vote and adjusts count", async () => {
        const existing = { vote_type: VoteType.UP_VOTE };
        (Vote.findVote as jest.Mock).mockResolvedValue(existing);
        (Vote.updateVoteType as jest.Mock).mockResolvedValue(undefined);
        (Answer.incrementVoteCount as jest.Mock).mockResolvedValue({ vote_count: 2 });
        const result = await strategy.handleVote(userId, parentId, VoteType.DOWN_VOTE);
        expect(result).toBe(2);
    });

    it("throws error on duplicate vote", async () => {
        const existing = { vote_type: VoteType.UP_VOTE };
        (Vote.findVote as jest.Mock).mockResolvedValue(existing);
        await expect(strategy.handleVote(userId, parentId, VoteType.UP_VOTE)).rejects.toThrow(
            "You've already up_voted this answer"
        );
    });
});

describe("CommentVoteStrategy", () => {
    const strategy = new CommentVoteStrategy();
    const userId = "userId";
    const parentId = "parentId";
    const commentId = "comment456";

    it("creates new vote and increments count", async () => {
        (Vote.findVote as jest.Mock).mockResolvedValue(null);
        (Vote.createVote as jest.Mock).mockResolvedValue(undefined);
        (Comment.incrementVoteCount as jest.Mock).mockResolvedValue({ vote_count: 3 });
        const result = await strategy.handleVote(userId, parentId, VoteType.DOWN_VOTE);
        expect(result).toBe(3);
    });

    it("should handle up_vote with no existing vote", async () => {
        (Vote.findVote as jest.Mock).mockResolvedValue(null);
        (Vote.createVote as jest.Mock).mockResolvedValue({});
        (Comment.incrementVoteCount as jest.Mock).mockResolvedValue({ vote_count: 1 });

        const result = await strategy.handleVote(userId, commentId, VoteType.UP_VOTE);

        expect(Vote.findVote).toHaveBeenCalledWith(userId, commentId, ParentType.COMMENT);
        expect(Vote.createVote).toHaveBeenCalledWith(VoteType.UP_VOTE, userId, commentId, ParentType.COMMENT);
        expect(Comment.incrementVoteCount).toHaveBeenCalledWith(commentId, 1);
        expect(result).toBe(1);
    });

    it("should handle down_vote with no existing vote", async () => {
        (Vote.findVote as jest.Mock).mockResolvedValue(null);
        (Vote.createVote as jest.Mock).mockResolvedValue({});
        (Comment.incrementVoteCount as jest.Mock).mockResolvedValue({ vote_count: -1 });

        const result = await strategy.handleVote(userId, commentId, VoteType.DOWN_VOTE);

        expect(Vote.createVote).toHaveBeenCalledWith(VoteType.DOWN_VOTE, userId, commentId, ParentType.COMMENT);
        expect(Comment.incrementVoteCount).toHaveBeenCalledWith(commentId, -1);
        expect(result).toBe(-1);
    });

    it("updates existing vote and adjusts count", async () => {
        const existing = { vote_type: VoteType.UP_VOTE };
        (Vote.findVote as jest.Mock).mockResolvedValue(existing);
        (Vote.updateVoteType as jest.Mock).mockResolvedValue(undefined);
        (Comment.incrementVoteCount as jest.Mock).mockResolvedValue({ vote_count: 2 });
        const result = await strategy.handleVote(userId, parentId, VoteType.DOWN_VOTE);
        expect(result).toBe(2);
    });

    it("throws error on duplicate vote", async () => {
        const existing = { vote_type: VoteType.UP_VOTE };
        (Vote.findVote as jest.Mock).mockResolvedValue(existing);
        await expect(strategy.handleVote(userId, parentId, VoteType.UP_VOTE)).rejects.toThrow(
            "You've already up_voted this comment"
        );
    });
});

describe("QuestionVoteStrategy", () => {
    const strategy = new QuestionVoteStrategy();
    const userId = "userId";
    const parentId = "parentId";
    const commentId = "comment456";

    it("updates existing vote and adjusts count", async () => {
        const existing = { vote_type: VoteType.DOWN_VOTE };
        (Vote.findVote as jest.Mock).mockResolvedValue(existing);
        (Vote.updateVoteType as jest.Mock).mockResolvedValue(undefined);
        (Question.incrementVoteCount as jest.Mock).mockResolvedValue({ vote_count: 4 });
        const result = await strategy.handleVote(userId, parentId, VoteType.UP_VOTE);
        expect(result).toBe(4);
    });

    it("should handle up_vote with no existing vote", async () => {
        (Vote.findVote as jest.Mock).mockResolvedValue(null);
        (Vote.createVote as jest.Mock).mockResolvedValue({});
        (Question.incrementVoteCount as jest.Mock).mockResolvedValue({ vote_count: 1 });

        const result = await strategy.handleVote(userId, commentId, VoteType.UP_VOTE);

        expect(Vote.findVote).toHaveBeenCalledWith(userId, commentId, ParentType.QUESTION);
        expect(Vote.createVote).toHaveBeenCalledWith(VoteType.UP_VOTE, userId, commentId, ParentType.QUESTION);
        expect(Question.incrementVoteCount).toHaveBeenCalledWith(commentId, 1);
        expect(result).toBe(1);
    });

    it("updates existing vote and adjusts count", async () => {
        const existing = { vote_type: VoteType.UP_VOTE };
        (Vote.findVote as jest.Mock).mockResolvedValue(existing);
        (Vote.updateVoteType as jest.Mock).mockResolvedValue(undefined);
        (Question.incrementVoteCount as jest.Mock).mockResolvedValue({ vote_count: 2 });
        const result = await strategy.handleVote(userId, parentId, VoteType.DOWN_VOTE);
        expect(result).toBe(2);
    });

    it("throws error on duplicate vote", async () => {
        const existing = { vote_type: VoteType.UP_VOTE };
        (Vote.findVote as jest.Mock).mockResolvedValue(existing);
        await expect(strategy.handleVote(userId, parentId, VoteType.UP_VOTE)).rejects.toThrow(
            "You've already up_voted this question"
        );
    });
});