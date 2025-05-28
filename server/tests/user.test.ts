import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import bcrypt from "bcrypt";
import User from "../models/users";
import { Request, Response, NextFunction } from "express";
import TestAgent from "supertest/lib/agent";

jest.mock("bcrypt");
jest.mock("../models/users");

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

describe("POST /user/register", () => {
    it("registers a new user", async () => {
        const newUser = {
            name: "testuser",
            email: "test@example.com",
            password: "testpassword"
        };

        const hashedPassword = await bcrypt.hash(newUser.password, 12);
        const user = { ...newUser, password: hashedPassword };

        (User.getUserByName as jest.Mock).mockResolvedValueOnce(null);
        (User.create as jest.Mock).mockResolvedValueOnce(user);

        const response = await agent.post("/user/register").send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Successfully registered." });
    });

    it("returns 400 for missing name", async () => {
        const response = await agent.post("/user/register").send({
            email: "test@example.com",
            password: "testpassword"
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: { message: "Invalid details, please check your input" } });
    });

    it("returns 400 for missing email", async () => {
        const response = await agent.post("/user/register").send({
            name: "testuser",
            password: "testpassword"
        });

        expect(response.status).toBe(400);
    });

    it("returns 400 for invalid email format", async () => {
        const response = await agent.post("/user/register").send({
            name: "testuser",
            email: "invalidemail",
            password: "testpassword"
        });

        expect(response.status).toBe(400);
    });

    it("returns 400 for short password", async () => {
        const response = await agent.post("/user/register").send({
            name: "testuser",
            email: "test@example.com",
            password: "123"
        });

        expect(response.status).toBe(400);
    });

    it("returns 400 for duplicate username", async () => {
        (User.getUserByName as jest.Mock).mockResolvedValueOnce({ name: "testuser" });

        const response = await agent.post("/user/register").send({
            name: "testuser",
            email: "test@example.com",
            password: "testpassword"
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: { message: "username not available" } });
    });
});

describe("POST /user/login", () => {
    it("logs in user with correct credentials", async () => {
        const user = {
            _id: "testuserid",
            name: "testuser",
            email: "test@example.com",
            password: "hashedpassword",
            role: "user"
        };

        (User.getUserByName as jest.Mock).mockResolvedValueOnce(user);
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

        const response = await agent.post("/user/login").send({
            username: user.name,
            password: "password"
        });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            name: user.name,
            role: user.role,
            email: user.email,
            message: "You are now logged in."
        });
    });

    it("returns 400 for missing username", async () => {
        const response = await agent.post("/user/login").send({ password: "testpassword" });

        expect(response.status).toBe(400);
    });

    it("returns 400 for missing password", async () => {
        const response = await agent.post("/user/login").send({ username: "testuser" });

        expect(response.status).toBe(400);
    });

    it("returns 404 for non-existing username", async () => {
        (User.getUserByName as jest.Mock).mockResolvedValueOnce(null);

        const response = await agent.post("/user/login").send({
            username: "nonexistent",
            password: "password"
        });

        expect(response.status).toBe(404);
    });

    it("returns 403 for incorrect password", async () => {
        (User.getUserByName as jest.Mock).mockResolvedValueOnce({
            name: "testuser",
            password: "hashedpassword"
        });
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

        const response = await agent.post("/user/login").send({
            username: "testuser",
            password: "wrongpassword"
        });

        expect(response.status).toBe(403);
    });
});

describe("GET /user/getUser", () => {
    it("returns user details", async () => {
        const user = { name: "testuser", email: "test@example.com", role: "user" };
        (User.getUserByName as jest.Mock).mockResolvedValueOnce(user);

        const response = await agent.get("/user/getUser");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(user);
    });
});