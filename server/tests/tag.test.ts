import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import Tag from "../models/tags";
import Question from "../models/questions";
import { Request, Response, NextFunction } from "express";
import TestAgent from "supertest/lib/agent";

jest.mock("../models/tags");
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

const mockTags = [
    { name: "tag1" },
    { name: "tag2" }
];

const mockQuestions = [
    { tags: [mockTags[0], mockTags[1]] },
    { tags: [mockTags[0]] }
];

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

describe("GET /tag/getTagsWithQuestionNumber", () => {

    it("should return tags with question counts", async () => {
        (Question.getQuestionsWithTags as jest.Mock).mockResolvedValue(mockQuestions);
        (Tag.getAllTags as jest.Mock).mockResolvedValue(mockTags);

        const response = await agent.get("/tag/getTagsWithQuestionNumber");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { name: "tag1", qcnt: 2 },
            { name: "tag2", qcnt: 1 }
        ]);

        expect(Tag.getAllTags).toHaveBeenCalled();
        expect(Question.getQuestionsWithTags).toHaveBeenCalled();
    });

    it("should return 500 on internal error", async () => {
        (Question.getQuestionsWithTags as jest.Mock).mockRejectedValue(new Error("DB Error"));
        const response = await agent.get("/tag/getTagsWithQuestionNumber");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Internal Server Error" });
    });
});
