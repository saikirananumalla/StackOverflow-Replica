import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import Comment from "../models/comments";
import Question from "../models/questions";
import { IUserDB } from "../scripts/script_types";
import {NextFunction, Request, Response} from "express";
import TestAgent from "supertest/lib/agent";

const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn()
};

jest.spyOn(mongoose, 'startSession').mockResolvedValue(mockSession as unknown as mongoose.ClientSession);
jest.mock("../models/comments");
jest.mock("../models/questions");
jest.mock("../models/answers");
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

const mockUser = {
    _id: new mongoose.Types.ObjectId("65e9b58910afe6e94fc6e6dc"),
    name: "dummy",
    email: "dummy@dummy.com",
    password: "SuperSecret",
    role: "user"
} satisfies IUserDB;

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

describe("Comment Routes", () => {
    describe("POST /comment/addComment/:parentType/:parentID", () => {
        it("adds a comment to a question", async () => {
            const comment = { text: "New comment" };
            const createdComment = { ...comment, _id: new mongoose.Types.ObjectId(), comment_by: mockUser._id, vote_count: 0 };

            (Comment.createComment as jest.Mock).mockResolvedValue(createdComment);
            (Question.findOneAndUpdate as jest.Mock).mockResolvedValue({});

            const response = await agent
                .post("/comment/addComment/question/65e9b58910afe6e94fc6e6dc")
                .send(comment);

            expect(response.status).toBe(200);
            expect(response.body.text).toBe("New comment");
        });

        it("returns 400 for invalid parentType", async () => {
            const response = await agent
                .post("/comment/addComment/invalid/65e9b58910afe6e94fc6e6dc")
                .send({ text: "Invalid" });

            expect(response.status).toBe(400);
        });

        it("returns 400 for invalid parent ID format", async () => {
            const response = await agent
                .post("/comment/addComment/question/invalid_id")
                .send({ text: "Invalid Parent ID" });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: { message: "Invalid parent details" } });
        });


        it("returns 500 if Comment.createComment throws an error", async () => {
            (Comment.createComment as jest.Mock).mockImplementation(() => {
                throw new Error("Unexpected error during comment creation");
            });

            const response = await agent
                .post("/comment/addComment/question/65e9b58910afe6e94fc6e6dc")
                .send({ text: "This will fail" });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: { message: "Internal Server Error" } });
        });

    });

    describe("DELETE /comment/deleteCommentById/:parentType/:parentID/comment/:commentID", () => {
        it("deletes a comment from a question", async () => {
            (Comment.deleteCommentById as jest.Mock).mockResolvedValue({});
            (Question.findOneAndUpdate as jest.Mock).mockResolvedValue({});

            const response = await agent
                .delete("/comment/deleteCommentById/question/65e9b58910afe6e94fc6e6dc/comment/507f191e810c19729de860ea");

            expect(response.status).toBe(200);
        });

        it("returns 400 for invalid comment ID", async () => {
            const response = await agent
                .delete("/comment/deleteCommentById/question/65e9b58910afe6e94fc6e6dc/comment/invalid");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: { message: "Bad request - check parent details & commentID" } });
        });

        it("returns 500 if deleteCommentById throws an error", async () => {
            (Comment.deleteCommentById as jest.Mock).mockImplementation(() => {
                throw new Error("Unexpected error during deletion");
            });

            const response = await agent
                .delete("/comment/deleteCommentById/question/65e9b58910afe6e94fc6e6dc/comment/507f191e810c19729de860ea");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: { message: "Internal Server Error" } });
        });

    });
});
