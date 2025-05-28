import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import Answer from "../models/answers";
import Question from "../models/questions";
import Vote from "../models/votes";
import { Request, Response, NextFunction } from "express";
import TestAgent from "supertest/lib/agent";

const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn()
};

jest.spyOn(mongoose, 'startSession').mockResolvedValue(mockSession as unknown as mongoose.ClientSession);
jest.mock("../models/answers");
jest.mock("../models/votes");
jest.mock("../models/questions");

jest.mock("../middleware/auth", () => ({
    sessionAuth: jest.fn((req, res, next) => {
        req.context = {
            id: "65e9b58910afe6e94fc6e6dc",
            name: "dummy",
            role: "user"
        };
        next();
    })
}));

jest.mock("../middleware/logging", () => ({
    inputLogging: jest.fn((req, res, next) => next())
}));

jest.mock("lusca", () => ({
    csrf: () => (req: Request, res: Response, next: NextFunction) => {
        req.csrfToken = () => "mocked_csrf_token";
        next();
    }
}));

let agent: TestAgent;

beforeAll(async () => {
    agent = request.agent(app);
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Answer Routes", () => {
    describe("POST /answer/addAnswer", () => {
        it("adds an answer successfully", async () => {
            const answerPayload = {
                qid: "65e9b58910afe6e94fc6e6dc",
                ans: { text: "New Answer" }
            };

            const createdAnswer = {
                _id: new mongoose.Types.ObjectId(),
                text: "New Answer",
                ans_date_time: new Date()
            };

            (Answer.createAnswer as jest.Mock).mockResolvedValue(createdAnswer);
            (Question.addAndPushAnswerToTop as jest.Mock).mockResolvedValue({});

            const response = await agent
                .post("/answer/addAnswer")
                .send(answerPayload);

            expect(response.status).toBe(200);
            expect(response.body.text).toBe("New Answer");
        });

        it("returns 400 for invalid question ID", async () => {
            const answerPayload = {
                qid: "invalidId",
                ans: { text: "Invalid" }
            };

            const response = await agent
                .post("/answer/addAnswer")
                .send(answerPayload);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: { message: "Invalid question ID: invalidId" } });
        });

        it("returns 500 if an unexpected error occurs while adding an answer", async () => {
            const answerPayload = {
                qid: "65e9b58910afe6e94fc6e6dc",
                ans: { text: "Some Answer" }
            };

            (Answer.createAnswer as jest.Mock).mockImplementation(() => {
                throw new Error("Database failure");
            });

            const response = await agent
                .post("/answer/addAnswer")
                .send(answerPayload);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server Error" });
        });

    });

    describe("PATCH /vote/answer/:parentId", () => {
        it("votes successfully on an answer", async () => {
            const voteResult = 4;

            (Vote.findVote as jest.Mock).mockResolvedValue(null);
            (Vote.createVote as jest.Mock).mockResolvedValue(undefined);
            (Answer.incrementVoteCount as jest.Mock).mockResolvedValue({ vote_count: voteResult });

            const response = await agent
                .patch("/vote/answer/65e9b58910afe6e94fc6e6dc")
                .query({ vote: "down_vote" });

            expect(response.status).toBe(200);
            expect(response.body.vote_count).toEqual(voteResult);
        });

        it("returns 400 for invalid answer ID format", async () => {
            const response = await agent
                .patch("/vote/answer/invalidId")
                .query({ vote: "up_vote" });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: { message: "Invalid parent ID format" } });
        });

        it("returns 409 for duplicate vote", async () => {
            (Vote.findVote as jest.Mock).mockResolvedValue({ vote_type: "up_vote" });

            const response = await agent
                .patch("/vote/answer/65e9b58910afe6e94fc6e6dc")
                .query({ vote: "up_vote" });

            expect(response.body).toEqual({ error: { message: "You've already up_voted this answer" } });
            expect(response.status).toBe(500);
        });

        it("returns 500 for generic error", async () => {
            (Vote.findVote as jest.Mock).mockImplementation(() => {
                throw new Error("Generic Error");
            });

            const response = await agent
                .patch("/vote/answer/65e9b58910afe6e94fc6e6dc")
                .query({ vote: "down_vote" });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: { message: "Generic Error" } });
        });
    });

    describe("DELETE /answer/deleteAnswerById/:aid", () => {
        it("returns 400 for invalid answer ID format", async () => {
            const response = await agent
                .delete("/answer/deleteAnswerById/invalid_id")
            expect(response.status).toBe(400);
        });

        it("returns 404 if answer not found", async () => {
            (Answer.findAnswerById as jest.Mock).mockResolvedValue(null);

            const response = await agent
                .delete("/answer/deleteAnswerById/65e9b58910afe6e94fc6e6dd");

            expect(response.status).toBe(404);
            expect(response.text).toContain("Answer not found");
        });

        it("returns 401 if user is unauthorized", async () => {
            const answerMock = {
                ans_by: new mongoose.Types.ObjectId("111111111111111111111111")
            };

            (Answer.findAnswerById as jest.Mock).mockResolvedValue(answerMock);

            const response = await agent
                .delete("/answer/deleteAnswerById/65e9b58910afe6e94fc6e6dc");

            expect(response.text).toContain("You are not authorized");
            expect(response.status).toBe(401);
        });

        it("successfully deletes an answer", async () => {
            const answerMock = {
                ans_by: new mongoose.Types.ObjectId("65e9b58910afe6e94fc6e6dc")
            };

            (Answer.findAnswerById as jest.Mock).mockResolvedValue(answerMock);
            (Answer.deleteAnswer as jest.Mock).mockResolvedValue({ acknowledged: true, deletedCount: 1 });

            const response = await agent
                .delete("/answer/deleteAnswerById/65e9b58910afe6e94fc6e6dc");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ acknowledged: true, deletedCount: 1 });
        });

        it("returns 500 if error is thrown", async () => {
            (Answer.findAnswerById as jest.Mock).mockImplementation(() => {
                throw new Error("Unexpected error");
            });

            const response = await agent
                .delete("/answer/deleteAnswerById/65e9b58910afe6e94fc6e6dc");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Unexpected error"});
        });
    });

});
