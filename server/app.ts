import express, {Express, Request, Response} from "express";
import log4js from "log4js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import session from "express-session";
import lusca from "lusca";
import swaggerUi from "swagger-ui-express";
import userRouter from "./routers/users";
import {middleware} from "express-openapi-validator";
import {sessionAuth} from "./middleware/auth";
import {inputLogging} from "./middleware/logging";
import tagRouter from "./routers/tags";
import questionRouter from "./routers/questions";
import answerRouter from "./routers/answers";
import commentRouter from "./routers/comments";
import voteRouter from "./routers/votes";
import {ServerError} from "./errors/errors";
import yaml from "yaml";
import fs from "fs";
import memorystore from "memorystore";
import path from "path";
import {CLIENT_URL, sameSiteConfig, secureConfig} from "./config";
import dotenv from "dotenv";

dotenv.config();

const MemoryStore = memorystore(session);
const openApiPath = path.join(__dirname, "openapi.yaml");
const openApiDocument = yaml.parse(fs.readFileSync(openApiPath, "utf8"));
const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

const app: Express = express();

// --- Logging ---
log4js.configure({
    appenders: {
        consoleAppender: { type: "console" },
        fileAppender: { type: "file", filename: "logs.log" },
    },
    categories: {
        default: { appenders: ["consoleAppender", "fileAppender"], level: "debug" },
    },
});

app.set("trust proxy", 1);

// --- Middleware ---
app.use(cors({
    credentials: true,
    origin: [CLIENT_URL],
}));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5000,
    message: "Too many requests from this IP, please try again later.",
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session middleware (before csurf!) ---
// TODO:change the secret to something more secure
app.use(session({
    secret: process.env.SESSION_SECRET || "fallbackSecret",
    cookie: {
        httpOnly: true,
        secure: secureConfig,
        sameSite: sameSiteConfig,
        maxAge: oneDayInMilliseconds,
    },
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
        checkPeriod: 86400000,
    }),
}));

// --- CSRF protection (must be after session, before routes) ---
if (process.env.NODE_ENV !== "test") {
    app.use(lusca.csrf());
}


// --- Swagger UI ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument, {
    customSiteTitle: "Fake Stack Overflow API Documentation",
    customCss: ".swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0 } .swagger-ui .scheme-container { display: none }",
    swaggerOptions: {
        displayRequestDuration: true,
        docExpansion: "none",
        showCommonExtensions: true,
    },
}));

app.get("/csrf-token", (req: Request, res: Response) => {
    if (process.env.NODE_ENV !== "test") {
        res.json({ csrfToken: req.csrfToken() });
    }

});

app.use("/user", userRouter);

// --- OpenAPI validator ---
app.use(middleware({
    apiSpec: openApiPath,
    validateRequests: true,
    validateResponses: true,
    formats: {
        "mongodb-id": /^[0-9a-fA-F]{24}$/,
    },
}));

app.use(sessionAuth); // Uncomment if you want to protect the below routes
app.use(inputLogging); // logging request and response
app.use("/tag", tagRouter);
app.use("/question", questionRouter);
app.use("/answer", answerRouter);
app.use("/comment", commentRouter);
app.use("/vote", voteRouter);

// General error handler
app.use((err: unknown, req: Request, res: Response) => {
    if (err instanceof ServerError) {
        console.error("Server Error:", err);
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors ?? {},
        });
    }

    console.error("Unexpected Error:", err);
    res.status(500).json({
        message: "Internal Server Error",
    });
});

export default app;