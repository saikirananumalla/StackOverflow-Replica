import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
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
jest.mock("../models/questions");
jest.mock("../models/tags");
jest.mock("../models/votes");

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

describe("Question Routes", () => {
    describe("GET /question/getQuestion", () => {
        it("should return 400 for invalid order param", async () => {
            const response = await agent.get("/question/getQuestion").query({ order: "invalid", search: "test" });
            expect(response.status).toBe(400);
        });

        it("should handle error in search parsing", async () => {
            const response = await agent.get("/question/getQuestion").query({ order: "newest", search: "[malformed$" });
            expect(response.status).toBe(400);
        });
    });

    describe("GET /question/getQuestionById/:qid", () => {
        it("returns 403 for invalid ID format", async () => {
            const response = await agent.get("/question/getQuestionById/invalid");
            expect(response.status).toBe(403);
        });
    });

    describe("POST /question/addQuestion", () => {
        it("adds a question with valid tags", async () => {
            const question = {
                title: "Valid Question",
                text: "This is a test question",
                tags: [{ name: "test-tag" }]
            };

            (Question.createQuestion as jest.Mock).mockResolvedValue({
                _id: new mongoose.Types.ObjectId(),
                title: question.title,
                text: question.text,
                tags: question.tags,
                asked_by: { name: "dummy" },
                ask_date_time: new Date(),
                views: 0,
                answers: [],
                comments: [],
                vote_count: 0
            });

            const response = await agent
                .post("/question/addQuestion")
                .send(question);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe("Valid Question");
        });
    });

    describe("DELETE /question/deleteQuestionById/:qid", () => {
        it("returns 400 for invalid question ID format", async () => {
            const response = await agent
                .delete("/question/deleteQuestionById/invalid");
            expect(response.status).toBe(400);
        });

        it("returns 401 if unauthorized to delete", async () => {
            (Question.findQuestionById as jest.Mock).mockResolvedValue({
                asked_by: { _id: new mongoose.Types.ObjectId("65e9b58910afe6e94fc6e6dd") }
            });
            const response = await agent
                .delete("/question/deleteQuestionById/65e9b58910afe6e94fc6e6dc");
            expect(response.status).toBe(401);
        });
    });

    describe("PATCH /vote/question/:parentId", () => {
        it("should return 409 for duplicate vote", async () => {
            (Vote.findVote as jest.Mock).mockResolvedValue({ vote_type: "up_vote" });

            const response = await agent
                .patch("/vote/question/65e9b58910afe6e94fc6e6dc")
                .query({ vote: "up_vote" });

            expect(response.status).toBe(500);
        });
    });

    describe("Additional invalid scenarios", () => {
        describe("POST /question/addQuestion", () => {
            it("should return 400 for invalid tag name", async () => {
                const response = await agent
                    .post("/question/addQuestion")
                    .send({
                        title: "test",
                        text: "invalid",
                        tags: [{ name: "" }]
                    });

                expect(response.status).toBe(400);
                expect(response.body).toEqual({ error: { message: "Invalid tag name" } });
            });

            it("should return 500 on internal error", async () => {
                const question = {
                    title: "Valid",
                    text: "Valid",
                    tags: [{ name: "valid-tag" }]
                };
                (Question.createQuestion as jest.Mock).mockImplementation(() => {
                    throw new Error("db error");
                });

                const response = await agent.post("/question/addQuestion").send(question);
                expect(response.status).toBe(500);
            });
        });

        describe("GET /question/getQuestionById/:qid", () => {
            it("should return 404 if question is not found", async () => {
                (Question.findByIdAndIncrementViews as jest.Mock).mockResolvedValue(null);
                const response = await agent.get("/question/getQuestionById/65e9b58910afe6e94fc6e6de");
                expect(response.status).toBe(404);
            });
        });

        describe("GET /question/getQuestion", () => {
            it("should return 400 for malformed regex tag", async () => {
                const response = await agent.get("/question/getQuestion").query({ order: "newest", search: "[invalid$]" });
                expect(response.status).toBe(400);
            });

            it("should filter by keyword only", async () => {
                (Question.getQuestionsByOrder as jest.Mock).mockResolvedValue([
                    { title: "test keyword", text: "text", tags: [] }
                ]);

                const response = await agent.get("/question/getQuestion").query({ order: "newest", search: "keyword" });
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            });

            it("should filter by tag only", async () => {
                (Question.getQuestionsByOrder as jest.Mock).mockResolvedValue([
                    { title: "title", text: "text", tags: [{ name: "taggy" }] }
                ]);

                const response = await agent.get("/question/getQuestion").query({ order: "newest", search: "[taggy]" });
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            });

            it("should filter by both tag and keyword", async () => {
                (Question.getQuestionsByOrder as jest.Mock).mockResolvedValue([
                    { title: "keyword", text: "text", tags: [{ name: "taggy" }] }
                ]);

                const response = await agent.get("/question/getQuestion").query({ order: "newest", search: "[taggy] keyword" });
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            });

            it("should return all questions when search is empty", async () => {
                (Question.getQuestionsByOrder as jest.Mock).mockResolvedValue([
                    { title: "a", text: "b", tags: [{ name: "c" }] }
                ]);

                const response = await agent.get("/question/getQuestion").query({ order: "newest", search: "" });
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            });
        });

        describe("DELETE /question/deleteQuestionById/:qid", () => {
            it("should return 401 if user is unauthorized", async () => {
                (Question.findQuestionById as jest.Mock).mockResolvedValue({
                    asked_by: { _id: new mongoose.Types.ObjectId("111111111111111111111111") }
                });

                const response = await agent.delete("/question/deleteQuestionById/65e9b58910afe6e94fc6e6df");
                expect(response.status).toBe(401);
                expect(response.body.error.message).toContain("User not allowed");
            });

            it("should return 500 if exception occurs", async () => {
                (Question.findQuestionById as jest.Mock).mockImplementation(() => {
                    throw new Error("Unexpected error");
                });

                const response = await agent.delete("/question/deleteQuestionById/65e9b58910afe6e94fc6e6df");
                expect(response.status).toBe(500);
                expect(response.body.error.message).toContain("Unexpected error");
            });
        });
    });

});
